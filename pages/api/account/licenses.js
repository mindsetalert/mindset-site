import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnon) return res.status(500).json({ error: 'Server not configured' });

    // Verify user from token
    const supabaseUserClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await supabaseUserClient.auth.getUser();
    if (userErr || !userData?.user?.email) return res.status(401).json({ error: 'Invalid token' });
    const email = userData.user.email;

    if (!supabaseAdmin) return res.status(500).json({ error: 'Server auth not configured' });

    // Fetch licenses for this email
    // Resolve client by email
    const { data: clientRow, error: clientErr } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (clientErr) throw clientErr;

    const clientId = clientRow?.id || null;
    if (!clientId) {
      return res.status(200).json({ licenses: [] });
    }

    const { data: licenses, error: licErr } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('client_id', clientId)
      .order('activated_at', { ascending: false });
    if (licErr) throw licErr;

    if (!licenses || licenses.length === 0) {
      return res.status(200).json({ licenses: [] });
    }

    const licenseIds = licenses.map(l => l.id);
    const nowIso = new Date().toISOString();
    const { data: tokens, error: tokErr } = await supabaseAdmin
      .from('download_tokens')
      .select('*')
      .in('license_id', licenseIds)
      .gt('expires_at', nowIso)
      .order('created_at', { ascending: false });
    if (tokErr) throw tokErr;

    // Pick latest valid token per license with quota remaining
    const licenseIdToToken = {};
    for (const t of (tokens || [])) {
      if (t.downloads_used < (t.max_downloads || 3)) {
        if (!licenseIdToToken[t.license_id]) licenseIdToToken[t.license_id] = t;
      }
    }

    const result = licenses.map(l => ({
      license: l,
      token: licenseIdToToken[l.id] || null,
    }));

    return res.status(200).json({ licenses: result });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}


