import { Controller, Post, Body, Get } from '@nestjs/common';
import { GeminiAgentService } from './gemini-agent.service';

@Controller('gemini-agent')
export class GeminiAgentController {
    constructor(private readonly geminiAgentService: GeminiAgentService) { }

    @Post('chat')
    async chat(@Body('message') message: string) {
        const response = await this.geminiAgentService.generateText(message, true);
        return JSON.parse(response);
    }

    @Get('models')
    async getModels() {
        return this.geminiAgentService.listModels();
    }
}
