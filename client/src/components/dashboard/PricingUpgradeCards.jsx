import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle,
  Gift,
  MessageCircle,
  Shield,
  TrendingUp,
} from "lucide-react";
import {
  AuthService,
  getCompanyProfile,
  getPlans,
  updateSubscriptionPlan,
} from "../../api";
import {
  formatPlanPrice,
  getPlanBasePrice,
  getPlanPriceBreakdown,
  STARTS_AT_PLANS,
  TRIAL_DAYS,
} from "../../constants/pricing";

const PLAN_DESIGN = {
  Trial: {
    price: `Free ${TRIAL_DAYS} Days`,
    products: "50 Products",
    staff: "1 Staff",
    franchise: "0 Franchise",
    features: [
      "Dashboard Access",
      "Product Management",
      "Stock Tracking",
      "Inventory Management (Core)",
    ],
    description: `Try ExoStock free for ${TRIAL_DAYS} days.`,
    icon: Gift,
    button: "Start Free Trial",
  },
  Basic: {
    products: "200 Products",
    staff: "1 Staff",
    franchise: "0 Franchise",
    features: [
      "Everything in Trial",
      "Inventory Management",
      "Sales & Purchase",
      "GST Billing",
      "Reports",
    ],
    description: "Perfect for small businesses.",
    icon: TrendingUp,
    button: "Choose Plan",
  },
  Standard: {
    products: "500 Products",
    staff: "3 Staff",
    franchise: "1 Franchise",
    features: [
      "Everything in Basic",
      "Barcode Support",
      "Low Stock Alerts",
      "Role Management",
    ],
    description: "Great for growing businesses.",
    icon: Building2,
    button: "Most Popular",
    featured: true,
  },
  Business: {
    products: "1,000 Products",
    staff: "5 Staff",
    franchise: "5 Franchise",
    features: [
      "Everything in Standard",
      "Multi Warehouse",
      "Analytics Dashboard",
      "Inventory Forecast",
      "Priority Support",
    ],
    description: "For expanding businesses.",
    icon: Building2,
    button: "Choose Plan",
  },
  Enterprise: {
    products: "Unlimited Products",
    staff: "10+ Staff",
    franchise: "10 Franchise",
    features: [
      "Everything in Business",
      "API Access",
      "Dedicated Support",
      "Custom Reports",
    ],
    description: "Complete enterprise solution.",
    icon: Shield,
    button: "Choose Plan",
  },
  Custom: {
    products: "Unlimited Products",
    staff: "Unlimited Staff",
    franchise: "Unlimited Franchise",
    features: [
      "Everything in Enterprise",
      "Custom API Access",
      "White Label",
      "Cloud Deployment",
      "Custom Modules",
    ],
    description: "Tailored to your requirements.",
    icon: MessageCircle,
    button: "Let's Talk",
  },
};

const PLAN_ORDER = [
  "Trial",
  "Basic",
  "Standard",
  "Business",
  "Enterprise",
  "Custom",
];

