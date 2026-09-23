/* ============================================
   Vitta Financial Blueprint — verify Razorpay payment
   Vercel serverless function. Verifies the callback
   signature Razorpay's Checkout hands back, per their
   documented HMAC-SHA256 scheme. This step is mandatory:
   without server-side verification, "payment succeeded"
   is just a client-side claim from the browser, trivially
   spoofable via devtools — see src/blueprint/usePaywall.js
   for where this is called from.
   ============================================ */

import crypto from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    res.status(500).json({ error: 'Payments are not configured yet.' });
    return;
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: 'Missing payment details.' });
    return;
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  // Constant-time compare to avoid leaking signature bytes via response timing.
  const expected = Buffer.from(expectedSignature, 'utf8');
  const actual = Buffer.from(String(razorpay_signature), 'utf8');
  const verified = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);

  if (!verified) {
    res.status(400).json({ error: 'Payment verification failed.' });
    return;
  }

  res.status(200).json({ verified: true });
}
