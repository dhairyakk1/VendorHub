const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET recommended products based on past orders
router.get('/', protect, async (req, res) => {
  try {
    // Get buyer's past orders
    const orders = await Order.find({ buyer: req.user.userId })
      .populate('items.product', 'category');

    // Get categories the buyer has ordered from
    const categories = new Set();
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product?.category) categories.add(item.product.category);
      });
    });

    let recommended;

    if (categories.size === 0) {
      // New user - return top rated products
      recommended = await Product.find()
        .sort({ rating: -1 })
        .limit(8)
        .populate('seller', 'name');
    } else {
      // Return products from same categories
      recommended = await Product.find({
        category: { $in: Array.from(categories) },
      })
        .sort({ rating: -1 })
        .limit(8)
        .populate('seller', 'name');
    }

    res.json({ recommended, basedOn: Array.from(categories) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;