import { Platform } from 'react-native';

/**
 * Subscriptions and one-time unlocks through RevenueCat, shared by every app. Each app passes its
 * own products and entitlement id.
 *
 * Real billing requires a native build and a key. Missing configuration fails closed.
 * Simulated purchases require an explicit development-only preview flag.
 */
export type Period = 'week' | 'month' | 'year' | 'lifetime';

export interface ProductDef {
  id: string;
  period: Period;
  usd: number;
  label: string;
}

export interface PurchasesConfig {
  /** RevenueCat entitlement identifier that unlocks the paid features. */
  entitlement: string;
  products: readonly ProductDef[];
  keys?: { ios?: string; android?: string };
  /** Explicit development-only preview. Never enabled by missing credentials. */
  preview?: boolean;
}

export interface Entitlement {
  active: boolean;
  productId: string | null;
  /** End of the current paid period (ISO); null for lifetime or free. */
  expiresAt: string | null;
  source: 'none' | 'store' | 'mock';
}

export const FREE: Entitlement = { active: false, productId: null, expiresAt: null, source: 'none' };

const PERIOD_MS: Record<Period, number | null> = { week: 7 * 86_400_000, month: 30 * 86_400_000, year: 365 * 86_400_000, lifetime: null };

export function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** Store-safe price copy: a yearly plan is stated as one charge, never as a monthly figure. */
export function billingCopy(p: ProductDef): string {
  switch (p.period) {
    case 'week':
      return `${formatUsd(p.usd)} billed every week`;
    case 'month':
      return `${formatUsd(p.usd)} billed every month`;
    case 'year':
      return `${formatUsd(p.usd)} billed once a year`;
    default:
      return `${formatUsd(p.usd)} once, yours to keep`;
  }
}

/** Re-check an entitlement at `nowIso`; expiry is enforced here so it also works offline. */
export function evaluate(e: Entitlement, nowIso: string): Entitlement {
  if (!e.active || !e.productId) return { ...FREE };
  const ok = e.expiresAt == null || Date.parse(e.expiresAt) > Date.parse(nowIso);
  return ok ? { ...e, active: true } : { ...FREE };
}

export function mockEntitlement(p: ProductDef, nowIso: string): Entitlement {
  const ms = PERIOD_MS[p.period];
  return { active: true, productId: p.id, expiresAt: ms == null ? null : new Date(Date.parse(nowIso) + ms).toISOString(), source: 'mock' };
}

export type PurchaseResult = { ok: true; entitlement: Entitlement; simulated: boolean } | { ok: false; error: string; cancelled?: boolean };

type PurchasesModule = typeof import('react-native-purchases');
type ActiveMap = Record<string, { expirationDate?: string | null; productIdentifier?: string } | undefined>;

export function createPurchases(config: PurchasesConfig) {
  const key = Platform.OS === 'ios' ? config.keys?.ios : Platform.OS === 'android' ? config.keys?.android : undefined;
  const simulated = config.preview === true && typeof __DEV__ !== 'undefined' && __DEV__;
  const enabled = !simulated && Platform.OS !== 'web' && Boolean(key);

  async function rc(): Promise<PurchasesModule['default'] | null> {
    if (!enabled) return null;
    const mod = (await import('react-native-purchases')) as PurchasesModule;
    return mod.default;
  }

  function parse(active: ActiveMap): Entitlement {
    const e = active[config.entitlement];
    if (!e) return { ...FREE };
    return { active: true, productId: e.productIdentifier ?? null, expiresAt: e.expirationDate ?? null, source: 'store' };
  }

  return {
    enabled,
    simulated,
    products: config.products,

    async prices(): Promise<Record<string, string>> {
      const Purchases = await rc();
      if (!Purchases) return {};
      const offerings = await Purchases.getOfferings();
      return Object.fromEntries((offerings.current?.availablePackages ?? []).map(p => [p.product.identifier, p.product.priceString]));
    },

    async subscribe(listener: (e: Entitlement) => void): Promise<() => void> {
      const Purchases = await rc();
      if (!Purchases) return () => undefined;
      const handler = (info: { entitlements: { active: ActiveMap } }) => listener(parse(info.entitlements.active));
      Purchases.addCustomerInfoUpdateListener(handler);
      return () => Purchases.removeCustomerInfoUpdateListener(handler);
    },

    async configure(appUserId?: string): Promise<void> {
      const Purchases = await rc();
      if (!Purchases) return;
      Purchases.configure({ apiKey: key!, appUserID: appUserId });
    },

    /** Null in mock mode, where local state is the source of truth. */
    async current(): Promise<Entitlement | null> {
      const Purchases = await rc();
      if (!Purchases) return null;
      const info = await Purchases.getCustomerInfo();
      return parse(info.entitlements.active as never);
    },

    async purchase(productId: string): Promise<PurchaseResult> {
      const product = config.products.find((p) => p.id === productId);
      if (!product) return { ok: false, error: 'Unknown product' };
      try {
        const Purchases = await rc();
        if (!Purchases) return simulated
          ? { ok: true, entitlement: mockEntitlement(product, new Date().toISOString()), simulated: true }
          : { ok: false, error: 'Purchases are not configured in this build.' };
        const offerings = await Purchases.getOfferings();
        const pkg = offerings.current?.availablePackages.find((p) => p.product.identifier === productId);
        if (!pkg) return { ok: false, error: 'This plan is not available right now' };
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        return { ok: true, entitlement: parse(customerInfo.entitlements.active as never), simulated: false };
      } catch (e) {
        const err = e as { userCancelled?: boolean; message?: string };
        return { ok: false, error: err.userCancelled ? 'cancelled' : err.message ?? 'Purchase failed', cancelled: err.userCancelled };
      }
    },

    /** Null in mock mode: there is no store account to restore from. */
    async restore(): Promise<Entitlement | null> {
      const Purchases = await rc();
      if (!Purchases) return null;
      const info = await Purchases.restorePurchases();
      return parse(info.entitlements.active as never);
    },
  };
}

export type Purchases = ReturnType<typeof createPurchases>;
