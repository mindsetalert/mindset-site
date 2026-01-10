/**
 * API Route: /api/discord/callback
 * Description: Callback OAuth2 Discord
 * Échange le code d'autorisation contre un access token
 * Récupère les infos Discord de l'utilisateur
 * Lie le compte Discord au membership dans Supabase
 * Assigne le rôle Discord approprié
 */

import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { assignDiscordRole } from '../../../lib/discordBot';

export default async function handler(req, res) {
  try {
    const { code, error: oauthError } = req.query;

    if (oauthError) {
      return res.redirect(`/member-portal?error=${encodeURIComponent('Autorisation Discord refusée')}`);
    }

    if (!code) {
      return res.redirect(`/member-portal?error=${encodeURIComponent('Code d\'autorisation manquant')}`);
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.redirect(`/member-portal?error=${encodeURIComponent('Configuration Discord incomplète')}`);
    }

    // Échanger le code contre un access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Erreur échange token Discord:', errorData);
      return res.redirect(`/member-portal?error=${encodeURIComponent('Échec authentification Discord')}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Récupérer les infos de l'utilisateur Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Erreur récupération user Discord');
      return res.redirect(`/member-portal?error=${encodeURIComponent('Erreur récupération profil Discord')}`);
    }

    const discordUser = await userResponse.json();
    const discordUserId = discordUser.id;
    const discordUsername = discordUser.username;
    const discordDiscriminator = discordUser.discriminator;
    const discordAvatar = discordUser.avatar;
    const discordEmail = discordUser.email;

    console.log(`✅ Discord user récupéré: ${discordUsername}#${discordDiscriminator} (${discordUserId})`);

    // TODO: Récupérer l'utilisateur connecté (session Supabase)
    // Pour l'instant, on utilise l'email Discord pour trouver le membership
    // Dans la version finale, il faudra vérifier la session Supabase auth

    // Trouver le membership par email Discord
    const { data: membership, error: fetchError } = await supabaseAdmin
      .from('discord_memberships')
      .select('*')
      .eq('user_email', discordEmail)
      .maybeSingle();

    if (fetchError) {
      console.error('Erreur fetch membership:', fetchError);
      return res.redirect(`/member-portal?error=${encodeURIComponent('Erreur base de données')}`);
    }

    if (!membership) {
      return res.redirect(`/member-portal?error=${encodeURIComponent('Aucun abonnement Discord trouvé pour cet email')}`);
    }

    // Vérifier que l'abonnement est actif
    if (membership.subscription_status !== 'active') {
      return res.redirect(`/member-portal?error=${encodeURIComponent('Abonnement inactif')}`);
    }

    // Mettre à jour le membership avec les infos Discord
    const { error: updateError } = await supabaseAdmin
      .from('discord_memberships')
      .update({
        discord_user_id: discordUserId,
        discord_username: discordUsername,
        discord_discriminator: discordDiscriminator,
        discord_avatar: discordAvatar,
        discord_linked_at: new Date().toISOString(),
      })
      .eq('id', membership.id);

    if (updateError) {
      console.error('Erreur update membership:', updateError);
      return res.redirect(`/member-portal?error=${encodeURIComponent('Erreur liaison compte Discord')}`);
    }

    console.log(`✅ Membership ${membership.id} lié au Discord ${discordUserId}`);

    // Assigner le rôle Discord approprié selon le plan
    try {
      const roleType = membership.subscription_plan === 'discord_mindset' 
        ? 'mindset_member' 
        : 'member';

      await assignDiscordRole(discordUserId, roleType);
      console.log(`✅ Rôle ${roleType} assigné à ${discordUserId}`);

      // Si le membre a l'add-on EA, assigner aussi ce rôle
      if (membership.has_ea_addon) {
        await assignDiscordRole(discordUserId, 'ea_owner');
        console.log(`✅ Rôle EA Owner assigné à ${discordUserId}`);
      }

    } catch (roleError) {
      console.error('Erreur assignation rôle Discord:', roleError);
      // On ne bloque pas le processus si l'assignation échoue
      // L'utilisateur peut réessayer ou on peut assigner manuellement
    }

    // Rediriger vers le portail membre avec succès
    return res.redirect('/member-portal?discord_linked=true');

  } catch (error) {
    console.error('Erreur callback Discord:', error);
    return res.redirect(`/member-portal?error=${encodeURIComponent('Erreur serveur')}`);
  }
}

