/**
 * NEST E-Commerce Website - Admin Product Management Engine (admin/products.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminAccess();
  if (document.getElementById("admin-products-tbody")) {
    renderAdminProductsTable();
    setupProductSearch();
  }
  if (document.getElementById("admin-add-product-form")) {
    setupAddProductForm();
  }
});

function verifyAdminAccess() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "login.html";
  }
}

function renderAdminProductsTable(filterQuery = "") {
  const tbody = document.getElementById("admin-products-tbody");
  if (!tbody) return;

  let products = window.NestDB ? window.NestDB.findAll("products") : [];
  
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No products found</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="../${p.image || (p.images && p.images[0])}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 8px; background: #F8F9FA;">
          <div>
            <div class="fw-bold text-dark text-truncate" style="max-width: 220px;">${p.name}</div>
            <small class="text-muted">SKU: ${p.sku || p.id}</small>
          </div>
        </div>
      </td>
      <td><span class="badge bg-light text-secondary text-capitalize">${p.category}</span></td>
      <td class="fw-bold text-success">${formatPrice(p.price)}</td>
      <td>
        <span class="badge ${p.stock <= 5 ? 'bg-danger' : p.stock <= 15 ? 'bg-warning text-dark' : 'bg-success'}">
          ${p.stock} units
        </span>
      </td>
      <td>
        <span class="status-pill status-${p.status === 'active' ? 'active' : 'cancelled'}">
          ${p.status.toUpperCase()}
        </span>
      </td>
      <td>${new Date(p.createdAt).toLocaleDateString()}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-danger" onclick="deleteAdminProduct('${p.id}')" title="Delete Product">
          <i class="bi bi-trash3"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

function setupProductSearch() {
  const searchInput = document.getElementById("admin-product-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    renderAdminProductsTable(e.target.value.trim());
  });
}

function deleteAdminProduct(productId) {
  if (confirm("Are you sure you want to permanently delete this product?")) {
    if (window.NestDB) {
      window.NestDB.delete("products", productId);
      showToast("Product deleted successfully");
      renderAdminProductsTable();
    }
  }
}

function setupAddProductForm() {
  const form = document.getElementById("admin-add-product-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("prod-name").value.trim();
    const category = document.getElementById("prod-category").value;
    const price = Number(document.getElementById("prod-price").value);
    const oldPrice = Number(document.getElementById("prod-oldprice")?.value || price);
    const stock = Number(document.getElementById("prod-stock").value);
    const sku = document.getElementById("prod-sku").value.trim();
    const description = document.getElementById("prod-desc").value.trim();

    if (!name || !price || !stock) {
      showToast("Please provide product name, price, and initial stock", "warning");
      return;
    }

    const discountPercent = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: name,
      slug: slug,
      category: category,
      price: price,
      oldPrice: oldPrice > price ? oldPrice : null,
      discountPercent: discountPercent,
      stock: stock,
      sku: sku || `SKU-${Date.now()}`,
      description: description,
      rating: 5.0,
      ratingCount: 1,
      image: "assets/images/products/apples-1.jpg",
      images: ["assets/images/products/apples-1.jpg"],
      status: "active",
      featured: true,
      newArrival: true,
      createdAt: new Date().toISOString()
    };

    if (window.NestDB) {
      window.NestDB.insert("products", newProduct);
    }

    showToast("Product created successfully!");
    setTimeout(() => {
      window.location.href = "products.html";
    }, 600);
  });
}
