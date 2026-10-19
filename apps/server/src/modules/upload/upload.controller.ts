import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'application/pdf',
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Extension derivada SIEMPRE del tipo detectado por magic bytes,
// nunca del nombre/enviado por el cliente.
const EXTENSION_BY_SNIFFED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'application/pdf': 'pdf',
};

/**
 * Detecta el tipo real del archivo leyendo sus magic bytes.
 * Devuelve null si el contenido no coincide con un tipo soportado.
 */
function sniffMimeType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // GIF: "GIF87a" o "GIF89a"
  const gifHeader = buffer.subarray(0, 6).toString('latin1');
  if (gifHeader === 'GIF87a' || gifHeader === 'GIF89a') {
    return 'image/gif';
  }

  // PDF: "%PDF-"
  if (buffer.subarray(0, 5).toString('latin1') === '%PDF-') {
    return 'application/pdf';
  }

  // WEBP: "RIFF" .... "WEBP"
  if (
    buffer.subarray(0, 4).toString('latin1') === 'RIFF' &&
    buffer.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return 'image/webp';
  }

  // AVIF: "ftyp" en offset 4 con marca "avif"/"avis"
  if (buffer.subarray(4, 8).toString('latin1') === 'ftyp') {
    const brand = buffer.subarray(8, 12).toString('latin1');
    if (brand === 'avif' || brand === 'avis') {
      return 'image/avif';
    }
  }

  return null;
}

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_SIZE_BYTES, files: 1 },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME.includes(file.mimetype)) {
          return cb(
            new BadRequestException(`Unsupported file type: ${file.mimetype}`),
            false,
          );
        }
        return cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) throw new BadRequestException('No file provided');

    // El Content-Type del cliente no es confiable: se verifica el contenido real.
    const sniffedMime = sniffMimeType(file.buffer);
    if (!sniffedMime || sniffedMime !== file.mimetype) {
      throw new BadRequestException(
        'File content does not match the declared type',
      );
    }

    // La extension se deriva del tipo detectado, nunca del nombre original.
    const extension = EXTENSION_BY_SNIFFED_MIME[sniffedMime];
    const baseName = file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 64);
    const filename = `${baseName || 'upload'}.${extension}`;

    // In production: upload to S3/Cloudinary. For now, return a data URL for dev.
    const dataUrl = `data:${sniffedMime};base64,${file.buffer.toString('base64')}`;

    return {
      url: dataUrl,
      filename,
      size: file.size,
      mimetype: sniffedMime,
      message:
        'Upload received. Configure S3/Cloudinary for production storage.',
    };
  }
}
