/**
 * NEST E-Commerce Website - Authentication Engine (auth.js)
 * User login, registration, session persistence, role validation
 * Connects directly to MongoDB Atlas REST Backend
 */

document.addEventListener("DOMContentLoaded", () => {
  setupCustomerLoginForm();
  setupRegisterForm();
  setupAdminLoginForm();
});

function setupCustomerLoginForm() {
  const form = document.getElementById("customer-login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      showToast("Please enter both email and password", "warning");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.innerHTML : "Sign In";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Authenticating...';
    }

    try {
      const res = await window.NestDB.loginUser(email, password);

      if (!res.success || !res.user) {
        showToast(res.message || "Invalid email or password", "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        return;
      }

      const user = res.user;
      localStorage.setItem("nest_current_user", JSON.stringify(user));

      // Log login event to MongoDB Atlas
      await window.NestDB.logUserActivity("login_success", {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        description: `Customer logged in: ${user.name}`
      });

      showToast(`Welcome back, ${user.name}!`);

      setTimeout(() => {
        if (user.role === "admin") {
          window.location.href = "admin/dashboard.html";
        } else {
          const redirect = new URLSearchParams(window.location.search).get("redirect") || "my-account.html";
          window.location.href = redirect;
        }
      }, 700);
    } catch (err) {
      console.error("Login exception:", err);
      showToast("An error occurred during login. Please try again.", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById("customer-register-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const phone = document.getElementById("reg-phone").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;

    if (!name || !email || !phone || !password) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.innerHTML : "Register";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving to Database...';
    }

    try {
      // 1. Direct MongoDB Atlas Registration via API
      const res = await window.NestDB.registerUser({
        name,
        email,
        phone,
        password,
        role: "customer"
      });

      if (!res.success || !res.user) {
        showToast(res.message || "Registration failed", "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        return;
      }

      const user = res.user;
      localStorage.setItem("nest_current_user", JSON.stringify(user));

      // 2. Log activity into MongoDB Atlas
      await window.NestDB.logUserActivity("user_registered", {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        description: `New customer registered: ${user.name} (${user.email})`
      });

      showToast("Account created and saved to MongoDB Atlas! Welcome.");

      setTimeout(() => {
        window.location.href = "my-account.html";
      }, 700);
    } catch (err) {
      console.error("Register exception:", err);
      showToast("Error saving account to database. Please check connection.", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

function setupAdminLoginForm() {
  const form = document.getElementById("admin-login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("admin-email").value.trim().toLowerCase();
    const password = document.getElementById("admin-password").value;

    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.innerHTML : "Log In";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Verifying...';
    }

    try {
      const res = await window.NestDB.loginUser(email, password);

      if (!res.success || !res.user) {
        showToast("Invalid admin credentials", "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        return;
      }

      const matched = res.user;
      if (matched.role !== "admin") {
        showToast("Access Denied: You do not have administrator permissions", "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        return;
      }

      localStorage.setItem("nest_current_user", JSON.stringify(matched));

      // Log admin login to MongoDB Atlas
      await window.NestDB.logUserActivity("admin_login", {
        userId: matched.id,
        userEmail: matched.email,
        userName: matched.name,
        description: `Admin authenticated: ${matched.name}`
      });

      showToast("Admin authenticated successfully!");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 600);
    } catch (err) {
      console.error("Admin login error:", err);
      showToast("Login error", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}
