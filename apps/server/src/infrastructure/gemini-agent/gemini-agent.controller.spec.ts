import { Test, TestingModule } from '@nestjs/testing';
import { GeminiAgentController } from './gemini-agent.controller';

describe('GeminiAgentController', () => {
  let controller: GeminiAgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeminiAgentController],
    }).compile();

    controller = module.get<GeminiAgentController>(GeminiAgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
