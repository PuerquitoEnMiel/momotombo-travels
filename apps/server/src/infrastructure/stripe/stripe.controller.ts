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
import { CouponsService } from '../../modules/coupons/coupons.service';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

class CreateCheckoutDto {
  @IsUUID()
  bookingId: string;

  @IsOptional()
  @IsString()
  @Length(3, 40)
  couponCode?: string;
}

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly bookings: BookingsService,
    private readonly coupons: CouponsService,
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

    // Optional coupon: validated and redeemed SERVER-SIDE, once per booking
    if (body.couponCode && !booking.couponId && booking.status === 'PENDING') {
      const originalAmount = booking.totalPrice.toNumber();
      const validation = await this.coupons.validate(
        body.couponCode,
        user.userId,
        originalAmount,
      );
      await this.coupons.redeem(
        validation.coupon.id,
        user.userId,
        booking.id,
        originalAmount,
      );
      await this.bookings.applyCoupon(
        booking.id,
        validation.coupon.id,
        validation.discount,
      );
    }

    const fresh = await this.bookings.getBookingById(
      body.bookingId,
      user.userId,
    );

    // SECURITY: Price comes from DB (coupon already applied), never from client
    const amount = fresh.totalPrice.toNumber();
    const title = fresh.activity?.name ?? 'Expedicion Momotombo Travels';

    const result = await this.stripeService.createCheckoutSession(
      user.userId,
      body.bookingId,
      amount,
      title,
      user.email,
      fresh.activity?.destination?.name,
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
