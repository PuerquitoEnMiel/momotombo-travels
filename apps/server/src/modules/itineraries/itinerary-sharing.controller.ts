import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  ItinerarySharingService,
  type ShareVisibilityInput,
} from './itinerary-sharing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';

class ShareOptionsDto {
  @IsOptional()
  @IsIn(['private', 'link', 'public', 'PRIVATE', 'LINK', 'PUBLIC'])
  visibility?: ShareVisibilityInput;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  @Length(1, 128)
  password?: string;
}

class CreateShareDto {
  @IsUUID()
  itineraryId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ShareOptionsDto)
  options?: ShareOptionsDto;
}

class InviteCollaboratorDto {
  @IsUUID()
  itineraryId: string;

  @IsUUID()
  collaboratorId: string;

  @IsIn(['VIEWER', 'EDITOR', 'CO_OWNER'])
  role: 'VIEWER' | 'EDITOR' | 'CO_OWNER';
}

class RemoveCollaboratorDto {
  @IsUUID()
  itineraryId: string;

  @IsUUID()
  collaboratorId: string;
}

@Controller('itineraries/share')
export class ItinerarySharingController {
  constructor(private readonly sharingService: ItinerarySharingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createShare(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateShareDto,
  ) {
    return this.sharingService.shareItinerary(user.userId, dto.itineraryId, {
      visibility: dto.options?.visibility,
      expiresAt: dto.options?.expiresAt
        ? new Date(dto.options.expiresAt)
        : undefined,
      password: dto.options?.password,
    });
  }

  @Public()
  @Get(':slug')
  getBySlug(@Param('slug') slug: string, @Query('password') password?: string) {
    return this.sharingService.getBySlug(slug, password);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  revoke(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.sharingService.revokeShare(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('fork/:slug')
  @HttpCode(HttpStatus.CREATED)
  fork(
    @Param('slug') slug: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body('password') password?: string,
  ) {
    return this.sharingService.forkItinerary(user.userId, slug, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('collaborators')
  @HttpCode(HttpStatus.CREATED)
  invite(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: InviteCollaboratorDto,
  ) {
    return this.sharingService.inviteCollaborator(
      user.userId,
      dto.itineraryId,
      dto.collaboratorId,
      dto.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('collaborators')
  @HttpCode(HttpStatus.OK)
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RemoveCollaboratorDto,
  ) {
    return this.sharingService.removeCollaborator(
      user.userId,
      dto.itineraryId,
      dto.collaboratorId,
    );
  }
}
