// Test signup endpoint directly
const testSignup = async () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Signup successful:', data);
    } else {
      const errorData = await response.json();
      console.log('❌ Signup failed:', response.status, errorData);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

testSignup();