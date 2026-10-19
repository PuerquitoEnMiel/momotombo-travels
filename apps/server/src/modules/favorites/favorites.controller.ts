import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.favorites.list(user.userId);
  }

  @Post(':destinationId')
  add(
    @CurrentUser() user: AuthenticatedUser,
    @Param('destinationId', ParseUUIDPipe) destinationId: string,
  ) {
    return this.favorites.add(user.userId, destinationId);
  }

  @Delete(':destinationId')
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('destinationId', ParseUUIDPipe) destinationId: string,
  ) {
    return this.favorites.remove(user.userId, destinationId);
  }
}
