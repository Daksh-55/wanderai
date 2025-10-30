require('dotenv').config();

async function testGeminiDirect() {
  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  
  const requestBody = {
    contents: [{
      parts: [{
        text: "Say 'Hello from WanderAI with Gemini!'"
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Gemini API working!');
      console.log('Response:', data.candidates[0].content.parts[0].text);
    } else {
      const errorData = await response.json();
      console.log('❌ Gemini API error:', response.status);
      console.log('Error details:', JSON.stringify(errorData, null, 2));
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testGeminiDirect();