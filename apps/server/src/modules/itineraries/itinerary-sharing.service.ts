import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createHash, timingSafeEqual } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import type { Prisma, ShareVisibility } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/** Accepts both the legacy lowercase values and the ShareVisibility enum. */
export type ShareVisibilityInput =
  | ShareVisibility
  | 'private'
  | 'link'
  | 'public';

const BCRYPT_HASH_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function normalizeVisibility(
  visibility?: ShareVisibilityInput,
): ShareVisibility {
  if (!visibility) return 'LINK';
  return visibility.toUpperCase() as ShareVisibility;
}

@Injectable()
export class ItinerarySharingService {
  constructor(private readonly prisma: PrismaService) {}

  async shareItinerary(
    ownerId: string,
    itineraryId: string,
    options: {
      visibility?: ShareVisibilityInput;
      expiresAt?: Date;
      password?: string;
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
        visibility: normalizeVisibility(options.visibility),
        expiresAt: options.expiresAt,
        // Store only a bcrypt hash, same convention as User.password
        password: options.password
          ? await bcrypt.hash(options.password, 12)
          : null,
      },
    });
  }

  async getBySlug(slug: string, password?: string) {
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
    if (share.visibility === 'PRIVATE') {
      throw new ForbiddenException('Share link is private');
    }
    if (!(await this.verifySharePassword(share.password, password))) {
      throw new ForbiddenException('Invalid share password');
    }

    // Increment view count (fire and forget)
    void this.prisma.itineraryShare
      .update({
        where: { id: share.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => undefined);

    return this.serializeShare(share);
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

  async forkItinerary(forkerId: string, sourceSlug: string, password?: string) {
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
    // Same gate as getBySlug: never reveal private or missing shares
    if (!source || source.visibility === 'PRIVATE') {
      throw new NotFoundException('Source itinerary not found');
    }
    if (source.expiresAt && source.expiresAt < new Date()) {
      throw new ForbiddenException('Source link has expired');
    }
    if (!(await this.verifySharePassword(source.password, password))) {
      throw new ForbiddenException('Invalid share password');
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

  /**
   * ItineraryShare.password has no dedicated write path yet, so both storage
   * formats are supported: bcrypt hashes (as used for User.password) and plain
   * text. Compared in constant time where possible.
   */
  private async verifySharePassword(
    stored: string | null,
    provided?: string,
  ): Promise<boolean> {
    if (!stored) return true; // no password set on this share
    if (!provided) return false;
    if (BCRYPT_HASH_RE.test(stored)) {
      return bcrypt.compare(provided, stored);
    }
    const a = createHash('sha256').update(provided).digest();
    const b = createHash('sha256').update(stored).digest();
    return timingSafeEqual(a, b);
  }

  /**
   * Never expose the stored share password and convert Prisma.Decimal money
   * fields to plain numbers for JSON responses.
   */
  private serializeShare<
    T extends {
      password: string | null;
      itinerary: {
        totalPrice: Prisma.Decimal | null;
        days: Array<{
          items: Array<{ activity: { price: Prisma.Decimal | null } | null }>;
        }>;
      };
    },
  >(share: T) {
    return {
      ...share,
      password: null,
      itinerary: {
        ...share.itinerary,
        totalPrice: share.itinerary.totalPrice?.toNumber() ?? null,
        days: share.itinerary.days.map((day) => ({
          ...day,
          items: day.items.map((item) => ({
            ...item,
            activity: item.activity
              ? {
                  ...item.activity,
                  price: item.activity.price?.toNumber() ?? null,
                }
              : null,
          })),
        })),
      },
    };
  }

  private generateSlug(): string {
    return createHash('sha256')
      .update(uuidv4() + Date.now().toString())
      .digest('hex')
      .slice(0, 12);
  }
}
