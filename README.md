# NexMart — Full Stack E-commerce Website

A full-stack ecommerce website built with HTML, CSS, JavaScript, Bootstrap, jQuery, Node.js, Express, MongoDB, Mongoose, and JWT authentication.

## Live Links

- GitHub Repository: https://github.com/fazal305/nexsoft-ecommerce
- Backend API: https://nexsoft-ecommerce.onrender.com
- Frontend Demo: https://fazal305.github.io/nexsoft-ecommerce/

## Overview

NexMart is a full-stack ecommerce internship project built for Nexsoft Solutions.

The app includes customer authentication, product browsing, product details, guest cart support, logged-in cart storage, simulated checkout, order history, and an admin dashboard for managing products, orders, and customers.

## Features

- Product listing page
- Product detail page
- Product search and filtering
- Shopping cart functionality
- Guest cart with localStorage
- User registration
- User login
- JWT authentication
- Customer dashboard flow
- Simulated checkout
- Customer order history
- Admin authorization
- Admin dashboard
- Admin product management
- Admin order management
- Admin customer management
- MongoDB persistence
- Responsive Bootstrap UI

## Tech Stack

### Frontend

- HTML5
- CSS3
- Bootstrap 5
- jQuery
- Vanilla JavaScript
- localStorage
- GitHub Pages

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- cors
- dotenv
- Render

## Test Accounts

### Admin

```text
Email: admin@nexsoft.com
Password: Admin123!
```

Customer
Email: customer@test.com
Password: Test123!

Clone the repository:

git clone https://github.com/fazal305/nexsoft-ecommerce.git

Open the project:

cd nexsoft-ecommerce

Install backend dependencies:

cd backend
npm install

Create a .env file inside backend/:

PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_ORIGIN=\*

Seed sample data:

npm run seed

Start the backend:

npm start

Open frontend files from the frontend/ folder using Live Server.

API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
Products
GET /api/products
GET /api/products/featured
GET /api/products/categories
GET /api/products/:id
Cart
GET /api/cart
POST /api/cart/add
PUT /api/cart/update
DELETE /api/cart/remove/:productId
Orders
POST /api/orders
GET /api/orders
GET /api/orders/:id
Admin
GET /api/admin/products
POST /api/admin/products
PUT /api/admin/products/:id
DELETE /api/admin/products/:id
GET /api/admin/orders
GET /api/admin/users
Health
GET /api/health
Deployment Notes

Backend can be deployed on Render.

Required environment variables:

MONGO_URI
JWT_SECRET

Optional environment variables:

PORT
CLIENT_ORIGIN

Frontend can be deployed on GitHub Pages from the frontend/ folder if copied into a Pages-supported folder, or hosted on Netlify/Vercel as a static site.

Architecture Notes

NexMart uses a separated frontend and backend architecture.

The frontend handles UI pages, cart display, auth forms, checkout forms, dashboard views, API calls, and localStorage guest cart.
The backend handles auth, JWT verification, product data, cart persistence, orders, admin routes, and MongoDB models.
Admin-only routes are protected with both authentication middleware and admin middleware.
Customer cart items are stored in MongoDB after login, while guest cart items are stored in localStorage.
Accessibility

Accessibility support includes:

Semantic page structure
Bootstrap responsive layout
Keyboard-friendly links and buttons
Clear form fields
Toast feedback messages
Safer product card rendering
aria-label support on product images and ratings
Performance

Performance notes:

Static frontend files
Lightweight custom JavaScript
Paginated product listing
MongoDB query sorting and limits
No frontend build step required
Testing Checklist

Before final submission:

Run backend syntax check:
cd backend
npm run check
node --check routes/auth.js
node --check routes/products.js
node --check routes/cart.js
node --check routes/orders.js
node --check routes/admin.js
node --check middleware/authMiddleware.js
node --check middleware/adminMiddleware.js

Manual test:

Register customer
Login customer
Browse products
Open product detail
Add product as guest
Login and confirm cart flow
Update cart quantity
Checkout with simulated payment
View order history
Login admin
Create product
Edit product
Delete product
View admin orders and users
Test mobile responsiveness
Test backend health route
Lessons Learned
Building a full-stack ecommerce flow
Creating JWT authentication
Protecting admin routes
Designing MongoDB models for products, carts, and orders
Building cart and checkout logic
Handling guest cart with localStorage
Creating a realistic internship-ready ecommerce project
Future Improvements
Add real payment gateway integration
Add product image uploads
Add product reviews
Add wishlist feature
Add order invoice download
Add email confirmations
Add password reset
Add search suggestions
Add automated API tests
Add React frontend version later
