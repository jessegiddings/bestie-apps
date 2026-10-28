import { createPurchases, type ProductDef } from '@bestie/core';

/** Free: the Family deck in every game. VIP Pass: the Friends deck and every deck after it. */
export const PRODUCTS: ProductDef[] = [
  { id: 'party_vip_monthly', period: 'month', usd: 2.99, label: 'Monthly' },
  { id: 'party_vip_lifetime', period: 'lifetime', usd: 14.99, label: 'Forever' },
];

export const purchases = createPurchases({
  entitlement: 'vip',
  products: PRODUCTS,
  keys: { ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY, android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY },
});
