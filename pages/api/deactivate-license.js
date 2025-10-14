import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { licenseKey, machineId } = req.body

  if (!licenseKey || !machineId) {
    return res.status(400).json({ error: 'License key and machine ID required' })
  }

  try {
    // Chercher la licence
    const { data: license, error: licenseError } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single()

    if (licenseError || !license) {
      return res.status(404).json({ error: 'License not found' })
    }

    // Vérifier que c'est bien la même machine
    if (license.machine_id !== machineId) {
      return res.status(400).json({ error: 'Machine ID mismatch' })
    }

    // Désactiver la licence
    const { error: updateError } = await supabaseAdmin
      .from('licenses')
      .update({ 
        is_active: false,
        last_used_at: new Date().toISOString()
      })
      .eq('id', license.id)

    if (updateError) {
      return res.status(500).json({ error: 'Failed to deactivate license' })
    }

    return res.status(200).json({ success: true })

  } catch (error) {
    console.error('License deactivation error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}




