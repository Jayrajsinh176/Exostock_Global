import {
  UserPlus,
  ShoppingCart,
  Package,
  Boxes,
  ReceiptText,
  BarChart3,
  ArrowRight,
  Target,
} from "lucide-react";

const workflowSteps = [
  {
    id: "01",
    title: "Registration",
    color: "#0d5b96",
    icon: UserPlus,
    points: [
      "User signs up",
      "Choose a plan",
      "Complete setup",
      "Access dashboard",
    ],
  },

  {
    id: "02",
    title: "Plan Activation",
    color: "#15803d",
    icon: ShoppingCart,
    points: [
      "Select subscription plan",
      "Activate plan",
      "Manage users",
      "Set business details",
    ],
  },

  {
    id: "03",
    title: "Product Management",
    color: "#6d28d9",
    icon: Package,
    points: [
      "Add and organize products",
      "Manage categories",
      "Set pricing & details",
      "Generate barcodes",
    ],
  },

  {
    id: "04",
    title: "Stock Management",
    color: "#f97316",
    icon: Boxes,
    points: [
      "Add opening stock",
      "Track real-time stock",
      "Manage stock in/out",
      "Transfer between locations",
    ],
  },

  {
    id: "05",
    title: "Sales & Orders",
    color: "#0891b2",
    icon: ReceiptText,
    points: [
      "Create sales orders",
      "Generate invoices",
      "Track payments",
      "Manage order history",
    ],
  },

  {
    id: "06",
    title: "Reports & Insights",
    color: "#dc2626",
    icon: BarChart3,
    points: [
      "View key reports",
      "Analyze business performance",
      "Export reports",
      "Make data-driven decisions",
    ],
  },
];

export default function SystemWorkflow() {
  return (
    <section
      id="workflow"
      className="bg-gradient-to-b from-white to-[#f7f9fc] py-20"
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#e9f3ff] px-5 py-2 text-xs font-bold uppercase tracking-[3px] text-[#0d5b96]">
            SYSTEM WORKFLOW
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-[#0d5b96] sm:text-5xl">
            End-to-End Business Workflow
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#0d5b96]">
            ExoStock simplifies inventory management through a unified workflow
            that connects every key operation—from registration to reports and
            analytics.
          </p>
        </div>

        {/* Workflow */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="group relative flex flex-col rounded-2xl border border-[#0d5b96] bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Step Number */}

                <div
                  className="absolute -top-4 left-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
                  style={{
                    background: step.color,
                  }}
                >
                  {step.id}
                </div>

                {/* Connector Arrow (Desktop Only) */}

                {index !== workflowSteps.length - 1 && (
                  <ArrowRight
                    className="absolute -right-6 top-14 hidden xl:block"
                    size={30}
                    style={{ color: step.color }}
                  />
                )}

                {/* Card Content */}
                {/* Icon */}

                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `${step.color}15`,
                  }}
                >
                  <Icon
                    size={32}
                    strokeWidth={2.2}
                    style={{
                      color: step.color,
                    }}
                  />
                </div>

                {/* Title */}

                <h3
                  className="mt-5 text-xl font-bold leading-tight"
                  style={{
                    color: step.color,
                  }}
                >
                  {step.title}
                </h3>

                {/* Divider */}

                <div
                  className="mt-3 h-1 w-12 rounded-full"
                  style={{
                    background: step.color,
                  }}
                ></div>

                {/* Description */}

                <p className="mt-3 text-sm leading-6 text-[#0d5b96]">
                  Complete this step to move seamlessly to the next stage of
                  your inventory management workflow.
                </p>

                {/* Workflow Points */}

                <ul className="mt-4 flex-1 space-y-2.5">
                  {step.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                        style={{
                          background: step.color,
                        }}
                      ></div>

                      <span className="text-sm leading-5 text-[#0d5b96]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Bottom Accent */}

                <div
                  className="mt-5 h-1 rounded-full opacity-70 transition-all duration-300 group-hover:opacity-100"
                  style={{
                    background: step.color,
                  }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Bottom Goal Section */}

        <div className="mt-10">
          <div className="overflow-hidden rounded-3xl border border-[#0d5b96] bg-white shadow-xl">
            <div className="flex flex-col items-center gap-8 p-8 md:flex-row md:p-10">
              {/* Goal Icon */}

              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-[#0d5b96] shadow-lg">
                <Target size={46} className="text-white" />
              </div>

              {/* Goal Content */}

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <h3 className="text-3xl font-extrabold text-[#0d5b96]">
                    OUR GOAL
                  </h3>

                  <div className="hidden h-8 w-px bg-[#0d5b96]/20 md:block"></div>

                  <p className="text-lg leading-8 text-[#0d5b96]">
                    To provide a seamless end-to-end workflow that helps
                    businesses save time, reduce errors, improve inventory
                    accuracy, and grow efficiently through one powerful
                    inventory management platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
