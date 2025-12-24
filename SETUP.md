# Phew POS - Local Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (already configured)

## Step 1: Install Dependencies

### Install Backend Dependencies
```bash
npm install
```

### Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

**OR install both at once:**
```bash
npm run install-all
```

## Step 2: Environment Setup

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
# Create .env file
touch .env
```

Add the following to `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://mohdaleerehman_db_user:8Sj0pu3BexuFWp8Z@drinkpheww.jts4pbd.mongodb.net/phew-pos?retryWrites=true&w=majority&appName=drinkpheww

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Tax Configuration (defaults - can be changed in Settings)
TAX_RATE=0.05
TAX_ENABLED=true

# Default Admin Credentials
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=PHEWcares12@
```

## Step 3: Seed the Database (First Time Only)

This will create the admin user and all menu items:

```bash
npm run seed
```

## Step 4: Running the Application

### Option A: Run Backend and Frontend Separately

#### Terminal 1 - Backend Server
```bash
npm run server
```
Backend will run on: http://localhost:5000

#### Terminal 2 - Frontend Development Server
```bash
cd client
npm run dev
```
Frontend will run on: http://localhost:3000

### Option B: Run Both Together (Single Command)

```bash
npm run dev
```

This runs both backend and frontend concurrently.

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Default Login Credentials

After seeding:
- **Username**: admin
- **Password**: PHEWcares12@

⚠️ **Important**: Change the password after first login!

## Troubleshooting

### Backend Issues
- Make sure MongoDB Atlas connection string is correct
- Check if PORT 5000 is available
- Verify all backend dependencies are installed

### Frontend Issues
- Make sure backend is running first
- Check if PORT 3000 is available
- Verify all frontend dependencies are installed
- Clear browser cache if needed

### Database Connection Issues
- Verify MongoDB Atlas credentials
- Check network connectivity
- Ensure MongoDB Atlas IP whitelist includes your IP (or 0.0.0.0/0 for development)

## Development Commands

### Backend Only
```bash
# Start backend with nodemon (auto-restart on changes)
npm run server

# Seed database
npm run seed
```

### Frontend Only
```bash
# Start frontend dev server
cd client
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Stopping the Servers

Press `Ctrl + C` in the terminal where the server is running.

