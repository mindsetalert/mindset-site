/**
 * API Route: /api/stripe/checkout-discord
 * Description: Crée une session Stripe Checkout pour les abonnements Discord
 * Plans: discord_only (25$/mois) ou discord_mindset (40$/mois)
 */

import Stripe from 'stripe';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const priceDiscordOnly = process.env.STRIPE_PRICE_DISCORD_ONLY; // price_xxx (25$/mois)
    const priceDiscordMindset = process.env.STRIPE_PRICE_DISCORD_MINDSET; // price_yyy (40$/mois)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (req.headers['x-forwarded-proto'] 
        ? `${req.headers['x-forwarded-proto']}://${req.headers.host}` 
        : `http://${req.headers.host}`);

    if (!stripeSecretKey) {
      return res.status(500).json({ error: 'Server not configured (STRIPE_SECRET_KEY)' });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

    const { plan, email } = req.body || {};

    if (!plan || !['discord_only', 'discord_mindset'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan. Must be: discord_only or discord_mindset' });
    }

    const priceId = plan === 'discord_only' ? priceDiscordOnly : priceDiscordMindset;

    if (!priceId) {
      return res.status(500).json({ 
        error: `Missing Stripe price ID for plan: ${plan}. Set STRIPE_PRICE_DISCORD_ONLY or STRIPE_PRICE_DISCORD_MINDSET` 
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      ...(email ? { customer_email: email } : {}),
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      success_url: `${siteUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=discord`,
      cancel_url: `${siteUrl}/discord?cancelled=true`,
      metadata: {
        plan,
        type: 'discord_membership',
      },
      subscription_data: {
        metadata: {
          plan,
          type: 'discord_membership',
        },
      },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (e) {
    console.error('Erreur création Stripe Checkout Discord:', e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}

