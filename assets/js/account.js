/**
 * NEST E-Commerce Website - Customer Account Engine (account.js)
 * Profile management, address book, password updates
 */

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html?redirect=my-account.html";
    return;
  }

  loadAccountDetails(user);
  setupProfileForm(user);
  setupAddressForm(user);
  setupPasswordForm(user);
});

function loadAccountDetails(user) {
  // Fill text displays
  document.querySelectorAll(".account-user-name").forEach(el => el.textContent = user.name);
  document.querySelectorAll(".account-user-email").forEach(el => el.textContent = user.email);

  // Fill inputs
  const nameInput = document.getElementById("profile-name");
  const emailInput = document.getElementById("profile-email");
  const phoneInput = document.getElementById("profile-phone");

  if (nameInput) nameInput.value = user.name || "";
  if (emailInput) emailInput.value = user.email || "";
  if (phoneInput) phoneInput.value = user.phone || "";

  // Address
  if (user.address) {
    const street = document.getElementById("addr-street");
    const city = document.getElementById("addr-city");
    const state = document.getElementById("addr-state");
    const pin = document.getElementById("addr-pincode");

    if (street) street.value = user.address.street || "";
    if (city) city.value = user.address.city || "";
    if (state) state.value = user.address.state || "";
    if (pin) pin.value = user.address.pincode || "";
  }

  // Load account orders preview
  const orders = window.NestDB ? window.NestDB.find("orders", o => o.userId === user.id || o.customerEmail === user.email) : [];
  const ordersCountBadge = document.getElementById("account-orders-count");
  if (ordersCountBadge) ordersCountBadge.textContent = orders.length;

  const ordersPreview = document.getElementById("account-recent-orders-table");
  if (ordersPreview) {
    if (orders.length === 0) {
      ordersPreview.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No recent orders found</td></tr>`;
    } else {
      ordersPreview.innerHTML = orders.slice(0, 3).map(o => `
        <tr>
          <td><span class="fw-bold">${o.id}</span></td>
          <td>${new Date(o.createdAt).toLocaleDateString()}</td>
          <td><span class="status-pill status-${o.orderStatus}">${o.orderStatus}</span></td>
          <td class="fw-bold">${formatPrice(o.total)}</td>
          <td><a href="order-details.html?id=${o.id}" class="btn btn-sm btn-outline-success">View</a></td>
        </tr>
      `).join("");
    }
  }
}

function setupProfileForm(currentUser) {
  const form = document.getElementById("account-profile-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("profile-name").value.trim();
    const phone = document.getElementById("profile-phone").value.trim();

    if (!name) {
      showToast("Name cannot be empty", "warning");
      return;
    }

    const updated = { ...currentUser, name, phone };
    if (window.NestDB) {
      await window.NestDB.updateUserProfile(currentUser.id, { name, phone });
      await window.NestDB.logUserActivity("profile_updated", {
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: name,
        description: `Profile name/phone updated for ${name}`
      });
    }
    localStorage.setItem("nest_current_user", JSON.stringify(updated));
    showToast("Profile details updated in MongoDB Atlas!");
    loadAccountDetails(updated);
  });
}

function setupAddressForm(currentUser) {
  const form = document.getElementById("account-address-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const street = document.getElementById("addr-street").value.trim();
    const city = document.getElementById("addr-city").value.trim();
    const state = document.getElementById("addr-state").value.trim();
    const pincode = document.getElementById("addr-pincode").value.trim();

    const address = { street, city, state, pincode };
    const updated = { ...currentUser, address };

    if (window.NestDB) {
      await window.NestDB.updateUserProfile(currentUser.id, { address });
      await window.NestDB.logUserActivity("address_updated", {
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        description: `Delivery address updated: ${city}, ${state}`
      });
    }
    localStorage.setItem("nest_current_user", JSON.stringify(updated));
    showToast("Saved delivery address updated in MongoDB Atlas!");
  });
}

function setupPasswordForm(currentUser) {
  const form = document.getElementById("account-password-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentPass = document.getElementById("pass-current").value;
    const newPass = document.getElementById("pass-new").value;
    const confirmPass = document.getElementById("pass-confirm").value;

    if (currentPass !== currentUser.password) {
      showToast("Current password is incorrect", "error");
      return;
    }

    if (newPass.length < 6) {
      showToast("New password must be at least 6 characters", "warning");
      return;
    }

    if (newPass !== confirmPass) {
      showToast("New passwords do not match", "error");
      return;
    }

    const updated = { ...currentUser, password: newPass };
    if (window.NestDB) {
      await window.NestDB.updateUserProfile(currentUser.id, { password: newPass });
      await window.NestDB.logUserActivity("password_changed", {
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        description: `Password updated successfully`
      });
    }
    localStorage.setItem("nest_current_user", JSON.stringify(updated));
    form.reset();
    showToast("Password updated in MongoDB Atlas!");
  });
}
