import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

const CheckoutForm = ({ plan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer l'email utilisateur côté client via Supabase si dispo
      const resMe = await fetch('/api/hello');
      // Si pas d'API user, on laissera l'email vide et Stripe affichera le champ email

      const email = undefined;

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.interval === 'month' ? 'monthly' : 'yearly', email }),
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js.error || 'Erreur création session');
      window.location.href = js.url;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-neutral-800 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span>Plan sélectionné:</span>
          <span className="font-semibold">{plan.title}</span>
        </div>
        <div className="flex justify-between items-center text-2xl font-bold text-amber-400">
          <span>Total:</span>
          <span>${plan.price} CAD /{plan.interval === 'month' ? 'mois' : 'an'}</span>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 disabled:cursor-not-allowed text-neutral-900 font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        {loading ? 'Redirection…' : `Payer ${plan.price} CAD`}
      </button>
    </div>
  );
};

const StripePayment = ({ plan }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  const handleSuccess = (paymentMethodId) => {
    setPaymentSuccess(true);
    // Ici, vous pourriez rediriger vers une page de succès
    console.log('Paiement réussi:', paymentMethodId);
  };

  const handleError = (error) => {
    setPaymentError(true);
    console.error('Erreur de paiement:', error);
  };

  if (paymentSuccess) {
    return (
      <div className="bg-green-900/20 border border-green-500 p-6 rounded-xl text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-green-400 mb-2">Paiement réussi !</h3>
        <p className="text-neutral-300">Votre abonnement a été activé. Vous recevrez un email de confirmation.</p>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
        <div className="text-4xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">Erreur de paiement</h3>
        <p className="text-neutral-300">Veuillez réessayer ou choisir une autre méthode de paiement.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm plan={plan} />
    </Elements>
  );
};

export default StripePayment;


