const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 8 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    let sortOption = { createdAt: -1 };

    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    }

    if (sort === 'price_desc') {
      sortOption = { price: -1 };
    }

    const skipItems = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skipItems)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products.',
      error: error.message
    });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(4);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products.',
      error: error.message
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories.',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product.',
      error: error.message
    });
  }
});

module.exports = router;