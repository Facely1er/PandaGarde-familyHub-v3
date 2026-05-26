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
    description: 'Main interactive story.',
  },
  {
    label: 'All stories',
    href: '/stories',
    description: 'Browse published episodes.',
  },
];

/** Parent conversation & plans — static guides only (missions live in Family Hub). */
export const resourceGuideLinks: ResourceHubLink[] = [
  {
    label: 'Family privacy guide',
    href: '/guides/family-privacy',
    description: 'Household basics and how to talk with kids.',
  },
  {
    label: 'Family privacy plan',
    href: '/family-privacy-plan',
    description: 'Agree on rules together; saved on this device.',
  },
  {
    label: 'Emergency safety guide',
    href: '/guides/emergency-safety',
    description: 'Urgent steps if something goes wrong online.',
  },
];

/** Website printables only — no duplicate mission catalog. */
export const resourcePrintableLinks: ResourceHubLink[] = [
  {
    label: 'Printables & downloads',
    href: '/downloads/coloring-sheets',
    description: 'Coloring sheets, posters, certificates, and agreements.',
  },
];

/** @deprecated Use resourcePrintableLinks */
export const resourceKidsLinks = resourcePrintableLinks;

/** Footprint layer: catalog → review → how scores & rights fit in. */
export const resourceFootprintLinks: ResourceHubLink[] = [
  {
    label: 'Service catalog',
    href: '/service-catalog',
    description: 'List apps and services your family uses.',
  },
  {
    label: FOOTPRINT_REVIEW_NAV_LABEL,
    href: '/digital-footprint',
    description: 'Exposure snapshot from your catalog.',
  },
  {
    label: 'Scoring methodology',
    href: '/scoring-methodology',
    description: 'How exposure scores are calculated.',
  },
  {
    label: 'Digital privacy rights',
    href: '/digital-rights',
    description: 'Laws and rights that shape what exposure means.',
  },
];

/** Curated hub index only — footprint workflow lives on /digital-footprint and footer Review workflow. */
export const allResourceHubLinks: ResourceHubLink[] = [
  ...resourceStoryLinks,
  ...resourceGuideLinks,
  ...resourcePrintableLinks,
];
