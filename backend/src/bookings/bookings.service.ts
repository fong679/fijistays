import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

const PLATFORM_FEE_RATE = 0.13; // 13%

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    // 1. Load experience + village
    const experience = await this.prisma.experience.findUnique({
      where: { id: dto.experienceId, isActive: true },
      include: { village: { include: { protocols: { include: { protocol: true } } } } },
    });
    if (!experience) throw new NotFoundException('Experience not found');

    // 2. Check mandatory protocol acknowledgments
    const mandatoryProtocols = experience.village.protocols
      .filter((vp) => vp.protocol.isMandatory)
      .map((vp) => vp.protocolId);

    const missingAcks = mandatoryProtocols.filter(
      (pid) => !dto.protocolAcks?.includes(pid),
    );
    if (missingAcks.length > 0) {
      throw new BadRequestException(
        `You must acknowledge all mandatory cultural protocols before booking.`,
      );
    }

    // 3. Check guest count doesn't exceed max
    if (dto.guestCount > experience.maxGuests) {
      throw new BadRequestException(
        `Maximum ${experience.maxGuests} guests allowed for this experience.`,
      );
    }

    // 4. Optimistic locking — prevent double booking
    const availability = await this.prisma.availability.findUnique({
      where: {
        experienceId_date: {
          experienceId: dto.experienceId,
          date: new Date(dto.bookingDate),
        },
      },
    });

    if (!availability || availability.isClosed) {
      throw new BadRequestException('This date is not available.');
    }

    const spotsRemaining = availability.spotsTotal - availability.spotsBooked;
    if (spotsRemaining < dto.guestCount) {
      throw new BadRequestException(
        `Only ${spotsRemaining} spot(s) remaining on this date.`,
      );
    }

    // 5. Transactional booking + availability update with version check
    const totalFjd = experience.pricePerPerson * dto.guestCount;
    const platformFeeFjd = +(totalFjd * PLATFORM_FEE_RATE).toFixed(2);
    const villagePayout = +(totalFjd - platformFeeFjd).toFixed(2);

    try {
      const booking = await this.prisma.$transaction(async (tx) => {
        // Optimistic lock: update only if version matches
        const updated = await tx.availability.updateMany({
          where: {
            id: availability.id,
            version: availability.version, // version check
          },
          data: {
            spotsBooked: { increment: dto.guestCount },
            version: { increment: 1 },
          },
        });

        if (updated.count === 0) {
          throw new ConflictException(
            'This slot was just booked by someone else. Please try again.',
          );
        }

        // Create booking
        const newBooking = await tx.booking.create({
          data: {
            userId,
            experienceId: dto.experienceId,
            bookingDate: new Date(dto.bookingDate),
            guestCount: dto.guestCount,
            totalFjd,
            platformFeeFjd,
            villagePayout,
            specialRequests: dto.specialRequests,
            status: BookingStatus.PENDING,
            protocolAcks: {
              create: (dto.protocolAcks || []).map((pid) => ({ protocolId: pid })),
            },
          },
          include: {
            experience: { include: { village: true } },
            protocolAcks: true,
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            userId,
            action: 'booking.created',
            entityType: 'booking',
            entityId: newBooking.id,
            metadata: { totalFjd, guestCount: dto.guestCount, experienceId: dto.experienceId },
          },
        });

        return newBooking;
      });

      return booking;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException('Failed to create booking. Please try again.');
    }
  }

  async findAllForUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        experience: { include: { village: true, images: { where: { isPrimary: true } } } },
        payment: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: {
        experience: {
          include: {
            village: { include: { protocols: { include: { protocol: true } } } },
            images: true,
          },
        },
        payment: true,
        review: true,
        protocolAcks: { include: { protocol: true } },
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async cancel(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: { experience: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    // Check cancellation window (24 hours before)
    const bookingDateTime = new Date(booking.bookingDate);
    const now = new Date();
    const hoursUntil = (bookingDateTime.getTime() - now.getTime()) / 3600000;
    if (hoursUntil < 24) {
      throw new BadRequestException('Cancellations must be made at least 24 hours in advance');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.CANCELLED },
      });

      // Release the spot back
      await tx.availability.updateMany({
        where: {
          experienceId: booking.experienceId,
          date: booking.bookingDate,
        },
        data: { spotsBooked: { decrement: booking.guestCount } },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'booking.cancelled',
          entityType: 'booking',
          entityId: id,
          metadata: { reason: 'user_cancelled' },
        },
      });

      return updated;
    });
  }
}
