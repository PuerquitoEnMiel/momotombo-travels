import { Controller, Get, Param, Query } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Public()
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('department') department?: string,
  ) {
    return this.destinationsService.findAll(category, department);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.destinationsService.findOne(slug);
  }
}
