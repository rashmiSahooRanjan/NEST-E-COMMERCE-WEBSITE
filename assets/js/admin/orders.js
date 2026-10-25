/**
 * NEST E-Commerce Website - Admin Order Management Engine (admin/orders.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminAccess();
  if (document.getElementById("admin-orders-tbody")) {
    renderAdminOrdersTable();
    setupOrderFilters();
  }
  if (document.getElementById("admin-order-details-card")) {
    renderAdminOrderDetails();
  }
});

function verifyAdminAccess() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "login.html";
  }
}

function renderAdminOrdersTable(statusFilter = "all", searchQuery = "") {
  const tbody = document.getElementById("admin-orders-tbody");
  if (!tbody) return;

  let orders = window.NestDB ? window.NestDB.findAll("orders") : [];

  if (statusFilter !== "all") {
    orders = orders.filter(o => o.orderStatus === statusFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    orders = orders.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q)
    );
  }

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No orders matching criteria</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>
        <div class="fw-semibold text-dark">${o.customerName}</div>
        <small class="text-muted">${o.customerPhone || o.customerEmail}</small>
      </td>
      <td>${new Date(o.createdAt).toLocaleDateString()}</td>
      <td><span class="badge bg-light text-dark fw-bold">${o.items.length} items</span></td>
      <td class="fw-bold text-success">${formatPrice(o.total)}</td>
      <td>
        <span class="status-pill status-${o.paymentStatus === 'paid' ? 'completed' : 'pending'}">${o.paymentStatus.toUpperCase()}</span>
      </td>
      <td>
        <select class="form-select form-select-sm" style="width: 130px; font-weight: 600;" onchange="updateAdminOrderStatus('${o.id}', this.value)">
          <option value="processing" ${o.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
          <option value="shipped" ${o.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${o.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${o.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td class="text-end">
        <a href="order-details.html?id=${o.id}" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-eye"></i> Details
        </a>
      </td>
    </tr>
  `).join("");
}

function updateAdminOrderStatus(orderId, newStatus) {
  if (window.NestDB) {
    const order = window.NestDB.findById("orders", orderId);
    if (order) {
      const trackingSteps = order.trackingSteps || [];
      if (newStatus === "shipped") {
        if (trackingSteps[2]) trackingSteps[2].completed = true;
      } else if (newStatus === "delivered") {
        trackingSteps.forEach(s => s.completed = true);
      }

      window.NestDB.update("orders", orderId, {
        orderStatus: newStatus,
        paymentStatus: newStatus === "delivered" ? "paid" : order.paymentStatus,
        trackingSteps
      });
      showToast(`Order #${orderId} marked as ${newStatus}`);
    }
  }
}

function setupOrderFilters() {
  const searchInput = document.getElementById("admin-order-search");
  const statusSelect = document.getElementById("admin-order-status-filter");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderAdminOrdersTable(statusSelect ? statusSelect.value : "all", searchInput.value.trim());
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener("change", () => {
      renderAdminOrdersTable(statusSelect.value, searchInput ? searchInput.value.trim() : "");
    });
  }
}

function renderAdminOrderDetails() {
  const container = document.getElementById("admin-order-details-card");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id") || "ORD-98241";
  const order = window.NestDB ? window.NestDB.findById("orders", orderId) : null;

  if (!order) {
    container.innerHTML = `<div class="p-4 text-center"><h5>Order Not Found</h5><a href="orders.html" class="btn btn-sm btn-success">Back to Orders</a></div>`;
    return;
  }

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold m-0">Order #${order.id}</h5>
            <span class="status-pill status-${order.orderStatus}">${order.orderStatus.toUpperCase()}</span>
          </div>
          <p class="text-muted small">Placed on ${new Date(order.createdAt).toLocaleString()}</p>
          <div class="table-responsive">
            <table class="table">
              <thead><tr><th>Item</th><th>Unit Price</th><th>Qty</th><th class="text-end">Total</th></tr></thead>
              <tbody>
                ${order.items.map(i => `
                  <tr>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <img src="../${i.image}" alt="${i.name}" style="width: 36px; height: 36px; object-fit: contain; border-radius: 6px; background: #F8F9FA;">
                        <span class="fw-semibold">${i.name}</span>
                      </div>
                    </td>
                    <td>${formatPrice(i.price)}</td>
                    <td>${i.quantity}</td>
                    <td class="text-end fw-bold">${formatPrice(i.price * i.quantity)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h6 class="fw-bold mb-3">Customer Information</h6>
          <p class="mb-1"><strong>${order.customerName}</strong></p>
          <p class="mb-1 text-muted small">${order.customerEmail}</p>
          <p class="mb-3 text-muted small">${order.customerPhone}</p>
          <h6 class="fw-bold mb-2">Shipping Address</h6>
          <p class="text-muted small">${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}</p>
        </div>
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <h6 class="fw-bold mb-3">Order Status Action</h6>
          <select class="form-select mb-3" onchange="updateAdminOrderStatus('${order.id}', this.value)">
            <option value="processing" ${order.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="shipped" ${order.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
          <div class="d-flex justify-content-between mb-2"><span>Subtotal:</span><span>${formatPrice(order.subtotal)}</span></div>
          <div class="d-flex justify-content-between mb-2"><span>Tax:</span><span>${formatPrice(order.tax)}</span></div>
          <div class="d-flex justify-content-between mb-2"><span>Shipping:</span><span>${formatPrice(order.shipping)}</span></div>
          <hr>
          <div class="d-flex justify-content-between fw-bold fs-5"><span>Total:</span><span class="text-success">${formatPrice(order.total)}</span></div>
        </div>
      </div>
    </div>
  `;
}
