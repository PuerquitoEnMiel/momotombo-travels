import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class GeminiAgentService implements OnModuleInit {
    private configService;
    private genAI;
    private model;
    private apiKey;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    listModels(): Promise<any>;
    generateText(prompt: string, jsonMode?: boolean): Promise<string>;
}
