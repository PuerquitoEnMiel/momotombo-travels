import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService implements OnModuleInit {
  private pinecone: Pinecone;
  private indexName: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const apiKey = this.configService.get<string>('PINECONE_API_KEY');
    this.indexName =
      this.configService.get<string>('PINECONE_INDEX') ||
      'momotombo-destinations';

    if (!apiKey || apiKey === 'tu_pinecone_api_key') {
      throw new Error('PINECONE_API_KEY no configurado correctamente en .env');
    }

    this.pinecone = new Pinecone({ apiKey });
  }

  getIndex() {
    if (!this.pinecone) throw new Error('Pinecone Client not initialized');
    return this.pinecone.Index(this.indexName);
  }

  async upsertVectors(
    vectors: { id: string; values: number[]; metadata: any }[],
  ) {
    if (!this.pinecone) return;
    const index = this.getIndex();
    await index.upsert({ records: vectors });
  }

  async query(vector: number[], topK: number = 5) {
    if (!this.pinecone) {
      console.warn('Pinecone no configurado, devolviendo búsqueda vacía');
      return { matches: [] };
    }
    const index = this.getIndex();
    return index.query({
      vector,
      topK,
      includeMetadata: true,
    });
  }
}
