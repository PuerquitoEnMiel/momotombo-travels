import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

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

    // Create review
    const review = await this.prisma.review.create({
      data: {
        userId,
        destinationId: data.destinationId,
        rating: data.rating,
        comment: data.comment,
        title: data.title,
        isVerified: !!verifiedBooking,
      },
    });

    // Recalculate average rating atomically
    await this.recalculateRating(data.destinationId);

    return review;
  }

  async getDestinationReviews(destinationId: string) {
    return this.prisma.review.findMany({
      where: { destinationId, isHidden: false },
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

    await this.prisma.review.delete({ where: { id } });
    await this.recalculateRating(review.destinationId);
    return { success: true };
  }

  private async recalculateRating(destinationId: string) {
    const result = await this.prisma.review.aggregate({
      where: { destinationId, isHidden: false },
      _avg: { rating: true },
    });
    await this.prisma.destination.update({
      where: { id: destinationId },
      data: { rating: result._avg.rating ?? 0 },
    });
  }
}
