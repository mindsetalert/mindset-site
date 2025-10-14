import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { licenseKey, machineId, machineName } = req.body

  if (!licenseKey) {
    return res.status(400).json({ error: 'License key required' })
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

    // Vérifier si la licence est déjà active sur une autre machine
    if (license.is_active && license.machine_id !== machineId) {
      return res.status(400).json({ 
        error: 'License already in use on another machine',
        details: {
          currentMachine: license.machine_name,
          lastUsed: license.last_used_at
        }
      })
    }

    // Activer la licence ou mettre à jour l'utilisation
    const updateData = {
      is_active: true,
      last_used_at: new Date().toISOString(),
      machine_id: machineId,
      machine_name: machineName
    }

    // Si c'est la première activation
    if (!license.activated_at) {
      updateData.activated_at = new Date().toISOString()
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




