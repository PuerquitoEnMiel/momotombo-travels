import { GeminiAgentService } from './gemini-agent.service';
export declare class GeminiAgentController {
    private readonly geminiAgentService;
    constructor(geminiAgentService: GeminiAgentService);
    chat(message: string): Promise<any>;
    getModels(): Promise<any>;
}
