import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';
import { IsDateString, IsInt, IsUUID, Max, Min } from 'class-validator';

class CreateBookingDto {
  @IsUUID()
  activityId: string;

  @IsDateString()
  date: string;

  @IsInt()
  @Min(1)
  @Max(20)
  guests: number;
}

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getUserBookings(@CurrentUser() user: AuthenticatedUser) {
    return this.bookingsService.getUserBookings(user.userId);
  }

  @Get(':id')
  getBookingById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bookingsService.getBookingById(id, user.userId);
  }

  @Post()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  createBooking(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateBookingDto,
  ) {
    // totalPrice is computed server-side from the activity; never trust the client.
    return this.bookingsService.createBooking(user.userId, {
      activityId: body.activityId,
      date: new Date(body.date),
      guests: body.guests,
    });
  }
}
