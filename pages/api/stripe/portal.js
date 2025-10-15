import Stripe from 'stripe';
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ error: 'Server not configured' });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

    // Récupérer l'utilisateur connecté
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Trouver le customer Stripe de cet utilisateur (via email)
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    if (!customers.data || customers.data.length === 0) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    const customerId = customers.data[0].id;

    // Créer une session de portail client
    const returnUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mindset-site.vercel.app';
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${returnUrl}/account`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('Portal error:', e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}

