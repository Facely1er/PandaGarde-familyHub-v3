/**
 * Data Broker Network â€” 3rd/4th Party Data Chain Mapping
 *
 * Documents the downstream data flow for each service:
 *  - 3rd-party trackers: SDKs, analytics, ad-network libraries embedded in the app
 *  - 4th-party data brokers: companies that aggregate, package, and resell data that
 *    originates from the 3rd-party trackers above
 *
 * Sources: published privacy policies, FTC reports, SEC filings, academic/journalism
 * research (e.g. Mozilla Foundation, EFF Panopticlick, AppCensus, Disconnect.me,
 * Zuboff\'s "Surveillance Capitalism", EPIC privacy complaints).
 *
 * Framing note: entries describe KNOWN OR WIDELY REPORTED relationships; where
 * a relationship is contested or circumstantial it is flagged with `reported: true`.
 */

export type TrackerRole =
  | 'analytics'        // usage and event tracking
  | 'advertising'      // ad-delivery or ad-attribution
  | 'attribution'      // mobile install/conversion attribution
  | 'customer-data'    // CRM / customer data platform
  | 'cloud-infra'      // backend hosting â€” less direct, but still holds data
  | 'payment'          // billing (limited personal data, but still 3rd party)
  | 'ai-training';     // conversation/content data used to train AI models

export type BrokerType =
  | 'aggregator'           // collects from many sources to build profiles
  | 'identity-resolution'  // matches anonymous IDs to real people
  | 'ad-network'           // buys data to target ads across the web
  | 'data-marketplace';    // sells audience segments to other businesses

export interface ThirdPartyTracker {
  name: string;
  role: TrackerRole;
  notes: string;
  /** Whether this tracker can build profiles on minors */
  canProfileMinors: boolean;
  /** True when the relationship is well-documented; false = reported/inferred */
  documented: boolean;
}

export interface DataBrokerLink {
  name: string;
  type: BrokerType;
  /** Plain-language note on what data flows there and how it may be used */
  reachNote: string;
  /** Consumer opt-out URL if publicly available */
  optOutUrl?: string;
  documented: boolean;
}

