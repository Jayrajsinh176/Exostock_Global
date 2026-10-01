import { useState } from "react";

import {
  CheckCircle,
  TrendingUp,
  Building2,
  Shield,
  MessageCircle,
  Gift,
  ChevronDown,
} from "lucide-react";

const plans = [
  {
    name: "Trial",
    color: "#0d5b96",
    featured: false,
    price: "14 Days",
    duration: "",
    products: "50 Products",
    staff: "1 Staff",
    franchise: "0 Franchise",
    features: [
      "Dashboard Access",
      "Product Management",
      "Stock Tracking",
      "Inventory Management (Core)",
    ],
    description: "Try ExoStock free for 14 days.",
    icon: Gift,
    button: "Start Free Trial",
  },
  {
    name: "Basic",
    color: "#0d5b96",
    featured: false,
    monthlyPrice: "$9",
    yearlyPrice: "$90",
    products: "200 Products",
    staff: "1 Staff",
    franchise: "0 Franchise",
    features: [
      "Everything in Trial",
      "Full Inventory Management",
      "Sales & Purchase",
      "GST Billing",
      "Reports",
    ],
    description: "Perfect for small businesses.",
    icon: TrendingUp,
    button: "Choose Plan",
  },

  {
    name: "Standard",
    color: "#0d5b96",
    featured: true,
    monthlyPrice: "$19",
    yearlyPrice: "$190",
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
  },

  {
    name: "Business",
    color: "#0d5b96",
    featured: false,
    monthlyPrice: "$39",
    yearlyPrice: "$390",
    products: "1000 Products",
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

  {
    name: "Enterprise",
    color: "#0d5b96",
    featured: false,
    monthlyPrice: "Starts at $99",
    yearlyPrice: "$990",
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

  {
    name: "Custom",
    color: "#0d5b96",
    featured: false,
    monthlyPrice: "Contact Sales",
    yearlyPrice: "Custom",
    custom: true,
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
];

export default function PricingPlans() {
  const [billing, setBilling] = useState("monthly");
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-[#f7f8fc] py-16 lg:py-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}

        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#e9f3ff] px-5 py-2 text-sm font-bold uppercase tracking-widest text-[#0d5b96]">
            EXOSTOCK PLANS
          </span>

          <h2 className="mt-6 text-3xl font-extrabold text-[#0d5b96] sm:text-4xl lg:text-5xl">
            Transparent pricing.

            <br />
            No surprises.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#0d5b96] sm:text-lg">
            Pay monthly, cancel any time. Every plan includes a 14-day free trial — no credit card required to start.
          </p>
        </div>

        <div className="mb-12 flex flex-col items-center gap-4 lg:flex-row lg:justify-center lg:gap-8">
          {/* Billing Switch */}
          <div className="flex items-center rounded-full border border-[#0d5b96] bg-white p-2 shadow-lg">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                billing === "monthly"
                  ? "bg-[#0d5b96] text-white"
                  : "text-[#0d5b96]"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className={`relative rounded-full px-6 py-2 text-sm font-semibold transition ${
                billing === "yearly"
                  ? "bg-[#0d5b96] text-white"
                  : "text-[#0d5b96]"
              }`}
            >
              Yearly
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold leading-4 text-white shadow sm:left-auto sm:-right-3 sm:translate-x-0">
                2 Months FREE
              </span>
            </button>
          </div>
        </div>

        {/* Responsive Grid */}

        <div className="mx-auto grid max-w-md grid-cols-1 items-start gap-x-6 gap-y-8 pt-4 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5 2xl:grid-cols-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                onPointerEnter={(e) =>
                  e.pointerType === "mouse" && setOpenIndex(index)
                }
                onPointerLeave={(e) =>
                  e.pointerType === "mouse" && setOpenIndex(null)
                }
                className={`relative flex flex-col rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.featured
                    ? "z-10 border-[#0d5b96] shadow-2xl ring-1 ring-[#0d5b96]"
                    : "border-[#0d5b96]"
                }`}
              >
                {/* Most Popular Badge */}

                {plan.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0d5b96] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    Most Popular
                  </span>
                )}

                {/* Plan Name */}
                <div className="flex flex-col items-center px-5 pt-6">
                  <h3 className="text-[26px] font-black leading-none text-[#0d5b96] sm:text-[28px]">
                    {plan.name}
                  </h3>

                  <div className="mt-2 h-1 w-16 rounded-full bg-[#0d5b96]"></div>
                </div>

                {/* Card Body */}

                <div className="flex flex-1 flex-col p-5">
                  {/* Price */}

                  <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-[#0d5b96] lg:text-2xl">
                      {plan.name === "Trial"
                        ? plan.price
                        : billing === "monthly"
                          ? plan.monthlyPrice
                          : plan.yearlyPrice}
                    </h2>

                    {/* Same lines on every card so all cards line up */}

                    <p className="mt-2 text-base text-gray-500">
                      {plan.name === "Trial"
                        ? "Full access"
                        : plan.custom
                          ? "Tailored pricing"
                          : billing === "monthly"
                            ? "/month"
                            : "/year"}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {plan.name === "Trial"
                        ? "No credit card required"
                        : plan.custom
                          ? "Built for your business"
                          : "Taxes calculated at checkout"}
                    </p>
                  </div>

                  {/* Button */}

                  <button
                    className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                      plan.featured
                        ? "bg-[#0d5b96] text-white hover:bg-[#084b7d]"
                        : "border-2 border-[#0d5b96] text-[#0d5b96] hover:bg-[#0d5b96] hover:text-white"
                    }`}
                  >
                    {plan.button}
                  </button>

                  {/* Plan Stats */}

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 border-b border-dashed border-gray-200 pb-2">
                      <CheckCircle
                        size={20}
                        className="text-green-600 flex-shrink-0"
                      />
                      <span className="text-[#0d5b96] font-medium">
                        {plan.products}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 border-b border-dashed border-gray-200 pb-2">
                      <CheckCircle
                        size={20}
                        className="text-green-600 flex-shrink-0"
                      />
                      <span className="text-[#0d5b96] font-medium">
                        {plan.staff}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle
                        size={20}
                        className="text-green-600 flex-shrink-0"
                      />
                      <span className="text-[#0d5b96] font-medium">
                        {plan.franchise}
                      </span>
                    </div>
                  </div>

                  {/* Features Toggle */}

                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="mt-5 flex w-full items-center justify-between border-t border-dashed border-gray-300 pt-4 text-sm font-semibold text-[#0d5b96]"
                  >
                    {isOpen ? "Included Features" : "View features"}
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Expandable Features */}

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                  <div className="overflow-hidden">
                  <div className="pt-4">
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle
                            size={18}
                            className="mt-1 flex-shrink-0 text-green-600"
                          />

                          <span className="text-[13px] leading-5 text-[#0d5b96]">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Bottom Info */}

                    <div className="mt-5 rounded-xl bg-[#f8fafc] p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#e9f3ff]">
                          <Icon size={20} className="text-[#0d5b96]" />
                        </div>

                        <p className="text-sm leading-6 text-[#0d5b96]">
                          {plan.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}