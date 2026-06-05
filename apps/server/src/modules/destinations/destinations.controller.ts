import { Controller, Get, Param, Query } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.destinationsService.findAll(category);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.destinationsService.findOne(slug);
  }
}
