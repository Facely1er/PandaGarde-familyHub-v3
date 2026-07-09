/**
 * Premium entitlement — separate from DFA (footprint review stays free).
 * Stored locally until subscription / store billing is wired.
 */

export const PREMIUM_ENTITLEMENT_STORAGE_KEY = 'pandagarde_premium_entitlement';

/** Pilot unlock codes — replace with server validation when billing ships. */
const PILOT_UNLOCK_CODES = new Set(['PANDA-PILOT-2026', 'FAMILYHUB-PREMIUM']);

export type PremiumSource = 'pilot-code' | 'subscription' | 'manual';

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

export const isPremiumActive = (): boolean => loadPremiumEntitlement().active;

export const unlockPremiumWithCode = (code: string): { success: boolean; error?: string } => {
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

/** Display pricing for marketing site — not shown in Family Hub v1 store build (no IAP). */
export const PREMIUM_PRICING_LABEL = '$4.99/month';
