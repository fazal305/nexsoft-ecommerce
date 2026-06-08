const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    originalPrice: {
      type: Number,
      default: 0
    },

    category: {
      type: String,
      required: true
    },

    stock: {
      type: Number,
      default: 0
    },

    images: {
      type: [String],
      default: []
    },

    rating: {
      average: {
        type: Number,
        default: 0
      },

      count: {
        type: Number,
        default: 0
      }
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);