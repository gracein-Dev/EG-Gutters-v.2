import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/data/content";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      {/* Top announcement bar */}
      <div
        data-testid="announcement-bar"
        className="bg-[#0a1f44] text-white text-xs sm:text-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
          <span className="opacity-90">{COMPANY.banner}</span>
          <a
            href={COMPANY.phoneHref}
            data-testid="topbar-call-link"
            className="hidden sm:flex items-center gap-1.5 font-medium text-[#7fb4e8] hover:text-white transition-colors"
          >
            <Phone size={14} /> Call {COMPANY.phone} for a free quote
          </a>
        </div>
      </div>

      <header
        data-testid="navbar"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <a
            href="#top"
            data-testid="navbar-logo"
            className="flex items-center gap-3 shrink-0"
          >
            <img
              src={COMPANY.logo}
              alt="Estrada-Glover Group logo"
              className="h-12 sm:h-14 w-auto max-w-[150px] object-contain"
            />
            <span className="sr-only">{COMPANY.name}</span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-link-${l.href.replace("#", "")}`}
                className="text-sm font-medium text-[#0a1f44]/80 hover:text-[#1e6fc2] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href={COMPANY.phoneHref}
              data-testid="navbar-phone"
              className="flex items-center gap-2 text-sm font-semibold text-[#0a1f44] hover:text-[#1e6fc2] transition-colors"
            >
              <Phone size={16} /> {COMPANY.phone}
            </a>
            <a
              href="#quote"
              data-testid="navbar-cta-quote"
              className="inline-flex items-center rounded-full bg-[#1e6fc2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#155b9e] transition-colors"
            >
              Get a Free Quote
            </a>
          </div>

          <button
            data-testid="navbar-mobile-toggle"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 text-[#0a1f44]"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {open && (
          <div
            data-testid="mobile-menu"
            className="lg:hidden border-t border-gray-100 bg-white px-4 sm:px-6 py-4 space-y-1"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="block py-2.5 text-base font-medium text-[#0a1f44] hover:text-[#1e6fc2]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#quote"
              onClick={close}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#1e6fc2] px-5 py-3 text-sm font-semibold text-white"
            >
              Get a Free Quote
            </a>
          </div>
        )}
      </header>
    </>
  );
}
