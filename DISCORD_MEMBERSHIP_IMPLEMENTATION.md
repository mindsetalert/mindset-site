# 🎯 Discord Membership - Plan d'Implémentation

## 📊 SCHÉMA BASE DE DONNÉES (Supabase)

### Nouvelle table: `memberships`
```sql
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive', -- active, inactive, cancelled, past_due
  subscription_plan TEXT, -- monthly, yearly
  discord_user_id TEXT UNIQUE,
  discord_username TEXT,
  discord_linked_at TIMESTAMP,
  has_ea_addon BOOLEAN DEFAULT FALSE,
  ea_purchase_date TIMESTAMP,
  ea_stripe_payment_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_memberships_email ON memberships(user_email);
CREATE INDEX idx_memberships_stripe_sub ON memberships(stripe_subscription_id);
CREATE INDEX idx_memberships_discord ON memberships(discord_user_id);
CREATE INDEX idx_memberships_status ON memberships(subscription_status);
```

### Mise à jour table `licenses`
```sql
-- Ajouter colonne pour lier licence au membership
ALTER TABLE licenses ADD COLUMN membership_id UUID REFERENCES memberships(id);
```

---

## 🔐 VARIABLES D'ENVIRONNEMENT

Ajouter dans `.env.local` (et Vercel):

```env
# Stripe (existant)
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...

# NOUVEAU: Prix EA Add-on
STRIPE_PRICE_EA_ADDON=price_...

# Discord OAuth2
DISCORD_CLIENT_ID=your_discord_app_id
DISCORD_CLIENT_SECRET=your_discord_app_secret
DISCORD_BOT_TOKEN=Bot your_bot_token
DISCORD_GUILD_ID=your_server_id
DISCORD_REDIRECT_URI=https://yourdomain.com/api/discord/callback

# Discord Role IDs
DISCORD_ROLE_MEMBER=123456789... (ID du rôle "Member")
DISCORD_ROLE_EA_OWNER=987654321... (ID du rôle "EA Owner")

# Supabase (existant)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 📦 PACKAGES À INSTALLER

```bash
npm install discord.js discord-oauth2
```

---

## 🏗️ STRUCTURE FICHIERS

### Nouveaux fichiers à créer:

```
pages/
  membership.js                    # Page marketing Membership
  member-portal.js                 # Espace membre avec Discord linking
  api/
    discord/
      auth.js                      # Initie OAuth2 Discord
      callback.js                  # Callback OAuth2 + link account
      assign-role.js               # Assigner rôle via Bot
      remove-role.js               # Retirer rôle via Bot
    membership/
      status.js                    # GET statut membership actuel
      create-checkout.js           # POST créer session Stripe membership
    ea/
      purchase.js                  # POST acheter EA add-on
      download.js                  # GET télécharger EA (si membre + acheté)
    stripe/
      webhook-membership.js        # Webhook Stripe pour memberships

lib/
  discord.js                       # Helpers Discord API
  discordBot.js                    # Instance bot Discord
```

---

## 🔄 FLUX UTILISATEUR COMPLET

### 1️⃣ **Achat Membership Initial**

```
User visite /membership 
  → Clique "Subscribe Monthly/Yearly"
  → Redirigé vers Stripe Checkout (subscription mode)
  → Paiement réussi
  → Webhook `checkout.session.completed`
    ✅ Créer entrée dans `memberships` (subscription_status = 'active')
    ✅ Créer licence Mindset liée au membership
    ✅ Envoyer email avec lien /member-portal
  → User redirigé vers /payment-success
  → Clique "Access Member Portal"
```

### 2️⃣ **Linking Discord**

```
User sur /member-portal
  → Clique "Connect Discord"
  → Redirigé vers Discord OAuth2 (/api/discord/auth)
  → User autorise l'app Discord
  → Callback /api/discord/callback
    ✅ Récupérer discord_user_id + username
    ✅ Sauvegarder dans `memberships` (discord_user_id, discord_linked_at)
    ✅ Appeler Bot Discord pour assigner rôle "Member" (/api/discord/assign-role)
  → User redirigé vers /member-portal (Discord maintenant linké)
```

### 3️⃣ **Renouvellement Automatique**

```
Stripe webhook: invoice.payment_succeeded
  → Trouver membership par stripe_subscription_id
  → Mettre à jour subscription_status = 'active'
  → Prolonger expires_at de la licence Mindset
  ✅ S'assurer que rôle Discord "Member" est actif (si linké)
