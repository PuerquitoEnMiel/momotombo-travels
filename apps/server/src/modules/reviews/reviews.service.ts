import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * Recalculates a destination's average rating from its visible reviews
 * (hidden and soft-deleted ones are excluded). Accepts a transaction client so
 * it can run atomically together with a review write.
 */
export async function recalculateDestinationRating(
  client: Prisma.TransactionClient,
  destinationId: string,
): Promise<void> {
  const result = await client.review.aggregate({
    where: { destinationId, isHidden: false, deletedAt: null },
    _avg: { rating: true },
  });
  await client.destination.update({
    where: { id: destinationId },
    data: { rating: result._avg.rating ?? 0 },
  });
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(
    userId: string,
    data: {
      destinationId: string;
      rating: number;
      comment: string;
      title?: string;
    },
  ) {
    // Validate rating range (class-validator should also enforce)
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Verify destination exists
    const destination = await this.prisma.destination.findUnique({
      where: { id: data.destinationId },
      select: { id: true },
    });
    if (!destination) throw new NotFoundException('Destination not found');

    // Verify user has a completed booking at this destination (mark review as verified)
    const verifiedBooking = await this.prisma.booking.findFirst({
      where: {
        userId,
        status: 'COMPLETED',
        activity: { destinationId: data.destinationId },
      },
      select: { id: true },
    });

    try {
      // Create the review and recalculate the destination rating atomically
      return await this.prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
          data: {
            userId,
            destinationId: data.destinationId,
            rating: data.rating,
            comment: data.comment,
            title: data.title,
            isVerified: !!verifiedBooking,
          },
        });
        await recalculateDestinationRating(tx, data.destinationId);
        return review;
      });
    } catch (err) {
      // @@unique([userId, destinationId]): one review per user per destination
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('Ya has reseñado este destino');
      }
      throw err;
    }
  }

  async getDestinationReviews(destinationId: string) {
    return this.prisma.review.findMany({
      where: { destinationId, isHidden: false, deletedAt: null },
      include: {
        user: {
          select: { name: true, profile: { select: { avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteReview(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId)
      throw new ForbiddenException('Not your review');

    // Delete and recalculate the destination rating atomically
    await this.prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id } });
      await recalculateDestinationRating(tx, review.destinationId);
    });
    return { success: true };
  }
}
