const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, createOrder);
router.patch('/:id/status', protect, updateOrderStatus);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

module.exports = router;

