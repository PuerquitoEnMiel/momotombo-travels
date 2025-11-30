import { Module } from '@nestjs/common';
import { GeminiAgentService } from './gemini-agent.service';
import { GeminiAgentController } from './gemini-agent.controller';

@Module({
  providers: [GeminiAgentService],
  exports: [GeminiAgentService],
  controllers: [GeminiAgentController],
})
export class GeminiAgentModule { }
