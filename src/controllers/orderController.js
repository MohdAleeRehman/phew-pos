const Order = require('../models/Order');
const Tax = require('../models/Tax');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, orderType } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (orderType) {
      query.orderType = orderType;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const orders = await Order.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('items.menuItem', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      orderType,
      discountType,
      discountValue,
      paymentMethod,
      cashReceived,
      change,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item',
      });
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItems = items.map((item) => {
      let itemPrice = item.price;
      if (item.variant && item.variant.price) {
        itemPrice += item.variant.price;
      }
      if (item.addOns && item.addOns.length > 0) {
        item.addOns.forEach((addOn) => {
          itemPrice += addOn.price || 0;
        });
      }
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      return {
        menuItem: item.menuItem,
        name: item.name,
        category: item.category || 'Uncategorized',
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || null,
        addOns: item.addOns || [],
        subtotal: itemSubtotal,
      };
    });

    // Calculate discount
    let discountAmount = 0;
    if (discountType === 'flat' && discountValue) {
      discountAmount = Math.min(discountValue, subtotal);
    } else if (discountType === 'percentage' && discountValue) {
      discountAmount = (subtotal * discountValue) / 100;
    }

    const afterDiscount = subtotal - discountAmount;

    // Get tax configuration - tax is calculated on BASE PRICE (before discounts)
    const taxConfig = await Tax.getTaxConfig();
    let taxAmount = 0;
    let taxRate = 0;
    if (taxConfig.isEnabled) {
      // Get the tax rate for the payment method
      if (taxConfig.rates && taxConfig.rates[paymentMethod] !== undefined) {
        taxRate = taxConfig.rates[paymentMethod];
      } else {
        // Fallback to default rates if structure is different
        taxRate = paymentMethod === 'cash' ? 0.18 : 0.05;
      }
      // Tax is calculated on original subtotal (before discount)
      taxAmount = subtotal * taxRate;
    }

    const total = afterDiscount + taxAmount;

    // Validate payment method
    if (!paymentMethod || !['cash', 'card'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      });
    }

    const order = await Order.create({
      items: orderItems,
      orderType: orderType || 'dine-in',
      subtotal,
      discountType: discountType || 'none',
      discountValue: discountValue || 0,
      discountAmount,
      taxRate: taxRate, // Store the actual rate used (0.18 for cash, 0.05 for card)
      taxAmount,
      total,
      paymentMethod,
      cashReceived: paymentMethod === 'cash' ? (cashReceived || 0) : 0,
      change: paymentMethod === 'cash' ? (change || 0) : 0,
      createdBy: req.user._id,
      notes,
      status: 'completed',
    });

    await order.populate('createdBy', 'name email');
    await order.populate('items.menuItem', 'name');

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('items.menuItem', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

