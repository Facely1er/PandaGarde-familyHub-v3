/** Shared UX copy — PandaGarde areas are independent except catalog → footprint. */

export const FOOTPRINT_CATALOG_NOTE =
  'Footprint review uses the apps you list in the service catalog. Stories, guides, and Family Hub work on their own—you do not need to finish a review first.';

export const INDEPENDENT_AREAS_LEAD =
  'Pick what fits today: the Family Snapshot for a quick overview, a story with your child, a parent guide, Family Hub missions, or Footprint Review after you list apps in the catalog.';

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
    title: 'See the big picture',
    description: 'Tick the kinds of apps your child uses. Two minutes, no app names — then you’ll know where to start.',
    link: '/big-picture',
    cta: 'Start',
  },
  {
    step: 2,
    title: 'Name your family’s apps',
    description: 'Tap the apps your child uses. Your action plan is built from this list.',
    link: '/service-catalog',
    cta: 'Add your apps',
  },
  {
    step: 3,
    title: 'Get your action plan',
    description: 'For each app: what to know and what to change, most important first. Tick steps as you go.',
    link: '/digital-footprint',
    cta: 'See my plan',
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
