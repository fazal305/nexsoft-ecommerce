const express = require('express');

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: []
      });
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart.',
      error: error.message
    });
  }
});

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock.'
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: []
      });
    }

    const existingItem = cart.items.find((item) => {
      return item.productId.toString() === productId;
    });

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: Number(quantity),
        image: product.images[0] || ''
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Product added to cart.',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add product to cart.',
      error: error.message
    });
  }
});

router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1.'
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found.'
      });
    }

    const item = cart.items.find((cartItem) => {
      return cartItem.productId.toString() === productId;
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart.'
      });
    }

    item.quantity = Number(quantity);

    await cart.save();

    res.json({
      success: true,
      message: 'Cart updated.',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart.',
      error: error.message
    });
  }
});

router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found.'
      });
    }

    cart.items = cart.items.filter((item) => {
      return item.productId.toString() !== req.params.productId;
    });

    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart.',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove item.',
      error: error.message
    });
  }
});

router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.json({
        success: true,
        message: 'Cart is already empty.',
        cart: {
          items: []
        }
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared.',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart.',
      error: error.message
    });
  }
});

module.exports = router;