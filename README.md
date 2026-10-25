# NEST E-Commerce Website

> A professional, modern, fully responsive e-commerce web application built using **HTML5**, **CSS3**, **Bootstrap 5**, **Vanilla JavaScript (ES6+)**, and **MongoDB Atlas** schema design. Developed as an exemplary B.Tech CSE Final Year Capstone Project.

---

## 🌟 Key Features

### 🛒 Customer Storefront (13 Complete Pages)

- **Home (`index.html`)**: Dynamic hero slider banners, category shortcuts, featured & trending product carousels, newsletter subscription, and responsive footer.
- **Shop Catalog (`shop.html`)**: Multi-faceted sidebar filtering (by category, live price slider, in-stock availability), sorting (price low/high, rating, newest), and dynamic product grid.
- **Category Showcase (`category.html`)**: Dedicated landing for Groceries, Electronics, Furniture, Fashion, and Beauty.
- **Product Details (`product-details.html`)**: Interactive image gallery, stock indicators, dynamic price with discount badge, quantity selector, customer ratings & reviews, and related products recommendations.
- **Shopping Cart (`cart.html`)**: Real-time quantity steppers, instant subtotal & tax recalculation, promotional coupon validation (`NEST10`, `SAVE20`, `WELCOME50`), and free shipping thresholds.
- **Checkout & Payment (`checkout.html`)**: Comprehensive shipping and billing validation, Cash on Delivery (COD) and Online UPI/Card demo payment options.
- **Order Success (`order-success.html`)**: Order confirmation summary with unique order ID generation and direct tracking link.
- **Customer Auth (`login.html`, `register.html`)**: Secure client authentication with 1-click demo login credentials.
- **Customer Portal (`my-account.html`, `my-orders.html`, `order-details.html`, `wishlist.html`)**: Profile editing, saved delivery addresses, password management, visual 4-step delivery progress tracking timeline, and wishlist to cart transfers.

### 🛡️ Admin Dashboard (`admin/` - 13 Complete Pages)

