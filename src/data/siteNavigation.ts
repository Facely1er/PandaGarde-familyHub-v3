import type { LucideIcon } from 'lucide-react';

import {
  Activity,
  BookOpen,
  Compass,
  Fingerprint,
  FileText,
  HeartHandshake,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  Library,
  ListChecks,
  Mail,
  Newspaper,
  Scale,
  Shield,
  Cookie,
  Accessibility,
} from 'lucide-react';



export type SiteNavItem = {

  id: string;

  label: string;

  href: string;

  icon: LucideIcon;

};

/** Consolidated guides, stories, and printables (marketing shell). */
export const FOR_FAMILIES_PATH = '/for-families';

/** Header, page H1, and footer hub link — one label for `/for-families`. */
export const GUIDES_STORIES_NAV_LABEL = 'Guides & stories';

/** @deprecated Use GUIDES_STORIES_NAV_LABEL */
export const FOR_FAMILIES_NAV_LABEL = GUIDES_STORIES_NAV_LABEL;

/** Header / page titles — primary entry points. */
export const FOOTPRINT_REVIEW_NAV_LABEL = 'Footprint Review';

/** Footer column headings — broader than header labels (mini sitemap, not duplicates). */
export const FOOTER_COLUMN_REVIEW_WORKFLOW = 'Review workflow';
export const FOOTER_COLUMN_FAMILY_CONTENT = 'For Families';
export const FOOTER_COLUMN_HELP_CENTER = 'Help Center';
export const FOOTER_COLUMN_LEGAL = 'Legal';

/** Primary header navigation (desktop + mobile) */

export const primaryNavItems: SiteNavItem[] = [
  { id: 'nav-home', icon: Home, label: 'Home', href: '/' },
  { id: 'nav-how-it-works', icon: Compass, label: 'How It Works', href: '/how-it-works' },
  {
    id: 'nav-footprint',
    icon: Fingerprint,
    label: FOOTPRINT_REVIEW_NAV_LABEL,
    href: '/digital-footprint',
  },
  { id: 'nav-guides-stories', icon: BookOpen, label: GUIDES_STORIES_NAV_LABEL, href: FOR_FAMILIES_PATH },
];

/** Mobile header icons — same order and destinations as desktop primary nav. */
export function buildMobileQuickNavItems(items: SiteNavItem[] = primaryNavItems): SiteNavItem[] {
  return items.map((item) => ({
    ...item,
    id: item.id.replace(/^nav-/, 'mobile-quick-'),
  }));
}

export const mobileQuickNavItems: SiteNavItem[] = buildMobileQuickNavItems();

/** Footprint layer — catalog → review (+ how scores and rights relate). */
export const dfaWorkflowNavItems: SiteNavItem[] = [
  { id: 'dfa-service-catalog', icon: ListChecks, label: 'Service catalog', href: '/service-catalog' },
  { id: 'dfa-footprint', icon: Fingerprint, label: FOOTPRINT_REVIEW_NAV_LABEL, href: '/digital-footprint' },
];

export const footprintReviewLayerLinks: SiteNavItem[] = [
  { id: 'footprint-catalog', icon: ListChecks, label: 'Service catalog', href: '/service-catalog' },
  { id: 'footprint-review', icon: Fingerprint, label: FOOTPRINT_REVIEW_NAV_LABEL, href: '/digital-footprint' },
  { id: 'footprint-scoring', icon: BookOpen, label: 'Scoring methodology', href: '/scoring-methodology' },
  { id: 'footprint-digital-rights', icon: Scale, label: 'Digital privacy rights', href: '/digital-rights' },
];

/**
 * Footer — four columns (family → workflow → help → legal).
 * Column titles differ from header nav labels to avoid duplicate chrome.
 */

export const footerFootprintLinks: SiteNavItem[] = footprintReviewLayerLinks;

/** Hub index, hub, stories, plan, and journal — family-facing only. */
export const footerFamilyLinks: SiteNavItem[] = [
  {
    id: 'footer-guides-stories',
    icon: BookOpen,
    label: GUIDES_STORIES_NAV_LABEL,
    href: FOR_FAMILIES_PATH,
  },
  { id: 'footer-family-hub', icon: LayoutDashboard, label: 'Family Hub', href: '/family-hub' },
  { id: 'footer-stories', icon: Library, label: 'Privacy Panda Stories', href: '/stories' },
  { id: 'footer-family-plan', icon: FileText, label: 'Family privacy plan', href: '/family-privacy-plan' },
];

