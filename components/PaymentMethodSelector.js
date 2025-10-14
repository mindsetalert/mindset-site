import React from 'react';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange, plan }) => {
  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Carte de crédit',
      description: 'Visa, Mastercard, Amex, Apple Pay, Google Pay',
      icon: '💳',
      component: StripePayment
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Payer avec votre compte PayPal',
      icon: '💙',
      component: PayPalPayment
    }
  ];

  return (
    <div className="space-y-4">
      {/* Sélection de la méthode */}
      <div className="grid gap-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`rounded-xl border p-4 cursor-pointer transition-all ${
              selectedMethod === method.id
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{method.icon}</span>
              <div>
                <h3 className="font-semibold">{method.name}</h3>
                <p className="text-sm text-neutral-400">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Composant de paiement sélectionné */}
      {selectedMethod && (
        <div className="mt-6">
          {(() => {
            const method = paymentMethods.find(m => m.id === selectedMethod);
            const PaymentComponent = method.component;
            return <PaymentComponent plan={plan} />;
          })()}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;





