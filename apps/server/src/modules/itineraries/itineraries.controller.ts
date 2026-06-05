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
import { ItinerariesService } from './itineraries.service';

@UseGuards(AuthGuard('jwt'))
@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Get()
  async getUserItineraries(@Request() req: any) {
    return this.itinerariesService.getUserItineraries(req.user.userId);
  }

  @Get(':id')
  async getItineraryById(@Param('id') id: string, @Request() req: any) {
    return this.itinerariesService.getItineraryById(id, req.user.userId);
  }

  @Post()
  async createItinerary(
    @Request() req: any,
    @Body() body: { title: string; startDate: string; endDate: string },
  ) {
    return this.itinerariesService.createItinerary(req.user.userId, {
      title: body.title,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }

  @Post(':id/items/reorder')
  async reorderItems(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { items: { id: string; itineraryDayId: string }[] },
  ) {
    return this.itinerariesService.reorderItems(
      req.user.userId,
      id,
      body.items,
    );
  }
}
