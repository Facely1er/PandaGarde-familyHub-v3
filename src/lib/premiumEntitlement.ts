/**
 * Premium entitlement — separate from DFA (footprint review stays free).
 * Stored locally until one-time store IAP / receipt validation is wired.
 */

import { Capacitor } from '@capacitor/core';

export const PREMIUM_ENTITLEMENT_STORAGE_KEY = 'pandagarde_premium_entitlement';

/** Set at build time for Capacitor store binaries — strips pilot codes from the bundle. */
const PREMIUM_COMMERCE_DISABLED_AT_BUILD =
  import.meta.env.VITE_DISABLE_PREMIUM_COMMERCE === 'true';

/** Pilot unlock codes — web Hub only; empty in native store builds (Guideline 3.1.1). */
const PILOT_UNLOCK_CODES = PREMIUM_COMMERCE_DISABLED_AT_BUILD
  ? new Set<string>()
  : new Set(['PANDA-PILOT-2026', 'FAMILYHUB-PREMIUM']);

export type PremiumSource = 'pilot-code' | 'purchase' | 'manual';

export interface PremiumEntitlement {
  active: boolean;
  source?: PremiumSource;
  unlockedAt?: string;
}

export const DEFAULT_PREMIUM_ENTITLEMENT: PremiumEntitlement = { active: false };

export const loadPremiumEntitlement = (): PremiumEntitlement => {
  if (typeof window === 'undefined') {
    return DEFAULT_PREMIUM_ENTITLEMENT;
  }
  try {
    const raw = window.localStorage.getItem(PREMIUM_ENTITLEMENT_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PREMIUM_ENTITLEMENT;
    }
    const parsed = JSON.parse(raw) as PremiumEntitlement;
    return parsed?.active ? parsed : DEFAULT_PREMIUM_ENTITLEMENT;
  } catch {
    return DEFAULT_PREMIUM_ENTITLEMENT;
  }
};

export const savePremiumEntitlement = (entitlement: PremiumEntitlement): void => {
  if (typeof window === 'undefined') {
    return;
  }
  if (entitlement.active) {
    window.localStorage.setItem(PREMIUM_ENTITLEMENT_STORAGE_KEY, JSON.stringify(entitlement));
  } else {
    window.localStorage.removeItem(PREMIUM_ENTITLEMENT_STORAGE_KEY);
  }
};

/**
 * Pilot codes and premium upsell are web-only until StoreKit / Play Billing ships.
 * Native store builds must not expose alternate unlock paths (App Store Guideline 3.1.1).
 */
export const isPremiumCommerceAvailable = (): boolean => {
  if (PREMIUM_COMMERCE_DISABLED_AT_BUILD) {
    return false;
  }
  return !Capacitor.isNativePlatform();
};

/** Drop stale premium flags on native — e.g. after upgrading from a rejected build. */
export const purgeStalePremiumCommerceState = (): void => {
  if (!isPremiumCommerceAvailable()) {
    clearPremiumEntitlement();
  }
};

export const isPremiumActive = (): boolean => {
  if (!isPremiumCommerceAvailable()) {
    return false;
  }
  return loadPremiumEntitlement().active;
};

export const unlockPremiumWithCode = (code: string): { success: boolean; error?: string } => {
  if (!isPremiumCommerceAvailable()) {
    return { success: false, error: 'Premium unlock is not available in the app.' };
  }
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { success: false, error: 'Enter an unlock code.' };
  }
  if (!PILOT_UNLOCK_CODES.has(normalized)) {
    return { success: false, error: 'That code is not valid. Check your email or contact support.' };
  }
  savePremiumEntitlement({
    active: true,
    source: 'pilot-code',
    unlockedAt: new Date().toISOString(),
  });
  return { success: true };
};

export const clearPremiumEntitlement = (): void => {
  savePremiumEntitlement(DEFAULT_PREMIUM_ENTITLEMENT);
};

/** Display pricing for marketing site — one-time unlock, not a subscription. */
export const PREMIUM_PRICING_LABEL = '$9.99 one-time';
