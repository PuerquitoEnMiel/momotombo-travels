import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('destination/:destinationId')
  async getDestinationReviews(@Param('destinationId') destinationId: string) {
    return this.reviewsService.getDestinationReviews(destinationId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createReview(
    @Request() req: any,
    @Body() body: { destinationId: string; rating: number; comment: string },
  ) {
    return this.reviewsService.createReview(req.user.userId, {
      destinationId: body.destinationId,
      rating: body.rating,
      comment: body.comment,
    });
  }
}
