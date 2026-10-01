import { useState } from "react";
import {
    ShieldCheck,
    Mail,
    MapPin,
    Phone,
    FileText,
    Database,
    Cpu,
    CreditCard,
    Sparkles,
    Settings,
    Building2,
    Share2,
    Users,
    Lock,
    Clock,
    Globe,
    UserCheck,
    Baby,
    RefreshCcw,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PrivacyPolicyPage() {
    const [activeId, setActiveId] = useState("introduction");

    const sections = [
        {
            id: "introduction",
            icon: FileText,
            title: "Introduction",
            content: (
                <p>
                    Exotic Infotech respects the privacy of users of ExoStock. This
                    Privacy Policy explains what information we may collect, how we use
                    it, how we protect it, when it may be shared, and the choices
                    available to users regarding their information.
                    <br />
                    <br />
                    By accessing or using ExoStock, you acknowledge the practices
                    described in this Privacy Policy.
                </p>
            ),
        },

        {
            id: "information-we-collect",
            icon: Database,
            title: "Information We May Collect",
            content: (
                <>
                    <p>
                        Depending on how ExoStock is used, we may collect the following
                        categories of information:
                    </p>

                    <h3>Account Information</h3>

                    <p>This may include:</p>

                    <ul>
                        <li>Name</li>
                        <li>Business or organization name</li>
                        <li>Email address</li>
                        <li>Mobile number</li>
                        <li>User ID</li>
                        <li>Login credentials</li>
                        <li>Account role</li>
                        <li>Subscription information</li>
                        <li>Billing information</li>
                    </ul>

                    <p>
                        Passwords should be stored using appropriate security measures and
                        are not intended to be available to ExoStock personnel in readable
                        form.
                    </p>

                    <h3>Business and Inventory Data</h3>

                    <p>Users may enter or upload information including:</p>

                    <ul>
                        <li>Products</li>
                        <li>Product categories</li>
                        <li>SKU or serial numbers</li>
                        <li>Opening stock</li>
                        <li>Current inventory</li>
                        <li>Purchase information</li>
                        <li>Sale information</li>
                        <li>Supplier/vendor information</li>
                        <li>Customer information</li>
                        <li>Warehouse information</li>
                        <li>Pricing</li>
                        <li>Taxes</li>
                        <li>Expenses</li>
                        <li>Reports</li>
                        <li>Invoices</li>
                        <li>Business notes</li>
                        <li>Other records entered by the User</li>
                    </ul>

                    <p>
                        The Customer remains responsible for ensuring that it has the
                        right and authority to upload such information to ExoStock.
                    </p>
                </>
            ),
        },

        {
            id: "technical-information",
            icon: Settings,
            title: "Technical Information",
            content: (
                <>
                    <p>
                        We may automatically collect limited technical information such
                        as:
                    </p>

                    <ul>
                        <li>IP address</li>
                        <li>Browser type</li>
                        <li>Device type</li>
                        <li>Operating system</li>
                        <li>Login timestamps</li>
                        <li>Activity logs</li>
                        <li>Error logs</li>
                        <li>Session information</li>
                        <li>Feature usage</li>
                        <li>Security-related events</li>
                    </ul>

                    <p>
                        This information may be used to operate, secure, maintain and
                        improve ExoStock.
                    </p>
                </>
            ),
        },

        {
            id: "payment-information",
            icon: CreditCard,
            title: "Payment Information",
            content: (
                <>
                    <p>
                        Payments may be processed through third-party payment gateways.
                    </p>

                    <p>
                        ExoStock may receive transaction-related information such as:
                    </p>

                    <ul>
                        <li>Transaction ID</li>
                        <li>Payment status</li>
                        <li>Amount</li>
                        <li>Billing reference</li>
                        <li>Subscription plan</li>
                    </ul>

                    <p>
                        We may not directly store complete card, banking or payment
                        credentials where such information is handled by an authorized
                        payment service provider.
                    </p>
                </>
            ),
        },

        {
            id: "ai-assistant-information",
            icon: Sparkles,
            title: "AI Assistant Information",
            content: (
                <>
                    <p>
                        When Users interact with ExoStock&apos;s AI-powered features, the
                        system may process:
                    </p>

                    <ul>
                        <li>User prompts</li>
                        <li>Inventory queries</li>
                        <li>Report-related queries</li>
                        <li>Business information included in the prompt</li>
                        <li>AI responses</li>
                        <li>Technical logs required to provide the feature</li>
                    </ul>

                    <p>
                        Users should avoid submitting unnecessary confidential, sensitive
                        or legally restricted personal information to AI features.
                    </p>

                    <p>
                        Where third-party AI infrastructure or model providers are used,
                        relevant data may be processed by those providers solely as
                        required to provide the applicable functionality, subject to
                        applicable agreements and safeguards.
                    </p>
                </>
            ),
        },

        {
            id: "how-we-use-information",
            icon: Cpu,
            title: "How We Use Information",
            content: (
                <>
                    <p>We may use information to:</p>

                    <ul>
                        <li>Create and manage accounts</li>
                        <li>Authenticate users</li>
                        <li>Provide ExoStock services</li>
                        <li>Manage subscriptions</li>
                        <li>Process payments</li>
                        <li>Generate inventory and business reports</li>
                        <li>Provide AI-powered functionality</li>
                        <li>Send transactional notifications</li>
                        <li>Provide customer support</li>
                        <li>Maintain security</li>
                        <li>Prevent misuse and unauthorized access</li>
                        <li>Investigate technical problems</li>
                        <li>Improve platform functionality</li>
                        <li>Meet legal and regulatory requirements</li>
                        <li>Protect our legal rights</li>
                    </ul>
                </>
            ),
        },

        {
            id: "customer-data-ownership",
            icon: Building2,
            title: "Customer Data Ownership",
            content: (
                <>
                    <p>
                        Business data entered into ExoStock remains the property of the
                        Customer or its respective lawful owner.
                    </p>

                    <p>
                        Using ExoStock does not transfer ownership of a Customer&apos;s
                        inventory, customer, vendor, transaction or business information
                        to Exotic Infotech.
                    </p>

                    <p>
                        Exotic Infotech receives only the limited rights necessary to
                        host, process, back up, transmit and display Customer Data for
                        providing the ExoStock service.
                    </p>
                </>
            ),
        },

        {
            id: "sharing-of-information",
            icon: Share2,
            title: "Sharing of Information",
            content: (
                <>
                    <p>
                        We may share information with third parties only where reasonably
                        necessary, including:
                    </p>

                    <ul>
                        <li>Cloud infrastructure providers</li>
                        <li>Hosting providers</li>
                        <li>Payment gateways</li>
                        <li>Email or communication providers</li>
                        <li>Technical support providers</li>
                        <li>AI service providers</li>
                        <li>Analytics or monitoring providers</li>
                        <li>Professional advisers</li>
                        <li>
                            Government or regulatory authorities where legally required
                        </li>
                    </ul>

                    <p>
                        We do not intend to sell Customer business data as a standalone
                        commercial product.
                    </p>
                </>
            ),
        },

        {
            id: "business-customer-responsibilities",
            icon: Users,
            title: "Business Customer Responsibilities",
            content: (
                <>
                    <p>
                        If a Customer stores information relating to its employees,
                        customers, suppliers or other individuals in ExoStock, the
                        Customer is responsible for:
                    </p>

                    <ul>
                        <li>Having lawful authority to collect that information</li>
                        <li>Providing required privacy notices</li>
                        <li>Obtaining consent where legally required</li>
                        <li>Restricting unauthorized access</li>
                        <li>Maintaining accurate information</li>
                        <li>
                            Responding to requests from relevant individuals where
                            applicable
                        </li>
                    </ul>
                </>
            ),
        },

        {
            id: "security",
            icon: Lock,
            title: "Security",
            content: (
                <>
                    <p>
                        We use reasonable administrative, organizational and technical
                        safeguards intended to protect information against unauthorized
                        access, alteration, misuse, loss or disclosure.
                    </p>

                    <p>
                        However, no internet-based service or electronic storage system
                        can guarantee absolute security.
                    </p>
                </>
            ),
        },

        {
            id: "data-retention",
            icon: Clock,
            title: "Data Retention",
            content: (
                <>
                    <p>Information may be retained:</p>

                    <ul>
                        <li>While an account remains active</li>
                        <li>As necessary to provide services</li>
                        <li>As required for billing and accounting</li>
                        <li>For fraud prevention and security</li>
                        <li>For legal or regulatory obligations</li>
                        <li>For a limited period after account termination</li>
                    </ul>

                    <p>
                        Detailed retention practices are described in the Data Retention
                        &amp; Deletion Policy below.
                    </p>
                </>
            ),
        },

        {
            id: "international-processing",
            icon: Globe,
            title: "International Processing",
            content: (
                <p>
                    Some service providers used by ExoStock may operate infrastructure
                    outside India.
                    <br />
                    <br />
                    Where information is processed internationally, we will seek to
                    handle such processing in accordance with applicable Indian law and
                    applicable restrictions governing cross-border data processing.
                </p>
            ),
        },

        {
            id: "user-rights",
            icon: UserCheck,
            title: "User Rights",
            content: (
                <>
                    <p>Subject to applicable law, users may contact us to request:</p>

                    <ul>
                        <li>Access to applicable personal information</li>
                        <li>Correction of inaccurate information</li>
                        <li>Updating of information</li>
                        <li>Deletion of eligible information</li>
                        <li>
                            Withdrawal of consent where processing depends on consent
                        </li>
                        <li>Information regarding grievance handling</li>
                    </ul>

                    <p>
                        Certain information may need to be retained where required by law,
                        for security, dispute resolution, fraud prevention or legitimate
                        record-keeping requirements.
                    </p>
                </>
            ),
        },

        {
            id: "children",
            icon: Baby,
            title: "Children",
            content: (
                <p>
                    ExoStock is intended primarily for businesses and authorized
                    business users.
                    <br />
                    <br />
                    The service is not intended to be independently used by children
                    below 18 years of age unless appropriate authorization and legal
                    requirements are satisfied.
                </p>
            ),
        },

        {
            id: "changes-to-privacy-policy",
            icon: RefreshCcw,
            title: "Changes to Privacy Policy",
            content: (
                <p>
                    We may update this Privacy Policy from time to time.
                    <br />
                    <br />
                    Material changes may be communicated through the platform, website,
                    registered email address or another reasonable method.
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
                {/* Privacy Policy Hero */}
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
                                <span>Privacy &amp; Security</span>
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-[#9fcbf7] sm:text-3xl md:text-4xl">
                                Privacy Policy
                            </h1>

                            <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#c4dbf5] sm:mt-5 sm:text-base sm:leading-7 md:text-lg lg:mx-0">
                                Learn how Exotic Infotech collects, uses, protects and manages
                                information when you use ExoStock.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Policy Content */}
                <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
                    <div>
                        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            {/* Intro strip */}
                            <div className="border-b border-gray-200 bg-gray-50/60 p-5 sm:p-8 lg:p-10">
                                <p className="text-sm leading-6 text-gray-500 sm:text-[15px]">
                                    This Privacy Policy explains the privacy practices
                                    applicable to ExoStock and its users.
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

                                                    <div
                                                        className="
                                mt-4
                                text-sm
                                leading-6
                                text-gray-600
                                sm:text-[15px]
                                sm:leading-7
                              "
                                                    >
                                                        <div
                                                            className="
                                  [&_p]:mb-4
                                  [&_p:last-child]:mb-0
                                  [&_h3]:mb-3
                                  [&_h3]:mt-6
                                  [&_h3]:text-base
                                  [&_h3]:font-semibold
                                  [&_h3]:text-[#083d67]
                                  sm:[&_h3]:text-lg
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

                                {/* Privacy Contact */}
                                <section
                                    id="privacy-contact"
                                    className="scroll-mt-24 p-5 sm:p-8 lg:p-10"
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f3fb] text-[#083d67] sm:h-11 sm:w-11">
                                            <Mail className="h-5 w-5" strokeWidth={2} />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-lg font-bold leading-7 text-[#083d67] sm:text-xl sm:leading-8 lg:text-2xl">
                                                Privacy Contact
                                            </h2>

                                            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-[15px] sm:leading-7">
                                                For privacy-related questions or requests, reach out
                                                to us using the details below.
                                            </p>

                                            <div className="mt-5 overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
                                                <div className="border-b border-blue-100 bg-white/50 px-4 py-3 sm:px-5">
                                                    <p className="font-semibold text-[#083d67]">
                                                        Exotic Infotech – ExoStock
                                                    </p>
                                                </div>

                                                <div className="space-y-3 p-4 text-sm sm:p-5 sm:text-[15px]">
                                                    <div className="flex items-start gap-3">
                                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#083d67]" />
                                                        <p className="break-words text-gray-700">
                                                            <span className="font-medium text-gray-800">
                                                                Email:
                                                            </span>{" "}
                                                            <a
                                                                href="mailto:info@exoticinfotech.com"
                                                                className="text-[#083d67] hover:underline"
                                                            >
                                                                info@exoticinfotech.com
                                                            </a>
                                                        </p>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#083d67]" />
                                                        <p className="break-words text-gray-700">
                                                            <span className="font-medium text-gray-800">
                                                                Phone:
                                                            </span>{" "}
                                                            <a
                                                                href="tel:+918511624907"
                                                                className="text-[#083d67] hover:underline"
                                                            >
                                                                +91-8511624907
                                                            </a>
                                                        </p>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#083d67]" />
                                                        <p className="break-words text-gray-700">
                                                            <span className="font-medium text-gray-800">
                                                                Address:
                                                            </span>{" "}
                                                            B-315, Alpha Arcades, Near Mipco Chowkdi,
                                                            GIDC, Bharuch, Gujarat 392001
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </article>
                    </div>
                </main>
            </div>

            {/* Website Footer */}
            <Footer />
        </>
    );
}