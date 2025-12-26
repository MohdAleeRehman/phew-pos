const express = require('express');
const router = express.Router();
const {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateStock,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, getInventoryItems);
router.get('/:id', protect, getInventoryItem);
router.post('/', protect, authorize('admin'), createInventoryItem);
router.put('/:id', protect, authorize('admin'), updateInventoryItem);
router.delete('/:id', protect, authorize('admin'), deleteInventoryItem);
router.patch('/:id/stock', protect, authorize('admin'), updateStock);

module.exports = router;

