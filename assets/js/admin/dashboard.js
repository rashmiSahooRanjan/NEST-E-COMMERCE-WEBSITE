/**
 * NEST E-Commerce Website - Admin Dashboard Engine (dashboard.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminAccess();
  loadDashboardMetrics();
  loadRecentOrders();
  loadLowStockProducts();
});

function verifyAdminAccess() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    // If not admin, redirect to admin login
    window.location.href = "login.html";
  }
}

function loadDashboardMetrics() {
  const orders = window.NestDB ? window.NestDB.findAll("orders") : [];
  const products = window.NestDB ? window.NestDB.findAll("products") : [];
  const users = window.NestDB ? window.NestDB.findAll("users") : [];

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = users.filter(u => u.role === "customer").length;
  const totalProducts = products.length;

  const elRev = document.getElementById("kpi-revenue");
  const elOrders = document.getElementById("kpi-orders");
  const elCust = document.getElementById("kpi-customers");
  const elProd = document.getElementById("kpi-products");

  if (elRev) elRev.textContent = formatPrice(totalRevenue);
  if (elOrders) elOrders.textContent = totalOrders;
  if (elCust) elCust.textContent = totalCustomers;
  if (elProd) elProd.textContent = totalProducts;
}

function loadRecentOrders() {
  const container = document.getElementById("admin-recent-orders-tbody");
  if (!container) return;

  const orders = window.NestDB ? window.NestDB.findAll("orders") : [];
  if (orders.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No orders found</td></tr>`;
    return;
  }

  container.innerHTML = orders.slice(0, 5).map(o => `
    <tr>
      <td><span class="fw-bold">${o.id}</span></td>
      <td>
        <div class="fw-semibold text-dark">${o.customerName}</div>
        <small class="text-muted">${o.customerEmail}</small>
      </td>
      <td>${new Date(o.createdAt).toLocaleDateString()}</td>
      <td class="fw-bold text-success">${formatPrice(o.total)}</td>
      <td>
        <span class="status-pill status-${o.paymentStatus === 'paid' ? 'completed' : 'pending'}">${o.paymentStatus.toUpperCase()}</span>
      </td>
      <td>
        <span class="status-pill status-${o.orderStatus}">${o.orderStatus.toUpperCase()}</span>
      </td>
      <td class="text-end">
        <a href="order-details.html?id=${o.id}" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-eye"></i> Details
        </a>
      </td>
    </tr>
  `).join("");
}

function loadLowStockProducts() {
  const container = document.getElementById("admin-low-stock-tbody");
  if (!container) return;

  const products = window.NestDB ? window.NestDB.find("products", p => p.stock <= 15) : [];
  if (products.length === 0) {
    container.innerHTML = `<tr><td colspan="5" class="text-center py-3 text-muted">All products have sufficient stock</td></tr>`;
    return;
  }

  container.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-2">
          <img src="../${p.image || (p.images && p.images[0])}" alt="${p.name}" style="width: 38px; height: 38px; object-fit: contain; border-radius: 6px; background: #F8F9FA;">
          <span class="fw-semibold text-dark text-truncate" style="max-width: 180px;">${p.name}</span>
        </div>
      </td>
      <td>${p.sku || p.id}</td>
      <td>
        <span class="badge ${p.stock <= 5 ? 'bg-danger' : 'bg-warning text-dark'} fw-bold">${p.stock} left</span>
      </td>
      <td class="fw-bold">${formatPrice(p.price)}</td>
      <td class="text-end">
        <a href="inventory.html" class="btn btn-sm btn-outline-success">Restock</a>
      </td>
    </tr>
  `).join("");
}
