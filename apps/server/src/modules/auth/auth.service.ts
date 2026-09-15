import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TokensService, type AuthTokenPair } from './tokens.service';
import type { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';

const BCRYPT_ROUNDS = 12;

interface RequestMeta {
  userAgent?: string;
  ipAddress?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly tokens: TokensService,
    private readonly config: ConfigService,
  ) {}

  // ---- Registration ----

  async register(dto: RegisterDto, meta: RequestMeta = {}) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: { id: true },
    });
    if (existing) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        name: dto.name.trim(),
        language: dto.language ?? 'es',
        profile: { create: {} },
      },
      select: { id: true, email: true, name: true, role: true },
    });

    this.logger.log(`User registered: ${user.email}`);

    // Auto-login after registration
    const tokens = await this.tokens.issueTokenPair(
      { id: user.id, email: user.email, role: user.role },
      meta,
    );

    return { user, ...tokens };
  }

  // ---- Login ----

  async login(
    dto: LoginDto,
    meta: RequestMeta = {},
  ): Promise<
    AuthTokenPair & {
      user: {
        id: string;
        email: string;
        name: string;
        role: 'TRAVELER' | 'GUIDE' | 'ADMIN';
      };
    }
  > {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        isActive: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: meta.ipAddress ?? null },
    });

    const tokens = await this.tokens.issueTokenPair(
      { id: user.id, email: user.email, role: user.role },
      meta,
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // ---- Refresh ----

  async refresh(
    refreshToken: string,
    meta: RequestMeta = {},
  ): Promise<AuthTokenPair> {
    try {
      return await this.tokens.rotateRefreshToken(refreshToken, meta);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Invalid refresh token';
      throw new UnauthorizedException(message);
    }
  }

  // ---- Logout ----

  async logout(refreshToken?: string): Promise<{ success: true }> {
    if (refreshToken) {
      // Single-session logout: revoke just this token
      try {
        const payload = await this.jwt.verifyAsync<{
          type: string;
          family?: string;
        }>(refreshToken);
        if (payload.type === 'refresh' && payload.family) {
          await this.tokens.revokeFamily(payload.family);
        }
      } catch {
        /* ignore invalid token */
      }
    }
    return { success: true };
  }

  async logoutAll(userId: string): Promise<{ success: true }> {
    await this.tokens.revokeAllForUser(userId);
    return { success: true };
  }

  // ---- Profile ----

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        twoFactorEnabled: true,
        language: true,
        timezone: true,
        currency: true,
        createdAt: true,
        lastLoginAt: true,
        profile: {
          select: {
            bio: true,
            avatarUrl: true,
            phoneNumber: true,
            preferences: true,
          },
        },
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  // ---- Email verification ----

  async verifyEmail(token: string) {
    try {
      await this.tokens.consumeEmailVerificationToken(token);
      return { success: true, message: 'Email verified successfully' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid token';
      throw new BadRequestException(message);
    }
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, emailVerified: true },
    });
    if (!user) throw new BadRequestException('User not found');
    if (user.emailVerified) {
      return { success: true, message: 'Email already verified' };
    }
    const token = await this.tokens.issueEmailVerificationToken(user.id);
    return {
      success: true,
      message: 'Verification email sent',
      _devToken: token,
    };
  }

  // ---- Password reset ----

  async forgotPassword(email: string) {
    // Always return success to prevent email enumeration
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });
    if (user) {
      const token = await this.tokens.issuePasswordResetToken(user.id);
      this.logger.log(`Password reset requested for ${email}`);
      return {
        success: true,
        message: 'If the email exists, a reset link has been sent',
        _devToken: token,
      };
    }
    return {
      success: true,
      message: 'If the email exists, a reset link has been sent',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    let userId: string;
    try {
      userId = await this.tokens.consumePasswordResetToken(dto.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid token';
      throw new BadRequestException(message);
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Invalidate all refresh tokens
    await this.tokens.revokeAllForUser(userId);

    this.logger.log(`Password reset completed for user ${userId}`);
    return { success: true, message: 'Password reset successfully' };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      throw new UnauthorizedException('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all other sessions
    await this.tokens.revokeAllForUser(userId);

    return { success: true, message: 'Password changed successfully' };
  }
}
