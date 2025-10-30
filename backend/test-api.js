// Test if backend API is responding
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:5000/');
    const data = await response.json();
    console.log('✅ Backend API Response:', data);
  } catch (error) {
    console.log('❌ Backend API Error:', error.message);
  }
};

testAPI();