export interface ServiceDataChain {
  serviceId: string;
  /** Known 3rd-party SDKs or API integrations embedded in the service */
  thirdPartyTrackers: ThirdPartyTracker[];
  /** Known or widely-reported data broker connections one step further downstream */
  fourthPartyBrokers: DataBrokerLink[];
  /** One-sentence plain-language summary for parents */
  chainSummary: string;
  chainRiskLevel: 'low' | 'medium' | 'high' | 'very-high';
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Common reusable trackers (referenced by multiple services)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const FIREBASE_ANALYTICS: ThirdPartyTracker = {
  name: 'Google Firebase / Analytics',
  role: 'analytics',
  notes: 'Tracks in-app events, sessions, and device IDs; data goes to Google infrastructure',
  canProfileMinors: true,
  documented: true
};

const FACEBOOK_SDK: ThirdPartyTracker = {
  name: 'Meta SDK / Facebook Pixel',
  role: 'advertising',
  notes: 'Reports user actions to Meta for ad targeting and cross-app measurement',
  canProfileMinors: true,
  documented: true
};

const APPSFLYER: ThirdPartyTracker = {
  name: 'AppsFlyer (attribution)',
  role: 'attribution',
  notes: 'Tracks app installs and conversions; shares identifiers with ad networks',
  canProfileMinors: true,
  documented: true
};

const AWS_INFRA: ThirdPartyTracker = {
  name: 'Amazon Web Services (infrastructure)',
  role: 'cloud-infra',
  notes: 'Hosts app data; AWS itself has restricted usage policies but data is stored by a 3rd party',
  canProfileMinors: false,
  documented: true
};

const GOOGLE_CLOUD_INFRA: ThirdPartyTracker = {
  name: 'Google Cloud Platform (infrastructure)',
  role: 'cloud-infra',
  notes: 'Hosts app backend and often enables Google-native analytics in the same pipeline',
  canProfileMinors: false,
  documented: true
};

const SALESFORCE_MKT: ThirdPartyTracker = {
  name: 'Salesforce Marketing Cloud',
  role: 'customer-data',
  notes: 'Used for parent/user email communications and behavioural CRM; data sits in Salesforce CDP',
  canProfileMinors: false,
  documented: true
};

const OPENAI_API: ThirdPartyTracker = {
  name: 'OpenAI API',
  role: 'ai-training',
  notes: 'Content sent via API may be stored and used to improve OpenAI models (unless opted out via enterprise agreement)',
  canProfileMinors: true,
  documented: true
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Common broker links
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const LIVERAMP: DataBrokerLink = {
  name: 'LiveRamp',
  type: 'identity-resolution',
  reachNote: 'Connects anonymous digital IDs to real-world identities; distributes audience segments to hundreds of ad platforms.',
  optOutUrl: 'https://liveramp.com/opt_out/',
  documented: true
};

const ACXIOM: DataBrokerLink = {
  name: 'Acxiom',
  type: 'aggregator',
  reachNote: 'Holds data on 2.5 billion people globally; purchases and enriches consumer profiles from digital and offline sources.',
  optOutUrl: 'https://www.acxiom.com/optout/',
  documented: true
};

const ORACLE_BLUEKAI: DataBrokerLink = {
  name: 'Oracle Data Cloud (BlueKai)',
  type: 'data-marketplace',
  reachNote: 'BlueKai purchases audience data from analytics SDKs and resells targeting segments to advertisers worldwide.',
  documented: true
};

const LOTAME: DataBrokerLink = {
  name: 'Lotame',
  type: 'data-marketplace',
  reachNote: 'Aggregates behavioural data from apps and websites to build and sell audience segments to ad buyers.',
  optOutUrl: 'https://www.lotame.com/about-lotame/privacy/',
  documented: true
};

const EPSILON: DataBrokerLink = {
  name: 'Epsilon (Publicis Group)',
  type: 'aggregator',
  reachNote: 'Combines digital behavioural data with offline purchase records to build comprehensive consumer profiles for marketers.',
  documented: true
};

const UNITY_ADS: DataBrokerLink = {
  name: 'Unity Ads / ironSource',
  type: 'ad-network',
  reachNote: 'Mobile ad network common in games; aggregates in-game behaviour to target ads across thousands of apps.',
  documented: true
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Service data chains
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const serviceDataChains: ServiceDataChain[] = [

  // â”€â”€ Social Media â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    serviceId: 'instagram',
    chainRiskLevel: 'very-high',
    chainSummary: 'Meta\'s own ad machine plus LiveRamp and Acxiom mean Instagram data can reach hundreds of advertisers and identity-resolution brokers.',
    thirdPartyTrackers: [
      FIREBASE_ANALYTICS,
      {
        name: 'Meta Ads Infrastructure',
        role: 'advertising',
        notes: 'Every like, scroll, and story view feeds Meta\'s behavioural ad-targeting engine directly',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [LIVERAMP, ACXIOM, LOTAME]
  },

  {
    serviceId: 'tiktok',
    chainRiskLevel: 'very-high',
    chainSummary: 'TikTok\'s SDK is embedded in thousands of other apps and ByteDance operates its own data brokerage; data may flow outside the US under ByteDance\'s global infrastructure.',
    thirdPartyTrackers: [
      {
        name: 'TikTok Pixel / SDK (ByteDance)',
        role: 'advertising',
        notes: 'Installed on many third-party websites; reports cross-site behaviour back to ByteDance',
        canProfileMinors: true,
        documented: true
      },
      APPSFLYER,
      FIREBASE_ANALYTICS
    ],
    fourthPartyBrokers: [
      ACXIOM,
      {
        name: 'ByteDance Data Partners (China)',
        type: 'aggregator',
        reachNote: 'ByteDance\'s Chinese parent has been reported to access US user data; regulatory action is ongoing (FCC, DOJ, FTC).',
        documented: false
      }
    ]
  },

  {
    serviceId: 'snapchat',
    chainRiskLevel: 'high',
    chainSummary: 'Snap\'s ad network plus LiveRamp integration means Snapchat data contributes to cross-platform identity profiles.',
    thirdPartyTrackers: [
      FIREBASE_ANALYTICS,
      {
        name: 'Snap Audience Network',
        role: 'advertising',
        notes: 'Snap extends targeting beyond its own app; partners with external publishers using the same identity graph',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [LIVERAMP, ORACLE_BLUEKAI]
  },

  // â”€â”€ Messaging â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    serviceId: 'whatsapp',
    chainRiskLevel: 'high',
    chainSummary: 'WhatsApp shares account metadata (not message content) with Meta, feeding the same ad infrastructure that powers Facebook and Instagram.',
    thirdPartyTrackers: [
      FIREBASE_ANALYTICS,
      {
        name: 'Meta Account Infrastructure',
        role: 'advertising',
        notes: 'Phone number, contacts, usage patterns, and device identifiers shared with Meta for cross-product profiling',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [LIVERAMP, ACXIOM]
  },

  {
    serviceId: 'discord',
    chainRiskLevel: 'high',
    chainSummary: 'Discord uses advertising SDKs and shares data with analytics firms; users\' server activity and interests are monetised through targeted advertising.',
    thirdPartyTrackers: [
      FIREBASE_ANALYTICS,
      APPSFLYER,
      {
        name: 'Google Ads SDK',
        role: 'advertising',
        notes: 'Used for Discord\'s own ad campaigns and growth attribution; routes through Google\'s ad infrastructure',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [ORACLE_BLUEKAI, EPSILON]
  },

  // â”€â”€ Gaming â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    serviceId: 'roblox',
    chainRiskLevel: 'high',
    chainSummary: 'Roblox uses multiple advertising and analytics SDKs; children\'s gameplay behaviour and in-game purchase patterns can reach mobile ad network data brokers.',
    thirdPartyTrackers: [
      FIREBASE_ANALYTICS,
      APPSFLYER,
      {
        name: 'Google AdMob',
        role: 'advertising',
        notes: 'Used in Roblox mobile; sends device and behavioural data to Google\'s advertising infrastructure',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [UNITY_ADS, ORACLE_BLUEKAI, LIVERAMP]
  },

  {
    serviceId: 'fortnite',
    chainRiskLevel: 'medium',
    chainSummary: 'Epic Games uses analytics and attribution SDKs; purchase and play patterns may reach advertising data aggregators.',
    thirdPartyTrackers: [
      FIREBASE_ANALYTICS,
      APPSFLYER,
      {
        name: 'Epic Games Advertising SDK',
        role: 'advertising',
        notes: 'Epic runs in-house analytics that feeds into cross-game profiling across its own titles',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [UNITY_ADS, ORACLE_BLUEKAI]
  },

  {
    serviceId: 'minecraft',
    chainRiskLevel: 'medium',
    chainSummary: 'Microsoft integrates Minecraft with Xbox ecosystem telemetry; data flows through Microsoft\'s advertising infrastructure.',
    thirdPartyTrackers: [
      {
        name: 'Microsoft App Center / Azure Analytics',
        role: 'analytics',
        notes: 'Microsoft collects gameplay telemetry across Xbox, Windows, and mobile; data is stored in Azure and feeds Microsoft\'s identity graph',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'Microsoft Advertising (LinkedIn Audience Network)',
        type: 'ad-network',
        reachNote: 'Microsoft\'s ad platform, powered by LinkedIn\'s identity data, receives behavioural signals from across Microsoft\'s product suite.',
        documented: true
      }
    ]
  },

  // â”€â”€ Streaming â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    serviceId: 'youtube',
    chainRiskLevel: 'very-high',
    chainSummary: 'YouTube is Google\'s data collection engine; viewing history, search queries, and engagement signals directly power Google\'s global ad network and identity resolution.',
    thirdPartyTrackers: [
      {
        name: 'Google Ads Infrastructure',
        role: 'advertising',
        notes: 'YouTube is fully integrated into Google\'s ad targeting; every view contributes to interest and demographic profiles',
        canProfileMinors: true,
        documented: true
      },
      FIREBASE_ANALYTICS
    ],
    fourthPartyBrokers: [LIVERAMP, ACXIOM, EPSILON]
  },

  {
    serviceId: 'netflix',
    chainRiskLevel: 'medium',
    chainSummary: 'Netflix collects detailed viewing profiles and, since introducing its ad-supported tier, partners with Microsoft Advertising to deliver targeted ads.',
    thirdPartyTrackers: [
      {
        name: 'Microsoft Advertising (Netflix Ads)',
        role: 'advertising',
        notes: 'Netflix\'s ad tier is powered by Microsoft\'s ad tech; viewing data and identifiers shared with Microsoft for targeting',
        canProfileMinors: false,
        documented: true
      },
      AWS_INFRA
    ],
    fourthPartyBrokers: [
      {
        name: 'Nielsen Digital Ad Ratings',
        type: 'aggregator',
        reachNote: 'Netflix shares audience measurement data with Nielsen to verify ad delivery, which Nielsen then incorporates into its broader audience panels.',
        documented: true
      }
    ]
  },

  // â”€â”€ EdTech / School â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    serviceId: 'google-classroom',
    chainRiskLevel: 'medium',
    chainSummary: 'Google for Education restricts ad use of student data, but the same Google infrastructure that hosts Classroom is deeply connected to Google\'s broader data ecosystem â€” and third-party tools added by teachers bypass those protections.',
    thirdPartyTrackers: [
      {
        name: 'Google Analytics for Education',
        role: 'analytics',
        notes: 'Aggregate usage analytics collected under Google\'s EDU data processing terms; restricted from ad use but still in Google\'s infrastructure',
        canProfileMinors: false,
        documented: true
      },
      GOOGLE_CLOUD_INFRA,
      {
        name: 'Google Marketplace / LTI Add-ons',
        role: 'analytics',
        notes: 'Third-party apps added to Google Classroom by teachers can access student data with far fewer privacy protections than Google itself offers',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'EdTech Third-Party Vendors (via Marketplace)',
        type: 'data-marketplace',
        reachNote: 'Any EdTech app installed via Google Workspace Marketplace creates its own data flow â€” some of these vendors have weak or no FERPA compliance and may share data downstream.',
        documented: false
      }
    ]
  },

  {
    serviceId: 'classdojo',
    chainRiskLevel: 'high',
    chainSummary: 'ClassDojo stores detailed child behavioural profiles and uses Salesforce and Google Analytics â€” this connects children\'s school behaviour records to commercial data infrastructure.',
    thirdPartyTrackers: [
      SALESFORCE_MKT,
      FIREBASE_ANALYTICS,
      {
        name: 'Intercom',
        role: 'customer-data',
        notes: 'Used for in-app support messaging; stores teacher and parent communications',
        canProfileMinors: false,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'Salesforce Datorama / Marketing Cloud Intelligence',
        type: 'customer-data',
        reachNote: 'Salesforce\'s Marketing Cloud can connect to Oracle Data Cloud and other data brokers for enrichment â€” data processed through Salesforce may be enriched with broader consumer profiles.',
        documented: false
      },
      ORACLE_BLUEKAI
    ]
  },

  {
    serviceId: 'zoom',
    chainRiskLevel: 'medium',
    chainSummary: 'Zoom collects meeting metadata and content for its AI features; data processed on AWS may be used to train Zoom\'s AI models unless the school has negotiated an enterprise agreement.',
    thirdPartyTrackers: [
      AWS_INFRA,
      {
        name: 'Zoom IQ / AI Companion',
        role: 'ai-training',
        notes: 'Meeting transcripts and recordings may be used to train Zoom\'s AI features; consent management varies by account type',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'Amazon Advertising (via AWS ecosystem)',
        type: 'ad-network',
        reachNote: 'AWS infrastructure gives Amazon passive visibility into data flows; Amazon\'s advertising division is a significant data marketplace.',
        documented: false
      }
    ]
  },

  // â”€â”€ AI Apps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    serviceId: 'chatgpt',
    chainRiskLevel: 'very-high',
    chainSummary: 'Every conversation with ChatGPT is stored by OpenAI; unless you disable training, that content â€” including personal disclosures â€” may be used to train future AI models. There is no FERPA compliance for consumer accounts.',
    thirdPartyTrackers: [
      {
        name: 'Microsoft Azure (infrastructure)',
        role: 'cloud-infra',
        notes: 'OpenAI\'s backend runs on Azure; Microsoft has a significant equity stake in OpenAI and exclusive cloud agreement',
        canProfileMinors: false,
        documented: true
      },
      {
        name: 'OpenAI Training Pipeline',
        role: 'ai-training',
        notes: 'Conversations on free/Plus accounts may be used to improve models; data used in training is practically non-deletable once incorporated',
        canProfileMinors: true,
        documented: true
      },
      {
        name: 'Stripe (payments)',
        role: 'payment',
        notes: 'Billing data processed by Stripe for paid plans',
        canProfileMinors: false,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'OpenAI Research Partners',
        type: 'data-marketplace',
        reachNote: 'OpenAI may share aggregated or de-identified conversation data with research institutions and partners for AI safety and capability research.',
        documented: false
      }
    ]
  },

  {
    serviceId: 'character-ai',
    chainRiskLevel: 'very-high',
    chainSummary: 'Character.AI stores full conversation histories with AI personas; this includes highly personal disclosures and is subject to Google Cloud data practices. Linked to lawsuits over harm to minors.',
    thirdPartyTrackers: [
      GOOGLE_CLOUD_INFRA,
      FIREBASE_ANALYTICS,
      {
        name: 'Character.AI Training Pipeline',
        role: 'ai-training',
        notes: 'All conversations are used to train Character.AI\'s models; no opt-out available for free accounts',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'Google Advertising Infrastructure',
        type: 'ad-network',
        reachNote: 'Character.AI uses Google Cloud and Google Analytics; behavioural data flows within Google\'s ad ecosystem even without direct ad placement.',
        documented: false
      }
    ]
  },

  {
    serviceId: 'snapchat-my-ai',
    chainRiskLevel: 'very-high',
    chainSummary: 'My AI is built into Snapchat and shares Snap\'s full ad infrastructure; conversations are stored and factored into ad targeting â€” the same data flows that reach LiveRamp and Oracle BlueKai apply.',
    thirdPartyTrackers: [
      {
        name: 'Snap Advertising SDK',
        role: 'advertising',
        notes: 'My AI conversations sit within Snap\'s ad-targeting pipeline; user interests inferred from AI chats may influence ad delivery',
        canProfileMinors: true,
        documented: true
      },
      FIREBASE_ANALYTICS
    ],
    fourthPartyBrokers: [LIVERAMP, ORACLE_BLUEKAI]
  },

  {
    serviceId: 'meta-ai',
    chainRiskLevel: 'very-high',
    chainSummary: 'Meta AI is embedded in WhatsApp, Instagram, and Messenger â€” every AI interaction feeds Meta\'s advertising system, which connects to the largest identity-resolution and data broker network in the world.',
    thirdPartyTrackers: [
      {
        name: 'Meta AI Training & Ad Pipeline',
        role: 'ai-training',
        notes: 'Meta uses AI conversations to improve its models and, for some interactions, to inform ad targeting â€” same data infrastructure as Facebook/Instagram',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [LIVERAMP, ACXIOM, EPSILON, ORACLE_BLUEKAI, LOTAME]
  },

  {
    serviceId: 'grammarly',
    chainRiskLevel: 'high',
    chainSummary: 'Every piece of writing â€” homework, essays, emails â€” passes through Grammarly\'s servers. This gives Grammarly an unusually deep view into children\'s ideas, personal writing, and academic work.',
    thirdPartyTrackers: [
      AWS_INFRA,
      FIREBASE_ANALYTICS,
      {
        name: 'Grammarly AI Training Pipeline',
        role: 'ai-training',
        notes: 'Writing submitted to Grammarly may be used to train its AI writing assistant; enterprise/education accounts have explicit exclusions, but standard consumer accounts do not',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'Grammarly Data Partners (undisclosed)',
        type: 'data-marketplace',
        reachNote: 'Grammarly\'s privacy policy permits sharing de-identified data with third parties; the specific downstream partners are not publicly listed.',
        documented: false
      }
    ]
  },

  {
    serviceId: 'microsoft-copilot',
    chainRiskLevel: 'medium',
    chainSummary: 'Microsoft Copilot in school accounts is governed by the Microsoft EDU data terms, giving it more protection than the consumer version â€” but all interactions are stored by Microsoft and flow through Azure.',
    thirdPartyTrackers: [
      {
        name: 'Microsoft Azure AI Infrastructure',
        role: 'cloud-infra',
        notes: 'Copilot runs on Azure OpenAI; queries and responses stored per Microsoft\'s retention policy',
        canProfileMinors: false,
        documented: true
      },
      {
        name: 'Microsoft Advertising Platform',
        role: 'advertising',
        notes: 'Consumer Copilot results include ads served via Microsoft Advertising; school accounts should have ads disabled',
        canProfileMinors: false,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'Microsoft Advertising (LinkedIn Audience Network)',
        type: 'ad-network',
        reachNote: 'Microsoft\'s advertising system, backed by LinkedIn identity data, can receive signals from non-EDU Copilot usage to inform ad targeting.',
        documented: true
      }
    ]
  },

  // â”€â”€ Telecom â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    serviceId: 'verizon',
    chainRiskLevel: 'very-high',
    chainSummary: 'Verizon has continuous 24/7 visibility into your child\'s location, call patterns, and all data traffic. Verizon was fined $1.35M for secretly inserting tracking "supercookies" into all mobile HTTP traffic, and participated in the 2018 carrier location-data scandal where real-time location was sold to third-party aggregators.',
    thirdPartyTrackers: [
      {
        name: 'Verizon Custom Experience / Relevant Mobile Advertising',
        role: 'advertising',
        notes: 'Uses app usage, web browsing, and location data to build advertising profiles; opt-out is buried in account settings',
        canProfileMinors: true,
        documented: true
      },
      {
        name: 'Verizon Connect (Telematics)',
        role: 'analytics',
        notes: 'Fleet and device telemetry platform that receives device-level data from the Verizon network',
        canProfileMinors: false,
        documented: true
      },
      {
        name: 'Yahoo / Verizon Media (now Apollo Global)',
        role: 'advertising',
        notes: 'Verizon owned and operated Yahoo/AOL/Huffington Post as an ad platform; sold to Apollo Global but data agreements persist',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'Neustar / TransUnion Marketing Solutions',
        type: 'identity-resolution',
        reachNote: 'Neustar (now TransUnion) purchases carrier-level identity data to match anonymous digital IDs to real people; your child\'s device IMEI and phone number flow through this system.',
        optOutUrl: 'https://www.transunion.com/privacy/opt-out',
        documented: true
      },
      ACXIOM,
      {
        name: 'LocationSmart (historical)',
        type: 'aggregator',
        reachNote: 'LocationSmart was one of the primary buyers of real-time carrier location data in the 2018 scandal; its practices are no longer active after FCC investigation but illustrate the downstream risk.',
        documented: true
      },
      EPSILON
    ]
  },

  {
    serviceId: 'att',
    chainRiskLevel: 'very-high',
    chainSummary: 'AT&T combines carrier-level location, call metadata, and broadband browsing data. It ran "Project Hemisphere" â€” a mass surveillance program selling call records at scale â€” and its Xandr ad platform (now Microsoft) used carrier identity data for ad targeting. AT&T was the carrier most cited in congressional hearings on location-data sales.',
    thirdPartyTrackers: [
      {
        name: 'AT&T AdWorks / Xandr (now Microsoft Advertising)',
        role: 'advertising',
        notes: 'AT&T\'s ad platform used carrier identity and location data to build targeting segments; acquired by Microsoft in 2022 â€” data agreements carried over',
        canProfileMinors: true,
        documented: true
      },
      {
        name: 'AT&T Internet Preferences',
        role: 'analytics',
        notes: 'AT&T broadband customers\' web browsing history used to build ad profiles; opt-out required in AT&T account',
        canProfileMinors: true,
        documented: true
      },
      {
        name: 'Project Hemisphere (HIDTA surveillance)',
        role: 'analytics',
        notes: 'AT&T\'s government surveillance program retained decades of call records and provided "data analysis" to law enforcement; exposed by EFF and reporting by The Daily Beast (2013, 2016)',
        canProfileMinors: false,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'Microsoft Advertising (via Xandr)',
        type: 'ad-network',
        reachNote: 'After Microsoft acquired Xandr, AT&T carrier identity data feeds into Microsoft\'s advertising infrastructure, which also includes LinkedIn and Bing targeting.',
        documented: true
      },
      {
        name: 'Neustar / TransUnion Marketing Solutions',
        type: 'identity-resolution',
        reachNote: 'Phone number and device identifiers from AT&T\'s network feed Neustar\'s identity-resolution graph, enabling cross-channel profile building.',
        documented: true
      },
      ACXIOM,
      LIVERAMP
    ]
  },

  {
    serviceId: 'tmobile',
    chainRiskLevel: 'very-high',
    chainSummary: 'T-Mobile suffered the largest carrier data breach in US history (2021, 76.6M records including SSNs). It runs T-Mobile Advertising Solutions using network-level data, and inherited Sprint\'s location-data sharing practices after the 2020 merger. It also sold real-time location data in the 2018 scandal.',
    thirdPartyTrackers: [
      {
        name: 'T-Mobile Advertising Solutions',
        role: 'advertising',
        notes: 'T-Mobile uses network data (location, app category, web category) to build advertising segments; enabled by default â€” opt-out in T-Mobile app',
        canProfileMinors: true,
        documented: true
      },
      {
        name: 'T-Mobile Insights (network analytics)',
        role: 'analytics',
        notes: 'Aggregated network traffic analysis used to infer app usage, location patterns, and device behaviour across the T-Mobile subscriber base',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'Neustar / TransUnion Marketing Solutions',
        type: 'identity-resolution',
        reachNote: 'Device identifiers and subscriber data from T-Mobile\'s network flow through Neustar\'s identity graph, enabling profile matching across platforms.',
        documented: true
      },
      {
        name: 'Securus Technologies (historical)',
        type: 'aggregator',
        reachNote: 'Securus was purchasing real-time location data from T-Mobile (and other carriers) and selling it to law enforcement and bail bondsmen â€” exposed by NYT in 2018; FCC enforcement followed.',
        documented: true
      },
      ACXIOM
    ]
  },

  {
    serviceId: 'cricket-wireless',
    chainRiskLevel: 'high',
    chainSummary: 'Cricket is fully owned by AT&T and runs on the same network infrastructure â€” all AT&T data practices, including the Xandr/Microsoft ad platform and Project Hemisphere, apply to Cricket subscribers.',
    thirdPartyTrackers: [
      {
        name: 'AT&T Network Infrastructure (shared)',
        role: 'analytics',
        notes: 'Cricket operates as an MVNO on AT&T\'s network â€” all AT&T tower-level location and traffic data applies',
        canProfileMinors: true,
        documented: true
      }
    ],
    fourthPartyBrokers: [
      {
        name: 'AT&T / Microsoft Advertising (via Xandr)',
        type: 'ad-network',
        reachNote: 'AT&T\'s advertising infrastructure covers Cricket subscribers; same Xandr-to-Microsoft data flow applies.',
        documented: true
      },
      ACXIOM
    ]
  }
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Look-up helpers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Get the data chain for a specific service, or null if not mapped.
 */
export function getServiceDataChain(serviceId: string): ServiceDataChain | null {
  return serviceDataChains.find(c => c.serviceId === serviceId) || null;
}

/**
 * Get data chains for multiple service IDs at once.
 */
export function getDataChainsForServices(serviceIds: string[]): ServiceDataChain[] {
  return serviceIds
    .map(id => getServiceDataChain(id))
    .filter((c): c is ServiceDataChain => c !== null);
}

/**
 * Get all unique data broker names that appear across a list of services.
 */
export function getUniqueBrokersForServices(serviceIds: string[]): Array<{ name: string; type: BrokerType; seenIn: string[] }> {
  const chains = getDataChainsForServices(serviceIds);
  const brokerMap = new Map<string, { type: BrokerType; seenIn: string[] }>();

  chains.forEach(chain => {
    chain.fourthPartyBrokers.forEach(broker => {
      const existing = brokerMap.get(broker.name);
      if (existing) {
        existing.seenIn.push(chain.serviceId);
      } else {
        brokerMap.set(broker.name, { type: broker.type, seenIn: [chain.serviceId] });
      }
    });
  });

  return Array.from(brokerMap.entries())
    .map(([name, data]) => ({ name, type: data.type, seenIn: data.seenIn }))
    .sort((a, b) => b.seenIn.length - a.seenIn.length);
}
