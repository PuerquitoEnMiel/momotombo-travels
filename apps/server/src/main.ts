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
  const isDev = config.get<string>('NODE_ENV') === 'development';

  // Trust proxy (required for rate limiting behind Cloud Run / reverse proxy)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Security: HTTP headers. CSP is always enabled — development only relaxes
  // the few directives needed for local tooling, never disabled outright.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'base-uri': ["'self'"],
          'font-src': ["'self'", 'data:'],
          'form-action': ["'self'"],
          'frame-ancestors': ["'self'"],
          'img-src': ["'self'", 'data:', 'blob:'],
          'object-src': ["'none'"],
          'script-src': [
            "'self'",
            ...(isDev ? ["'unsafe-inline'", "'unsafe-eval'"] : []),
          ],
          'script-src-attr': ["'none'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'connect-src': ["'self'", ...(isDev ? ['ws:'] : [])],
          'upgrade-insecure-requests': isDev ? null : [],
        },
      },
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

  // Security: '*' cannot be combined with credentials:true (the browser rejects
  // credentialed wildcard responses and echoing any origin leaks authenticated
  // data). Drop the wildcard and keep the explicit allowlist.
  const allowedOrigins = corsOrigins.filter((origin) => origin !== '*');
  if (allowedOrigins.length !== corsOrigins.length) {
    logger.warn(
      'CORS: wildcard "*" is not allowed with credentials:true — ignoring "*".',
    );
  }

  app.enableCors({
    /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
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
  logger.log(`🌐 CORS origins: ${allowedOrigins.join(', ')}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
