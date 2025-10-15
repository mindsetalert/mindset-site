import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Support both old format (license_key, machine_key) and new format (licenseKey, hardwareId)
  const licenseKey = req.body.licenseKey || req.body.license_key
  const hardwareId = req.body.hardwareId || req.body.machine_key
  const deviceName = req.body.deviceName || req.body.machine_name

  if (!licenseKey) {
    return res.status(400).json({ error: 'License key required' })
  }

  if (!hardwareId) {
    return res.status(400).json({ error: 'Hardware ID required' })
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

    // Vérifier si la licence est expirée
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return res.status(400).json({ error: 'License expired' })
    }

    // Vérifier si la licence est déjà activée sur un autre appareil
    if (license.hardware_id && license.hardware_id !== hardwareId) {
      return res.status(403).json({ 
        error: 'License already activated on another device',
        details: {
          activatedDevice: license.activated_device_name || 'Unknown device',
          activatedAt: license.activated_at,
          lastValidation: license.last_validation_at
        }
      })
    }

    // Activer la licence ou mettre à jour la validation
    const updateData = {
      is_active: true,
      hardware_id: hardwareId,
      activated_device_name: deviceName || 'Unknown device',
      last_validation_at: new Date().toISOString(),
      // Conserver les anciennes colonnes pour compatibilité
      machine_id: hardwareId,
      machine_name: deviceName,
      last_used_at: new Date().toISOString()
    }

    // Si c'est la première activation
    if (!license.activated_at) {
      updateData.activated_at = new Date().toISOString()
      updateData.status = 'active'
    }

    const { error: updateError } = await supabaseAdmin
      .from('licenses')
      .update(updateData)
      .eq('id', license.id)

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update license' })
    }

    // Retourner les infos de la licence
    return res.status(200).json({
      valid: true,
      license: {
        id: license.id,
        clientId: license.client_id,
        status: license.status,
        expiresAt: license.expires_at,
        activatedAt: updateData.activated_at,
        lastUsedAt: updateData.last_used_at
      }
    })

  } catch (error) {
    console.error('License validation error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}





