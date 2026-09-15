import { Module } from '@nestjs/common';
import { ItinerariesController } from './itineraries.controller';
import { ItinerariesService } from './itineraries.service';
import { ItinerarySharingController } from './itinerary-sharing.controller';
import { ItinerarySharingService } from './itinerary-sharing.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ItinerariesController, ItinerarySharingController],
  providers: [ItinerariesService, ItinerarySharingService],
  exports: [ItinerariesService, ItinerarySharingService],
})
export class ItinerariesModule {}
