const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require('../controllers/menuItemController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, getMenuItems);
router.get('/:id', protect, getMenuItem);
router.post('/', protect, authorize('admin'), createMenuItem);
router.put('/:id', protect, authorize('admin'), updateMenuItem);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);
router.patch('/:id/availability', protect, authorize('admin'), toggleAvailability);

module.exports = router;

