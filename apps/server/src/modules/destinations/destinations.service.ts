import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categorySlug?: string, departmentSlug?: string) {
    const where: Record<string, unknown> = {};
    if (categorySlug) where.category = { slug: categorySlug };
    if (departmentSlug) where.department = { slug: departmentSlug };

    return this.prisma.destination.findMany({
      where,
      include: {
        images: true,
        category: true,
        department: true,
        activities: true,
      },
    });
  }

  async findByDepartment(departmentSlug: string) {
    return this.prisma.destination.findMany({
      where: { department: { slug: departmentSlug } },
      include: {
        images: true,
        category: true,
        activities: true,
      },
    });
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
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!destination) {
      throw new NotFoundException(`Destination with slug ${slug} not found`);
    }

    return destination;
  }
}
