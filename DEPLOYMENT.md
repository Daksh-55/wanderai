# 🚀 WanderAI Deployment Guide

## 📋 Prerequisites

1. **MongoDB Atlas Account** - Free tier available
2. **Gemini API Key** - From Google AI Studio
3. **Vercel Account** - For frontend deployment
4. **Render Account** - For backend deployment

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Make sure `backend/` folder contains all backend files

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `wanderai-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Step 3: Set Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://2023dakshvaswani_db_user:Dsv%4012345@wanderai-cluster.aazquoq.mongodb.net/wanderai?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSyB_0Lg1_G-vWz5SmxfeWtETkgYiiUn92RA
JWT_SECRET=wanderai-super-secret-jwt-key-2024-secure
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://wanderai-backend.onrender.com`

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update Environment Variables
1. Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 3: Set Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://wanderai-backend.onrender.com
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Your app will be live at: `https://wanderai.vercel.app`

## 🔄 Update Backend CORS

After getting your Vercel URL, update backend CORS:
1. Go to Render dashboard
2. Update environment variable:
```
ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
```

## ✅ Verification Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB connection working
- [ ] Gemini AI API working
- [ ] User registration/login working
- [ ] Trip generation working
- [ ] Google Maps directions working

## 🐛 Troubleshooting

### Backend Issues:
- Check Render logs for errors
- Verify environment variables
- Test MongoDB connection
- Test Gemini API key

### Frontend Issues:
- Check Vercel function logs
- Verify API URL in environment variables
- Check browser console for errors
- Test API endpoints directly

### CORS Issues:
- Update allowed origins in backend
- Check if API URL is correct
- Verify environment variables

## 📱 Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records

### Render:
1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Configure DNS records

## 🔒 Security Notes

- Never commit `.env` files
- Use strong JWT secrets
- Keep API keys secure
- Enable HTTPS only
- Regular security updates

## 📊 Monitoring

- Monitor Render service health
- Check Vercel analytics
- Monitor MongoDB usage
- Track Gemini API usage

Your WanderAI app is now ready for production! 🎉