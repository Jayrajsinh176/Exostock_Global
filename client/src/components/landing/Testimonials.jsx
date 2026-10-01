import React from "react";

const testimonials = [
  {
    rating: 5,
    quote:
      "We switched from spreadsheets to ExoStock in a single afternoon. Our staff was trained the same day, and inventory errors dropped to near zero within a week.",
    initials: "JS",
    name: "James Sullivan",
    role: "Owner, Harbor Hardware Co.",
  },
  {
    rating: 5,
    quote:
      "Managing three locations used to mean juggling spreadsheets and constant phone calls. ExoStock gives me one live view across all stores — real time and reliable.",
    initials: "EM",
    name: "Emma Martinez",
    role: "Operations Manager, FreshFields Market",
  },
  {
    rating: 5,
    quote:
      "Automated invoicing and QuickBooks sync saved us hours every week. Customers get receipts instantly and our accountant gets clean data every month.",
    initials: "AD",
    name: "Aisha Davis",
    role: "Director, Sunrise Distribution LLC",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#0f1724] py-20">
      <div className="mx-auto max-w-7xl px-5 text-center">
        <p className="text-sm font-semibold text-sky-400">WHAT CUSTOMERS SAY</p>

        <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Trusted by businesses
          <br /> across industries.
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-slate-700 bg-[#0b1320] p-8 text-left shadow-lg"
            >
              <div className="mb-4 text-amber-400">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <span key={idx} className="inline-block mr-1">
                    ★
                  </span>
                ))}
              </div>

              <blockquote className="text-slate-300 italic">
                “{t.quote}”
              </blockquote>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  {t.initials}
                </div>

                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
