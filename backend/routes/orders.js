const express = require('express');

const Cart = require('../models/Cart');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

function generateOrderNumber() {
  const datePart = Date.now().toString();
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `NX-${datePart}-${randomPart}`;
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { shippingAddress, paymentStatus = 'paid' } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Add products before placing an order.'
      });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const order = await Order.create({
      userId: req.user._id,
      items: cart.items,
      totalAmount,
      shippingAddress,
      paymentMethod: 'simulated',
      paymentStatus,
      orderStatus: 'processing',
      orderNumber: generateOrderNumber()
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order.',
      error: error.message
    });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders.',
      error: error.message
    });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order.',
      error: error.message
    });
  }
});

module.exports = router;