import { Test, TestingModule } from '@nestjs/testing';
import { GeminiAgentController } from './gemini-agent.controller';
import { GeminiAgentService } from './gemini-agent.service';

describe('GeminiAgentController', () => {
  let controller: GeminiAgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeminiAgentController],
      providers: [
        {
          provide: GeminiAgentService,
          useValue: {
            generateText: jest.fn(),
            suggestDestinations: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GeminiAgentController>(GeminiAgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
