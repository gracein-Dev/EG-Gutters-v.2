import { Phone, ArrowRight } from "lucide-react";
import { COMPANY, HERO } from "@/data/content";

export default function Hero() {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative bg-[#0a1f44] text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000')",
        }}
      />
      <div className="absolute inset-0 bg-[#0a1f44]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f44] via-[#0a1f44]/85 to-[#0a1f44]/60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-3xl">
          <p
            data-testid="hero-eyebrow"
            className="inline-flex items-center gap-2 rounded-full border border-[#1e6fc2]/50 bg-[#1e6fc2]/15 px-4 py-1.5 text-xs sm:text-sm font-medium text-[#9cc6ee]"
          >
            {HERO.eyebrow}
          </p>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            {HERO.heading}
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-white/80 max-w-2xl">
            {HERO.subheading}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <a
              href="#quote"
              data-testid="hero-cta-quote-button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1e6fc2] px-7 py-4 text-base font-semibold text-white hover:bg-[#155b9e] transition-colors"
            >
              Get a Free Quote <ArrowRight size={18} />
            </a>
            <a
              href={COMPANY.phoneHref}
              data-testid="hero-cta-call-button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-base font-semibold text-white hover:bg-white hover:text-[#0a1f44] transition-colors"
            >
              <Phone size={18} /> Call {COMPANY.phone}
            </a>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl border-t border-white/15 pt-8">
            {HERO.stats.map((s, i) => (
              <div key={i} data-testid={`hero-stat-${i}`}>
                <div className="text-3xl sm:text-4xl font-bold text-[#9cc6ee] font-display">
                  {s.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-white/70">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
