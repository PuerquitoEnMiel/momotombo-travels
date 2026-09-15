import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'node:crypto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class ItinerarySharingService {
  constructor(private readonly prisma: PrismaService) {}

  async shareItinerary(
    ownerId: string,
    itineraryId: string,
    options: {
      visibility?: 'private' | 'link' | 'public';
      expiresAt?: Date;
    } = {},
  ) {
    const itinerary = await this.prisma.itinerary.findFirst({
      where: { id: itineraryId, userId: ownerId },
      select: { id: true },
    });
    if (!itinerary) throw new NotFoundException('Itinerary not found');

    const shareSlug = this.generateSlug();
    return this.prisma.itineraryShare.create({
      data: {
        itineraryId,
        shareSlug,
        visibility: options.visibility ?? 'link',
        expiresAt: options.expiresAt,
      },
    });
  }

  async getBySlug(slug: string) {
    const share = await this.prisma.itineraryShare.findUnique({
      where: { shareSlug: slug },
      include: {
        itinerary: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile: { select: { avatarUrl: true } },
              },
            },
            days: {
              orderBy: { dayNumber: 'asc' },
              include: {
                items: {
                  orderBy: { startTime: 'asc' },
                  include: {
                    activity: {
                      include: {
                        destination: { select: { name: true, slug: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!share) throw new NotFoundException('Share link not found');
    if (share.expiresAt && share.expiresAt < new Date()) {
      throw new ForbiddenException('Share link has expired');
    }
    if (share.visibility === 'private') {
      throw new ForbiddenException('Share link is private');
    }

    // Increment view count (fire and forget)
    void this.prisma.itineraryShare
      .update({
        where: { id: share.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => undefined);

    return share;
  }

  async revokeShare(ownerId: string, shareId: string) {
    const share = await this.prisma.itineraryShare.findUnique({
      where: { id: shareId },
      include: { itinerary: { select: { userId: true } } },
    });
    if (!share) throw new NotFoundException('Share not found');
    if (share.itinerary.userId !== ownerId) {
      throw new ForbiddenException('Not the owner');
    }
    await this.prisma.itineraryShare.delete({ where: { id: shareId } });
    return { success: true };
  }

  async forkItinerary(forkerId: string, sourceSlug: string) {
    const source = await this.prisma.itineraryShare.findUnique({
      where: { shareSlug: sourceSlug },
      include: {
        itinerary: {
          include: {
            days: {
              include: {
                items: true,
              },
            },
          },
        },
      },
    });
    if (!source) throw new NotFoundException('Source itinerary not found');
    if (source.expiresAt && source.expiresAt < new Date()) {
      throw new ForbiddenException('Source link has expired');
    }

    return this.prisma.itinerary.create({
      data: {
        userId: forkerId,
        title: `${source.itinerary.title} (Fork)`,
        description: source.itinerary.description,
        startDate: source.itinerary.startDate,
        endDate: source.itinerary.endDate,
        forkedFromId: source.itineraryId,
        days: {
          create: source.itinerary.days.map((day) => ({
            dayNumber: day.dayNumber,
            date: day.date,
            items: {
              create: day.items.map((item) => ({
                customTitle: item.customTitle,
                activityId: item.activityId,
                startTime: item.startTime,
                endTime: item.endTime,
                notes: item.notes,
              })),
            },
          })),
        },
      },
      include: { days: { include: { items: true } } },
    });
  }

  async inviteCollaborator(
    ownerId: string,
    itineraryId: string,
    collaboratorId: string,
    role: 'VIEWER' | 'EDITOR' | 'CO_OWNER',
  ) {
    const itinerary = await this.prisma.itinerary.findFirst({
      where: { id: itineraryId, userId: ownerId },
      select: { id: true },
    });
    if (!itinerary) throw new NotFoundException('Itinerary not found');
    if (ownerId === collaboratorId) {
      throw new BadRequestException('Cannot invite yourself');
    }

    const existing = await this.prisma.itineraryCollaborator.findUnique({
      where: { itineraryId_userId: { itineraryId, userId: collaboratorId } },
    });
    if (existing) throw new ConflictException('Already a collaborator');

    return this.prisma.itineraryCollaborator.create({
      data: {
        itineraryId,
        userId: collaboratorId,
        role,
        acceptedAt: new Date(),
      },
    });
  }

  async removeCollaborator(
    ownerId: string,
    itineraryId: string,
    collaboratorId: string,
  ) {
    const itinerary = await this.prisma.itinerary.findFirst({
      where: { id: itineraryId, userId: ownerId },
      select: { id: true },
    });
    if (!itinerary) throw new NotFoundException('Itinerary not found');

    await this.prisma.itineraryCollaborator.delete({
      where: { itineraryId_userId: { itineraryId, userId: collaboratorId } },
    });
    return { success: true };
  }

  private generateSlug(): string {
    return createHash('sha256')
      .update(uuidv4() + Date.now().toString())
      .digest('hex')
      .slice(0, 12);
  }
}
