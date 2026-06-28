import { Phone } from "lucide-react";
import { COMPANY } from "@/data/content";

export default function MobileCTA() {
  return (
    <div
      data-testid="mobile-cta-bar"
      className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 z-50 flex gap-3 shadow-[0_-4px_12px_-2px_rgba(10,31,68,0.15)] lg:hidden"
    >
      <a
        href={COMPANY.phoneHref}
        data-testid="mobile-cta-call"
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#0a1f44] px-4 py-3 text-sm font-semibold text-[#0a1f44]"
      >
        <Phone size={16} /> Call
      </a>
      <a
        href="#quote"
        data-testid="mobile-cta-quote"
        className="flex-[1.4] inline-flex items-center justify-center rounded-full bg-[#1e6fc2] px-4 py-3 text-sm font-semibold text-white"
      >
        Get a Free Quote
      </a>
    </div>
  );
}
