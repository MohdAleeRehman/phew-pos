# PHEW Cafe POS System

A cloud-based Point of Sale (POS) system built with the MEVN stack (MongoDB, Express, Vue.js, Node.js) for Phew Cafe.

## Features

- 🔐 **Authentication & Roles**: JWT-based authentication with Admin and Staff roles
- 🍽️ **Menu Management**: Full CRUD for categories and menu items with availability toggle
- 🛒 **Order & Billing**: Cart-based ordering with dine-in/takeaway options, discounts, and multiple payment methods
- 💰 **Tax Management**: Pakistan-specific tax rates (18% cash, 5% card) calculated on base price
- 📊 **Reports & Analytics**: Daily sales, payment breakdown, top-selling items with category information
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

1. Clone the repository:
```bash
git clone <repository-url>
cd phew-pos
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
# Backend
cp .env.example .env
# Edit .env with your MongoDB URI and other settings

# Frontend
cd client
cp .env.example .env
# Edit .env with your API URL (for production)
```

4. Seed the database:
```bash
npm run seed
```

5. Run the application:
```bash
# Development (both frontend and backend)
npm run dev

# Or run separately:
npm run server  # Backend on port 5001
npm run client  # Frontend on port 3000
```

## Default Credentials

- **Username**: `admin`
- **Password**: `PHEWcares12@`

## Project Structure

```
phew-pos/
├── client/                 # Vue.js frontend
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── assets/        # Images, logos
│   │   ├── components/    # Vue components
│   │   ├── layouts/       # Layout components
│   │   ├── router/        # Vue Router config
│   │   ├── stores/        # Pinia stores
│   │   └── views/         # Page components
│   └── package.json
├── src/                    # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middlewares/        # Express middlewares
│   └── utils/              # Utility functions
├── server.js               # Express server entry point
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Admin only)
- `POST /api/auth/login` - Login user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Menu Items
- `GET /api/menu-items` - Get all menu items
- `POST /api/menu-items` - Create menu item (Admin)
- `PUT /api/menu-items/:id` - Update menu item (Admin)
- `DELETE /api/menu-items/:id` - Delete menu item (Admin)
- `PATCH /api/menu-items/:id/availability` - Toggle availability (Admin)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status

### Reports
- `GET /api/reports/daily-sales` - Get daily sales summary
- `GET /api/reports/payment-breakdown` - Get payment method breakdown
- `GET /api/reports/top-items` - Get top selling items

### Taxes
- `GET /api/taxes` - Get tax configuration
- `PUT /api/taxes` - Update tax configuration (Admin)

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create inventory item (Admin)
- `PUT /api/inventory/:id` - Update inventory item (Admin)
- `DELETE /api/inventory/:id` - Delete inventory item (Admin)
- `PATCH /api/inventory/:id/stock` - Update stock (Admin)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Backend (Render)**:
1. Connect GitHub repo to Render
2. Set environment variables
3. Deploy

**Frontend (Vercel)**:
1. Connect GitHub repo to Vercel
2. Set `VITE_API_URL` environment variable
3. Deploy

## Environment Variables

### Backend
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (development/production)
- `DEFAULT_ADMIN_USERNAME` - Default admin username
- `DEFAULT_ADMIN_PASSWORD` - Default admin password
- `TAX_ENABLED` - Enable/disable tax (true/false)
- `CASH_TAX_RATE` - Cash payment tax rate (0.18 = 18%)
- `CARD_TAX_RATE` - Card payment tax rate (0.05 = 5%)

### Frontend
- `VITE_API_URL` - Backend API URL (for production)

## Features in Detail

### Tax System
- Pakistan-specific tax rates
- Cash payments: 18% GST
- Card payments: 5% GST
- Tax calculated on base price (before discounts)

### Cash Payment
- Cash received input when cash payment is selected
- Automatic change calculation
- Change displayed in cart and receipt

### Receipt Generation
- Automatic receipt generation on order completion
- Includes order details, items with categories, tax breakdown
- Cash received and change information
- Print-ready format

## License

ISC

## Support

For issues and questions, please contact the development team.
