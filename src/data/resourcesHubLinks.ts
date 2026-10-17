import { FOOTPRINT_REVIEW_NAV_LABEL } from './siteNavigation';

/**
 * Curated links for /for-families — grouped by site navigation layer.
 * Every href must resolve (route or PARENT_SURFACE_REDIRECTS).
 *
 * Naming: use “Family tools” / guides — never a generic “Toolkit” brand
 * that competes with SocialCaution’s adult /toolkit.
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
  {
    label: 'AWARE AI family one-pager',
    href: '/guides/aware-ai',
    description: 'Chatbot habits, privacy prompts, and crisis pointers for families.',
  },
];

/**
 * Practical household helpers formerly buried behind /parent-toolkit.
 * Live on-site pages only — not SocialCaution-style remediation tools.
 */
export const resourceFamilyToolsLinks: ResourceHubLink[] = [
  {
    label: 'Device setup guide',
    href: '/guides/device-setup',
    description: 'Privacy and security settings when a child gets a phone or tablet.',
  },
  {
    label: 'Conversation approaches',
    href: '/guides/conversation-approaches',
    description: 'Age-appropriate prompts for calm family talks about privacy.',
  },
  {
    label: 'App selection guide',
    href: '/guides/app-selection',
    description: 'Evaluate an app for privacy and fit before your child installs it.',
  },
  {
    label: 'Family internet agreement',
    href: '/downloads/family-agreement',
    description: 'Printable household agreement you can fill out together.',
  },
];

/** Website printables only — no duplicate mission catalog. */
export const resourcePrintableLinks: ResourceHubLink[] = [
  {
    label: 'Coloring sheets',
    href: '/downloads/coloring-sheets',
    description: 'Privacy Panda pages to color at home or school.',
  },
  {
    label: 'Safety posters',
    href: '/downloads/safety-posters',
    description: 'Visual reminders for shared devices and common spaces.',
  },
  {
    label: 'Certificates',
    href: '/downloads/certificates',
    description: 'Printable certificates to celebrate privacy learning.',
  },
  {
    label: 'Family internet agreement',
    href: '/downloads/family-agreement',
    description: 'Household rules you can print and sign together.',
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
export const allResourceHubLinks: ResourceHubLink[] = (() => {
  const seen = new Set<string>();
  const links = [
    ...resourceStoryLinks,
    ...resourceGuideLinks,
    ...resourceFamilyToolsLinks,
    ...resourcePrintableLinks,
  ];
  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }
    seen.add(link.href);
    return true;
  });
})();
