import {
  ShieldCheck,
  Package,
  FolderTree,
  Boxes,
  ShoppingCart,
  BarChart3,
  Bell,
  MapPinned,
  CreditCard,
  Clock3,
  CircleCheckBig,
  RefreshCcw,
  TrendingUp,
  MonitorSmartphone,
  Laptop,
  ClipboardCheck,
} from "lucide-react";

const features = [
  {
    title: "Secure User Login",
    icon: ShieldCheck,
  },
  {
    title: "Product Management",
    icon: Package,
  },
  {
    title: "Category Management",
    icon: FolderTree,
  },
  {
    title: "Stock Tracking",
    icon: Boxes,
  },
  {
    title: "Sales & Orders",
    icon: ShoppingCart,
  },
  {
    title: "Dashboard Analytics",
    icon: BarChart3,
  },
  {
    title: "Low Stock Alerts",
    icon: Bell,
  },
  {
    title: "Multi-Location Support",
    icon: MapPinned,
  },
  {
    title: "Subscription Plans",
    icon: CreditCard,
  },
];

const benefits = [
  {
    title: "Saves Time",
    icon: Clock3,
    color: "#16a34a",
  },
  {
    title: "Reduces Manual Errors",
    icon: CircleCheckBig,
    color: "#16a34a",
  },
  {
    title: "Real-Time Stock Tracking",
    icon: RefreshCcw,
    color: "#16a34a",
  },
  {
    title: "Better Business Decisions",
    icon: TrendingUp,
    color: "#16a34a",
  },
  {
    title: "Easy Inventory Management",
    icon: MonitorSmartphone,
    color: "#16a34a",
  },
];

export default function FeaturesAndBenefits() {
  return (
    <section
      id="features-benefits"
      className="bg-linear-to-b from-white to-[#f7f9fc] py-20"
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#e9f3ff] px-5 py-2 text-xs font-bold uppercase tracking-[3px] text-[#0d5b96]">
            FEATURES & BENEFITS
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-[#0d5b96] sm:text-5xl">
            Everything You Need
            <br />
            To Manage Inventory
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#0d5b96]">
            ExoStock combines powerful inventory management features with
            business-focused benefits to simplify operations, improve
            productivity, and help your business grow.
          </p>
        </div>

        {/* Main Layout */}

        <div className="grid items-stretch gap-6 lg:grid-cols-12">
          {/* Left Panel */}
          <div className="lg:col-span-4">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#0d5b96] bg-white shadow-lg">
              <div className="bg-[#0d5b96] px-5 py-4">
                <h3 className="text-center text-2xl font-bold text-white">
                  Key Features
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={index}
                      className="group flex items-center gap-4 px-5 py-3.5 transition-all duration-300 hover:bg-[#eef6ff]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] transition-all duration-300 group-hover:bg-[#0d5b96]">
                        <Icon
                          size={22}
                          className="text-[#0d5b96] transition-all duration-300 group-hover:text-white"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-[#0d5b96]">
                          {feature.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center Section Starts */}
          <div className="lg:col-span-4">
            <div className="relative flex h-full justify-center">
              <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#0d5b96] bg-white shadow-lg">
                <div className="flex items-center justify-between border-b bg-[#0d5b96] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Laptop size={24} className="text-white" />
                    <h3 className="text-lg font-bold text-[white]">
                      ExoStock Dashboard
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                    <span className="h-3 w-3 rounded-full bg-green-400"></span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#eef6ff] p-3 text-center">
                      <h4 className="text-sm text-[#0d5b96]">Total Products</h4>
                      <p className="mt-2 text-2xl font-bold text-[#0d5b96]">
                        540
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#eefcf4] p-4 text-center">
                      <h4 className="text-sm text-[#0d5b96]">Total Stock</h4>
                      <p className="mt-2 text-3xl font-bold text-green-600">
                        1,250
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#fff7ed] p-4 text-center">
                      <h4 className="text-sm text-[#0d5b96]">Low Stock</h4>
                      <p className="mt-2 text-3xl font-bold text-orange-600">
                        23
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#eef6ff] p-4 text-center">
                      <h4 className="text-sm text-[#0d5b96]">Total Orders</h4>
                      <p className="mt-2 text-3xl font-bold text-[#0d5b96]">
                        320
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-dashed border-[#0d5b96]/20 bg-[#f8fbff] p-8">
                    <div className="flex h-48 items-end justify-around">
                      {[40, 70, 55, 90, 65, 100].map((height, index) => (
                        <div
                          key={index}
                          className="w-8 rounded-t bg-[#0d5b96]"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel Starts */}
          <div className="lg:col-span-4">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#0d5b96] bg-white shadow-lg">
              <div className="bg-[#0d5b96] px-5 py-4">
                <h3 className="text-center text-2xl font-bold text-white">
                  Benefits
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={index}
                      className="group flex items-center gap-4 px-5 py-4 transition-all duration-300 hover:bg-[#f8fffb]"
                    >
                      <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                        style={{ background: `${benefit.color}15` }}
                      >
                        <Icon size={34} style={{ color: benefit.color }} />
                      </div>

                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-[#0d5b96]">
                          {benefit.title}
                        </h4>
                        <p className="mt-1 text-sm leading-5 text-[#0d5b96]">
                          Improve efficiency and streamline your daily inventory
                          operations.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Highlights */}
        <div className="mt-16 rounded-3xl bg-linear-to-r from-[#0d5b96] to-[#1d4ed8] p-8 text-white shadow-2xl">
          <div className="grid gap-6 text-center md:grid-cols-4">
            <div>
              <Package size={42} className="mx-auto mb-3" />
              <h4 className="text-lg font-bold">Product Tracking</h4>
            </div>

            <div>
              <BarChart3 size={42} className="mx-auto mb-3" />
              <h4 className="text-lg font-bold">Live Analytics</h4>
            </div>

            <div>
              <ShieldCheck size={42} className="mx-auto mb-3" />
              <h4 className="text-lg font-bold">Secure Platform</h4>
            </div>

            <div>
              <MonitorSmartphone size={42} className="mx-auto mb-3" />
              <h4 className="text-lg font-bold">Access Anywhere</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
