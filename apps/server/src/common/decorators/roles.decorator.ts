import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Restricts an endpoint to one or more user roles. Requires RolesGuard to be active.
 *
 * @example
 *   @Roles('ADMIN')
 *   @Delete(':id')
 *   deleteUser() { ... }
 */
export const Roles = (...roles: UserRole[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);
