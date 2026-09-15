import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bufferLogs: true,
  });

  // Use Pino logger (temporarily disabled for debugging)
  // app.useLogger(app.get(AppLogger));

  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security: HTTP headers (CSP disabled in dev for easier debugging)
  app.use(
    helmet({
      contentSecurityPolicy:
        config.get<string>('NODE_ENV') === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Compression
  app.use(compression());

  // CORS whitelist
  const corsOrigins = (
    config.get<string>('CORS_ORIGINS') || 'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }
      if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS: origin '${origin}' not allowed`), false);
    },
    /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Stripe-Signature',
    ],
    exposedHeaders: ['X-Request-Id', 'X-Rate-Limit-Remaining'],
    maxAge: 86400,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: false,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);

  logger.log(`🚀 Momotombo API running on http://localhost:${port}`);
  logger.log(
    `📦 Environment: ${config.get<string>('NODE_ENV', 'development')}`,
  );
  logger.log(`🌐 CORS origins: ${corsOrigins.join(', ')}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
