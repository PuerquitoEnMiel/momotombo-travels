import { Module } from '@nestjs/common';
import { ItinerarySharingController } from './itinerary-sharing.controller';
import { ItinerarySharingService } from './itinerary-sharing.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ItinerarySharingController],
  providers: [ItinerarySharingService],
  exports: [ItinerarySharingService],
})
export class ItinerarySharingModule {}
