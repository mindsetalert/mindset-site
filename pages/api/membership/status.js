/**
 * API Route: /api/membership/status
 * Description: Récupère le statut du membership Discord de l'utilisateur connecté
 */

import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Récupérer l'utilisateur depuis le header Authorization (si fourni)
    const authHeader = req.headers.authorization;
    let userEmail = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ error: 'Non authentifié' });
      }
      
      userEmail = user.email;
    }

    // Fallback: essayer de récupérer l'email depuis les cookies (session Supabase)
    if (!userEmail) {
      // Dans Next.js, on peut essayer de parser les cookies
      // Pour simplifier, on retourne une erreur si pas de token Bearer
      return res.status(401).json({ error: 'Token requis' });
    }

    // Récupérer le membership depuis Supabase
    const { data: membership, error: fetchError } = await supabaseAdmin
      .from('discord_memberships')
      .select('*')
      .eq('user_email', userEmail)
      .maybeSingle();

    if (fetchError) {
      console.error('Erreur fetch membership:', fetchError);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (!membership) {
      return res.status(404).json({ 
        error: 'Aucun membership trouvé',
        membership: null 
      });
    }

    // Retourner le membership (sans les infos sensibles)
    return res.status(200).json({
      membership: {
        id: membership.id,
        subscription_status: membership.subscription_status,
        subscription_plan: membership.subscription_plan,
        subscription_started_at: membership.subscription_started_at,
        subscription_ends_at: membership.subscription_ends_at,
        discord_user_id: membership.discord_user_id,
        discord_username: membership.discord_username,
        discord_discriminator: membership.discord_discriminator,
        discord_avatar: membership.discord_avatar,
        discord_linked_at: membership.discord_linked_at,
        has_discord_access: membership.has_discord_access,
        has_mindset_access: membership.has_mindset_access,
        has_ea_addon: membership.has_ea_addon,
      }
    });

  } catch (error) {
    console.error('Erreur API membership/status:', error);
    return res.status(500).json({ error: error.message });
  }
}

