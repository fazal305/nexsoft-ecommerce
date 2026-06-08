const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const sampleProducts = [
  {
    name: 'Neon Wireless Headphones',
    description: 'Comfortable wireless headphones with deep bass, soft cushions, and long battery life.',
    price: 8500,
    originalPrice: 10500,
    category: 'Electronics',
    stock: 12,
    images: ['#00f5ff'],
    rating: { average: 4.7, count: 128 },
    isFeatured: true
  },
  {
    name: 'Cyber Mechanical Keyboard',
    description: 'RGB mechanical keyboard designed for coding, gaming, and late-night productivity.',
    price: 12500,
    originalPrice: 15000,
    category: 'Electronics',
    stock: 8,
    images: ['#bf5fff'],
    rating: { average: 4.8, count: 92 },
    isFeatured: true
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track steps, heart rate, sleep, and daily activity with a sleek smart watch.',
    price: 9800,
    originalPrice: 12000,
    category: 'Electronics',
    stock: 15,
    images: ['#00ff88'],
    rating: { average: 4.5, count: 76 },
    isFeatured: false
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact speaker with strong sound, water resistance, and modern design.',
    price: 6200,
    originalPrice: 7500,
    category: 'Electronics',
    stock: 5,
    images: ['#f5a623'],
    rating: { average: 4.4, count: 54 },
    isFeatured: false
  },
  {
    name: 'Black Tech Hoodie',
    description: 'Premium cotton hoodie with a clean streetwear look and soft inner lining.',
    price: 4500,
    originalPrice: 5500,
    category: 'Clothing',
    stock: 20,
    images: ['#1a1a2e'],
    rating: { average: 4.6, count: 66 },
    isFeatured: true
  },
  {
    name: 'Minimal White Sneakers',
    description: 'Everyday sneakers with a clean design, strong sole, and comfortable fit.',
    price: 7200,
    originalPrice: 8500,
    category: 'Clothing',
    stock: 10,
    images: ['#e8e8f0'],
    rating: { average: 4.3, count: 39 },
    isFeatured: false
  },
  {
    name: 'Urban Cargo Pants',
    description: 'Relaxed-fit cargo pants with multiple pockets and durable fabric.',
    price: 5200,
    originalPrice: 6500,
    category: 'Clothing',
    stock: 7,
    images: ['#7a788a'],
    rating: { average: 4.2, count: 31 },
    isFeatured: false
  },
  {
    name: 'JavaScript Mastery Book',
    description: 'A beginner-friendly book for learning modern JavaScript concepts through projects.',
    price: 2800,
    originalPrice: 3500,
    category: 'Books',
    stock: 18,
    images: ['#f5a623'],
    rating: { average: 4.9, count: 140 },
    isFeatured: true
  },
  {
    name: 'Node.js Backend Guide',
    description: 'Learn APIs, authentication, MongoDB, and backend architecture using Node.js.',
    price: 3200,
    originalPrice: 4000,
    category: 'Books',
    stock: 11,
    images: ['#00f5ff'],
    rating: { average: 4.7, count: 87 },
    isFeatured: false
  },
  {
    name: 'UI Design Handbook',
    description: 'A practical guide to layout, spacing, typography, colors, and responsive design.',
    price: 2600,
    originalPrice: 3000,
    category: 'Books',
    stock: 9,
    images: ['#bf5fff'],
    rating: { average: 4.6, count: 58 },
    isFeatured: false
  },
  {
    name: 'LED Desk Lamp',
    description: 'Adjustable desk lamp with warm and cool light modes for study and coding.',
    price: 3900,
    originalPrice: 4800,
    category: 'Home',
    stock: 4,
    images: ['#00ff88'],
    rating: { average: 4.4, count: 42 },
    isFeatured: false
  },
  {
    name: 'Ergonomic Laptop Stand',
    description: 'Strong aluminum laptop stand that improves posture and desk setup.',
    price: 4300,
    originalPrice: 5200,
    category: 'Home',
    stock: 6,
    images: ['#ff3860'],
    rating: { average: 4.5, count: 63 },
    isFeatured: false
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected for seeding');

    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
    const hashedCustomerPassword = await bcrypt.hash('Test123!', 10);

    const adminUser = await User.create({
      name: 'Nexsoft Admin',
      email: 'admin@nexsoft.com',
      password: hashedAdminPassword,
      role: 'admin'
    });

    await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: hashedCustomerPassword,
      role: 'customer'
    });

    const productsWithAdmin = sampleProducts.map((product) => {
      return {
        ...product,
        createdBy: adminUser._id
      };
    });

    await Product.insertMany(productsWithAdmin);

    console.log('Seed data created successfully');
    console.log('Admin login: admin@nexsoft.com / Admin123!');
    console.log('Customer login: customer@test.com / Test123!');

    process.exit();
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();