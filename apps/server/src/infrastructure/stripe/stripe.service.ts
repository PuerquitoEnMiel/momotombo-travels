/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import type { PaymentStatus, BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from '../../modules/bookings/bookings.service';

type StripeInstance = InstanceType<typeof Stripe>;

type StripeEvent = any;

interface CheckoutSessionResult {
  url: string;
  sessionId: string;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: StripeInstance;
  private readonly webhookSecret: string | undefined;
  private readonly clientUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly bookings: BookingsService,
    config: ConfigService,
  ) {
    const secretKey = config.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey || secretKey.startsWith('sk_test_dev-')) {
      if (config.get<string>('NODE_ENV') === 'production') {
        throw new Error('STRIPE_SECRET_KEY is required in production');
      }
      this.logger.warn('Stripe running with mock key — payments disabled');
    }

    this.stripe = new Stripe(secretKey || 'sk_test_mock', {
      typescript: true,
      maxNetworkRetries: 2,
      timeout: 10_000,
    });

    this.webhookSecret = config.get<string>('STRIPE_WEBHOOK_SECRET');
    this.clientUrl = config.get<string>('CLIENT_URL', 'http://localhost:3000');
  }

  private get isMock(): boolean {
    // Detect mock mode by env var (avoid reaching into private SDK internals)
    const key = process.env.STRIPE_SECRET_KEY ?? '';
    return !key || key.startsWith('sk_test_dev-') || key === 'sk_test_mock';
  }

  // ------------ Customer management ------------

  async ensureCustomer(
    userId: string,
    email: string,
    name: string,
  ): Promise<string> {
    if (this.isMock) return `cus_mock_${userId}`;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });
    if (user?.stripeCustomerId) return user.stripeCustomerId;

    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: { userId },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });
    return customer.id;
  }

  // ------------ Checkout Session ------------

  async createCheckoutSession(
    userId: string,
    bookingId: string,
    amount: number,
    title: string,
    customerEmail?: string,
    customerName?: string,
  ): Promise<CheckoutSessionResult> {
    if (this.isMock) {
      return {
        url: `${this.clientUrl}/perfil?demo=true&booking=${bookingId}`,
        sessionId: `cs_mock_${bookingId}`,
      };
    }

    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    let customerId: string | undefined;
    if (customerEmail && customerName) {
      customerId = await this.ensureCustomer(
        userId,
        customerEmail,
        customerName,
      );
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        ...(customerId ? { customer: customerId } : {}),
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: `Reserva: ${title}` },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.clientUrl}/bookings/${bookingId}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.clientUrl}/perfil?canceled=true&booking=${bookingId}`,
        client_reference_id: bookingId,
        metadata: { bookingId, userId },
      });

      return { url: session.url ?? '', sessionId: session.id };
    } catch (error) {
      this.logger.error('Failed to create checkout session', error as Error);
      throw new BadRequestException('Error al crear sesión de pago');
    }
  }

  // ------------ Refunds ------------

  async refundBooking(
    bookingId: string,
    userId: string,
    reason?: string,
  ): Promise<{ refundId: string; amount: number; status: PaymentStatus }> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { payments: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'CONFIRMED' && booking.status !== 'COMPLETED') {
      throw new BadRequestException(
        `Cannot refund booking in status ${booking.status}`,
      );
    }

    const successfulPayment = booking.payments.find(
      (p) => p.status === 'SUCCEEDED',
    );
    if (!successfulPayment?.stripePaymentIntentId) {
      throw new BadRequestException('No successful payment to refund');
    }

    if (this.isMock) {
      await this.bookings['prisma'].booking.update({
        where: { id: bookingId },
        data: {
          status: 'REFUNDED' as BookingStatus,
          refundAmount: booking.totalPrice,
        },
      });
      return {
        refundId: `re_mock_${bookingId}`,
        amount: booking.totalPrice,
        status: 'REFUNDED',
      };
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: successfulPayment.stripePaymentIntentId,
      ...(reason ? { reason: 'requested_by_customer' } : {}),
      metadata: { bookingId, userId, reason: reason ?? '' },
    });

    await this.prisma.payment.update({
      where: { id: successfulPayment.id },
      data: {
        status: 'REFUNDED',
        refundedAmount: successfulPayment.amount,
      },
    });
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'REFUNDED', refundAmount: booking.totalPrice },
    });

    return {
      refundId: refund.id,
      amount: (refund.amount ?? 0) / 100,
      status: 'REFUNDED',
    };
  }

  // ------------ Webhook ------------

  async handleWebhook(
    signature: string,
    payload: Buffer,
  ): Promise<{ received: true; eventType: string }> {
    if (this.isMock || !this.webhookSecret) {
      this.logger.warn('Skipping webhook verification (mock mode)');
      // In mock mode we still need to handle the event for testing.
    }

    let event: StripeEvent;
    try {
      if (!this.webhookSecret) {
        // Parse without verification (mock only)
        event = JSON.parse(payload.toString());
      } else {
        event = this.stripe.webhooks.constructEvent(
          payload,
          signature,
          this.webhookSecret,
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid signature';
      this.logger.error(`Stripe webhook verification failed: ${message}`);
      throw new BadRequestException(`Webhook signature error: ${message}`);
    }

    await this.dispatchEvent(event);
    return { received: true, eventType: event.type as string };
  }

  private async dispatchEvent(event: StripeEvent): Promise<void> {
    const eventType: string = event.type;
    this.logger.log(`Processing Stripe event: ${eventType}`);

    switch (eventType) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const bookingId =
          session.client_reference_id ?? session.metadata?.bookingId;
        if (bookingId && session.payment_intent) {
          await this.bookings.markPaid(
            bookingId,
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent.id,
          );
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        await this.prisma.payment.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: {
            status: 'SUCCEEDED',
            stripeChargeId:
              typeof pi.latest_charge === 'string'
                ? pi.latest_charge
                : pi.latest_charge?.id,
            receiptUrl: pi.charges?.data?.[0]?.receipt_url,
          },
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        await this.prisma.payment.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: {
            status: 'FAILED',
            failureReason: pi.last_payment_error?.message,
          },
        });
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const refund = charge.refunds?.data?.[0];
        const amount = refund?.amount ?? 0;
        await this.prisma.payment.updateMany({
          where: { stripeChargeId: charge.id },
          data: {
            status: 'REFUNDED',
            refundedAmount: amount / 100,
          },
        });
        const payment = await this.prisma.payment.findFirst({
          where: { stripeChargeId: charge.id },
          include: { booking: true },
        });
        if (payment?.booking) {
          await this.prisma.booking.update({
            where: { id: payment.booking.id },
            data: { status: 'REFUNDED', refundAmount: amount / 100 },
          });
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated':
        // Future: handle subscriptions
        break;

      default:
        this.logger.debug(`Unhandled Stripe event type: ${eventType}`);
    }
  }
}
