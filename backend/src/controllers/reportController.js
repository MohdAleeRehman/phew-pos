const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Get daily sales report
// @route   GET /api/reports/daily-sales
// @access  Private
exports.getDailySales = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = { status: 'completed' };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    } else if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.createdAt = { $gte: today, $lt: tomorrow };
    }

    const orders = await Order.find(query);

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalSubtotal = orders.reduce((sum, order) => sum + order.subtotal, 0);
    const totalTax = orders.reduce((sum, order) => sum + order.taxAmount, 0);
    const totalDiscount = orders.reduce(
      (sum, order) => sum + order.discountAmount,
      0
    );

    // Payment method breakdown
    const paymentBreakdown = orders.reduce((acc, order) => {
      const method = order.paymentMethod;
      if (!acc[method]) {
        acc[method] = { count: 0, total: 0, tax: 0 };
      }
      acc[method].count += 1;
      acc[method].total += order.total;
      acc[method].tax += order.taxAmount;
      return acc;
    }, {});

    // Tax breakdown by payment method
    const taxBreakdown = {
      cash: {
        taxCollected: paymentBreakdown.cash?.tax || 0,
        rate: 0.18,
        ratePercent: 18,
      },
      card: {
        taxCollected: paymentBreakdown.card?.tax || 0,
        rate: 0.05,
        ratePercent: 5,
      },
      totalGST: totalTax,
    };

    res.status(200).json({
      success: true,
      data: {
        period: {
          startDate: query.createdAt?.$gte || query.createdAt?.$gte,
          endDate: query.createdAt?.$lte || query.createdAt?.$lte,
        },
        summary: {
          totalSales,
          totalOrders,
          totalSubtotal,
          totalTax,
          totalDiscount,
          averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
        },
        paymentBreakdown,
        taxBreakdown,
        orders: orders.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get top selling items
// @route   GET /api/reports/top-items
// @access  Private
exports.getTopItems = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    let query = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(query);

    // Aggregate item sales
    const itemSales = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const itemId = item.menuItem.toString();
        if (!itemSales[itemId]) {
          itemSales[itemId] = {
            menuItem: item.menuItem,
            name: item.name,
            category: item.category || 'Uncategorized',
            quantity: 0,
            revenue: 0,
          };
        }
        itemSales[itemId].quantity += item.quantity;
        itemSales[itemId].revenue += item.subtotal;
      });
    });

    // Convert to array and sort by quantity
    const topItems = Object.values(itemSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, parseInt(limit));

    // Populate menu item details (category is already in itemSales from order items)
    const populatedItems = await Promise.all(
      topItems.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menuItem);
        return {
          ...item,
          category: item.category || 'Uncategorized', // Use category from order items
          menuItem: menuItem
            ? {
                _id: menuItem._id,
                name: menuItem.name,
                category: menuItem.category,
              }
            : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: populatedItems.length,
      data: populatedItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get payment breakdown
// @route   GET /api/reports/payment-breakdown
// @access  Private
exports.getPaymentBreakdown = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(query);

    const breakdown = orders.reduce(
      (acc, order) => {
        const method = order.paymentMethod;
        if (!acc[method]) {
          acc[method] = { count: 0, total: 0, tax: 0 };
        }
        acc[method].count += 1;
        acc[method].total += order.total;
        acc[method].tax += order.taxAmount;
        return acc;
      },
      {}
    );

    const total = orders.reduce((sum, order) => sum + order.total, 0);
    const totalTax = orders.reduce((sum, order) => sum + order.taxAmount, 0);

    // Add percentage and tax info for each method
    const breakdownWithPercentage = Object.entries(breakdown).map(
      ([method, data]) => ({
        method,
        count: data.count,
        total: data.total,
        tax: data.tax,
        percentage: total > 0 ? (data.total / total) * 100 : 0,
        taxRate: method === 'cash' ? 18 : 5, // Tax rate percentage
      })
    );

    // Tax breakdown
    const taxBreakdown = {
      cash: {
        taxCollected: breakdown.cash?.tax || 0,
        rate: 18,
      },
      card: {
        taxCollected: breakdown.card?.tax || 0,
        rate: 5,
      },
      totalGST: totalTax,
    };

    res.status(200).json({
      success: true,
      data: {
        breakdown: breakdownWithPercentage,
        taxBreakdown,
        total,
        totalOrders: orders.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get category sales breakdown
// @route   GET /api/reports/category-sales
// @access  Private
exports.getCategorySales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(query);

    // Aggregate category sales
    const categorySales = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.category || 'Uncategorized';
        if (!categorySales[category]) {
          categorySales[category] = {
            category,
            quantity: 0,
            revenue: 0,
            itemCount: 0,
          };
        }
        categorySales[category].quantity += item.quantity;
        categorySales[category].revenue += item.subtotal;
        categorySales[category].itemCount += 1;
      });
    });

    // Convert to array and sort by quantity
    const categoryBreakdown = Object.values(categorySales)
      .sort((a, b) => b.quantity - a.quantity);

    res.status(200).json({
      success: true,
      count: categoryBreakdown.length,
      data: categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
