import { Module } from '@nestjs/common';
import { GeminiAgentController } from './gemini-agent.controller';
import { GeminiAgentService } from './gemini-agent.service';
import { DestinationsModule } from '../destinations/destinations.module';
import { PineconeModule } from '../pinecone/pinecone.module';

@Module({
  imports: [DestinationsModule, PineconeModule],
  controllers: [GeminiAgentController],
  providers: [GeminiAgentService],
  exports: [GeminiAgentService],
})
export class GeminiAgentModule {}
