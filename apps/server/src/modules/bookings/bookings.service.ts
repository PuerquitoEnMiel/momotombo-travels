import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomInt } from 'crypto';
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
    if (!Number.isInteger(data.guests) || data.guests < 1) {
      throw new BadRequestException('guests must be a positive integer');
    }

    // Server-side price calculation
    const activity = await this.prisma.activity.findUnique({
      where: { id: data.activityId },
      select: { id: true, price: true, maxCapacity: true, isActive: true },
    });
    if (!activity || !activity.isActive) {
      throw new NotFoundException('Activity not found or no longer available');
    }

    const unitPrice = activity.price?.toNumber() ?? 0;
    const totalPrice = unitPrice * data.guests;

    // Normalize to a UTC date-only bucket so the same calendar day cannot be
    // split into two buckets by timezone offsets, and reject past dates.
    const bookingDate = this.normalizeDate(data.date);

    // Capacity check + insert must be atomic or two concurrent requests
    // both pass the aggregate and overbook the activity.
    return this.prisma.$transaction(
      async (tx) => {
        const sameDateBookings = await tx.booking.aggregate({
          where: {
            activityId: data.activityId,
            date: bookingDate,
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          _sum: { guests: true },
        });
        const alreadyBooked = sameDateBookings._sum.guests ?? 0;
        if (alreadyBooked + data.guests > activity.maxCapacity) {
          throw new BadRequestException('Not enough capacity for this date');
        }

        // Retry on the (rare) confirmationCode unique collision
        for (let attempt = 0; ; attempt++) {
          try {
            return await tx.booking.create({
              data: {
                userId,
                activityId: data.activityId,
                date: bookingDate,
                guests: data.guests,
                totalPrice,
                status: 'PENDING',
                confirmationCode: this.generateConfirmationCode(),
              },
            });
          } catch (err) {
            if (
              err instanceof Prisma.PrismaClientKnownRequestError &&
              err.code === 'P2002' &&
              attempt < 3
            ) {
              continue;
            }
            throw err;
          }
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
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

  async applyCoupon(bookingId: string, couponId: string, discount: number) {
    // Applies a validated coupon to a PENDING booking: stores the discount
    // and lowers the payable total atomically.
    const updated = await this.prisma.booking.updateMany({
      where: { id: bookingId, status: 'PENDING', couponId: null },
      data: {
        couponId,
        discountAmount: discount,
        totalPrice: { decrement: discount },
      },
    });
    if (updated.count === 0) {
      throw new BadRequestException('Coupon cannot be applied to this booking');
    }
    return this.prisma.booking.findUnique({ where: { id: bookingId } });
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
      // Only PENDING bookings can be confirmed. This makes the webhook
      // idempotent and prevents late events from resurrecting
      // CANCELLED / EXPIRED / REFUNDED bookings.
      const claimed = await tx.booking.updateMany({
        where: { id: bookingId, status: 'PENDING' },
        data: {
          status: 'CONFIRMED',
          stripePaymentIntentId,
          stripeChargeId,
        },
      });

      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new NotFoundException('Reserva no encontrada');

      if (claimed.count === 0) {
        // Already processed (or terminal) — do not overwrite, just report.
        return booking;
      }

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

  private normalizeDate(date: Date): Date {
    const normalized = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
    const today = new Date();
    const todayUtc = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );
    if (normalized.getTime() < todayUtc) {
      throw new BadRequestException('Booking date cannot be in the past');
    }
    return normalized;
  }

  private generateConfirmationCode(): string {
    // 8-char alphanumeric (uppercase, no ambiguous chars), CSPRNG-based
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars[randomInt(chars.length)];
    }
    return result;
  }
}
