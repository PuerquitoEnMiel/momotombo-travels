import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ItinerariesService } from './itineraries.service';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';

class CreateItineraryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

class ReorderItemDto {
  @IsUUID()
  id: string;

  @IsUUID()
  itineraryDayId: string;
}

class ReorderItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}

@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Get()
  getUserItineraries(@CurrentUser() user: AuthenticatedUser) {
    return this.itinerariesService.getUserItineraries(user.userId);
  }

  @Get(':id')
  getItineraryById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.itinerariesService.getItineraryById(id, user.userId);
  }

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createItinerary(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateItineraryDto,
  ) {
    return this.itinerariesService.createItinerary(user.userId, {
      title: dto.title,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  @Post(':id/items/reorder')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  reorderItems(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReorderItemsDto,
  ) {
    return this.itinerariesService.reorderItems(user.userId, id, dto.items);
  }
}
