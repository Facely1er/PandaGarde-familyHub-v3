/** Copy for /scoring-methodology — keep aligned with privacyExposureIndex + dfaScoreEngine. */

export const SCORING_METHODOLOGY_VERSION = '1.0.0';

export const scoringMethodologyIntro = {
  title: 'How PandaGarde scores exposure',
  lead:
    'PandaGarde uses two related scoring views: a per-app Privacy Exposure Index in the Service Catalog, and a household Digital Footprint Analysis (DFA) score after you list services. Both are educational guides built from the catalog you choose—not live monitoring of a child’s device.',
};

export const perServiceMethodology = {
  title: 'Per-app Privacy Exposure Index (0–100)',
  summary:
    'Each catalog app gets a 0–100 exposure index. Higher means more potential privacy exposure for families, based on curated service metadata—not a legal judgment or compliance audit.',
  factors: [
    {
      label: 'Base risk level',
      description:
        'Curated risk tier for the service (how invasive the category and known practices tend to be for children and families).',
    },
    {
      label: 'Privacy concern tags',
      description:
        'Number and severity of documented concerns (e.g., location, ads, messaging, data resale themes) attached to the catalog entry.',
    },
    {
      label: 'Minimum age',
      description:
        'Services aimed at younger children receive additional weight because families often need stricter defaults and more adult guidance.',
    },
    {
      label: 'Category',
      description:
        'App type matters—social, messaging, carriers, AI tools, and health-adjacent apps carry different typical exposure patterns than, say, a single-subject learning app.',
    },
    {
      label: 'Parent company & siblings',
      description:
        'When a service shares a parent company or sibling apps, exposure may increase because data can flow across a broader ecosystem.',
    },
  ],
  bands: [
    { range: '0–29', label: 'Low', meaning: 'Generally manageable with basic privacy habits and settings reviews.' },
    { range: '30–49', label: 'Medium', meaning: 'Worth regular check-ins on permissions and account settings.' },
    { range: '50–69', label: 'High', meaning: 'Plan active monitoring conversations and tighter defaults.' },
    { range: '70–100', label: 'Very high', meaning: 'Prioritize family rules, supervision, and concrete next steps.' },
  ],
};

export const householdDfaMethodology = {
  title: 'Household DFA score (Basic & Advanced)',
  summary:
    'After you add services, Digital Footprint Analysis rolls them into one household reading. Switch tiers to control how much network, broker, and AI context is included.',
  tiers: [
    {
      id: 'basic',
      label: 'Basic DFA',
      description: 'Fast household snapshot for busy parents.',
      factors: ['Average service exposure', 'How many services are in scope', 'Share of services in higher exposure bands'],
    },
    {
      id: 'advanced',
      label: 'Advanced DFA',
      description: 'Adds ecosystem context when you want a deeper read.',
      factors: [
        'Everything in Basic',
        'Data-sharing network reach (parent/sibling services)',
        'Data-broker and ad-tech convergence signals',
        'AI-service sensitivity (training, profiling, and disclosure themes)',
      ],
    },
  ],
};

export const scoringLimitations = [
  'Scores reflect the services you list in the catalog—they do not watch what a child does online in real time.',
  'PandaGarde does not access medical records, school records, or private account contents.',
  'Higher exposure does not mean a company broke the law or acted unethically; it highlights where families may want more conversation and controls.',
  'Catalog entries are curated and updated over time; scores may lag fast-changing products until metadata is refreshed.',
];

export const scoringLineageNote =
  'Service exposure logic is adapted from the ERMITS family privacy scoring lineage (also used in SocialCaution’s consumer catalog). PandaGarde tailors weights and copy for parents, educators, and age-appropriate storytelling—not for enterprise vendor audits.';
