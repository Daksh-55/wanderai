const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // List available models
    const models = await genAI.listModels();
    
    console.log('Available Gemini models:');
    models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
    });
  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

listModels();