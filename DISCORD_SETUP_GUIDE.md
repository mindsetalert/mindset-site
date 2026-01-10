# 🚀 Guide de Setup - Discord Membership

Ce guide explique comment configurer le système de membership Discord de A à Z.

---

## 📋 TABLE DES MATIÈRES

1. [Prérequis](#prérequis)
2. [Configuration Stripe](#configuration-stripe)
3. [Configuration Discord](#configuration-discord)
4. [Configuration Supabase](#configuration-supabase)
5. [Variables d'environnement](#variables-denvironnement)
6. [Installation et déploiement](#installation-et-déploiement)
7. [Tests](#tests)

---

## 🔧 PRÉREQUIS

- Compte Stripe actif
- Compte Discord (pour créer l'application Bot)
- Serveur Discord créé
- Base de données Supabase configurée
- Compte Vercel

---

## 💳 CONFIGURATION STRIPE

### 1. Créer les produits d'abonnement

1. Aller sur [Stripe Dashboard > Products](https://dashboard.stripe.com/products)

2. **Créer le produit "Discord Access" (25$/mois)**
   - Cliquer "Add product"
   - Nom : `Discord Access`
   - Description : `Accès à la communauté Discord Mindset`
   - Pricing model : `Recurring`
   - Price : `25 USD`
   - Billing period : `Monthly`
   - Sauvegarder et **copier le Price ID** (commence par `price_...`)
   - → Mettre dans `.env` : `STRIPE_PRICE_DISCORD_ONLY=price_xxx`

3. **Créer le produit "Discord + Mindset Bundle" (40$/mois)**
   - Cliquer "Add product"
   - Nom : `Discord + Mindset Bundle`
   - Description : `Accès Discord + Licence Mindset Alert Strategy`
   - Pricing model : `Recurring`
   - Price : `40 USD`
   - Billing period : `Monthly`
   - Sauvegarder et **copier le Price ID**
   - → Mettre dans `.env` : `STRIPE_PRICE_DISCORD_MINDSET=price_yyy`

### 2. Créer le webhook Discord

1. Aller sur [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquer "Add endpoint"
3. Endpoint URL : `https://votresite.com/api/stripe/webhook-discord`
4. Events à écouter :
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. Sauvegarder et **copier le Signing secret** (commence par `whsec_...`)
6. → Mettre dans `.env` : `STRIPE_WEBHOOK_SECRET_DISCORD=whsec_xxx`

---

## 🎮 CONFIGURATION DISCORD

### 1. Créer l'application Discord

1. Aller sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Cliquer "New Application"
3. Nom : `Mindset Membership Bot`
4. Accepter les termes et créer

### 2. Configurer le Bot

1. Dans l'onglet **"Bot"** :
   - Cliquer "Add Bot" → "Yes, do it!"
   - **Token** : Cliquer "Reset Token" puis copier le token
   - → Mettre dans `.env` : `DISCORD_BOT_TOKEN=MTxxx...`
   - **Intents** : Activer :
     - ✅ Presence Intent
     - ✅ Server Members Intent
     - ✅ Message Content Intent (optionnel)

### 3. Configurer OAuth2

1. Dans l'onglet **"OAuth2"** :
   - **Client ID** : Copier
   - → Mettre dans `.env` : `DISCORD_CLIENT_ID=123456789...`
   - **Client Secret** : Copier (ou générer si besoin)
   - → Mettre dans `.env` : `DISCORD_CLIENT_SECRET=abc123...`
   
2. **Redirects** :
   - Cliquer "Add Redirect"
   - URL : `https://votresite.com/api/discord/callback`
   - Sauvegarder

### 4. Inviter le Bot sur votre serveur

1. Générer l'URL d'invitation :
   ```
   https://discord.com/oauth2/authorize?client_id=VOTRE_CLIENT_ID&permissions=268435456&scope=bot
   ```
   - Remplacer `VOTRE_CLIENT_ID` par votre Client ID
   - Permissions : `268435456` = Manage Roles

2. Ouvrir l'URL dans le navigateur
3. Sélectionner votre serveur Discord
4. Autoriser

### 5. Créer les rôles Discord

1. Sur votre serveur Discord :
   - Paramètres > Rôles > Créer un rôle
   
2. **Créer 3 rôles** :
   - `Member` (pour Discord Access 25$/mois)
     - Couleur : Verte
     - Permissions : accès salons de base
   - `Mindset Member` (pour Bundle 40$/mois)
     - Couleur : Bleue
     - Permissions : accès salons Mindset + salons de base
   - `EA Owner` (pour add-on EA)
     - Couleur : Dorée
     - Permissions : accès salons EA

3. **Important** : Le rôle du bot doit être **au-dessus** de ces 3 rôles dans la hiérarchie

### 6. Récupérer les IDs des rôles

1. Activer le mode développeur Discord :
   - Paramètres Utilisateur > Avancés > Mode développeur ✅

2. Sur votre serveur :
   - Paramètres > Rôles
   - Clic droit sur chaque rôle > "Copier l'identifiant"

3. Ajouter dans `.env` :
   ```
   DISCORD_ROLE_MEMBER=123456789...
   DISCORD_ROLE_MINDSET_MEMBER=987654321...
   DISCORD_ROLE_EA_OWNER=111222333...
   ```

### 7. Récupérer l'ID du serveur

1. Clic droit sur le nom du serveur > "Copier l'identifiant"
2. → Mettre dans `.env` : `DISCORD_GUILD_ID=444555666...`

---

## 🗄️ CONFIGURATION SUPABASE

### 1. Créer la table `discord_memberships`

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Projet > SQL Editor > New query
3. Copier-coller le contenu de `database/schema_discord_memberships.sql`
4. Exécuter la requête

### 2. Vérifier les variables Supabase existantes

Les variables suivantes doivent déjà être configurées :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

---

## 🔐 VARIABLES D'ENVIRONNEMENT

Créer un fichier `.env.local` à la racine du projet :

```env
# ============================================
# STRIPE
# ============================================
STRIPE_SECRET_KEY=sk_live_xxx (ou sk_test_xxx pour tester)
STRIPE_PUBLISHABLE_KEY=pk_live_xxx (ou pk_test_xxx)
STRIPE_WEBHOOK_SECRET=whsec_xxx (webhook existant pour licences)
STRIPE_WEBHOOK_SECRET_DISCORD=whsec_yyy (nouveau webhook Discord)

# Prix Stripe Discord
STRIPE_PRICE_DISCORD_ONLY=price_xxx (25$/mois)
STRIPE_PRICE_DISCORD_MINDSET=price_yyy (40$/mois)

# Prix Stripe Mindset existants (ne pas toucher)
STRIPE_PRICE_MONTHLY=price_zzz
STRIPE_PRICE_YEARLY=price_aaa

# ============================================
# DISCORD
# ============================================
DISCORD_CLIENT_ID=123456789...
DISCORD_CLIENT_SECRET=abc123def456...
DISCORD_BOT_TOKEN=MTxxx.yyy.zzz
DISCORD_GUILD_ID=444555666...
DISCORD_REDIRECT_URI=https://votresite.com/api/discord/callback

# Rôles Discord
DISCORD_ROLE_MEMBER=111222333... (Discord Access 25$)
DISCORD_ROLE_MINDSET_MEMBER=444555666... (Bundle 40$)
DISCORD_ROLE_EA_OWNER=777888999... (EA add-on)

# ============================================
# SUPABASE (existant)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# ============================================
# SITE
# ============================================
NEXT_PUBLIC_SITE_URL=https://votresite.com

# ============================================
# AUTRES (existant)
# ============================================
DOWNLOAD_SECRET=your_secret_for_tokens
```

### ⚠️ IMPORTANT : Ajouter les variables dans Vercel

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Projet `mindset-site` > Settings > Environment Variables
3. Ajouter **TOUTES** les variables ci-dessus
4. Redéployer le site

---

## 📦 INSTALLATION ET DÉPLOIEMENT

### 1. Installer les dépendances

```bash
cd "c:\dev\mindset\site web\mindset-site"
npm install
```

Ceci va installer `discord.js` et toutes les dépendances nécessaires.

### 2. Tester localement

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

**Pages à tester** :
- `/discord` → Page marketing Discord
- `/member-portal` → Portail membre (nécessite connexion)
- `/account` → Compte existant (ne doit pas être affecté)

### 3. Déployer sur Vercel

**Option A : Via l'interface Vercel (Drag & Drop)**
1. Builder le projet : `npm run build`
2. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
3. Drag & drop le dossier `.next`

**Option B : Via API Token (recommandé)**

Avec le token Vercel que tu m'as donné :

```bash
cd "c:\dev\mindset\site web\mindset-site"
npm install -g vercel
vercel --token Dcq1SmjdqFjKcvM7FSXMxSm9 --prod
```

---

## ✅ TESTS

### Test 1 : Achat Discord seul (25$/mois)

1. Aller sur `/discord`
2. Cliquer "S'abonner" sur le plan Discord Access
3. Payer avec une carte test Stripe : `4242 4242 4242 4242`
4. Vérifier :
   - ✅ Redirection vers `/payment-success`
   - ✅ Entrée créée dans `discord_memberships` (Supabase)
   - ✅ Email reçu
5. Aller sur `/member-portal`
6. Cliquer "Connecter Discord"
7. Autoriser l'app Discord
8. Vérifier :
   - ✅ Discord lié dans Supabase
   - ✅ Rôle `Member` assigné sur Discord
   - ✅ Accès aux salons Discord de base

### Test 2 : Achat Bundle (40$/mois)

1. Aller sur `/discord`
2. Cliquer "S'abonner" sur le Bundle
3. Payer avec carte test
4. Vérifier :
   - ✅ Entrée dans `discord_memberships`
   - ✅ Licence Mindset créée dans `licenses`
   - ✅ Lien entre les deux tables
5. Connecter Discord sur `/member-portal`
6. Vérifier :
   - ✅ Rôle `Mindset Member` assigné
   - ✅ Accès salons Mindset + salons de base
   - ✅ Licence Mindset visible sur `/account`

### Test 3 : Annulation abonnement

1. Aller sur `/member-portal`
2. Cliquer "Gérer mon abonnement" (Stripe Portal)
3. Annuler l'abonnement
4. Vérifier (via webhook Stripe) :
   - ✅ `subscription_status` = `cancelled` dans Supabase
   - ✅ Rôles Discord retirés automatiquement
   - ✅ Licence Mindset désactivée (si bundle)

### Test 4 : Système Mindset existant non affecté

1. Acheter une licence Mindset depuis la page d'accueil `/` (ancien système)
2. Vérifier :
   - ✅ Fonctionne toujours normalement
   - ✅ Aucun impact sur `discord_memberships`
   - ✅ Licence créée dans `licenses` uniquement

---

## 🎯 CHECKLIST FINALE

Avant de mettre en production :

- [ ] Toutes les variables d'environnement configurées dans Vercel
- [ ] Table `discord_memberships` créée dans Supabase
- [ ] Bot Discord invité sur le serveur avec permissions "Manage Roles"
- [ ] Rôles Discord créés (Member, Mindset Member, EA Owner)
- [ ] Produits Stripe créés (25$/mois et 40$/mois)
- [ ] Webhook Stripe Discord configuré
- [ ] Tests effectués en mode Stripe Test
- [ ] Page `/discord` accessible et fonctionnelle
- [ ] Page `/member-portal` accessible
- [ ] Système de licences Mindset existant toujours fonctionnel
- [ ] Emails de bienvenue configurés
- [ ] Lien d'invitation Discord ajouté dans `/member-portal.js` (ligne 204)

---

## 🆘 SUPPORT

En cas de problème :

1. Vérifier les logs Vercel : [Dashboard > Deployments > Functions](https://vercel.com/dashboard)
2. Vérifier les logs Stripe : [Dashboard > Developers > Logs](https://dashboard.stripe.com/logs)
3. Vérifier les webhooks Stripe : [Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
4. Vérifier la base de données Supabase : [Dashboard > Table Editor](https://supabase.com/dashboard)

---

🎉 **Félicitations ! Votre système de membership Discord est prêt !**

