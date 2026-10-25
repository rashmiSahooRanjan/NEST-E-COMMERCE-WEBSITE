/**
 * NEST E-Commerce Website - Search Engine (search.js)
 * Live auto-suggestion dropdown, keyword highlights, and category filtering
 */

document.addEventListener("DOMContentLoaded", () => {
  const searchInputs = document.querySelectorAll("input[name='search']");
  searchInputs.forEach(input => {
    setupLiveSearch(input);
  });
});

function setupLiveSearch(input) {
  let debounceTimer = null;
  const parent = input.closest(".header-search-form") || input.parentElement;

  let dropdown = parent.querySelector(".search-suggestions-dropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.className = "search-suggestions-dropdown shadow-lg rounded-3";
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border: 1px solid #ECECEC;
      margin-top: 6px;
      z-index: 1050;
      max-height: 380px;
      overflow-y: auto;
      display: none;
    `;
    parent.style.position = "relative";
    parent.appendChild(dropdown);
  }

  input.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
      dropdown.style.display = "none";
      return;
    }

    debounceTimer = setTimeout(() => {
      const products = window.NestDB ? window.NestDB.findAll("products") : [];
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query))
      ).slice(0, 6);

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div class="p-3 text-center text-muted">
            <small>No matching products found</small>
          </div>
        `;
        dropdown.style.display = "block";
        return;
      }

      dropdown.innerHTML = matches.map(p => `
        <a href="product-details.html?id=${p.id}" class="d-flex align-items-center gap-3 p-2 border-bottom text-decoration-none text-dark hover-bg-light">
          <img src="${p.image || (p.images && p.images[0])}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 6px; background: #F8F9FA;">
          <div class="flex-grow-1 overflow-hidden">
            <div class="fw-bold text-truncate" style="font-size: 13px;">${highlightMatch(p.name, query)}</div>
            <div class="text-success fw-bold" style="font-size: 12px;">${formatPrice(p.price)}</div>
          </div>
          <span class="badge bg-light text-secondary" style="font-size: 10px;">${p.category}</span>
        </a>
      `).join("") + `
        <div class="p-2 text-center bg-light">
          <a href="shop.html?search=${encodeURIComponent(query)}" class="text-success fw-bold text-decoration-none" style="font-size: 12px;">
            View all results <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      `;
      dropdown.style.display = "block";
    }, 200);
  });

  document.addEventListener("click", (e) => {
    if (!parent.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

function highlightMatch(text, query) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return text.substring(0, index) + 
         `<span class="bg-warning-subtle text-dark fw-bold">${text.substring(index, index + query.length)}</span>` + 
         text.substring(index + query.length);
}
