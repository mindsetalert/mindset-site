# 🚀 Déploiement Rapide - Discord Preview

## ✅ Ce qui a été ajouté au site :

- Bouton **"🚧 Discord Preview"** dans le menu (orange, visible)
- Pages `/discord` et `/member-portal` accessibles
- Tout le reste du site **reste intact**

---

## 📦 ÉTAPE 1 : Installer les dépendances

Ouvre PowerShell et exécute :

```powershell
cd "c:\dev\mindset\site web\mindset-site"
npm install
```

Ceci installe `discord.js` et les autres dépendances.

---

## 🧪 ÉTAPE 2 : Tester localement (optionnel)

```powershell
npm run dev
```

Puis ouvre `http://localhost:3000` dans ton navigateur.

Clique sur "🚧 Discord Preview" dans le menu → tu devrais voir la page Discord !

---

## ☁️ ÉTAPE 3 : Déployer sur Vercel

### Option A : Via le terminal (avec ton token)

```powershell
npm install -g vercel
cd "c:\dev\mindset\site web\mindset-site"
vercel --token Dcq1SmjdqFjKcvM7FSXMxSm9 --prod
```

### Option B : Via l'interface Vercel

1. Va sur https://vercel.com/dashboard
2. Trouve ton projet `mindset-site`
3. Settings → Git
4. Si pas encore connecté à Git :
   - Drag & drop le dossier complet dans Vercel
   - Ou connecte à GitHub d'abord

---

## 🎨 ÉTAPE 4 : Voir le résultat

Une fois déployé, va sur ton site :

**`https://mindsetalertstrategy.com`**

→ Clique sur **"🚧 Discord Preview"** dans le menu

→ Tu verras la page Discord avec les 2 plans (25$ et 40$/mois)

---

## ⚠️ POUR L'INSTANT :

Les **paiements NE FONCTIONNERONT PAS** tant que tu n'as pas configuré :

1. ✅ Les produits Stripe (25$ et 40$/mois)
2. ✅ Le webhook Stripe Discord
3. ✅ Les variables d'environnement dans Vercel
4. ✅ La table Supabase
5. ✅ Le bot Discord

**Mais tu peux déjà voir le DESIGN et la mise en page !**

---

## 🎯 QUAND TOUT EST PRÊT :

### Pour RETIRER le bouton "🚧 Discord Preview" :

Édite `components\SiteHeader.js` et **supprime ces lignes** :

**Ligne 40 (desktop) :**
```javascript
<Link href="/discord" className="px-3 py-1 rounded-md bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30 whitespace-nowrap">🚧 Discord Preview</Link>
```

**Ligne 72 (mobile) :**
```javascript
<Link href="/discord" className="py-2 px-3 rounded-md bg-orange-500/20 border border-orange-500/50 text-orange-400" onClick={() => setMobileMenuOpen(false)}>🚧 Discord Preview</Link>
```

### Pour AJOUTER un vrai lien "Discord" permanent :

Remplace par :

```javascript
<Link href="/discord" className="hover:text-amber-300">Discord</Link>
```

Puis redéploie !

---

🎉 **C'est tout ! Tu peux déployer maintenant pour voir le design !**

