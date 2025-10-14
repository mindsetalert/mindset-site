import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

// Helper to verify HMAC token integrity
function verifyToken(rawToken) {
  const secret = process.env.DOWNLOAD_SECRET;
  if (!secret) throw new Error('Missing DOWNLOAD_SECRET');
  const parts = String(rawToken || '').split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, signatureHex] = parts;
  const expected = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(signatureHex, 'hex'), Buffer.from(expected, 'hex'))) return null;
  try {
    const json = Buffer.from(payloadB64, 'base64url').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const token = req.query.token;
    const data = verifyToken(token);
    if (!data) return res.status(400).json({ error: 'Invalid token' });

    const now = Date.now();
    if (!data.expiresAt || now > Number(data.expiresAt)) {
      return res.status(410).json({ error: 'Link expired' });
    }

    if (!supabaseAdmin) return res.status(500).json({ error: 'Server not configured' });

    // Load token row and check quota
    const { data: rows, error } = await supabaseAdmin
      .from('download_tokens')
      .select('*')
      .eq('token', token)
      .limit(1);
    if (error) throw error;
    const row = rows && rows[0];
    if (!row) return res.status(404).json({ error: 'Token not found' });
    if (row.downloads_used >= row.max_downloads) {
      return res.status(429).json({ error: 'Download limit reached' });
    }

    // Update quota atomically (best effort)
    await supabaseAdmin
      .from('download_tokens')
      .update({ downloads_used: row.downloads_used + 1 })
      .eq('id', row.id);

    // Serve file from /public/downloads
    const fileName = row.file_key || 'MindsetTrading_Setup.exe';
    const filePath = path.join(process.cwd(), 'public', 'downloads', fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
}






