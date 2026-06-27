import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  VertexAI,
  GenerativeModel,
  Tool,
  SchemaType,
} from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DestinationsService } from '../../modules/destinations/destinations.service';
import { PineconeService } from '../pinecone/pinecone.service';
import { SYSTEM_PROMPT } from './prompts';

export interface DestinationMetadata {
  name: string;
  slug: string;
  category: string;
  priceLevel: string | number;
  rating: number;
  imageUrl: string;
}

@Injectable()
export class GeminiAgentService implements OnModuleInit {
  private vertexAI: VertexAI;
  private model: GenerativeModel;
  private genAI: GoogleGenerativeAI;
  private projectId: string;
  private location: string;

  constructor(
    private configService: ConfigService,
    private destinationsService: DestinationsService,
    private pineconeService: PineconeService,
  ) {}

  onModuleInit() {
    this.projectId =
      this.configService.get<string>('GOOGLE_CLOUD_PROJECT') || '';
    this.location =
      this.configService.get<string>('GOOGLE_CLOUD_LOCATION') || 'us-central1';
    if (!this.projectId) {
      console.error(
        '🚨 ERROR CRÍTICO: No se encontró GOOGLE_CLOUD_PROJECT en el archivo .env',
      );
    }

    this.vertexAI = new VertexAI({
      project: this.projectId,
      location: this.location,
    });
    this.model = this.vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash-001',
    });

    // For embeddings, we use the Vertex AI REST API directly
    const apiKey = this.configService.get<string>(
      'GOOGLE_GENERATIVE_AI_API_KEY',
    );
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  listModels() {
    return { models: [{ name: 'models/gemini-2.0-flash-001' }] };
  }

  async embedText(text: string): Promise<number[]> {
    try {
      // Use Vertex AI REST API for text embeddings
      const { GoogleAuth } = await import('google-auth-library');
      const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      const client = await auth.getClient();
      const token = await client.getAccessToken();

      const endpoint = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/text-embedding-004:predict`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ content: text }],
          parameters: { outputDimensionality: 768 },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Embedding API error: ${response.status} ${response.statusText}`,
        );
      }

      interface EmbeddingResponse {
        predictions: {
          embeddings: {
            values: number[];
          };
        }[];
      }
      const data = (await response.json()) as EmbeddingResponse;
      return data.predictions[0].embeddings.values;
    } catch (error) {
      console.error('Error generating embedding, using fallback:', error);
      // Fallback: random vector to keep service running
      return new Array(768).fill(0).map(() => Math.random() * 2 - 1);
    }
  }

  async syncDestinationsToPinecone() {
    const destinations = await this.destinationsService.findAll();
    const vectors: {
      id: string;
      values: number[];
      metadata: DestinationMetadata;
    }[] = [];

    for (const dest of destinations) {
      const textToEmbed = `Destino: ${dest.name}. Categoria: ${dest.category?.name}. Precio: ${dest.priceLevel}. Rating: ${dest.rating}. Descripcion: ${dest.description}. Ubicacion: ${JSON.stringify(dest.location)}`;
      const embedding = await this.embedText(textToEmbed);
      vectors.push({
        id: dest.id,
        values: embedding,
        metadata: {
          name: dest.name,
          slug: dest.slug,
          category: dest.category?.name || 'Unknown',
          priceLevel: dest.priceLevel,
          rating: dest.rating,
          imageUrl: dest.images?.[0]?.url || '',
        },
      });
    }

    if (vectors.length > 0) {
      await this.pineconeService.upsertVectors(vectors);
    }
    return {
      message: `Sincronizados ${vectors.length} destinos con Pinecone.`,
    };
  }

  async searchDestinations(query: string) {
    // 1. Embed query
    const queryEmbedding = await this.embedText(query);

    // 2. Search Pinecone
    const searchResults = await this.pineconeService.query(queryEmbedding, 5);

    if (!searchResults.matches || searchResults.matches.length === 0) {
      return {
        destinations: [],
        summary: 'No se encontraron destinos que coincidan con la búsqueda.',
      };
    }

    // 3. Generate summary with Vertex AI
    const foundDestinations = searchResults.matches.map(
      (m) => (m as { metadata?: unknown }).metadata as DestinationMetadata,
    );

    const contextText = foundDestinations
      .map(
        (d) =>
          `- ${d.name} (${d.category}): Rating ${d.rating}, Precio ${d.priceLevel}`,
      )
      .join('\n');

    const prompt = `
        El usuario busca: "${query}".
        He encontrado los siguientes destinos que coinciden semánticamente:
        ${contextText}
        
        Por favor, devuelve un breve resumen (máximo 2 párrafos) de por qué estos destinos son perfectos para su búsqueda. Escríbelo en un tono amigable de guía turístico.
        `;

    const chat = this.model.startChat();
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const summary =
      response.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Destinos encontrados.';

    return {
      summary,
      destinations: foundDestinations,
    };
  }

  async generateText(
    userQuery: string,
    history: { role: string; content: string }[] = [],
    jsonMode: boolean = false,
  ): Promise<string> {
    try {
      console.log(
        '🤖 Gemini Agent: Processing query with gemini-2.0-flash-001...',
      );

      // 1. RAG: Retrieve Context from Pinecone
      const queryEmbedding = await this.embedText(userQuery);
      const searchResults = await this.pineconeService.query(queryEmbedding, 5);
      let context = 'No se encontraron destinos específicos.';

      if (searchResults.matches && searchResults.matches.length > 0) {
        const matchedDestinations = await Promise.all(
          searchResults.matches.map(async (m) => {
            try {
              const slug = (m as { metadata?: unknown }).metadata as
                | { slug?: string }
                | undefined;
              if (!slug?.slug) return null;
              return await this.destinationsService.findOne(slug.slug);
            } catch {
              return null;
            }
          }),
        );

        context = matchedDestinations
          .filter((d) => d !== null)
          .map(
            (d) =>
              `- ${d?.name} (${d?.category?.name || 'Unknown'}): ${d?.description}. Price: ${d?.priceLevel}. Rating: ${d?.rating}`,
          )
          .join('\n');
      }

      // 2. Prepare History
      let chatHistory = history.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
        chatHistory = chatHistory.slice(1);
      }

      // 3. Define Tools (Function Calling)
      const createBookingTool: Tool = {
        functionDeclarations: [
          {
            name: 'create_booking',
            description: 'Inicia el flujo de reserva de un destino.',
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                destinationName: {
                  type: SchemaType.STRING,
                  description: 'El nombre del destino a reservar',
                },
                date: {
                  type: SchemaType.STRING,
                  description: 'Fecha de la reserva en formato YYYY-MM-DD',
                },
              },
              required: ['destinationName', 'date'],
            },
          },
        ],
      };

      // 4. Start Chat Session
      const chat = this.model.startChat({
        history: chatHistory,
        tools: [createBookingTool],
        generationConfig: jsonMode
          ? { responseMimeType: 'application/json' }
          : undefined,
      });

      const augmentedPrompt = `
            ${SYSTEM_PROMPT}

            CONTEXT (Available Destinations in Database):
            ${context}

            USER QUERY:
            ${userQuery}
            `;

      console.log('🤖 Consultando a Gemini con historial y tools...');

      let result = await chat.sendMessage(augmentedPrompt);
      let response = result.response;

      // Check for function call
      const functionCall = response.candidates?.[0]?.content?.parts?.find(
        (p) => p.functionCall,
      )?.functionCall;

      if (functionCall) {
        console.log(
          '🛠️ Gemini executed Tool Call:',
          functionCall.name,
          functionCall.args,
        );

        if (functionCall.name === 'create_booking') {
          // Mock: Ejecutariamos BookingsService.create()
          const apiResponse = {
            success: true,
            bookingId: 'mock_book_777',
            message: `Reserva confirmada exitosamente para ${functionCall.args['destinationName']} el ${functionCall.args['date']}.`,
          };

          // Return function result to Gemini so it can generate a final response
          result = await chat.sendMessage([
            {
              functionResponse: {
                name: 'create_booking',
                response: apiResponse,
              },
            },
          ]);
          response = result.response;
        }
      }

      const text =
        response.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text ??
        'No se pudo generar una respuesta.';

      console.log('✅ Respuesta recibida de Gemini');
      return text;
    } catch (error) {
      console.error('🔥 ERROR AL HABLAR CON GOOGLE:', error);
      throw new Error(
        `Falló la conexión con el Agente AI: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
