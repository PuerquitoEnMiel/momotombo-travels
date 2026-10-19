import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { recalculateDestinationRating } from './reviews.service';

@Injectable()
export class ReviewInteractionsService {
  constructor(private readonly prisma: PrismaService) {}

  async markHelpful(reviewId: string, userId: string, isHelpful = true) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, isHidden: true, deletedAt: true },
    });
    if (!review || review.deletedAt || review.isHidden) {
      throw new NotFoundException('Review not found');
    }

    const existing = await this.prisma.reviewHelpful.findUnique({
      where: { reviewId_userId: { reviewId, userId } },
    });
    if (existing) {
      throw new ConflictException('You have already voted on this review');
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.reviewHelpful.create({
          data: { reviewId, userId, isHelpful },
        });
        // Recompute from the source of truth: only helpful votes count
        // (an unhelpful vote must not inflate the counter).
        const helpfulVotes = await tx.reviewHelpful.count({
          where: { reviewId, isHelpful: true },
        });
        await tx.review.update({
          where: { id: reviewId },
          data: { helpfulCount: helpfulVotes },
        });
      });
    } catch (err) {
      // Race with the pre-check above on @@unique([reviewId, userId])
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('You have already voted on this review');
      }
      throw err;
    }

    return { success: true, message: 'Vote recorded' };
  }

  async removeHelpfulVote(reviewId: string, userId: string) {
    const existing = await this.prisma.reviewHelpful.findUnique({
      where: { reviewId_userId: { reviewId, userId } },
    });
    if (!existing) throw new NotFoundException('Vote not found');

    await this.prisma.$transaction(async (tx) => {
      await tx.reviewHelpful.delete({
        where: { reviewId_userId: { reviewId, userId } },
      });
      // Recompute the true counter instead of decrementing blindly
      const helpfulVotes = await tx.reviewHelpful.count({
        where: { reviewId, isHelpful: true },
      });
      await tx.review.update({
        where: { id: reviewId },
        data: { helpfulCount: helpfulVotes },
      });
    });

    return { success: true };
  }

  async reportReview(reviewId: string, userId: string, reason: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true },
    });
    if (!review) throw new NotFoundException('Review not found');

    try {
      // @@unique([reviewId, userId]) dedupes reports; reportCount only
      // increments when a new report row is actually created (the whole
      // transaction rolls back on duplicate).
      await this.prisma.$transaction([
        this.prisma.reviewReport.create({
          data: { reviewId, userId, reason },
        }),
        this.prisma.review.update({
          where: { id: reviewId },
          data: { reportCount: { increment: 1 } },
        }),
      ]);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        // Already reported by this user: silently no-op
        return { success: false, message: 'Review already reported' };
      }
      throw err;
    }

    return {
      success: true,
      message: 'Review reported. Our team will review it.',
    };
  }

  async hideReview(reviewId: string) {
    // Toggling visibility changes the visible-review average
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.update({
        where: { id: reviewId },
        data: { isHidden: true },
      });
      await recalculateDestinationRating(tx, review.destinationId);
      return review;
    });
  }

  async restoreReview(reviewId: string) {
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.update({
        where: { id: reviewId },
        data: { isHidden: false, reportCount: 0 },
      });
      await recalculateDestinationRating(tx, review.destinationId);
      return review;
    });
  }
}
