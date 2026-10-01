import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/subscription-billing-policy", label: "Subscription and Billing" },
  { href: "/cancellation-refund-policy", label: "Cancellation and Refund" },
  { href: "/data-retention-deletion-policy", label: "Data Retention and Deletion" },
  { href: "/security-backup-policy", label: "Security and Backup" },
  { href: "/acceptable-use-policy", label: "Acceptable Use" },
  { href: "/ai-assistant-disclaimer", label: "AI Assistant Disclaimer" },
  { href: "/general-policy-updates", label: "General Policy Updates" },
];

export default function Footer() {
  return (
    <footer className="bg-[#083d67] text-white">
      {/* Main Footer */}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1fr_1.4fr_1fr]">
          {/* Company */}

          <div>
            <div className="inline-flex items-center rounded-xl bg-white px-4 py-2 shadow-md">
              <img
                src="/logo.png"
                alt="ExoStock"
                className="h-10 w-auto object-contain sm:h-12"
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-[#c4dbf5]">
              Smart Inventory Management Software built for Indian businesses.
              Manage inventory, GST billing, customers, suppliers and reports
              from one powerful dashboard.
            </p>

            <div className="mt-6 flex gap-4">
              <a
                href="https://www.facebook.com/share/1QWiANxMDX/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-3 transition hover:bg-[#0d5b96]"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://www.instagram.com/exotic__infotech"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-3 transition hover:bg-[#0d5b96]"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.linkedin.com/company/exotic-infotech/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-3 transition hover:bg-[#0d5b96]"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Legal */}

          <div>
            <h3 className="text-xl font-bold">Legal Policy</h3>

            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-[#c4dbf5] transition hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}

          <div className="lg:justify-self-end">
            <h3 className="text-xl font-bold">Contact</h3>

            <div className="mt-6 space-y-5 text-[#c4dbf5]">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-[#8fd0ff]" />

                <p className="text-[#c4dbf5]">
                  Bharuch,
                  <br />
                  B-315, Alpha Arcades, Near Mipco Chowkdi,
                  <br />
                  GIDC, Gujarat 392001
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#8fd0ff]" />

                <a className="text-[#c4dbf5]" href="tel:+919999999999">
                  +91-8511624907
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#8fd0ff]" />

                <a
                  className="text-[#c4dbf5]"
                  href="mailto:info@exoticinfotech.com"
                >
                  info@exoticinfotech.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-6 text-center text-sm text-[#c4dbf5] sm:px-6 lg:flex-row lg:px-8">
          <p className="text-[#c4dbf5]">
            © {new Date().getFullYear()} ExoStock by{" "}
            <a
              href="https://exoticinfotech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-lg text-[#acc8dc] hover:underline"
            >
              Exotic Infotech
            </a>
            . All Rights Reserved.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-2 rounded-full bg-[#0d5b96] px-5 py-2 transition hover:bg-[#1a6cab]"
          >
            Back to Top
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
