import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';
import { PRICES } from '../lib/stripe';
import { PAYPAL_PLANS } from '../lib/paypal';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { supabase } from '../lib/supabase';

export default function PaymentPage() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user ?? null;
      setUser(u);
    };
    check();
  }, []);

  const plans = {
    monthly: {
      ...PRICES.monthly,
      ...PAYPAL_PLANS.monthly,
      title: t('pricing.monthly.title'),
      description: t('pricing.monthly.description'),
      features: t('pricing.monthly.features')
    },
    yearly: {
      ...PRICES.yearly,
      ...PAYPAL_PLANS.yearly,
      title: t('pricing.yearly.title'),
      description: t('pricing.yearly.description'),
      features: t('pricing.yearly.features'),
      discount: t('pricing.yearly.discount')
    }
  };

  const currentPlan = plans[selectedPlan];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="mb-4">
            <Link href="/" className="text-neutral-400 hover:text-neutral-100 text-sm">
              ← Retour à l&apos;accueil
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-amber-400">Choisir votre plan</h1>
          <p className="mt-2 text-neutral-300">Sélectionnez le plan qui vous convient et votre méthode de paiement</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sélection du plan */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">1. Choisir votre plan</h2>
            
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-2xl border p-6 cursor-pointer transition-all ${
                  selectedPlan === key
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{plan.title}</h3>
                  {plan.discount && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-700/20 text-green-400">
                      {plan.discount}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-neutral-300 mb-4">{plan.description}</p>
                
                <div className="text-3xl font-bold text-amber-400 mb-4">
                  ${plan.price} <span className="text-base font-normal text-neutral-400">USD /{plan.interval === 'month' ? 'mois' : 'an'}</span>
                </div>
                
                <ul className="space-y-2 text-sm text-neutral-300">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sélection de la méthode de paiement */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">2. Méthode de paiement</h2>
            
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onMethodChange={(id) => {
                if (!user) {
                  const next = encodeURIComponent('/payment');
                  if (typeof window !== 'undefined') {
                    window.location.href = `/login?next=${next}`;
                  }
                  return;
                }
                setSelectedMethod(id);
              }}
              plan={currentPlan}
            />
          </div>
        </div>
        {!user && (
          <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 text-sm text-neutral-300">
            Pour finaliser le paiement, veuillez vous connecter: <Link className="text-amber-400" href="/login?next=/payment">Se connecter</Link> ou <Link className="text-amber-400" href="/register?next=/payment">Créer un compte</Link>.
          </div>
        )}
      </div>
    </div>
  );
}

