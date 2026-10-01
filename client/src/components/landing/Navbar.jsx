import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthService } from "../../api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();

  const navItems = [
    { name: "Problems", href: "#problems" },
    { name: "Features", href: "#features" },
    { name: "Plans", href: "#plans" },
    { name: "Why Us", href: "#why" },
    { name: "Contact", href: "#contact" },
  ];

  // Scroll to the section without adding "#section" to the URL
  const scrollToSection = (event, href) => {
    const section = document.querySelector(href);
    if (!section) return;

    event.preventDefault();
    setIsOpen(false);

    const headerHeight = document.querySelector("header")?.offsetHeight || 0;
    const top =
      section.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white bg-white">
      <style>{`
        .snake-arrow {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        a:hover .snake-arrow {
          transform: translateX(4px);
        }
      `}</style>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-20 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center">
          <a href="/" className="flex shrink-0 items-center">
            <img
              src="/logo.png"
              alt="ExoStock"
              className="h-9 w-auto object-contain xs:h-10 sm:h-12 lg:h-14"
            />
          </a>

          <span className="ml-1 mt-1 text-[9px] text-gray-900 sm:ml-2 sm:mt-2.5 sm:text-sm">
            Powered by{" "}
            <a
              href="https://exoticinfotech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0d5b96] hover:underline"
            >
              Exotic Infotech
            </a>
          </span>
        </div>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-10">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(event) => scrollToSection(event, item.href)}
              className="text-m font-semibold text-gray-900 transition-all duration-300 hover:text-[#0d5b96]"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center rounded-xl bg-[#0d5b96] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0d5b96]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d5b96]/80"
            >
              Dashboard
              <span className="ml-2 snake-arrow">➜</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl border border-[#0d5b96] px-5 py-3 text-sm font-semibold text-[#0d5b96] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d5b96]/10"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center rounded-xl bg-[#0d5b96] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0d5b96]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d5b96]/80"
              >
                Register Account
                <span className="ml-2 snake-arrow">➜</span>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 rounded-xl border border-gray-200 p-2 transition lg:hidden"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6" />
          ) : (
            <Menu className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6" />
          )}
        </button>
      </div>

      <div
        className={`overflow-hidden bg-white transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-120 border-t border-gray-200" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-4 py-4 sm:px-5">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(event) => {
                setIsOpen(false);
                scrollToSection(event, item.href);
              }}
              className="border-b border-gray-100 py-3.5 text-base font-medium text-gray-700 transition hover:text-[#0d5b96] sm:py-4"
            >
              {item.name}
            </a>
          ))}

          <div className="mt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-xl bg-[#0d5b96] py-3 text-center text-base font-semibold text-white shadow-lg shadow-[#0d5b96]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d5b96]/80"
              >
                Dashboard
                <span className="ml-2 snake-arrow">➜</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-[#0d5b96] py-3 text-center text-base font-semibold text-[#0d5b96] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d5b96]/10"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-[#0d5b96] py-3 text-center text-base font-semibold text-white shadow-lg shadow-[#0d5b96]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d5b96]/80"
                >
                  Register Account
                  <span className="ml-2 snake-arrow">➜</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
