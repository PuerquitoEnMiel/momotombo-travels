import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GeminiAgentService } from './gemini-agent.service';

@Controller('gemini-agent')
export class GeminiAgentController {
  constructor(private readonly geminiAgentService: GeminiAgentService) {}

  @Post('chat')
  async chat(
    @Body('message') message: string,
    @Body('history') history: any[],
  ) {
    try {
      const rawResponse = await this.geminiAgentService.generateText(
        message,
        history || [],
        true,
      );
      console.log('Raw Gemini Response:', rawResponse);

      // Clean markdown code blocks if present
      const cleanResponse = rawResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleanResponse);
    } catch (error: any) {
      console.error('Error processing chat request:', error);
      throw new HttpException(
        error.message || 'Error processing chat request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('models')
  async getModels() {
    return this.geminiAgentService.listModels();
  }

  @Post('sync-pinecone')
  async syncPinecone() {
    return this.geminiAgentService.syncDestinationsToPinecone();
  }

  @Get('ai-search')
  async aiSearch(@Query('q') query: string) {
    if (!query) {
      throw new HttpException(
        'Query parameter "q" is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.geminiAgentService.searchDestinations(query);
  }
}
