# 🌍 WanderAI – Your Smart AI Travel Planner

**Tagline:** "Plan smarter. Travel better." ✈️

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/wanderai)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 🧭 Project Overview
WanderAI is a full-stack web application that generates custom trip itineraries using AI based on user input (destination, budget, and days). Users can authenticate, generate AI-powered travel plans, view their history, and access Google Maps integration.

## 🧱 Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js (Express)
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + bcryptjs
- **AI:** Google Gemini API
- **Deployment:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas

## 🚀 Live Demo
- **Frontend:** [https://wanderai.vercel.app](https://wanderai.vercel.app)
- **Backend API:** [https://wanderai-backend.onrender.com](https://wanderai-backend.onrender.com)

## 🧩 Core Features
- ✅ **User Authentication** - Secure signup/login with JWT
- ✅ **AI Travel Planning** - Gemini-powered itinerary generation
- ✅ **Google Maps Integration** - Direct navigation to locations
- ✅ **User Dashboard** - Manage all your trips
- ✅ **Profile Management** - Edit user information
- ✅ **PDF Export** - Download itineraries
- ✅ **Responsive Design** - Works on all devices
- ✅ **Real-time Editing** - Edit locations inline

## 🚀 Quick Deploy

### One-Click Deployment
1. **Frontend (Vercel):** Click the "Deploy with Vercel" button above
2. **Backend (Render):** Click the "Deploy to Render" button above
3. **Database:** Set up MongoDB Atlas (free tier)
4. **API Key:** Get Gemini API key from Google AI Studio

### Manual Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gemini API key

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

## 📦 Project Structure
```
wanderai/
├── backend/              # Node.js Express API
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Main server file
├── frontend/            # React Vite App
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.jsx      # Main app component
│   ├── public/          # Static assets
│   └── vite.config.js   # Vite configuration
├── DEPLOYMENT.md        # Deployment guide
└── README.md           # This file
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/generate` | Generate itinerary |
| GET | `/api/itineraries` | Get user itineraries |
| GET | `/api/itinerary/:id` | Get single itinerary |
| DELETE | `/api/itinerary/:id` | Delete itinerary |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent itinerary generation
- MongoDB Atlas for reliable database hosting
- Vercel for seamless frontend deployment
- Render for robust backend hosting

## 📞 Support

If you have any questions or need help with deployment, please open an issue or contact the maintainers.

---

**Made with ❤️ by the WanderAI Team**