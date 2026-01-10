# 🎮 Discord Membership System - Vue d'ensemble

## 📁 Fichiers créés / modifiés

### ✅ Nouveaux fichiers créés

**Base de données :**
- `database/schema_discord_memberships.sql` - Schéma table Discord memberships

**Librairies :**
- `lib/discordBot.js` - Instance bot Discord + fonctions rôles

**API Routes :**
- `pages/api/discord/auth.js` - Initie OAuth2 Discord
- `pages/api/discord/callback.js` - Callback OAuth2 + linking
- `pages/api/discord/assign-role.js` - Assigner rôle Discord
- `pages/api/discord/remove-role.js` - Retirer rôle Discord
- `pages/api/stripe/checkout-discord.js` - Créer session Stripe Discord
- `pages/api/stripe/webhook-discord.js` - Webhook Stripe Discord (séparé)
- `pages/api/membership/status.js` - Récupérer statut membership

**Pages :**
- `pages/discord.js` - Page marketing Discord (25$ et 40$/mois)
- `pages/member-portal.js` - Portail membre + linking Discord

**Documentation :**
- `DISCORD_SETUP_GUIDE.md` - Guide complet de setup
- `DISCORD_IMPLEMENTATION.md` - Plan d'implémentation
- `DISCORD_README.md` - Ce fichier

### ✏️ Fichiers modifiés

- `package.json` - Ajout de `discord.js`

### ⚠️ Fichiers NON TOUCHÉS (système existant protégé)

- `pages/index.js` - Page d'accueil (reste intact)
- `pages/account.js` - Compte existant (reste intact)
- `pages/api/stripe/webhook.js` - Webhook licences Mindset (reste intact)
- Table `licenses` - Licences existantes (reste intact)
- Tout le système de paiement Mindset actuel (reste intact)

---

## 🎯 Architecture du système

```
┌─────────────────────────────────────────────┐
│         USER achète abonnement Discord       │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│    Stripe Checkout (discord_only / discord_mindset) │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│  Webhook: checkout.session.completed        │
│  → Créer entrée discord_memberships         │
│  → Si bundle: créer licence Mindset         │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│  User sur /member-portal                    │
│  → Clique "Connecter Discord"               │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│  OAuth2 Discord (/api/discord/auth)         │
│  → Callback (/api/discord/callback)         │
│  → Sauvegarder discord_user_id              │
│  → Assigner rôle Discord via Bot            │
└─────────────────────────────────────────────┘
```

---

## 💰 Plans et Rôles Discord

| Plan | Prix | Rôle Discord | Accès |
|------|------|--------------|-------|
| **Discord Access** | 25$/mois | `Member` | Salon principal uniquement |
| **Discord + Mindset Bundle** | 40$/mois | `Mindset Member` | Salon principal + salon Mindset + licence logiciel |
| **EA Add-on** (optionnel) | TBD | `EA Owner` | Salons EA |

---

## 🚀 Déploiement rapide

### 1. Installer les dépendances

```bash
cd "c:\dev\mindset\site web\mindset-site"
npm install
```

### 2. Configurer les variables d'environnement

Voir `DISCORD_SETUP_GUIDE.md` section "Variables d'environnement"

### 3. Créer la table Supabase

Exécuter `database/schema_discord_memberships.sql` dans Supabase SQL Editor

### 4. Tester localement

```bash
npm run dev
```

Visiter `http://localhost:3000/discord`

### 5. Déployer sur Vercel

```bash
npm install -g vercel
vercel --token Dcq1SmjdqFjKcvM7FSXMxSm9 --prod
```

---

## 🔗 URLs importantes

- **Page marketing Discord** : `/discord`
- **Portail membre** : `/member-portal`
- **API OAuth2 Discord** : `/api/discord/auth`
- **Callback Discord** : `/api/discord/callback`
- **Checkout Discord** : `/api/stripe/checkout-discord`
- **Webhook Discord** : `/api/stripe/webhook-discord`

---

## ⚠️ Prochaines étapes

1. **Configurer Discord Bot** (voir `DISCORD_SETUP_GUIDE.md`)
2. **Créer les produits Stripe** (25$ et 40$/mois)
3. **Créer le webhook Stripe Discord**
4. **Créer la table Supabase**
5. **Ajouter toutes les variables d'environnement dans Vercel**
6. **Modifier `/member-portal.js` ligne 204** : Remplacer `https://discord.gg/VOTRE_LIEN_INVITE` par le vrai lien Discord
7. **Tester avec carte test Stripe**
8. **Mettre en production**

---

## 📧 TODO: Email de bienvenue

Ajouter un email de bienvenue dans `pages/api/stripe/webhook-discord.js` après la création du membership (ligne ~180).

Exemple :
```javascript
// Envoyer email de bienvenue
await sendDiscordWelcomeEmail({
  to: customerEmail,
  plan: planName,
  memberPortalUrl: `${siteUrl}/member-portal`,
});
```

---

## 🐛 Debugging

- **Logs Vercel** : https://vercel.com/dashboard → Deployments → Functions
- **Logs Stripe** : https://dashboard.stripe.com/logs
- **Logs Supabase** : https://supabase.com/dashboard → Logs
- **Discord Bot logs** : Console serveur (Vercel Functions logs)

---

🎉 **Le système est prêt à être configuré et déployé !**

