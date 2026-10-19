import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts() {
    return this.prisma.blogPost.findMany({
      where: { published: true, deletedAt: null },
      include: { destination: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPostBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, published: true, deletedAt: null },
      include: { destination: { select: { name: true, slug: true } } },
    });

    if (!post) throw new NotFoundException('Post no encontrado');
    return post;
  }
}
