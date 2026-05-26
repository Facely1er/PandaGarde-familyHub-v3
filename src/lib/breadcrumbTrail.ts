import { getNewsletterById, isNewsletterReservedSegment } from '../data/newsletters';
import { getStoryBySlug } from '../data/stories';
import {
  FOR_FAMILIES_PATH,
  FOOTPRINT_REVIEW_NAV_LABEL,
  GUIDES_STORIES_NAV_LABEL,
  LEGAL_HUB_LABEL,
  LEGAL_HUB_PATH,
} from '../data/siteNavigation';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

const PRINTABLES_HUB_PATH = '/downloads/coloring-sheets';
const PRINTABLES_HUB_LABEL = 'Printables & downloads';

const FOOTPRINT_WORKFLOW_PATHS = new Set([
  '/service-catalog',
  '/digital-footprint',
  '/footprint',
  '/scoring-methodology',
  '/digital-rights',
]);

const LEGAL_PAGE_PATHS = new Set([
  '/privacy',
  '/terms',
  '/cookies',
  '/accessibility',
  '/parental-consent',
  '/parental-consent/pending',
]);

const LEGACY_PRINTABLE_PATHS = new Set([
  '/coloring-sheets',
  '/safety-posters',
  '/certificates',
  '/family-agreement',
]);

/** Leaf labels for known routes (current page). */
export const BREADCRUMB_PAGE_LABELS: Record<string, string> = {
  '/about': 'About',
  '/contact': 'Contact',
  '/faq': 'FAQ',
  '/how-it-works': 'How it works',
  '/features': 'How it works',
  '/overview': 'Overview',
  '/quick-start': 'Quick start',
  '/scoring-methodology': 'Scoring methodology',
  '/implementation': 'Implementation',
  '/implementation-guide': 'Implementation guide',
  '/get-started': 'DFA journey',
  [FOR_FAMILIES_PATH]: GUIDES_STORIES_NAV_LABEL,
  '/resources': GUIDES_STORIES_NAV_LABEL,
  '/parent-resources': GUIDES_STORIES_NAV_LABEL,
  '/parent-toolkit': 'Toolkit',
  '/privacy-tools': 'Privacy tools',
  '/newsletter': 'Newsletter',
  '/newsletter/archive': 'Archive',
  '/newsletter/unsubscribe': 'Unsubscribe',
  '/support': 'Support',
  '/pilot': 'Pilot program',
  '/join-pilot': 'Join pilot',
  '/family-hub': 'Family Hub',
  '/family-hub/activities': 'Privacy missions',
  '/profile': 'Profile',
  '/stories': 'Privacy Panda Stories',
  '/story': 'Privacy Panda Story',
  '/privacy-panda': 'Privacy Panda',
  '/activity-book': 'Activity book',
  '/interactive-story': 'Interactive story',
  '/privacy-explorers': 'Privacy explorers',
  '/privacy-handbook': 'Privacy handbook',
  '/teen-handbook': 'Teen handbook',
  '/digital-citizenship': 'Digital citizenship',
  '/digital-rights': 'Digital privacy rights',
  '/age-groups': 'Age groups',
  '/educator-tools': 'Educator tools',
  '/classroom-activities': 'Classroom activities',
  '/service-catalog': 'Service catalog',
  '/safety-alerts': 'Safety alerts',
  '/alerts': 'Safety alerts',
  '/digital-footprint': FOOTPRINT_REVIEW_NAV_LABEL,
  '/footprint': FOOTPRINT_REVIEW_NAV_LABEL,
  '/privacy-assessment': 'Privacy assessment',
  '/quick-assessment': 'Quick assessment',
  '/assessment': 'Privacy assessment',
  '/assessment-history': 'Assessment history',
  '/assessment/history': 'Assessment history',
  '/privacy-goals': 'Privacy goals',
  '/goals': 'Privacy goals',
  '/community': 'Community',
  '/community/stories': 'Success stories',
  '/community/success-stories': 'Success stories',
  '/community/resources': 'Shared resources',
  '/community/forum': 'Forum',
  '/community/privacy-tips': 'Privacy tips',
  '/parental-consent': 'Parental consent',
  '/parental-consent/pending': 'Consent pending',
  '/privacy': 'Privacy policy',
  '/terms': 'Terms of service',
  '/cookies': 'Cookie policy',
  '/accessibility': 'Accessibility',
  [LEGAL_HUB_PATH]: LEGAL_HUB_LABEL,
  '/downloads': 'Downloads',
  '/downloads/coloring-sheets': 'Coloring sheets',
  '/coloring-sheets': 'Coloring sheets',
  '/downloads/safety-posters': 'Safety posters',
  '/safety-posters': 'Safety posters',
  '/downloads/certificates': 'Certificates',
  '/certificates': 'Certificates',
  '/downloads/family-agreement': 'Family agreement',
  '/family-agreement': 'Family agreement',
  '/downloads/worksheets': 'Worksheets',
  '/downloads/coloring-sheets/guide': 'Coloring sheets guide',
  '/downloads/safety-posters/guide': 'Safety posters guide',
  '/downloads/certificates/guide': 'Certificates guide',
  '/downloads/family-agreement/guide': 'Family agreement guide',
  '/guides/device-setup': 'Device setup',
  '/guides/app-selection': 'App selection',
  '/guides/modeling-behavior': 'Modeling behavior',
  '/guides/privacy-concerns': 'Privacy concerns',
  '/guides/family-privacy': 'Family privacy guide',
  '/guides/emergency-safety': 'Emergency safety guide',
  '/guides/age-specific': 'Age-specific guide',
  '/guides/conversation-approaches': 'Conversation approaches',
  '/guides/safety-net': 'Safety net',
  '/guides/age-specific-privacy': 'Age-specific privacy',
  '/family-privacy-plan': 'Family privacy plan',
  '/guides/family-privacy-plan': 'Family privacy plan',
  '/activities': 'Activities',
  '/activities/privacy-learning-kit': 'Privacy learning kit',
};

