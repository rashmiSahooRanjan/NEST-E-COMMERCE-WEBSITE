/**
 * NEST E-Commerce Website - Admin Inventory Engine (admin/inventory.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminAccess();
  renderInventoryTable();
});

function verifyAdminAccess() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "login.html";
  }
}

function renderInventoryTable() {
  const tbody = document.getElementById("admin-inventory-tbody");
  if (!tbody) return;

  const products = window.NestDB ? window.NestDB.findAll("products") : [];

  tbody.innerHTML = products.map(p => {
    let stockBadge = '<span class="status-pill status-active">Adequate</span>';
    if (p.stock <= 5) {
      stockBadge = '<span class="status-pill status-cancelled">Critical Low</span>';
    } else if (p.stock <= 15) {
      stockBadge = '<span class="status-pill status-pending">Low Stock</span>';
    }

    return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="../${p.image || (p.images && p.images[0])}" alt="${p.name}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #F8F9FA;">
            <span class="fw-semibold text-dark text-truncate" style="max-width: 220px;">${p.name}</span>
          </div>
        </td>
        <td><code>${p.sku || p.id}</code></td>
        <td class="text-capitalize">${p.category}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <input type="number" class="form-control form-control-sm text-center" style="width: 80px;" id="stock-input-${p.id}" value="${p.stock}" min="0">
            <button class="btn btn-sm btn-outline-success" onclick="updateStock('${p.id}')">Save</button>
          </div>
        </td>
        <td>${stockBadge}</td>
      </tr>
    `;
  }).join("");
}

function updateStock(productId) {
  const input = document.getElementById(`stock-input-${productId}`);
  if (!input) return;

  const newStock = parseInt(input.value, 10);
  if (isNaN(newStock) || newStock < 0) {
    showToast("Please enter a valid non-negative number", "warning");
    return;
  }

  if (window.NestDB) {
    window.NestDB.update("products", productId, { stock: newStock });
    showToast("Stock quantity updated successfully!");
    renderInventoryTable();
  }
}