```

### 4️⃣ **Échec Paiement / Annulation**

```
Stripe webhook: invoice.payment_failed
  → Mettre à jour subscription_status = 'past_due'
  → Suspendre licence Mindset (is_active = false)
  ✅ Retirer rôle Discord "Member" (appel bot)

Stripe webhook: customer.subscription.deleted
  → Mettre à jour subscription_status = 'cancelled'
  → Désactiver licence Mindset
  ✅ Retirer rôles Discord "Member" + "EA Owner" (appel bot)
```

### 5️⃣ **Achat EA Add-on**

```
User sur /member-portal (DOIT être membre actif)
  → Clique "Buy EA Add-on"
  → Redirigé vers Stripe Checkout (payment mode one-time)
  → Paiement réussi
  → Webhook `checkout.session.completed` (metadata: product='ea_addon')
    ✅ Mettre à jour has_ea_addon = true dans `memberships`
    ✅ Assigner rôle Discord "EA Owner" (si Discord linké)
    ✅ Envoyer email avec lien download EA
  → /member-portal affiche maintenant bouton "Download EA"
```

---

## 🤖 DISCORD BOT SETUP

### Créer le Bot Discord:

1. Aller sur https://discord.com/developers/applications
2. Créer "New Application"
3. Onglet "Bot":
   - Activer "Presence Intent", "Server Members Intent", "Message Content Intent"
   - Copier le Token → `DISCORD_BOT_TOKEN`
4. Onglet "OAuth2":
   - Copier Client ID → `DISCORD_CLIENT_ID`
   - Copier Client Secret → `DISCORD_CLIENT_SECRET`
   - Ajouter Redirect URI: `https://yourdomain.com/api/discord/callback`
5. Inviter le bot sur ton serveur:
   ```
   https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot
   ```
   (Permissions: Manage Roles)

### Créer les rôles sur Discord:

1. Serveur Discord → Paramètres → Rôles
2. Créer rôles:
   - `Member` (couleur verte)
   - `EA Owner` (couleur dorée)
3. Copier les IDs des rôles:
   - Mode développeur Discord → Clic droit sur rôle → "Copy ID"
   - → `DISCORD_ROLE_MEMBER`, `DISCORD_ROLE_EA_OWNER`

---

## 🔧 CODE SNIPPETS CLÉS

### `lib/discordBot.js` - Instance Bot
```javascript
import { Client, GatewayIntentBits } from 'discord.js';

let botClient = null;

export function getDiscordBot() {
  if (!botClient) {
    botClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
      ],
    });
    botClient.login(process.env.DISCORD_BOT_TOKEN);
  }
  return botClient;
}
```

### `api/discord/assign-role.js` - Assigner rôle
```javascript
import { getDiscordBot } from '../../../lib/discordBot';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { discordUserId, role } = req.body; // role: 'member' ou 'ea_owner'
  
  const roleId = role === 'member' 
    ? process.env.DISCORD_ROLE_MEMBER 
    : process.env.DISCORD_ROLE_EA_OWNER;
  
  const guildId = process.env.DISCORD_GUILD_ID;

  try {
    const bot = getDiscordBot();
    const guild = await bot.guilds.fetch(guildId);
    const member = await guild.members.fetch(discordUserId);
    await member.roles.add(roleId);
    
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
```

---

## ✅ CHECKLIST DÉPLOIEMENT

- [ ] Créer tables Supabase (`memberships`)
- [ ] Configurer Discord App + Bot
- [ ] Créer rôles Discord (Member, EA Owner)
- [ ] Ajouter toutes les env vars dans Vercel
- [ ] Créer produits Stripe (Membership Monthly/Yearly + EA Add-on)
- [ ] Implémenter tous les endpoints API
- [ ] Créer pages UI (membership, member-portal)
- [ ] Tester flux complet:
  - [ ] Achat membership
  - [ ] Linking Discord
  - [ ] Rôle assigné automatiquement
  - [ ] Achat EA add-on
  - [ ] Rôle EA Owner assigné
  - [ ] Annulation → rôles retirés
- [ ] Documentation utilisateur

---

## 🚀 PRÊT À COMMENCER ?

Dis-moi si tu veux que je commence l'implémentation, et par quelle partie on commence !

