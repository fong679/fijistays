// experiences.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExperienceDto) {
    // Verify the village belongs to this host
    const village = await this.prisma.village.findFirst({
      where: { id: dto.villageId, hostId: userId },
    });
    if (!village) throw new ForbiddenException('Village not found or not owned by you');

    return this.prisma.experience.create({
      data: dto,
      include: { village: true },
    });
  }

  async findAll(filters?: { type?: string; islandGroup?: string; maxPrice?: number }) {
    return this.prisma.experience.findMany({
      where: {
        isActive: true,
        village: { isActive: true, isVerified: true },
        ...(filters?.type && { type: filters.type as any }),
        ...(filters?.maxPrice && { pricePerPerson: { lte: filters.maxPrice } }),
      },
      include: {
        village: {
          select: { id: true, name: true, islandGroup: true, island: true, latitude: true, longitude: true },
        },
        images: { where: { isPrimary: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const exp = await this.prisma.experience.findUnique({
      where: { id, isActive: true },
      include: {
        village: {
          include: {
            protocols: { include: { protocol: true } },
            images: { where: { isPrimary: true } },
          },
        },
        images: true,
        availability: {
          where: { date: { gte: new Date() }, isClosed: false },
          orderBy: { date: 'asc' },
          take: 60,
        },
      },
    });
    if (!exp) throw new NotFoundException('Experience not found');
    return exp;
  }

  async seedAvailability(experienceId: string, hostId: string) {
    // Auto-generate 90 days of availability
    const exp = await this.prisma.experience.findFirst({
      where: { id: experienceId, village: { hostId } },
    });
    if (!exp) throw new ForbiddenException('Not your experience');

    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({ experienceId, date: d, spotsTotal: exp.maxGuests });
    }

    await this.prisma.availability.createMany({ data: dates, skipDuplicates: true });
    return { created: dates.length };
  }
}
