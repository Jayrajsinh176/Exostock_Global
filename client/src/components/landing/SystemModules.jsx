import {
  ShieldCheck,
  Package,
  Boxes,
  ShoppingCart,
  BarChart3,
  Settings,
} from "lucide-react";

const modules = [
  {
    id: "01",
    title: "Authentication",
    color: "#0d5b96",
    icon: ShieldCheck,
    features: [
      "Secure user registration and login",
      "Role-based access control",
      "Staff and franchise management",
      "Profile and security management",
    ],
  },

  {
    id: "02",
    title: "Product Management",
    color: "#16a34a",
    icon: Package,
    features: [
      "Add, edit and manage products",
      "Category and brand management",
      "Product images and details",
      "Barcode generation & tracking",
    ],
  },

  {
    id: "03",
    title: "Stock Management",
    color: "#f97316",
    icon: Boxes,
    features: [
      "Real-time stock tracking",
      "Low stock & expiry alerts",
      "Stock in & stock out",
      "Stock transfer between locations",
    ],
  },

  {
    id: "04",
    title: "Sales & Orders",
    color: "#7c3aed",
    icon: ShoppingCart,
    features: [
      "Create and manage sales orders",
      "Customer & supplier management",
      "GST invoice generation",
      "Order history & tracking",
    ],
  },

  {
    id: "05",
    title: "Reports & Analytics",
    color: "#0891b2",
    icon: BarChart3,
    features: [
      "Sales & purchase reports",
      "Stock reports and valuation",
      "Profit & loss summary",
      "Custom filters & date range",
    ],
  },

  {
    id: "06",
    title: "Billing & Settings",
    color: "#dc2626",
    icon: Settings,
    features: [
      "Subscription management",
      "Billing history",
      "Business preferences",
      "Backup & system logs",
    ],
  },
];

export default function SystemModules() {
  return (
    <section
      id="modules"
      className="bg-gradient-to-b from-white to-[#f7f9fc] py-20"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Heading */}

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#e9f3ff] px-5 py-2 text-xs font-bold uppercase tracking-[3px] text-[#0d5b96]">
            SYSTEM MODULES
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-[#0d5b96] sm:text-5xl">
            Powerful Modules
            <br />
            Built for Every Business
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#0d5b96]">
            ExoStock comes with integrated modules that simplify inventory,
            automate business operations, and provide complete control over your
            products, sales, reports, and billing.
          </p>
        </div>

        {/* Modules Grid */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <div
                key={module.id}
                className="group rounded-2xl border border-[#0d5b96] bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Header */}

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${module.color}15`,
                    }}
                  >
                    <Icon
                      size={24}
                      strokeWidth={2}
                      style={{
                        color: module.color,
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <span
                      className="ml-[10px] inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase"
                      style={{
                        background: `${module.color}15`,
                        color: module.color,
                      }}
                    >
                      MODULE {module.id}
                    </span>

                    <h3
                      className="mt-2 ml-[10px] text-xl font-bold leading-tight"
                      style={{
                        color: module.color,
                      }}
                    >
                      {module.title}
                    </h3>
                  </div>
                </div>

                <div
                  className="mt-4 h-1 w-14 rounded-full"
                  style={{
                    background: module.color,
                  }}
                ></div>

                {/* Description */}

                <p className="mt-4 text-sm leading-6 text-[#0d5b96]">
                  Powerful tools designed to simplify daily operations and
                  improve productivity for your business.
                </p>

                {/* Features */}

                <ul className="mt-5 space-y-2.5">
                  {module.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: `${module.color}15`,
                        }}
                      >
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            background: module.color,
                          }}
                        />
                      </div>

                      <span className="text-sm leading-6 text-[#0d5b96]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Bottom Accent */}

                <div
                  className="mt-5 h-1 w-full rounded-full opacity-70 transition-all duration-500 group-hover:opacity-100"
                  style={{
                    background: module.color,
                  }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Bottom Information Banner */}

        <div className="mt-16 flex justify-center">
          <div className="flex w-full max-w-5xl flex-col items-center gap-5 rounded-3xl border border-[#0d5b96] bg-gradient-to-r from-[#eef6ff] to-white p-6 shadow-lg md:flex-row md:items-center">
            {/* Icon */}

            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-[#0d5b96] shadow-lg">
              <BarChart3 size={40} className="text-white" />
            </div>

            {/* Text */}

            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-[#0d5b96]">
                Complete Inventory Management Solution
              </h3>

              <p className="mt-2 text-base leading-7 text-[#0d5b96]">
                These integrated modules work together seamlessly to provide a
                complete, accurate, and real-time inventory management solution.
                From authentication and product management to billing, reports,
                and analytics, ExoStock simplifies every business operation from
                a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
