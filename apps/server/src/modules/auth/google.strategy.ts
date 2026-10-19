import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  type StrategyOptions,
  type VerifyCallback,
} from 'passport-google-oauth20';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import type { Request, Response } from 'express';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TokensService } from './tokens.service';
import type { User } from '@prisma/client';

const STATE_COOKIE = 'g_oauth_state';
const STATE_TTL_MS = 10 * 60 * 1000;

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers?.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return undefined;
}

/**
 * CSRF protection for the OAuth flow without server sessions: a random
 * state value round-trips through Google and is compared against a
 * short-lived httpOnly cookie set when the flow starts.
 */
class CookieStateStore {
  store(req: Request, done: (err: Error | null, state?: string) => void): void {
    const state = randomBytes(16).toString('hex');
    const res = (req as Request & { res?: Response }).res;
    res?.cookie(STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: STATE_TTL_MS,
      path: '/',
    });
    done(null, state);
  }

  verify(
    req: Request,
    state: string,
    done: (err: Error | null, ok?: boolean) => void,
  ): void {
    const expected = readCookie(req, STATE_COOKIE);
    const res = (req as Request & { res?: Response }).res;
    res?.clearCookie(STATE_COOKIE, { path: '/' });
    done(null, Boolean(state) && expected === state);
  }
}

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

    const options = {
      clientID: clientID || 'GOOGLE_CLIENT_ID_MISSING',
      clientSecret: clientSecret || 'GOOGLE_CLIENT_SECRET_MISSING',
      callbackURL,
      scope: ['email', 'profile'],
      state: true,
      store: new CookieStateStore(),
    };

    if (!clientID || !clientSecret) {
      super(options as unknown as StrategyOptions);
      this.logger.warn(
        'Google OAuth credentials missing — Google login will fail until configured.',
      );
      return;
    }

    super(options as unknown as StrategyOptions);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      id: string;
      emails?: { value: string; verified?: boolean }[];
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

      // Google must assert the email is verified: otherwise the account
      // could be created/linked against an unowned address.
      const googleEmailVerified = profile.emails?.[0]?.verified === true;
      if (!googleEmailVerified) {
        return done(
          new BadRequestException('Google email is not verified'),
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
      const existingOAuth = await this.prisma.oAuthAccount.findUnique({
        where: {
          provider_providerAccountId: {
            provider: 'google',
            providerAccountId: profile.id,
          },
        },
        include: { user: true },
      });

      let user: User | null = existingOAuth?.user ?? null;

      if (!user) {
        const existingByEmail = await this.prisma.user.findUnique({
          where: { email },
        });
        if (existingByEmail) {
          // Auto-linking an UNVERIFIED local account would let an attacker
          // who pre-registered the victim's email hijack their Google login.
          if (!existingByEmail.emailVerified) {
            return done(
              new BadRequestException(
                'An account with this email already exists. Sign in with your password and verify your email first.',
              ),
              undefined,
            );
          }
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

        // Do NOT persist the provider's access/refresh tokens: they are not
        // needed and a DB leak would expose users' Google credentials.
        await this.prisma.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: 'google',
            providerAccountId: profile.id,
            tokenType: 'Bearer',
            scope: 'email profile',
          },
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
