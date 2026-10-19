import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        destination: { include: { images: true, category: true } },
      },
    });
  }

  async add(userId: string, destinationId: string) {
    const destination = await this.prisma.destination.findFirst({
      where: { id: destinationId, deletedAt: null },
      select: { id: true },
    });
    if (!destination) {
      throw new NotFoundException('Destino no encontrado');
    }

    try {
      return await this.prisma.favorite.create({
        data: { userId, destinationId },
        include: {
          destination: { include: { images: true, category: true } },
        },
      });
    } catch (err) {
      // Idempotent: already a favorite — return the existing row
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const existing = await this.prisma.favorite.findUnique({
          where: { userId_destinationId: { userId, destinationId } },
          include: {
            destination: { include: { images: true, category: true } },
          },
        });
        if (existing) return existing;
        throw new ConflictException('No se pudo guardar el favorito');
      }
      throw err;
    }
  }

  async remove(userId: string, destinationId: string) {
    await this.prisma.favorite.deleteMany({
      where: { userId, destinationId },
    });
    return { success: true };
  }
}
