import Stripe from 'stripe';
import env from './env';

let client: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!env.stripeConfigured) {
    throw new Error('Stripe is not configured (STRIPE_SECRET_KEY is missing)');
  }
  if (!client) {
    client = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }
  return client;
};

export default getStripe;
