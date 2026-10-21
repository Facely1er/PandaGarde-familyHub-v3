/**
 * EduSoluce Privacy Portal — data rights requests (access, deletion, opt-out, etc.).
 * Relevant across jurisdictions; Maryland (MODPA) is one applicable framework where it applies.
 */
export const PRIVACY_PORTAL_URL = 'https://portal.edusoluce.com/privacy/data-rights';
export const PRIVACY_PORTAL_OPT_OUT_URL = 'https://portal.edusoluce.com/privacy/data-rights?type=opt_out';

/**
 * EduSoluce for schools — where parents can point their school for school-side
 * privacy work (vendor tracking, data agreements, data rights). Override per deploy.
 */
export const EDUSOLUCE_SCHOOLS_URL: string =
  import.meta.env['VITE_EDUSOLUCE_URL'] || 'https://www.edusoluce.com';
