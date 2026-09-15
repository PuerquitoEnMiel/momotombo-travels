import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../common/decorators/public.decorator';
import type { Request, Response } from 'express';

@Public()
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport redirects to Google.
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/require-await
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as
      | { tokens?: { accessToken: string; refreshToken: string } }
      | undefined;
    const clientUrl = this.config.get<string>(
      'CLIENT_URL',
      'http://localhost:3000',
    );

    if (!user?.tokens) {
      return res.redirect(`${clientUrl}/auth/login?error=google_failed`);
    }

    const params = new URLSearchParams({
      access_token: user.tokens.accessToken,
      refresh_token: user.tokens.refreshToken,
    });
    return res.redirect(
      `${clientUrl}/auth/google/success?${params.toString()}`,
    );
  }
}
