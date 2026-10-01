import {
  XCircle,
  Ban,
  RotateCcw,
  Wrench,
  ShieldOff,
  WalletCards,
  CalendarX,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function CancellationRefundPolicyPage() {
  const sections = [
    {
      id: "subscription-cancellation",
      icon: XCircle,
      title: "Subscription Cancellation",
      content: (
        <>
          <p>Customers may request cancellation by:</p>

          <ul>
            <li>
              Using the cancellation option available within ExoStock, where
              available, or
            </li>
            <li>
              Contacting{" "}
              <span className="font-medium text-[#083d67]">
                [● Billing/Support Email]
              </span>
              .
            </li>
          </ul>
        </>
      ),
    },

    {
      id: "effect-of-cancellation",
      icon: Ban,
      title: "Effect of Cancellation",
      content: (
        <>
          <p>
            Unless otherwise agreed, cancellation prevents future renewal but
            does not automatically reverse charges already incurred for the
            current subscription period.
          </p>

          <p>
            The Customer may continue to access paid services until the expiry
            of the paid subscription period unless the account is terminated
            for misuse or another serious violation.
          </p>
        </>
      ),
    },

    {
      id: "refunds",
      icon: RotateCcw,
      title: "Refunds",
      content: (
        <>
          <p>
            Subscription charges are generally non-refundable after the paid
            service has been activated, except where:
          </p>

          <ul>
            <li>A duplicate payment occurred</li>
            <li>
              An incorrect amount was charged due to a verified billing error
            </li>
            <li>
              Payment was completed but the purchased subscription was not
              activated
            </li>
            <li>A refund is required under applicable law</li>
          </ul>
        </>
      ),
    },

    {
      id: "service-related-refund-requests",
      icon: Wrench,
      title: "Service-Related Refund Requests",
      content: (
        <>
          <p>
            If a Customer experiences a serious technical issue that
            materially prevents use of the paid service, the Customer should
            first contact support.
          </p>

          <p>
            Exotic Infotech may investigate the issue and, depending on the
            circumstances, may offer:
          </p>

          <ul>
            <li>Technical resolution</li>
            <li>Service extension</li>
            <li>Account credit</li>
            <li>Partial refund</li>
            <li>Full refund</li>
          </ul>

          <p>
            Such remedies will depend on the verified circumstances and
            applicable contractual or legal obligations.
          </p>
        </>
      ),
    },

    {
      id: "non-refundable-circumstances",
      icon: ShieldOff,
      title: "Non-Refundable Circumstances",
      content: (
        <>
          <p>A refund will normally not be available where:</p>

          <ul>
            <li>The User simply changes their mind after using the service</li>
            <li>The User fails to use an active subscription</li>
            <li>The User entered incorrect business information</li>
            <li>The User's internet/device environment causes the issue</li>
            <li>The account was suspended for violation of the Terms</li>
            <li>
              A third-party service outside ExoStock&apos;s reasonable control
              fails temporarily
            </li>
            <li>
              Features clearly disclosed as unavailable in the purchased plan
              are requested later
            </li>
          </ul>
        </>
      ),
    },

    {
      id: "refund-processing",
      icon: WalletCards,
      title: "Refund Processing",
      content: (
        <>
          <p>
            Approved refunds will normally be returned through the original
            payment method where reasonably possible.
          </p>

          <p>Bank/payment-gateway processing time may vary.</p>
        </>
      ),
    },

    {
      id: "cancellation-before-renewal",
      icon: CalendarX,
      title: "Cancellation Before Renewal",
      content: (
        <>
          <p>
            Customers should submit cancellation before the next billing date
            where they do not wish to renew.
          </p>

          <p>
            Cancellation does not automatically entitle a Customer to a refund
            for an already-started billing period.
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
        {/* Cancellation & Refund Hero */}
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
                <RotateCcw className="h-4 w-4 shrink-0" />

                <span>Cancellation &amp; Refunds</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[#9fcbf7] sm:text-3xl md:text-4xl">
                Cancellation &amp; Refund Policy
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#c4dbf5] sm:mt-5 sm:text-base sm:leading-7 md:text-lg lg:mx-0">
                Information about subscription cancellation, refund
                eligibility, refund processing and renewal cancellation for
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
                This Cancellation &amp; Refund Policy explains how
                subscription cancellations and refund requests are handled
                for ExoStock.
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