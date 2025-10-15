import { loadStripe } from '@stripe/stripe-js';

// Clés Stripe - Remplacez par vos vraies clés
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_...';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Configuration des prix
export const PRICES = {
  monthly: {
    id: 'price_monthly',
    amount: 2999, // $29.99 en centimes
    currency: 'cad',
    interval: 'month',
    name: 'Mensuel'
  },
  yearly: {
    id: 'price_yearly', 
    amount: 32390, // $323.90 en centimes
    currency: 'cad',
    interval: 'year',
    name: 'Annuel'
  }
};

export default stripePublishableKey;






