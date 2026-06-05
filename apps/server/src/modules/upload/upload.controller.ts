import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
export class UploadController {
  @UseGuards(AuthGuard('jwt'))
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // En producción aqui se sube a Cloudinary / S3
    // y se retorna la URL pública real.
    // Mock: Retornamos una URL estática de placeholder
    console.log('File received:', file.originalname);

    return {
      url: `https://via.placeholder.com/800x600?text=${file.originalname}`,
      message: 'Upload simulated. Need Cloudinary/S3 credentials.',
    };
  }
}
