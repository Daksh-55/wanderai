const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testSetup() {
  console.log('🧪 Testing WanderAI Setup...\n');

  // Test Environment Variables
  console.log('1. Environment Variables:');
  console.log(`   PORT: ${process.env.PORT ? '✅' : '❌'}`);
  console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✅' : '❌'}`);
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅' : '❌'}\n`);

  // Test MongoDB Connection
  console.log('2. Testing MongoDB Connection...');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('   MongoDB: ✅ Connected successfully\n');
    await mongoose.disconnect();
  } catch (error) {
    console.log('   MongoDB: ❌ Connection failed');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test Gemini API
  console.log('3. Testing Gemini AI API...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent("Say 'Hello from WanderAI with Gemini!'");
    const response = await result.response;
    const text = response.text();

    console.log('   Gemini AI: ✅ Working correctly');
    console.log(`   Response: ${text}\n`);
  } catch (error) {
    console.log('   Gemini AI: ❌ Connection failed');
    console.log(`   Error: ${error.message}\n`);
  }

  console.log('🎉 Setup test complete!');
  process.exit(0);
}

testSetup();