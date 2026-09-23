/* ============================================
   Vitta Financial Blueprint — create Razorpay order
   Vercel serverless function. Only reachable once
   BLUEPRINT_PAYWALL_ENABLED is flipped on in
   src/config/pricing.js and RAZORPAY_KEY_ID /
   RAZORPAY_KEY_SECRET are set as environment
   variables in the Vercel project. Calls Razorpay's
   REST API directly via fetch — no SDK dependency
   needed for something this small. Env vars are read
   inside the handler (never at module load time) so
   a missing/unset key can never crash a cold start or
   the build — it just returns a clean error.
   ============================================ */

import { BLUEPRINT_PRICE, CURRENCY } from '../src/config/pricing.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    res.status(500).json({ error: 'Payments are not configured yet.' });
    return;
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const amountPaise = Math.round(BLUEPRINT_PRICE * 100);

    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountPaise,
        currency: CURRENCY,
        receipt: `blueprint_${Date.now()}`,
        notes: { product: 'Vitta Financial Blueprint PDF' },
      }),
    });

    if (!orderRes.ok) {
      const errBody = await orderRes.text();
      console.error('Razorpay order creation failed:', errBody);
      res.status(502).json({ error: 'Could not create payment order.' });
      return;
    }

    const order = await orderRes.json();
    res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
  } catch (err) {
    console.error('create-order error:', err);
    res.status(500).json({ error: 'Something went wrong creating the order.' });
  }
}
