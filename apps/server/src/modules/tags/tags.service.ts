import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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

  async attachToPost(postId: string, tagIds: string[]) {
    await this.prisma.$transaction([
      this.prisma.blogPostTag.deleteMany({ where: { blogPostId: postId } }),
      this.prisma.blogPostTag.createMany({
        data: tagIds.map((tagId) => ({ blogPostId: postId, tagId })),
        skipDuplicates: true,
      }),
      ...tagIds.map((tagId) =>
        this.prisma.tag.update({
          where: { id: tagId },
          data: { usageCount: { increment: 1 } },
        }),
      ),
    ]);
    return { success: true };
  }
}
