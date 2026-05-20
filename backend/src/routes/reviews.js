const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// ADD review (buyer only)
router.post('/:productId', protect, restrictTo('buyer'), async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Check if already reviewed
    const existing = await Review.findOne({
      product: req.params.productId,
      buyer: req.user.userId,
    });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    const review = await Review.create({
      product: req.params.productId,
      buyer: req.user.userId,
      rating,
      comment,
    });

    // Update product rating
    const reviews = await Review.find({ product: req.params.productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.params.productId, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET reviews for a product (public)
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;