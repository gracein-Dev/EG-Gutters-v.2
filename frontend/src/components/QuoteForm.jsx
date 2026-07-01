import { useState } from "react";
import { toast } from "sonner";
import { Phone, Mail, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { COMPANY, SERVICE_OPTIONS } from "@/data/content";

const FORMSPREE = "https://formspree.io/f/xaqgpkok";

const EMPTY = {
  full_name: "",
  phone: "",
  email: "",
  address: "",
  service: "",
  message: "",
};

export default function QuoteForm() {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.email || !form.address || !form.service) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.full_name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          service: form.service,
          message: form.message,
        }),
      });
      if (res.ok) {
        setDone(true);
        setForm(EMPTY);
        toast.success("Quote request sent! We'll be in touch shortly.");
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please call us or try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1e6fc2] focus:border-transparent transition";

  return (
    <section
      id="quote"
      data-testid="quote-section"
      className="bg-[#0a1f44] text-white py-20 md:py-24 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#9cc6ee]">
            Get In Touch
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Get your free quote
          </h2>
          <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-lg">
            Tell us a bit about your home and what you need — we'll follow up to
            book a free on-site estimate.
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-4">
              <Phone className="text-[#1e6fc2] shrink-0 mt-1" size={22} />
              <span className="text-white/85">
                Prefer to talk? Call{" "}
                <a href={COMPANY.phoneHref} className="font-semibold text-white underline-offset-2 hover:underline">
                  {COMPANY.phone}
                </a>{" "}
                — we pick up most calls live during business hours.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <Mail className="text-[#1e6fc2] shrink-0 mt-1" size={22} />
              <span className="text-white/85 break-all">
                {COMPANY.email} — for general questions and follow-ups.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <MapPin className="text-[#1e6fc2] shrink-0 mt-1" size={22} />
              <span className="text-white/85">Serving {COMPANY.serviceArea}.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 sm:p-8">
          {done ? (
            <div data-testid="quote-success" className="flex flex-col items-center text-center py-12">
              <CheckCircle2 size={56} className="text-[#1e6fc2]" />
              <h3 className="mt-5 text-2xl font-bold">Request received!</h3>
              <p className="mt-3 text-white/75 max-w-sm">
                Thanks for reaching out. We respond to most requests within 1
                business hour. We'll be in touch to book your free on-site estimate.
              </p>
              <button
                data-testid="quote-reset-button"
                onClick={() => setDone(false)}
                className="mt-7 rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold hover:bg-white hover:text-[#0a1f44] transition-colors"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} data-testid="quote-form" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Full name</label>
                <input data-testid="quote-input-name" className={inputCls} value={form.full_name} onChange={update("full_name")} placeholder="Jane Smith" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Phone number</label>
                  <input data-testid="quote-input-phone" className={inputCls} value={form.phone} onChange={update("phone")} placeholder="(236) 555-0100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Email address</label>
                  <input data-testid="quote-input-email" type="email" className={inputCls} value={form.email} onChange={update("email")} placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Property address</label>
                <input data-testid="quote-input-address" className={inputCls} value={form.address} onChange={update("address")} placeholder="123 Main St, Surrey, BC" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">What do you need?</label>
                <select data-testid="quote-input-service" className={`${inputCls} appearance-none`} value={form.service} onChange={update("service")}>
                  <option value="" className="text-[#0a1f44]">Select a service</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s} className="text-[#0a1f44]">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Anything else we should know?</label>
                <textarea data-testid="quote-input-message" rows={4} className={inputCls} value={form.message} onChange={update("message")} placeholder="Tell us what you're noticing — leaks, sagging, no gutters at all." />
              </div>
              <button
                type="submit"
                data-testid="quote-form-submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1e6fc2] px-6 py-4 text-base font-semibold text-white hover:bg-[#155b9e] transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                {submitting ? "Sending..." : "Request My Free Quote"}
              </button>
              <p className="text-center text-sm text-white/55">
                We respond to most requests within 1 business hour. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
