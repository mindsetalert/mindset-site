import Stripe from 'stripe';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const priceMonthly = process.env.STRIPE_PRICE_MONTHLY; // price_XXXX
    const priceYearly = process.env.STRIPE_PRICE_YEARLY;   // price_YYYY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (req.headers['x-forwarded-proto'] ? `${req.headers['x-forwarded-proto']}://${req.headers.host}` : `http://${req.headers.host}`);

    if (!stripeSecretKey) return res.status(500).json({ error: 'Server not configured (STRIPE_SECRET_KEY)' });

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

    const { plan, userId, email } = req.body || {};
    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const priceId = plan === 'monthly' ? priceMonthly : priceYearly;
    if (!priceId) {
      return res.status(500).json({ error: 'Missing Stripe price ID for selected plan' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      // Si l'email est fourni, on le pré-remplit; sinon Stripe le collecte côté Checkout
      ...(email ? { customer_email: email } : {}),
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      success_url: `${siteUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment-cancelled`,
      metadata: {
        plan,
        userId: userId || '',
      },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}


