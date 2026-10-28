import Constants from 'expo-constants';
import { createPurchases, type ProductDef } from '@bestie/core';

/** Free: day counter, logging and buddy pairing. Premium: every check-in, craving talks and patches. */
export const PRODUCTS: ProductDef[] = [
  { id: 'dry_premium_monthly', period: 'month', usd: 4.99, label: 'Monthly' },
  { id: 'dry_premium_yearly', period: 'year', usd: 39.99, label: 'Yearly' },
];

export const purchases = createPurchases({
  entitlement: 'premium',
  preview: __DEV__ && (Constants.appOwnership === 'expo' || process.env.EXPO_PUBLIC_PREVIEW_MODE === 'true'),
  products: PRODUCTS,
  keys: { ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY, android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY },
});
