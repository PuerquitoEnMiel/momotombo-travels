import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(
    userId: string,
    data: {
      activityId: string;
      date: Date;
      guests: number;
    },
  ) {
    // Server-side price calculation
    const activity = await this.prisma.activity.findUnique({
      where: { id: data.activityId },
      select: { id: true, price: true, maxCapacity: true, isActive: true },
    });
    if (!activity || !activity.isActive) {
      throw new NotFoundException('Activity not found or no longer available');
    }

    const unitPrice = activity.price ?? 0;
    const totalPrice = unitPrice * data.guests;

    // Capacity check
    const sameDateBookings = await this.prisma.booking.aggregate({
      where: {
        activityId: data.activityId,
        date: data.date,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      _sum: { guests: true },
    });
    const alreadyBooked = sameDateBookings._sum.guests ?? 0;
    if (alreadyBooked + data.guests > activity.maxCapacity) {
      throw new BadRequestException('Not enough capacity for this date');
    }

    return this.prisma.booking.create({
      data: {
        userId,
        activityId: data.activityId,
        date: data.date,
        guests: data.guests,
        totalPrice,
        status: 'PENDING',
        confirmationCode: this.generateConfirmationCode(),
      },
    });
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        activity: {
          include: {
            destination: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            stripePaymentIntentId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: {
        activity: {
          include: { destination: true },
        },
        payments: true,
      },
    });

    if (!booking) throw new NotFoundException('Reserva no encontrada');
    return booking;
  }

  async cancelBooking(bookingId: string, userId: string, reason?: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw new BadRequestException(
        `Cannot cancel booking in status ${booking.status}`,
      );
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
      },
    });
  }

  async markPaid(
    bookingId: string,
    stripePaymentIntentId: string,
    stripeChargeId?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          stripePaymentIntentId,
          stripeChargeId,
        },
      });

      await tx.payment.upsert({
        where: { stripePaymentIntentId },
        create: {
          userId: booking.userId,
          bookingId: booking.id,
          amount: booking.totalPrice,
          currency: booking.currency,
          status: 'SUCCEEDED',
          stripePaymentIntentId,
          stripeChargeId,
        },
        update: {
          status: 'SUCCEEDED',
          stripeChargeId,
        },
      });

      return booking;
    });
  }

  private generateConfirmationCode(): string {
    // 8-char alphanumeric (uppercase, no ambiguous chars)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
