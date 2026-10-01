export const SUBSCRIPTION_PLANS = {
  Trial: {
    label: "Trial",
    maxProducts: 50,
    maxUsers: 1,
    maxLocations: 0,
    features: [
      "Dashboard Access",
      "Product Management",
      "Stock Tracking",
      "Inventory Management (Core)",
    ],
    support: "Email support and help docs",
    priceMonthly: 0,
    priceMonthlyUSD: 0,
    durationDays: 14,
  },

  Basic: {
    label: "Basic",
    maxProducts: 200,
    maxUsers: 1,
    maxLocations: 0,
    features: [
      "Everything in Trial",
      "Inventory Management",
      "Sales & Purchase",
      "GST Billing",
      "Reports",
    ],
    support: "Email support and knowledge base",
    priceMonthly: 799,
    priceMonthlyUSD: 9,
    durationMonths: 1,
  },

  Standard: {
    label: "Standard",
    maxProducts: 500,
    maxUsers: 3,
    maxLocations: 1,
    features: [
      "Everything in Basic",
      "Barcode Support",
      "Low Stock Alerts",
      "Role Management",
    ],
    support: "Email support and knowledge base",
    priceMonthly: 1699,
    priceMonthlyUSD: 25,
    durationMonths: 1,
  },

  Business: {
    label: "Business",
    maxProducts: 1000,
    maxUsers: 5,
    maxLocations: 5,
    features: [
      "Everything in Standard",
      "Multi Warehouse",
      "Analytics Dashboard",
      "Inventory Forecast",
      "Priority Support",
    ],
    support: "Priority support",
    priceMonthly: 3499,
    priceMonthlyUSD: 39,
    durationMonths: 1,
  },

  Enterprise: {
    label: "Enterprise",
    maxProducts: Number.POSITIVE_INFINITY,
    maxUsers: 10,
    maxLocations: 10,
    features: [
      "Everything in Business",
      "API Access",
      "Dedicated Support",
      "Custom Reports",
    ],
    support: "Dedicated enterprise support",
    priceMonthly: 7999,
    priceMonthlyUSD: 99,
    durationMonths: 1,
  },

  Custom: {
    label: "Custom",
    maxProducts: Number.POSITIVE_INFINITY,
    maxUsers: Number.POSITIVE_INFINITY,
    maxLocations: Number.POSITIVE_INFINITY,
    features: [
      "Everything in Enterprise",
      "Custom API Access",
      "White Label",
      "Cloud Deployment",
      "Custom Modules",
    ],
    support: "Dedicated support",
    priceMonthly: null,
    priceMonthlyUSD: null,
    durationMonths: 1,
  },
};

export const SUBSCRIPTION_GST_RATE = 18;

// Base (pre-tax) price for a plan. Yearly = 10x monthly ("2 months free").
export const getPlanBasePrice = (plan, billingPeriod, currency = "INR") => {
  const base = currency === "USD" ? plan.priceMonthlyUSD : plan.priceMonthly;
  if (!base) return 0;
  return billingPeriod === "yearly" ? base * 10 : base;
};

// GST applies to INR billing only.
export const getPlanPriceBreakdown = (plan, billingPeriod, currency = "INR") => {
  const subtotal = getPlanBasePrice(plan, billingPeriod, currency);
  const gstRate = currency === "INR" ? SUBSCRIPTION_GST_RATE : 0;
  const gst = Math.round(subtotal * gstRate) / 100;
  return {
    subtotal,
    gstRate,
    gst,
    total: Math.round((subtotal + gst) * 100) / 100,
  };
};

export const getSubscriptionPlan = (planName) =>
  SUBSCRIPTION_PLANS[planName] || SUBSCRIPTION_PLANS.Basic;

// Plans from lowest to highest. A higher plan includes everything a lower one has.
export const PLAN_ORDER = [
  "Trial",
  "Basic",
  "Standard",
  "Business",
  "Enterprise",
  "Custom",
];

// True when planName is minPlan or any plan above it.
export const isPlanAtLeast = (planName, minPlan) => {
  const rank = PLAN_ORDER.indexOf(planName);
  return rank !== -1 && rank >= PLAN_ORDER.indexOf(minPlan);
};

// Main Store <-> franchise stock movement (Standard and above).
export const isStockTransferAllowed = (planName) =>
  isPlanAtLeast(planName, "Standard");

// Franchise -> franchise stock movement (Business and above).
export const isInterFranchiseTransferAllowed = (planName) =>
  isPlanAtLeast(planName, "Business");

// Manager role (Standard and above).
export const isRoleManagementAllowed = (planName) =>
  isPlanAtLeast(planName, "Standard");

// Low stock alerts (Standard and above).
export const isLowStockAlertsAllowed = (planName) =>
  isPlanAtLeast(planName, "Standard");

// Bulk product import from CSV (Standard and above).
export const isCsvImportAllowed = (planName) =>
  isPlanAtLeast(planName, "Standard");

// Reports such as the Daily Sales Summary (Basic and above).
export const isReportsAllowed = (planName) => isPlanAtLeast(planName, "Basic");

// Business Overview analytics dashboard (Business and above).
export const isAnalyticsDashboardAllowed = (planName) =>
  isPlanAtLeast(planName, "Business");

export const getSupportLevel = (planName) => {
  const plan = getSubscriptionPlan(planName);
  return plan.support || "Email support and knowledge base";
};

export const canAddProductToPlan = (planName, currentCount) => {
  const plan = getSubscriptionPlan(planName);
  return currentCount < plan.maxProducts;
};

export const canAddUsersToPlan = (planName, currentCount) => {
  const plan = getSubscriptionPlan(planName);
  return currentCount < plan.maxUsers;
};

export const canAddLocationToPlan = (planName, currentCount) => {
  const plan = getSubscriptionPlan(planName);
  return currentCount < plan.maxLocations;
};

export const formatPlanProductLimit = (planName) => {
  const plan = getSubscriptionPlan(planName);

  return Number.isFinite(plan.maxProducts)
    ? String(plan.maxProducts)
    : "unlimited";
};

export const formatPlanUsersLimit = (planName) => {
  const plan = getSubscriptionPlan(planName);

  return Number.isFinite(plan.maxUsers) ? String(plan.maxUsers) : "unlimited";
};

export const formatPlanLocationLimit = (planName) => {
  const plan = getSubscriptionPlan(planName);

  return Number.isFinite(plan.maxLocations)
    ? String(plan.maxLocations)
    : "unlimited";
};

// Dashboard stock-movement and category charts (Business and above).
export const isAnalyticsAllowed = (planName) =>
  isPlanAtLeast(planName, "Business");

// Inventory Forecast (Business and above).
export const isReorderPatternsAllowed = (planName) =>
  isPlanAtLeast(planName, "Business");

export const isAIAssistantAllowed = (planName) =>
  isPlanAtLeast(planName, "Business");
