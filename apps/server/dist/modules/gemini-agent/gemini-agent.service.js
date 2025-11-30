"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiAgentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("./prompts");
let GeminiAgentService = class GeminiAgentService {
    configService;
    genAI;
    model;
    apiKey = '';
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const key = this.configService.get('GEMINI_API_KEY');
        if (!key) {
            console.warn('GEMINI_API_KEY is not defined in environment variables.');
        }
        this.apiKey = key || '';
        this.genAI = new generative_ai_1.GoogleGenerativeAI(this.apiKey);
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
        }
        catch (error) {
            console.error('Error listing models:', error);
            throw new Error('Failed to list models');
        }
    }
    async generateText(prompt, jsonMode = false) {
        try {
            console.log('Generating content with model: gemini-2.0-flash');
            const generationConfig = jsonMode
                ? { responseMimeType: 'application/json' }
                : undefined;
            const result = await this.model.generateContent({
                contents: [
                    { role: 'user', parts: [{ text: prompts_1.SYSTEM_PROMPT + '\n\nUser Query: ' + prompt }] }
                ],
                generationConfig,
            });
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('---------------- GEMINI ERROR ----------------');
            console.error('Message:', error.message);
            console.error('Full Error:', JSON.stringify(error, null, 2));
            console.error('----------------------------------------------');
            throw new Error(`Failed to generate content: ${error.message}`);
        }
    }
};
exports.GeminiAgentService = GeminiAgentService;
exports.GeminiAgentService = GeminiAgentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiAgentService);
//# sourceMappingURL=gemini-agent.service.js.map