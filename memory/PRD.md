# Estrada-Glover Gutters — Website Rebuild

## Problem Statement
Rebuild the gutter company marketing site (reference: estrada-glover-site.vercel.app) with a blue & white brand palette and the Estrada-Glover Group logo. Keep all content, sections, copy, and structure identical. Store quote-form submissions in MongoDB AND email them to isaac@estradaglovergroup.com via SendGrid.

## Brand / Design
- Primary navy #0a1f44, accent bright blue #1e6fc2, white bg, light-grey #f5f7fa alt sections.
- Fonts: Outfit (headings) + DM Sans (body). Logo (~140px) in navbar top-left & footer.
- Sticky navbar + announcement bar, floating mobile CTA bar, mobile-responsive.

## Architecture
- Frontend: React (CRA + craco, `@` alias), Tailwind, lucide-react, sonner toasts.
  - `src/pages/LandingPage.jsx` assembles sections; `src/components/*` (Navbar, Hero, QuoteForm, Footer, MobileCTA, Reveal); `src/data/content.js` holds all copy.
- Backend: FastAPI + MongoDB (`db.quote_requests`). `POST /api/quotes` stores submission + background SendGrid email; `GET /api/quotes` lists.
- Email: SendGrid (key + sender in backend/.env). NOTE: sender isaac@estradaglovergroup.com NOT YET VERIFIED in SendGrid → send returns 403, `email_sent=false`, submission still stored. Will activate automatically once sender verification completes.

## Implemented (2026-06-28)
- Full single-page rebuild: hero+stats, why-it-matters (4), services (6), process (4), gallery (8), testimonials (3), quote form, footer.
- Quote API with DB storage + SendGrid notification (background task). Tested: backend 5/5, frontend 100%.

## Contact (static)
Phone (236) 978-1073 · isaac@estradaglovergroup.com · Surrey, Delta, Langley, White Rock, Coquitlam, BC.

## Backlog / Next
- P0: Complete SendGrid sender (domain/single-sender) verification so emails actually deliver.
- P1: Optional admin view for submitted quotes; reCAPTCHA/anti-spam on form.
- P2: SEO meta/OG tags, sitemap, analytics.
