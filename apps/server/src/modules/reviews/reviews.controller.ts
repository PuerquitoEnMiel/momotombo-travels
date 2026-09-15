import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';

class CreateReviewDto {
  @IsUUID()
  destinationId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  comment: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('destination/:destinationId')
  getDestinationReviews(@Param('destinationId') destinationId: string) {
    return this.reviewsService.getDestinationReviews(destinationId);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  createReview(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(user.userId, dto);
  }

  @Delete(':id')
  deleteReview(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewsService.deleteReview(id, user.userId);
  }
}
