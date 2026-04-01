/**
 * Service Relationships for Child Services
 * Maps parent companies, subsidiaries, and related services
 * Used for understanding data sharing networks and privacy implications
 */

export interface ServiceRelationship {
  parent?: string;
  parentName?: string;
  siblings?: string[];
  category?: string;
}

export const serviceRelationships: Record<string, ServiceRelationship> = {
  // Meta/Facebook ecosystem
  'instagram': {
    parent: 'meta',
    parentName: 'Meta',
    siblings: ['facebook', 'whatsapp'],
    category: 'social-media'
  },
  'whatsapp': {
    parent: 'meta',
    parentName: 'Meta',
    siblings: ['facebook', 'instagram'],
    category: 'messaging'
  },
  
  // Google/Alphabet ecosystem
  'youtube': {
    parent: 'alphabet',
    parentName: 'Google',
    siblings: ['youtube-kids'],
    category: 'streaming'
  },
  'youtube-kids': {
    parent: 'alphabet',
    parentName: 'Google',
    siblings: ['youtube'],
    category: 'streaming'
  },
  
  // Microsoft ecosystem
  'minecraft': {
    parent: 'microsoft',
    parentName: 'Microsoft',
    siblings: [],
    category: 'gaming'
  },
  
  // Epic Games ecosystem
  'fortnite': {
    parent: 'epic-games',
    parentName: 'Epic Games',
    siblings: [],
    category: 'gaming'
  },
  
  // Roblox Corporation
  'roblox': {
    parent: 'roblox-corp',
    parentName: 'Roblox Corporation',
    siblings: [],
    category: 'gaming'
  },
  
  // MIT (Scratch)
  'scratch': {
    parent: 'mit',
    parentName: 'MIT',
    siblings: [],
    category: 'creative'
  },
  
  // Duolingo
  'duolingo': {
    parent: 'duolingo-inc',
    parentName: 'Duolingo',
    siblings: [],
    category: 'education'
  },
  
  // Khan Academy
  'khan-academy': {
    parent: 'khan-academy-org',
    parentName: 'Khan Academy',
    siblings: [],
    category: 'education'
  },
  
  // Netflix
  'netflix': {
    parent: 'netflix-inc',
    parentName: 'Netflix',
    siblings: [],
    category: 'streaming'
  },
  
  // Snap Inc.
  'snapchat': {
    parent: 'snap-inc',
    parentName: 'Snap Inc.',
    siblings: [],
    category: 'social-media'
  },
  
  // ByteDance (TikTok)
  'tiktok': {
    parent: 'bytedance',
    parentName: 'ByteDance',
    siblings: [],
    category: 'social-media'
  },

  // â”€â”€ EdTech / School Platforms â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // Google / Alphabet EdTech
  'google-classroom': {
    parent: 'alphabet',
    parentName: 'Google',
    siblings: ['youtube', 'youtube-kids'],
    category: 'edtech'
  },

  // Microsoft EdTech
  'microsoft-teams-edu': {
    parent: 'microsoft',
    parentName: 'Microsoft',
    siblings: ['minecraft', 'flip'],
    category: 'edtech'
  },
  'flip': {
    parent: 'microsoft',
    parentName: 'Microsoft',
    siblings: ['minecraft', 'microsoft-teams-edu'],
    category: 'edtech'
  },

  // Instructure (Canvas)
  'canvas-lms': {
    parent: 'instructure',
    parentName: 'Instructure',
    siblings: [],
    category: 'edtech'
  },

  // PowerSchool (Schoology)
  'schoology': {
    parent: 'powerschool',
    parentName: 'PowerSchool',
    siblings: [],
    category: 'edtech'
  },

  // Renaissance Learning (Nearpod + STAR/AR)
  'nearpod': {
    parent: 'renaissance',
    parentName: 'Renaissance Learning',
    siblings: ['renaissance-learning'],
    category: 'edtech'
  },
  'renaissance-learning': {
    parent: 'renaissance',
    parentName: 'Renaissance Learning',
    siblings: ['nearpod'],
    category: 'edtech'
  },

  // Discovery Education (DreamBox)
  'dreambox': {
    parent: 'discovery-education',
    parentName: 'Discovery Education',
    siblings: [],
    category: 'edtech'
  },

  // Cambium Learning Group (Lexia)
  'lexia': {
    parent: 'cambium',
    parentName: 'Cambium Learning Group',
    siblings: [],
    category: 'edtech'
  },

  // Independent EdTech vendors
  'seesaw': {
    parent: 'seesaw-learning',
    parentName: 'Seesaw Learning',
    siblings: [],
    category: 'edtech'
  },
  'zoom': {
    parent: 'zoom-video',
    parentName: 'Zoom Video Communications',
    siblings: [],
    category: 'edtech'
  },
  'classdojo': {
    parent: 'classdojo-inc',
    parentName: 'ClassDojo',
    siblings: [],
    category: 'edtech'
  },
  'remind': {
    parent: 'remind-inc',
    parentName: 'Remind',
    siblings: [],
    category: 'edtech'
  },
  'kahoot': {
    parent: 'kahoot-as',
    parentName: 'Kahoot AS',
    siblings: [],
    category: 'edtech'
  },
  'quizlet': {
    parent: 'quizlet-inc',
    parentName: 'Quizlet',
    siblings: [],
    category: 'edtech'
  },
  'ixl': {
    parent: 'ixl-learning',
    parentName: 'IXL Learning',
    siblings: [],
    category: 'edtech'
  },
  'newsela': {
    parent: 'sandbox-edtech',
    parentName: 'Sandbox EdTech',
    siblings: [],
    category: 'edtech'
  },
  'edpuzzle': {
    parent: 'edpuzzle-inc',
    parentName: 'Edpuzzle',
    siblings: [],
    category: 'edtech'
  },
  'prodigy': {
    parent: 'prodigy-education',
    parentName: 'Prodigy Education',
    siblings: [],
    category: 'edtech'
  },
  'code-org': {
    parent: 'code-org-nonprofit',
    parentName: 'Code.org (Non-profit)',
    siblings: [],
    category: 'edtech'
  },
  'padlet': {
    parent: 'wallwisher',
    parentName: 'Wallwisher',
    siblings: [],
    category: 'edtech'
  },

  // â”€â”€ AI Apps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  'chatgpt': {
    parent: 'openai',
    parentName: 'OpenAI',
    siblings: [],
    category: 'ai'
  },
  'google-gemini': {
    parent: 'alphabet',
    parentName: 'Google',
    siblings: ['youtube', 'youtube-kids', 'google-classroom', 'socratic'],
    category: 'ai'
  },
  'microsoft-copilot': {
    parent: 'microsoft',
    parentName: 'Microsoft',
    siblings: ['minecraft', 'microsoft-teams-edu', 'flip'],
    category: 'ai'
  },
  'character-ai': {
    parent: 'character-technologies',
    parentName: 'Character Technologies',
    siblings: [],
    category: 'ai'
  },
  'snapchat-my-ai': {
    parent: 'snap-inc',
    parentName: 'Snap Inc.',
    siblings: ['snapchat'],
    category: 'ai'
  },
  'meta-ai': {
    parent: 'meta',
    parentName: 'Meta',
    siblings: ['instagram', 'whatsapp'],
    category: 'ai'
  },
  'grammarly': {
    parent: 'grammarly-inc',
    parentName: 'Grammarly Inc.',
    siblings: [],
    category: 'ai'
  },
  'perplexity-ai': {
    parent: 'perplexity-ai-inc',
    parentName: 'Perplexity AI',
    siblings: [],
    category: 'ai'
  },
  'socratic': {
    parent: 'alphabet',
    parentName: 'Google',
    siblings: ['youtube', 'youtube-kids', 'google-classroom', 'google-gemini'],
    category: 'ai'
  },
  'khanmigo': {
    parent: 'khan-academy-org',
    parentName: 'Khan Academy',
    siblings: ['khan-academy'],
    category: 'ai'
  },

  // â”€â”€ Telecom â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  'verizon': {
    parent: 'verizon-communications',
    parentName: 'Verizon Communications',
    siblings: ['visible'],
    category: 'telecom'
  },
  'att': {
    parent: 'att-inc',
    parentName: 'AT&T Inc.',
    siblings: ['cricket-wireless'],
    category: 'telecom'
  },
  'tmobile': {
    parent: 'deutsche-telekom',
    parentName: 'Deutsche Telekom / T-Mobile US',
    siblings: ['boost-mobile', 'mint-mobile'],
    category: 'telecom'
  },
  'cricket-wireless': {
    parent: 'att-inc',
    parentName: 'AT&T Inc.',
    siblings: ['att'],
    category: 'telecom'
  },
  'boost-mobile': {
    parent: 'dish-wireless',
    parentName: 'DISH Wireless (EchoStar)',
    siblings: [],
    category: 'telecom'
  },
  'mint-mobile': {
    parent: 'deutsche-telekom',
    parentName: 'Deutsche Telekom / T-Mobile US',
    siblings: ['tmobile', 'boost-mobile'],
    category: 'telecom'
  }
};

