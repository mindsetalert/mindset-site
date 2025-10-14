import Stripe from 'stripe';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { sendDownloadEmail } from '../../../lib/email';

export const config = {
  api: {
    bodyParser: false,
  },
};

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) return res.status(500).send('Server not configured');
  if (!supabaseAdmin) return res.status(500).send('Server auth not configured');

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // subscription mode => session.subscription holds sub ID
        const subscriptionId = session.subscription;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const plan = session.metadata?.plan || 'monthly';

        // Create license row (simple model) and issue download token
        // Resolve client_id from email (create client if needed)
        let clientId = null;
        if (customerEmail) {
          const { data: existingClient, error: clientFetchError } = await supabaseAdmin
            .from('clients')
            .select('id')
            .eq('email', customerEmail)
            .maybeSingle();
          if (clientFetchError) throw clientFetchError;
          if (existingClient?.id) {
            clientId = existingClient.id;
          } else {
            const { data: newClient, error: clientInsertError } = await supabaseAdmin
              .from('clients')
              .insert({ email: customerEmail, created_at: new Date().toISOString() })
              .select('id')
              .single();
            if (clientInsertError) throw clientInsertError;
            clientId = newClient.id;
          }
        }

        const { data: licenseRow, error: licenseError } = await supabaseAdmin
          .from('licenses')
          .insert({
            license_key: `LIC-${Math.random().toString(36).slice(2, 10).toUpperCase()}-${Date.now()}`,
            client_id: clientId,
            status: 'active',
            is_active: true,
            activated_at: new Date().toISOString(),
            expires_at: plan === 'yearly'
              ? new Date(Date.now() + 365*24*60*60*1000).toISOString()
              : new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          })
          .select('*')
          .single();

        if (licenseError) throw licenseError;

        // Generate a download token automatically
        const secret = process.env.DOWNLOAD_SECRET;
        const crypto = await import('crypto');
        if (secret) {
          // 6 mois ≈ 180 jours
          const expiresAt = Date.now() + 180 * 24 * 60 * 60 * 1000;
          const fileKey = 'MindsetTrading_Setup.exe';
          const tokenPayload = { licenseId: licenseRow.id, expiresAt };
          const payloadB64 = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
          const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex');
          const token = `${payloadB64}.${signature}`;

          await supabaseAdmin.from('download_tokens').insert({
            license_id: licenseRow.id,
            token,
            file_key: fileKey,
            expires_at: new Date(expiresAt).toISOString(),
            max_downloads: 999999, // illimité
          });

          // Send email with download link
          try {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mindset-site.vercel.app';
            if (customerEmail) {
              await sendDownloadEmail({ to: customerEmail, token, siteUrl });
            }
          } catch (e) {
            // Ne pas casser le webhook si l'email échoue
            console.error('sendDownloadEmail error:', e?.message || e);
          }
        }
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  } catch (e) {
    res.status(500).send(e.message || 'Server error');
  }
}


