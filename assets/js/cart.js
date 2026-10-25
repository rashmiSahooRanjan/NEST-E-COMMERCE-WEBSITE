/**
 * NEST E-Commerce Website - Shopping Cart Engine (cart.js)
 * Live quantity calculations, coupon validation, tax and shipping computation
 */

let appliedCoupon = null;

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  setupCouponForm();
});

function renderCart() {
  const cart = getCart();
  const tableBody = document.getElementById("cart-table-body");
  const emptyCartState = document.getElementById("empty-cart-state");
  const cartContentWrap = document.getElementById("cart-content-wrap");

  if (!tableBody) return;

  if (cart.length === 0) {
    if (emptyCartState) emptyCartState.style.display = "block";
    if (cartContentWrap) cartContentWrap.style.display = "none";
    return;
  }

  if (emptyCartState) emptyCartState.style.display = "none";
  if (cartContentWrap) cartContentWrap.style.display = "block";

  tableBody.innerHTML = cart.map(item => `
    <tr>
      <td style="width: 80px;">
        <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: contain; border-radius: 8px; background: #F8F9FA;">
      </td>
      <td>
        <a href="product-details.html?id=${item.productId}" class="text-decoration-none fw-bold text-dark d-block text-truncate" style="max-width: 280px;">
          ${item.name}
        </a>
        <small class="text-muted text-uppercase">${item.category || 'Product'}</small>
      </td>
      <td class="fw-bold text-success" style="font-size: 15px;">
        ${formatPrice(item.price)}
      </td>
      <td>
        <div class="qty-stepper">
          <button class="qty-btn" onclick="updateItemQuantity('${item.productId}', ${item.quantity - 1})">-</button>
          <input type="number" class="qty-input" value="${item.quantity}" min="1" onchange="updateItemQuantity('${item.productId}', parseInt(this.value, 10))">
          <button class="qty-btn" onclick="updateItemQuantity('${item.productId}', ${item.quantity + 1})">+</button>
        </div>
      </td>
      <td class="fw-bold text-dark" style="font-size: 15px;">
        ${formatPrice(item.price * item.quantity)}
      </td>
      <td class="text-end">
        <button class="btn btn-sm text-danger" onclick="removeCartItem('${item.productId}')" title="Remove item">
          <i class="bi bi-trash3 fs-5"></i>
        </button>
      </td>
    </tr>
  `).join("");

  calculateCartTotals();
}

function updateItemQuantity(productId, newQty) {
  if (newQty <= 0) {
    removeCartItem(productId);
    return;
  }

  const product = window.NestDB ? window.NestDB.findById("products", productId) : null;
  if (product && newQty > product.stock) {
    showToast(`Only ${product.stock} items available in stock`, "warning");
    return;
  }

  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity = newQty;
    saveCart(cart);
    renderCart();
  }
}

function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.productId !== productId);
  saveCart(cart);
  showToast("Item removed from your cart", "warning");
  renderCart();
}

function clearCart() {
  if (confirm("Are you sure you want to empty your cart?")) {
    saveCart([]);
    appliedCoupon = null;
    showToast("Your cart has been cleared");
    renderCart();
  }
}

function calculateCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (subtotal < appliedCoupon.minSpend) {
      appliedCoupon = null;
      showToast(`Coupon removed: minimum spend of ₹${appliedCoupon.minSpend} required`, "warning");
    } else {
      if (appliedCoupon.discountType === "percent") {
        discount = (subtotal * appliedCoupon.value) / 100;
      } else {
        discount = appliedCoupon.value;
      }
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * (window.NEST_CONFIG?.taxRate || 0.05));
  
  // Shipping calculation
  let shipping = 0;
  if (subtotal > 0 && subtotal < (window.NEST_CONFIG?.freeShippingThreshold || 999)) {
    shipping = window.NEST_CONFIG?.defaultShippingCost || 50;
  }

  const total = taxableAmount + tax + shipping;

  // DOM Updates
  const elSubtotal = document.getElementById("cart-subtotal");
  const elDiscountRow = document.getElementById("cart-discount-row");
  const elDiscount = document.getElementById("cart-discount-amount");
  const elTax = document.getElementById("cart-tax");
  const elShipping = document.getElementById("cart-shipping");
  const elTotal = document.getElementById("cart-total");

  if (elSubtotal) elSubtotal.textContent = formatPrice(subtotal);
  if (elDiscountRow && elDiscount) {
    if (discount > 0) {
      elDiscountRow.style.display = "flex";
      elDiscount.textContent = `-${formatPrice(discount)}`;
    } else {
      elDiscountRow.style.display = "none";
    }
  }
  if (elTax) elTax.textContent = formatPrice(tax);
  if (elShipping) elShipping.textContent = shipping === 0 ? "FREE" : formatPrice(shipping);
  if (elTotal) elTotal.textContent = formatPrice(total);

  // Store active checkout calculation for checkout.html
  sessionStorage.setItem("nest_checkout_summary", JSON.stringify({
    subtotal,
    discount,
    couponCode: appliedCoupon ? appliedCoupon.code : null,
    tax,
    shipping,
    total
  }));
}

function setupCouponForm() {
  const form = document.getElementById("coupon-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("coupon-code-input");
    const code = input ? input.value.trim().toUpperCase() : "";

    if (!code) {
      showToast("Please enter a coupon code", "warning");
      return;
    }

    const coupons = window.NestDB ? window.NestDB.findAll("coupons") : [];
    const found = coupons.find(c => c.code.toUpperCase() === code && c.status === "active");

    if (!found) {
      showToast("Invalid or expired coupon code", "error");
      return;
    }

    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (subtotal < found.minSpend) {
      showToast(`This coupon requires a minimum cart total of ₹${found.minSpend}`, "warning");
      return;
    }

    appliedCoupon = found;
    showToast(`Coupon "${found.code}" applied successfully!`);
    calculateCartTotals();
  });
}
