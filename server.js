const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware - CORS configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

// Add Vercel patterns to allowed origins
const vercelPattern = /^https:\/\/.*\.vercel\.app$/;
const renderPattern = /^https:\/\/.*\.onrender\.com$/;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow if in allowed origins list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow Vercel deployments
    if (vercelPattern.test(origin)) {
      return callback(null, true);
    }
    
    // Allow Render deployments (for testing)
    if (renderPattern.test(origin)) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Log blocked origin for debugging
    console.log('CORS blocked origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // In production, block unknown origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/menu-items', require('./src/routes/menuItems'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/taxes', require('./src/routes/taxes'));
app.use('/api/inventory', require('./src/routes/inventory'));
app.use('/api/reports', require('./src/routes/reports'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Phew POS API is running' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb+srv://mohdaleerehman_db_user:8Sj0pu3BexuFWp8Z@drinkpheww.jts4pbd.mongodb.net/phew-pos?retryWrites=true&w=majority&appName=drinkpheww', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;

