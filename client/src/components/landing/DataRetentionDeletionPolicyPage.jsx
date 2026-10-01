import {
  FileText,
  Database,
  Clock,
  Archive,
  Trash2,
  UserCheck,
  Download,
  Receipt,
  Users,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function DataRetentionDeletionPolicyPage() {
  const sections = [
    {
      id: "purpose",
      icon: FileText,
      title: "Purpose",
      content: (
        <p>
          This Policy describes how ExoStock handles Customer Data during and
          after use of the service.
        </p>
      ),
    },

    {
      id: "active-accounts",
      icon: Database,
      title: "Active Accounts",
      content: (
        <p>
          While a subscription/account remains active, Customer Data may be
          retained as reasonably necessary to provide the service.
        </p>
      ),
    },

    {
      id: "account-closure",
      icon: Clock,
      title: "Account Closure",
      content: (
        <>
          <p>
            After account cancellation, expiration or termination, ExoStock
            may retain Customer Data for a limited recovery period of up to:
          </p>

          <p className="font-semibold text-[#083d67]">
            [● Recommended operational period: 30–90 days]
          </p>

          <p>during which restoration may be possible.</p>

          <p>
            The exact period should be confirmed by Exotic Infotech based on
            its production infrastructure.
          </p>
        </>
      ),
    },

    {
      id: "backup-copies",
      icon: Archive,
      title: "Backup Copies",
      content: (
        <>
          <p>
            Data deleted from active systems may remain temporarily in secured
            backup copies until the relevant backup lifecycle expires.
          </p>

          <p>Backup retention period:</p>

          <p className="font-semibold text-[#083d67]">
            [● Insert actual backup retention period]
          </p>

          <p>
            Backups are intended for disaster recovery and system protection
            and may not support individual record-level restoration.
          </p>
        </>
      ),
    },

    {
      id: "permanent-deletion",
      icon: Trash2,
      title: "Permanent Deletion",
      content: (
        <>
          <p>
            After applicable retention periods expire, data may be securely
            deleted, overwritten or rendered inaccessible in accordance with
            operational processes, except where retention is required for:
          </p>

          <ul>
            <li>Legal obligations</li>
            <li>Tax records</li>
            <li>Accounting records</li>
            <li>Fraud prevention</li>
            <li>Security investigations</li>
            <li>Dispute resolution</li>
            <li>Enforcement of agreements</li>
          </ul>
        </>
      ),
    },

    {
      id: "user-initiated-deletion",
      icon: UserCheck,
      title: "User-Initiated Deletion",
      content: (
        <>
          <p>
            Authorized account administrators may request account deletion by
            contacting:
          </p>

          <p className="font-semibold text-[#083d67]">
            [● Support/Privacy Email]
          </p>

          <p>
            ExoStock may verify the requesting person's identity and authority
            before processing the request.
          </p>
        </>
      ),
    },

    {
      id: "data-export",
      icon: Download,
      title: "Data Export",
      content: (
        <>
          <p>
            Customers are encouraged to export necessary business records
            before terminating their subscription where export functionality
            is available.
          </p>

          <p>
            After the applicable deletion period expires, recovery may no
            longer be possible.
          </p>
        </>
      ),
    },

    {
      id: "billing-records",
      icon: Receipt,
      title: "Billing Records",
      content: (
        <p>
          Certain transaction, invoice and accounting records may be retained
          for longer periods where required under applicable law.
        </p>
      ),
    },

    {
      id: "deletion-requests-third-parties",
      icon: Users,
      title: "Deletion Requests Involving Third Parties",
      content: (
        <>
          <p>
            Where a Customer stores personal information relating to its own
            customers, employees or vendors, the business Customer is
            generally responsible for determining whether that information
            should be corrected or deleted.
          </p>

          <p>
            ExoStock may assist the Customer where reasonably required.
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
        {/* Data Retention & Deletion Hero */}
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
                <Database className="h-4 w-4 shrink-0" />

                <span>Data &amp; Privacy</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[#9fcbf7] sm:text-3xl md:text-4xl">
                Data Retention &amp; Deletion Policy
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#c4dbf5] sm:mt-5 sm:text-base sm:leading-7 md:text-lg lg:mx-0">
                Information about how ExoStock handles Customer Data during
                and after use of the service.
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
                This Data Retention &amp; Deletion Policy describes how
                ExoStock handles Customer Data during and after use of the
                service.
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