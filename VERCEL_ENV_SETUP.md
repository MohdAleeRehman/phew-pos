# Vercel Environment Variable Setup

## Required Environment Variable

In your Vercel project settings, add the following environment variable:

**Key:** `VITE_API_URL`  
**Value:** `https://phew-pos.onrender.com/api`

⚠️ **Important:**
- Must include `/api` at the end
- No trailing slash
- Use `https://` (not `http://`)

## How to Set in Vercel

1. Go to your Vercel project dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://phew-pos.onrender.com/api`
   - **Environment:** Production, Preview, Development (select all)
5. Click **Save**
6. **Redeploy** your application for changes to take effect

## Verify It's Working

After setting the environment variable and redeploying:
1. Open your Vercel app in the browser
2. Open browser DevTools (F12)
3. Go to Console tab
4. Try to login
5. Check Network tab - API calls should go to `https://phew-pos.onrender.com/api/auth/login`

## Common Mistakes

❌ **Wrong:** `https://phew-pos.onrender.com/` (missing `/api`)  
❌ **Wrong:** `https://phew-pos.onrender.com/api/` (trailing slash)  
❌ **Wrong:** `http://phew-pos.onrender.com/api` (should be `https://`)  
✅ **Correct:** `https://phew-pos.onrender.com/api`

