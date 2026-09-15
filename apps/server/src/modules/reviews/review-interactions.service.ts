import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

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

    await this.prisma.$transaction([
      this.prisma.reviewHelpful.create({
        data: { reviewId, userId, isHelpful },
      }),
      this.prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      }),
    ]);

    return { success: true, message: 'Vote recorded' };
  }

  async removeHelpfulVote(reviewId: string, userId: string) {
    const existing = await this.prisma.reviewHelpful.findUnique({
      where: { reviewId_userId: { reviewId, userId } },
    });
    if (!existing) throw new NotFoundException('Vote not found');

    await this.prisma.$transaction([
      this.prisma.reviewHelpful.delete({
        where: { reviewId_userId: { reviewId, userId } },
      }),
      this.prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { decrement: 1 } },
      }),
    ]);

    return { success: true };
  }

  async reportReview(reviewId: string, userId: string, reason: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true },
    });
    if (!review) throw new NotFoundException('Review not found');

    await this.prisma.$transaction([
      this.prisma.reviewReport.create({
        data: { reviewId, userId, reason },
      }),
      this.prisma.review.update({
        where: { id: reviewId },
        data: { reportCount: { increment: 1 } },
      }),
    ]);

    return {
      success: true,
      message: 'Review reported. Our team will review it.',
    };
  }

  async hideReview(reviewId: string) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { isHidden: true },
    });
  }

  async restoreReview(reviewId: string) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { isHidden: false, reportCount: 0 },
    });
  }
}
