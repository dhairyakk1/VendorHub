const express = require('express');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// GET all sellers
router.get('/sellers', protect, restrictTo('admin'), async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// APPROVE seller
router.put('/sellers/:id/approve', protect, restrictTo('admin'), async (req, res) => {
  try {
    const seller = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json({ message: 'Seller approved', seller });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// REJECT/DELETE seller
router.delete('/sellers/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Seller rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;