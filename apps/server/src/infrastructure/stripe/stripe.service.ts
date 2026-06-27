/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unused-vars */
import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(private prisma: PrismaService) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey && process.env.NODE_ENV === 'production') {
      throw new Error('STRIPE_SECRET_KEY environment variable is required in production');
    }
    this.stripe = new Stripe(secretKey || 'sk_test_dev-only-mock-key');
  }

  async createCheckoutSession(
    userId: string,
    bookingId: string,
    amount: number,
    title: string,
  ) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Reserva: ${title}`,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/perfil?success=true&booking=${bookingId}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/perfil?canceled=true`,
        client_reference_id: bookingId,
      });

      return { url: session.url };
    } catch (error) {
      throw new BadRequestException('Error al crear sesión de pago');
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret && process.env.NODE_ENV === 'production') {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required in production');
    }
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret || 'whsec_dev-only-mock-secret',
      );
    } catch (err: any) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.client_reference_id;

      if (bookingId) {
        await this.prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'CONFIRMED' },
        });
      }
    }

    return { received: true };
  }
}
