# Production Deployment Checklist

## Pre-Deployment

### Backend (Render)
- [ ] Set `MONGODB_URI` environment variable
- [ ] Set `JWT_SECRET` (use a strong random string)
- [ ] Set `NODE_ENV=production`
- [ ] Set `PORT` (Render sets this automatically, usually 10000)
- [ ] Set `FRONTEND_URL` with your Vercel URL (comma-separated if multiple)
- [ ] Set `DEFAULT_ADMIN_USERNAME=admin`
- [ ] Set `DEFAULT_ADMIN_PASSWORD=PHEWcares12@`
- [ ] Set `TAX_ENABLED=true`
- [ ] Set `CASH_TAX_RATE=0.18`
- [ ] Set `CARD_TAX_RATE=0.05`

### Frontend (Vercel)
- [ ] Set `VITE_API_URL` to your Render backend URL: `https://phew-pos.onrender.com/api`
- [ ] Update `vercel.json` with actual backend URL if using rewrites

## Post-Deployment

### Database Seeding
- [ ] Run seed script to create admin user and initial data
- [ ] Verify admin login works
- [ ] Test creating orders

### Testing
- [ ] Test login with admin credentials
- [ ] Test creating orders
- [ ] Test cash payment with change calculation
- [ ] Test receipt generation
- [ ] Test reports functionality
- [ ] Verify CORS is working (frontend can call backend)

### Security
- [ ] Change default admin password
- [ ] Verify JWT_SECRET is strong and unique
- [ ] Verify MongoDB connection string is secure
- [ ] Check that .env files are not committed to git

## Common Issues

### CORS Errors
- Update `FRONTEND_URL` in Render with your Vercel URL
- Ensure CORS middleware is configured correctly

### API Connection Issues
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend is running and accessible
- Verify health check endpoint works: `https://phew-pos.onrender.com/api/health`

### Order Creation Fails
- Check MongoDB connection
- Verify orderNumber generation is working
- Check server logs for errors

