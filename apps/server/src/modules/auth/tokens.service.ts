import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: 'TRAVELER' | 'GUIDE' | 'ADMIN';
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  family: string;
  jti: string;
  type: 'refresh';
}

export interface EmailVerificationPayload {
  sub: string;
  type: 'email-verification';
}

export interface PasswordResetPayload {
  sub: string;
  type: 'password-reset';
}

export interface AuthTokenPair {
  accessToken: string;
  accessExpiresIn: number; // seconds
  refreshToken: string;
  refreshExpiresIn: number; // seconds
}

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private get accessExpiresIn(): string {
    return this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
  }

  private get refreshExpiresIn(): string {
    return this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d');
  }

  private parseExpiresToMs(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) return 900_000;
    const n = Number(match[1]);
    const unit = match[2] as 's' | 'm' | 'h' | 'd';
    const map: Record<'s' | 'm' | 'h' | 'd', number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return n * map[unit];
  }

  private parseExpiresToSeconds(value: string): number {
    return Math.floor(this.parseExpiresToMs(value) / 1000);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // ----------------------
  // Access + Refresh pair
  // ----------------------

  async issueTokenPair(
    user: { id: string; email: string; role: 'TRAVELER' | 'GUIDE' | 'ADMIN' },
    meta: { userAgent?: string; ipAddress?: string; family?: string } = {},
  ): Promise<AuthTokenPair> {
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };
    const family = meta.family ?? uuidv4();
    const jti = uuidv4();

    const accessToken = await this.jwt.signAsync(accessPayload, {
      expiresIn: this.accessExpiresIn as unknown as number,
    });

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      family,
      jti,
      type: 'refresh',
    };
    const refreshToken = await this.jwt.signAsync(refreshPayload, {
      expiresIn: this.refreshExpiresIn as unknown as number,
    });

    const refreshExpiresAt = new Date(
      Date.now() + this.parseExpiresToMs(this.refreshExpiresIn),
    );

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        family,
        expiresAt: refreshExpiresAt,
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
      },
    });

    return {
      accessToken,
      accessExpiresIn: this.parseExpiresToSeconds(this.accessExpiresIn),
      refreshToken,
      refreshExpiresIn: this.parseExpiresToSeconds(this.refreshExpiresIn),
    };
  }

  /**
   * Rotates a refresh token. If a stolen token is presented, the entire family
   * is revoked (token reuse detection).
   */
  async rotateRefreshToken(
    refreshToken: string,
    meta: { userAgent?: string; ipAddress?: string } = {},
  ): Promise<AuthTokenPair> {
    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<RefreshTokenPayload>(refreshToken);
    } catch {
      throw new Error('Invalid refresh token');
    }
    if (payload.type !== 'refresh') throw new Error('Invalid token type');

    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!stored || stored.revokedAt) {
      // Reuse detected: revoke entire family
      await this.revokeFamily(payload.family);
      this.logger.warn(
        `Refresh token reuse detected for family ${payload.family} (user ${payload.sub})`,
      );
      throw new Error('Refresh token reuse detected');
    }

    if (stored.expiresAt < new Date()) {
      throw new Error('Refresh token expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        deletedAt: true,
      },
    });
    if (!user || !user.isActive || user.deletedAt) {
      throw new Error('User is not active');
    }

    // Mark old token as replaced
    const newPair = await this.issueTokenPair(
      { id: user.id, email: user.email, role: user.role },
      { ...meta, family: stored.family },
    );
    const newHash = this.hashToken(newPair.refreshToken);
    const newStored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: newHash },
    });

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: {
        revokedAt: new Date(),
        replacedBy: newStored?.id,
      },
    });

    return newPair;
  }

  async revokeFamily(family: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { family, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async cleanupExpired(): Promise<{ count: number }> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return { count: result.count };
  }

  // ----------------------
  // Email verification
  // ----------------------

  async issueEmailVerificationToken(userId: string): Promise<string> {
    const raw = randomBytes(32).toString('hex');
    void raw;
    const payload: EmailVerificationPayload = {
      sub: userId,
      type: 'email-verification',
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h' as unknown as number,
    });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Invalidate previous tokens
    await this.prisma.emailVerificationToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    await this.prisma.emailVerificationToken.create({
      data: { userId, tokenHash: this.hashToken(token), expiresAt },
    });

    this.logger.debug(`Email verification token issued for user ${userId}`);
    return token;
  }

  async consumeEmailVerificationToken(token: string): Promise<string> {
    let payload: EmailVerificationPayload;
    try {
      payload = await this.jwt.verifyAsync<EmailVerificationPayload>(token);
    } catch {
      throw new Error('Invalid or expired email verification token');
    }
    if (payload.type !== 'email-verification')
      throw new Error('Invalid token type');

    const stored = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash: this.hashToken(token) },
    });
    if (!stored || stored.usedAt || stored.expiresAt < new Date()) {
      throw new Error('Email verification token already used or expired');
    }

    await this.prisma.emailVerificationToken.update({
      where: { id: stored.id },
      data: { usedAt: new Date() },
    });

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });

    return payload.sub;
  }

  // ----------------------
  // Password reset
  // ----------------------

  async issuePasswordResetToken(userId: string): Promise<string> {
    const payload: PasswordResetPayload = {
      sub: userId,
      type: 'password-reset',
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h' as unknown as number,
    });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    await this.prisma.passwordResetToken.create({
      data: { userId, tokenHash: this.hashToken(token), expiresAt },
    });

    return token;
  }

  async consumePasswordResetToken(token: string): Promise<string> {
    let payload: PasswordResetPayload;
    try {
      payload = await this.jwt.verifyAsync<PasswordResetPayload>(token);
    } catch {
      throw new Error('Invalid or expired password reset token');
    }
    if (payload.type !== 'password-reset')
      throw new Error('Invalid token type');

    const stored = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: this.hashToken(token) },
    });
    if (!stored || stored.usedAt || stored.expiresAt < new Date()) {
      throw new Error('Password reset token already used or expired');
    }

    await this.prisma.passwordResetToken.update({
      where: { id: stored.id },
      data: { usedAt: new Date() },
    });

    return payload.sub;
  }
}