export default function PricingUpgradeCards() {
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState("Basic");
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [error, setError] = useState("");
  const [checkoutPlanId, setCheckoutPlanId] = useState(null);

  const currency = "USD";
  const checkout = checkoutPlanId
    ? getPlanPriceBreakdown(checkoutPlanId, billing, currency)
    : null;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const company = AuthService.getCompany();
        setCurrentPlanId(company?.plan || "Basic");
        const response = await getPlans();
        setPlans(response.data || []);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load subscription plans.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleUpgrade = async (planId) => {
    if (planId === currentPlanId || planId === "Custom") return;
    setError("");
    setCheckoutPlanId(null);
    setUpdatingPlan(true);
    try {
      await updateSubscriptionPlan(planId, billing, currency);
      const companyResponse = await getCompanyProfile();
      const company = companyResponse?.company || companyResponse;
      AuthService.setCompany(company);
      setCurrentPlanId(company.plan);
      window.location.reload();
    } catch (upgradeError) {
      setError(upgradeError.message || "Unable to update your subscription.");
    } finally {
      setUpdatingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-8 h-[520px] animate-pulse rounded-2xl bg-white" />
    );
  }

  const sortedPlans = [...plans].sort(
    (a, b) => PLAN_ORDER.indexOf(a.id) - PLAN_ORDER.indexOf(b.id),
  );

  return (
    <section className="-mx-4 mb-8 bg-[#f7f8fc] px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-[#0d5b96] sm:text-3xl">
        Your Subscription
      </h2>
      <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
        <div className="flex items-center rounded-full border border-[#0d5b96] bg-white p-2 shadow-lg">
          {["monthly", "yearly"].map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setBilling(period)}
              className={`relative rounded-full px-6 py-2 text-sm font-semibold capitalize transition ${billing === period ? "bg-[#0d5b96] text-white" : "text-[#0d5b96]"}`}
            >
              {period}
              {period === "yearly" && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold leading-4 text-white shadow">
                  Get 2 Months Free
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-5 text-center text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-14 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto pb-5 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-x-4 lg:gap-y-12 lg:overflow-visible lg:pt-8">
        {sortedPlans.map((plan) => {
          const design = PLAN_DESIGN[plan.id] || PLAN_DESIGN.Basic;
          const Icon = design.icon;
          const isCurrent =
            plan.id.toLowerCase() === String(currentPlanId).toLowerCase();
          const isCustom = plan.id === "Custom";
          const basePrice = getPlanBasePrice(plan.id, billing, currency);
          const price =
            plan.id === "Trial"
              ? design.price
              : basePrice == null
                ? "Contact Sales"
                : formatPlanPrice(basePrice, currency);
          const priceNote = plan.id === "Trial" ? "No card required" : "";

          return (
            <article
              key={plan.id}
              className={`flex w-68.75 shrink-0 snap-center flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-2xl lg:w-full ${design.featured ? "z-10 border-2 border-[#0d5b96] shadow-2xl hover:-translate-y-2" : "border-[#0d5b96] hover:-translate-y-2"}`}
            >
              <div className="h-[88px]">
                {design.featured ? (
                  <div className="flex h-11 items-center justify-center bg-[#0d5b96] text-sm font-bold uppercase tracking-wider text-white">
                    MOST POPULAR
                  </div>
                ) : (
                  <div className="h-11" />
                )}
                <div className="flex h-11 flex-col items-center justify-center bg-white">
                  <h3 className="text-[30px] font-black leading-none text-[#0d5b96]">
                    {plan.label || plan.id}
                  </h3>
                  <div className="mt-2 h-1 w-14 rounded-full bg-[#0d5b96]" />
                </div>
              </div>
              <div className="flex min-h-[560px] flex-1 flex-col p-4">
                <p className="h-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {STARTS_AT_PLANS.includes(plan.id) ? "Starts at" : ""}
                </p>
                <h2 className="text-center text-2xl font-extrabold text-[#0d5b96]">
                  {price}
                  {basePrice != null && (
                    <span className="ml-1 text-sm font-semibold text-gray-500">
                      {billing === "monthly" ? "/ month" : "/ year"}
                    </span>
                  )}
                </h2>
                <p className="mt-1 h-5 text-center text-sm font-medium text-gray-500">
                  {priceNote}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    basePrice ? setCheckoutPlanId(plan.id) : handleUpgrade(plan.id)
                  }
                  disabled={isCurrent || updatingPlan || isCustom}
                  className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold transition-all ${isCurrent ? "cursor-default border-2 border-green-500 bg-green-500 text-white disabled:opacity-100" : design.featured ? "bg-[#0d5b96] text-white hover:bg-[#084b7d]" : "border-2 border-[#0d5b96] text-[#0d5b96] hover:bg-[#0d5b96] hover:text-white"}`}
                >
                  {isCurrent
                    ? "Current Plan"
                    : updatingPlan
                      ? "Updating..."
                      : design.button}
                </button>
                <div className="mt-5 space-y-3 text-sm text-[#0d5b96]">
                  {[
                    plan.id === "Business" ? "1000 Products" : design.products,
                    design.staff,
                    design.franchise,
                  ].map((stat) => (
                    <div
                      key={stat}
                      className="flex items-center gap-3 border-b border-dashed border-gray-300 pb-2"
                    >
                      <CheckCircle
                        size={18}
                        className="flex-shrink-0 text-green-600"
                      />
                      {stat}
                    </div>
                  ))}
                </div>
                <div className="mt-2 min-h-[150px] ">
                  <h4 className="mb-5 text-base font-bold text-[#0d5b96]">
                    Included Features
                  </h4>
                  <ul className="space-y-2.5">
                    {design.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle
                          size={16}
                          className="mt-1 flex-shrink-0 text-green-600"
                        />
                        <span className="text-[12px] leading-5 text-[#0d5b96]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 rounded-xl bg-[#f8fafc] p-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#e9f3ff]">
                      <Icon size={20} className="text-[#0d5b96]" />
                    </div>
                    <p className="text-[13px] leading-5 text-[#0d5b96]">
                      {design.description}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {checkout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setCheckoutPlanId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-extrabold text-[#0d5b96]">
              {checkoutPlanId} Plan
            </h3>
            <p className="mt-1 text-sm capitalize text-gray-500">
              {billing} billing
            </p>

            <div className="mt-5 space-y-3 text-sm text-[#212529]">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPlanPrice(checkout.subtotal, currency)}</span>
              </div>
              {checkout.gstRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    GST ({checkout.gstRate}%)
                  </span>
                  <span>{formatPlanPrice(checkout.gst, currency)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-dashed border-gray-300 pt-3 text-base font-bold text-[#0d5b96]">
                <span>Total Payable</span>
                <span>{formatPlanPrice(checkout.total, currency)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCheckoutPlanId(null)}
                className="flex-1 rounded-xl border-2 border-[#0d5b96] py-2.5 text-sm font-semibold text-[#0d5b96]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpgrade(checkoutPlanId)}
                disabled={updatingPlan}
                className="flex-1 rounded-xl bg-[#0d5b96] py-2.5 text-sm font-semibold text-white hover:bg-[#084b7d]"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
