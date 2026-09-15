import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface CreateCommentDto {
  postId: string;
  parentId?: string;
  body: string;
}

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createComment(authorId: string, dto: CreateCommentDto) {
    if (!dto.body || dto.body.trim().length < 2) {
      throw new BadRequestException('Comment body is too short');
    }
    if (dto.body.length > 2000) {
      throw new BadRequestException(
        'Comment body is too long (max 2000 chars)',
      );
    }

    const post = await this.prisma.blogPost.findUnique({
      where: { id: dto.postId },
      select: { id: true, allowComments: true, deletedAt: true },
    });
    if (!post || post.deletedAt) throw new NotFoundException('Post not found');
    if (!post.allowComments) {
      throw new ForbiddenException('Comments are disabled for this post');
    }

    if (dto.parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: dto.parentId },
        select: { id: true, postId: true },
      });
      if (!parent || parent.postId !== dto.postId) {
        throw new BadRequestException('Invalid parent comment');
      }
    }

    return this.prisma.comment.create({
      data: {
        postId: dto.postId,
        authorId,
        parentId: dto.parentId ?? null,
        body: dto.body.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
    });
  }

  async listForPost(postId: string, page = 1, pageSize = 20) {
    return this.prisma.comment.findMany({
      where: { postId, status: 'APPROVED', parentId: null, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatarUrl: true } },
          },
        },
        replies: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profile: { select: { avatarUrl: true } },
              },
            },
          },
        },
      },
    });
  }

  async deleteComment(commentId: string, userId: string, isAdmin: boolean) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true, postId: true },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId && !isAdmin) {
      throw new ForbiddenException('Not authorized to delete this comment');
    }

    await this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
    await this.audit.log({
      userId,
      action: 'comment.delete',
      resource: `Comment:${commentId}`,
    });
  }

  async reportComment(commentId: string, userId: string, reason: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    void userId;
    void reason;

    await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        reportCount: { increment: 1 },
      },
    });

    return { success: true, message: 'Comment reported' };
  }

  async moderateComment(
    commentId: string,
    moderatorId: string,
    action: 'APPROVED' | 'REJECTED' | 'FLAGGED',
    reason?: string,
  ) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        status: action,
        moderatedById: moderatorId,
        moderatedAt: new Date(),
        moderationReason: reason,
      },
    });
  }
}
