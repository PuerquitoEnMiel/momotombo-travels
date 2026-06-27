import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class ItinerariesService {
  constructor(private prisma: PrismaService) {}

  async getUserItineraries(userId: string) {
    return this.prisma.itinerary.findMany({
      where: { userId },
      include: {
        days: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getItineraryById(id: string, userId: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id, userId },
      include: {
        days: {
          include: {
            items: {
              include: { activity: true },
            },
          },
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    if (!itinerary) throw new NotFoundException('Itinerario no encontrado');
    return itinerary;
  }

  async createItinerary(
    userId: string,
    data: { title: string; startDate: Date; endDate: Date },
  ) {
    return this.prisma.itinerary.create({
      data: {
        userId,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
  }

  async reorderItems(
    userId: string,
    itineraryId: string,
    items: { id: string; itineraryDayId: string }[],
  ) {
    // Verifica si el itinerario pertenece al usuario
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id: itineraryId, userId },
    });

    if (!itinerary) throw new NotFoundException('Itinerario no encontrado');

    // Actualiza cada item con su nuevo dia (columna en dnd)
    for (const item of items) {
      await this.prisma.itineraryItem.update({
        where: { id: item.id },
        data: { itineraryDayId: item.itineraryDayId },
      });
    }

    return { success: true };
  }
}
