import { Module } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'node:http';
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
        customSuccessMessage: (req: IncomingMessage, res: ServerResponse) => {
          return `${req.method ?? ''} ${req.url ?? ''} ${res.statusCode}`;
        },
        customErrorMessage: (
          req: IncomingMessage,
          res: ServerResponse,
          err: Error,
        ) => {
          return `${req.method ?? ''} ${req.url ?? ''} ${res.statusCode} - ${err.message}`;
        },
        autoLogging: true,
        genReqId: (req: IncomingMessage) => {
          const existingId = req.headers['x-request-id'];
          if (typeof existingId === 'string') return existingId;
          if (Array.isArray(existingId) && existingId.length > 0)
            return existingId[0];
          return crypto.randomUUID();
        },
      },
    }),
  ],
  providers: [AppLogger],
  exports: [AppLogger, LoggerModule],
})
export class LoggingModule {}
