import {
  CreditCard,
  CheckCircle,
  CalendarDays,
  Receipt,
  WalletCards,
  RefreshCcw,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
  TrendingUp,
  FileSignature,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SubscriptionBillingPolicyPage() {
  const sections = [
    {
      id: "subscription-plans",
      icon: CreditCard,
      title: "Subscription Plans",
      content: (
        <>
          <p>ExoStock may offer plans such as:</p>

          <ul>
            <li>Trial</li>
            <li>Basic</li>
            <li>Standard</li>
            <li>Business</li>
            <li>Enterprise</li>
            <li>Custom plans</li>
          </ul>

          <p>
            Current pricing, features and limits will be displayed on the
            applicable pricing page, quotation, order form or subscription
            screen.
          </p>
        </>
      ),
    },

    {
      id: "subscription-activation",
      icon: CheckCircle,
      title: "Subscription Activation",
      content: (
        <>
          <p>A paid subscription normally becomes active once:</p>

          <ul>
            <li>Payment is successfully received, or</li>
            <li>
              ExoStock expressly activates the account under an approved
              commercial arrangement.
            </li>
          </ul>
        </>
      ),
    },

    {
      id: "billing-cycle",
      icon: CalendarDays,
      title: "Billing Cycle",
      content: (
        <>
          <p>Subscriptions may be offered on:</p>

          <ul>
            <li>Monthly</li>
            <li>Quarterly</li>
            <li>Annual</li>
            <li>Custom billing cycles</li>
          </ul>

          <p>
            The applicable billing cycle will be disclosed before purchase.
          </p>
        </>
      ),
    },

    {
      id: "taxes",
      icon: Receipt,
      title: "Taxes",
      content: (
        <>
          <p>
            Prices may be exclusive of GST or other applicable taxes unless
            expressly stated otherwise.
          </p>

          <p>
            Applicable taxes will be added to the invoice where legally
            required.
          </p>
        </>
      ),
    },

    {
      id: "payment",
      icon: WalletCards,
      title: "Payment",
      content: (
        <>
          <p>
            Payments must be made through payment methods supported by
            ExoStock.
          </p>

          <p>
            A subscription may remain inactive or be suspended if payment
            fails or remains overdue.
          </p>
        </>
      ),
    },

    {
      id: "renewal",
      icon: RefreshCcw,
      title: "Renewal",
      content: (
        <>
          <p>
            Where automatic renewal is enabled, this will be disclosed to the
            Customer during purchase or through the relevant subscription
            arrangement.
          </p>

          <p>
            If automatic renewal is not enabled, the Customer will need to
            renew the subscription manually.
          </p>
        </>
      ),
    },

    {
      id: "upgrade",
      icon: ArrowUpCircle,
      title: "Upgrade",
      content: (
        <>
          <p>
            Customers may upgrade to a higher subscription plan.
          </p>

          <p>Where applicable, the additional charge may be calculated based on:</p>

          <ul>
            <li>The new plan price</li>
            <li>Remaining subscription period</li>
            <li>Applicable taxes</li>
            <li>Commercial terms communicated to the Customer</li>
          </ul>
        </>
      ),
    },

    {
      id: "downgrade",
      icon: ArrowDownCircle,
      title: "Downgrade",
      content: (
        <>
          <p>
            Downgrades may become effective at the end of the current billing
            cycle unless otherwise agreed.
          </p>

          <p>
            If existing usage exceeds the limits of the lower plan, the
            Customer may need to reduce usage before the downgrade can be
            completed.
          </p>
        </>
      ),
    },

    {
      id: "failed-payments",
      icon: AlertCircle,
      title: "Failed Payments",
      content: (
        <>
          <p>If a payment fails, ExoStock may:</p>

          <ul>
            <li>Notify the Customer</li>
            <li>Retry the payment where authorized</li>
            <li>Provide a payment grace period</li>
            <li>Restrict selected features</li>
            <li>Suspend the subscription</li>
          </ul>
        </>
      ),
    },

    {
      id: "price-changes",
      icon: TrendingUp,
      title: "Price Changes",
      content: (
        <p>
          ExoStock may change subscription pricing in the future.
          <br />
          <br />
          Unless required otherwise, a price change will generally apply from
          a future billing or renewal period rather than retroactively
          changing a subscription already paid for.
        </p>
      ),
    },

    {
      id: "custom-enterprise-agreements",
      icon: FileSignature,
      title: "Custom and Enterprise Agreements",
      content: (
        <>
          <p>
            Enterprise or Custom subscriptions may be governed by a separate:
          </p>

          <ul>
            <li>Quotation</li>
            <li>Order form</li>
            <li>Statement of Work</li>
            <li>Service agreement</li>
            <li>SLA</li>
          </ul>

          <p>
            Where there is a direct conflict, the signed commercial agreement
            will control for that specific Customer.
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
        {/* Subscription & Billing Hero */}
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
                <CreditCard className="h-4 w-4 shrink-0" />

                <span>Plans &amp; Billing</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[#9fcbf7] sm:text-3xl md:text-4xl">
                Subscription &amp; Billing Policy
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#c4dbf5] sm:mt-5 sm:text-base sm:leading-7 md:text-lg lg:mx-0">
                Information about ExoStock subscription plans, billing,
                payments, renewals, upgrades and related commercial terms.
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
                This Subscription &amp; Billing Policy explains how ExoStock
                subscriptions, payments, renewals and plan changes are
                handled.
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