import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function DownloadPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [licenses, setLicenses] = useState([]);
  const [loadingLicenses, setLoadingLicenses] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setLoadingUser(false);
    };
    init();
  }, []);

  const loadLicenses = async () => {
    try {
      setLoadingLicenses(true);
      const session = await supabase.auth.getSession();
      const accessToken = session?.data?.session?.access_token;
      const res = await fetch('/api/account/licenses', {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js.error || 'Erreur chargement licences');
      setLicenses(js.licenses || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingLicenses(false);
    }
  };

  const handleCreateDownload = async (licenseId) => {
    try {
      const res = await fetch('/api/token/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: { licenseId } }),
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js.error || 'Erreur création lien');
      window.location.href = `/api/download?token=${encodeURIComponent(js.token)}`;
    } catch (e) {
      alert(e.message);
    }
  };

  const downloadLinks = {
    windows: {
      size: '15.2 MB',
      version: '1.0.0',
      requirements: 'Windows 10/11 (64-bit)'
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-3xl font-bold text-amber-400">Télécharger Mindset - Alert Strategy</h1>
          <p className="mt-2 text-neutral-300">Accédez à votre programme après achat</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Accès sécurisé */}
        <div className="bg-neutral-900/40 rounded-2xl border border-neutral-800 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-amber-400">Accès au téléchargement</h2>
          {loadingUser ? (
            <div className="text-neutral-300">Chargement…</div>
          ) : !user ? (
            <div className="space-y-3">
              <p className="text-neutral-300">Veuillez vous connecter pour accéder à vos téléchargements.</p>
              <div className="flex gap-3">
                <Link href="/login?next=/download" className="px-4 py-2 rounded bg-amber-500 text-neutral-900 font-semibold hover:bg-amber-400">Se connecter</Link>
                <Link href="/register?next=/download" className="px-4 py-2 rounded bg-neutral-800 border border-neutral-700 hover:border-neutral-500">Créer un compte</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-neutral-400">Connecté en tant que</div>
              <div className="text-lg">{user.email}</div>
              <button onClick={loadLicenses} className="mt-2 text-sm px-3 py-2 rounded bg-neutral-800 border border-neutral-700 hover:border-neutral-500">Afficher mes licences</button>
            </div>
          )}
        </div>

        {/* Section de téléchargement */}
        {user && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-amber-400">Téléchargements disponibles</h2>
            
            {/* Windows */}
            <div className="bg-neutral-900/40 rounded-2xl border border-neutral-800 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🪟</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Mindset - Alert Strategy</h3>
                  <p className="text-neutral-300 mb-4">
                    Version {downloadLinks.windows.version} pour Windows
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-amber-400 mb-2">Exigences système</h4>
                      <ul className="text-sm text-neutral-300 space-y-1">
                        <li>• {downloadLinks.windows.requirements}</li>
                        <li>• 4 GB RAM minimum</li>
                        <li>• 100 MB d&apos;espace disque</li>
                        <li>• Connexion Internet</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-amber-400 mb-2">Informations</h4>
                      <ul className="text-sm text-neutral-300 space-y-1">
                        <li>• Taille: {downloadLinks.windows.size}</li>
                        <li>• Type: Installateur Windows</li>
                        <li>• Langues: Français, Anglais</li>
                        <li>• Support: Email inclus</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    {loadingLicenses ? (
                      <div className="text-neutral-400">Chargement des licences…</div>
                    ) : licenses.length === 0 ? (
                      <div className="text-neutral-400">Aucune licence trouvée pour ce compte.</div>
                    ) : (
                      licenses.map(({ license, token }) => (
                        <div key={license.id} className="flex items-center gap-3">
                          {token ? (
                            <a
                              href={`/api/download?token=${encodeURIComponent(token.token)}`}
                              className="bg-amber-500 hover:bg-amber-400 text-neutral-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <span>📥</span>
                              Télécharger (licence {license.license_key.slice(0,8)}…)
                            </a>
                          ) : (
                            <button
                              onClick={() => handleCreateDownload(license.id)}
                              className="bg-amber-500 hover:bg-amber-400 text-neutral-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                              Générer lien (licence {license.license_key.slice(0,8)}…)
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions d'installation */}
            <div className="bg-neutral-900/40 rounded-2xl border border-neutral-800 p-6">
              <h3 className="text-xl font-semibold mb-4 text-amber-400">Instructions d&apos;installation</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-amber-500 text-neutral-900 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Téléchargez le fichier</h4>
                    <p className="text-neutral-300 text-sm">Exécutez le fichier MindsetTrading_Setup.exe</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-amber-500 text-neutral-900 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Suivez l&apos;assistant d&apos;installation</h4>
                    <p className="text-neutral-300 text-sm">Acceptez les conditions et choisissez le dossier d&apos;installation</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-amber-500 text-neutral-900 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Entrez votre clé de licence</h4>
                    <p className="text-neutral-300 text-sm">Lancez l&apos;application et entrez votre clé de licence</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-amber-500 text-neutral-900 rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Configurez votre trading</h4>
                    <p className="text-neutral-300 text-sm">Sélectionnez votre broker et configurez les alertes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-neutral-900/40 rounded-2xl border border-neutral-800 p-6">
              <h3 className="text-xl font-semibold mb-4 text-amber-400">Besoin d&apos;aide ?</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Support technique</h4>
                <p className="text-neutral-300 text-sm mb-3">
                  Contactez-nous pour toute question technique ou problème d&apos;installation.
                </p>
                  <a href="mailto:support@mindset-alert.com" className="text-amber-400 hover:text-amber-300 text-sm">
                    support@mindset-alert.com
                  </a>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Documentation</h4>
                  <p className="text-neutral-300 text-sm mb-3">
                    Consultez notre guide complet d&apos;utilisation et de configuration.
                  </p>
                  <a href="#" className="text-amber-400 hover:text-amber-300 text-sm">
                    Guide d&apos;utilisation →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
