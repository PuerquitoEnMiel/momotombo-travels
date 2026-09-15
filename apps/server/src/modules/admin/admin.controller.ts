import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';

class UpdateRoleDto {
  @IsIn(['TRAVELER', 'GUIDE', 'ADMIN'])
  role: 'TRAVELER' | 'GUIDE' | 'ADMIN';
}

class DeactivateUserDto {
  @IsString()
  @IsOptional()
  reason?: string;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  listUsers(
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.adminService.listUsers({
      role: role as never,
      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search,
      page: Number(page) || 1,
      pageSize: Math.min(Number(pageSize) || 20, 100),
    });
  }

  @Patch('users/:id/role')
  @HttpCode(HttpStatus.OK)
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() admin: AuthenticatedUser,
  ) {
    return this.adminService.updateUserRole(admin.userId, id, dto.role);
  }

  @Post('users/:id/deactivate')
  @HttpCode(HttpStatus.OK)
  deactivate(
    @Param('id') id: string,
    @CurrentUser() admin: AuthenticatedUser,
    @Body() dto: DeactivateUserDto,
  ) {
    return this.adminService.deactivateUser(
      admin.userId,
      id,
      dto.reason ?? 'No reason provided',
    );
  }

  @Post('users/:id/reactivate')
  @HttpCode(HttpStatus.OK)
  reactivate(@Param('id') id: string, @CurrentUser() admin: AuthenticatedUser) {
    return this.adminService.reactivateUser(admin.userId, id);
  }

  @Get('moderation')
  moderation() {
    return this.adminService.getModerationQueue();
  }
}
