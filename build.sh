#!/bin/bash

echo "🚀 Building WanderAI for Production..."

# Build Frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# Prepare Backend
echo "🔧 Preparing Backend..."
cd backend
npm install
cd ..

echo "✅ Build Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy backend to Render"
echo "2. Deploy frontend to Vercel"
echo "3. Update environment variables"
echo "4. Test the deployed application"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"