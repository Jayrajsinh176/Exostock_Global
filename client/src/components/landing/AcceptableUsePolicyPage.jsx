import {
  ClipboardCheck,
  Target,
  Scale,
  Ban,
  KeyRound,
  ServerCrash,
  Code,
  Users,
  Eye,
  Gauge,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AcceptableUsePolicyPage() {
  const sections = [
    {
      id: "purpose",
      icon: Target,
      title: "Purpose",
      content: (
        <p>
          This Acceptable Use Policy defines prohibited activities when using
          ExoStock.
        </p>
      ),
    },

    {
      id: "legal-use",
      icon: Scale,
      title: "Legal Use",
      content: (
        <p>Users may use ExoStock only for lawful business purposes.</p>
      ),
    },

    {
      id: "prohibited-content",
      icon: Ban,
      title: "Prohibited Content",
      content: (
        <>
          <p>Users must not knowingly use ExoStock to store or facilitate:</p>

          <ul>
            <li>Illegal content</li>
            <li>Fraudulent records</li>
            <li>Stolen information</li>
            <li>Malicious software</li>
            <li>Content that infringes intellectual property rights</li>
            <li>Information collected unlawfully</li>
            <li>Content prohibited under applicable law</li>
          </ul>
        </>
      ),
    },

    {
      id: "unauthorized-access",
      icon: KeyRound,
      title: "Unauthorized Access",
      content: (
        <>
          <p>Users must not:</p>

          <ul>
            <li>Access another account without permission</li>
            <li>Attempt to obtain passwords</li>
            <li>Bypass authentication</li>
            <li>Exploit software vulnerabilities</li>
            <li>Circumvent account restrictions</li>
            <li>Attempt unauthorized database access</li>
          </ul>
        </>
      ),
    },

    {
      id: "platform-abuse",
      icon: ServerCrash,
      title: "Platform Abuse",
      content: (
        <>
          <p>Users must not intentionally:</p>

          <ul>
            <li>Overload servers</li>
            <li>Run abusive automated requests</li>
            <li>Perform denial-of-service activity</li>
            <li>Introduce malware</li>
            <li>Scrape restricted platform information</li>
            <li>Interfere with normal platform operation</li>
          </ul>
        </>
      ),
    },

    {
      id: "reverse-engineering",
      icon: Code,
      title: "Reverse Engineering",
      content: (
        <p>
          Users must not copy, reverse engineer, reproduce, resell or create
          unauthorized derivative commercial products from protected
          components of ExoStock except to the extent expressly permitted by
          applicable law or written authorization.
        </p>
      ),
    },

    {
      id: "account-sharing",
      icon: Users,
      title: "Account Sharing",
      content: (
        <>
          <p>
            Users should not share credentials with unauthorized individuals.
          </p>

          <p>
            Staff access should be provided through appropriate authorized
            user accounts wherever available.
          </p>
        </>
      ),
    },

    {
      id: "monitoring-enforcement",
      icon: Eye,
      title: "Monitoring and Enforcement",
      content: (
        <>
          <p>
            ExoStock may investigate suspected violations using system and
            security logs where reasonably necessary.
          </p>

          <p>Depending on severity, action may include:</p>

          <ul>
            <li>Warning</li>
            <li>Temporary restriction</li>
            <li>Account suspension</li>
            <li>Account termination</li>
            <li>Reporting unlawful activity where legally required</li>
          </ul>
        </>
      ),
    },

    {
      id: "fair-usage",
      icon: Gauge,
      title: "Fair Usage",
      content: (
        <>
          <p>
            Where subscription plans contain usage limits, Users must operate
            within those limits.
          </p>

          <p>
            Excessive or abnormal automated usage affecting other Customers
            may be restricted.
          </p>
        </>
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
        {/* Acceptable Use Hero */}
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
                <ClipboardCheck className="h-4 w-4 shrink-0" />

                <span>Responsible Platform Use</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[#9fcbf7] sm:text-3xl md:text-4xl">
                Acceptable Use Policy
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#c4dbf5] sm:mt-5 sm:text-base sm:leading-7 md:text-lg lg:mx-0">
                Information about lawful use, prohibited activities,
                enforcement actions and fair usage expectations applicable to
                ExoStock.
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
                This Acceptable Use Policy describes the activities that are
                prohibited when using ExoStock.
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