/**
 * Get relationship information for a service
 */
export function getServiceRelationship(serviceId: string): ServiceRelationship | null {
  return serviceRelationships[serviceId] || null;
}

/**
 * Get all sibling services for a given service
 */
export function getSiblingServices(serviceId: string): string[] {
  const relationship = serviceRelationships[serviceId];
  return relationship?.siblings || [];
}

/**
 * Get parent company name for a service
 */
export function getParentCompany(serviceId: string): string | null {
  const relationship = serviceRelationships[serviceId];
  return relationship?.parentName || null;
}

/**
 * Get all services under a parent company
 */
export function getServicesByParent(parentId: string): string[] {
  return Object.entries(serviceRelationships)
    .filter(([_, relationship]) => relationship.parent === parentId)
    .map(([serviceId]) => serviceId);
}

/**
 * Check if two services are related (same parent or siblings)
 */
export function areServicesRelated(serviceId1: string, serviceId2: string): boolean {
  const rel1 = serviceRelationships[serviceId1];
  const rel2 = serviceRelationships[serviceId2];
  
  if (!rel1 || !rel2) {return false;}
  
  // Same parent
  if (rel1.parent && rel2.parent && rel1.parent === rel2.parent) {
    return true;
  }
  
  // Siblings
  if (rel1.siblings?.includes(serviceId2) || rel2.siblings?.includes(serviceId1)) {
    return true;
  }
  
  return false;
}

