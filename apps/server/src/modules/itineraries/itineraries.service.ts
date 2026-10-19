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
            items: {
              orderBy: { position: 'asc' },
            },
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
              orderBy: { position: 'asc' },
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
    items: { id: string; itineraryDayId: string; position?: number }[],
  ) {
    // Verifica si el itinerario pertenece al usuario
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id: itineraryId, userId },
    });

    if (!itinerary) throw new NotFoundException('Itinerario no encontrado');

    // Verifica que cada item y cada dia destino pertenezcan a este itinerario
    // (evita que se muevan items ajenos o a dias de otro itinerario)
    const itemIds = [...new Set(items.map((item) => item.id))];
    const dayIds = [...new Set(items.map((item) => item.itineraryDayId))];

    const [dbItems, dbDays] = await Promise.all([
      this.prisma.itineraryItem.findMany({
        where: { id: { in: itemIds } },
        select: { id: true, day: { select: { itineraryId: true } } },
      }),
      this.prisma.itineraryDay.findMany({
        where: { id: { in: dayIds } },
        select: { id: true, itineraryId: true },
      }),
    ]);

    const itemIdsInItinerary = new Set(
      dbItems
        .filter((item) => item.day.itineraryId === itineraryId)
        .map((item) => item.id),
    );
    const dayIdsInItinerary = new Set(
      dbDays
        .filter((day) => day.itineraryId === itineraryId)
        .map((day) => day.id),
    );

    const allValid =
      itemIds.every((id) => itemIdsInItinerary.has(id)) &&
      dayIds.every((id) => dayIdsInItinerary.has(id));

    if (!allValid) throw new NotFoundException('Itinerario no encontrado');

    // Actualiza cada item con su nuevo dia y posicion de forma atomica.
    // El orden del array define la posicion dentro de cada dia.
    const positionByItem = new Map<string, number>();
    const perDayCount = new Map<string, number>();
    for (const item of items) {
      const next = perDayCount.get(item.itineraryDayId) ?? 0;
      positionByItem.set(
        item.id,
        typeof item.position === 'number' ? item.position : next,
      );
      perDayCount.set(item.itineraryDayId, next + 1);
    }

    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.itineraryItem.update({
          where: { id: item.id },
          data: {
            itineraryDayId: item.itineraryDayId,
            position: positionByItem.get(item.id) ?? 0,
          },
        }),
      ),
    );

    return { success: true };
  }
}
