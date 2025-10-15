import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Support both old format (license_key, machine_key) and new format (licenseKey, hardwareId)
  const licenseKey = req.body.licenseKey || req.body.license_key
  const hardwareId = req.body.hardwareId || req.body.machine_key

  if (!licenseKey || !hardwareId) {
    return res.status(400).json({ error: 'License key and hardware ID required' })
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

    // Vérifier que c'est bien le même appareil (sécurité)
    if (license.hardware_id && license.hardware_id !== hardwareId) {
      return res.status(403).json({ error: 'Cannot deactivate from different device' })
    }

    // Désactiver la licence et effacer le hardware_id
    const { error: updateError } = await supabaseAdmin
      .from('licenses')
      .update({ 
        is_active: false,
        hardware_id: null,
        activated_device_name: null,
        last_validation_at: new Date().toISOString(),
        // Compatibilité anciennes colonnes
        machine_id: null,
        machine_name: null,
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





