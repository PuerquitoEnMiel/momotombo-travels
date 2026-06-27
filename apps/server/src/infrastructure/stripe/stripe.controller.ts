import type { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Req() req: any,
    @Body() body: { bookingId: string; amount: number; title: string },
  ) {
    return this.stripeService.createCheckoutSession(
      req.user.userId,
      body.bookingId,
      body.amount,
      body.title,
    );
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    return this.stripeService.handleWebhook(signature, req.rawBody as Buffer);
  }
}
