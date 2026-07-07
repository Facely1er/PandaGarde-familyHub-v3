import { FOOTPRINT_REVIEW_NAV_LABEL } from './siteNavigation';

/**
 * Curated links for /for-families — grouped by site navigation layer.
 * Every href must resolve (route or PARENT_SURFACE_REDIRECTS).
 */

export type ResourceHubLink = {
  label: string;
  href: string;
  description: string;
};

export const resourceStoryLinks: ResourceHubLink[] = [
  {
    label: 'Privacy Panda & the Digital Bamboo Forest',
    href: '/stories/privacy-panda-and-the-digital-bamboo-forest',
    description: 'Best first story—read together in about 5 minutes.',
  },
  {
    label: 'All stories',
    href: '/stories',
    description: 'Browse every episode—pick any one to start.',
  },
  {
    label: 'Meet the cast',
    href: '/stories/cast',
    description: 'Who lives in the Digital Bamboo Forest—and when you meet them.',
  },
];

/** Parent conversation & plans — static guides only (missions live in Family Hub). */
export const resourceGuideLinks: ResourceHubLink[] = [
  {
    label: 'Family privacy guide',
    href: '/guides/family-privacy',
    description: 'Step-by-step help for talking with kids of any age.',
  },
  {
    label: 'Family privacy plan',
    href: '/family-privacy-plan',
    description: 'Write your household rules together.',
  },
  {
    label: 'Emergency safety guide',
    href: '/guides/emergency-safety',
    description: 'If something went wrong online—start here.',
  },
];

/** Website printables only — no duplicate mission catalog. */
export const resourcePrintableLinks: ResourceHubLink[] = [
  {
    label: 'Printables & downloads',
    href: '/downloads/coloring-sheets',
    description: 'Coloring sheets, posters, and certificates to print at home.',
  },
];

/** @deprecated Use resourcePrintableLinks */
export const resourceKidsLinks = resourcePrintableLinks;

/** Footprint layer: catalog → review → how scores & rights fit in. */
export const resourceFootprintLinks: ResourceHubLink[] = [
  {
    label: 'Service catalog',
    href: '/service-catalog',
    description: 'Tap the apps your family uses—about 10 minutes.',
  },
  {
    label: FOOTPRINT_REVIEW_NAV_LABEL,
    href: '/digital-footprint',
    description: 'See which apps collect the most data from your list.',
  },
  {
    label: 'Scoring methodology',
    href: '/scoring-methodology',
    description: 'Optional—how scores are calculated.',
  },
  {
    label: 'Digital privacy rights',
    href: '/digital-rights',
    description: 'Helpful for Maryland families; skip if you are just starting.',
  },
];

/** Curated hub index only — footprint workflow lives on /digital-footprint and footer Review workflow. */
export const allResourceHubLinks: ResourceHubLink[] = [
  ...resourceStoryLinks,
  ...resourceGuideLinks,
  ...resourcePrintableLinks,
];
