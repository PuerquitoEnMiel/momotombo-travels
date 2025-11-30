import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { SYSTEM_PROMPT } from './prompts';

@Injectable()
export class GeminiAgentService implements OnModuleInit {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private apiKey: string = '';

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const key = this.configService.get<string>('GEMINI_API_KEY');
        if (!key) {
            console.warn('GEMINI_API_KEY is not defined in environment variables.');
        }
        this.apiKey = key || '';
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    async listModels() {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error listing models:', error);
            throw new Error('Failed to list models');
        }
    }

    async generateText(prompt: string, jsonMode: boolean = false): Promise<string> {
        try {
            console.log('Generating content with model: gemini-2.0-flash');
            const generationConfig = jsonMode
                ? { responseMimeType: 'application/json' }
                : undefined;

            const result = await this.model.generateContent({
                contents: [
                    { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nUser Query: ' + prompt }] }
                ],
                generationConfig,
            });

            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('---------------- GEMINI ERROR ----------------');
            console.error('Message:', error.message);
            console.error('Full Error:', JSON.stringify(error, null, 2));
            console.error('----------------------------------------------');
            throw new Error(`Failed to generate content: ${error.message}`);
        }
    }
}
