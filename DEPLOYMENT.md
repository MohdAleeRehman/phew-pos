# Deployment Guide

## Overview
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render

## Prerequisites
1. GitHub repository
2. Vercel account
3. Render account
4. MongoDB Atlas database

## Backend Deployment (Render)

### Step 1: Prepare Environment Variables
Set these in Render dashboard:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A secure random string (Render can generate this)
- `NODE_ENV` - Set to `production`
- `PORT` - Render sets this automatically (usually 10000)
- `DEFAULT_ADMIN_USERNAME` - admin
- `DEFAULT_ADMIN_PASSWORD` - PHEWcares12@
- `TAX_ENABLED` - true
- `CASH_TAX_RATE` - 0.18
- `CARD_TAX_RATE` - 0.05

### Step 2: Deploy to Render
1. Go to Render dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: phew-pos-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid)
5. Add environment variables
6. Deploy

### Step 3: Get Backend URL
After deployment, note your backend URL (e.g., `https://phew-pos.onrender.com`)

## Frontend Deployment (Vercel)

### Step 1: Update API URL
1. In Vercel dashboard, go to your project settings
2. Add environment variable:
   - `VITE_API_URL` = `https://phew-pos.onrender.com/api`

### Step 2: Deploy to Vercel
1. Go to Vercel dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable `VITE_API_URL`
6. Deploy

### Step 3: Update Vercel Configuration
After getting your backend URL, update `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://phew-pos.onrender.com/api/$1"
    }
  ]
}
```

## Post-Deployment

### Seed Database
After backend is deployed, run the seed script:
```bash
# Set environment variables locally
export MONGODB_URI="your-mongodb-uri"
export DEFAULT_ADMIN_USERNAME="admin"
export DEFAULT_ADMIN_PASSWORD="PHEWcares12@"

# Run seed
npm run seed
```

Or use Render's shell to run the seed command.

## Environment Variables Summary

### Backend (Render)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - production
- `PORT` - Auto-set by Render
- `DEFAULT_ADMIN_USERNAME` - admin
- `DEFAULT_ADMIN_PASSWORD` - PHEWcares12@
- `TAX_ENABLED` - true
- `CASH_TAX_RATE` - 0.18
- `CARD_TAX_RATE` - 0.05

### Frontend (Vercel)
- `VITE_API_URL` - Backend API URL (e.g., https://phew-pos.onrender.com/api)

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend Issues
- Verify `VITE_API_URL` is set correctly
- Check browser console for API errors
- Ensure CORS is enabled on backend

### CORS Configuration
The backend already has CORS enabled. If you encounter CORS issues, update `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

