/**
 * NEST E-Commerce Website - Customer Wishlist Engine (wishlist.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
});

function renderWishlist() {
  const container = document.getElementById("wishlist-table-body");
  const emptyState = document.getElementById("empty-wishlist-state");
  const wrap = document.getElementById("wishlist-content-wrap");

  if (!container) return;

  const wishlistIds = getWishlist();
  if (wishlistIds.length === 0) {
    if (emptyState) emptyState.style.display = "block";
    if (wrap) wrap.style.display = "none";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (wrap) wrap.style.display = "block";

  const products = window.NestDB ? window.NestDB.findAll("products") : [];
  const wishlistedItems = products.filter(p => wishlistIds.includes(p.id));

  container.innerHTML = wishlistedItems.map(p => `
    <tr>
      <td style="width: 80px;">
        <img src="${p.image || (p.images && p.images[0])}" alt="${p.name}" style="width: 70px; height: 70px; object-fit: contain; border-radius: 8px; background: #F8F9FA;">
      </td>
      <td>
        <a href="product-details.html?id=${p.id}" class="text-decoration-none fw-bold text-dark d-block">
          ${p.name}
        </a>
        <small class="text-muted">${p.categoryName || p.category}</small>
      </td>
      <td class="fw-bold text-success" style="font-size: 15px;">
        ${formatPrice(p.price)}
      </td>
      <td>
        ${p.stock > 0 
          ? '<span class="status-pill status-active"><i class="bi bi-check-circle-fill"></i> In Stock</span>' 
          : '<span class="status-pill status-cancelled"><i class="bi bi-x-circle-fill"></i> Out of Stock</span>'}
      </td>
      <td>
        <button class="btn btn-sm btn-success rounded-pill px-3" onclick="moveWishlistToCart('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''}>
          <i class="bi bi-cart-plus me-1"></i> Add to Cart
        </button>
      </td>
      <td class="text-end">
        <button class="btn btn-sm text-danger" onclick="removeFromWishlistPage('${p.id}')" title="Remove">
          <i class="bi bi-trash3 fs-5"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

function moveWishlistToCart(productId) {
  if (addToCart(productId, 1)) {
    toggleWishlist(productId);
    renderWishlist();
  }
}

function removeFromWishlistPage(productId) {
  toggleWishlist(productId);
  renderWishlist();
}
