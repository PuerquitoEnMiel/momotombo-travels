import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(
    userId: string,
    data: {
      activityId: string;
      date: Date;
      guests: number;
      totalPrice: number;
    },
  ) {
    // En una app real, aquí validaríamos disponibilidad
    return this.prisma.booking.create({
      data: {
        userId,
        activityId: data.activityId,
        date: data.date,
        totalPrice: data.totalPrice,
        status: 'PENDING',
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id, userId },
      include: {
        activity: {
          include: { destination: true },
        },
      },
    });

    if (!booking) throw new NotFoundException('Reserva no encontrada');
    return booking;
  }
}
