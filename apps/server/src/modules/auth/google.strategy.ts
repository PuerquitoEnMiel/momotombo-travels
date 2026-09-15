import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TokensService } from './tokens.service';
import type { OAuthAccount, User } from '@prisma/client';

type OAuthWithUser = OAuthAccount & { user: User };

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly tokens: TokensService,
  ) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL =
      config.get<string>('GOOGLE_CALLBACK_URL') ||
      `${config.get<string>('CLIENT_URL', 'http://localhost:3000')}/auth/google/callback`;

    if (!clientID || !clientSecret) {
      super({
        clientID: clientID || 'GOOGLE_CLIENT_ID_MISSING',
        clientSecret: clientSecret || 'GOOGLE_CLIENT_SECRET_MISSING',
        callbackURL,
        scope: ['email', 'profile'],
      });
      this.logger.warn(
        'Google OAuth credentials missing — Google login will fail until configured.',
      );
      return;
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id: string;
      emails?: { value: string }[];
      name?: { givenName?: string; familyName?: string };
      photos?: { value: string }[];
    },
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      if (!email) {
        return done(
          new BadRequestException('Google account has no email'),
          undefined,
        );
      }

      const name =
        [profile.name?.givenName, profile.name?.familyName]
          .filter(Boolean)
          .join(' ')
          .trim() || email.split('@')[0];

      const avatarUrl = profile.photos?.[0]?.value;

      // Find by OAuth account first
      const existingOAuth: OAuthWithUser | null =
        await this.prisma.oAuthAccount.findUnique({
          where: {
            provider_providerAccountId: {
              provider: 'google',
              providerAccountId: profile.id,
            },
          },
          include: { user: true },
        });

      let user: User | null = existingOAuth?.user ?? null;
      let oauth: OAuthAccount | null = existingOAuth ?? null;

      if (!user) {
        const existingByEmail = await this.prisma.user.findUnique({
          where: { email },
        });
        if (existingByEmail) {
          user = existingByEmail;
        } else {
          user = await this.prisma.user.create({
            data: {
              email,
              name,
              password: '',
              emailVerified: true,
              emailVerifiedAt: new Date(),
              profile: { create: { avatarUrl } },
            },
          });
        }
        oauth = await this.prisma.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: 'google',
            providerAccountId: profile.id,
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            scope: 'email profile',
          },
        });
      } else if (oauth) {
        oauth = await this.prisma.oAuthAccount.update({
          where: { id: oauth.id },
          data: { accessToken, refreshToken },
        });
      }

      const tokens = await this.tokens.issueTokenPair(
        { id: user.id, email: user.email, role: user.role },
        { userAgent: 'google-oauth' },
      );

      done(null, { user, tokens });
    } catch (err) {
      this.logger.error('Google OAuth validation failed', err as Error);
      done(err as Error, undefined);
    }
  }
}
