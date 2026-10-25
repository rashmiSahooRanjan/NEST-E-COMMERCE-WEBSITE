/**
 * NEST E-Commerce Website - Admin Customer Management Engine (admin/customers.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminAccess();
  renderCustomersTable();
  setupCustomerSearch();
});

function verifyAdminAccess() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "login.html";
  }
}

function renderCustomersTable(searchQuery = "") {
  const tbody = document.getElementById("admin-customers-tbody");
  if (!tbody) return;

  const users = window.NestDB ? window.NestDB.findAll("users") : [];
  let customers = users.filter(u => u.role === "customer");

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    customers = customers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  }

  const orders = window.NestDB ? window.NestDB.findAll("orders") : [];

  tbody.innerHTML = customers.map(c => {
    const custOrders = orders.filter(o => o.userId === c.id || o.customerEmail === c.email);
    const totalSpent = custOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle bg-success-subtle text-success fw-bold d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              ${c.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div class="fw-bold text-dark">${c.name}</div>
              <small class="text-muted">${c.email}</small>
            </div>
          </div>
        </td>
        <td>${c.phone || 'N/A'}</td>
        <td><span class="badge bg-light text-dark fw-bold">${custOrders.length} orders</span></td>
        <td class="fw-bold text-success">${formatPrice(totalSpent)}</td>
        <td>
          <span class="status-pill status-${c.status || 'active'}">
            ${(c.status || 'active').toUpperCase()}
          </span>
        </td>
        <td>${c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}</td>
        <td class="text-end">
          <button class="btn btn-sm ${c.status === 'blocked' ? 'btn-outline-success' : 'btn-outline-warning'}" onclick="toggleCustomerStatus('${c.id}')">
            ${c.status === 'blocked' ? 'Unblock' : 'Block'}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function toggleCustomerStatus(userId) {
  if (window.NestDB) {
    const user = window.NestDB.findById("users", userId);
    if (user) {
      const newStatus = user.status === "blocked" ? "active" : "blocked";
      window.NestDB.update("users", userId, { status: newStatus });
      showToast(`Customer account status updated to ${newStatus}`);
      renderCustomersTable();
    }
  }
}

function setupCustomerSearch() {
  const searchInput = document.getElementById("admin-customer-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    renderCustomersTable(e.target.value.trim());
  });
}
