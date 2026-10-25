/**
 * NEST E-Commerce Website - Order History & Tracking Engine (orders.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("orders-history-list")) {
    renderCustomerOrders();
  }
  if (document.getElementById("order-details-container")) {
    renderOrderDetails();
  }
});

function renderCustomerOrders() {
  const container = document.getElementById("orders-history-list");
  if (!container) return;

  const user = getCurrentUser();
  const allOrders = window.NestDB ? window.NestDB.findAll("orders") : [];
  
  // Show user's orders, or fallback to all orders for demonstration
  const userOrders = user 
    ? allOrders.filter(o => o.userId === user.id || o.customerEmail === user.email)
    : allOrders;

  if (userOrders.length === 0) {
    container.innerHTML = `
      <div class="card p-5 text-center border-0 shadow-sm rounded-4">
        <i class="bi bi-bag-x text-muted" style="font-size: 50px;"></i>
        <h5 class="mt-3 fw-bold">No Orders Found</h5>
        <p class="text-muted">You haven't placed any orders yet.</p>
        <div>
          <a href="shop.html" class="btn btn-success rounded-pill px-4">Start Shopping</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = userOrders.map(order => `
    <div class="card mb-3 border border-light-subtle rounded-4 shadow-sm overflow-hidden">
      <div class="card-header bg-light d-flex justify-content-between align-items-center flex-wrap py-3 px-4">
        <div>
          <span class="text-muted small">ORDER PLACED</span>
          <div class="fw-bold text-dark">${new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
        <div>
          <span class="text-muted small">TOTAL</span>
          <div class="fw-bold text-success">${formatPrice(order.total)}</div>
        </div>
        <div>
          <span class="text-muted small">SHIP TO</span>
          <div class="fw-semibold text-dark text-truncate" style="max-width: 160px;">${order.shippingAddress?.fullName || order.customerName}</div>
        </div>
        <div>
          <span class="text-muted small">ORDER #</span>
          <div class="fw-bold text-dark">${order.id}</div>
        </div>
        <div>
          <a href="order-details.html?id=${order.id}" class="btn btn-sm btn-outline-success rounded-pill px-3">
            <i class="bi bi-eye me-1"></i> Track Order
          </a>
        </div>
      </div>
      <div class="card-body p-4">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <span class="status-pill status-${order.orderStatus}">
            <i class="bi bi-dot fs-5"></i> Status: ${order.orderStatus.toUpperCase()}
          </span>
          <span class="text-muted small">Payment: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})</span>
        </div>
        <div class="row g-3">
          ${order.items.map(item => `
            <div class="col-md-6 d-flex align-items-center gap-3">
              <img src="${item.image}" alt="${item.name}" style="width: 55px; height: 55px; object-fit: contain; border-radius: 8px; background: #F8F9FA;">
              <div class="overflow-hidden">
                <a href="product-details.html?id=${item.productId}" class="fw-bold text-dark text-decoration-none text-truncate d-block" style="font-size: 13.5px;">${item.name}</a>
                <small class="text-muted">Qty: ${item.quantity} × ${formatPrice(item.price)}</small>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `).join("");
}

function renderOrderDetails() {
  const container = document.getElementById("order-details-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id") || "ORD-98241";
  const order = window.NestDB ? window.NestDB.findById("orders", orderId) : null;

  if (!order) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h4>Order #${orderId} Not Found</h4>
        <p class="text-muted">Please check your order number or tracking ID.</p>
        <a href="my-orders.html" class="btn btn-success mt-2">View All Orders</a>
      </div>
    `;
    return;
  }

  // Populate Order Tracking Page
  const statusColor = order.orderStatus === "delivered" ? "success" : order.orderStatus === "cancelled" ? "danger" : "warning";
  
  container.innerHTML = `
    <div class="row g-4">
      <!-- Left Column: Tracking and Items -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center flex-wrap border-bottom pb-3 mb-3">
            <div>
              <h4 class="fw-bold mb-1">Order #${order.id}</h4>
              <p class="text-muted small mb-0">Placed on ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <span class="status-pill status-${order.orderStatus} fs-6 px-3 py-1">
                ${order.orderStatus.toUpperCase()}
              </span>
            </div>
          </div>

          <!-- Timeline -->
          <h5 class="fw-bold mb-3">Shipment Progress</h5>
          <div class="tracking-timeline ps-2">
            ${(order.trackingSteps || [
              { title: "Order Confirmed", desc: "Order details received", date: "Completed", completed: true },
              { title: "Processing & Quality Check", desc: "Warehouse sorting", date: "Completed", completed: true },
              { title: "In Transit", desc: "Dispatched with courier partner", date: "In Progress", completed: order.orderStatus === 'shipped' || order.orderStatus === 'delivered' },
              { title: "Delivered", desc: "Package delivered to door", date: "Estimated", completed: order.orderStatus === 'delivered' }
            ]).map((step, idx) => `
              <div class="timeline-step ${step.completed ? 'completed' : ''}">
                <div class="timeline-icon">
                  <i class="bi ${step.completed ? 'bi-check-lg' : 'bi-circle'}"></i>
                </div>
                <div class="timeline-info">
                  <h6>${step.title}</h6>
                  <p>${step.desc} &bull; <span class="text-muted">${step.date}</span></p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Ordered Items Card -->
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <h5 class="fw-bold mb-3">Items in this Package (${order.items.length})</h5>
          <div class="table-responsive">
            <table class="table align-middle">
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td style="width: 70px;">
                      <img src="${item.image}" alt="${item.name}" style="width: 55px; height: 55px; object-fit: contain; border-radius: 8px; background: #F8F9FA;">
                    </td>
                    <td>
                      <a href="product-details.html?id=${item.productId}" class="fw-bold text-dark text-decoration-none">${item.name}</a>
                      <div class="text-muted small">Unit Price: ${formatPrice(item.price)}</div>
                    </td>
                    <td class="text-center">Qty: ${item.quantity}</td>
                    <td class="text-end fw-bold text-dark">${formatPrice(item.price * item.quantity)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Address and Order Summary -->
      <div class="col-lg-4">
        <!-- Delivery Address -->
        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h5 class="fw-bold mb-3"><i class="bi bi-geo-alt text-success me-2"></i> Shipping Address</h5>
          <div class="fw-bold text-dark mb-1">${order.shippingAddress?.fullName || order.customerName}</div>
          <p class="text-muted small mb-1">${order.shippingAddress?.street || 'N/A'}</p>
          <p class="text-muted small mb-1">${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}</p>
          <p class="text-muted small mb-0"><i class="bi bi-telephone me-1"></i> Phone: ${order.shippingAddress?.phone || order.customerPhone}</p>
        </div>

        <!-- Payment Info -->
        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h5 class="fw-bold mb-3"><i class="bi bi-credit-card text-success me-2"></i> Payment Details</h5>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Payment Mode:</span>
            <span class="fw-bold text-uppercase">${order.paymentMethod}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Status:</span>
            <span class="status-pill status-${order.paymentStatus === 'paid' ? 'completed' : 'pending'}">${order.paymentStatus.toUpperCase()}</span>
          </div>
        </div>

        <!-- Order Summary Totals -->
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <h5 class="fw-bold mb-3">Payment Summary</h5>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Subtotal:</span>
            <span>${formatPrice(order.subtotal)}</span>
          </div>
          ${order.discount > 0 ? `
            <div class="d-flex justify-content-between mb-2 text-danger">
              <span>Coupon Discount (${order.couponCode || 'PROMO'}):</span>
              <span>-${formatPrice(order.discount)}</span>
            </div>
          ` : ''}
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Estimated Tax (5% GST):</span>
            <span>${formatPrice(order.tax)}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Delivery Charges:</span>
            <span>${order.shipping === 0 ? '<span class="text-success fw-bold">FREE</span>' : formatPrice(order.shipping)}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between fw-bold fs-5 text-dark">
            <span>Grand Total:</span>
            <span class="text-success">${formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
