/**
 * NEST E-Commerce Website - Configuration & MongoDB Data Access Layer (config.js)
 * High-performance client-side data store with MongoDB Atlas Data API compatibility
 */

const NEST_CONFIG = {
  appName: "NEST Supermarket",
  currency: "INR",
  currencySymbol: "₹",
  taxRate: 0.05, // 5% GST
  freeShippingThreshold: 999,
  defaultShippingCost: 50,
  storagePrefix: "nest_db_",
  // MongoDB Atlas Data API configuration (Optional live sync)
  mongoApi: {
    enabled: false,
    endpoint: "https://data.mongodb-api.com/app/data-xxxx/endpoint/data/v1",
    apiKey: "",
    clusterName: "Cluster0",
    database: "nest_ecommerce"
  }
};

// Comprehensive Seed Data Matching MongoDB Schema
const NEST_SEED = {
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
    { code: "NEST10", discountType: "percent", value: 10, minSpend: 499, description: "10% off on orders above ₹499", expiryDate: "2027-12-31", status: "active" },
    { code: "SAVE20", discountType: "percent", value: 20, minSpend: 1499, description: "20% off on orders above ₹1,499", expiryDate: "2027-12-31", status: "active" },
    { code: "WELCOME50", discountType: "fixed", value: 50, minSpend: 299, description: "Flat ₹50 off on first purchase", expiryDate: "2027-12-31", status: "active" },
    { code: "FREESHIP", discountType: "fixed", value: 50, minSpend: 399, description: "Free standard shipping credit", expiryDate: "2027-12-31", status: "active" }
  ],
  users: [
    {
      id: "usr-admin-01",
      name: "Admin User",
      email: "admin@nest.com",
      password: "admin123", // In production hashed server side
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
        { title: "Packed & Dispatched", desc: "Dispatched from Bengaluru fulfillment center", date: "25 Oct 2026, 09:30 AM", completed: true },
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
  ]
};

