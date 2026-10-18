import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsService } from './destinations.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

describe('DestinationsService', () => {
  let service: DestinationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        {
          provide: PrismaService,
          useValue: {
            destination: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DestinationsService>(DestinationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
