import { type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { AuthenticatedUser } from '../decorators/current-user.decorator';

/**
 * JWT auth guard that honors @Public() to opt-out of authentication.
 * Pair with RolesGuard for fine-grained role checks.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    return super.canActivate(context) as boolean | Promise<boolean>;
  }

  getRequest(
    context: ExecutionContext,
  ): Request & { user?: AuthenticatedUser } {
    return context.switchToHttp().getRequest();
  }
}
