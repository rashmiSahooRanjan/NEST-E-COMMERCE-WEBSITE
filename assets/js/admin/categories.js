/**
 * NEST E-Commerce Website - Admin Category Management Engine (admin/categories.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminAccess();
  renderCategoriesTable();
  setupAddCategoryForm();
});

function verifyAdminAccess() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "login.html";
  }
}

function renderCategoriesTable() {
  const tbody = document.getElementById("admin-categories-tbody");
  if (!tbody) return;

  const categories = window.NestDB ? window.NestDB.findAll("categories") : [];
  const products = window.NestDB ? window.NestDB.findAll("products") : [];

  tbody.innerHTML = categories.map(c => {
    const prodCount = products.filter(p => p.category === c.slug).length;
    return `
      <tr>
        <td>
          <img src="../${c.image || 'assets/images/categories/groceries.jpg'}" alt="${c.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 8px;">
        </td>
        <td class="fw-bold text-dark">${c.name}</td>
        <td><code>${c.slug}</code></td>
        <td><span class="badge bg-light text-dark fw-bold">${prodCount} products</span></td>
        <td><span class="status-pill status-${c.status}">${c.status.toUpperCase()}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory('${c.id}')">
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function setupAddCategoryForm() {
  const form = document.getElementById("admin-add-category-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cat-name").value.trim();
    const slug = document.getElementById("cat-slug").value.trim().toLowerCase() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const desc = document.getElementById("cat-desc").value.trim();

    if (!name) {
      showToast("Category name is required", "warning");
      return;
    }

    const newCat = {
      id: `cat-${Date.now()}`,
      name: name,
      slug: slug,
      description: desc,
      icon: "bi-tag",
      image: "assets/images/categories/groceries.jpg",
      status: "active"
    };

    if (window.NestDB) {
      window.NestDB.insert("categories", newCat);
      showToast("Category added successfully!");
      form.reset();
      renderCategoriesTable();
    }
  });
}

function deleteCategory(catId) {
  if (confirm("Are you sure you want to delete this category?")) {
    if (window.NestDB) {
      window.NestDB.delete("categories", catId);
      showToast("Category deleted");
      renderCategoriesTable();
    }
  }
}
