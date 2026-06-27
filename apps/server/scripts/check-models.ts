import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY is missing in .env');
        return;
    }

    console.log(`🔑 Checking models for API Key: ${apiKey.substring(0, 10)}...`);

    try {
        // The SDK doesn't have a direct listModels method on the client, 
        // so we use the REST API via fetch for listing, similar to the service,
        // but this script isolates the logic.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const models = data.models || [];

        console.log('\n📋 Available Models:');
        models.forEach((m: any) => {
            if (m.name.includes('gemini')) {
                console.log(`- ${m.name.replace('models/', '')} (${m.displayName})`);
            }
        });

        if (models.length === 0) {
            console.log('⚠️ No models found.');
        }

    } catch (error) {
        console.error('❌ Error listing models:', error);
    }
}

main();
