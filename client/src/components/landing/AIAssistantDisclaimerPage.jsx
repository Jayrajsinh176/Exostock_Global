import {
  Bot,
  Sparkles,
  AlertTriangle,
  Briefcase,
  Package,
  Database,
  ShieldAlert,
  Share2,
  UserCheck,
  WifiOff,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AIAssistantDisclaimerPage() {
  const sections = [
    {
      id: "nature-of-ai-features",
      icon: Sparkles,
      title: "Nature of AI Features",
      content: (
        <>
          <p>
            ExoStock may provide AI-powered functionality designed to assist
            users with tasks such as:
          </p>

          <ul>
            <li>Understanding inventory information</li>
            <li>Summarizing records</li>
            <li>Answering business-data questions</li>
            <li>Highlighting patterns</li>
            <li>Assisting with reports</li>
            <li>Providing operational suggestions</li>
            <li>Explaining available information</li>
          </ul>

          <p>
            AI features are intended to assist Users rather than replace
            professional or human judgment.
          </p>
        </>
      ),
    },

    {
      id: "ai-may-be-incorrect",
      icon: AlertTriangle,
      title: "AI May Be Incorrect",
      content: (
        <>
          <p>Artificial intelligence systems can produce:</p>

          <ul>
            <li>Incorrect answers</li>
            <li>Incomplete answers</li>
            <li>Outdated information</li>
            <li>Misinterpreted data</li>
            <li>Unexpected outputs</li>
          </ul>

          <p>
            Users should independently verify important information before
            making business decisions.
          </p>
        </>
      ),
    },

    {
      id: "no-professional-advice",
      icon: Briefcase,
      title: "No Professional Advice",
      content: (
        <>
          <p>
            AI-generated content provided through ExoStock does not
            constitute:
          </p>

          <ul>
            <li>Legal advice</li>
            <li>Tax advice</li>
            <li>Accounting advice</li>
            <li>Investment advice</li>
            <li>Financial advice</li>
            <li>Regulatory advice</li>
            <li>Professional consultancy</li>
          </ul>

          <p>
            Users should obtain appropriate professional advice where
            necessary.
          </p>
        </>
      ),
    },

    {
      id: "inventory-business-decisions",
      icon: Package,
      title: "Inventory and Business Decisions",
      content: (
        <>
          <p>
            AI responses should not be treated as the sole basis for decisions
            involving:
          </p>

          <ul>
            <li>Purchasing</li>
            <li>Stock replenishment</li>
            <li>Pricing</li>
            <li>Sales forecasting</li>
            <li>Supplier decisions</li>
            <li>Financial commitments</li>
            <li>Tax filings</li>
            <li>Hiring</li>
            <li>Legal compliance</li>
          </ul>

          <p>Final decisions remain the responsibility of the Customer.</p>
        </>
      ),
    },

    {
      id: "data-dependency",
      icon: Database,
      title: "Data Dependency",
      content: (
        <>
          <p>
            AI responses may depend on information contained in the
            Customer&apos;s ExoStock account.
          </p>

          <p>
            Incorrect, incomplete or outdated business records may result in
            incorrect AI responses.
          </p>
        </>
      ),
    },

    {
      id: "sensitive-information",
      icon: ShieldAlert,
      title: "Sensitive Information",
      content: (
        <>
          <p>Users should avoid providing unnecessary:</p>

          <ul>
            <li>Passwords</li>
            <li>Payment credentials</li>
            <li>Government identification information</li>
            <li>Highly confidential information</li>
            <li>Sensitive personal information</li>
          </ul>

          <p>through open-text AI prompts.</p>
        </>
      ),
    },

    {
      id: "third-party-ai-providers",
      icon: Share2,
      title: "Third-Party AI Providers",
      content: (
        <>
          <p>
            Some AI capabilities may rely on third-party technology providers.
          </p>

          <p>
            Where such providers are used, relevant information may be
            transmitted to them to process the User&apos;s request in
            accordance with applicable agreements and privacy practices.
          </p>
        </>
      ),
    },

    {
      id: "human-verification",
      icon: UserCheck,
      title: "Human Verification",
      content: (
        <p>
          Important AI-generated outputs should be reviewed by an authorized
          person before action is taken.
        </p>
      ),
    },

    {
      id: "availability",
      icon: WifiOff,
      title: "Availability",
      content: (
        <>
          <p>
            AI functionality may occasionally be unavailable or limited
            because of:
          </p>

          <ul>
            <li>Third-party provider outages</li>
            <li>API limits</li>
            <li>Maintenance</li>
            <li>Technical problems</li>
            <li>Subscription limits</li>
            <li>Security restrictions</li>
          </ul>
        </>
      ),
    },

    {
      id: "changes-to-ai-features",
      icon: RefreshCw,
      title: "Changes to AI Features",
      content: (
        <>
          <p>
            ExoStock may update, replace, limit or improve AI models and
            functionality as technology develops.
          </p>

          <p>Outputs may therefore vary over time.</p>
        </>
      ),
    },

    {
      id: "acceptance",
      icon: BadgeCheck,
      title: "Acceptance",
      content: (
        <>
          <p>
            By using AI functionality within ExoStock, the User acknowledges
            that:
          </p>

          <ul>
            <li>AI-generated information may contain errors.</li>
            <li>AI is an assistance tool.</li>
            <li>Important information should be independently verified.</li>
            <li>
              The User remains responsible for business decisions taken based
              on AI-generated output.
            </li>
          </ul>
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
        {/* AI Assistant Disclaimer Hero */}
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
                <Bot className="h-4 w-4 shrink-0" />

                <span>AI-Powered Assistance</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[#9fcbf7] sm:text-3xl md:text-4xl">
                AI Assistant Disclaimer
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#c4dbf5] sm:mt-5 sm:text-base sm:leading-7 md:text-lg lg:mx-0">
                Information about the nature, limitations, data use and
                responsible use of AI features available in ExoStock.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Intro strip */}
            <div className="border-b border-gray-200 bg-gray-50/60 p-5 sm:p-8 lg:p-10">
              <p className="text-sm leading-6 text-gray-500 sm:text-[15px]">
                This AI Assistant Disclaimer explains how AI-powered
                functionality in ExoStock should be understood and used.
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
