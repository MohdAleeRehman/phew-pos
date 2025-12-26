const express = require('express');
const router = express.Router();
const {
  getTaxConfig,
  updateTaxConfig,
} = require('../controllers/taxController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, getTaxConfig);
router.put('/', protect, authorize('admin'), updateTaxConfig);

module.exports = router;

