import { PARENT_SURFACE_REDIRECTS } from '../../src/data/parentSiteSurface';
import { getPublishedStories } from '../../src/data/stories';
import { newsletterArchive } from '../../src/data/newsletters';
import {
  footerFamilyLinks,
  footerFootprintLinks,
  footerHelpCenterLinks,
  footerLegalLinks,
} from '../../src/data/siteNavigation';
import { allResourceHubLinks } from '../../src/data/resourcesHubLinks';

export function uniquePaths(paths: string[]): string[] {
  return [...new Set(paths.filter(Boolean))];
}

/** Static App.tsx routes that should render in-app content (not external funnel). */
export const STATIC_APP_PATHS: string[] = [
  '/',
  '/about',
  '/digital-rights',
  '/how-it-works',
  '/for-families',
  '/contact',
  '/faq',
  '/newsletter',
  '/newsletter/archive',
  '/newsletter/unsubscribe',
  '/support',
  '/service-catalog',
  '/digital-footprint',
  '/footprint',
  '/privacy-assessment',
  '/quick-assessment',
  '/child-safety-alerts',
  '/scoring-methodology',
  '/parental-consent',
  '/parental-consent/pending',
  '/legal',
  '/privacy',
  '/terms',
  '/cookies',
  '/accessibility',
  '/downloads/coloring-sheets',
  '/coloring-sheets',
  '/downloads/safety-posters',
  '/safety-posters',
  '/downloads/certificates',
  '/certificates',
  '/downloads/family-agreement',
  '/family-agreement',
  '/downloads/coloring-sheets/guide',
  '/downloads/safety-posters/guide',
  '/downloads/certificates/guide',
  '/downloads/family-agreement/guide',
  '/guides/device-setup',
  '/guides/app-selection',
  '/guides/modeling-behavior',
  '/guides/privacy-concerns',
  '/guides/family-privacy',
  '/guides/emergency-safety',
  '/guides/age-specific',
  '/guides/conversation-approaches',
  '/guides/safety-net',
  '/guides/age-specific-privacy',
  '/family-privacy-plan',
  '/guides/family-privacy-plan',
  '/stories',
  '/activities/privacy-learning-kit',
  '/downloads/worksheets',
];

/** In-app Navigate / legacy paths — must not hit NotFoundPage. */
export const REDIRECT_SOURCE_PATHS: string[] = uniquePaths([
  ...Object.keys(PARENT_SURFACE_REDIRECTS),
  '/overview',
  '/features',
  '/mission-hub',
  '/parent-landing',
  '/get-started',
  '/story',
  '/privacy-panda',
  '/story-classic',
  '/dfa-methodology',
  '/methodology',
  '/guides/parental-controls',
  '/guides/device-security',
  '/guides/privacy-settings',
  '/guides/security',
  '/guides/urgent-protection',
  '/guides/practical-privacy',
  '/activities/story',
  '/assessment',
  '/safety-alerts',
  '/alerts',
]);

export const STORY_PATHS: string[] = getPublishedStories().map((s) => `/stories/${s.slug}`);

export const NEWSLETTER_PATHS: string[] = newsletterArchive.map((n) => `/newsletter/${n.id}`);

export const FOOTER_PATHS: string[] = [
  ...footerFamilyLinks,
  ...footerFootprintLinks,
  ...footerHelpCenterLinks,
  ...footerLegalLinks,
].map((item) => item.href.split('#')[0].split('?')[0]);

export const HUB_PATHS: string[] = [
  '/family-hub',
  '/family-hub/welcome',
  '/family-hub/dashboard',
  '/family-hub/journey',
  '/family-hub/kids',
  '/family-hub/activities',
  '/family-hub/settings',
  '/family-hub/profile',
  '/family-hub/certificates',
  '/family-hub/learning',
  '/family-hub/journeys',
  '/family-hub/progress',
  '/family-hub/games',
];

export const HUB_RESOURCE_PATHS: string[] = allResourceHubLinks.map(
  (link) => link.href.split('#')[0].split('?')[0],
);

export const ALL_IN_APP_PATHS = uniquePaths([
  ...STATIC_APP_PATHS,
  ...REDIRECT_SOURCE_PATHS,
  ...STORY_PATHS,
  ...NEWSLETTER_PATHS,
  ...FOOTER_PATHS,
  ...HUB_RESOURCE_PATHS,
]);
