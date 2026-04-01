/**
 * Data Broker Ecosystem
 *
 * Maps parent companies â†’ their known 3rd-party data recipients (ad networks,
 * analytics, measurement) â†’ the 4th-party data brokers that aggregate and
 * resell consumer/student data downstream.
 *
 * Sources: company privacy policies, academic research, FOIA-obtained school
 * vendor lists, and privacy-advocacy datasets (Common Sense Privacy, EFF, etc.)
 */

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type ThirdPartyType =
  | 'ad-network'
  | 'analytics'
  | 'cloud-infrastructure'
  | 'measurement'
  | 'identity-resolution'
  | 'attribution';

export interface ThirdParty {
  id: string;
  name: string;
  type: ThirdPartyType;
  dataReceived: string[];
  notes?: string;
}

export interface DataBroker {
  id: string;
  name: string;
  description: string;
  /** Data categories held and sold */
  dataCategories: string[];
  childDataRisk: 'medium' | 'high' | 'very-high';
  /** Direct parent consumer opt-out URL */
  optOutUrl?: string;
  /** Whether this broker is known to hold children / student data */
  holdsChildData: boolean;
}

/** One parent company\'s full 3rd + 4th party data chain */
export interface CompanyEcosystem {
  companyId: string;
  companyName: string;
  /** Direct 3rd-party recipients of user data */
  thirdParties: ThirdParty[];
  /** 4th-party data brokers reachable through the 3rd-party chain */
  dataBrokers: DataBroker[];
}

// â”€â”€â”€ Known data brokers registry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const DATA_BROKER_REGISTRY: Record<string, DataBroker> = {
  acxiom: {
    id: 'acxiom',
    name: 'Acxiom / LiveRamp',
    description:
      'One of the world\'s largest data brokers. Builds multi-dimensional consumer profiles from 23,000+ data attributes. LiveRamp (acquired) is the industry\'s dominant identity-resolution platform.',
    dataCategories: [
      'Full name & address history',
      'Demographics & household composition',
      'Purchase history',
      'Online behavioral profiles',
      'Device identifiers',
      'Location history',
    ],
    childDataRisk: 'very-high',
    holdsChildData: true,
    optOutUrl: 'https://isapps.acxiom.com/optout/optout.aspx',
  },
  'oracle-bluekai': {
    id: 'oracle-bluekai',
    name: 'Oracle Advertising (BlueKai)',
    description:
      'Oracle\'s data marketplace. Aggregates behavioral, intent, and demographic data from thousands of publishers for real-time ad targeting. Operates a Data Marketplace accessible to any advertiser.',
    dataCategories: [
      'Online browsing behavior',
      'Purchase intent signals',
      'App usage patterns',
      'Audience segments',
      'Demographic inferences',
    ],
    childDataRisk: 'very-high',
    holdsChildData: true,
    optOutUrl: 'https://datacloudoptout.oracle.com/',
  },
  'experian-marketing': {
    id: 'experian-marketing',
    name: 'Experian Marketing Services',
    description:
      'Experian\'s consumer profiling division. Combines credit file data with behavioral and lifestyle data to build targeting profiles. Has confirmed holding data on children in class-action settlements.',
    dataCategories: [
      'Financial / credit behavior',
      'Purchase history',
      'Life-stage segments',
      'Demographics',
      'Email engagement',
    ],
    childDataRisk: 'high',
    holdsChildData: true,
    optOutUrl: 'https://www.experian.com/privacy/opting_out_of_marketing.html',
  },
  epsilon: {
    id: 'epsilon',
    name: 'Epsilon (Publicis)',
    description:
      'A Publicis Groupe company and one of the largest loyalty data platforms. Powers personalized advertising for major retailers and brands using transaction and behavioral data.',
    dataCategories: [
      'Retail purchase data',
      'Loyalty program activity',
      'Email / CRM behavior',
      'Demographic profiles',
      'Audience segmentation',
    ],
    childDataRisk: 'high',
    holdsChildData: false,
    optOutUrl: 'https://www.epsilon.com/us/privacy-policy',
  },
  lotame: {
    id: 'lotame',
    name: 'Lotame',
    description:
      'Independent data exchange platform. Aggregates behavioral and identity data from publishers and apps to create audience segments sold across the ad-tech ecosystem.',
    dataCategories: [
      'Behavioral audience segments',
      'Interest profiles',
      'Cross-device identity graphs',
      'Contextual engagement data',
    ],
    childDataRisk: 'high',
    holdsChildData: false,
    optOutUrl: 'https://www.lotame.com/about-lotame/privacy/consumer-opt-out/',
  },
  'the-trade-desk': {
    id: 'the-trade-desk',
    name: 'The Trade Desk',
    description:
      'Programmatic ad-buying platform that processes billions of ad impressions daily using Unified ID 2.0 (UID2) and third-party data to target individuals across devices and channels.',
    dataCategories: [
      'Ad-exposure data',
      'Cross-device behavioral profiles',
      'Purchase attribution',
      'Audience matching',
    ],
    childDataRisk: 'high',
    holdsChildData: false,
    optOutUrl: 'https://www.thetradedesk.com/us/privacy',
  },
  nielsen: {
    id: 'nielsen',
    name: 'Nielsen',
    description:
      'Global media measurement company. Tracks TV, streaming, and digital audiences across all screens, including children\'s viewing.',
    dataCategories: [
      'TV & streaming viewing habits',
      'Media consumption patterns',
      'Demographic segments',
      'Brand exposure data',
    ],
    childDataRisk: 'medium',
    holdsChildData: true,
    optOutUrl: 'https://www.nielsen.com/legal/privacy-statement/',
  },
  comscore: {
    id: 'comscore',
    name: 'Comscore',
    description:
      'Cross-platform audience measurement company. Measures digital, mobile, and streaming audiences through panel data and census-tag data collection.',
    dataCategories: [
      'Web browsing behavior',
      'App usage patterns',
      'Video-viewing analytics',
      'Audience measurement segments',
    ],
    childDataRisk: 'medium',
    holdsChildData: true,
    optOutUrl: 'https://www.comscore.com/About/Privacy-Policy',
  },
  'data-axiom-edtech': {
    id: 'data-axiom-edtech',
    name: 'Learning Economy / EdTech Data Brokers',
    description:
      'A category of brokers (including some Learning Economy Foundation partners and ed-data vendors) that purchase or license student learning analytics from EdTech platforms. Operates largely outside public awareness.',
    dataCategories: [
      'Student learning profiles',
      'Academic performance data',
      'Engagement and attention metrics',
      'Inferred cognitive patterns',
    ],
    childDataRisk: 'very-high',
    holdsChildData: true,
    optOutUrl: undefined,
  },
  'ai-training-brokers': {
    id: 'ai-training-brokers',
    name: 'AI Training Data Marketplaces',
    description:
      'Brokers and marketplaces (e.g., Scale AI, Surge AI, Appen) that purchase user-generated content â€” including conversations, images, and prompts â€” and sell it as AI training datasets. Conversations with AI assistants may enter this chain.',
    dataCategories: [
      'Conversation transcripts',
      'User prompts and queries',
      'Images and creative content',
      'Behavioral interaction patterns',
    ],
    childDataRisk: 'very-high',
    holdsChildData: true,
    optOutUrl: undefined,
  },
};

