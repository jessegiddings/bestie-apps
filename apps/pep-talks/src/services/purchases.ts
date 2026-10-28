import { createPurchases, type ProductDef } from '@bestie/core';

/**
 * Free: her first week of mornings, the first talk in every moment, the line of the day and the
 * bracelet. Premium: every morning, every talk, and saving favorites.
 */
export const PRODUCTS: ProductDef[] = [
  { id: 'pep_premium_monthly', period: 'month', usd: 5.99, label: 'Monthly' },
  { id: 'pep_premium_yearly', period: 'year', usd: 39.99, label: 'Yearly' },
];

export const purchases = createPurchases({
  entitlement: 'premium',
  products: PRODUCTS,
  keys: { ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY, android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY },
});
