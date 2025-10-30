# 🌍 WanderAI – Your Smart AI Travel Planner

**Tagline:** "Plan smarter. Travel better." ✈️

## 🧭 Project Overview
WanderAI is a full-stack web application that generates custom trip itineraries using AI based on user input (destination, budget, and days). Users can authenticate, generate AI-powered travel plans, view their history, and access Google Maps integration.

## 🧱 Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js (Express)
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + bcryptjs
- **AI:** OpenAI API (GPT-4o-mini)
- **Deployment:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🧩 Core Features
- ✅ User Authentication (Signup/Login)
- ✅ AI Travel Itinerary Generation
- ✅ Google Maps Integration
- ✅ User Dashboard
- ✅ Itinerary Management
- ✅ PDF Download

## 📦 Project Structure
```
wanderai/
├── backend/          # Node.js Express API
├── frontend/         # React Vite App
└── README.md
```