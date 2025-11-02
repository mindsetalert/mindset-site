import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';

export default function AccountPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState([]);
  const [loadingLicenses, setLoadingLicenses] = useState(false);

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

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setLoading(false);
      
      // Charger automatiquement les licences après avoir chargé l'utilisateur
      if (data?.user) {
        loadLicenses();
      }
    };
    init();
  }, []);

  if (loading) return <div className="min-h-screen bg-neutral-950 text-neutral-100"><div className="p-8">{t('account.loading')}</div></div>;
  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login?next=/account';
    return null;
  }

  // Helper to generate a signed token and persist row
  const handleCreateDownload = async (licenseId) => {
    try {
      // demande au serveur de créer un jeton signé et une entrée en base
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
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="text-neutral-400 hover:text-neutral-100 text-sm">
            {t('account.backToHome')}
          </Link>
        </div>
        <h1 className="text-2xl font-semibold mb-6">{t('account.title')}</h1>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-neutral-400">{t('account.email')}</div>
              <div className="text-lg">{user.email}</div>
            </div>
            <button
              onClick={handleManageSubscription}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              {t('account.manageSubscription')}
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            {t('account.subscriptionNote')}
          </p>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('account.myLicenses')}</h2>
            <button onClick={loadLicenses} className="text-sm px-3 py-2 rounded bg-neutral-800 border border-neutral-700 hover:border-neutral-500">{t('account.refresh')}</button>
          </div>
          {loadingLicenses ? (
            <div className="mt-4 text-neutral-400">{t('account.loadingLicenses')}</div>
          ) : licenses.length === 0 ? (
            <div className="mt-4 text-neutral-400">{t('account.noLicenses')}</div>
          ) : (
            <div className="mt-4 space-y-3">
              {licenses.map(({ license, token }) => (
                <div key={license.id} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm text-neutral-400">{t('account.license')}</div>
                      <div className="font-mono text-sm">{license.license_key}</div>
                      <div className="text-xs text-neutral-500 mt-1">{t('account.status')}: {license.status} · {t('account.expires')}: {license.expires_at ? new Date(license.expires_at).toLocaleDateString() : '—'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {token ? (
                        <div className="flex flex-col items-end">
                          <a href={`/api/download?token=${encodeURIComponent(token.token)}`} className="px-3 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400">{t('account.downloadSoftware')}</a>
                          <div className="text-xs text-neutral-500 mt-1">{t('account.softwareVersion')}</div>
                        </div>
                      ) : (
                        <button onClick={() => handleCreateDownload(license.id)} className="px-3 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400">{t('account.generateLink')}</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vidéo explicative */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-1">{t('videos.title')}</h2>
          <div className="text-sm text-neutral-400 mb-4">{t('videos.pnlCaption')}</div>
          <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/40">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/gF5pcxdKwLc"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Section Acheter un forfait */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-2">{t('account.buyPlan')}</h2>
          <p className="text-neutral-400 text-sm mb-6">{t('account.buyPlanSubtitle')}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Forfait Mensuel */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col">
              <h3 className="text-xl font-semibold">{t('pricing.monthly.title')}</h3>
              <p className="text-sm text-neutral-300">{t('pricing.monthly.description')}</p>
              <div className="text-4xl font-black mt-4">
                {t('pricing.monthly.price')} <span className="text-base font-semibold text-neutral-400">{t('pricing.monthly.period')}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-300 flex-grow">
                {t('pricing.monthly.features').map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <Link href="/payment?plan=monthly" className="block mt-6 px-4 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-600 text-center">
                {t('pricing.monthly.button')}
              </Link>
              <p className="mt-2 text-xs text-neutral-400">{t('pricing.monthly.note')}</p>
            </div>

            {/* Forfait Annuel */}
            <div className="rounded-2xl border border-amber-500/50 bg-neutral-900/40 p-6 flex flex-col relative">
              <div className="absolute -top-3 right-4 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                {t('pricing.yearly.discount')}
              </div>
              <h3 className="text-xl font-semibold">{t('pricing.yearly.title')}</h3>
              <p className="text-sm text-neutral-300">{t('pricing.yearly.description')}</p>
              <div className="text-4xl font-black mt-4">
                {t('pricing.yearly.price')} <span className="text-base font-semibold text-neutral-400">{t('pricing.yearly.period')}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-300 flex-grow">
                {t('pricing.yearly.features').map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <Link href="/payment?plan=yearly" className="block mt-6 px-4 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-600 text-center">
                {t('pricing.yearly.button')}
              </Link>
              <p className="mt-2 text-xs text-neutral-400">{t('pricing.yearly.note')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
