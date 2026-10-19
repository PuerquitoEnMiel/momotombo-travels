import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BookingsModule } from '../../modules/bookings/bookings.module';
import { CouponsModule } from '../../modules/coupons/coupons.module';

@Module({
  imports: [PrismaModule, BookingsModule, CouponsModule],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
