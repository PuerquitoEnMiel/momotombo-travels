import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async getUserGamificationData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { points: true, badges: { include: { badge: true } } },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const allBadges = await this.prisma.badge.findMany();

    return {
      points: user.points,
      earnedBadges: user.badges.map((ub) => ub.badge),
      availableBadges: allBadges.filter(
        (b) => !user.badges.some((ub) => ub.badgeId === b.id),
      ),
      nextLevelThreshold: 1000, // Mock threshold
    };
  }
}
