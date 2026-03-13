import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { BookingStatus, PaymentProvider, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async createPaymentIntent(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId, status: BookingStatus.PENDING },
    });
    if (!booking) throw new NotFoundException('Booking not found or already paid');

    // In production: const stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY'));
    // const intent = await stripe.paymentIntents.create({
    //   amount: Math.round(booking.totalFjd * 100), // cents
    //   currency: 'fjd',
    //   metadata: { bookingId, userId },
    // });

    // Dev stub — returns a mock client secret
    const mockIntentId = `pi_mock_${Date.now()}`;

    await this.prisma.payment.upsert({
      where: { bookingId },
      update: { providerRef: mockIntentId },
      create: {
        bookingId,
        provider: PaymentProvider.STRIPE,
        providerRef: mockIntentId,
        amountFjd: booking.totalFjd,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      clientSecret: `${mockIntentId}_secret_mock`,
      amount: booking.totalFjd,
      currency: 'FJD',
      bookingId,
    };
  }

  async confirmPayment(bookingId: string, providerRef: string) {
    // Called by Stripe webhook in production
    return this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { bookingId },
        data: { status: PaymentStatus.PAID, paidAt: new Date(), providerRef },
      });

      const booking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CONFIRMED },
        include: { experience: { include: { village: true } }, user: true },
      });

      await tx.auditLog.create({
        data: {
          userId: booking.userId,
          action: 'payment.confirmed',
          entityType: 'payment',
          entityId: bookingId,
          metadata: { providerRef, amountFjd: booking.totalFjd },
        },
      });

      return booking;
    });
  }
}
