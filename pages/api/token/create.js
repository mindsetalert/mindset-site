import crypto from 'crypto';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { payload } = req.body || {};
    if (!payload || !payload.licenseId) return res.status(400).json({ error: 'Missing payload.licenseId' });
    const secret = process.env.DOWNLOAD_SECRET;
    if (!secret) return res.status(500).json({ error: 'Server not configured' });
    if (!supabaseAdmin) return res.status(500).json({ error: 'Server auth not configured' });

    // 6 mois ≈ 180 jours
    const expiresAt = payload.expiresAt || (Date.now() + 180 * 24 * 60 * 60 * 1000);
    const fileKey = 'MindsetTrading_Setup.exe';
    const tokenPayload = { licenseId: payload.licenseId, expiresAt };
    const payloadB64 = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex');
    const token = `${payloadB64}.${signature}`;

    const { error } = await supabaseAdmin.from('download_tokens').insert({
      license_id: payload.licenseId,
      token,
      file_key: fileKey,
      expires_at: new Date(expiresAt).toISOString(),
      max_downloads: 999999, // illimité
    });
    if (error) throw error;
    res.status(200).json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
}






