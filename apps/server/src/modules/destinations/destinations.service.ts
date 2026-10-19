import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * Activity.price is a Prisma.Decimal at runtime; JSON responses keep money as
 * plain numbers (`.toNumber()`).
 */
function serializeActivities<T extends { price: Prisma.Decimal | null }>(
  activities: T[],
): Array<Omit<T, 'price'> & { price: number | null }> {
  return activities.map((activity) => ({
    ...activity,
    price: activity.price?.toNumber() ?? null,
  }));
}

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Flat array kept for internal callers that iterate the result directly
   * (e.g. the Gemini/Pinecone sync). Soft-deleted rows are excluded and the
   * result is capped at 100; use findAllPaginated for API consumers.
   */
  async findAll(categorySlug?: string, departmentSlug?: string) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (categorySlug) where.category = { slug: categorySlug };
    if (departmentSlug) where.department = { slug: departmentSlug };

    const destinations = await this.prisma.destination.findMany({
      where,
      include: {
        images: true,
        category: true,
        department: true,
        activities: true,
      },
      take: 100,
    });

    return destinations.map((destination) => ({
      ...destination,
      activities: serializeActivities(destination.activities),
    }));
  }

  /** Paginated variant: returns `{ items, total, page, pageSize }`. */
  async findAllPaginated(
    categorySlug?: string,
    departmentSlug?: string,
    page = 1,
    pageSize = 20,
  ) {
    const safePage = Math.max(Math.floor(Number(page) || 1), 1);
    const safePageSize = Math.min(
      Math.max(Math.floor(Number(pageSize) || 20), 1),
      50,
    );

    const where: Record<string, unknown> = { deletedAt: null };
    if (categorySlug) where.category = { slug: categorySlug };
    if (departmentSlug) where.department = { slug: departmentSlug };

    const [destinations, total] = await this.prisma.$transaction([
      this.prisma.destination.findMany({
        where,
        include: {
          images: true,
          category: true,
          department: true,
          activities: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
      }),
      this.prisma.destination.count({ where }),
    ]);

    return {
      items: destinations.map((destination) => ({
        ...destination,
        activities: serializeActivities(destination.activities),
      })),
      total,
      page: safePage,
      pageSize: safePageSize,
    };
  }

  async findByDepartment(departmentSlug: string) {
    const destinations = await this.prisma.destination.findMany({
      where: { department: { slug: departmentSlug }, deletedAt: null },
      include: {
        images: true,
        category: true,
        activities: true,
      },
    });

    return destinations.map((destination) => ({
      ...destination,
      activities: serializeActivities(destination.activities),
    }));
  }

  async findOne(slug: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        department: true,
        activities: true,
        amenities: true,
        reviews: {
          where: { isHidden: false, deletedAt: null },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!destination || destination.deletedAt) {
      throw new NotFoundException(`Destination with slug ${slug} not found`);
    }

    return {
      ...destination,
      activities: serializeActivities(destination.activities),
    };
  }
}
