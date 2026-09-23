/* ============================================
   Vitta Financial Blueprint — paywall hook
   Drives the "Download Complete PDF" button.
   While BLUEPRINT_PAYWALL_ENABLED is false (the
   default — see src/config/pricing.js) this just
   calls onUnlocked immediately, so the tool ships
   fully working, for free, today. Flipping the flag
   on later routes the same button through Razorpay
   Checkout with no other code changes needed.
   ============================================ */

import { useState, useCallback } from 'react';
import { BLUEPRINT_PAYWALL_ENABLED, BLUEPRINT_PRICE } from '../config/pricing';

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load the payment gateway. Check your connection and try again.'));
    document.body.appendChild(script);
  });
}

export function usePaywall({ name, onUnlocked }) {
  const [status, setStatus] = useState('idle'); // idle | processing | error
  const [error, setError] = useState(null);

  const purchase = useCallback(async () => {
    if (!BLUEPRINT_PAYWALL_ENABLED) {
      onUnlocked();
      return;
    }

    setStatus('processing');
    setError(null);
    try {
      await loadRazorpayScript();

      const orderRes = await fetch('/api/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (!orderRes.ok) throw new Error('Could not start payment. Please try again in a moment.');
      const order = await orderRes.json();

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Vitta',
        description: 'Financial Blueprint — Complete PDF Report',
        prefill: { name: name || undefined },
        theme: { color: '#1B6B3A' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            if (!verifyRes.ok) throw new Error('Payment could not be verified. If any amount was deducted, it will be auto-refunded — please contact us.');
            setStatus('idle');
            // Pass the verified payment id through so the PDF can be stamped
            // with it — see pdfReport.js. This id only exists once the
            // server (verify-payment.js) has confirmed the HMAC signature
            // above, so it can't be spoofed by a client that skipped payment.
            onUnlocked({ paymentId: response.razorpay_payment_id });
          } catch (e) {
            setStatus('error');
            setError(e.message);
          }
        },
        modal: { ondismiss: () => setStatus('idle') },
      });
      rzp.on('payment.failed', () => {
        setStatus('error');
        setError('Payment failed. Please try again.');
      });
      rzp.open();
      // Razorpay's own modal takes over the UI from here — release our button's
      // "processing" state so it isn't stuck spinning behind the modal.
      setStatus('idle');
    } catch (e) {
      setStatus('error');
      setError(e.message || 'Something went wrong. Please try again.');
    }
  }, [name, onUnlocked]);

  return { purchase, status, error, price: BLUEPRINT_PRICE, paywallEnabled: BLUEPRINT_PAYWALL_ENABLED };
}
