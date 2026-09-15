import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  IsArray,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TagsService } from './tags.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

class CreateTagDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must be lowercase alphanumeric with dashes',
  })
  slug: string;
}

class AttachTagsDto {
  @IsArray()
  @IsUUID('all', { each: true })
  tagIds: string[];
}

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get()
  list() {
    return this.tagsService.list();
  }

  @Public()
  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.tagsService.getBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto.name, dto.slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GUIDE')
  @Post('post/:postId')
  attach(@Param('postId') postId: string, @Body() dto: AttachTagsDto) {
    return this.tagsService.attachToPost(postId, dto.tagIds);
  }
}
