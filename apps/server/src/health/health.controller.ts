import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  type HealthIndicatorResult,
  HealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

class StripeHealthIndicator extends HealthIndicator {
  // eslint-disable-next-line @typescript-eslint/require-await
  async isHealthy(): Promise<HealthIndicatorResult> {
    const isConfigured =
      !!process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_dev-');
    return this.getStatus('stripe', isConfigured, {
      mode: isConfigured ? 'live' : 'mock',
    });
  }
}

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.prismaService),
      () => new StripeHealthIndicator().isHealthy(),
    ]);
  }

  @Public()
  @Get('ready')
  ready() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Public()
  @Get('live')
  live() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
