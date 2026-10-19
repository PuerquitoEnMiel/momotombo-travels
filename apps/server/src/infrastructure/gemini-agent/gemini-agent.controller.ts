import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GeminiAgentService } from './gemini-agent.service';
import { Roles } from '../../common/decorators/roles.decorator';

const MAX_INPUT_LENGTH = 2000;

@Controller('gemini-agent')
export class GeminiAgentController {
  constructor(private readonly geminiAgentService: GeminiAgentService) {}

  @Post('chat')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async chat(
    @Body('message') message: string,
    @Body('history') history: { role: string; content: string }[],
  ) {
    if (typeof message !== 'string' || message.trim().length === 0) {
      throw new BadRequestException('Message is required');
    }
    if (message.length > MAX_INPUT_LENGTH) {
      throw new BadRequestException(
        `Message must be ${MAX_INPUT_LENGTH} characters or fewer`,
      );
    }

    let rawResponse: string;
    try {
      rawResponse = await this.geminiAgentService.generateText(
        message,
        Array.isArray(history) ? history : [],
        true,
      );
    } catch (error) {
      // El detalle se registra en el servidor; nunca se filtra al cliente.
      console.error('Error processing chat request:', error);
      throw new HttpException(
        'AI service unavailable',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Clean markdown code blocks if present
    const cleanResponse = rawResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Error parsing chat response as JSON:', parseError);
      throw new HttpException(
        'AI service unavailable',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.geminiAgentService.validateChatResponse(parsed);
  }

  @Get('models')
  getModels() {
    return this.geminiAgentService.listModels();
  }

  @Post('sync-pinecone')
  @Roles('ADMIN')
  async syncPinecone() {
    return this.geminiAgentService.syncDestinationsToPinecone();
  }

  @Get('ai-search')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async aiSearch(@Query('q') query: string) {
    if (!query) {
      throw new HttpException(
        'Query parameter "q" is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (query.length > MAX_INPUT_LENGTH) {
      throw new BadRequestException(
        `Query must be ${MAX_INPUT_LENGTH} characters or fewer`,
      );
    }
    return this.geminiAgentService.searchDestinations(query);
  }
}
