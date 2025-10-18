import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { sendDownloadEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Protection admin
  const adminSecret = req.headers['x-admin-secret'];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { licenseKey } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ error: 'License key required' });
  }

  try {
    // Trouver la licence
    const { data: license, error: licenseError } = await supabaseAdmin
      .from('licenses')
      .select('*, clients(email)')
      .eq('license_key', licenseKey)
      .single();

    if (licenseError || !license) {
      return res.status(404).json({ error: 'License not found' });
    }

    const customerEmail = license.clients?.email;
    if (!customerEmail) {
      return res.status(400).json({ error: 'No email found for this license' });
    }

    // Créer ou trouver un token de téléchargement
    let token = null;
    const { data: existingToken } = await supabaseAdmin
      .from('download_tokens')
      .select('token')
      .eq('license_id', license.id)
      .maybeSingle();

    if (existingToken) {
      token = existingToken.token;
    } else {
      // Créer un nouveau token
      const secret = process.env.DOWNLOAD_SECRET;
      if (!secret) {
        return res.status(500).json({ error: 'DOWNLOAD_SECRET not configured' });
      }

      const crypto = await import('crypto');
      const expiresAt = Date.now() + 180 * 24 * 60 * 60 * 1000; // 6 mois
      const fileKey = 'MindsetTrading_Setup.exe';
      const tokenPayload = { licenseId: license.id, expiresAt };
      const payloadB64 = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
      const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex');
      token = `${payloadB64}.${signature}`;

      await supabaseAdmin.from('download_tokens').insert({
        license_id: license.id,
        token,
        file_key: fileKey,
        expires_at: new Date(expiresAt).toISOString(),
        max_downloads: 999999,
      });
    }

    // Envoyer l'email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mindset-site.vercel.app';
    
    await sendDownloadEmail({
      to: customerEmail,
      token,
      siteUrl,
      licenseKey: license.license_key,
      invoiceUrl: null // On pourrait ajouter l'URL de facture Stripe si nécessaire
    });

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      sentTo: customerEmail,
      licenseKey: license.license_key
    });

  } catch (error) {
    console.error('Resend email error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}

