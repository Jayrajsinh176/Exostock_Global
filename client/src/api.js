import { isPlanAtLeast } from "./constants/plans";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/**
 * Auth Service - handles token and user data storage
 */
export const AuthService = {
  // Token Management
  setToken: (token) => {
    localStorage.setItem("authToken", token);
  },

  getToken: () => {
    return localStorage.getItem("authToken");
  },

  // User Data Management
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Company Data Management
  setCompany: (company) => {
    localStorage.setItem("company", JSON.stringify(company));
  },

  // Login Type
  setLoginType: (type) => {
    localStorage.setItem("loginType", type);
  },

  getLoginType: () => {
    return localStorage.getItem("loginType");
  },

  // Franchise
  setFranchise: (franchise) => {
    localStorage.setItem("franchise", JSON.stringify(franchise));
  },

  getFranchise: () => {
    const franchise = localStorage.getItem("franchise");
    return franchise ? JSON.parse(franchise) : null;
  },

  getCompany: () => {
    const company = localStorage.getItem("company");
    return company ? JSON.parse(company) : null;
  },
  // Franchise logins store their parent company, so both use the company plan.
  hasBusinessAccess: () =>
    isPlanAtLeast(AuthService.getCompany()?.plan, "Business"),

  hasBasicAccess: () =>
    isPlanAtLeast(AuthService.getCompany()?.plan, "Basic"),

  hasStandardAccess: () =>
    isPlanAtLeast(AuthService.getCompany()?.plan, "Standard"),

  isFranchise: () => {
    return AuthService.getLoginType() === "franchise";
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("company");
    localStorage.removeItem("franchise");
    localStorage.removeItem("loginType");
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  // Get auth header for API calls
  getAuthHeader: () => {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

/**
 * Register a new user and company
 * @param {Object} formData - Registration data with company_name, name, email, phone, password, address
 * @returns {Promise<Object>} Response with user, token, and company
 */
export async function registerUser(formData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration Failed");
  }

  // Store auth data
  if (data.token) {
    AuthService.setToken(data.token);
    AuthService.setUser(data.user);
    AuthService.setCompany(data.company);
  }

  return data;
}

/**
 * Login user with email or phone
 * @param {string} email - User email (optional if phone provided)
 * @param {string} phone - User phone (optional if email provided)
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with user, token, and company
 */
export async function loginUser(email, phone, password) {
  const credentials = { password };

  // Add email or phone to credentials
  if (email) {
    credentials.email = email;
  }
  if (phone) {
    credentials.phone = phone;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Store auth data
  if (data.token) {
    AuthService.setToken(data.token);
    AuthService.setUser(data.user);
    AuthService.setCompany(data.company);
    AuthService.setLoginType("company");
  }

  return data;
}

export async function loginFranchise(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/franchise-auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  AuthService.setToken(data.token);
  AuthService.setFranchise(data.franchise);
  AuthService.setCompany(data.company);
  AuthService.setLoginType("franchise");

  return data;
}

/**
 * Request a password reset email
 * @param {string} email - Account email
 * @returns {Promise<Object>} Response with a generic confirmation message
 */
export async function requestPasswordReset(email) {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to send reset instructions");
  }

  return data;
}

/**
 * Reset password using the code sent to the user's email
 * @param {string} email - Account email
 * @param {string} otp - 6-digit reset code
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response message
 */
export async function resetPassword(email, otp, newPassword) {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Password reset failed");
  }

  return data;
}

/**
 * Logout user - clear auth data
 */
export function logoutUser() {
  AuthService.clearAuth();
}

// ============================================
// PRODUCTS API
// ============================================

/**
 * Get all products for the company
 * @param {Object} options - Query options { page: 1, limit: 10, category: categoryId, search: searchTerm }
 * @returns {Promise<Object>} Products list with pagination
 */
export async function getProducts(options = {}) {
  const params = new URLSearchParams();
  if (options.page !== undefined) {
    const page = Number.parseInt(options.page, 10);
    params.append("page", Number.isNaN(page) ? 1 : Math.max(1, page));
  }
  if (options.limit !== undefined) {
    const limit = Number.parseInt(options.limit, 10);
    params.append("limit", Number.isNaN(limit) ? 10 : Math.max(1, limit));
  }
  if (options.category) params.append("category", options.category);
  if (options.search) params.append("search", options.search);

  const response = await fetch(`${API_BASE_URL}/api/products?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data;
}

/**
 * Get a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product details
 */
export async function getProductById(productId) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product");
  }

  return data;
}

/**
 * Create a new product
 * @param {Object} productData - { name, sku, category, price, stock }
 * @returns {Promise<Object>} Created product data
 */
export async function createProduct(productData) {
  const isMultipart = productData instanceof FormData;
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      // The browser supplies the multipart boundary for FormData. Setting this
      // header ourselves prevents Multer from reading the file and fields.
      ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      ...AuthService.getAuthHeader(),
    },
    body: isMultipart ? productData : JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product");
  }

  return data;
}

/**
 * Update an existing product
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product data
 */
export async function updateProduct(productId, productData) {
  const isMultipart = productData instanceof FormData;
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: "PUT",
    headers: {
      ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      ...AuthService.getAuthHeader(),
    },
    body: isMultipart ? productData : JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update product");
  }

  return data;
}

/**
 * Delete a product
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteProduct(productId) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
}

// ============================================
// CATEGORIES API
// ============================================

/**
 * Get all categories for the company
 * @returns {Promise<Object>} Categories list
 */
export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/api/category`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch categories");
  }

  return data;
}

/**
 * Create a new category
 * @param {Object} categoryData - { name }
 * @returns {Promise<Object>} Created category data
 */
export async function createCategory(categoryData) {
  const response = await fetch(`${API_BASE_URL}/api/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create category");
  }

  return data;
}

/**
 * Update an existing category
 * @param {string} categoryId - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category data
 */
export async function updateCategory(categoryId, categoryData) {
  const response = await fetch(`${API_BASE_URL}/api/category/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update category");
  }

  return data;
}

/**
 * Delete a category
 * @param {string} categoryId - Category ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteCategory(categoryId) {
  const response = await fetch(`${API_BASE_URL}/api/category/${categoryId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete category");
  }

  return data;
}

// ============================================
// USERS API
// ============================================

/**
 * Get all users for the company
 * @param {Object} options - Query options { page: 0, limit: 10, search: searchTerm }
 * @returns {Promise<Object>} Users list
 */
export async function getUsers(options = {}) {
  const params = new URLSearchParams();
  if (options.page !== undefined) params.append("page", options.page);
  if (options.limit !== undefined) params.append("limit", options.limit);
  if (options.search) params.append("search", options.search);

  const response = await fetch(`${API_BASE_URL}/api/users?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
}

/**
 * Get a single user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User details
 */
export async function getUserById(userId) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data;
}

/**
 * Add a new user to the company
 * @param {Object} userData - { name, email, phone, role, password }
 * @returns {Promise<Object>} Created user data
 */
export async function addUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add user");
  }

  return data;
}

/**
 * Update user details
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUser(userId, userData) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update user");
  }

  return data;
}

/**
 * Delete a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteUser(userId) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete user");
  }

  return data;
}

// ============================================
// SUBSCRIPTION/PLANS API
// ============================================

/**
 * Get product statistics for dashboard
 * @returns {Promise<Object>} Product stats including inventory value, low stock alerts, etc.
 */
export async function getProductStats() {
  const response = await fetch(`${API_BASE_URL}/api/products/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product stats");
  }

  return data;
}

/**
 * Get low stock products
 * @returns {Promise<Object>} Low stock products list
 */
export async function getLowStockProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products/low-stock`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch low stock products");
  }

  return data;
}

// ============================================
// ANALYTICS API
// ============================================

/**
 * Get stock movement analysis (units sold per month)
 * @returns {Promise<Object>} Stock movement data with monthly breakdown
 */
export async function getStockMovementAnalysis() {
  const response = await fetch(`${API_BASE_URL}/api/analytics/stock-movement`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch stock movement analysis");
  }

  return data;
}

/**
 * Get category performance analysis (inventory value by category)
 * @returns {Promise<Object>} Category performance data with inventory values
 */
export async function getCategoryPerformanceAnalysis() {
  const response = await fetch(
    `${API_BASE_URL}/api/analytics/category-performance`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch category performance analysis",
    );
  }

  return data;
}

/**
 * Get reorder patterns analysis (reorder frequency)
 * @returns {Promise<Object>} Reorder patterns data with monthly frequency
 */
export async function getReorderPatternsAnalysis() {
  const response = await fetch(
    `${API_BASE_URL}/api/analytics/reorder-patterns`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch reorder patterns analysis",
    );
  }

  return data;
}

/**
 * Get subscription plans
 * @returns {Promise<Object>} Available plans
 */
export async function getPlans() {
  const response = await fetch(`${API_BASE_URL}/api/company/plan`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch plans");
  }

  return {
    ...data,
    data: (data.data || []).map((plan) => ({
      ...plan,
      support: plan.support || "Email support and knowledge base",
    })),
  };
}

/**
 * Get current subscription details
 * @returns {Promise<Object>} Current subscription details
 */
export async function getCurrentSubscription() {
  const response = await fetch(`${API_BASE_URL}/api/company/subscription`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch current subscription details",
    );
  }
  return data;
}

/**
 * Get subscription history
 * @returns {Promise<Object>} Subscription history records
 */
export async function getSubscriptionHistory() {
  const response = await fetch(`${API_BASE_URL}/api/subscription/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch subscription history");
  }

  return data;
}

