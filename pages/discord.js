import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function DiscordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (plan) => {
    try {
      setLoading(plan);

      // Créer une session Stripe Checkout
      const res = await fetch('/api/stripe/checkout-discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session');
      }

      // Rediriger vers Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      alert(error.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-new.png" alt="Mindset Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold">Mindset Alert Strategy</span>
          </Link>
          <Link href="/account" className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors">
            Mon compte
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
            🎉 Nouvelle offre : Communauté Discord Privée
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Rejoignez la communauté<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Mindset Trading
            </span>
          </h1>
          
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Accédez à notre Discord privé pour échanger avec d'autres traders, 
            recevoir du support en temps réel et améliorer vos performances.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#pricing" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors">
              Voir les offres
            </a>
            <Link href="/account" className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors">
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Features Discord */}
      <section className="py-16 px-4 bg-neutral-900/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ce que vous obtenez avec Discord
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Support en temps réel</h3>
              <p className="text-neutral-400">
                Posez vos questions et obtenez des réponses rapides de la communauté et de l'équipe.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Partage de stratégies</h3>
              <p className="text-neutral-400">
                Échangez vos idées, trades et stratégies avec d'autres traders actifs.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">Ressources exclusives</h3>
              <p className="text-neutral-400">
                Accédez à des guides, tutoriels et mises à jour en avant-première.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-center text-neutral-400 mb-12">
            Annulez à tout moment. Aucun engagement.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Discord Seul (25$/mois) */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Discord Access</h3>
                <p className="text-neutral-400 text-sm mb-4">
                  Accès à la communauté Discord
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">25$</span>
                  <span className="text-neutral-400">USD / mois</span>
                </div>
              </div>

              <div className="flex-grow mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Accès salon principal de discussion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Support communautaire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Partage de trades et stratégies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Ressources gratuites</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe('discord_only')}
                disabled={loading === 'discord_only'}
                className="w-full px-6 py-4 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {loading === 'discord_only' ? 'Chargement...' : 'S\'abonner maintenant'}
              </button>
            </div>

            {/* Plan Bundle Discord + Mindset (40$/mois) */}
            <div className="rounded-2xl border-2 border-blue-500 bg-neutral-900/60 p-8 flex flex-col relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-500 text-white text-sm font-bold">
                🔥 MEILLEUR CHOIX
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Discord + Mindset Bundle</h3>
                <p className="text-neutral-400 text-sm mb-4">
                  Discord + Licence logiciel Mindset
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-blue-400">40$</span>
                  <span className="text-neutral-400">USD / mois</span>
                </div>
                <div className="mt-2 text-sm text-green-400 font-semibold">
                  Économisez en combinant les deux !
                </div>
              </div>

              <div className="flex-grow mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="font-semibold">Tout de Discord Access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>Salon dédié Mindset Alert Strategy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span className="font-semibold">Licence logiciel Mindset incluse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>Support technique prioritaire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>Mises à jour automatiques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>Tutoriels exclusifs</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe('discord_mindset')}
                disabled={loading === 'discord_mindset'}
                className="w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50"
              >
                {loading === 'discord_mindset' ? 'Chargement...' : 'S\'abonner maintenant'}
              </button>
            </div>
          </div>

          {/* Note importante */}
          <div className="mt-12 max-w-2xl mx-auto rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
            <h4 className="font-semibold text-amber-400 mb-2">📌 Clients existants</h4>
            <p className="text-sm text-neutral-300">
              Si vous avez déjà un abonnement Mindset Alert Strategy, vous devez l'annuler avant de souscrire au Bundle. 
              Contactez-nous si vous avez besoin d'aide pour la migration.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-neutral-900/30">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>

          <div className="space-y-6">
            <details className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
              <summary className="font-semibold cursor-pointer">
                Comment lier mon compte Discord ?
              </summary>
              <p className="mt-3 text-neutral-400">
                Après votre abonnement, rendez-vous dans votre espace membre et cliquez sur "Connecter Discord". 
                Votre rôle sera automatiquement assigné.
              </p>
            </details>

            <details className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
              <summary className="font-semibold cursor-pointer">
                Puis-je annuler à tout moment ?
              </summary>
              <p className="mt-3 text-neutral-400">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace membre. 
                Votre accès reste actif jusqu'à la fin de la période payée.
              </p>
            </details>

            <details className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
              <summary className="font-semibold cursor-pointer">
                Quelle est la différence entre les deux plans ?
              </summary>
              <p className="mt-3 text-neutral-400">
                Le plan Discord Access (25$/mois) donne uniquement accès au salon principal de discussion. 
                Le Bundle (40$/mois) inclut l'accès à un salon dédié Mindset + la licence du logiciel Mindset Alert Strategy.
              </p>
            </details>

            <details className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
              <summary className="font-semibold cursor-pointer">
                J'ai déjà Mindset, comment passer au Bundle ?
              </summary>
              <p className="mt-3 text-neutral-400">
                Vous devez d'abord annuler votre abonnement Mindset actuel, puis souscrire au Bundle. 
                Contactez notre support si vous avez besoin d'aide.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-4">
        <div className="mx-auto max-w-7xl text-center text-neutral-500 text-sm">
          <p>© {new Date().getFullYear()} Mindset Alert Strategy. Tous droits réservés.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/contact" className="hover:text-neutral-300 transition-colors">Contact</Link>
            <Link href="/account" className="hover:text-neutral-300 transition-colors">Mon compte</Link>
            <Link href="/" className="hover:text-neutral-300 transition-colors">Retour à l'accueil</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