function formatSegment(segment: string): string {
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

function normalizePathname(pathname: string): string {
  return pathname.split('?')[0].split('#')[0];
}

function hubAncestor(): BreadcrumbItem {
  return { label: GUIDES_STORIES_NAV_LABEL, path: FOR_FAMILIES_PATH };
}

function footprintAncestor(): BreadcrumbItem {
  return { label: FOOTPRINT_REVIEW_NAV_LABEL, path: '/digital-footprint' };
}

function printablesAncestor(): BreadcrumbItem {
  return { label: PRINTABLES_HUB_LABEL, path: PRINTABLES_HUB_PATH };
}

function legalAncestor(): BreadcrumbItem {
  return { label: LEGAL_HUB_LABEL, path: LEGAL_HUB_PATH };
}

function resolveLegalAncestors(pathname: string): BreadcrumbItem[] {
  if (pathname === LEGAL_HUB_PATH) {
    return [];
  }

  const ancestors: BreadcrumbItem[] = [legalAncestor()];

  if (pathname.startsWith('/parental-consent/') && pathname !== '/parental-consent') {
    ancestors.push({
      label: BREADCRUMB_PAGE_LABELS['/parental-consent'],
      path: '/parental-consent',
    });
  }

  return ancestors;
}

function resolvePrintableAncestors(pathname: string): BreadcrumbItem[] {
  const ancestors: BreadcrumbItem[] = [hubAncestor()];

  const guideMatch = pathname.match(/^\/downloads\/([^/]+)\/guide$/);
  if (guideMatch) {
    const resourcePath = `/downloads/${guideMatch[1]}`;
    if (resourcePath !== PRINTABLES_HUB_PATH) {
      ancestors.push(printablesAncestor());
    }
    const resourceLabel = BREADCRUMB_PAGE_LABELS[resourcePath];
    if (resourceLabel) {
      ancestors.push({ label: resourceLabel, path: resourcePath });
    }
    return ancestors;
  }

  if (pathname.startsWith('/downloads/') || LEGACY_PRINTABLE_PATHS.has(pathname)) {
    if (pathname !== PRINTABLES_HUB_PATH && pathname !== '/downloads') {
      ancestors.push(printablesAncestor());
    }
    return ancestors;
  }

  return ancestors;
}

function resolveAncestors(pathname: string): BreadcrumbItem[] {
  if (pathname === '/' || pathname === FOR_FAMILIES_PATH) {
    return [];
  }

  if (pathname.startsWith('/stories')) {
    const ancestors = [hubAncestor()];
    if (pathname !== '/stories') {
      ancestors.push({ label: BREADCRUMB_PAGE_LABELS['/stories'], path: '/stories' });
    }
    return ancestors;
  }

  if (
    pathname.startsWith('/guides/') ||
    pathname === '/family-privacy-plan' ||
    pathname === '/activities/privacy-learning-kit'
  ) {
    return [hubAncestor()];
  }

  if (
    pathname.startsWith('/downloads') ||
    LEGACY_PRINTABLE_PATHS.has(pathname)
  ) {
    return resolvePrintableAncestors(pathname);
  }

  if (FOOTPRINT_WORKFLOW_PATHS.has(pathname)) {
    if (pathname === '/digital-footprint' || pathname === '/footprint') {
      return [];
    }
    return [footprintAncestor()];
  }

  if (pathname.startsWith('/family-hub')) {
    if (pathname === '/family-hub') {
      return [];
    }
    return [{ label: BREADCRUMB_PAGE_LABELS['/family-hub'], path: '/family-hub' }];
  }

  if (pathname === LEGAL_HUB_PATH || LEGAL_PAGE_PATHS.has(pathname)) {
    return resolveLegalAncestors(pathname);
  }

  if (pathname.startsWith('/newsletter')) {
    const ancestors: BreadcrumbItem[] = [
      { label: BREADCRUMB_PAGE_LABELS['/newsletter'], path: '/newsletter' },
    ];
    if (pathname === '/newsletter/archive' || pathname === '/newsletter/unsubscribe') {
      return ancestors;
    }
    if (pathname.startsWith('/newsletter/')) {
      const segment = pathname.split('/')[2];
      if (segment && isNewsletterReservedSegment(segment)) {
        return ancestors;
      }
    }
    return ancestors;
  }

  return [];
}

export function resolvePageLabel(pathname: string): string {
  const normalized = normalizePathname(pathname);

  if (BREADCRUMB_PAGE_LABELS[normalized]) {
    return BREADCRUMB_PAGE_LABELS[normalized];
  }

  if (normalized.startsWith('/stories/')) {
    const slug = normalized.split('/')[2];
    return getStoryBySlug(slug)?.title ?? formatSegment(slug);
  }

  if (normalized.startsWith('/newsletter/')) {
    const segment = normalized.split('/')[2];
    if (segment && !isNewsletterReservedSegment(segment)) {
      const issue = getNewsletterById(segment);
      return issue?.title ?? formatSegment(segment);
    }
  }

  const segments = normalized.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  return last ? formatSegment(last) : 'Page';
}

/** Full trail including Home and the current page. */
export function buildBreadcrumbTrail(pathname: string): BreadcrumbItem[] {
  const normalized = normalizePathname(pathname);
  const trail: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

  if (normalized === '/') {
    return trail;
  }

  const ancestors = resolveAncestors(normalized);
  for (const item of ancestors) {
    if (trail[trail.length - 1]?.path !== item.path) {
      trail.push(item);
    }
  }

  const current = { label: resolvePageLabel(normalized), path: normalized };
  if (trail[trail.length - 1]?.path !== current.path) {
    trail.push(current);
  }

  return trail;
}
