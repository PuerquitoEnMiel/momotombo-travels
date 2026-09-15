import { Injectable } from '@nestjs/common';
import {
  makeCounterProvider,
  makeHistogramProvider,
  makeGaugeProvider,
  InjectMetric,
} from '@willsoto/nestjs-prometheus';
import type { Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter,
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram,
    @InjectMetric('active_users_gauge')
    private readonly activeUsersGauge: Gauge,
    @InjectMetric('bookings_created_total')
    private readonly bookingsCreatedTotal: Counter,
    @InjectMetric('payments_succeeded_total')
    private readonly paymentsSucceededTotal: Counter,
  ) {}

  recordHttpRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
  ) {
    this.httpRequestsTotal.inc({ method, path, status: statusCode.toString() });
    this.httpRequestDuration.observe(
      { method, path, status: statusCode.toString() },
      duration,
    );
  }

  setActiveUsers(count: number) {
    this.activeUsersGauge.set(count);
  }

  recordBookingCreated() {
    this.bookingsCreatedTotal.inc();
  }

  recordPaymentSucceeded() {
    this.paymentsSucceededTotal.inc();
  }
}

export const metricsProviders = [
  makeCounterProvider({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
  }),
  makeHistogramProvider({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  }),
  makeGaugeProvider({
    name: 'active_users_gauge',
    help: 'Number of currently active users',
  }),
  makeCounterProvider({
    name: 'bookings_created_total',
    help: 'Total number of bookings created',
  }),
  makeCounterProvider({
    name: 'payments_succeeded_total',
    help: 'Total number of successful payments',
  }),
];
