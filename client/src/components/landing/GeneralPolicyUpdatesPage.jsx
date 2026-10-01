import { FileClock, RefreshCw, BellRing, BadgeCheck } from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function GeneralPolicyUpdatesPage() {
  const sections = [
    {
      id: "reasons-for-updates",
      icon: RefreshCw,
      title: "Reasons for Updates",
      content: (
        <>
          <p>
            Exotic Infotech may update these policies from time to time due
            to:
          </p>

          <ul>
            <li>Product changes</li>
            <li>New features</li>
            <li>Security improvements</li>
            <li>Legal requirements</li>
            <li>Regulatory requirements</li>
            <li>Changes to third-party services</li>
            <li>Business-process updates</li>
          </ul>
        </>
      ),
    },

    {
      id: "notice-of-changes",
      icon: BellRing,
      title: "Notice of Material Changes",
      content: (
        <p>
          Where changes are material, ExoStock may provide reasonable notice
          through the website, application, email or other appropriate
          method.
        </p>
      ),
    },

    {
      id: "acceptance-of-updates",
      icon: BadgeCheck,
      title: "Acceptance of Updated Policies",
      content: (
        <p>
          Continued use after an updated policy becomes effective may
          constitute acceptance where permitted by applicable law.
        </p>
      ),
    },
  ];

  return (
    <>
      {/* Website Navbar */}
      <Navbar />

      {/* Space for fixed/sticky navbar */}
      <div className="h-16 sm:h-20" aria-hidden="true" />

      <div className="min-h-screen bg-gray-50">
        {/* General Policy Updates Hero */}
        <section className="relative overflow-hidden bg-[#083d67] text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0, transparent 35%), radial-gradient(circle at 85% 75%, rgba(255,255,255,0.18) 0, transparent 40%)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-4xl text-center lg:mx-0 lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#c4dbf5] ring-1 ring-white/20 sm:text-sm">
                <FileClock className="h-4 w-4 shrink-0" />

                <span>Policy Changes</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[#9fcbf7] sm:text-3xl md:text-4xl">
                General Policy Updates
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#c4dbf5] sm:mt-5 sm:text-base sm:leading-7 md:text-lg lg:mx-0">
                Information about when ExoStock policies may be updated, how
                material changes are communicated and how updated policies
                take effect.
              </p>
            </div>
          </div>
        </section>

        {/* Policy Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Intro strip */}
            <div className="border-b border-gray-200 bg-gray-50/60 p-5 sm:p-8 lg:p-10">
              <p className="text-sm leading-6 text-gray-500 sm:text-[15px]">
                This page explains how Exotic Infotech may update the policies
                that apply to ExoStock.
              </p>
            </div>

            {/* Sections */}
            <div className="divide-y divide-gray-100">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 p-5 sm:p-8 lg:p-10"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f3fb] text-[#083d67] sm:h-11 sm:w-11">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </span>

                      {/* Section Content */}
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold leading-7 text-[#083d67] sm:text-xl sm:leading-8 lg:text-2xl">
                          {section.title}
                        </h2>

                        <div className="mt-4 text-sm leading-6 text-gray-600 sm:text-[15px] sm:leading-7">
                          <div
                            className="
                              [&_p]:mb-4
                              [&_p:last-child]:mb-0
                              [&_ul]:mb-4
                              [&_ul]:list-disc
                              [&_ul]:space-y-1.5
                              [&_ul]:pl-5
                              sm:[&_ul]:pl-6
                              [&_li]:pl-1
                            "
                          >
                            {section.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </article>
        </main>
      </div>

      {/* Website Footer */}
      <Footer />
    </>
  );
}
