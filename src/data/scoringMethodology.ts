/** Copy for /scoring-methodology — keep aligned with privacyExposureIndex + dfaScoreEngine + footprintAnalyzer. */

export const SCORING_METHODOLOGY_VERSION = '1.1.0';

export const scoringMethodologyIntro = {
  title: 'How PandaGarde scores exposure',
  lead:
    'PandaGarde uses two related scoring views: a per-app Privacy Exposure Index in the Service Catalog, and household Digital Footprint Analysis (DFA) after you list services. Both are educational guides built from the catalog you choose—not live monitoring of a child’s device.',
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

/** Digital Footprint Analysis — full methodology (sync with dfaScoreEngine.ts + footprintAnalyzer.ts). */
export const dfaMethodology = {
  title: 'Digital Footprint Analysis (DFA) methodology',
  summary:
    'DFA is Phase 2 of the PandaGarde journey. After you add at least three services in the catalog, PandaGarde aggregates them into household-level scores, visualizations, and recommended next steps—all computed locally in your browser.',
  prerequisites: [
    'Add services your family actually uses in the Service Catalog (minimum three to unlock DFA).',
    'Optionally assign services to family member profiles for per-person views in the visualization.',
    'No PandaGarde account or cloud upload is required for the core analysis.',
  ],
  scoresOnPage: {
    title: 'Two score families on the footprint page',
    items: [
      {
        label: 'DFA risk score (gauge)',
        description:
          'Produced by the DFA scoring engine (Basic or Advanced tier). Higher = more household privacy risk. Shown as Risk score with levels Low, Moderate, High, or Critical. Privacy posture is 100 minus this risk score.',
      },
      {
        label: 'Family score (summary cards)',
        description:
          'A separate footprint snapshot used in the visualization layer. It blends average service exposure, how many apps are listed, high-exposure apps, and parent-company network ties. Higher family score = broader or more exposed footprint. Privacy score on the cards is 100 minus family score.',
      },
    ],
  },
  riskLevels: [
    { range: '0–29', label: 'Low', meaning: 'Footprint looks manageable with routine check-ins.' },
    { range: '30–54', label: 'Moderate', meaning: 'Worth prioritizing a few services and family conversations.' },
    { range: '55–74', label: 'High', meaning: 'Several drivers are elevated; plan concrete changes.' },
    { range: '75–100', label: 'Critical', meaning: 'Treat as urgent for family planning—not alarm, but focus.' },
  ],
  tiers: [
    {
      id: 'basic',
      label: 'Basic DFA',
      description: 'Fast household reading for busy parents. Three weighted drivers roll up into one risk score.',
      formula: 'Risk score = 50% service exposure + 20% service volume + 30% high-risk app density',
      drivers: [
        {
          label: 'Service exposure',
          weight: '50%',
          description:
            'Average Privacy Exposure Index across all catalog services in scope (0–100). Pulls forward per-app scores from the catalog methodology.',
        },
        {
          label: 'Service volume',
          weight: '20%',
          description:
            'How many apps are listed, capped for display at 100 (roughly +8 points per service). More services means more places data can live.',
        },
        {
          label: 'High-risk app density',
          weight: '30%',
          description:
            'Share of listed services with exposure index ≥ 70. A few very exposed apps can dominate household risk even if the average looks moderate.',
        },
      ],
    },
    {
      id: 'advanced',
      label: 'Advanced DFA',
      description:
        'Adds ecosystem context: corporate data-sharing networks, broker convergence, and AI-specific sensitivity.',
      formula:
        'Risk score = 30% exposure + 15% volume + 20% high-risk density + 15% network reach + 10% broker exposure + 10% AI sensitivity',
      drivers: [
        {
          label: 'Service exposure',
          weight: '30%',
          description: 'Same average per-app exposure as Basic, with reduced weight to make room for ecosystem factors.',
        },
        {
          label: 'Service volume',
          weight: '15%',
          description: 'Same volume signal as Basic.',
        },
        {
          label: 'High-risk app density',
          weight: '20%',
          description: 'Same high-risk concentration signal as Basic.',
        },
        {
          label: 'Data-sharing network reach',
          weight: '15%',
          description:
            'Share of services tied to parent companies or sibling apps with non-low network risk in the relationship map.',
        },
        {
          label: 'Data broker exposure',
          weight: '10%',
          description:
            'Derived from how many distinct broker or ad-tech entities appear in the mapped broker analysis (scaled for display).',
        },
        {
          label: 'AI sensitivity',
          weight: '10%',
          description:
            'Elevated when AI apps are present, especially if high-risk AI tools or training-data reuse themes are flagged in the catalog.',
        },
      ],
    },
  ],
  flags: {
    title: 'Risk flags',
    description:
      'Beyond the numeric score, DFA surfaces plain-language flags when drivers score ≥ 30 or when specific conditions appear (for example, school-context exposure averages ≥ 50, or AI training-data risk). Flags are conversation starters, not automated judgments.',
  },
  footprintSnapshot: {
    title: 'Family score snapshot (visualization)',
    description: 'The three summary cards above the forest visualization use this footprint formula:',
    factors: [
      { label: 'Average exposure', portion: 'Up to 40%', detail: 'Average per-service Privacy Exposure Index × 40%.' },
      { label: 'Service count', portion: 'Up to 20%', detail: 'Two points per listed service, max 20 points.' },
      { label: 'High-exposure services', portion: 'Up to 25%', detail: 'Five points per service with index ≥ 70, max 25 points.' },
      { label: 'Corporate network ties', portion: 'Up to 15%', detail: 'Three points per service with a known parent company, max 15 points.' },
    ],
  },
  whatDfaIncludes: [
    'Per-service exposure list and category/context breakdowns',
    'Data-sharing network and broker convergence views (Advanced context)',
    'AI risk summary when AI tools are in the catalog',
    'Exportable JSON summary and PDF executive summary (from the DFA panel)',
    'Recommended next step: Privacy Assessment and Family Hub missions',
  ],
};

/** @deprecated Use dfaMethodology — kept for imports during transition */
export const householdDfaMethodology = {
  title: dfaMethodology.title,
  summary: dfaMethodology.summary,
  tiers: dfaMethodology.tiers.map((t) => ({
    id: t.id,
    label: t.label,
    description: t.description,
    factors: t.drivers.map((d) => `${d.label} (${d.weight})`),
  })),
};

export const scoringLimitations = [
  'Scores reflect the services you list in the catalog—they do not watch what a child does online in real time.',
  'PandaGarde does not access medical records, school records, or private account contents.',
  'Higher exposure does not mean a company broke the law or acted unethically; it highlights where families may want more conversation and controls.',
  'Catalog entries are curated and updated over time; scores may lag fast-changing products until metadata is refreshed.',
  'DFA risk score and family score use different formulas; compare them as complementary views, not duplicates.',
];

export const scoringLineageNote =
  'Service exposure logic is adapted from the ERMITS family privacy scoring lineage (also used in SocialCaution’s consumer catalog). PandaGarde tailors weights and copy for parents, educators, and age-appropriate storytelling—not for enterprise vendor audits.';
