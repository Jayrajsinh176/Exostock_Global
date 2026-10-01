import {
  ShieldCheck,
  LockKeyhole,
  UserRoundCheck,
  Siren,
  DatabaseBackup,
  AlertTriangle,
  Download,
  ShieldAlert,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SecurityBackupPolicyPage() {
  const sections = [
    {
      id: "security-commitment",
      icon: ShieldCheck,
      title: "Security Commitment",
      content: (
        <p>
          Exotic Infotech takes reasonable measures intended to protect
          ExoStock and Customer Data from unauthorized access, loss, misuse or
          alteration.
        </p>
      ),
    },

    {
      id: "security-controls",
      icon: LockKeyhole,
      title: "Security Controls",
      content: (
        <>
          <p>
            Depending on the technical implementation and subscription
            environment, security measures may include:
          </p>

          <ul>
            <li>User authentication</li>
            <li>Password protection</li>
            <li>Role-based access controls</li>
            <li>Restricted administrative access</li>
            <li>Secure communication protocols</li>
            <li>Logging</li>
            <li>Monitoring</li>
            <li>Server protection</li>
            <li>Database access controls</li>
            <li>Backup controls</li>
            <li>Vulnerability remediation</li>
            <li>Software updates</li>
          </ul>
        </>
      ),
    },

    {
      id: "user-responsibilities",
      icon: UserRoundCheck,
      title: "User Responsibilities",
      content: (
        <>
          <p>Security is a shared responsibility.</p>

          <p>Users must:</p>

          <ul>
            <li>Use strong passwords</li>
            <li>Keep credentials confidential</li>
            <li>Avoid sharing accounts unnecessarily</li>
            <li>Disable access for former employees</li>
            <li>Assign appropriate staff permissions</li>
            <li>Keep devices secure</li>
            <li>Report suspicious activity promptly</li>
          </ul>
        </>
      ),
    },

    {
      id: "security-incidents",
      icon: Siren,
      title: "Security Incidents",
      content: (
        <>
          <p>
            If Exotic Infotech becomes aware of a significant security
            incident involving applicable Customer Data, it will investigate
            and take reasonable steps to:
          </p>

          <ul>
            <li>Contain the incident</li>
            <li>Protect affected systems</li>
            <li>Determine the nature of the incident</li>
            <li>Restore normal operation</li>
            <li>Make legally required notifications</li>
          </ul>
        </>
      ),
    },

    {
      id: "backups",
      icon: DatabaseBackup,
      title: "Backups",
      content: (
        <>
          <p>
            ExoStock may maintain system backups for business continuity and
            disaster recovery.
          </p>

          <p>The actual production configuration should specify:</p>

          <div className="my-5 overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
            <div className="divide-y divide-blue-100">
              <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-3">
                <span className="font-semibold text-[#083d67] sm:min-w-[170px]">
                  Backup Frequency:
                </span>
                <span className="text-gray-600">
                  [● e.g. Daily]
                </span>
              </div>

              <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-3">
                <span className="font-semibold text-[#083d67] sm:min-w-[170px]">
                  Backup Retention:
                </span>
                <span className="text-gray-600">
                  [● e.g. 30 days]
                </span>
              </div>

              <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-3">
                <span className="font-semibold text-[#083d67] sm:min-w-[170px]">
                  Backup Location:
                </span>
                <span className="text-gray-600">
                  [● Cloud/region if appropriate]
                </span>
              </div>

              <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-3">
                <span className="font-semibold text-[#083d67] sm:min-w-[170px]">
                  Recovery Method:
                </span>
                <span className="text-gray-600">
                  [●]
                </span>
              </div>
            </div>
          </div>

          <p>
            These values should reflect the actual infrastructure before this
            Policy is published.
          </p>
        </>
      ),
    },

    {
      id: "backup-limitations",
      icon: AlertTriangle,
      title: "Backup Limitations",
      content: (
        <>
          <p>
            Backups are primarily designed for platform-level recovery.
          </p>

          <p>
            Unless expressly included in the Customer&apos;s plan or
            agreement, ExoStock does not guarantee:
          </p>

          <ul>
            <li>Instant recovery</li>
            <li>Recovery of every individual historical record</li>
            <li>Unlimited backup history</li>
            <li>Recovery from errors caused by Customer actions</li>
          </ul>
        </>
      ),
    },

    {
      id: "customer-backups-exports",
      icon: Download,
      title: "Customer Backups and Exports",
      content: (
        <p>
          Customers should maintain independent copies or exports of
          business-critical reports and records where appropriate.
        </p>
      ),
    },

    {
      id: "no-absolute-security-guarantee",
      icon: ShieldAlert,
      title: "No Absolute Security Guarantee",
      content: (
        <>
          <p>
            Although reasonable safeguards are used, no information system
            can guarantee protection against every possible cyberattack,
            software defect or event beyond reasonable control.
          </p>

          <p>
            ExoStock therefore does not represent that its systems are
            completely immune from security incidents.
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
        {/* Security & Backup Hero */}
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
                <ShieldCheck className="h-4 w-4 shrink-0" />

                <span>Security &amp; Data Protection</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[#9fcbf7] sm:text-3xl md:text-4xl">
                Security &amp; Backup Policy
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#c4dbf5] sm:mt-5 sm:text-base sm:leading-7 md:text-lg lg:mx-0">
                Information about the security measures, user
                responsibilities, backup practices and recovery limitations
                applicable to ExoStock.
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
                This Security &amp; Backup Policy describes the reasonable
                security measures and backup practices intended to protect
                ExoStock and Customer Data.
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