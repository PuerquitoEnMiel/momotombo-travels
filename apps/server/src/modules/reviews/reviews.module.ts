import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewInteractionsController } from './review-interactions.controller';
import { ReviewInteractionsService } from './review-interactions.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewsController, ReviewInteractionsController],
  providers: [ReviewsService, ReviewInteractionsService],
  exports: [ReviewsService, ReviewInteractionsService],
})
export class ReviewsModule {}
