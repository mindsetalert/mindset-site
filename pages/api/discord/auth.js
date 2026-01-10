/**
 * API Route: /api/discord/auth
 * Description: Initie le flux OAuth2 Discord
 * Redirige l'utilisateur vers Discord pour autoriser l'application
 */

export default async function handler(req, res) {
  try {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return res.status(500).json({ 
        error: 'Configuration Discord OAuth2 incomplète' 
      });
    }

    // Construire l'URL d'autorisation Discord
    const scope = 'identify email guilds.join';
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;

    // Rediriger vers Discord
    return res.redirect(authUrl);
  } catch (error) {
    console.error('Erreur Discord OAuth2 auth:', error);
    return res.status(500).json({ error: error.message });
  }
}

