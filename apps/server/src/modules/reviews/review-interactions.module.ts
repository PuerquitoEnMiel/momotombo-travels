import { Module } from '@nestjs/common';
import { ReviewInteractionsController } from './review-interactions.controller';
import { ReviewInteractionsService } from './review-interactions.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewInteractionsController],
  providers: [ReviewInteractionsService],
  exports: [ReviewInteractionsService],
})
export class ReviewInteractionsModule {}
