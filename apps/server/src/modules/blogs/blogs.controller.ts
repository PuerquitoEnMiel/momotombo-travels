import { Controller, Get, Param } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Public()
  @Get()
  async getAllPosts() {
    return this.blogsService.getAllPosts();
  }

  @Public()
  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return this.blogsService.getPostBySlug(slug);
  }
}
