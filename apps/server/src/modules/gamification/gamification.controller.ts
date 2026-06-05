import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GamificationService } from './gamification.service';

@UseGuards(AuthGuard('jwt'))
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('me')
  async getMyGamification(@Request() req: any) {
    return this.gamificationService.getUserGamificationData(req.user.userId);
  }
}
