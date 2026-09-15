import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppLogger implements NestLoggerService {
  constructor(private readonly pino: PinoLogger) {}

  log(message: string, ...optionalParams: unknown[]) {
    this.pino.log(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: unknown[]) {
    this.pino.error(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: unknown[]) {
    this.pino.warn(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: unknown[]) {
    this.pino.debug(message, ...optionalParams);
  }

  verbose(message: string, ...optionalParams: unknown[]) {
    this.pino.verbose(message, ...optionalParams);
  }
}
