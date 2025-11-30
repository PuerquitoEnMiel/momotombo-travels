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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiAgentController = void 0;
const common_1 = require("@nestjs/common");
const gemini_agent_service_1 = require("./gemini-agent.service");
let GeminiAgentController = class GeminiAgentController {
    geminiAgentService;
    constructor(geminiAgentService) {
        this.geminiAgentService = geminiAgentService;
    }
    async chat(message) {
        const response = await this.geminiAgentService.generateText(message, true);
        return JSON.parse(response);
    }
    async getModels() {
        return this.geminiAgentService.listModels();
    }
};
exports.GeminiAgentController = GeminiAgentController;
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GeminiAgentController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)('models'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GeminiAgentController.prototype, "getModels", null);
exports.GeminiAgentController = GeminiAgentController = __decorate([
    (0, common_1.Controller)('gemini-agent'),
    __metadata("design:paramtypes", [gemini_agent_service_1.GeminiAgentService])
], GeminiAgentController);
//# sourceMappingURL=gemini-agent.controller.js.map