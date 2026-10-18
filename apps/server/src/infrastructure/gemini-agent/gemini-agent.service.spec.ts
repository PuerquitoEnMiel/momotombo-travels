import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeminiAgentService } from './gemini-agent.service';
import { DestinationsService } from '../../modules/destinations/destinations.service';
import { PineconeService } from '../pinecone/pinecone.service';

describe('GeminiAgentService', () => {
  let service: GeminiAgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiAgentService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'GOOGLE_CLOUD_PROJECT') return 'test-project';
              if (key === 'GOOGLE_CLOUD_LOCATION') return 'us-central1';
              return undefined;
            }),
          },
        },
        {
          provide: DestinationsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: PineconeService,
          useValue: {
            searchDestinations: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GeminiAgentService>(GeminiAgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
