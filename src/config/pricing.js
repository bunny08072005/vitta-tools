/* ============================================
   Vitta Financial Blueprint — pricing config
   Flip BLUEPRINT_PAYWALL_ENABLED to true once a
   Razorpay account + API keys are set up (see
   src/blueprint/usePaywall.js and /api/*.js).
   Read from both the client (src/) and the
   serverless functions (api/) — keep it free of
   import.meta.env / process.env references.
   ============================================ */

export const BLUEPRINT_PAYWALL_ENABLED = false;

// Amount in whole Rupees. Razorpay's API wants paise (amount * 100) —
// that conversion happens at the call site, not here.
export const BLUEPRINT_PRICE = 99;

export const CURRENCY = 'INR';

export const BLUEPRINT_PRICE_LABEL = `₹${BLUEPRINT_PRICE}`;