- **Overview (`admin/dashboard.html`)**: Key performance indicator (KPI) metric cards (Revenue, Orders, Customers, Products), live order feed, and low-stock warnings.
- **Product Management (`admin/products.html`, `admin/add-product.html`)**: Full CRUD product management, SKU tracking, pricing, and category assignments.
- **Category Management (`admin/categories.html`)**: Organization of catalog departments.
- **Order Fulfillment (`admin/orders.html`, `admin/order-details.html`)**: Real-time order status lifecycle progression (`Processing` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`).
- **Inventory Control (`admin/inventory.html`)**: Live stock management with critical low-stock alert thresholds.
- **Customer Directory (`admin/customers.html`)**: Customer order history and account status moderation.
- **Discounts & Coupons (`admin/coupons.html`)**: Promotional code creator with minimum spend rules and expiry dates.
- **Review Moderation (`admin/reviews.html`)**: Customer rating review approval and moderation.
- **Sales Analytics & Reports (`admin/reports.html`)**: Order value summaries with one-click **CSV Report Export** download.
- **Store Settings (`admin/settings.html`)**: Store profile, delivery rules, and 1-click database reset.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ or v22+, already installed).
- Modern web browser (Chrome, Edge, Firefox).
- MongoDB Atlas Cluster (`nest_ecommerce` database configured in `.env`).

### Launch Locally (Full-Stack with Live MongoDB Atlas)

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Seed database with full catalog (17 products, categories, coupons, demo users)
npm run seed

# 3. Start full-stack Node.js & MongoDB Atlas server
npm start
```

Open your browser and navigate to:

- **Storefront**: [http://localhost:5000](http://localhost:5000)
- **Admin Panel**: [http://localhost:5000/admin/login.html](http://localhost:5000/admin/login.html)
- **Live Database Status API**: [http://localhost:5000/api/db-status](http://localhost:5000/api/db-status)

---

## 🌐 Deploy to Render (Cloud Hosting)

This project is fully configured and ready for 1-click deployment on [Render](https://render.com/).

### Step 1: Ensure MongoDB Atlas Allows Access
1. Open [MongoDB Atlas](https://cloud.mongodb.com/).
2. Navigate to **Security** ➔ **Network Access**.
3. Ensure there is an IP entry for `0.0.0.0/0` (**Allow Access from Anywhere**). *(Render web services run on dynamic IPs)*.

### Step 2: Push Your Project to GitHub
```bash
git add .
git commit -m "Deploy Nest E-Commerce to Render"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 3: Create Web Service on Render
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Render will automatically detect settings from [`render.yaml`](render.yaml):
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. In the **Environment Variables** section, add:
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `DB_NAME`: `nest_ecommerce`
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**!

---

## 🔑 Demo Login Credentials

| Role                    | Email                 | Password        |
| ----------------------- | --------------------- | --------------- |
| **Administrator** | `admin@nest.com`    | `admin123`    |
| **Customer**      | `customer@nest.com` | `customer123` |

---

## 📂 Project Structure

```
d:/NEST/
├── index.html              # Homepage
├── shop.html               # Shop & Catalog
├── category.html           # Category view
├── product-details.html    # Product details & reviews
├── cart.html               # Shopping cart
├── checkout.html           # Checkout & Payment
├── order-success.html      # Confirmation
├── login.html              # Customer login
├── register.html           # Customer registration
├── wishlist.html           # Wishlist
├── my-account.html         # Customer profile & address
├── my-orders.html          # Order history
├── order-details.html      # Shipment tracking timeline
│
├── admin/                  # Admin Dashboard Pages
│   ├── login.html          # Admin secure login
│   ├── dashboard.html      # Admin overview & KPIs
│   ├── products.html       # Product management
│   ├── add-product.html    # Add new product
│   ├── categories.html     # Category management
│   ├── orders.html         # Orders management
│   ├── order-details.html  # Order inspection
│   ├── customers.html      # Customer directory
│   ├── inventory.html      # Stock control
│   ├── coupons.html        # Discount coupons
│   ├── reviews.html        # Review moderation
│   ├── reports.html        # Sales analytics & CSV export
│   └── settings.html       # Store & database settings
│
├── assets/
│   ├── css/
│   │   ├── style.css       # Core design system
│   │   ├── components.css  # Product cards, badges, steppers, toasts
│   │   ├── responsive.css  # Mobile bottom nav & breakpoints
│   │   └── admin.css       # Admin dark forest sidebar & cards
│   ├── js/
│   │   ├── config.js       # App config, NestDB & Seed data
│   │   ├── common.js       # Toasts, cart/wishlist sync, search
│   │   ├── products.js     # Catalog filters & single view
│   │   ├── search.js       # Auto-complete suggestions
│   │   ├── cart.js         # Cart operations & discounts
│   │   ├── wishlist.js     # Wishlist operations
│   │   ├── checkout.js     # Checkout & stock deduction
│   │   ├── auth.js         # Authentication logic
│   │   ├── account.js      # Customer account settings
│   │   ├── orders.js       # Order history & timeline
│   │   └── admin/          # Admin JavaScript modules
│   └── images/
│       ├── logo/           # logo.svg, logo.png, favicon.svg
│       ├── banners/        # Hero and promo banners
│       ├── categories/     # Category covers
│       └── products/       # HD Product photography
│
├── mongo_seed.js           # MongoDB Atlas Seed Script
├── README.md               # Documentation
└── .gitignore
```

---

## 💾 MongoDB Atlas Integration & Real-Time Data Persistence

- **Live Database Connection**: Connected to MongoDB Atlas cluster (`Cluster0.xl0au34.mongodb.net`, database `nest_ecommerce`).
- **Real-Time Data Storage**:
  - **Signups & Registration**: Every user registration is stored directly into the `users` collection.
  - **Orders**: Every checkout creates an order record in `orders` and decrements product inventory in `products`.
  - **User Activities**: Every login, registration, order, profile update, cart action, and review is recorded into `activity_logs`.
  - **Customer Profiles**: Address, name, phone, and password changes sync directly to `users`.
  - **Reviews & Ratings**: Customer reviews submitted on product pages save into `reviews`.
  - **Catalog Management**: Admin additions, modifications, and deletions for products and categories update MongoDB Atlas in real time.
- **REST Backend Engine**: Powered by Express (`server.js`) on port 5000 with CORS and auto-reconnection.
- **Client Data Layer**: `NestDB` ([`assets/js/config.js`](assets/js/config.js)) provides instant UI responsiveness with automatic background synchronization to MongoDB Atlas.

## 👨‍💻 Authors

| Name                          | Role      |
| ----------------------------- | --------- |
| **Rashmi Ranjan Sahoo** | Developer |
| **Prachurya Samal**     | Developer |
| **Rahul Barika**        | Developer |