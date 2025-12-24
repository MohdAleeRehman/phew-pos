const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema(
  {
    // Tax rates by payment method (stored as decimals: 0.05 = 5%, 0.18 = 18%)
    rates: {
      cash: {
        type: Number,
        default: 0.18, // 18% for cash
        min: 0,
        max: 1,
      },
      card: {
        type: Number,
        default: 0.05, // 5% for card
        min: 0,
        max: 1,
      },
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: 'GST',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Get tax rate for a specific payment method
taxSchema.methods.getRate = function (paymentMethod) {
  if (!this.isEnabled) return 0;
  return this.rates[paymentMethod] || 0;
};

// Ensure only one tax configuration exists
taxSchema.statics.getTaxConfig = async function () {
  let tax = await this.findOne();
  if (!tax) {
    tax = await this.create({
      rates: {
        cash: 0.18, // 18% for cash
        card: 0.05, // 5% for card
      },
      isEnabled: true,
      name: 'GST',
    });
  }
  return tax;
};

module.exports = mongoose.model('Tax', taxSchema);

