/**
 * NEST E-Commerce Website - Common Utilities & Shared UI Interactions (common.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Update Header Badges & User Status
  updateHeaderBadges();
  renderHeaderUserMenu();
  setupGlobalSearch();
});

// 1. Toast Notification Manager
function showToast(message, type = "success") {
  let container = document.querySelector(".nest-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "nest-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `nest-toast ${type === "error" ? "toast-error" : type === "warning" ? "toast-warning" : ""}`;
  
  const icon = type === "error" ? "bi-x-circle-fill text-danger" : 
               type === "warning" ? "bi-exclamation-triangle-fill text-warning" : 
               "bi-check-circle-fill text-success";

  toast.innerHTML = `
    <i class="bi ${icon} fs-5"></i>
    <div class="flex-grow-1" style="font-size: 13.5px; font-weight: 500; color: #253D4E;">${message}</div>
    <button type="button" class="btn-close" style="font-size: 11px;" onclick="this.parentElement.remove()"></button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// 2. Currency Formatter
function formatPrice(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
}

// 3. Update Cart & Wishlist Badges
function updateHeaderBadges() {
  const cart = getCart();
  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalCartValue = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  
  const wishlist = getWishlist();
  const totalWishlistCount = wishlist.length;

  document.querySelectorAll(".cart-count-badge, .header-cart-count").forEach(badge => {
    badge.textContent = totalCartCount;
    badge.style.display = totalCartCount > 0 ? "inline-flex" : "none";
  });

  document.querySelectorAll(".wishlist-count-badge, .header-wishlist-count").forEach(badge => {
    badge.textContent = totalWishlistCount;
    badge.style.display = totalWishlistCount > 0 ? "inline-flex" : "none";
  });

  document.querySelectorAll(".header-cart-total").forEach(el => {
    el.textContent = formatPrice(totalCartValue);
  });
}

// 4. Cart Storage Helpers
function getCart() {
  try {
    const raw = localStorage.getItem("nest_cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("nest_cart", JSON.stringify(cart));
  updateHeaderBadges();

  const user = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
  if (user && window.NestDB && typeof window.NestDB.getApiBase === "function") {
    try {
      fetch(`${window.NestDB.getApiBase()}/api/cart/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, items: cart })
      }).catch(() => {});
    } catch {}
  }
}

function addToCart(productId, quantity = 1) {
  const product = window.NestDB ? window.NestDB.findById("products", productId) : null;
  if (!product) {
    showToast("Product not found", "error");
    return false;
  }

  if (product.stock <= 0) {
    showToast("Sorry, this item is out of stock", "warning");
    return false;
  }

  const cart = getCart();
  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    if (existing.quantity + quantity > product.stock) {
      showToast(`Only ${product.stock} units available in stock`, "warning");
      return false;
    }
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || "assets/images/products/apples-1.jpg",
      category: product.category,
      quantity: quantity
    });
  }

  saveCart(cart);

  if (window.NestDB && typeof window.NestDB.logUserActivity === "function") {
    window.NestDB.logUserActivity("add_to_cart", {
      description: `Added "${product.name}" to cart (Qty: ${quantity})`,
      metadata: { productId: product.id, name: product.name, price: product.price, quantity }
    });
  }

  showToast(`Added "${product.name.slice(0, 32)}..." to your cart!`);
  return true;
}

// 5. Wishlist Helpers
function getWishlist() {
  try {
    const raw = localStorage.getItem("nest_wishlist");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem("nest_wishlist", JSON.stringify(wishlist));
  updateHeaderBadges();

  const user = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
  if (user && window.NestDB && typeof window.NestDB.getApiBase === "function") {
    try {
      fetch(`${window.NestDB.getApiBase()}/api/wishlist/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, items: wishlist })
      }).catch(() => {});
    } catch {}
  }
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  const product = window.NestDB ? window.NestDB.findById("products", productId) : null;

  if (index > -1) {
    wishlist.splice(index, 1);
    saveWishlist(wishlist);

    if (window.NestDB && typeof window.NestDB.logUserActivity === "function") {
      window.NestDB.logUserActivity("wishlist_remove", {
        description: `Removed "${product ? product.name : productId}" from wishlist`,
        metadata: { productId: productId }
      });
    }

    showToast("Item removed from your wishlist", "warning");
    return false;
  } else {
    wishlist.push(productId);
    saveWishlist(wishlist);

    if (window.NestDB && typeof window.NestDB.logUserActivity === "function") {
      window.NestDB.logUserActivity("wishlist_add", {
        description: `Added "${product ? product.name : productId}" to wishlist`,
        metadata: { productId: productId }
      });
    }

    showToast(product ? `Added "${product.name.slice(0, 28)}..." to your wishlist!` : "Item saved to wishlist!");
    return true;
  }
}

// 6. Header Auth Menu Status
function getCurrentUser() {
  try {
    const raw = localStorage.getItem("nest_current_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function renderHeaderUserMenu() {
  const user = getCurrentUser();
  const userContainer = document.getElementById("header-user-menu");
  if (!userContainer) return;

  if (user) {
    userContainer.innerHTML = `
      <div class="dropdown">
        <a class="nav-action-item dropdown-toggle text-decoration-none" href="#" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-circle fs-4 text-success"></i>
          <span class="d-none d-lg-inline fw-semibold text-truncate" style="max-width: 100px;">${user.name.split(' ')[0]}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
          <li><h6 class="dropdown-header text-truncate">${user.email}</h6></li>
          <li><a class="dropdown-item" href="my-account.html"><i class="bi bi-person me-2"></i> My Account</a></li>
          <li><a class="dropdown-item" href="my-orders.html"><i class="bi bi-bag-check me-2"></i> My Orders</a></li>
          <li><a class="dropdown-item" href="wishlist.html"><i class="bi bi-heart me-2"></i> My Wishlist</a></li>
          ${user.role === 'admin' ? '<li><hr class="dropdown-divider"></li><li><a class="dropdown-item text-success fw-bold" href="admin/dashboard.html"><i class="bi bi-shield-lock me-2"></i> Admin Dashboard</a></li>' : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="logoutUser()"><i class="bi bi-box-arrow-right me-2"></i> Sign Out</a></li>
        </ul>
      </div>
    `;
  } else {
    userContainer.innerHTML = `
      <a href="login.html" class="nav-action-item text-decoration-none">
        <i class="bi bi-person fs-4"></i>
        <span class="d-none d-lg-inline fw-semibold">Sign In</span>
      </a>
    `;
  }
}

function logoutUser() {
  localStorage.removeItem("nest_current_user");
  showToast("Logged out successfully");
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

// 7. Global Search
function setupGlobalSearch() {
  const forms = document.querySelectorAll(".header-search-form");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[name='search']");
      const categorySelect = form.querySelector("select[name='category']");
      const query = input ? input.value.trim() : "";
      const cat = categorySelect ? categorySelect.value : "";
      
      let target = `shop.html?search=${encodeURIComponent(query)}`;
      if (cat && cat !== "all") {
        target += `&category=${encodeURIComponent(cat)}`;
      }
      window.location.href = target;
    });
  });
}

// Global UI Helper
window.NestUI = window.NestUI || {};
window.NestUI.showToast = showToast;
window.NestUI.formatPrice = formatPrice;
