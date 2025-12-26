const Tax = require('../models/Tax');

// @desc    Get tax configuration
// @route   GET /api/taxes
// @access  Private
exports.getTaxConfig = async (req, res) => {
  try {
    const tax = await Tax.getTaxConfig();

    res.status(200).json({
      success: true,
      data: tax,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update tax configuration
// @route   PUT /api/taxes
// @access  Private/Admin
exports.updateTaxConfig = async (req, res) => {
  try {
    const { rates, isEnabled, name } = req.body;

    let tax = await Tax.findOne();

    if (!tax) {
      tax = await Tax.create({
        rates: rates || {
          cash: 0.18,
          card: 0.05,
        },
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        name: name || 'GST',
      });
    } else {
      if (rates !== undefined) {
        if (rates.cash !== undefined) tax.rates.cash = rates.cash;
        if (rates.card !== undefined) tax.rates.card = rates.card;
      }
      if (isEnabled !== undefined) tax.isEnabled = isEnabled;
      if (name !== undefined) tax.name = name;
      await tax.save();
    }

    res.status(200).json({
      success: true,
      data: tax,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

