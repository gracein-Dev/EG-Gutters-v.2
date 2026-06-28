import * as Icons from "lucide-react";
import { Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import Reveal from "@/components/Reveal";
import { PROBLEMS, SERVICES, PROCESS, GALLERY, TESTIMONIALS } from "@/data/content";

function SectionHead({ eyebrow, heading, intro, dark = false }) {
  return (
    <div className="max-w-2xl">
      <p className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-[#9cc6ee]" : "text-[#1e6fc2]"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl sm:text-4xl font-bold tracking-tight ${dark ? "text-white" : "text-[#0a1f44]"}`}>
        {heading}
      </h2>
      {intro && (
        <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/75" : "text-[#0a1f44]/70"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}

function Icon({ name, ...props }) {
  const C = Icons[name] || Icons.Circle;
  return <C {...props} />;
}

function Problems() {
  return (
    <section id="why" data-testid="problems-section" className="bg-[#f5f7fa] py-20 md:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionHead {...PROBLEMS} /></Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.items.map((it, i) => (
            <Reveal key={i} delay={i * 80} data-testid={`problem-card-${i}`} className="rounded-xl bg-white border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#1e6fc2]/10 text-[#1e6fc2]">
                <Icon name={it.icon} size={24} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#0a1f44]">{it.title}</h3>
              <p className="mt-2 text-[#0a1f44]/70 leading-relaxed">{it.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" data-testid="services-section" className="bg-white py-20 md:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionHead {...SERVICES} /></Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((it, i) => (
            <Reveal key={i} delay={i * 70} data-testid={`service-card-${i}`} className="group rounded-xl bg-[#f5f7fa] border border-gray-200 p-7 hover:shadow-xl hover:-translate-y-1 hover:border-[#1e6fc2]/40 transition-all duration-300">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#0a1f44] text-white group-hover:bg-[#1e6fc2] transition-colors">
                <Icon name={it.icon} size={24} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#0a1f44]">{it.title}</h3>
              <p className="mt-2 text-[#0a1f44]/70 leading-relaxed">{it.text}</p>
              <a href="#quote" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e6fc2] hover:gap-2.5 transition-all">
                Get a quote <ArrowRight size={16} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" data-testid="process-section" className="bg-[#f5f7fa] py-20 md:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionHead {...PROCESS} /></Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.steps.map((s, i) => (
            <Reveal key={i} delay={i * 80} data-testid={`process-step-${i}`} className="relative">
              <div className="text-sm font-semibold uppercase tracking-wider text-[#1e6fc2]">Step {s.num}</div>
              <div className="mt-3 text-5xl font-bold text-[#0a1f44]/10 font-display leading-none">{s.num}</div>
              <h3 className="mt-3 text-xl font-semibold text-[#0a1f44]">{s.title}</h3>
              <p className="mt-2 text-[#0a1f44]/70 leading-relaxed">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="work" data-testid="gallery-section" className="bg-white py-20 md:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionHead {...GALLERY} /></Reveal>
        <div className="mt-12 grid gap-5 grid-cols-2 lg:grid-cols-4">
          {GALLERY.items.map((it, i) => (
            <Reveal key={i} delay={(i % 4) * 60} data-testid={`gallery-item-${i}`} className="group relative overflow-hidden rounded-xl">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={it.img} alt={it.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f44]/85 via-[#0a1f44]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <span className="inline-block rounded-full bg-[#1e6fc2] px-3 py-1 text-[11px] font-semibold text-white">{it.tag}</span>
                <p className="mt-2 text-sm font-semibold text-white">{it.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="reviews" data-testid="testimonials-section" className="bg-[#f5f7fa] py-20 md:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionHead {...TESTIMONIALS} /></Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.items.map((t, i) => (
            <Reveal key={i} delay={i * 90} data-testid={`testimonial-card-${i}`} className="flex flex-col rounded-xl bg-white border border-gray-200 p-7 shadow-sm">
              <div className="flex gap-0.5 text-[#f5b301]">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 flex-1 text-[#0a1f44]/80 leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0a1f44] text-sm font-semibold text-white">{t.initials}</div>
                <div>
                  <div className="font-semibold text-[#0a1f44]">{t.name}</div>
                  <div className="text-sm text-[#0a1f44]/60">{t.location}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <Hero />
        <Problems />
        <Services />
        <Process />
        <Gallery />
        <Testimonials />
        <QuoteForm />
      </main>
      <Footer />
      <MobileCTA />
    </div>
  );
}
