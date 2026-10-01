// Subscription pricing shown to customers. Base prices exclude GST.
// Yearly = 10 x monthly ("Get 2 Months Free", ~16% saving).
export const SUBSCRIPTION_GST_RATE = 18;
export const TRIAL_DAYS = 14;

export const PLAN_BASE_PRICES = {
  Basic: { monthly: { INR: 799, USD: 9 }, yearly: { INR: 7990, USD: 90 } },
  Standard: {
    monthly: { INR: 1699, USD: 25 },
    yearly: { INR: 16990, USD: 250 },
  },
  Business: {
    monthly: { INR: 3499, USD: 39 },
    yearly: { INR: 34990, USD: 390 },
  },
  Enterprise: {
    monthly: { INR: 7999, USD: 99 },
    yearly: { INR: 79990, USD: 990 },
  },
};

// Plans whose price is a starting point rather than fixed.
export const STARTS_AT_PLANS = ["Enterprise"];

export const formatPlanPrice = (amount, currency = "USD") =>
  new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const getPlanBasePrice = (planId, billing, currency = "USD") =>
  PLAN_BASE_PRICES[planId]?.[billing]?.[currency] ?? null;

// GST applies to INR billing only.
export const getPlanPriceBreakdown = (planId, billing, currency = "USD") => {
  const subtotal = getPlanBasePrice(planId, billing, currency);
  if (subtotal == null) return null;
  const gstRate = currency === "INR" ? SUBSCRIPTION_GST_RATE : 0;
  const gst = Math.round(subtotal * gstRate) / 100;
  return {
    subtotal,
    gstRate,
    gst,
    total: Math.round((subtotal + gst) * 100) / 100,
  };
};
