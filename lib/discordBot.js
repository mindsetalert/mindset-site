import { Client, GatewayIntentBits } from 'discord.js';

let botClient = null;
let isReady = false;

/**
 * Récupère l'instance du bot Discord (singleton)
 * Le bot se connecte automatiquement au premier appel
 */
export function getDiscordBot() {
  if (!botClient) {
    const token = process.env.DISCORD_BOT_TOKEN;
    
    if (!token) {
      throw new Error('DISCORD_BOT_TOKEN non configuré');
    }

    botClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
      ],
    });

    botClient.once('ready', () => {
      console.log(`✅ Discord Bot connecté : ${botClient.user.tag}`);
      isReady = true;
    });

    botClient.on('error', (error) => {
      console.error('❌ Erreur Discord Bot:', error);
    });

    botClient.login(token).catch((err) => {
      console.error('❌ Échec connexion Discord Bot:', err);
      botClient = null;
    });
  }

  return botClient;
}

/**
 * Assigne un rôle à un membre Discord
 * @param {string} discordUserId - ID Discord de l'utilisateur
 * @param {string} roleType - Type de rôle: 'member', 'mindset_member', 'ea_owner'
 * @returns {Promise<boolean>} - true si succès
 */
export async function assignDiscordRole(discordUserId, roleType) {
  try {
    const bot = getDiscordBot();
    const guildId = process.env.DISCORD_GUILD_ID;
    
    // Map des rôles
    const roleMap = {
      member: process.env.DISCORD_ROLE_MEMBER, // Discord seul (25$/mois)
      mindset_member: process.env.DISCORD_ROLE_MINDSET_MEMBER, // Bundle (40$/mois)
      ea_owner: process.env.DISCORD_ROLE_EA_OWNER, // EA add-on
    };

    const roleId = roleMap[roleType];
    
    if (!roleId) {
      throw new Error(`Type de rôle invalide: ${roleType}`);
    }

    if (!guildId) {
      throw new Error('DISCORD_GUILD_ID non configuré');
    }

    // Attendre que le bot soit prêt
    if (!isReady) {
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (isReady) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        
        // Timeout après 10 secondes
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 10000);
      });
    }

    const guild = await bot.guilds.fetch(guildId);
    const member = await guild.members.fetch(discordUserId);
    
    // Vérifier si le membre a déjà ce rôle
    if (member.roles.cache.has(roleId)) {
      console.log(`ℹ️ Membre ${discordUserId} a déjà le rôle ${roleType}`);
      return true;
    }

    await member.roles.add(roleId);
    console.log(`✅ Rôle ${roleType} assigné à ${discordUserId}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur assignation rôle ${roleType} à ${discordUserId}:`, error);
    throw error;
  }
}

/**
 * Retire un rôle à un membre Discord
 * @param {string} discordUserId - ID Discord de l'utilisateur
 * @param {string} roleType - Type de rôle: 'member', 'mindset_member', 'ea_owner'
 * @returns {Promise<boolean>} - true si succès
 */
export async function removeDiscordRole(discordUserId, roleType) {
  try {
    const bot = getDiscordBot();
    const guildId = process.env.DISCORD_GUILD_ID;
    
    const roleMap = {
      member: process.env.DISCORD_ROLE_MEMBER,
      mindset_member: process.env.DISCORD_ROLE_MINDSET_MEMBER,
      ea_owner: process.env.DISCORD_ROLE_EA_OWNER,
    };

    const roleId = roleMap[roleType];
    
    if (!roleId || !guildId) {
      throw new Error('Configuration Discord incomplète');
    }

    if (!isReady) {
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (isReady) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 10000);
      });
    }

    const guild = await bot.guilds.fetch(guildId);
    const member = await guild.members.fetch(discordUserId);
    
    // Vérifier si le membre a ce rôle
    if (!member.roles.cache.has(roleId)) {
      console.log(`ℹ️ Membre ${discordUserId} n'a pas le rôle ${roleType}`);
      return true;
    }

    await member.roles.remove(roleId);
    console.log(`✅ Rôle ${roleType} retiré à ${discordUserId}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur retrait rôle ${roleType} à ${discordUserId}:`, error);
    throw error;
  }
}

/**
 * Retire TOUS les rôles Mindset d'un membre (lors d'annulation complète)
 * @param {string} discordUserId - ID Discord de l'utilisateur
 * @returns {Promise<boolean>} - true si succès
 */
export async function removeAllMindsetRoles(discordUserId) {
  try {
    await removeDiscordRole(discordUserId, 'member');
    await removeDiscordRole(discordUserId, 'mindset_member');
    await removeDiscordRole(discordUserId, 'ea_owner');
    
    console.log(`✅ Tous les rôles Mindset retirés à ${discordUserId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur retrait de tous les rôles à ${discordUserId}:`, error);
    throw error;
  }
}

