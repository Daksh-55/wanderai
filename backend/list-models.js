require('dotenv').config();

async function listAvailableModels() {
  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Available Gemini models:');
      data.models.forEach(model => {
        console.log(`- ${model.name}`);
        if (model.supportedGenerationMethods) {
          console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
    } else {
      const errorData = await response.json();
      console.log('❌ Error listing models:', response.status);
      console.log('Error details:', JSON.stringify(errorData, null, 2));
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

listAvailableModels();