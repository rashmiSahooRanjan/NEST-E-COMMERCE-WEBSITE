/**
 * NEST E-Commerce Website - Admin Sales Reports Engine (admin/reports.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminAccess();
  generateReportSummary();
});

function verifyAdminAccess() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "login.html";
  }
}

function generateReportSummary() {
  const orders = window.NestDB ? window.NestDB.findAll("orders") : [];
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const revEl = document.getElementById("report-total-revenue");
  const ordEl = document.getElementById("report-total-orders");
  const avgEl = document.getElementById("report-avg-order");

  if (revEl) revEl.textContent = formatPrice(totalRevenue);
  if (ordEl) ordEl.textContent = totalOrders;
  if (avgEl) avgEl.textContent = formatPrice(avgOrderValue);

  // Table
  const tbody = document.getElementById("admin-reports-tbody");
  if (!tbody) return;

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${new Date(o.createdAt).toLocaleDateString()}</td>
      <td>${o.customerName}</td>
      <td>${o.items.length} items</td>
      <td>${formatPrice(o.subtotal)}</td>
      <td>${formatPrice(o.discount)}</td>
      <td>${formatPrice(o.tax)}</td>
      <td class="fw-bold text-success">${formatPrice(o.total)}</td>
      <td><span class="status-pill status-${o.orderStatus}">${o.orderStatus.toUpperCase()}</span></td>
    </tr>
  `).join("");
}

function exportReportCSV() {
  const orders = window.NestDB ? window.NestDB.findAll("orders") : [];
  if (orders.length === 0) {
    showToast("No orders available to export", "warning");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Order ID,Date,Customer,Items,Subtotal,Discount,Tax,Total,Status\n";
  orders.forEach(o => {
    const row = [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      o.items.length,
      o.subtotal,
      o.discount,
      o.tax,
      o.total,
      o.orderStatus
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `nest_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast("CSV report generated and downloaded!");
}
