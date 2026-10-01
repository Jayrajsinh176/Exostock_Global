import {
  FileSpreadsheet,
  AlertTriangle,
  Receipt,
  Smartphone,
  Users,
  BarChart3,
} from "lucide-react";

const problems = [
  {
    icon: FileSpreadsheet,
    title: "Time-Consuming Manual Work",
    desc: "Manual data entry and record-keeping take a lot of time and effort.",
  },
  {
    icon: AlertTriangle,
    title: "Inaccurate Stock Tracking",
    desc: "It is difficult to track real-time stock availability, leading to overstock or stockouts.",
  },
  {
    icon: Receipt,
    title: "High Chance of Errors",
    desc: "Human errors in calculation and record management lead to wrong business decisions.",
  },
  {
    icon: BarChart3,
    title: "Poor Reporting & Insights",
    desc: "Generating reports manually is difficult and does not provide real-time business insights.",
  },
  {
    icon: Users,
    title: "No Centralized Management",
    desc: "Managing multiple locations, users, and inventory manually is unorganized and inefficient.",
  },
  {
    icon: Smartphone,
    title: "Limited Business Accessibility",
    desc: "Without a cloud-based system, managing inventory remotely becomes difficult and inefficient.",
  },
];

export default function ProblemsSection() {
  return (
    <section id="problems" className="bg-[#0f172a] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#0d5b96]/20 px-5 py-2 text-xs font-bold uppercase tracking-[3px] text-[#7cb9ff]">
            Problem Statement
          </span>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-5xl">
            Inventory Management Challenges
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Many businesses still rely on manual methods to manage their
            inventory. This leads to several challenges, inefficiencies, and
            delays in daily operations, affecting productivity and business
            growth.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {problems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group rounded-[28px] border border-slate-500 bg-slate-900/70 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#0d5b96] hover:bg-slate-900 hover:shadow-[0_20px_60px_rgba(13,91,150,.25)]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d5b96]/15 text-[#7cb9ff] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0d5b96] group-hover:text-white">
                  <Icon size={32} />
                </div>

                <h3 className="text-2xl font-bold leading-snug text-white">
                  {item.title}
                </h3>

                <p className="mt-5 text-base leading-8 text-slate-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
