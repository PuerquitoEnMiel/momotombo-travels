import * as dotenv from 'dotenv';

dotenv.config();

interface GeminiModel {
  name: string;
  displayName?: string;
}

interface ModelsResponse {
  models?: GeminiModel[];
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is missing in .env');
    return;
  }

  console.log(`🔑 Checking models for API Key: ****${apiKey.slice(-4)}`);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`,
      );
    }

    const data = (await response.json()) as ModelsResponse;
    const models = data.models || [];

    console.log('\n📋 Available Models:');
    models.forEach((m) => {
      if (m.name.includes('gemini')) {
        console.log(
          `- ${m.name.replace('models/', '')} (${m.displayName || ''})`,
        );
      }
    });

    if (models.length === 0) {
      console.log('⚠️ No models found.');
    }
  } catch (error) {
    console.error('❌ Error listing models:', error);
  }
}

void main();