// â”€â”€â”€ Company ecosystems â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const COMPANY_ECOSYSTEMS: CompanyEcosystem[] = [
  {
    companyId: 'meta',
    companyName: 'Meta',
    thirdParties: [
      {
        id: 'fb-audience-network',
        name: 'Meta Audience Network',
        type: 'ad-network',
        dataReceived: ['User behavioral profiles', 'Ad interaction data', 'App install/usage events'],
        notes: 'Distributes Meta-sourced behavioral signals to third-party apps and websites.',
      },
      {
        id: 'liveramp-meta',
        name: 'LiveRamp (identity resolution)',
        type: 'identity-resolution',
        dataReceived: ['Hashed email addresses', 'Device IDs', 'Matched consumer records'],
      },
      {
        id: 'meta-pixel',
        name: 'Meta Pixel / Conversions API',
        type: 'analytics',
        dataReceived: ['Website actions', 'Purchase events', 'Form fills'],
        notes: 'Embedded on millions of third-party sites â€” data flows back to Meta.',
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['acxiom'],
      DATA_BROKER_REGISTRY['oracle-bluekai'],
      DATA_BROKER_REGISTRY['experian-marketing'],
      DATA_BROKER_REGISTRY['epsilon'],
      DATA_BROKER_REGISTRY['the-trade-desk'],
    ],
  },
  {
    companyId: 'alphabet',
    companyName: 'Google',
    thirdParties: [
      {
        id: 'google-ads-dv360',
        name: 'Google Ads / Display & Video 360',
        type: 'ad-network',
        dataReceived: ['Search queries', 'YouTube watch history', 'Location data', 'Purchase intent'],
        notes: 'Largest digital ad platform globally. School users on Workspace EDU are exempt from ad targeting â€” but personal Google accounts are not.',
      },
      {
        id: 'google-analytics-4',
        name: 'Google Analytics 4',
        type: 'analytics',
        dataReceived: ['Site/app events', 'Engagement data', 'Conversion tracking'],
        notes: 'Present on most websites children visit.',
      },
      {
        id: 'doubleclick',
        name: 'DoubleClick / Campaign Manager 360',
        type: 'ad-network',
        dataReceived: ['Ad impressions', 'Click-through behavior', 'Cross-site profiles'],
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['acxiom'],
      DATA_BROKER_REGISTRY['oracle-bluekai'],
      DATA_BROKER_REGISTRY['nielsen'],
      DATA_BROKER_REGISTRY['comscore'],
      DATA_BROKER_REGISTRY['the-trade-desk'],
    ],
  },
  {
    companyId: 'bytedance',
    companyName: 'ByteDance',
    thirdParties: [
      {
        id: 'tiktok-for-business',
        name: 'TikTok for Business',
        type: 'ad-network',
        dataReceived: ['In-app behavior', 'Video engagement', 'Demographic inferences', 'Device fingerprints'],
      },
      {
        id: 'appsflyer',
        name: 'AppsFlyer (attribution)',
        type: 'attribution',
        dataReceived: ['Install events', 'In-app actions', 'Cross-app attribution data'],
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['oracle-bluekai'],
      DATA_BROKER_REGISTRY['lotame'],
      DATA_BROKER_REGISTRY['the-trade-desk'],
    ],
  },
  {
    companyId: 'microsoft',
    companyName: 'Microsoft',
    thirdParties: [
      {
        id: 'microsoft-advertising',
        name: 'Microsoft Advertising (Bing Ads)',
        type: 'ad-network',
        dataReceived: ['Search queries', 'LinkedIn professional data', 'Bing browsing signals'],
        notes: 'Student Workspace accounts are ad-free, but data is still used for product improvement.',
      },
      {
        id: 'clarity',
        name: 'Microsoft Clarity',
        type: 'analytics',
        dataReceived: ['Session recordings', 'Heatmap data', 'User interaction events'],
      },
      {
        id: 'linkedin-data',
        name: 'LinkedIn Marketing Solutions',
        type: 'identity-resolution',
        dataReceived: ['Professional identity matching', 'Company/role segments', 'Email matching'],
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['acxiom'],
      DATA_BROKER_REGISTRY['experian-marketing'],
      DATA_BROKER_REGISTRY['the-trade-desk'],
    ],
  },
  {
    companyId: 'snap-inc',
    companyName: 'Snap Inc.',
    thirdParties: [
      {
        id: 'snap-audience-network',
        name: 'Snap Audience Network',
        type: 'ad-network',
        dataReceived: ['App behavior', 'Location signals', 'Demographic profiles'],
      },
      {
        id: 'snap-pixel',
        name: 'Snap Pixel',
        type: 'analytics',
        dataReceived: ['Website purchase events', 'Conversion data', 'Cross-site behavior'],
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['oracle-bluekai'],
      DATA_BROKER_REGISTRY['lotame'],
      DATA_BROKER_REGISTRY['comscore'],
    ],
  },
  {
    companyId: 'roblox-corp',
    companyName: 'Roblox Corporation',
    thirdParties: [
      {
        id: 'roblox-advertising',
        name: 'Roblox Immersive Ads',
        type: 'ad-network',
        dataReceived: ['In-game behavior', 'Virtual purchase data', 'Age-banded demographics'],
        notes: 'Roblox serves in-game ads to 13+ users. Under-13 accounts are supposed to be excluded.',
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['oracle-bluekai'],
      DATA_BROKER_REGISTRY['comscore'],
    ],
  },
  {
    companyId: 'epic-games',
    companyName: 'Epic Games',
    thirdParties: [
      {
        id: 'epic-analytics',
        name: 'Epic Analytics (internal)',
        type: 'analytics',
        dataReceived: ['Gameplay telemetry', 'In-game purchase events', 'Social graph'],
      },
      {
        id: 'tencent',
        name: 'Tencent (40% shareholder)',
        type: 'analytics',
        dataReceived: [],
        notes: 'Tencent owns 40% of Epic. Data governance overlap is a concern but not fully documented.',
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['comscore'],
    ],
  },
  {
    companyId: 'netflix-inc',
    companyName: 'Netflix',
    thirdParties: [
      {
        id: 'netflix-ads',
        name: 'Netflix Ads (ad-supported tier)',
        type: 'ad-network',
        dataReceived: ['Viewing history', 'Genre preferences', 'Pause/resume behavior'],
        notes: 'Ad-supported tier launched 2022. Kids profiles should be on ad-free plans.',
      },
      {
        id: 'nielsen-netflix',
        name: 'Nielsen (audience measurement)',
        type: 'measurement',
        dataReceived: ['Viewing metrics', 'Audience composition', 'Content performance'],
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['nielsen'],
      DATA_BROKER_REGISTRY['comscore'],
    ],
  },
  {
    companyId: 'classdojo-inc',
    companyName: 'ClassDojo',
    thirdParties: [
      {
        id: 'classdojo-analytics',
        name: 'Behavioral Analytics Partners',
        type: 'analytics',
        dataReceived: ['Engagement patterns', 'Feature usage', 'Session timing'],
        notes: 'ClassDojo uses multiple analytics SDKs. Behavioral data on children ages 5+ is collected.',
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['data-axiom-edtech'],
    ],
  },
  {
    companyId: 'renaissance',
    companyName: 'Renaissance Learning',
    thirdParties: [
      {
        id: 'renaissance-analytics',
        name: 'Renaissance Analytics & Benchmarking',
        type: 'analytics',
        dataReceived: ['Reading levels', 'Assessment scores', 'Learning velocity'],
        notes: 'Aggregated and de-identified data is used for national norm benchmarking and sold as aggregate reports.',
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['data-axiom-edtech'],
    ],
  },
  // AI companies
  {
    companyId: 'openai',
    companyName: 'OpenAI',
    thirdParties: [
      {
        id: 'azure-openai',
        name: 'Microsoft Azure (infrastructure)',
        type: 'cloud-infrastructure',
        dataReceived: ['Prompt data', 'Conversation history', 'API usage logs'],
        notes: 'OpenAI runs on Azure. Microsoft has contracted access to OpenAI data under their partnership.',
      },
      {
        id: 'openai-training',
        name: 'Model Training Pipeline',
        type: 'analytics',
        dataReceived: ['User prompts (unless opted out)', 'Conversation turns', 'Feedback signals'],
        notes: 'By default, conversations on free tier may be used to train future models.',
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['ai-training-brokers'],
    ],
  },
  {
    companyId: 'character-technologies',
    companyName: 'Character.AI',
    thirdParties: [
      {
        id: 'char-ai-analytics',
        name: 'Analytics & Advertising SDKs',
        type: 'analytics',
        dataReceived: ['Conversation metadata', 'Session duration', 'Character interaction patterns'],
        notes: 'Research by Mozilla (2023) found multiple ad/analytics trackers in Character.AI mobile app.',
      },
      {
        id: 'char-ai-training',
        name: 'Character.AI Training Pipeline',
        type: 'analytics',
        dataReceived: ['Full conversation content', 'User persona details', 'Emotional expression data'],
        notes: 'All conversations stored and used for model training. No true deletion â€” conversations may persist in model weights.',
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['ai-training-brokers'],
      DATA_BROKER_REGISTRY['oracle-bluekai'],
    ],
  },
  {
    companyId: 'grammarly-inc',
    companyName: 'Grammarly',
    thirdParties: [
      {
        id: 'grammarly-analytics',
        name: 'Product Analytics (internal)',
        type: 'analytics',
        dataReceived: ['All text being typed', 'Document content', 'Writing patterns', 'Error frequencies'],
        notes: 'The Grammarly browser extension has access to virtually everything a user types in any text field â€” including passwords if not excluded.',
      },
    ],
    dataBrokers: [
      DATA_BROKER_REGISTRY['acxiom'],
    ],
  },
];

// â”€â”€â”€ Lookup helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Get the company ecosystem for a given parent company ID.
 */
export function getCompanyEcosystem(companyId: string): CompanyEcosystem | undefined {
  return COMPANY_ECOSYSTEMS.find(e => e.companyId === companyId);
}

/**
 * Get all unique data brokers reachable from a list of parent company IDs.
 */
export function getReachableDataBrokers(companyIds: string[]): DataBroker[] {
  const seen = new Set<string>();
  const result: DataBroker[] = [];
  for (const id of companyIds) {
    const eco = getCompanyEcosystem(id);
    if (!eco) { continue; }
    for (const broker of eco.dataBrokers) {
      if (!seen.has(broker.id)) {
        seen.add(broker.id);
        result.push(broker);
      }
    }
  }
  return result;
}

/**
 * Get all unique 3rd parties reachable from a list of parent company IDs.
 */
export function getReachableThirdParties(companyIds: string[]): ThirdParty[] {
  const seen = new Set<string>();
  const result: ThirdParty[] = [];
  for (const id of companyIds) {
    const eco = getCompanyEcosystem(id);
    if (!eco) { continue; }
    for (const tp of eco.thirdParties) {
      if (!seen.has(tp.id)) {
        seen.add(tp.id);
        result.push(tp);
      }
    }
  }
  return result;
}
