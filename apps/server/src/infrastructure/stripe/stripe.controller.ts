import type { Request } from 'express';
import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';
import { BookingsService } from '../../modules/bookings/bookings.service';
import { IsUUID } from 'class-validator';

class CreateCheckoutDto {
  @IsUUID()
  bookingId: string;
}

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly bookings: BookingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session')
  async createCheckoutSession(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateCheckoutDto,
  ): Promise<{ url: string; sessionId: string }> {
    const booking = await this.bookings.getBookingById(
      body.bookingId,
      user.userId,
    );

    // SECURITY: Price comes from DB, never from client
    const amount = booking.totalPrice;
    const title = booking.activity?.name ?? 'Expedicion Momotombo Travels';

    const result = await this.stripeService.createCheckoutSession(
      user.userId,
      body.bookingId,
      amount,
      title,
      user.email,
      booking.activity?.destination?.name,
    );
    return result;
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RequestWithRawBody,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body for webhook');
    }
    return this.stripeService.handleWebhook(signature, req.rawBody);
  }
}
