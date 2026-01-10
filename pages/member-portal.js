import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MemberPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadUserAndMembership();

    // Afficher les messages d'erreur/succès depuis l'URL
    if (router.query.error) {
      setError(decodeURIComponent(router.query.error));
    }
    if (router.query.discord_linked === 'true') {
      setSuccess('✅ Discord lié avec succès ! Votre rôle a été assigné.');
    }
  }, [router.query]);

  const loadUserAndMembership = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'utilisateur connecté
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        router.push('/login?next=/member-portal');
        return;
      }

      setUser(userData.user);

      // Récupérer le membership Discord
      const res = await fetch('/api/membership/status');
      const data = await res.json();

      if (res.ok && data.membership) {
        setMembership(data.membership);
      } else {
        setMembership(null);
      }

    } catch (e) {
      console.error('Erreur chargement membership:', e);
      setError('Erreur lors du chargement de vos informations');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectDiscord = () => {
    window.location.href = '/api/discord/auth';
  };

  const handleManageSubscription = async () => {
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session?.data?.session?.access_token;
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js.error || 'Erreur');
      window.location.href = js.url;
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">Portail Membre</h1>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold mb-4">Aucun abonnement Discord actif</h2>
            <p className="text-neutral-400 mb-6">
              Vous devez d'abord souscrire à un plan Discord pour accéder à ce portail.
            </p>
            <Link href="/discord" className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors">
              Voir les plans Discord
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isActive = membership.subscription_status === 'active';
  const isDiscordLinked = !!membership.discord_user_id;
  const planName = membership.subscription_plan === 'discord_mindset' 
    ? 'Discord + Mindset Bundle' 
    : 'Discord Access';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-neutral-400 hover:text-neutral-100 text-sm">
            ← Retour à l'accueil
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Portail Membre Discord</h1>

        {/* Messages d'erreur/succès */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Statut abonnement */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-neutral-400 mb-1">Plan actuel</div>
              <div className="text-2xl font-bold">{planName}</div>
              <div className="text-sm text-neutral-400 mt-2">{user.email}</div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isActive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {isActive ? '✓ Actif' : '✗ Inactif'}
            </div>
          </div>

          {membership.subscription_ends_at && (
            <div className="text-sm text-neutral-500 mb-4">
              Expire le : {new Date(membership.subscription_ends_at).toLocaleDateString('fr-FR')}
            </div>
          )}

          <button
            onClick={handleManageSubscription}
            className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold transition-colors"
          >
            Gérer mon abonnement
          </button>
        </div>

        {/* Connexion Discord */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connexion Discord</h2>
          
          {isDiscordLinked ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex-shrink-0">
                  {membership.discord_avatar ? (
                    <img 
                      src={`https://cdn.discordapp.com/avatars/${membership.discord_user_id}/${membership.discord_avatar}.png`}
                      alt="Discord Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {membership.discord_username?.[0]?.toUpperCase() || 'D'}
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="font-semibold text-green-400">✓ Discord connecté</div>
                  <div className="text-sm text-neutral-400">
                    {membership.discord_username}#{membership.discord_discriminator}
                  </div>
                </div>
              </div>

              <div className="text-sm text-neutral-400">
                Votre rôle Discord a été assigné automatiquement. Rejoignez le serveur pour commencer :
              </div>

              <a 
                href="https://discord.gg/VOTRE_LIEN_INVITE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
              >
                🎮 Rejoindre le Discord
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-neutral-400">
                Connectez votre compte Discord pour accéder au serveur et recevoir automatiquement votre rôle.
              </p>
              
              {isActive ? (
                <button
                  onClick={handleConnectDiscord}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                >
                  🔗 Connecter mon Discord
                </button>
              ) : (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                  <p className="text-amber-400 text-sm">
                    ⚠️ Votre abonnement doit être actif pour connecter Discord
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fonctionnalités selon le plan */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
          <h2 className="text-xl font-semibold mb-4">Votre accès inclut :</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Salon principal de discussion</span>
            </li>
            {membership.subscription_plan === 'discord_mindset' && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span className="font-semibold">Salon dédié Mindset Alert Strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span className="font-semibold">Licence logiciel Mindset Alert Strategy</span>
                </li>
              </>
            )}
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Support prioritaire</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Ressources exclusives</span>
            </li>
          </ul>

          {membership.subscription_plan === 'discord_mindset' && membership.has_mindset_access && (
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <h3 className="font-semibold mb-3">Télécharger Mindset Alert Strategy</h3>
              <Link href="/account" className="inline-block px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors">
                Accéder aux téléchargements
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

