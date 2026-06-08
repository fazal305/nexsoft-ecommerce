const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },

        name: String,

        price: Number,

        quantity: Number,

        image: String
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    shippingAddress: {
      name: String,
      street: String,
      city: String,
      country: String,
      phone: String
    },

    paymentMethod: {
      type: String,
      default: 'simulated'
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },

    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },

    orderNumber: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);