// Data Access Layer: NestDB with Real-Time MongoDB Atlas Backend Synchronization
const NestDB = {
  _getStorageKey(collection) {
    return `${NEST_CONFIG.storagePrefix}${collection}`;
  },

  getApiBase() {
    if (typeof window !== "undefined" && window.location) {
      // In production (Render, custom domain) or when served by Express directly, use relative path
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (!isLocalhost || window.location.port === "5000" || window.location.port === "") {
        return "";
      }
      // Only when developing locally with Live Server or an external frontend port (e.g. 5500)
      return `http://${window.location.hostname}:5000`;
    }
    return "";
  },

  init() {
    try {
      for (const [colName, initialDocs] of Object.entries(NEST_SEED)) {
        const key = this._getStorageKey(colName);
        const existing = localStorage.getItem(key);
        if (!existing || existing === "[]" || existing === "null") {
          localStorage.setItem(key, JSON.stringify(initialDocs));
        }
      }
      if (!localStorage.getItem(this._getStorageKey("carts"))) {
        localStorage.setItem(this._getStorageKey("carts"), JSON.stringify([]));
      }
      if (!localStorage.getItem(this._getStorageKey("wishlists"))) {
        localStorage.setItem(this._getStorageKey("wishlists"), JSON.stringify([]));
      }
    } catch (e) {
      console.warn("NestDB localStorage access notice:", e);
    }

    // Trigger asynchronous background sync from MongoDB Atlas
    this.syncFromMongo();
  },

  // Pull live collections from MongoDB Atlas into local cache
  async syncFromMongo() {
    try {
      const base = this.getApiBase();
      const collections = ["categories", "products", "coupons", "users", "orders", "reviews"];
      for (const col of collections) {
        try {
          const res = await fetch(`${base}/api/${col}`, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              localStorage.setItem(this._getStorageKey(col), JSON.stringify(data));
            }
          }
        } catch (colErr) {
          // Keep offline/cached data
        }
      }
    } catch (e) {
      console.warn("NestDB syncFromMongo notice:", e.message);
    }
  },

  findAll(collection) {
    try {
      const raw = localStorage.getItem(this._getStorageKey(collection));
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    } catch (e) {
      console.error(`NestDB read error in ${collection}:`, e);
    }
    // Fallback to NEST_SEED
    if (typeof NEST_SEED !== 'undefined' && Array.isArray(NEST_SEED[collection])) {
      return [...NEST_SEED[collection]];
    }
    return [];
  },

  getAll(collection) {
    return this.findAll(collection);
  },

  findById(collection, id) {
    const all = this.findAll(collection);
    const cleanId = String(id || '').toLowerCase().trim();
    const found = all.find(item => 
      String(item.id).toLowerCase() === cleanId || 
      (item.slug && String(item.slug).toLowerCase() === cleanId)
    );
    if (found) return found;

    if (typeof NEST_SEED !== 'undefined' && Array.isArray(NEST_SEED[collection])) {
      return NEST_SEED[collection].find(item => 
        String(item.id).toLowerCase() === cleanId || 
        (item.slug && String(item.slug).toLowerCase() === cleanId)
      ) || null;
    }
    return null;
  },

  findOne(collection, filterFn) {
    const all = this.findAll(collection);
    return all.find(filterFn) || null;
  },

  find(collection, filterFn) {
    const all = this.findAll(collection);
    return filterFn ? all.filter(filterFn) : all;
  },

  // Inserts locally AND saves into MongoDB Atlas
  insert(collection, doc) {
    this.init();
    const all = this.findAll(collection);
    if (!doc.id) {
      doc.id = `${collection.slice(0, 3)}-${Date.now()}`;
    }
    if (!doc.createdAt) {
      doc.createdAt = new Date().toISOString();
    }
    all.unshift(doc);
    localStorage.setItem(this._getStorageKey(collection), JSON.stringify(all));

    // Save to MongoDB Atlas via REST API
    try {
      fetch(`${this.getApiBase()}/api/${collection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc)
      }).catch(err => console.warn(`MongoDB background insert for ${collection}:`, err.message));
    } catch (e) {}

    return doc;
  },

  // Updates locally AND saves into MongoDB Atlas
  update(collection, id, updates) {
    this.init();
    const all = this.findAll(collection);
    const index = all.findIndex(item => item.id === id || item.slug === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(this._getStorageKey(collection), JSON.stringify(all));

      // Save to MongoDB Atlas via REST API
      try {
        fetch(`${this.getApiBase()}/api/${collection}/${encodeURIComponent(id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
        }).catch(err => console.warn(`MongoDB background update for ${collection}:`, err.message));
      } catch (e) {}

      return all[index];
    }
    return null;
  },

  // Deletes locally AND deletes from MongoDB Atlas
  delete(collection, id) {
    this.init();
    let all = this.findAll(collection);
    const initialLen = all.length;
    all = all.filter(item => item.id !== id && item.slug !== id);
    if (all.length !== initialLen) {
      localStorage.setItem(this._getStorageKey(collection), JSON.stringify(all));

      // Delete from MongoDB Atlas
      try {
        fetch(`${this.getApiBase()}/api/${collection}/${encodeURIComponent(id)}`, {
          method: "DELETE"
        }).catch(err => console.warn(`MongoDB background delete for ${collection}:`, err.message));
      } catch (e) {}

      return true;
    }
    return false;
  },

  // Log user activity into MongoDB Atlas
  async logUserActivity(action, details = {}) {
    try {
      const user = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
      await fetch(`${this.getApiBase()}/api/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          userId: details.userId || (user ? user.id : "guest"),
          userEmail: details.userEmail || (user ? user.email : "guest"),
          userName: details.userName || (user ? user.name : "Guest User"),
          description: details.description || "",
          metadata: details.metadata || {}
        })
      });
    } catch (e) {
      // Activity log notice
    }
  },

  // Direct Async Auth: Register user to MongoDB Atlas
  async registerUser(userData) {
    try {
      const res = await fetch(`${this.getApiBase()}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        // Also update local cache
        const allUsers = this.findAll("users");
        allUsers.unshift(data.user);
        localStorage.setItem(this._getStorageKey("users"), JSON.stringify(allUsers));
        return { success: true, user: data.user, message: data.message };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (err) {
      // Fallback to local insert if server is unreachable
      console.warn("Register API fallback to local:", err.message);
      const user = this.insert("users", userData);
      return { success: true, user, message: "Registered (offline mode)" };
    }
  },

  // Direct Async Auth: Login user from MongoDB Atlas
  async loginUser(email, password) {
    try {
      const res = await fetch(`${this.getApiBase()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        return { success: true, user: data.user, message: data.message };
      }
      return { success: false, message: data.message || "Invalid credentials" };
    } catch (err) {
      // Local fallback
      const users = this.findAll("users");
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (matched) {
        return { success: true, user: matched };
      }
      return { success: false, message: "Invalid email or password" };
    }
  },

  // Direct Async Order Placement: Store order in MongoDB Atlas & decrement stock
  async createOrder(orderData) {
    try {
      const res = await fetch(`${this.getApiBase()}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (res.ok && data.order) {
        const allOrders = this.findAll("orders");
        allOrders.unshift(data.order);
        localStorage.setItem(this._getStorageKey("orders"), JSON.stringify(allOrders));
        return { success: true, order: data.order };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const order = this.insert("orders", orderData);
      return { success: true, order };
    }
  },

  // Direct Async Profile Update: Store in MongoDB Atlas
  async updateUserProfile(userId, updates) {
    try {
      const res = await fetch(`${this.getApiBase()}/api/users/${encodeURIComponent(userId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      this.update("users", userId, updates);
      return data;
    } catch (err) {
      return { success: true, user: this.update("users", userId, updates) };
    }
  },

  // Direct Async Review submission: Store in MongoDB Atlas
  async postReview(reviewData) {
    try {
      const res = await fetch(`${this.getApiBase()}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      if (res.ok && data.review) {
        this.insert("reviews", data.review);
        return { success: true, review: data.review };
      }
    } catch (err) {
      return { success: true, review: this.insert("reviews", reviewData) };
    }
  },

  async resetDefaults() {
    try {
      await fetch(`${this.getApiBase()}/api/reset-database`, { method: "POST" });
    } catch {}
    for (const colName of Object.keys(NEST_SEED)) {
      localStorage.removeItem(this._getStorageKey(colName));
    }
    localStorage.removeItem(this._getStorageKey("carts"));
    localStorage.removeItem(this._getStorageKey("wishlists"));
    this.init();
  }
};

// Ensure DB is initialized immediately upon script load
NestDB.init();

// Export globally
window.NEST_CONFIG = NEST_CONFIG;
window.NEST_SEED = NEST_SEED;
window.NestDB = NestDB;
