const features = [
  {
    id: 1,
    icon: "📦",
    title: "Real-Time Stock Tracking",
    description:
      "Every sale, purchase, and return instantly updates your inventory. Track stock levels across warehouses in real time from anywhere.",
    tags: ["Live Updates", "Multi-Location", "Barcode Support"],
    featured: false,
  },
  {
    id: 2,
    icon: "🔒",
    title: "Your Data. Always",
    description:
      "Secure cloud storage with full data ownership. Export everything, any time, in any format. No lock-in. Ever.",
    tags: ["Data Ownership", "PDF Export", "WhatsApp Share"],
    featured: false,
  },
  {
    id: 3,
    icon: "🔔",
    title: "Smart Low Stock Alerts",
    description:
      "Receive instant notifications before products run out. Never lose sales because of stock shortages again.",
    tags: ["Custom Threshold", "WhatsApp Alerts", "Email Alerts"],
    featured: false,
  },
  {
    id: 4,
    icon: "📊",
    title: "Sales & Purchase Reports",
    description:
      "View daily, weekly and monthly reports with profit analysis, best-selling products and inventory insights.",
    tags: ["Visual Charts", "Excel Export", "Date Filters"],
    featured: false,
  },
  {
    id: 5,
    icon: "👥",
    title: "Multi-User Access",
    description:
      "Assign different roles for Owner, Accountant, Sales Staff and Warehouse Manager with complete activity logs.",
    tags: ["Role Permissions", "Audit Log", "Secure Access"],
    featured: false,
  },
  {
    id: 6,
    icon: "🏪",
    title: "Supplier & Customer Management",
    description:
      "Maintain supplier records, customer history, outstanding balances and purchase details in one place.",
    tags: ["Payment Tracking", "Credit Notes", "Purchase History"],
    featured: false,
  },
];

export default function ProductFeatures() {
  return (
    <section className="bg-[#f5f9ff] px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}

        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="inline-block rounded-full bg-[#0d5b96]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#0d5b96] sm:px-5 sm:text-sm">
            Powerful Features
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#0d5b96] sm:text-4xl lg:text-5xl">
            Everything your team needs. Nothing they don't.
          </h2>

          <p className="mt-5 text-base leading-7 text-[#0d5b96] sm:text-lg sm:leading-8">
            Built for retail, distribution, and multi-location businesses that
            have outgrown spreadsheets but don't need a bloated ERP.
          </p>
        </div>

        {/* Grid */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border p-5 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-6 lg:p-7
              ${
                feature.featured
                  ? "border border-[#0d5b96] bg-gradient-to-br from-[#0d5b96] to-[#2679b8] text-white"
                  : "border border-[#0d5b96] bg-white hover:border-[#0d5b96]"
              }`}
            >
              {/* Shine */}

              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

              {/* Icon */}

              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-3xl transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 sm:h-14 sm:w-14
                ${feature.featured ? "bg-white/20" : "bg-[#0d5b96]/10"}`}
              >
                {feature.icon}
              </div>

              {/* Title */}

              <h3
                className={`mb-3 text-xl font-bold leading-snug sm:text-2xl lg:text-3xl
                ${feature.featured ? "text-white" : "text-[#0d5b96]"}`}
              >
                {feature.title}
              </h3>

              {/* Description */}

              <p
                className={`flex-1 text-sm leading-6 sm:text-[15px] sm:leading-7
                ${feature.featured ? "text-blue-100" : "text-[#0d5b96]"}`}
              >
                {feature.description}
              </p>

              {/* Tags */}

              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                {feature.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 hover:-translate-y-1 sm:px-4 sm:text-sm
                    ${
                      feature.featured
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-[#eef5fc] text-[#0d5b96] hover:bg-[#0d5b96] hover:text-white"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
