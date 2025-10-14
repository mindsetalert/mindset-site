import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const PayPalPayment = ({ plan }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  const paypalOptions = {
    'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'your_paypal_client_id',
    currency: 'CAD',
    intent: 'subscription',
    vault: true,
  };

  const createOrder = (data, actions) => {
    return actions.subscription.create({
      plan_id: plan.planId, // Vous devrez créer des plans dans PayPal
      application_context: {
        brand_name: 'Mindset - Alert Strategy',
        landing_page: 'BILLING',
        user_action: 'SUBSCRIBE_NOW',
      },
    });
  };

  const onApprove = (data, actions) => {
    return actions.subscription.get().then((details) => {
      console.log('Abonnement PayPal créé:', details);
      setPaymentSuccess(true);
    });
  };

  const onError = (err) => {
    console.error('Erreur PayPal:', err);
    setPaymentError(true);
  };

  if (paymentSuccess) {
    return (
      <div className="bg-green-900/20 border border-green-500 p-6 rounded-xl text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-green-400 mb-2">Paiement PayPal réussi !</h3>
        <p className="text-neutral-300">Votre abonnement a été activé. Vous recevrez un email de confirmation.</p>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
        <div className="text-4xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">Erreur de paiement PayPal</h3>
        <p className="text-neutral-300">Veuillez réessayer ou choisir une autre méthode de paiement.</p>
      </div>
    );
  }

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

      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'subscribe',
            height: 45,
          }}
        />
      </PayPalScriptProvider>

      <button 
        className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold py-4 px-6 rounded-xl transition-colors"
        onClick={() => {
          // Simuler un paiement PayPal (pour le test)
          console.log('Paiement PayPal simulé pour:', plan);
          alert(`Paiement PayPal de ${plan.price} CAD simulé avec succès !`);
          setPaymentSuccess(true);
        }}
      >
        Payer {plan.price} CAD
      </button>

      <p className="text-xs text-neutral-400 text-center">
        En cliquant sur &quot;Payer&quot;, vous acceptez les conditions d&apos;utilisation de PayPal.
      </p>
    </div>
  );
};

export default PayPalPayment;
