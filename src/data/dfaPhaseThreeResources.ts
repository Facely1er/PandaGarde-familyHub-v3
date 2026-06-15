import { GUIDES_STORIES_NAV_LABEL } from './siteNavigation';

/** Shared links for DFA phase 3 — website learning paths (not Family Hub). */
export const DIGITAL_BAMBOO_JOURNAL_URL = 'https://journal.pandagarde.com';

export interface DfaPhaseResourceLink {
  label: string;
  href: string;
  description: string;
  external?: boolean;
}

export const DFA_PHASE_THREE_PARENT_RESOURCES: DfaPhaseResourceLink[] = [
  {
    label: GUIDES_STORIES_NAV_LABEL,
    href: '/for-families',
    description: 'Parent guides, printables, and talk prompts—pick one below.',
  },
  {
    label: 'Family privacy plan',
    href: '/family-privacy-plan',
    description: 'Write down your household rules together.',
  },
  {
    label: 'How it works',
    href: '/how-it-works',
    description: 'A simple overview if you want the big picture.',
  },
];

export const DFA_PHASE_THREE_KIDS_RESOURCES: DfaPhaseResourceLink[] = [
  {
    label: 'Privacy Panda stories',
    href: '/stories',
    description: 'Read together—about 5 minutes, no setup.',
  },
  {
    label: 'Digital Bamboo Forest',
    href: '/stories/privacy-panda-and-the-digital-bamboo-forest',
    description: 'Best first story—start here.',
  },
  {
    label: 'Privacy missions',
    href: '/family-hub/activities',
    description: 'Short activities in Family Hub—open and pick one.',
  },
];

export const DFA_PHASE_THREE_JOURNAL: DfaPhaseResourceLink = {
  label: 'Digital Bamboo Journal',
  href: DIGITAL_BAMBOO_JOURNAL_URL,
  description:
    'Optional follow-up journal—separate site, not required to use PandaGarde.',
  external: true,
};
