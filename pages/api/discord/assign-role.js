/**
 * API Route: /api/discord/assign-role
 * Description: Assigne un rôle Discord à un utilisateur
 * Usage: Appelé par le webhook Stripe ou manuellement pour corriger
 */

import { assignDiscordRole } from '../../../lib/discordBot';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { membershipId, roleType } = req.body;

    if (!membershipId || !roleType) {
      return res.status(400).json({ 
        error: 'membershipId et roleType requis' 
      });
    }

    // Valider le roleType
    const validRoles = ['member', 'mindset_member', 'ea_owner'];
    if (!validRoles.includes(roleType)) {
      return res.status(400).json({ 
        error: `roleType invalide. Doit être: ${validRoles.join(', ')}` 
      });
    }

    // Récupérer le membership
    const { data: membership, error: fetchError } = await supabaseAdmin
      .from('discord_memberships')
      .select('*')
      .eq('id', membershipId)
      .maybeSingle();

    if (fetchError || !membership) {
      return res.status(404).json({ error: 'Membership non trouvé' });
    }

    // Vérifier que le Discord est lié
    if (!membership.discord_user_id) {
      return res.status(400).json({ 
        error: 'Discord non lié à ce membership' 
      });
    }

    // Assigner le rôle
    await assignDiscordRole(membership.discord_user_id, roleType);

    return res.status(200).json({ 
      success: true,
      message: `Rôle ${roleType} assigné à ${membership.discord_username}` 
    });

  } catch (error) {
    console.error('Erreur API assign-role:', error);
    return res.status(500).json({ error: error.message });
  }
}

