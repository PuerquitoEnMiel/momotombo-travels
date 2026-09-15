import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppLogger } from './app-logger';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,
        level:
          process.env.LOG_LEVEL ||
          (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers["set-cookie"]',
            'password',
            'confirmPassword',
            'currentPassword',
            'newPassword',
          ],
          censor: '[REDACTED]',
        },
        serializers: {
          req: (req: Record<string, unknown>) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
          }),
          res: (res: Record<string, unknown>) => ({
            statusCode: res.statusCode,
          }),
        },
        customSuccessMessage: (
          req: Record<string, unknown>,
          res: Record<string, unknown>,
        ) => {
          return `${String(req.method)} ${String(req.url)} ${String(res.statusCode)}`;
        },
        customErrorMessage: (
          req: Record<string, unknown>,
          res: Record<string, unknown>,
          err: Error,
        ) => {
          return `${String(req.method)} ${String(req.url)} ${String(res.statusCode)} - ${err.message}`;
        },
        autoLogging: true,
        genReqId: (req: Record<string, unknown>) => {
          const headers = req.headers as Record<string, unknown> | undefined;
          const existingId = headers?.['x-request-id'];
          if (typeof existingId === 'string') return existingId;
          return crypto.randomUUID();
        },
      },
    }),
  ],
  providers: [AppLogger],
  exports: [AppLogger, LoggerModule],
})
export class LoggingModule {}
