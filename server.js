/**
 * NEST E-Commerce Website - Full-Stack Express Server (server.js)
 * Connects directly to MongoDB Atlas and handles:
 * - Real-time User Authentication (Register / Login)
 * - Complete User Activity Tracking & Audit Logs
 * - Dynamic Order Lifecycle & Stock Deductions
 * - Products, Categories, Reviews, Coupons, Cart & Wishlist persistence
 * - Static Web Asset Delivery
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sahooranjanrashmi009_db_user:2Je6PSZBiGroyumj@cluster0.xl0au34.mongodb.net/nest_ecommerce";
const DB_NAME = process.env.DB_NAME || "nest_ecommerce";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dbClient = null;
let db = null;

// Helper: Ensure Database Connection
async function getDb() {
  if (db) return db;
  try {
    dbClient = new MongoClient(MONGODB_URI);
    await dbClient.connect();
    db = dbClient.db(DB_NAME);
    console.log(`✓ Connected to MongoDB Atlas [${DB_NAME}]`);
    return db;
  } catch (err) {
    console.error("MongoDB Atlas connection error:", err.message);
    throw err;
  }
}

// Helper: Log User Activity to MongoDB Atlas
async function logActivity(action, details = {}) {
  try {
    const database = await getDb();
    const logEntry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      action: action,
      userId: details.userId || "anonymous",
      userEmail: details.userEmail || details.email || "guest",
      userName: details.userName || details.name || "Guest User",
      description: details.description || "",
      metadata: details.metadata || {},
      ip: details.ip || "127.0.0.1",
      timestamp: new Date().toISOString()
    };
    await database.collection("activity_logs").insertOne(logEntry);
    return logEntry;
  } catch (e) {
    console.warn("Activity logging notice:", e.message);
  }
}

// -------------------------------------------------------------
// 1. HEALTH & DATABASE STATUS API
// -------------------------------------------------------------
const { seedMongoDB } = require('./mongo_seed');

// Lightweight health-check endpoint for Render / cloud monitoring
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/db-status', async (req, res) => {
  try {
    const database = await getDb();
    const collections = await database.listCollections().toArray();
    const stats = {};
    for (const c of collections) {
      stats[c.name] = await database.collection(c.name).countDocuments();
    }
    res.json({
      success: true,
      status: "connected",
      database: DB_NAME,
      host: "Cluster0.xl0au34.mongodb.net",
      collections: stats,
      serverTime: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, status: "error", message: err.message });
  }
});

app.post('/api/reset-database', async (req, res) => {
  try {
    await seedMongoDB(true);
    res.json({ success: true, message: "MongoDB Atlas database reset and re-seeded successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 2. USER AUTHENTICATION & REGISTRATION API
// -------------------------------------------------------------
// Register new user (person signup) -> stores in MongoDB Atlas!
app.post('/api/auth/register', async (req, res) => {
  try {
    const database = await getDb();
    const { name, email, phone, password, role = "customer", address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const usersCol = database.collection("users");

    // Check if user already exists in MongoDB
    const existing = await usersCol.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : "",
      password: password, // In production, hash with bcrypt
      role: role || "customer",
      status: "active",
      address: address || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await usersCol.insertOne(newUser);
    newUser._id = result.insertedId;

    // Log user registration activity into MongoDB Atlas
    await logActivity("user_registered", {
      userId: newUser.id,
      userEmail: newUser.email,
      userName: newUser.name,
      description: `New user account created: ${newUser.name} (${newUser.email})`,
      metadata: { role: newUser.role, phone: newUser.phone }
    });

    console.log(`✓ New User Registered and Stored in MongoDB: ${newUser.email}`);
    res.status(201).json({ success: true, message: "Account created successfully in MongoDB", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// User login -> validates against MongoDB Atlas
app.post('/api/auth/login', async (req, res) => {
  try {
    const database = await getDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await database.collection("users").findOne({ email: cleanEmail, password: password });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Log login activity in MongoDB Atlas
    await logActivity("user_logged_in", {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      description: `User logged in: ${user.name} (${user.email})`,
      metadata: { role: user.role }
    });

    res.json({ success: true, message: "Login successful", user: user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 3. USER MANAGEMENT & PROFILE UPDATES API
// -------------------------------------------------------------
app.get('/api/users', async (req, res) => {
  try {
    const database = await getDb();
    const users = await database.collection("users").find({}).sort({ createdAt: -1 }).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    const user = await database.collection("users").findOne({
      $or: [{ id: id }, { email: id.toLowerCase() }]
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user profile, address, or password in MongoDB Atlas
app.put('/api/users/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates._id; // Never overwrite MongoDB _id

    const usersCol = database.collection("users");
    const result = await usersCol.findOneAndUpdate(
      { $or: [{ id: id }, { email: id.toLowerCase() }] },
      { $set: updates },
      { returnDocument: 'after' }
    );

    const updatedUser = result.value || result;
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await logActivity("profile_updated", {
      userId: updatedUser.id || id,
      userEmail: updatedUser.email || id,
      userName: updatedUser.name || "User",
      description: `User profile updated for ${updatedUser.name || id}`,
      metadata: { updatedFields: Object.keys(req.body) }
    });

    res.json({ success: true, message: "User profile updated in MongoDB", user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 4. ORDER MANAGEMENT & CHECKOUT API
// -------------------------------------------------------------
// Place order -> stores in MongoDB Atlas 'orders' and decrements product stock
app.post('/api/orders', async (req, res) => {
  try {
    const database = await getDb();
    const orderData = req.body;

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    const orderId = orderData.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      ...orderData,
      id: orderId,
      orderStatus: orderData.orderStatus || "processing",
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === "cod" ? "pending" : "paid"),
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const ordersCol = database.collection("orders");
    const result = await ordersCol.insertOne(newOrder);
    newOrder._id = result.insertedId;

    // Deduct stock in MongoDB Atlas products collection
    const productsCol = database.collection("products");
    for (const item of newOrder.items) {
      const prodId = item.productId || item.id;
      const qty = Number(item.quantity) || 1;
      if (prodId) {
        await productsCol.updateOne(
          { $or: [{ id: prodId }, { slug: prodId }] },
          { $inc: { stock: -qty } }
        );
      }
    }

    // Log order placed activity in MongoDB Atlas
    await logActivity("order_placed", {
      userId: newOrder.userId,
      userEmail: newOrder.customerEmail,
      userName: newOrder.customerName,
      description: `New order #${orderId} placed for ₹${newOrder.total} (${newOrder.items.length} items)`,
      metadata: {
        orderId: orderId,
        total: newOrder.total,
        paymentMethod: newOrder.paymentMethod,
        itemCount: newOrder.items.length
      }
    });

    console.log(`✓ Order #${orderId} Stored in MongoDB Atlas for ${newOrder.customerName}`);
    res.status(201).json({ success: true, message: "Order placed and saved to MongoDB Atlas", order: newOrder });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const database = await getDb();
    const { userId, email, status } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (email) filter.customerEmail = email.toLowerCase();
    if (status && status !== 'all') filter.orderStatus = status;

    const orders = await database.collection("orders").find(filter).sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    const order = await database.collection("orders").findOne({ id: id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update order status (Admin) -> saves in MongoDB Atlas
app.put('/api/orders/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates._id;

    const result = await database.collection("orders").findOneAndUpdate(
      { id: id },
      { $set: updates },
      { returnDocument: 'after' }
    );

    const updated = result.value || result;
    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });

    await logActivity("order_status_updated", {
      userId: updated.userId || "admin",
      userEmail: updated.customerEmail || "admin@nest.com",
      userName: "Admin",
      description: `Order #${id} status updated to '${updates.orderStatus || 'updated'}'`,
      metadata: { orderId: id, updates: updates }
    });

    res.json({ success: true, message: "Order updated in MongoDB Atlas", order: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 5. PRODUCTS API (CRUD & STOCK)
// -------------------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    const database = await getDb();
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const products = await database.collection("products").find(filter).sort({ createdAt: -1 }).toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    const product = await database.collection("products").findOne({
      $or: [{ id: id }, { slug: id }]
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const database = await getDb();
    const newProd = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await database.collection("products").insertOne(newProd);

    await logActivity("product_created", {
      userId: "admin",
      userEmail: "admin@nest.com",
      userName: "Administrator",
      description: `New product added: ${newProd.name} (SKU: ${newProd.sku || newProd.id})`,
      metadata: { productId: newProd.id, price: newProd.price, category: newProd.category }
    });

    res.status(201).json({ success: true, message: "Product created in MongoDB Atlas", product: newProd });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates._id;

    const result = await database.collection("products").findOneAndUpdate(
      { $or: [{ id: id }, { slug: id }] },
      { $set: updates },
      { returnDocument: 'after' }
    );
    res.json({ success: true, product: result.value || result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    await database.collection("products").deleteOne({ $or: [{ id: id }, { slug: id }] });

    await logActivity("product_deleted", {
      userId: "admin",
      userEmail: "admin@nest.com",
      userName: "Administrator",
      description: `Product #${id} deleted from catalog`,
      metadata: { productId: id }
    });

    res.json({ success: true, message: "Product deleted from MongoDB Atlas" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 6. CATEGORIES & COUPONS API
// -------------------------------------------------------------
app.get('/api/categories', async (req, res) => {
  try {
    const database = await getDb();
    const categories = await database.collection("categories").find({}).toArray();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const database = await getDb();
    const newCat = { ...req.body, id: req.body.id || `cat-${Date.now()}` };
    await database.collection("categories").insertOne(newCat);
    res.status(201).json({ success: true, category: newCat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/coupons', async (req, res) => {
  try {
    const database = await getDb();
    const coupons = await database.collection("coupons").find({}).toArray();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 7. PRODUCT REVIEWS API
// -------------------------------------------------------------
app.get('/api/reviews', async (req, res) => {
  try {
    const database = await getDb();
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    const reviews = await database.collection("reviews").find(filter).sort({ date: -1 }).toArray();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const database = await getDb();
    const newReview = {
      ...req.body,
      id: req.body.id || `rev-${Date.now()}`,
      status: req.body.status || "approved",
      date: req.body.date || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString()
    };
    await database.collection("reviews").insertOne(newReview);

    await logActivity("review_posted", {
      userId: newReview.userId || "guest",
      userEmail: newReview.userEmail || "anonymous",
      userName: newReview.userName || "Customer",
      description: `Review posted for product #${newReview.productId} (${newReview.rating} stars)`,
      metadata: { reviewId: newReview.id, rating: newReview.rating, comment: newReview.comment }
    });

    res.status(201).json({ success: true, message: "Review stored in MongoDB Atlas", review: newReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 8. CART & WISHLIST PERSISTENCE IN MONGODB ATLAS
// -------------------------------------------------------------
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const database = await getDb();
    const { userId } = req.params;
    const record = await database.collection("carts").findOne({ userId });
    res.json(record ? record.items : []);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/cart/sync', async (req, res) => {
  try {
    const database = await getDb();
    const { userId, items } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    await database.collection("carts").updateOne(
      { userId },
      { $set: { userId, items, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    res.json({ success: true, message: "Cart synced to MongoDB Atlas" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    const database = await getDb();
    const { userId } = req.params;
    const record = await database.collection("wishlists").findOne({ userId });
    res.json(record ? record.items : []);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/wishlist/sync', async (req, res) => {
  try {
    const database = await getDb();
    const { userId, items } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    await database.collection("wishlists").updateOne(
      { userId },
      { $set: { userId, items, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    res.json({ success: true, message: "Wishlist synced to MongoDB Atlas" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 9. GENERAL USER ACTIVITY LOGGING API
// -------------------------------------------------------------
// "user do any thing all data stored" -> Every action stored in MongoDB Atlas!
app.post('/api/activity', async (req, res) => {
  try {
    const { action, userId, userEmail, userName, description, metadata } = req.body;
    const log = await logActivity(action, {
      userId,
      userEmail,
      userName,
      description,
      metadata,
      ip: req.ip
    });
    res.status(201).json({ success: true, log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/activity', async (req, res) => {
  try {
    const database = await getDb();
    const limit = Math.min(parseInt(req.query.limit || "100", 10), 500);
    const logs = await database.collection("activity_logs").find({}).sort({ timestamp: -1 }).limit(limit).toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 10. GENERIC REST FALLBACK API FOR ALL NESTDB COLLECTIONS
// -------------------------------------------------------------
app.get('/api/:collection', async (req, res) => {
  try {
    const database = await getDb();
    const { collection } = req.params;
    const docs = await database.collection(collection).find({}).sort({ createdAt: -1 }).toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/:collection', async (req, res) => {
  try {
    const database = await getDb();
    const { collection } = req.params;
    const doc = {
      ...req.body,
      id: req.body.id || `${collection.slice(0, 3)}-${Date.now()}`,
      createdAt: req.body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await database.collection(collection).insertOne(doc);
    res.status(201).json({ success: true, doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/:collection/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { collection, id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates._id;

    const result = await database.collection(collection).findOneAndUpdate(
      { $or: [{ id: id }, { slug: id }] },
      { $set: updates },
      { returnDocument: 'after' }
    );
    res.json({ success: true, doc: result.value || result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/:collection/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { collection, id } = req.params;
    await database.collection(collection).deleteOne({ $or: [{ id: id }, { slug: id }] });
    res.json({ success: true, message: `Deleted from ${collection}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 11. STATIC FILE DELIVERY
// -------------------------------------------------------------
// Serve all front-end assets directly
app.use(express.static(path.join(__dirname)));

// Root route sends index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin redirect helper
app.get(['/admin', '/admin/'], (req, res) => {
  res.redirect('/admin/dashboard.html');
});

// Start Server and connect to MongoDB Atlas
async function startServer() {
  try {
    await getDb();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(`🚀 NEST Full-Stack Server running on port ${PORT}`);
      console.log(`📦 MongoDB Atlas: Connected to '${DB_NAME}'`);
      console.log(`📡 REST API Endpoints active at /api/`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
