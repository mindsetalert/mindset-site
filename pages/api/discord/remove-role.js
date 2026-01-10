/**
 * API Route: /api/discord/remove-role
 * Description: Retire un rôle Discord à un utilisateur
 * Usage: Appelé par le webhook Stripe lors d'annulation/échec paiement
 */

import { removeDiscordRole, removeAllMindsetRoles } from '../../../lib/discordBot';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { membershipId, roleType, removeAll } = req.body;

    if (!membershipId) {
      return res.status(400).json({ error: 'membershipId requis' });
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

    // Retirer tous les rôles ou un seul
    if (removeAll) {
      await removeAllMindsetRoles(membership.discord_user_id);
      return res.status(200).json({ 
        success: true,
        message: `Tous les rôles retirés à ${membership.discord_username}` 
      });
    } else {
      if (!roleType) {
        return res.status(400).json({ 
          error: 'roleType requis si removeAll=false' 
        });
      }

      await removeDiscordRole(membership.discord_user_id, roleType);
      return res.status(200).json({ 
        success: true,
        message: `Rôle ${roleType} retiré à ${membership.discord_username}` 
      });
    }

  } catch (error) {
    console.error('Erreur API remove-role:', error);
    return res.status(500).json({ error: error.message });
  }
}

