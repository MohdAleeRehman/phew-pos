# PHEW Cafe POS System

A cloud-based Point of Sale (POS) system built with the MEVN stack (MongoDB, Express, Vue.js, Node.js) for Phew Cafe.

## Project Structure

```
phew-pos/
├── backend/          # Express.js backend API
│   ├── src/          # Backend source code
│   ├── server.js     # Backend entry point
│   └── package.json  # Backend dependencies
├── client/           # Vue.js frontend
│   ├── src/          # Frontend source code
│   └── package.json  # Frontend dependencies
└── README.md
```

## Features

- 🔐 **Authentication & Roles**: JWT-based authentication with Admin and Staff roles
- 🍽️ **Menu Management**: Full CRUD for categories and menu items with availability toggle
- 🛒 **Order & Billing**: Cart-based ordering with dine-in/takeaway options, discounts
- 💰 **Tax Management**: Pakistan-specific tax rates (FBR compliant - GST calculated after discount)
- 📊 **Reports & Analytics**: Daily sales, payment breakdown, top-selling items, category breakdown
- 📦 **Inventory Management**: Manual stock tracking with low-stock alerts
- 🧾 **Receipt Generation**: Automatic receipt printing with cash/change information
- 💵 **Cash Payment Handling**: Cash received input with automatic change calculation

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: Vue.js 3, Vue Router, Pinia, Tailwind CSS v4.1
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB Atlas

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd phew-pos
```

2. **Install all dependencies:**
```bash
npm run install-all
```

Or install separately:
```bash
npm run install-backend   # Install backend dependencies
npm run install-frontend  # Install frontend dependencies
```

3. **Set up environment variables:**

Backend (create `backend/.env`):
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=5001
NODE_ENV=development
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=PHEWcares12@
TAX_ENABLED=true
CASH_TAX_RATE=0.18
CARD_TAX_RATE=0.05
```

Frontend (create `client/.env`):
```env
VITE_API_URL=http://localhost:5001/api
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Run the application:**

**Development (separate terminals):**
```bash
# Terminal 1 - Backend
npm run dev-backend
# Backend runs on http://localhost:5001

# Terminal 2 - Frontend
npm run dev-frontend
# Frontend runs on http://localhost:3000
```

## Default Credentials

- **Username**: `admin`
- **Password**: `PHEWcares12@`

## Deployment

### Backend (Railway/Render)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: Set in deployment platform
- Example Railway URL: `https://phew-pos-backend-production.up.railway.app`

### Frontend (Vercel)
- Root directory: `client` (auto-detected from vercel.json location)
- Build command: `npm run build` (auto-detected from package.json)
- Output directory: `dist` (auto-detected)
- Environment variables: 
  - `VITE_API_URL` = `https://phew-pos-backend-production.up.railway.app/api`

## License

ISC
