const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Uncategorized',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  variant: {
    name: String,
    price: Number,
  },
  addOns: [
    {
      name: String,
      price: Number,
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
    },
    items: [orderItemSchema],
    orderType: {
      type: String,
      enum: ['dine-in', 'takeaway'],
      default: 'dine-in',
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discountType: {
      type: String,
      enum: ['none', 'flat', 'percentage'],
      default: 'none',
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card'],
      required: true,
    },
    cashReceived: {
      type: Number,
      default: 0,
      min: 0,
    },
    change: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  // Only generate if this is a new document and orderNumber doesn't exist
  if (this.isNew && !this.orderNumber) {
    try {
      const count = await mongoose.model('Order').countDocuments();
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      const timestamp = Date.now().toString().slice(-6);
      this.orderNumber = `ORD-${dateStr}-${String(count + 1).padStart(4, '0')}-${timestamp}`;
    } catch (error) {
      // Fallback if countDocuments fails
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      const timestamp = Date.now().toString().slice(-6);
      this.orderNumber = `ORD-${dateStr}-${timestamp}`;
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