export type FooterExternalNavItem = SiteNavItem & { external: true };

/** Product orientation first, then help and contact — column title is Help Center. */
export const footerHelpCenterLinks: SiteNavItem[] = [
  { id: 'footer-how-it-works', icon: Compass, label: 'How it works', href: '/how-it-works' },
  { id: 'footer-faq', icon: HelpCircle, label: 'FAQ', href: '/faq' },
  { id: 'footer-support', icon: HeartHandshake, label: 'Support', href: '/support' },
  { id: 'footer-contact', icon: Mail, label: 'Contact', href: '/contact' },
  { id: 'footer-about', icon: Info, label: 'About', href: '/about' },
];

/** @deprecated Use footerHelpCenterLinks */
export const footerSupportLinks: SiteNavItem[] = footerHelpCenterLinks;

/** @deprecated Use footerFamilyLinks */
export const footerResourcesLinks: SiteNavItem[] = footerFamilyLinks;

/** @deprecated Use footerHelpCenterLinks */
export const footerHelpLinks: SiteNavItem[] = footerHelpCenterLinks;

export const JOURNAL_URL = 'https://journal.pandagarde.com';

export const footerJournalLink: FooterExternalNavItem = {
  id: 'footer-journal',
  icon: Newspaper,
  label: 'Digital Bamboo Journal',
  href: JOURNAL_URL,
  external: true,
};

export const footerLegalLinks: SiteNavItem[] = [
  { id: 'footer-privacy-policy', icon: Shield, label: 'Privacy', href: '/privacy' },
  { id: 'footer-terms', icon: FileText, label: 'Terms', href: '/terms' },
  { id: 'footer-cookies', icon: Cookie, label: 'Cookies', href: '/cookies' },
  { id: 'footer-accessibility', icon: Accessibility, label: 'Accessibility', href: '/accessibility' },
];

export type FooterColumnConfig = {
  id: string;
  title: string;
  items: SiteNavItem[];
  externalItems?: FooterExternalNavItem[];
};

export const footerColumns: FooterColumnConfig[] = [
  {
    id: 'family',
    title: FOOTER_COLUMN_FAMILY_CONTENT,
    items: footerFamilyLinks,
    externalItems: [footerJournalLink],
  },
  { id: 'footprint', title: FOOTER_COLUMN_REVIEW_WORKFLOW, items: footerFootprintLinks },
  { id: 'help-center', title: FOOTER_COLUMN_HELP_CENTER, items: footerHelpCenterLinks },
  { id: 'legal', title: FOOTER_COLUMN_LEGAL, items: footerLegalLinks },
];

/** @deprecated Use footerFootprintLinks */
export const footerExploreLinks: SiteNavItem[] = footerFootprintLinks;

/** @deprecated Use footerFootprintLinks */
export const footerDfaLinks: SiteNavItem[] = dfaWorkflowNavItems;



/** Mobile menu — secondary links (reference + guides) */

export const mobileSecondaryNavItems: SiteNavItem[] = [
  { id: 'mobile-nav-catalog', icon: ListChecks, label: 'Service catalog', href: '/service-catalog' },
  { id: 'mobile-nav-faq', icon: HelpCircle, label: 'FAQ', href: '/faq' },
];



/** Routes that exist only as legacy files or old links — redirect targets */

export const legacyRouteRedirects: Record<string, string> = {

  '/parent-landing': '/service-catalog',

  '/overview': '/how-it-works',

  '/features': '/how-it-works',

  '/interactive-story': '/stories/privacy-panda-and-the-digital-bamboo-forest',

  '/mission-hub': '/family-hub',

  '/parent-resources': FOR_FAMILIES_PATH,
  '/privacy-tools': FOR_FAMILIES_PATH,
  '/parent-toolkit': FOR_FAMILIES_PATH,
  '/resources': FOR_FAMILIES_PATH,
  '/quick-start': '/how-it-works',
  '/educator-tools': '/how-it-works',
  '/classroom-activities': '/how-it-works',
};


