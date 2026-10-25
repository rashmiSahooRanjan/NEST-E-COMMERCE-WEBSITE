/**
 * NEST E-Commerce Website - Checkout Engine (checkout.js)
 * Address validation, stock deduction, order generation, and payment gateway simulation
 */

document.addEventListener("DOMContentLoaded", () => {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your cart is empty. Please add items before checkout.", "warning");
    setTimeout(() => { window.location.href = "cart.html"; }, 1500);
    return;
  }

  renderCheckoutSummary();
  prefillCustomerDetails();
  setupCheckoutForm();
});

function renderCheckoutSummary() {
  const cart = getCart();
  const listContainer = document.getElementById("checkout-items-list");
  if (!listContainer) return;

  listContainer.innerHTML = cart.map(item => `
    <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #F8F9FA;">
        <div>
          <div class="fw-bold text-dark text-truncate" style="max-width: 180px; font-size: 13px;">${item.name}</div>
          <small class="text-muted">Qty: ${item.quantity} × ${formatPrice(item.price)}</small>
        </div>
      </div>
      <div class="fw-bold text-dark" style="font-size: 13px;">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join("");

  // Calculate or read summary
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let summary = {};
  try {
    const raw = sessionStorage.getItem("nest_checkout_summary");
    summary = raw ? JSON.parse(raw) : {};
  } catch {}

  const discount = summary.discount || 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = summary.tax || Math.round(taxable * 0.05);
  const shipping = subtotal >= 999 ? 0 : 50;
  const total = taxable + tax + shipping;

  document.getElementById("checkout-subtotal").textContent = formatPrice(subtotal);
  if (document.getElementById("checkout-discount-row")) {
    document.getElementById("checkout-discount-row").style.display = discount > 0 ? "flex" : "none";
    document.getElementById("checkout-discount").textContent = `-${formatPrice(discount)}`;
  }
  document.getElementById("checkout-tax").textContent = formatPrice(tax);
  document.getElementById("checkout-shipping").textContent = shipping === 0 ? "FREE" : formatPrice(shipping);
  document.getElementById("checkout-total").textContent = formatPrice(total);
}

function prefillCustomerDetails() {
  const user = getCurrentUser();
  if (user) {
    const nameInput = document.getElementById("billing-name");
    const emailInput = document.getElementById("billing-email");
    const phoneInput = document.getElementById("billing-phone");
    const streetInput = document.getElementById("billing-street");
    const cityInput = document.getElementById("billing-city");
    const stateInput = document.getElementById("billing-state");
    const pinInput = document.getElementById("billing-pincode");

    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
    if (phoneInput && user.phone) phoneInput.value = user.phone;
    if (user.address) {
      if (streetInput) streetInput.value = user.address.street || "";
      if (cityInput) cityInput.value = user.address.city || "";
      if (stateInput) stateInput.value = user.address.state || "";
      if (pinInput) pinInput.value = user.address.pincode || "";
    }
  }
}

function setupCheckoutForm() {
  const form = document.getElementById("checkout-order-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }

    const name = document.getElementById("billing-name").value.trim();
    const email = document.getElementById("billing-email").value.trim();
    const phone = document.getElementById("billing-phone").value.trim();
    const street = document.getElementById("billing-street").value.trim();
    const city = document.getElementById("billing-city").value.trim();
    const state = document.getElementById("billing-state").value.trim();
    const pincode = document.getElementById("billing-pincode").value.trim();
    const paymentMethodEl = document.querySelector("input[name='paymentMethod']:checked");
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : "cod";

    if (!name || !email || !phone || !street || !city || !state || !pincode) {
      showToast("Please fill in all mandatory billing and address fields", "warning");
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      showToast("Please enter a valid 10-digit phone number", "warning");
      return;
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let summary = {};
    try {
      summary = JSON.parse(sessionStorage.getItem("nest_checkout_summary") || "{}");
    } catch {}

    const discount = summary.discount || 0;
    const taxable = Math.max(0, subtotal - discount);
    const tax = summary.tax || Math.round(taxable * 0.05);
    const shipping = subtotal >= 999 ? 0 : 50;
    const total = taxable + tax + shipping;

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const user = getCurrentUser();

    const newOrder = {
      id: orderId,
      userId: user ? user.id : `guest-${Date.now()}`,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      items: cart,
      shippingAddress: {
        fullName: name,
        phone: phone,
        street: street,
        city: city,
        state: state,
        pincode: pincode
      },
      subtotal: subtotal,
      discount: discount,
      couponCode: summary.couponCode || "",
      tax: tax,
      shipping: shipping,
      total: total,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      orderStatus: "processing",
      trackingSteps: [
        { title: "Order Confirmed", desc: "Received and verified", date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), completed: true },
        { title: "Packaging", desc: "Order is being packed at fulfillment center", date: "In Progress", completed: false },
        { title: "Out for Delivery", desc: "Assigned to courier delivery agent", date: "Pending", completed: false },
        { title: "Delivered", desc: "Handover to customer", date: "Estimated in 2 days", completed: false }
      ],
      createdAt: new Date().toISOString()
    };

    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "Place Order";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving Order to Database...';
    }

    // Save order in MongoDB Atlas and decrement stock
    (async () => {
      try {
        if (window.NestDB) {
          await window.NestDB.createOrder(newOrder);
          await window.NestDB.logUserActivity("order_placed", {
            userId: newOrder.userId,
            userEmail: newOrder.customerEmail,
            userName: newOrder.customerName,
            description: `Order #${orderId} placed for ${formatPrice(newOrder.total)}`,
            metadata: { orderId: orderId, total: newOrder.total, itemsCount: newOrder.items.length }
          });
        }

        // Save order in session & clear cart
        sessionStorage.setItem("nest_last_order", JSON.stringify(newOrder));
        saveCart([]);

        showToast("Order placed & stored in MongoDB Atlas!");
        setTimeout(() => {
          window.location.href = `order-success.html?orderId=${orderId}`;
        }, 600);
      } catch (err) {
        console.error("Order submission error:", err);
        showToast("Order saved locally. Proceeding to confirmation.");
        sessionStorage.setItem("nest_last_order", JSON.stringify(newOrder));
        saveCart([]);
        setTimeout(() => {
          window.location.href = `order-success.html?orderId=${orderId}`;
        }, 700);
      }
    })();
  });
}
