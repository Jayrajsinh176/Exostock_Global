import {
  Bot,
  ShieldCheck,
  UserCog,
  Lock,
  MessageSquareText,
  PackageSearch,
  FileText,
  Bell,
  TrendingUp,
  Mic,
} from "lucide-react";

const aiRoles = [
  {
    title: "Admin AI (Business Intelligence)",
    icon: ShieldCheck,
    color: "#0d5b96",
    description:
      "Full access to dashboards, reports, analytics and complete business insights.",
  },

  {
    title: "Staff AI (Operations Assistant)",
    icon: UserCog,
    color: "#16a34a",
    description:
      "Access limited to day-to-day inventory operations and staff-related queries.",
  },
];

const aiFeatures = [
  {
    title: "AI Chat for Inventory Queries",
    icon: MessageSquareText,
  },
  {
    title: "Smart Stock Recommendations",
    icon: PackageSearch,
  },
  {
    title: "Auto Report Generation",
    icon: FileText,
  },
  {
    title: "Low Stock Alerts",
    icon: Bell,
  },
  {
    title: "Sales Trend Analysis",
    icon: TrendingUp,
  },
  {
    title: "Natural Language Commands",
    icon: Mic,
  },
];

export default function AdminAIAssistant() {
  return (
    <section
      id="admin-ai"
      className="bg-gradient-to-b from-white to-[#f7f9fc] py-20"
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#e9f3ff] px-5 py-2 text-xs font-bold uppercase tracking-[3px] text-[#0d5b96]">
            ADMIN AI ASSISTANT
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-[#0d5b96] sm:text-5xl">
            Intelligent AI Assistant for
            <br />
            Smarter Inventory Management
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#0d5b96]">
            Admin AI Assistant helps you manage inventory faster, generate
            reports instantly, answer business questions, and automate daily
            operations using artificial intelligence.
          </p>
        </div>

        {/* Main Layout */}

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}

          <div>
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0d5b96] text-white shadow-lg">
                <Bot size={34} />
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#0d5b96]">
                  Admin AI Assistant
                </h3>

                <p className="mt-4 text-lg leading-8 text-[#0d5b96]">
                  Your intelligent business companion that understands natural
                  language, generates reports, analyzes inventory, and helps
                  make faster business decisions.
                </p>
              </div>
            </div>

            {/* AI Roles */}

            <div className="mt-10 space-y-6">
              {aiRoles.map((role, index) => {
                const Icon = role.icon;

                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#0d5b96] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: `${role.color}15`,
                        }}
                      >
                        <Icon
                          size={30}
                          style={{
                            color: role.color,
                          }}
                        />
                      </div>

                      <div>
                        <h4
                          className="text-xl font-bold"
                          style={{
                            color: role.color,
                          }}
                        >
                          {role.title}
                        </h4>

                        <p className="mt-2 leading-7 text-[#0d5b96]">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Access Restriction */}

            <div className="mt-8 rounded-3xl border border-[#0d5b96] bg-gradient-to-br from-red-50 to-white p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100">
                  <Lock size={34} className="text-red-600" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-red-600">
                    Access Restricted
                  </h3>

                  <p className="mt-3 leading-7 text-[#0d5b96]">
                    Reports and advanced business insights are available only
                    for Administrators. Staff members can perform operational
                    tasks but cannot access confidential analytics and
                    management reports.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Dashboard */}

          <div className="relative">
            {/* Main AI Dashboard */}

            <div className="overflow-hidden rounded-3xl border border-[#0d5b96] bg-white shadow-2xl">
              {/* Header */}

              <div className="flex items-center justify-between border-b bg-[#0d5b96] px-6 py-4">
                <div className="flex items-center gap-3">
                  <Bot size={26} className="text-white" />

                  <h3 className="text-xl font-bold text-white">
                    Admin AI Assistant
                  </h3>
                </div>

                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>

              {/* Dashboard Body */}

              <div className="p-6">
                {/* Welcome Card */}

                <div className="rounded-2xl bg-[#eef6ff] p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0d5b96]">
                      <Bot size={30} className="text-white" />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-[#0b1f44]">
                        👋 Hello Admin!
                      </h4>

                      <p className="text-slate-600">
                        How can I help you today?
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Quick Actions */}

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    "Inventory Report",
                    "Low Stock Items",
                    "Sales Report",
                    "Revenue Summary",
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="rounded-xl border border-[#0d5b96]/15 bg-white p-4 text-sm font-semibold text-[#0b1f44] shadow transition hover:border-[#0d5b96] hover:bg-[#eef6ff]"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {/* Search */}

                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Type your query here..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0d5b96]"
                  />
                </div>

                {/* Stats */}

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#eef6ff] p-5">
                    <p className="text-sm text-slate-500">Sales Report</p>

                    <h3 className="mt-2 text-2xl font-bold text-[#0d5b96]">
                      $13.1K USD
                    </h3>

                    <span className="text-sm font-semibold text-green-600">
                      +18.5%
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#fff7ed] p-5">
                    <p className="text-sm text-slate-500">Low Stock</p>

                    <h3 className="mt-2 text-2xl font-bold text-orange-600">
                      12
                    </h3>

                    <span className="text-sm">Products</span>
                  </div>

                  <div className="rounded-2xl bg-[#eefcf4] p-5">
                    <p className="text-sm text-slate-500">Inventory</p>

                    <h3 className="mt-2 text-2xl font-bold text-green-600">
                      98%
                    </h3>

                    <span className="text-sm">Available</span>
                  </div>
                </div>

                {/* Floating AI Bot */}

                <div className="pointer-events-none absolute -right-8 bottom-12 hidden xl:block">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-2xl ring-4 ring-[#eef6ff]">
                    <Bot size={58} className="text-[#0d5b96]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
