import { Controller, Get } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('me')
  getMyGamification(@CurrentUser() user: AuthenticatedUser) {
    return this.gamificationService.getUserGamificationData(user.userId);
  }
}
