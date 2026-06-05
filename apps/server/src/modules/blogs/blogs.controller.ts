import { Controller, Get, Param } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async getAllPosts() {
    return this.blogsService.getAllPosts();
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return this.blogsService.getPostBySlug(slug);
  }
}
