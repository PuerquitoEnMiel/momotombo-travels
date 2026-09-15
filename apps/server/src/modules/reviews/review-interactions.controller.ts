import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ReviewInteractionsService } from './review-interactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';

class MarkHelpfulDto {
  @IsOptional()
  @IsBoolean()
  isHelpful?: boolean;
}

class ReportReviewDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  reason: string;
}

@Controller('reviews')
export class ReviewInteractionsController {
  constructor(private readonly interactions: ReviewInteractionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/helpful')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  markHelpful(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: MarkHelpfulDto,
  ) {
    return this.interactions.markHelpful(
      id,
      user.userId,
      dto.isHelpful ?? true,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/helpful')
  @HttpCode(HttpStatus.OK)
  removeHelpfulVote(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.interactions.removeHelpfulVote(id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/report')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  report(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReportReviewDto,
  ) {
    return this.interactions.reportReview(id, user.userId, dto.reason);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/hide')
  @HttpCode(HttpStatus.OK)
  hide(@Param('id') id: string) {
    return this.interactions.hideReview(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  restore(@Param('id') id: string) {
    return this.interactions.restoreReview(id);
  }
}
