const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an inventory item name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      default: 'unit',
      trim: true, // e.g., "kg", "liter", "unit", "box"
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
    },
    isLowStock: {
      type: Boolean,
      default: false,
    },
    // Future: recipe-based deduction
    recipe: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Update isLowStock before saving
inventorySchema.pre('save', function (next) {
  this.isLowStock = this.currentStock <= this.lowStockThreshold;
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);

