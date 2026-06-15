/** Shared UX copy — PandaGarde areas are independent except catalog → footprint. */

export const FOOTPRINT_CATALOG_NOTE =
  'Footprint review uses the apps you list in the service catalog. Stories, guides, and Family Hub work on their own—you do not need to finish a review first.';

export const INDEPENDENT_AREAS_LEAD =
  'Pick what fits today: a story with your child, a parent guide, missions in Family Hub, or a footprint review when you want a household snapshot.';

/** Page hero for /for-families — family-facing, no workflow disclaimers. */
export const GUIDES_STORIES_PAGE_LEAD =
  'Read with your kids, use parent guides and printables, or open Family Hub for practice—all at your own pace.';

/** Plain-language lead for quick-start and overview pages. */
export const QUICK_START_LEAD =
  'Got 5 minutes? Read a story with your child. Got 15? List the apps your family uses. Everything else can wait until you are ready.';

/** Three-step parent path — one clear action per step, no jargon. */
export const PARENT_PATH_STEPS = [
  {
    step: 1,
    title: 'Read a story together',
    description: 'Open Privacy Panda and read one scene with your child. No setup or account needed.',
    link: '/stories',
    cta: 'Browse stories',
  },
  {
    step: 2,
    title: 'List the apps your family uses',
    description: 'Tap the apps and websites your kids use. This powers your footprint review scores.',
    link: '/service-catalog',
    cta: 'Add your apps',
  },
  {
    step: 3,
    title: 'See your footprint review',
    description: 'Find out which apps collect the most data from your list. Green scores are lower risk; red scores are worth a family talk.',
    link: '/digital-footprint',
    cta: 'See your scores',
    requiresApps: true,
  },
  {
    step: 4,
    title: 'Practice in Family Hub',
    description: 'Do short privacy missions together. Progress saves on this phone or computer—no account required.',
    link: '/family-hub',
    cta: 'Open Family Hub',
  },
] as const;

export { WEBSITE_HUB_BOUNDARY_LEAD } from './websiteHubBoundary';
