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
    description: 'Parent guides, planning tools, and household privacy materials.',
  },
  {
    label: 'Family privacy plan',
    href: '/family-privacy-plan',
    description: 'Turn assessment priorities into a written plan you can revisit.',
  },
  {
    label: 'How it works',
    href: '/how-it-works',
    description: 'Short overview of the three-step review when you want a checklist after DFA.',
  },
];

export const DFA_PHASE_THREE_KIDS_RESOURCES: DfaPhaseResourceLink[] = [
  {
    label: 'Privacy Panda stories',
    href: '/stories',
    description: 'Interactive stories that teach privacy in kid-friendly language.',
  },
  {
    label: 'Digital Bamboo Forest',
    href: '/stories/privacy-panda-and-the-digital-bamboo-forest',
    description: 'Start with the origin story—read together or let kids explore.',
  },
  {
    label: 'Privacy missions',
    href: '/family-hub/activities',
    description: 'Age-matched missions in Family Hub—progress stays on this device.',
  },
];

export const DFA_PHASE_THREE_JOURNAL: DfaPhaseResourceLink = {
  label: 'Digital Bamboo Journal',
  href: DIGITAL_BAMBOO_JOURNAL_URL,
  description:
    'A separate journal site for reflection and follow-up—aligned with PandaGarde stories, not required to finish DFA.',
  external: true,
};
