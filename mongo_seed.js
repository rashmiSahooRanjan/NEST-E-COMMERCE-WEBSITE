/**
 * NEST E-Commerce Website - MongoDB Atlas Seed Script (mongo_seed.js)
 * Seeds comprehensive store data into MongoDB Atlas database
 * Run with: node mongo_seed.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sahooranjanrashmi009_db_user:2Je6PSZBiGroyumj@cluster0.xl0au34.mongodb.net/nest_ecommerce";
const DB_NAME = process.env.DB_NAME || "nest_ecommerce";

const seedData = {
  categories: [
    { id: "cat-1", slug: "groceries", name: "Fresh Fruits & Organic Groceries", icon: "bi-basket2", image: "assets/images/categories/groceries.jpg", count: 8, status: "active" },
    { id: "cat-2", slug: "electronics", name: "Electronics & Smart Gadgets", icon: "bi-laptop", image: "assets/images/categories/electronics.jpg", count: 6, status: "active" },
    { id: "cat-3", slug: "furniture", name: "Furniture & Modern Living", icon: "bi-lamp", image: "assets/images/categories/furniture.jpg", count: 5, status: "active" },
    { id: "cat-4", slug: "fashion", name: "Fashion & Lifestyle", icon: "bi-handbag", image: "assets/images/categories/fashion.jpg", count: 5, status: "active" },
    { id: "cat-5", slug: "beauty", name: "Beauty & Herbal Wellness", icon: "bi-flower1", image: "assets/images/categories/beauty.jpg", count: 4, status: "active" }
  ],
  products: [
    {
      id: "prod-1",
      name: "Farm Fresh Crisp Shimla Royal Red Apples (1kg)",
      slug: "farm-fresh-shimla-red-apples",
      category: "groceries",
      categoryName: "Fresh Fruits & Organic Groceries",
      price: 180,
      oldPrice: 220,
      discountPercent: 18,
      rating: 4.8,
      ratingCount: 142,
      stock: 45,
      sku: "GRO-APP-001",
      image: "assets/images/products/apples-1.jpg",
      images: ["assets/images/products/apples-1.jpg"],
      description: "Hand-picked sweet and crunchy Shimla apples grown organically in high altitude orchards. Naturally waxed, bursting with antioxidants and rich flavor.",
      features: ["100% Organically Farmed", "Pesticide-Free Certified", "Vacuum Safe Packing", "Same-day Morning Harvest"],
      status: "active",
      featured: true,
      hot: false,
      newArrival: true,
      createdAt: "2026-10-20T10:00:00Z"
    },
    {
      id: "prod-2",
      name: "Cold-Pressed Extra Virgin Olive Oil (500ml)",
      slug: "cold-pressed-olive-oil",
      category: "groceries",
      categoryName: "Fresh Fruits & Organic Groceries",
      price: 649,
      oldPrice: 799,
      discountPercent: 19,
      rating: 4.9,
      ratingCount: 88,
      stock: 30,
      sku: "GRO-OIL-002",
      image: "assets/images/products/oliveoil-1.jpg",
      images: ["assets/images/products/oliveoil-1.jpg"],
      description: "First cold-pressed Mediterranean extra virgin olive oil with low acidity. Ideal for heart-healthy cooking, gourmet salads, and gentle roasting.",
      features: ["Single Estate Olives", "Cold Extracted < 27°C", "Dark Glass UV Bottle", "High Polyphenols"],
      status: "active",
      featured: true,
      hot: true,
      newArrival: false,
      createdAt: "2026-10-18T10:00:00Z"
    },
    {
      id: "prod-3",
      name: "Raw Organic Forest Multifloral Honey (400g)",
      slug: "raw-organic-forest-honey",
      category: "groceries",
      categoryName: "Fresh Fruits & Organic Groceries",
      price: 320,
      oldPrice: 380,
      discountPercent: 16,
      rating: 4.7,
      ratingCount: 94,
      stock: 55,
      sku: "GRO-HON-003",
      image: "assets/images/products/honey-1.jpg",
      images: ["assets/images/products/honey-1.jpg"],
      description: "Unfiltered, unprocessed raw wildflower honey collected sustainably from pristine mountain apiaries. Retains natural pollen and healing enzymes.",
      features: ["Unpasteurized & Pure", "No Added Sugar", "Rich in Live Enzymes", "Eco-friendly Glass Jar"],
      status: "active",
      featured: false,
      hot: false,
      newArrival: false,
      createdAt: "2026-10-15T10:00:00Z"
    },
    {
      id: "prod-4",
      name: "Tender Hydroponic Baby Spinach Leaves (250g)",
      slug: "tender-baby-spinach",
      category: "groceries",
      categoryName: "Fresh Fruits & Organic Groceries",
      price: 65,
      oldPrice: 85,
      discountPercent: 24,
      rating: 4.6,
      ratingCount: 65,
      stock: 40,
      sku: "GRO-SPN-004",
      image: "assets/images/products/spinach-1.jpg",
      images: ["assets/images/products/spinach-1.jpg"],
      description: "Tender, iron-rich baby spinach leaves cultivated in nutrient-rich hydroponic water systems. Pre-washed and ready for healthy crisp salads or cooking.",
      features: ["Soil-less Hydroponic", "Pre-washed 3x", "Zero Bitter Taste", "Nitrate Safe"],
      status: "active",
      featured: true,
      hot: false,
      newArrival: true,
      createdAt: "2026-10-21T10:00:00Z"
    },
    {
      id: "prod-5",
      name: "NEST Wireless Noise-Cancelling Headphones Pro",
      slug: "nest-wireless-headphones-pro",
      category: "electronics",
      categoryName: "Electronics & Smart Gadgets",
      price: 2499,
      oldPrice: 3199,
      discountPercent: 22,
      rating: 4.9,
      ratingCount: 312,
      stock: 25,
      sku: "ELE-HDP-005",
      image: "assets/images/products/headphones-1.jpg",
      images: ["assets/images/products/headphones-1.jpg", "assets/images/products/headphones-2.jpg"],
      description: "Immersive sound with 40mm titanium drivers, hybrid Active Noise Cancellation (ANC), Transparency Mode, and 45-hour quick-charge battery life.",
      features: ["Active Noise Cancellation 38dB", "Bluetooth 5.3 Multipoint", "45H Long Playtime", "Memory Foam Ear Cushions"],
      status: "active",
      featured: true,
      hot: true,
      newArrival: true,
      createdAt: "2026-10-22T10:00:00Z"
    },
    {
      id: "prod-6",
      name: "NEST Smart Pulse Fitness Watch Series 7",
      slug: "nest-smart-pulse-watch-7",
      category: "electronics",
      categoryName: "Electronics & Smart Gadgets",
      price: 3499,
      oldPrice: 4999,
      discountPercent: 30,
      rating: 4.8,
      ratingCount: 220,
      stock: 18,
      sku: "ELE-WCH-006",
      image: "assets/images/products/smartwatch-1.jpg",
      images: ["assets/images/products/smartwatch-1.jpg", "assets/images/products/smartwatch-2.jpg"],
      description: "Advanced health companion featuring 1.85-inch curved AMOLED display, continuous heart-rate & SpO2 monitoring, onboard GPS, and 100+ sport modes.",
      features: ["AMOLED Always-On Display", "SpO2 & Sleep Tracker", "IP68 Water Resistance", "10-Day Battery Life"],
      status: "active",
      featured: true,
      hot: true,
      newArrival: false,
      createdAt: "2026-10-19T10:00:00Z"
    },
    {
      id: "prod-7",
      name: "Ergonomic Ultra-Fast Wireless Gaming Mouse",
      slug: "ultra-fast-wireless-mouse",
      category: "electronics",
      categoryName: "Electronics & Smart Gadgets",
      price: 1299,
      oldPrice: 1799,
      discountPercent: 28,
      rating: 4.7,
      ratingCount: 104,
      stock: 35,
      sku: "ELE-MOU-007",
      image: "assets/images/products/mouse-1.jpg",
      images: ["assets/images/products/mouse-1.jpg"],
      description: "Pro-grade wireless gaming mouse with 16,000 DPI optical sensor, ultra-lightweight honeycomb shell, RGB backlighting, and lag-free 2.4GHz receiver.",
      features: ["16,000 DPI Optical Sensor", "Sub-1ms Wireless Response", "70-Hour Battery", "PTFE Smooth Glide Skates"],
      status: "active",
      featured: false,
      hot: false,
      newArrival: true,
      createdAt: "2026-10-23T10:00:00Z"
    },
    {
      id: "prod-8",
      name: "RGB Mechanical Keyboard with Linear Red Switches",
      slug: "rgb-mechanical-gaming-keyboard",
      category: "electronics",
      categoryName: "Electronics & Smart Gadgets",
      price: 2799,
      oldPrice: 3599,
      discountPercent: 22,
      rating: 4.8,
      ratingCount: 167,
      stock: 22,
      sku: "ELE-KBD-008",
      image: "assets/images/products/keyboard-1.jpg",
      images: ["assets/images/products/keyboard-1.jpg"],
      description: "Tenkeyless (87-key) compact mechanical keyboard engineered with hot-swappable linear red switches, per-key RGB backlighting, and braided USB-C cable.",
      features: ["Hot-Swappable Switches", "Aircraft Aluminum Frame", "Double-Shot PBT Keycaps", "Anti-Ghosting N-Key Rollover"],
      status: "active",
      featured: false,
      hot: false,
      newArrival: false,
      createdAt: "2026-10-17T10:00:00Z"
    },
    {
      id: "prod-9",
      name: "Earmes Ergonomic Wooden Lounge Armchair",
      slug: "earmes-wooden-lounge-armchair",
      category: "furniture",
      categoryName: "Furniture & Modern Living",
      price: 4999,
      oldPrice: 6199,
      discountPercent: 19,
      rating: 4.9,
      ratingCount: 52,
      stock: 12,
      sku: "FUR-CHR-009",
      image: "assets/images/products/chair-1.jpg",
      images: ["assets/images/products/chair-1.jpg", "assets/images/products/chair-2.jpg"],
      description: "Iconic mid-century Scandinavian lounge armchair. Crafted from molded natural birch plywood and upholstered with breathable premium linen fabric.",
      features: ["Solid Birch & Oak Plywood", "High Resilience Foam", "Removable Linen Cover", "Reinforced Steel Base"],
      status: "active",
      featured: true,
      hot: true,
      newArrival: false,
      createdAt: "2026-10-12T10:00:00Z"
    },
    {
      id: "prod-10",
      name: "Scandinavian Minimalist Oak Dining & Study Table",
      slug: "scandinavian-oak-study-table",
      category: "furniture",
      categoryName: "Furniture & Modern Living",
      price: 7499,
      oldPrice: 8999,
      discountPercent: 17,
      rating: 4.8,
      ratingCount: 38,
      stock: 9,
      sku: "FUR-TBL-010",
      image: "assets/images/products/table-1.jpg",
      images: ["assets/images/products/table-1.jpg"],
      description: "Clean silhouette solid oak desk with integrated cable routing trough and beveled chamfer edges. Perfect for work-from-home or family dining.",
      features: ["100% Solid Malaysian Oak", "Scratch-Resistant Matte Finish", "Built-in Cable Pass", "Load Capacity 120kg"],
      status: "active",
      featured: false,
      hot: false,
      newArrival: true,
      createdAt: "2026-10-14T10:00:00Z"
    },
    {
      id: "prod-11",
      name: "Handwoven Decorative Geometric Throw Cushions (Set of 2)",
      slug: "geometric-throw-cushions-set",
      category: "furniture",
      categoryName: "Furniture & Modern Living",
      price: 899,
      oldPrice: 1199,
      discountPercent: 25,
      rating: 4.7,
      ratingCount: 71,
      stock: 28,
      sku: "FUR-CSH-011",
      image: "assets/images/products/cushions-1.jpg",
      images: ["assets/images/products/cushions-1.jpg"],
      description: "Add a touch of bohemian warmth to your living room sofa with these hand-tufted cotton canvas cushion covers featuring hidden durable brass zippers.",
      features: ["100% Cotton Canvas", "Microfiber Insert Included", "Hidden Zipper Closure", "Machine Washable"],
      status: "active",
      featured: false,
      hot: false,
      newArrival: false,
      createdAt: "2026-10-11T10:00:00Z"
    },
    {
      id: "prod-12",
      name: "Warm Dimmable Wooden Tripod Ambient Floor Lamp",
      slug: "wooden-tripod-ambient-floor-lamp",
      category: "furniture",
      categoryName: "Furniture & Modern Living",
      price: 1999,
      oldPrice: 2499,
      discountPercent: 20,
      rating: 4.9,
      ratingCount: 43,
      stock: 16,
      sku: "FUR-LMP-012",
      image: "assets/images/products/lamp-1.jpg",
      images: ["assets/images/products/lamp-1.jpg"],
      description: "Stately tripod floor lamp constructed from teakwood with an textured oatmeal linen drum shade. Creates warm relaxing atmosphere in bedrooms and lounges.",
      features: ["Natural Teakwood Legs", "Stepless Rotary Dimmer", "E27 Warm LED Bulb Included", "Fabric Braided Cord"],
      status: "active",
      featured: true,
      hot: false,
      newArrival: false,
      createdAt: "2026-10-16T10:00:00Z"
    },
    {
      id: "prod-13",
      name: "Pure Egyptian Cotton Relaxed Casual Shirt",
      slug: "egyptian-cotton-casual-shirt",
      category: "fashion",
      categoryName: "Fashion & Lifestyle",
      price: 1199,
      oldPrice: 1599,
      discountPercent: 25,
      rating: 4.6,
      ratingCount: 112,
      stock: 35,
      sku: "FAS-SHT-013",
      image: "assets/images/products/shirt-1.jpg",
      images: ["assets/images/products/shirt-1.jpg", "assets/images/products/shirt-2.jpg"],
      description: "Breathable, pre-shrunk combed Egyptian cotton shirt in an effortless relaxed fit. Features mother-of-pearl buttons and a soft cutaway collar.",
      features: ["100% Combed Egyptian Cotton", "Breathable Oxford Weave", "Wrinkle-Resistant Treatment", "Reinforced French Seams"],
      status: "active",
      featured: true,
      hot: false,
      newArrival: true,
      createdAt: "2026-10-20T10:00:00Z"
    },
    {
      id: "prod-14",
      name: "Lightweight Breathable Cushion Running Sneakers",
      slug: "lightweight-cushion-running-sneakers",
      category: "fashion",
      categoryName: "Fashion & Lifestyle",
      price: 1899,
      oldPrice: 2499,
      discountPercent: 24,
      rating: 4.8,
      ratingCount: 189,
      stock: 24,
      sku: "FAS-SHS-014",
      image: "assets/images/products/shoes-1.jpg",
      images: ["assets/images/products/shoes-1.jpg", "assets/images/products/shoes-2.jpg"],
      description: "High-rebound EVA foam sole with flyknit breathable upper. Engineered for daily gym workouts, jogging, and stylish casual walking comfort.",
      features: ["Flyknit Mesh Upper", "Dual-Density Cloud Foam", "Anti-Skid Rubber Grip", "Ortholite Antibacterial Insole"],
      status: "active",
      featured: true,
      hot: true,
      newArrival: false,
      createdAt: "2026-10-19T10:00:00Z"
    },
    {
      id: "prod-15",
      name: "Water-Resistant Urban Travel Commuter Backpack",
      slug: "urban-commuter-travel-backpack",
      category: "fashion",
      categoryName: "Fashion & Lifestyle",
      price: 1499,
      oldPrice: 1999,
      discountPercent: 25,
      rating: 4.9,
      ratingCount: 144,
      stock: 30,
      sku: "FAS-BAG-015",
      image: "assets/images/products/backpack-1.jpg",
      images: ["assets/images/products/backpack-1.jpg", "assets/images/products/backpack-2.jpg"],
      description: "Slim 25L commuter backpack featuring padded compartment for 16-inch laptops, anti-theft hidden pocket, and luggage strap for easy airport travel.",
      features: ["16-inch Padded Laptop Sleeve", "Waterproof Oxford Fabric", "External USB Charging Port", "YKK Smooth Zippers"],
      status: "active",
      featured: false,
      hot: false,
      newArrival: true,
      createdAt: "2026-10-21T10:00:00Z"
    },
    {
      id: "prod-16",
      name: "Pure 99% Organic Aloe Vera Hydrating Gel (300ml)",
      slug: "organic-aloe-vera-gel",
      category: "beauty",
      categoryName: "Beauty & Herbal Wellness",
      price: 249,
      oldPrice: 320,
      discountPercent: 22,
      rating: 4.7,
      ratingCount: 205,
      stock: 60,
      sku: "BEA-ALO-016",
      image: "assets/images/products/aloevera-1.jpg",
      images: ["assets/images/products/aloevera-1.jpg"],
      description: "Cold-stabilized pure aloe vera inner leaf juice. Instant cooling relief for sun-exposed skin, lightweight scalp moisturizer, and soothing night pack.",
      features: ["99% Fresh Leaf Aloe", "Free from Parabens & Alcohol", "Non-Sticky Fast Absorption", "Multi-Use Face, Body & Hair"],
      status: "active",
      featured: true,
      hot: false,
      newArrival: false,
      createdAt: "2026-10-16T10:00:00Z"
    },
    {
      id: "prod-17",
      name: "Vitamin C + Hyaluronic Acid Radiance Face Serum (30ml)",
      slug: "vitamin-c-hyaluronic-face-serum",
      category: "beauty",
      categoryName: "Beauty & Herbal Wellness",
      price: 599,
      oldPrice: 799,
      discountPercent: 25,
      rating: 4.9,
      ratingCount: 168,
      stock: 42,
      sku: "BEA-SRM-017",
      image: "assets/images/products/serum-1.jpg",
      images: ["assets/images/products/serum-1.jpg"],
      description: "Concentrated 15% Ethyl Ascorbic Acid combined with Ferulic acid and low molecular weight Hyaluronic Acid to fade blemishes and boost glow.",
      features: ["15% Stable Vitamin C", "Ferulic Acid Antioxidant Boost", "Dermatologically Tested", "Cruelty-Free & Vegan"],
      status: "active",
      featured: true,
      hot: true,
      newArrival: true,
      createdAt: "2026-10-22T10:00:00Z"
    }
  ],
  coupons: [
    { id: "coup-1", code: "NEST10", discountType: "percent", value: 10, minSpend: 499, description: "10% off on orders above ₹499", expiryDate: "2027-12-31", status: "active" },
    { id: "coup-2", code: "SAVE20", discountType: "percent", value: 20, minSpend: 1499, description: "20% off on orders above ₹1,499", expiryDate: "2027-12-31", status: "active" },
    { id: "coup-3", code: "WELCOME50", discountType: "fixed", value: 50, minSpend: 299, description: "Flat ₹50 off on first purchase", expiryDate: "2027-12-31", status: "active" },
    { id: "coup-4", code: "FREESHIP", discountType: "fixed", value: 50, minSpend: 399, description: "Free standard shipping credit", expiryDate: "2027-12-31", status: "active" }
  ],
  users: [
    {
      id: "usr-admin-01",
      name: "Admin User",
      email: "admin@nest.com",
      password: "admin123",
      role: "admin",
      phone: "+91 98765 43210",
      status: "active",
      createdAt: "2026-10-01T00:00:00Z"
    },
    {
      id: "usr-cust-01",
      name: "John Doe",
      email: "customer@nest.com",
      password: "customer123",
      role: "customer",
      phone: "+91 91234 56789",
      address: {
        street: "42 Indiranagar 100ft Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038"
      },
      status: "active",
      createdAt: "2026-10-10T00:00:00Z"
    }
  ],
  orders: [
    {
      id: "ORD-98241",
      userId: "usr-cust-01",
      customerName: "John Doe",
      customerEmail: "customer@nest.com",
      customerPhone: "+91 91234 56789",
      items: [
        {
          productId: "prod-5",
          name: "NEST Wireless Noise-Cancelling Headphones Pro",
          price: 2499,
          quantity: 1,
          image: "assets/images/products/headphones-1.jpg"
        },
        {
          productId: "prod-1",
          name: "Farm Fresh Crisp Shimla Royal Red Apples (1kg)",
          price: 180,
          quantity: 2,
          image: "assets/images/products/apples-1.jpg"
        }
      ],
      shippingAddress: {
        fullName: "John Doe",
        phone: "+91 91234 56789",
        street: "42 Indiranagar 100ft Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038"
      },
      subtotal: 2859,
      discount: 285.9,
      couponCode: "NEST10",
      tax: 128.65,
      shipping: 0,
      total: 2701.75,
      paymentMethod: "cod",
      paymentStatus: "paid",
      orderStatus: "delivered",
      trackingSteps: [
        { title: "Order Placed", desc: "Received and confirmed", date: "24 Oct 2026, 10:30 AM", completed: true },
        { title: "Packed & Quality Checked", desc: "Inspection passed at Warehouse 3", date: "24 Oct 2026, 01:15 PM", completed: true },
        { title: "Out for Delivery", desc: "Courier partner Bluedart #BD8721", date: "25 Oct 2026, 08:45 AM", completed: true },
        { title: "Delivered", desc: "Package handed to customer", date: "25 Oct 2026, 11:20 AM", completed: true }
      ],
      createdAt: "2026-10-24T10:30:00Z"
    },
    {
      id: "ORD-98242",
      userId: "usr-cust-01",
      customerName: "John Doe",
      customerEmail: "customer@nest.com",
      customerPhone: "+91 91234 56789",
      items: [
        {
          productId: "prod-6",
          name: "NEST Smart Pulse Fitness Watch Series 7",
          price: 3499,
          quantity: 1,
          image: "assets/images/products/smartwatch-1.jpg"
        }
      ],
      shippingAddress: {
        fullName: "John Doe",
        phone: "+91 91234 56789",
        street: "42 Indiranagar 100ft Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038"
      },
      subtotal: 3499,
      discount: 0,
      couponCode: "",
      tax: 174.95,
      shipping: 0,
      total: 3673.95,
      paymentMethod: "online",
      paymentStatus: "paid",
      orderStatus: "shipped",
      trackingSteps: [
        { title: "Order Placed", desc: "Received and verified", date: "25 Oct 2026, 07:15 AM", completed: true },
        { title: "Packed & Dispatched", desc: "Dispatched from fulfillment center", date: "25 Oct 2026, 09:30 AM", completed: true },
        { title: "In Transit", desc: "Hub delivery in progress", date: "25 Oct 2026, 11:00 AM", completed: true },
        { title: "Delivered", desc: "Estimated delivery tomorrow", date: "Pending", completed: false }
      ],
      createdAt: "2026-10-25T07:15:00Z"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      productId: "prod-5",
      userName: "Rahul Sharma",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      rating: 5,
      comment: "Superb noise cancellation! Battery lasted 4 days of heavy office use. Definitely worth the price.",
      status: "approved",
      date: "2026-10-23"
    },
    {
      id: "rev-2",
      productId: "prod-1",
      userName: "Priya V.",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      rating: 5,
      comment: "Incredibly fresh and sweet apples! Delivered within 2 hours in Bengaluru.",
      status: "approved",
      date: "2026-10-24"
    }
  ],
  activity_logs: [
    {
      id: "log-seed-1",
      action: "database_initialized",
      userId: "usr-admin-01",
      userEmail: "admin@nest.com",
      description: "Database initialized with full store catalog and sample records.",
      metadata: { source: "mongo_seed.js" },
      timestamp: new Date().toISOString()
    }
  ]
};

async function seedMongoDB(forceReset = false) {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log("Connecting to MongoDB Atlas at:", MONGODB_URI.replace(/:([^:@]+)@/, ":****@"));
    await client.connect();
    const db = client.db(DB_NAME);

    for (const [colName, docs] of Object.entries(seedData)) {
      const col = db.collection(colName);
      const existingCount = await col.countDocuments();
      
      if (existingCount === 0 || forceReset) {
        if (forceReset) {
          await col.deleteMany({});
        }
        if (docs.length > 0) {
          // Clone objects to avoid mutating original
          const toInsert = docs.map(d => ({ ...d }));
          await col.insertMany(toInsert);
          console.log(`✓ Seeded ${toInsert.length} documents into collection '${colName}'`);
        }
      } else {
        console.log(`ℹ Collection '${colName}' already has ${existingCount} documents (skipping, set forceReset to true to overwrite)`);
      }
    }

    // Create indexes for faster queries
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("products").createIndex({ slug: 1 });
    await db.collection("products").createIndex({ category: 1 });
    await db.collection("orders").createIndex({ id: 1 }, { unique: true });
    await db.collection("orders").createIndex({ userId: 1 });
    await db.collection("activity_logs").createIndex({ timestamp: -1 });

    console.log("✓ MongoDB Atlas Database successfully seeded and indexed!");
  } catch (err) {
    console.error("Error seeding MongoDB:", err.message);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  const force = process.argv.includes("--force");
  seedMongoDB(force);
}

module.exports = { seedData, seedMongoDB };
