import { FAMILY_HUB_APP_NAME } from '../data/appStoreLinks';

/** localStorage key: user has completed the Family Hub welcome screen */
export const HUB_WELCOMED_KEY = 'pandagarde_hub_welcomed';

/** App Store / shell display name — same as capacitor.config.ts appName */
export const HUB_DISPLAY_NAME = FAMILY_HUB_APP_NAME;

/** Header lockup — two lines beside the logo */
export const HUB_BRAND_LINE_1 = 'PandaGarde';
export const HUB_BRAND_LINE_2 = 'Family Hub';

/** Locked i18n interpolation — product/brand names stay English in every locale */
export const HUB_BRAND_I18N_DEFAULTS = {
  productName: HUB_BRAND_LINE_2,
  brandName: HUB_BRAND_LINE_1,
  displayName: HUB_DISPLAY_NAME,
} as const;

/** Store listing support contact — must match docs/FAMILYHUB_STORE_SUBMIT_CHECKLIST.md */
export const HUB_SUPPORT_EMAIL = 'support@pandagarde.com';

export {
  HUB_ORIGIN_KEY,
  HUB_LAST_MISSION_KEY,
  HUB_STREAK_KEY,
  HUB_LAST_ACTIVE_KEY,
} from '../lib/hubMission';
