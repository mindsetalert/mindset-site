// Configuration PayPal
export const PAYPAL_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'your_paypal_client_id',
  currency: 'USD',
  intent: 'subscription',
  vault: true
};

// Configuration des plans PayPal
export const PAYPAL_PLANS = {
  monthly: {
    planId: 'P-XXXXXXXX', // À remplacer par votre vrai plan ID
    name: 'Mindset - Mensuel',
    price: '29.99',
    currency: 'USD',
    interval: 'month'
  },
  yearly: {
    planId: 'P-YYYYYYYY', // À remplacer par votre vrai plan ID  
    name: 'Mindset - Annuel',
    price: '323.90',
    currency: 'USD',
    interval: 'year'
  }
};












