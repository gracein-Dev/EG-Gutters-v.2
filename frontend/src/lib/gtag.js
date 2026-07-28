// Google Ads conversion tracking helpers.
// The base tag (AW-18288308467) is loaded in public/index.html.
//
// IMPORTANT — one-time setup still needed in Google Ads:
// The account-level ID alone (AW-18288308467) is not a trackable "conversion" —
// it just tells Google Ads this site exists. To actually count quote requests
// and call clicks as conversions, you need to create a Conversion Action for
// each one in Google Ads, which gives you a "label" to paste below.
//
// How to get the labels:
//   1. Google Ads → Goals → Conversions → Summary → "+ New conversion action"
//   2. Choose "Website" → enter estradaglovergroup.com (or this site's domain)
//   3. Create one action named e.g. "Quote Form Submit" and another
//      "Phone Call Click" (category: Lead / Submit lead form / Contact)
//   4. On the "Choose how to record conversions" screen, select the manual
//      installation / "Use Google tag" option — Google Ads will show a
//      snippet like:  send_to: 'AW-18288308467/AbCdEfGhIJkLmNoP'
//   5. Copy just the part AFTER the slash into CONVERSION_LABELS below.
const AW_ID = "AW-18288308467";

export const CONVERSION_LABELS = {
  quoteRequest: "", // e.g. "AbCdEfGhIJkLmNoP" — from the "Quote Form Submit" action
  phoneCall: "", // e.g. "QrStUvWxYz123456" — from the "Phone Call Click" action
};

function fireConversion(label, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!label) {
    // Conversion label hasn't been created/pasted in yet — safe no-op.
    console.warn(
      "[Google Ads] Skipped conversion: label not set in src/lib/gtag.js yet.",
    );
    return;
  }
  window.gtag("event", "conversion", {
    send_to: `${AW_ID}/${label}`,
    ...params,
  });
}

/**
 * Call after a successful quote form submission.
 * Passing email/phone enables Enhanced Conversions, which helps Google
 * Ads match the conversion to the original ad click even without cookies.
 */
export function trackQuoteRequest({ email, phone } = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function" && (email || phone)) {
    window.gtag("set", "user_data", {
      email: email || undefined,
      phone_number: phone || undefined,
    });
  }
  fireConversion(CONVERSION_LABELS.quoteRequest);
}

/** Call when a visitor taps a "Call" button/link. */
export function trackPhoneCallClick() {
  fireConversion(CONVERSION_LABELS.phoneCall);
}
