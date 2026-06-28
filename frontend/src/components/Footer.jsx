import { Phone, Mail, MapPin } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/data/content";

export default function Footer() {
  return (
    <footer
      data-testid="footer"
      className="bg-[#0a1f44] text-white pt-16 pb-28 lg:pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <img
              src={COMPANY.logo}
              alt="Estrada-Glover Group logo"
              className="w-[150px] h-auto object-contain bg-white rounded-md p-2"
            />
            <p className="mt-5 text-base font-semibold font-display">
              {COMPANY.name}
            </p>
            <p className="mt-3 max-w-md text-white/70 leading-relaxed">
              Seamless aluminum gutters, leaf guards, and repairs across the
              Lower Mainland. Free on-site quotes, most installs done in a day.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#9cc6ee]">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-white/75 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#9cc6ee]">
              Get In Touch
            </h4>
            <ul className="mt-4 space-y-3.5">
              <li>
                <a
                  href={COMPANY.phoneHref}
                  data-testid="footer-phone"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <Phone size={18} className="text-[#1e6fc2]" /> {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  data-testid="footer-email"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors break-all"
                >
                  <Mail size={18} className="text-[#1e6fc2] shrink-0" />
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <MapPin size={18} className="text-[#1e6fc2] shrink-0 mt-0.5" />
                <span>{COMPANY.serviceArea}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <p>Serving Surrey & the Lower Mainland, BC.</p>
        </div>
      </div>
    </footer>
  );
}
