const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a menu item name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    image: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Extensible fields for future variants
    variants: [
      {
        name: String, // e.g., "Small", "Medium", "Large"
        price: Number,
      },
    ],
    addOns: [
      {
        name: String, // e.g., "Extra Shot", "Oat Milk"
        price: Number,
      },
    ],
    tags: [String], // e.g., ["vegetarian", "gluten-free"]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);

