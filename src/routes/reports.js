const express = require('express');
const router = express.Router();
const {
  getDailySales,
  getTopItems,
  getPaymentBreakdown,
  getCategorySales,
} = require('../controllers/reportController');
const { protect } = require('../middlewares/auth');

router.get('/daily-sales', protect, getDailySales);
router.get('/top-items', protect, getTopItems);
router.get('/payment-breakdown', protect, getPaymentBreakdown);
router.get('/category-sales', protect, getCategorySales);

module.exports = router;

