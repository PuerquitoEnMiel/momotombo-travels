import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiAgentModule } from './modules/gemini-agent/gemini-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GeminiAgentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
