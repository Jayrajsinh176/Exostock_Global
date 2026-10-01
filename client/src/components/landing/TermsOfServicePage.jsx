import {
  FileText,
  Settings,
  UserCheck,
  Users,
  CreditCard,
  ShieldCheck,
  Ban,
  Copyright,
  Database,
  RefreshCcw,
  Server,
  Link,
  PauseCircle,
  XCircle,
  AlertTriangle,
  Scale,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

// Shared with the signup Terms modal
export const termsSections = [
    {
      id: "acceptance-of-terms",
      icon: FileText,
      title: "Acceptance of Terms",
      content: (
        <p>
          These Terms of Service govern access to and use of ExoStock.
          <br />
          <br />
          By creating an account, subscribing to a plan, accessing the
          platform or using ExoStock, the User agrees to these Terms.
          <br />
          <br />
          If you are using ExoStock on behalf of a business or organization,
          you confirm that you are authorized to accept these Terms on its
          behalf.
        </p>
      ),
    },

    {
      id: "description-of-service",
      icon: Settings,
      title: "Description of Service",
      content: (
        <>
          <p>
            ExoStock is a software platform designed to assist businesses
            with functions such as:
          </p>

          <ul>
            <li>Inventory management</li>
            <li>Product management</li>
            <li>Stock tracking</li>
            <li>Sales management</li>
            <li>Purchase management</li>
            <li>Customer and vendor records</li>
            <li>Reports and analytics</li>
            <li>User/staff management</li>
            <li>Business data management</li>
            <li>AI-assisted functionality</li>
            <li>Other features made available from time to time</li>
          </ul>

          <p>Features may differ depending on the subscribed plan.</p>
        </>
      ),
    },

    {
      id: "account-registration",
      icon: UserCheck,
      title: "Account Registration",
      content: (
        <>
          <p>
            Users must provide accurate and current information when creating
            an account.
          </p>

          <p>Users are responsible for:</p>

          <ul>
            <li>Maintaining account information</li>
            <li>Protecting passwords</li>
            <li>Restricting unauthorized access</li>
            <li>Actions performed through their account</li>
            <li>Creating appropriate permissions for staff members</li>
          </ul>

          <p>
            Any suspected unauthorized access should be reported to ExoStock
            promptly.
          </p>
        </>
      ),
    },

    {
      id: "administrator-and-staff-accounts",
      icon: Users,
      title: "Administrator and Staff Accounts",
      content: (
        <>
          <p>
            An account administrator may create or manage authorized users
            where supported.
          </p>

          <p>The Customer is responsible for determining:</p>

          <ul>
            <li>Which employees may access ExoStock</li>
            <li>User permissions</li>
            <li>Role assignments</li>
            <li>Removal of access when a person leaves the organization</li>
          </ul>

          <p>
            Actions performed by authorized staff may be treated as actions
            performed on behalf of the Customer.
          </p>
        </>
      ),
    },

    {
      id: "subscription-plans",
      icon: CreditCard,
      title: "Subscription Plans",
      content: (
        <>
          <p>
            Access may depend on the selected ExoStock subscription plan.
          </p>

          <p>Different plans may contain different limits relating to:</p>

          <ul>
            <li>Number of users</li>
            <li>Products</li>
            <li>Locations</li>
            <li>Reports</li>
            <li>Features</li>
            <li>Storage</li>
            <li>AI functionality</li>
            <li>Support</li>
            <li>Integrations</li>
            <li>Other usage limits</li>
          </ul>

          <p>
            Plan details displayed at the time of purchase will form part of
            the subscription.
          </p>
        </>
      ),
    },

    {
      id: "user-responsibilities",

      icon: ShieldCheck,
      title: "User Responsibilities",
      content: (
        <>
          <p>Users agree to:</p>

          <ul>
            <li>Provide accurate information</li>
            <li>Use ExoStock lawfully</li>
            <li>
              Maintain appropriate backups/export copies where necessary
            </li>
            <li>Review important reports before acting on them</li>
            <li>Protect account credentials</li>
            <li>Maintain appropriate employee access controls</li>
            <li>Ensure uploaded data is legally obtained</li>
          </ul>
        </>
      ),
    },

    {
      id: "prohibited-activities",
      icon: Ban,
      title: "Prohibited Activities",
      content: (
        <>
          <p>Users must not:</p>

          <ul>
            <li>Attempt to hack ExoStock</li>
            <li>Circumvent security controls</li>
            <li>Introduce malware</li>
            <li>Perform unauthorized penetration testing</li>
            <li>
              Reverse engineer protected portions of the service except where
              permitted by law
            </li>
            <li>Copy or resell the platform without authorization</li>
            <li>Use the platform for illegal activities</li>
            <li>
              Access another customer's information without authorization
            </li>
            <li>Intentionally overload or disrupt infrastructure</li>
            <li>Use automated methods to abuse the service</li>
          </ul>
        </>
      ),
    },

    {
      id: "intellectual-property",
      icon: Copyright,
      title: "Intellectual Property",
      content: (
        <>
          <p>ExoStock and associated:</p>

          <ul>
            <li>Source code</li>
            <li>Software</li>
            <li>Interface</li>
            <li>Designs</li>
            <li>Branding</li>
            <li>Logos</li>
            <li>Documentation</li>
            <li>Platform architecture</li>
            <li>Proprietary features</li>
          </ul>

          <p>
            remain the intellectual property of Exotic Infotech or their
            applicable licensors.
          </p>

          <p>
            A subscription gives the Customer a limited, non-exclusive,
            non-transferable right to use ExoStock during the applicable
            subscription period.
          </p>

          <p>
            It does not transfer ownership of the software or source code.
          </p>
        </>
      ),
    },

    {
      id: "customer-data",
      icon: Database,
      title: "Customer Data",
      content: (
        <>
          <p>
            Customers retain ownership of their Customer Data.
          </p>

          <p>
            Customers grant ExoStock permission to process Customer Data only
            to the extent reasonably required to operate and provide the
            service.
          </p>
        </>
      ),
    },

    {
      id: "service-changes",
      icon: RefreshCcw,
      title: "Service Changes",
      content: (
        <>
          <p>ExoStock may:</p>

          <ul>
            <li>Improve features</li>
            <li>Modify the interface</li>
            <li>Update functionality</li>
            <li>Replace technical components</li>
            <li>Add features</li>
            <li>Remove obsolete functionality</li>
          </ul>

          <p>
            We will seek to avoid changes that materially and unexpectedly
            prevent Customers from using core paid functionality during an
            active subscription without reasonable cause.
          </p>
        </>
      ),
    },

    {
      id: "service-availability",
      icon: Server,
      title: "Service Availability",
      content: (
        <>
          <p>
            We aim to provide reliable service but do not guarantee
            uninterrupted or error-free operation unless a separate written
            Service Level Agreement expressly provides otherwise.
          </p>

          <p>Service may become temporarily unavailable because of:</p>

          <ul>
            <li>Scheduled maintenance</li>
            <li>Emergency maintenance</li>
            <li>Internet outages</li>
            <li>Infrastructure failure</li>
            <li>Third-party service failure</li>
            <li>Cybersecurity incidents</li>
            <li>Events beyond reasonable control</li>
          </ul>
        </>
      ),
    },

    {
      id: "third-party-services",
      icon: Link,
      title: "Third-Party Services",
      content: (
        <p>
          Certain ExoStock features may depend on third-party services.
          <br />
          <br />
          Exotic Infotech is not responsible for failures caused solely by
          third-party services outside its reasonable control.
        </p>
      ),
    },

    {
      id: "suspension",
      icon: PauseCircle,
      title: "Suspension",
      content: (
        <>
          <p>
            An account may be temporarily suspended where reasonably necessary
            due to:
          </p>

          <ul>
            <li>Non-payment</li>
            <li>Security concerns</li>
            <li>Suspected fraud</li>
            <li>Illegal activity</li>
            <li>Abuse of infrastructure</li>
            <li>Material violation of these Terms</li>
          </ul>

          <p>
            Where practicable, Users may be given an opportunity to resolve
            the issue.
          </p>
        </>
      ),
    },

    {
      id: "termination",
      icon: XCircle,
      title: "Termination",
      content: (
        <>
          <p>
            A Customer may discontinue ExoStock according to the applicable
            cancellation policy.
          </p>

          <p>
            Exotic Infotech may terminate access for serious or repeated
            violations of these Terms.
          </p>

          <p>
            Data handling after termination will follow the Data Retention
            &amp; Deletion Policy.
          </p>
        </>
      ),
    },

    {
      id: "disclaimer",
      icon: AlertTriangle,
      title: "Disclaimer",
      content: (
        <>
          <p>
            ExoStock is a business-management software tool.
          </p>

          <p>
            Reports, calculations, alerts and analytics depend substantially
            on information entered by Users and system configurations.
          </p>

          <p>
            ExoStock does not independently verify every business transaction
            entered by a User.
          </p>
        </>
      ),
    },

    {
      id: "limitation-of-liability",
      icon: ShieldCheck,
      title: "Limitation of Liability",
      content: (
        <>
          <p>
            To the maximum extent permitted by applicable law, Exotic Infotech
            will not be liable for indirect, incidental, consequential or
            special losses arising from matters such as:
          </p>

          <ul>
            <li>Incorrect Customer Data</li>
            <li>
              Unauthorized use caused by compromised User credentials
            </li>
            <li>Business decisions made from unverified reports</li>
            <li>Third-party outages</li>
            <li>Events beyond reasonable control</li>
          </ul>

          <p>
            Nothing in these Terms limits liability that cannot legally be
            excluded or limited.
          </p>
        </>
      ),
    },

    {
      id: "governing-law",
      icon: Scale,
      title: "Governing Law",
      content: (
        <>
          <p>
            These Terms will be governed by the applicable laws of India.
          </p>

          <p>
            Subject to applicable law and dispute-resolution requirements,
            courts located in{" "}
            <span className="font-medium text-[#083d67]">
              [● City, Gujarat, India]
            </span>{" "}
            will have jurisdiction over disputes arising in connection with
            ExoStock.
          </p>
        </>
      ),
    },
  ];

export default function TermsOfServicePage() {
  const sections = termsSections;

  return (
    <>
      {/* Website Navbar */}
      <Navbar />

      {/* Space for fixed/sticky navbar */}
      <div className="h-16 sm:h-20" aria-hidden="true" />

      <div className="min-h-screen bg-gray-50">
        {/* Terms Hero */}
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
                <FileText className="h-4 w-4 shrink-0" />
                <span>Legal &amp; Terms</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[#9fcbf7] sm:text-3xl md:text-4xl">
                Terms of Service
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#c4dbf5] sm:mt-5 sm:text-base sm:leading-7 md:text-lg lg:mx-0">
                Please review the terms that govern access to and use of
                ExoStock.
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Intro strip */}
            <div className="border-b border-gray-200 bg-gray-50/60 p-5 sm:p-8 lg:p-10">
              <p className="text-sm leading-6 text-gray-500 sm:text-[15px]">
                These Terms of Service govern access to and use of ExoStock.
                By using the platform, Users agree to these Terms.
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
                      {/* Icon + Number */}
                      <div className="flex shrink-0 flex-col items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3fb] text-[#083d67] sm:h-11 sm:w-11">
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </span>
                      </div>

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