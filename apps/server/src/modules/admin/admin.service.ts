import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalDestinations,
      totalBookings,
      totalRevenue,
      totalReviews,
      totalItineraries,
      pendingReviews,
      pendingComments,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true, deletedAt: null } }),
      this.prisma.destination.count({ where: { deletedAt: null } }),
      this.prisma.booking.count(),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amount: true },
      }),
      this.prisma.review.count({ where: { isHidden: false, deletedAt: null } }),
      this.prisma.itinerary.count(),
      this.prisma.review.count({ where: { reportCount: { gte: 3 } } }),
      this.prisma.comment.count({ where: { status: 'FLAGGED' } }),
    ]);

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersLast30 = await this.prisma.user.count({
      where: { createdAt: { gte: last30Days } },
    });
    const bookingsLast30 = await this.prisma.booking.count({
      where: { createdAt: { gte: last30Days } },
    });

    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
    });

    const bookingsByStatus = await this.prisma.booking.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newLast30Days: newUsersLast30,
        byRole: usersByRole.reduce<Record<string, number>>(
          (acc, item) => ({ ...acc, [item.role]: item._count.id }),
          {},
        ),
      },
      destinations: { total: totalDestinations },
      bookings: {
        total: totalBookings,
        last30Days: bookingsLast30,
        byStatus: bookingsByStatus.reduce<Record<string, number>>(
          (acc, item) => ({ ...acc, [item.status]: item._count.id }),
          {},
        ),
      },
      itineraries: { total: totalItineraries },
      reviews: { total: totalReviews, reported: pendingReviews },
      comments: { flagged: pendingComments },
      revenue: { totalUsd: totalRevenue._sum.amount ?? 0 },
    };
  }

  async listUsers(
    filters: {
      role?: UserRole;
      isActive?: boolean;
      search?: string;
      page?: number;
      pageSize?: number;
    } = {},
  ) {
    const { role, isActive, search, page = 1, pageSize = 20 } = filters;
    return this.prisma.user.findMany({
      where: {
        ...(role ? { role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: true,
        points: true,
        createdAt: true,
        lastLoginAt: true,
        profile: { select: { avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async updateUserRole(adminId: string, userId: string, newRole: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === newRole) {
      throw new BadRequestException('User already has this role');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    await this.audit.log({
      userId: adminId,
      action: 'user.role.change',
      resource: `User:${userId}`,
      metadata: { from: user.role, to: newRole },
    });
    return updated;
  }

  async deactivateUser(adminId: string, userId: string, reason: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false, deletedAt: new Date() },
    });
    await this.audit.log({
      userId: adminId,
      action: 'user.deactivate',
      resource: `User:${userId}`,
      metadata: { reason },
    });

    // Revoke all sessions
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return user;
  }

  async reactivateUser(adminId: string, userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true, deletedAt: null },
    });
    await this.audit.log({
      userId: adminId,
      action: 'user.reactivate',
      resource: `User:${userId}`,
    });
    return user;
  }

  async getModerationQueue() {
    const [reportedReviews, flaggedComments, recentBookings] =
      await Promise.all([
        this.prisma.review.findMany({
          where: { reportCount: { gte: 1 } },
          orderBy: { reportCount: 'desc' },
          take: 25,
          include: {
            user: { select: { id: true, name: true, email: true } },
            destination: { select: { id: true, name: true, slug: true } },
          },
        }),
        this.prisma.comment.findMany({
          where: { status: 'FLAGGED' },
          orderBy: { createdAt: 'desc' },
          take: 25,
          include: {
            author: { select: { id: true, name: true, email: true } },
            post: { select: { id: true, title: true, slug: true } },
          },
        }),
        this.prisma.booking.findMany({
          where: { status: 'PENDING' },
          orderBy: { createdAt: 'desc' },
          take: 25,
          include: {
            user: { select: { id: true, name: true, email: true } },
            activity: { select: { name: true } },
          },
        }),
      ]);
    return {
      reportedReviews,
      flaggedComments,
      pendingBookings: recentBookings,
    };
  }
}
