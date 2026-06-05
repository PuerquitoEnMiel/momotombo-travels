import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(
    userId: string,
    data: { destinationId: string; rating: number; comment: string },
  ) {
    const review = await this.prisma.review.create({
      data: {
        userId,
        destinationId: data.destinationId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Actualizar rating del destino
    const allReviews = await this.prisma.review.findMany({
      where: { destinationId: data.destinationId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((acc, curr) => acc + curr.rating, 0) /
      allReviews.length;

    await this.prisma.destination.update({
      where: { id: data.destinationId },
      data: { rating: avgRating },
    });

    return review;
  }

  async getDestinationReviews(destinationId: string) {
    return this.prisma.review.findMany({
      where: { destinationId },
      include: {
        user: {
          select: { name: true, profile: { select: { avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
