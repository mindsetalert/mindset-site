import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Protection : nécessite un secret admin
  const adminSecret = req.headers['x-admin-secret'];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { licenseKey } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ error: 'License key required' });
  }

  try {
    // Récupérer la licence
    const { data: license, error: fetchError } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (fetchError || !license) {
      return res.status(404).json({ error: 'License not found' });
    }

    // Calculer la nouvelle date d'expiration basée sur la date de création
    const plan = license.plan || 'monthly';
    const daysToAdd = plan === 'yearly' ? 365 : 30;
    
    // Utiliser activated_at ou created_at comme point de départ
    const startDate = license.activated_at || license.created_at;
    if (!startDate) {
      return res.status(400).json({ error: 'Cannot determine license start date' });
    }

    const newExpirationDate = new Date(new Date(startDate).getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    // Mettre à jour la licence
    const { error: updateError } = await supabaseAdmin
      .from('licenses')
      .update({
        expires_at: newExpirationDate.toISOString(),
        status: 'active',
        is_active: true
      })
      .eq('id', license.id);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update license' });
    }

    return res.status(200).json({
      success: true,
      message: 'License expiration updated',
      license: {
        license_key: license.license_key,
        plan: plan,
        old_expiration: license.expires_at,
        new_expiration: newExpirationDate.toISOString(),
        days_added: daysToAdd
      }
    });

  } catch (error) {
    console.error('Fix license error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

