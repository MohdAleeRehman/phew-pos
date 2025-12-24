# Next Steps - Deployment Guide

## ✅ Completed
- Git repository initialized
- Initial commit created
- Production configurations added
- Deployment files created (vercel.json, render.yaml)
- Environment variable examples created
- Documentation updated

## 🚀 Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `phew-pos` (or your preferred name)
   - Description: "Cloud-based POS system for Phew Cafe"
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/phew-pos.git
   git branch -M main
   git push -u origin main
   ```

## 📦 Deploy Backend to Render

1. **Go to Render Dashboard:**
   - Visit https://render.com
   - Sign up/Login

2. **Create New Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `phew-pos` repository

3. **Configure Service:**
   - **Name**: `phew-pos-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid)

4. **Set Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://mohdaleerehman_db_user:8Sj0pu3BexuFWp8Z@drinkpheww.jts4pbd.mongodb.net/phew-pos?retryWrites=true&w=majority&appName=drinkpheww
   JWT_SECRET=<generate-a-strong-random-string>
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   DEFAULT_ADMIN_USERNAME=admin
   DEFAULT_ADMIN_PASSWORD=PHEWcares12@
   TAX_ENABLED=true
   CASH_TAX_RATE=0.18
   CARD_TAX_RATE=0.05
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://phew-pos.onrender.com`)

## 🌐 Deploy Frontend to Vercel

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "Add New Project"
   - Select your `phew-pos` repository
   - Import it

3. **Configure Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variable:**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://phew-pos.onrender.com/api`
   - (Replace with your actual Render backend URL)

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment
   - Note your frontend URL (e.g., `https://phew-pos.vercel.app`)

## 🔄 Update Backend CORS

After getting your Vercel URL, update the backend environment variable:
- Go to Render dashboard
- Update `FRONTEND_URL` to your Vercel URL
- Redeploy the backend

## 🗄️ Seed Database

After backend is deployed, run the seed script:

**Option 1: Using Render Shell**
1. Go to Render dashboard
2. Click on your service
3. Open "Shell" tab
4. Run: `npm run seed`

**Option 2: Local Machine**
```bash
# Set environment variables
export MONGODB_URI="your-mongodb-uri"
export DEFAULT_ADMIN_USERNAME="admin"
export DEFAULT_ADMIN_PASSWORD="PHEWcares12@"

# Run seed
npm run seed
```

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database seeded with admin user
- [ ] Can login with admin credentials
- [ ] Can create orders
- [ ] Receipt generation works
- [ ] Reports are working
- [ ] CORS is configured correctly
- [ ] All environment variables are set

## 🔗 Important URLs

After deployment, update these in your documentation:
- Backend URL: `https://phew-pos.onrender.com`
- Frontend URL: `https://your-app.vercel.app` (update after Vercel deployment)
- API Health Check: `https://phew-pos.onrender.com/api/health`

## 🐛 Troubleshooting

### Backend won't start
- Check Render logs
- Verify MongoDB connection string
- Check all environment variables are set

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration in backend
- Verify backend is running

### CORS errors
- Update `FRONTEND_URL` in Render with your Vercel URL
- Ensure backend is redeployed after CORS changes

