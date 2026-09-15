import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.blogCategory.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { posts: true } } },
    });
  }

  async getBySlug(slug: string) {
    const cat = await this.prisma.blogCategory.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { published: true, deletedAt: null },
          orderBy: { publishedAt: 'desc' },
          take: 20,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            publishedAt: true,
          },
        },
      },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    coverImage?: string;
    order?: number;
  }) {
    const existing = await this.prisma.blogCategory.findUnique({
      where: { slug: data.slug },
    });
    if (existing)
      throw new ConflictException('Category with this slug already exists');
    return this.prisma.blogCategory.create({ data });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      coverImage: string;
      order: number;
    }>,
  ) {
    return this.prisma.blogCategory.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.blogCategory.delete({ where: { id } });
    return { success: true };
  }
}
