/**
 * NEST E-Commerce Website - Product Engine (products.js)
 * Card renderer, catalog filtering, sorting, pagination, and product detail view
 */

function createProductCard(p) {
  const isWishlisted = getWishlist().includes(p.id);
  const discountBadge = p.discountPercent ? `<span class="product-badge badge-discount">-${p.discountPercent}%</span>` : '';
  const hotBadge = p.hot ? `<span class="product-badge badge-hot">HOT</span>` : '';
  const newBadge = p.newArrival ? `<span class="product-badge badge-new">NEW</span>` : '';
  const badgeHtml = discountBadge || hotBadge || newBadge;

  const imgSrc = p.image || (p.images && p.images[0]) || 'assets/images/products/apples-1.jpg';

  return `
    <div class="col">
      <div class="nest-product-card h-100">
        <div class="product-img-wrap">
          ${badgeHtml}
          <div class="product-actions">
            <button class="action-btn ${isWishlisted ? 'active' : ''}" onclick="event.preventDefault(); toggleWishlist('${p.id}'); this.classList.toggle('active');" title="Add to Wishlist">
              <i class="bi bi-heart${isWishlisted ? '-fill' : ''}"></i>
            </button>
            <a href="product-details.html?id=${p.id}" class="action-btn" title="Quick View">
              <i class="bi bi-eye"></i>
            </a>
          </div>
          <a href="product-details.html?id=${p.id}">
            <img src="${imgSrc}" alt="${p.name}" loading="lazy">
          </a>
        </div>
        <div class="product-content">
          <a href="category.html?slug=${p.category}" class="product-category">${p.categoryName || p.category}</a>
          <a href="product-details.html?id=${p.id}" class="product-title" title="${p.name}">${p.name}</a>
          <div class="product-rating">
            <div class="d-flex align-items-center">
              ${renderStarRating(p.rating || 4.5)}
            </div>
            <span class="rating-count">(${p.ratingCount || 10})</span>
          </div>
          <div class="product-price-row">
            <div>
              <span class="price-current">${formatPrice(p.price)}</span>
              ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
            </div>
            <button class="btn-add-cart" onclick="addToCart('${p.id}', 1)" title="Add to Cart">
              <i class="bi bi-cart-plus"></i> <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStarRating(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '<i class="bi bi-star-fill text-warning"></i>';
    } else if (i === fullStars && hasHalf) {
      stars += '<i class="bi bi-star-half text-warning"></i>';
    } else {
      stars += '<i class="bi bi-star text-muted"></i>';
    }
  }
  return stars;
}

// Shop & Category Page Filter Manager
class CatalogManager {
  constructor(options = {}) {
    this.containerId = options.containerId || "product-grid";
    this.products = window.NestDB ? window.NestDB.findAll("products") : [];
    this.filteredProducts = [...this.products];
    this.currentPage = 1;
    this.itemsPerPage = options.itemsPerPage || 8;
    this.activeFilters = {
      category: "all",
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      rating: 0,
      sort: "featured",
      inStockOnly: false
    };
  }

  init() {
    this.readUrlParams();
    this.bindEvents();
    this.applyFilters();
  }

  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("category")) this.activeFilters.category = params.get("category");
    if (params.get("slug")) this.activeFilters.category = params.get("slug");
    if (params.get("search")) this.activeFilters.search = params.get("search").toLowerCase();
    if (params.get("sort")) this.activeFilters.sort = params.get("sort");
    if (params.get("minPrice")) this.activeFilters.minPrice = Number(params.get("minPrice"));
    if (params.get("maxPrice")) this.activeFilters.maxPrice = Number(params.get("maxPrice"));
  }

  bindEvents() {
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.value = this.activeFilters.sort;
      sortSelect.addEventListener("change", (e) => {
        this.activeFilters.sort = e.target.value;
        this.applyFilters();
      });
    }

    const priceSlider = document.getElementById("price-range-slider");
    const priceDisplay = document.getElementById("price-range-display");
    if (priceSlider) {
      priceSlider.addEventListener("input", (e) => {
        this.activeFilters.maxPrice = Number(e.target.value);
        if (priceDisplay) priceDisplay.textContent = `Up to ${formatPrice(this.activeFilters.maxPrice)}`;
        this.applyFilters();
      });
    }

    const inStockCheck = document.getElementById("filter-in-stock");
    if (inStockCheck) {
      inStockCheck.addEventListener("change", (e) => {
        this.activeFilters.inStockOnly = e.target.checked;
        this.applyFilters();
      });
    }
  }

  applyFilters() {
    let list = [...this.products];

    // Category
    if (this.activeFilters.category && this.activeFilters.category !== "all") {
      list = list.filter(p => p.category === this.activeFilters.category);
    }

    // Search
    if (this.activeFilters.search) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(this.activeFilters.search) ||
        (p.description && p.description.toLowerCase().includes(this.activeFilters.search)) ||
        (p.category && p.category.toLowerCase().includes(this.activeFilters.search))
      );
    }

    // Price
    list = list.filter(p => p.price <= this.activeFilters.maxPrice);

    // In Stock
    if (this.activeFilters.inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }

    // Sort
    switch (this.activeFilters.sort) {
      case "price-low-high":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: // featured
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    this.filteredProducts = list;
    this.render();
  }

  render() {
    const container = document.getElementById(this.containerId);
    const countDisplay = document.getElementById("product-count-display");
    if (countDisplay) {
      countDisplay.textContent = `Showing ${this.filteredProducts.length} products`;
    }

    if (!container) return;

    if (this.filteredProducts.length === 0) {
      container.innerHTML = `
        <div class="col-12 py-5 text-center">
          <i class="bi bi-search text-muted" style="font-size: 48px;"></i>
          <h5 class="mt-3 text-dark fw-bold">No Products Found</h5>
          <p class="text-muted">Try adjusting your filters, price range, or search keywords.</p>
          <button class="btn btn-success rounded-pill px-4" onclick="window.location.href='shop.html'">Reset Filters</button>
        </div>
      `;
      return;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paged = this.filteredProducts.slice(0, startIndex + this.itemsPerPage);

    container.innerHTML = paged.map(p => createProductCard(p)).join("");

    this.renderLoadMore(container);
  }

  renderLoadMore(container) {
    let loadMoreBtn = document.getElementById("load-more-btn");
    const hasMore = this.currentPage * this.itemsPerPage < this.filteredProducts.length;

    if (loadMoreBtn) {
      loadMoreBtn.style.display = hasMore ? "inline-block" : "none";
    }
  }

  loadNextPage() {
    this.currentPage++;
    this.render();
  }
}

// Single Product Details Engine
function initProductDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const idOrSlug = params.get("id") || params.get("slug");
  let allProducts = window.NestDB ? window.NestDB.findAll("products") : [];
  if ((!allProducts || allProducts.length === 0) && typeof NEST_SEED !== 'undefined' && Array.isArray(NEST_SEED.products)) {
    allProducts = NEST_SEED.products;
  }

  let product = null;
  if (idOrSlug) {
    const clean = String(idOrSlug).trim().toLowerCase();
    product = allProducts.find(p => 
      String(p.id).toLowerCase() === clean || 
      (p.slug && String(p.slug).toLowerCase() === clean)
    );
    if (!product) {
      const mainEl = document.querySelector("main");
      if (mainEl) {
        mainEl.innerHTML = `
          <div class="container py-5 text-center">
            <div class="py-5">
              <i class="bi bi-search text-muted mb-3 d-block" style="font-size: 64px;"></i>
              <h2 class="fw-bold text-dark mb-3">Product Not Found</h2>
              <p class="text-muted mb-4">We could not find the product you requested (ID: "${idOrSlug}").</p>
              <a href="shop.html" class="btn btn-success px-4 py-2 rounded-pill">
                <i class="bi bi-arrow-left me-1"></i> Return to Shop
              </a>
            </div>
          </div>
        `;
      }
      return;
    }
  } else {
    // If no ID or slug provided in URL, default to the first product in database
    product = allProducts.length > 0 ? allProducts[0] : null;
  }

  if (!product) {
    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.innerHTML = `
        <div class="container py-5 text-center">
          <h2>No Products Available</h2>
          <a href="shop.html" class="btn btn-success mt-3">Back to Shop</a>
        </div>
      `;
    }
    return;
  }

  // 1. Page Title & Breadcrumbs
  document.title = `${product.name} - NEST Supermarket`;

  const bcCat = document.getElementById("pdp-breadcrumb-category") || document.getElementById("product-category-link");
  if (bcCat) {
    bcCat.textContent = product.categoryName || product.category;
    bcCat.href = `category.html?slug=${encodeURIComponent(product.category || 'groceries')}`;
  }

  const bcName = document.getElementById("pdp-breadcrumb-name");
  if (bcName) bcName.textContent = product.name;

  // 2. Product Name / Title
  const titleEl = document.getElementById("pdp-title") || document.getElementById("product-name");
  if (titleEl) titleEl.textContent = product.name;

  // 3. Vendor & SKU
  const vendorEl = document.getElementById("pdp-vendor");
  if (vendorEl) vendorEl.textContent = product.vendor || "NEST Store";

  const skuEl = document.getElementById("pdp-sku") || document.getElementById("product-sku");
  if (skuEl) skuEl.textContent = product.sku || product.id.toUpperCase();

  // 4. Rating & Reviews Count
  const ratingStars = document.getElementById("pdp-rating-stars");
  if (ratingStars) ratingStars.innerHTML = renderStarRating(product.rating || 4.5);

  const ratingScore = document.getElementById("pdp-rating-score");
  if (ratingScore) ratingScore.textContent = (product.rating || 4.5).toFixed(1);

  const existingReviews = window.NestDB ? window.NestDB.find("reviews", r => r.productId === product.id) : [];
  const reviewsCountEl = document.getElementById("pdp-reviews-count");
  const totalReviewsCount = existingReviews.length > 0 ? existingReviews.length : (product.ratingCount || 0);
  if (reviewsCountEl) {
    reviewsCountEl.textContent = `(${totalReviewsCount} review${totalReviewsCount === 1 ? '' : 's'})`;
  }

  // 5. Pricing & Discounts
  const priceEl = document.getElementById("pdp-price-current") || document.getElementById("product-price");
  if (priceEl) priceEl.textContent = formatPrice(product.price);

  const oldPriceEl = document.getElementById("pdp-price-old") || document.getElementById("product-old-price");
  if (oldPriceEl) {
    if (product.oldPrice && product.oldPrice > product.price) {
      oldPriceEl.textContent = formatPrice(product.oldPrice);
      oldPriceEl.style.display = "inline";
    } else {
      oldPriceEl.style.display = "none";
    }
  }

  const discountEl = document.getElementById("pdp-discount") || document.getElementById("product-discount-pill");
  if (discountEl) {
    const pct = product.discountPercent || (product.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);
    if (pct > 0) {
      discountEl.textContent = `${pct}% OFF`;
      discountEl.style.display = "inline-block";
    } else {
      discountEl.style.display = "none";
    }
  }

  // 6. Description & Overview
  const descEl = document.getElementById("pdp-description") || document.getElementById("product-description");
  if (descEl) descEl.textContent = product.description || "";

  const overviewText = document.getElementById("pdp-overview-text");
  if (overviewText) overviewText.textContent = product.description || "All NEST products are rigorously inspected for authenticity, high safety standards, and customer satisfaction.";

  // 7. Stock Status
  const stockBadge = document.getElementById("pdp-stock-status") || document.getElementById("product-stock-status");
  if (stockBadge) {
    if (product.stock > 0) {
      stockBadge.innerHTML = `<span class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i> In Stock <span class="badge bg-success-subtle text-success ms-2">${product.stock} units available</span></span>`;
    } else {
      stockBadge.innerHTML = `<span class="text-danger fw-bold"><i class="bi bi-x-circle-fill me-1"></i> Out of Stock</span>`;
    }
  }

  // 8. Main Product Image
  const primaryImage = product.image || (product.images && product.images[0]) || "assets/images/products/apples-1.jpg";
  const mainImg = document.getElementById("pdp-main-image") || document.getElementById("product-main-img");
  if (mainImg) {
    mainImg.src = primaryImage;
    mainImg.alt = product.name;
  }

  // 9. Gallery Thumbnails
  const thumbsWrap = document.getElementById("pdp-gallery-thumbs") || document.getElementById("product-thumbnails");
  let gallery = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    gallery = [...product.images];
  } else if (product.image) {
    gallery = [product.image];
  }

  if (thumbsWrap) {
    if (gallery.length > 1) {
      thumbsWrap.innerHTML = gallery.map((imgUrl, idx) => `
        <button type="button" class="btn p-1 border rounded-3 bg-white pdp-gallery-thumb-btn ${imgUrl === primaryImage ? 'border-success shadow-sm active' : 'border-light-subtle'}" 
                style="width: 62px; height: 62px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;" 
                onclick="changePdpGalleryImage(this, '${imgUrl}')" 
                title="View photo ${idx + 1}">
          <img src="${imgUrl}" alt="${product.name}" style="max-height: 50px; max-width: 50px; object-fit: contain;">
        </button>
      `).join("");
      thumbsWrap.style.display = "flex";
    } else {
      thumbsWrap.innerHTML = "";
      thumbsWrap.style.display = "none";
    }
  }

  // 10. Quantity Stepper
  const qtyInput = document.getElementById("pdp-qty-input") || document.getElementById("details-quantity");
  if (qtyInput) qtyInput.value = 1;

  // 11. Add to Cart Button
  const addBtn = document.getElementById("btn-pdp-add-cart") || document.getElementById("btn-details-add-cart");
  if (addBtn) {
    if (product.stock <= 0) {
      addBtn.disabled = true;
      addBtn.classList.add("disabled");
      addBtn.innerHTML = `<i class="bi bi-slash-circle me-1"></i> Out of Stock`;
    } else {
      addBtn.disabled = false;
      addBtn.classList.remove("disabled");
      addBtn.innerHTML = `<i class="bi bi-cart-plus me-1"></i> Add to Cart`;
      addBtn.onclick = () => {
        const qty = parseInt(qtyInput?.value || 1, 10);
        addToCart(product.id, qty);
      };
    }
  }

  // 12. Wishlist Button
  const wishBtn = document.getElementById("btn-pdp-wishlist") || document.getElementById("btn-details-wishlist");
  const syncWishlistBtn = () => {
    const isWish = getWishlist().includes(product.id);
    if (wishBtn) {
      if (isWish) {
        wishBtn.innerHTML = `<i class="bi bi-heart-fill text-danger me-1"></i> In Wishlist`;
        wishBtn.classList.add("btn-outline-danger");
        wishBtn.classList.remove("btn-outline-secondary");
      } else {
        wishBtn.innerHTML = `<i class="bi bi-heart me-1"></i> Add to Wishlist`;
        wishBtn.classList.remove("btn-outline-danger");
        wishBtn.classList.add("btn-outline-secondary");
      }
    }
  };
  syncWishlistBtn();
  if (wishBtn) {
    wishBtn.onclick = () => {
      toggleWishlist(product.id);
      syncWishlistBtn();
    };
  }

  // 13. Features & Highlights List
  const featuresList = document.getElementById("pdp-features-list") || document.getElementById("product-features-list");
  if (featuresList) {
    if (product.features && product.features.length > 0) {
      featuresList.innerHTML = product.features.map(f => `<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> ${f}</li>`).join("");
    } else {
      featuresList.innerHTML = `
        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Premium grade certified materials for durable daily usage.</li>
        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Backed by full manufacturer warranty and verified testing.</li>
        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Packed with hygienic tamper-evident packaging.</li>
      `;
    }
  }

  // 14. Customer Reviews Tab
  function renderReviews() {
    const reviewsList = document.getElementById("pdp-reviews-list");
    if (!reviewsList) return;

    const revs = window.NestDB ? window.NestDB.find("reviews", r => r.productId === product.id) : [];
    if (revs.length === 0) {
      reviewsList.innerHTML = `
        <div class="p-4 text-center bg-light rounded-4 text-muted">
          <i class="bi bi-chat-heart text-success mb-2 d-block" style="font-size: 32px;"></i>
          <p class="mb-0">No reviews yet for this product. Be the first to share your experience!</p>
        </div>
      `;
    } else {
      reviewsList.innerHTML = revs.map(r => `
        <div class="card border rounded-3 p-3 mb-3 bg-light">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center gap-2">
              <img src="${r.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="rounded-circle" width="36" height="36" alt="${r.userName}">
              <div>
                <h6 class="mb-0 text-dark fw-bold" style="font-size: 14px;">${r.userName}</h6>
                <small class="text-muted" style="font-size: 11px;">${r.date || 'Verified Buyer'}</small>
              </div>
            </div>
            <div class="text-warning small">${renderStarRating(r.rating || 5)}</div>
          </div>
          ${r.title ? `<div class="fw-bold text-dark mb-1" style="font-size: 13.5px;">${r.title}</div>` : ''}
          <p class="text-muted small mb-0" style="line-height: 1.5;">${r.comment}</p>
        </div>
      `).join("");
    }

    if (reviewsCountEl) {
      const count = revs.length > 0 ? revs.length : (product.ratingCount || 0);
      reviewsCountEl.textContent = `(${count} review${count === 1 ? '' : 's'})`;
    }
  }
  renderReviews();

  const reviewForm = document.getElementById("pdp-review-form");
  if (reviewForm) {
    reviewForm.onsubmit = (e) => {
      e.preventDefault();
      const rating = parseInt(document.getElementById("review-rating-select")?.value || 5, 10);
      const title = document.getElementById("review-title-input")?.value.trim() || "";
      const comment = document.getElementById("review-comment-input")?.value.trim() || "";
      const currentUser = typeof getCurrentUser === "function" ? getCurrentUser() : null;

      const newReview = {
        id: `rev-${Date.now()}`,
        productId: product.id,
        userName: currentUser ? currentUser.name : "Verified Customer",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        rating: rating,
        title: title,
        comment: comment,
        status: "approved",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      };

      if (window.NestDB) {
        if (typeof window.NestDB.postReview === "function") {
          window.NestDB.postReview(newReview);
        } else {
          window.NestDB.insert("reviews", newReview);
        }
      }
      if (typeof showToast === "function") {
        showToast("Thank you for your feedback! Review submitted successfully.");
      }
      reviewForm.reset();
      renderReviews();
    };
  }

  // 15. Related Products
  renderRelatedProducts(product.category, product.id);
}

// Gallery image switcher
window.changePdpGalleryImage = function(btnEl, newSrc) {
  const img = document.getElementById("pdp-main-image") || document.getElementById("product-main-img");
  if (img) img.src = newSrc;

  document.querySelectorAll(".pdp-gallery-thumb-btn").forEach(b => {
    b.classList.remove("border-success", "shadow-sm", "active");
    b.classList.add("border-light-subtle");
  });
  if (btnEl) {
    btnEl.classList.remove("border-light-subtle");
    btnEl.classList.add("border-success", "shadow-sm", "active");
  }
};

function renderRelatedProducts(category, currentId) {
  const container = document.getElementById("pdp-related-products") || document.getElementById("related-products-row");
  if (!container || !window.NestDB) return;

  let related = window.NestDB.find("products", p => p.category === category && p.id !== currentId);
  if (related.length < 4) {
    const fallback = window.NestDB.find("products", p => p.id !== currentId && p.category !== category);
    related = [...related, ...fallback];
  }
  related = related.slice(0, 4);

  if (related.length > 0) {
    container.innerHTML = related.map(p => createProductCard(p)).join("");
  }
}

// Global Exports
window.initProductDetailsPage = initProductDetailsPage;
window.NestProducts = {
  createProductCard,
  renderStarRating,
  CatalogManager,
  initProductDetailsPage
};

window.NestUI = window.NestUI || {};
window.NestUI.renderProductCard = createProductCard;