/**
 * update subscription plan
 * @param {string} planId - Plan ID to subscribe
 * @param {string} billingPeriod - "monthly" or "yearly"
 * @param {string} currency - "USD" (default) or "INR"
 * @returns {Promise<Object>} Subscription update confirmation
 */
export const updateSubscriptionPlan = async (
  planId,
  billingPeriod = "monthly",
  currency = "USD",
) => {
  const response = await fetch(`${API_BASE_URL}/api/company/subscription`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify({ planId, billingPeriod, currency }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update subscription plan");
  }

  // Update localStorage immediately
  if (data.company) {
    AuthService.setCompany(data.company);
  }

  return data;
};

/**
 * Cancel current company subscription and downgrade to basic
 */
export async function cancelCompanySubscription() {
  const response = await fetch(
    `${API_BASE_URL}/api/company/subscription/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel subscription");
  }

  if (data.company) {
    AuthService.setCompany(data.company);
  }

  return data;
}

/**
 * Get company profile
 */
export async function getCompanyProfile() {
  const response = await fetch(`${API_BASE_URL}/api/company`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch company profile");
  }

  // Some endpoints may return a wrapped response.
  if (data && data.success && data.company) {
    return data.company;
  }

  return data;
}

/**
 * Get company billing/transaction history (includes plan changes)
 * @returns {Promise<Object>} { success, billingHistory }
 */
export async function getCompanyBillingHistory() {
  const response = await fetch(`${API_BASE_URL}/api/company/billing-history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch billing history");
  }

  return data;
}
// ============================================
// VENDORS API
// ============================================

/**
 * Get all vendors for the company
 * @returns {Promise<Object>} Vendors list with details
 */
export async function getVendors() {
  const response = await fetch(`${API_BASE_URL}/api/vendor`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch vendors");
  }

  return data;
}

/**
 * Get a single vendor by ID
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} Vendor details with products
 */
export async function getVendorById(vendorId) {
  const response = await fetch(`${API_BASE_URL}/api/vendor/${vendorId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch vendor details");
  }

  return data;
}

/**
 * Get products supplied by a vendor
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} List of products from this vendor
 */
export async function getVendorProducts(vendorId) {
  const response = await fetch(
    `${API_BASE_URL}/api/vendor/${vendorId}/products`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch vendor products");
  }

  return data;
}

/**
 * Get orders/history associated with a vendor
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} List of orders completed with this vendor
 */
export async function getVendorOrders(vendorId) {
  const response = await fetch(
    `${API_BASE_URL}/api/vendor/${vendorId}/orders`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch vendor orders");
  }

  return data;
}

/**
 * Create a new vendor
 * @param {Object} vendorData - { name, phone, email, address }
 * @returns {Promise<Object>} Created vendor data
 */
export async function createVendor(vendorData) {
  const response = await fetch(`${API_BASE_URL}/api/vendor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(vendorData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create vendor");
  }

  return data;
}

/**
 * Update vendor details/status
 * @param {string} vendorId - Vendor ID
 * @param {Object} vendorData - fields to update
 * @returns {Promise<Object>} Updated vendor payload
 */
export async function updateVendor(vendorId, vendorData) {
  const response = await fetch(`${API_BASE_URL}/api/vendor/${vendorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(vendorData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update vendor");
  }

  return data;
}

/**
 * Create a supply request for a vendor
 * @param {string} vendorId - Vendor ID
 * @param {Object} payload - supply request payload
 * @returns {Promise<Object>} Created request payload
 */
export async function createVendorSupplyRequest(vendorId, payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/vendor/${vendorId}/supply-requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create supply request");
  }

  return data;
}

/**
 * Get all supply requests for a vendor
 * @param {string} vendorId - Vendor ID
 * @param {string} [status] - optional status filter
 * @returns {Promise<Object>} Supply requests
 */
export async function getVendorSupplyRequests(vendorId, status) {
  const query = new URLSearchParams();
  if (status) query.set("status", status);

  const response = await fetch(
    `${API_BASE_URL}/api/vendor/${vendorId}/supply-requests?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch supply requests");
  }

  return data;
}

/**
 * Get a supply request by vendor and request ID
 * @param {string} vendorId
 * @param {string} requestId
 * @returns {Promise<Object>} Supply request
 */
export async function getVendorSupplyRequestById(vendorId, requestId) {
  const response = await fetch(
    `${API_BASE_URL}/api/vendor/${vendorId}/supply-requests/${requestId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch supply request details");
  }

  return data;
}

/**
 * Update supply request status
 * @param {string} vendorId
 * @param {string} requestId
 * @param {Object} payload
 * @returns {Promise<Object>} Updated request
 */
export async function updateVendorSupplyRequestStatus(
  vendorId,
  requestId,
  payload,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/vendor/${vendorId}/supply-requests/${requestId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update supply request status");
  }

  return data;
}


/**
 * Mark supply request as paid
 * @param {string} vendorId
 * @param {string} requestId
 * @param {Object} payload
 * @returns {Promise<Object>} Payment confirmation
 */
export async function payVendorSupplyRequest(vendorId, requestId, payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/vendor/${vendorId}/supply-requests/${requestId}/pay`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
      body: JSON.stringify(payload || {}),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to complete payment");
  }

  return data;
}

/**
 * Get Purchase History
 * @returns {Promise<Object>}
 */
export async function getPurchaseHistory() {
  const response = await fetch(`${API_BASE_URL}/api/vendor/purchase-history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch purchase history");
  }

  return data;
}

// ============================================
// ORDERS API
// ============================================

export async function getOrderStats() {
  const response = await fetch(`${API_BASE_URL}/api/orders/stats/overview`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order stats");
  }

  return data;
}

export async function getOrders(options = {}) {
  const params = new URLSearchParams();

  if (options.page !== undefined) params.append("page", options.page);
  if (options.limit !== undefined) params.append("limit", options.limit);
  if (options.search) params.append("search", options.search);

  const response = await fetch(
    `${API_BASE_URL}/api/orders?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
}

/**
 * Get order report (all orders, optionally within a date range)
 * @param {Object} options - { from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
 * @returns {Promise<Object>} { orders: [...] }
 */
export async function getOrderReport(options = {}) {
  const params = new URLSearchParams();
  if (options.from) params.append("from", options.from);
  if (options.to) params.append("to", options.to);

  const response = await fetch(
    `${API_BASE_URL}/api/orders/report?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order report");
  }

  return data;
}

export async function getSubscriptionAlert() {
  const response = await fetch(`${API_BASE_URL}/api/subscription/alert`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function getDailySalesSummary() {
  const response = await fetch(`${API_BASE_URL}/api/orders/daily-summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
/**
 * Get stock report for all products (available + used stock)
 * @returns {Promise<Object>} { products: [{ id, name, sku, category, availableStock, usedStock, ... }] }
 */
export async function getProductReport() {
  const response = await fetch(`${API_BASE_URL}/api/products/report`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product report");
  }

  return data;
}

export async function getProductDetails(productId, options = {}) {
  const params = new URLSearchParams();

  if (options.page !== undefined) params.append("page", options.page);
  if (options.limit !== undefined) params.append("limit", options.limit);
  if (options.search) params.append("search", options.search);
  if (options.date) params.append("date", options.date);
  if (options.sort) params.append("sort", options.sort);

  const response = await fetch(
    `${API_BASE_URL}/api/products/${productId}/details?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product details");
  }

  return data;
}

// ============================================
// BILLING API
// ============================================

export async function getBillingHistory(params = {}) {
  const queryString = new URLSearchParams(params).toString();

  const response = await fetch(
    `${API_BASE_URL}/api/billing/history?${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch billing history");
  }

  return data;
}

export async function getBillingSummary() {
  const response = await fetch(`${API_BASE_URL}/api/billing/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch billing summary");
  }

  return data;
}

/**
 * Get Business Dashboard Overview
 * @returns {Promise<Object>} Business dashboard statistics
 */
export async function getBusinessOverview() {
  const response = await fetch(
    `${API_BASE_URL}/api/analytics/business-overview`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch business overview");
  }

  return data;
}

// ============================================
// FRANCHISE API
// ============================================

export async function createFranchise(franchiseData) {
  const response = await fetch(`${API_BASE_URL}/api/franchises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(franchiseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create franchise");
  }

  return data;
}

export async function getFranchises() {
  const response = await fetch(`${API_BASE_URL}/api/franchises`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch franchises");
  }

  return data;
}

export async function getFranchiseById(id) {
  const response = await fetch(`${API_BASE_URL}/api/franchises/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch franchise");
  }

  return data;
}

export async function updateFranchise(id, franchiseData) {
  const response = await fetch(`${API_BASE_URL}/api/franchises/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(franchiseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update franchise");
  }

  return data;
}

export async function toggleFranchiseStatus(id) {
  const response = await fetch(`${API_BASE_URL}/api/franchises/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update franchise status");
  }

  return data;
}

export async function getFranchiseLocations() {
  const response = await fetch(`${API_BASE_URL}/api/franchises/locations`, {
    headers: {
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch franchise locations");
  }

  return data;
}

export async function addStock(productId, stockData) {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${productId}/add-stock`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
      body: JSON.stringify(stockData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add stock");
  }

  return data;
}

export async function transferStock(transferData) {
  const response = await fetch(`${API_BASE_URL}/api/stock-transfers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(transferData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to transfer stock");
  }

  return data;
}

export async function getStockTransferHistory() {
  const response = await fetch(`${API_BASE_URL}/api/stock-transfers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch stock transfer history");
  }

  return data;
}

export async function getFranchiseProfile() {
  const response = await fetch(`${API_BASE_URL}/api/franchises/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch franchise profile");
  }

  return data;
}

export async function updateFranchiseProfile(profileData) {
  const response = await fetch(`${API_BASE_URL}/api/franchises/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update franchise profile");
  }

  return data;
}

/**
 * Change logged-in user's password
 */
export async function changePassword(passwordData) {
  const loginType = AuthService.getLoginType();

  const endpoint =
    loginType === "franchise"
      ? "/api/franchise-auth/change-password"
      : "/api/auth/change-password";

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(passwordData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to change password");
  }

  if (loginType === "franchise") {
    if (data.franchise) {
      AuthService.setFranchise(data.franchise);
    }
  } else {
    if (data.user) {
      AuthService.setUser(data.user);
    }

    if (data.company) {
      AuthService.setCompany(data.company);
    }
  }

  if (data.token) {
    AuthService.setToken(data.token);
  }

  return data;
}

// ============================================
// SUPPLY REQUEST API
// ============================================

/**
 * Create Supply Request
 */
export async function createSupplyRequest(requestData) {
  const response = await fetch(`${API_BASE_URL}/api/supply-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create supply request");
  }

  return data;
}

/**
 * Get All Supply Requests
 */
export async function getSupplyRequests() {
  const response = await fetch(`${API_BASE_URL}/api/supply-requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch supply requests");
  }

  return data;
}

/**
 * Get Supply Request By ID
 */
export async function getSupplyRequestById(id) {
  const response = await fetch(`${API_BASE_URL}/api/supply-requests/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch supply request");
  }

  return data;
}

/**
 * Update Supply Request Status
 */
export async function updateSupplyRequestStatus(id, status) {
  const response = await fetch(
    `${API_BASE_URL}/api/supply-requests/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update status");
  }

  return data;
}

/**
 * Update Payment Status
 */
export async function updateSupplyRequestPayment(id, paymentData) {
  const response = await fetch(
    `${API_BASE_URL}/api/supply-requests/${id}/payment`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
      },
      body: JSON.stringify(paymentData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update payment");
  }

  return data;
}

/**
 * Purchase History
 */
export async function getSupplyPurchaseHistory() {
  const response = await fetch(`${API_BASE_URL}/api/supply-requests/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch purchase history");
  }

  return data;
}
