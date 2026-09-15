import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  global(@Query('q') query: string, @Query('limit') limit?: string) {
    return this.searchService.global(query, Math.min(Number(limit) || 20, 50));
  }

  @Public()
  @Get('destinations')
  destinations(@Query('q') query: string, @Query('limit') limit?: string) {
    return this.searchService.searchDestinations(
      query,
      Math.min(Number(limit) || 20, 50),
    );
  }

  @Public()
  @Get('blogs')
  blogs(@Query('q') query: string, @Query('limit') limit?: string) {
    return this.searchService.searchBlogs(
      query,
      Math.min(Number(limit) || 20, 50),
    );
  }
}
