const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered'],
    default: 'Placed'
  },
  paymentStatus: { type: String, default: 'Paid' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);