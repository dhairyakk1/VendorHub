const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// CREATE order (buyer)
router.post('/', protect, restrictTo('buyer'), async (req, res) => {
  try {
    const { items, address } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });

      // Reduce stock
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
      buyer: req.user.userId,
      items: orderItems,
      totalAmount,
      address,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET buyer's orders
router.get('/my-orders', protect, restrictTo('buyer'), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.userId })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET seller's incoming orders
router.get('/seller-orders', protect, restrictTo('seller', 'admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name price seller')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    // Filter orders that contain this seller's products
    const sellerOrders = orders.filter(order =>
      order.items.some(item => 
        item.product?.seller?.toString() === req.user.userId
      )
    );

    res.json(sellerOrders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE order status (seller)
router.put('/:id/status', protect, restrictTo('seller', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;