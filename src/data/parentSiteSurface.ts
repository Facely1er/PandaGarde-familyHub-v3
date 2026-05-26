/**
 * What general parents should see on the marketing site.
 * Routes listed in PARENT_SURFACE_REDIRECTS stay implemented but redirect
 * so bookmarks/old links do not land on confusing hubs or demos.
 */

import { HUB_MISSIONS_PATH } from './websiteHubBoundary';

/** Direct visits redirect here (pathname → target) */
export const PARENT_SURFACE_REDIRECTS: Record<string, string> = {
  // Redundant link hubs (loop or duplicate indexes)
  '/resources': '/for-families',
  '/privacy-tools': '/for-families',
  '/parent-toolkit': '/for-families',
  '/parent-resources': '/for-families',
  '/toolkit': '/for-families',

  // Legacy story & resource entry points
  '/interactive-story': '/stories/privacy-panda-and-the-digital-bamboo-forest',
  '/worksheets': '/downloads/worksheets',

  // Interactive missions live in Family Hub only (website keeps stories, guides, printables)
  '/activities': HUB_MISSIONS_PATH,
  '/activity-book': HUB_MISSIONS_PATH,
  '/privacy-handbook': HUB_MISSIONS_PATH,
  '/privacy-explorers': HUB_MISSIONS_PATH,
  '/teen-handbook': HUB_MISSIONS_PATH,
  '/ages-5-8': HUB_MISSIONS_PATH,
  '/ages-9-12': HUB_MISSIONS_PATH,
  '/ages-13-17': HUB_MISSIONS_PATH,
  '/guides/privacy-basics': HUB_MISSIONS_PATH,
  '/guides/social-media-privacy': HUB_MISSIONS_PATH,

  // Educator / classroom (not default parent audience)
  '/quick-start': '/how-it-works',
  '/educator-tools': '/how-it-works',
  '/classroom-activities': '/how-it-works',
  '/digital-citizenship': '/how-it-works',

  // Device-local demos (CONTENT_TRUTH §5)
  '/community': '/how-it-works',
  '/community/forum': '/how-it-works',
  '/community/privacy-tips': '/how-it-works',
  '/community/stories': '/how-it-works',
  '/community/success-stories': '/how-it-works',
  '/community/resources': '/how-it-works',

  // Assessment history (formal assessment on SocialCaution)
  '/assessment-history': '/for-families',
  '/assessment/history': '/for-families',

  // Implementation / pilot / meta marketing
  '/implementation': '/how-it-works',
  '/implementation-guide': '/how-it-works',
  '/pilot': '/contact',
  '/join-pilot': '/contact',
  '/app-features': '/how-it-works',
  '/app-store-review': '/how-it-works',
  '/age-groups': '/how-it-works',

  // Secondary goals index (low value vs plan + assessment)
  '/privacy-goals': '/family-privacy-plan',
  '/goals': '/family-privacy-plan',
};

/** For audits and docs — not used for redirects */
export const PARENT_CORE_PATH = [
  '/',
  '/how-it-works',
  '/service-catalog',
  '/digital-footprint',
  '/for-families',
  '/family-hub',
  '/stories',
  '/guides/family-privacy',
  '/guides/device-setup',
  '/family-privacy-plan',
  '/scoring-methodology',
  '/faq',
  '/contact',
] as const;

export const DEPRIORITIZED_FOR_GENERAL_PARENTS = [
  'Safety alerts and privacy assessment (SocialCaution — not on PandaGarde)',
  'Privacy tools (link index only — redirects to Guides & stories hub)',
  'Toolkit (shortcut cards — redirects to Guides & stories hub)',
  'Quick Start, Educator Tools, Classroom Activities',
  'All /community/* (device-local demos)',
  'Privacy Goals, Quick Assessment, Assessment History',
  'Implementation / Pilot / App store review pages',
  'Digital Citizenship, Age groups hub',
  'Digital privacy rights (law modules — optional; not in main nav)',
] as const;
