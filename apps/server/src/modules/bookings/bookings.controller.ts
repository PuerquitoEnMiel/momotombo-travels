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
import { BookingsService } from './bookings.service';

@UseGuards(AuthGuard('jwt'))
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getUserBookings(@Request() req: any) {
    return this.bookingsService.getUserBookings(req.user.userId);
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.getBookingById(id, req.user.userId);
  }

  @Post()
  async createBooking(
    @Request() req: any,
    @Body()
    body: {
      activityId: string;
      date: string;
      guests: number;
      totalPrice: number;
    },
  ) {
    return this.bookingsService.createBooking(req.user.userId, {
      activityId: body.activityId,
      date: new Date(body.date),
      guests: body.guests,
      totalPrice: body.totalPrice,
    });
  }
}
