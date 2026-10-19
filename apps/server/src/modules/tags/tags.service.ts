import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import type { UserRole } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.tag.findMany({
      orderBy: [{ usageCount: 'desc' }, { name: 'asc' }],
    });
  }

  async getBySlug(slug: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
      include: {
        posts: {
          include: {
            post: {
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
        },
      },
    });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async create(name: string, slug: string) {
    const existing = await this.prisma.tag.findUnique({ where: { slug } });
    if (existing)
      throw new ConflictException('Tag with this slug already exists');
    return this.prisma.tag.create({ data: { name, slug } });
  }

  async attachToPost(
    postId: string,
    tagIds: string[],
    userId: string,
    role: UserRole,
  ) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException(
        'Not authorized to modify tags on this post',
      );
    }

    const uniqueTagIds = [...new Set(tagIds)];

    await this.prisma.$transaction(async (tx) => {
      const previous = await tx.blogPostTag.findMany({
        where: { blogPostId: postId },
        select: { tagId: true },
      });
      const previousIds = previous.map((tag) => tag.tagId);
      const removedIds = previousIds.filter(
        (tagId) => !uniqueTagIds.includes(tagId),
      );
      const addedIds = uniqueTagIds.filter(
        (tagId) => !previousIds.includes(tagId),
      );

      await tx.blogPostTag.deleteMany({ where: { blogPostId: postId } });
      if (uniqueTagIds.length > 0) {
        await tx.blogPostTag.createMany({
          data: uniqueTagIds.map((tagId) => ({ blogPostId: postId, tagId })),
          skipDuplicates: true,
        });
      }

      // Mantiene usageCount consistente con los cambios reales
      if (removedIds.length > 0) {
        await tx.tag.updateMany({
          where: { id: { in: removedIds }, usageCount: { gt: 0 } },
          data: { usageCount: { decrement: 1 } },
        });
      }
      if (addedIds.length > 0) {
        await tx.tag.updateMany({
          where: { id: { in: addedIds } },
          data: { usageCount: { increment: 1 } },
        });
      }
    });
    return { success: true };
  }
}
