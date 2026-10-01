// Plans from lowest to highest. A higher plan includes everything a lower one has.
// Keep in sync with PLAN_ORDER in server/utils/subscription.js.
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

export const PLAN_PRODUCT_LIMITS = {
  Trial: 50,
  Basic: 200,
  Standard: 500,
  Business: 1000,
  Enterprise: Infinity,
  Custom: Infinity,
};
