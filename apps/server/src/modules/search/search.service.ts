import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

export interface SearchResult {
  type: 'destination' | 'blog' | 'activity';
  id: string;
  title: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  category?: string;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async global(query: string, limit = 20) {
    const q = query.trim();
    if (!q) return { destinations: [], blogs: [], activities: [] };

    const [destinations, blogs, activities] = await Promise.all([
      this.searchDestinations(q, limit),
      this.searchBlogs(q, limit),
      this.searchActivities(q, limit),
    ]);

    return {
      destinations,
      blogs,
      activities,
      total: destinations.length + blogs.length + activities.length,
    };
  }

  async searchDestinations(query: string, limit: number) {
    return this.prisma.destination.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        rating: true,
        priceLevel: true,
        category: { select: { name: true } },
        images: { where: { isHero: true }, take: 1, select: { url: true } },
      },
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
      take: limit,
    });
  }

  async searchBlogs(query: string, limit: number) {
    return this.prisma.blogPost.findMany({
      where: {
        published: true,
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        author: { select: { id: true, name: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async searchActivities(query: string, limit: number) {
    return this.prisma.activity.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        destination: { select: { name: true, slug: true } },
      },
      orderBy: { price: 'asc' },
      take: limit,
    });
  }
}
