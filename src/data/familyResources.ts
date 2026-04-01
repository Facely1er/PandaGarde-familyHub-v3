/**
 * Family Privacy Resources
 * Curated resources tailored to different family personas and needs
 */

export interface FamilyResource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'activity' | 'tool' | 'article' | 'video' | 'download';
  category: string[];
  personaTags: string[]; // Which personas this resource is relevant for
  ageGroups: string[]; // Age groups this resource is suitable for
  url: string;
  priority: 'high' | 'medium' | 'low';
  icon?: string;
}

export const familyResources: FamilyResource[] = [
  // Cautious Parent Resources
  {
    id: 'parental-controls-guide',
    title: 'Complete Parental Controls Guide',
    description: 'Step-by-step guide to setting up parental controls on all devices',
    type: 'guide',
    category: ['parental-controls', 'child-safety'],
    personaTags: ['cautious-parent', 'concerned-family'],
    ageGroups: ['all'],
    url: '/guides/parental-controls',
    priority: 'high',
    icon: 'Shield'
  },
  {
    id: 'family-agreement',
    title: 'Family Internet Agreement',
    description: 'Create a comprehensive safety contract for your family',
    type: 'download',
    category: ['family-safety', 'agreements'],
    personaTags: ['cautious-parent', 'privacy-focused-family'],
    ageGroups: ['all'],
    url: '/downloads/family-agreement',
    priority: 'high',
    icon: 'FileText'
  },
  {
    id: 'child-safety-alerts',
    title: 'Child Safety Alerts',
    description: 'Real-time alerts about child safety issues and privacy concerns',
    type: 'tool',
    category: ['child-safety', 'alerts'],
    personaTags: ['cautious-parent', 'concerned-family'],
    ageGroups: ['all'],
    url: '/child-safety-alerts',
    priority: 'high',
    icon: 'Bell'
  },
  {
    id: 'conversation-starters',
    title: 'Privacy Conversation Starters',
    description: 'Age-appropriate ways to talk to children about online privacy',
    type: 'guide',
    category: ['education', 'communication'],
    personaTags: ['cautious-parent', 'learning-family'],
    ageGroups: ['all'],
    url: '/parent-resources',
    priority: 'medium',
    icon: 'MessageCircle'
  },

  // Privacy-Focused Family Resources
  {
    id: 'digital-footprint',
    title: 'Digital Footprint Analysis',
    description: 'Comprehensive analysis of your family\'s online presence',
    type: 'tool',
    category: ['privacy-analysis', 'data-sharing'],
    personaTags: ['privacy-focused-family', 'tech-savvy-family'],
    ageGroups: ['all'],
    url: '/digital-footprint',
    priority: 'high',
    icon: 'Globe'
  },
  {
    id: 'service-catalog',
    title: 'Service Privacy Catalog',
    description: 'Privacy risk profiles for popular services your family uses',
    type: 'tool',
    category: ['privacy-analysis', 'services'],
    personaTags: ['privacy-focused-family', 'balanced-family'],
    ageGroups: ['all'],
    url: '/service-catalog',
    priority: 'high',
    icon: 'Search'
  },
  {
    id: 'privacy-settings-guide',
    title: 'Privacy Settings Guide',
    description: 'How to configure privacy settings across all major platforms',
    type: 'guide',
    category: ['privacy-settings', 'configuration'],
    personaTags: ['privacy-focused-family', 'tech-savvy-family'],
    ageGroups: ['all'],
    url: '/guides/privacy-settings',
    priority: 'high',
    icon: 'Settings'
  },
  {
    id: 'privacy-tools',
    title: 'Privacy Tools Directory',
    description: 'Curated list of privacy-focused tools and services',
    type: 'tool',
    category: ['tools', 'privacy'],
    personaTags: ['privacy-focused-family', 'tech-savvy-family'],
    ageGroups: ['all'],
    url: '/privacy-tools',
    priority: 'medium',
    icon: 'Wrench'
  },

  // Learning Family Resources
  {
    id: 'interactive-story',
    title: 'Privacy Panda Interactive Story',
    description: 'Engaging story that teaches children about privacy',
    type: 'activity',
    category: ['education', 'interactive'],
    personaTags: ['learning-family', 'cautious-parent'],
    ageGroups: ['5-8', '9-12'],
    url: '/interactive-story',
    priority: 'high',
    icon: 'Book'
  },
  {
    id: 'privacy-activities',
    title: 'Privacy Learning Activities',
    description: 'Fun, interactive activities to learn about privacy',
    type: 'activity',
    category: ['education', 'interactive'],
    personaTags: ['learning-family'],
    ageGroups: ['5-8', '9-12', '13-17'],
    url: '/activities',
    priority: 'high',
    icon: 'Play'
  },
  {
    id: 'age-group-guides',
    title: 'Age-Appropriate Privacy Guides',
    description: 'Privacy education tailored to different age groups',
    type: 'guide',
    category: ['education', 'age-specific'],
    personaTags: ['learning-family', 'cautious-parent'],
    ageGroups: ['all'],
    url: '/age-groups',
    priority: 'high',
    icon: 'Users'
  },
  {
    id: 'privacy-handbook',
    title: 'Family Privacy Handbook',
    description: 'Comprehensive guide to digital privacy for families',
    type: 'guide',
    category: ['education', 'comprehensive'],
    personaTags: ['learning-family', 'privacy-focused-family'],
    ageGroups: ['all'],
    url: '/privacy-handbook',
    priority: 'medium',
    icon: 'BookOpen'
  },
  {
    id: 'coloring-sheets',
    title: 'Privacy Coloring Sheets',
    description: 'Downloadable coloring pages with privacy themes',
    type: 'download',
    category: ['education', 'activities'],
    personaTags: ['learning-family'],
    ageGroups: ['5-8'],
    url: '/downloads/coloring-sheets',
    priority: 'low',
    icon: 'Palette'
  },

  // Tech-Savvy Family Resources
  {
    id: 'device-security-guide',
    title: 'Advanced Device Security Guide',
    description: 'Technical guide to securing all family devices',
    type: 'guide',
    category: ['security', 'technical'],
    personaTags: ['tech-savvy-family', 'privacy-focused-family'],
    ageGroups: ['all'],
    url: '/guides/device-security',
    priority: 'high',
    icon: 'Shield'
  },
  {
    id: 'service-relationships',
    title: 'Service Relationship Mapping',
    description: 'Understand how services share data through parent companies',
    type: 'tool',
    category: ['data-sharing', 'analysis'],
    personaTags: ['tech-savvy-family', 'privacy-focused-family'],
    ageGroups: ['all'],
    url: '/service-catalog',
    priority: 'medium',
    icon: 'Network'
  },
  {
    id: 'privacy-assessment',
    title: 'Family Privacy Assessment',
    description: 'Comprehensive assessment of your family\'s privacy practices',
    type: 'tool',
    category: ['assessment', 'analysis'],
    personaTags: ['tech-savvy-family', 'privacy-focused-family'],
    ageGroups: ['all'],
    url: '/privacy-assessment',
    priority: 'high',
    icon: 'ClipboardCheck'
  },

  // Balanced Family Resources
  {
    id: 'quick-start',
    title: 'Quick Start Guide',
    description: 'Get started with privacy protection in 5 easy steps',
    type: 'guide',
    category: ['getting-started', 'practical'],
    personaTags: ['balanced-family', 'learning-family'],
    ageGroups: ['all'],
    url: '/quick-start',
    priority: 'high',
    icon: 'Rocket'
  },
  {
    id: 'practical-privacy-tips',
    title: 'Practical Privacy Tips',
    description: 'Easy-to-implement privacy tips for busy families',
    type: 'article',
    category: ['tips', 'practical'],
    personaTags: ['balanced-family'],
    ageGroups: ['all'],
    url: '/parent-resources',
    priority: 'medium',
    icon: 'Lightbulb'
  },
  {
    id: 'safety-posters',
    title: 'Digital Safety Posters',
    description: 'Downloadable posters with privacy reminders',
    type: 'download',
    category: ['visual-reminders', 'education'],
    personaTags: ['balanced-family', 'learning-family'],
    ageGroups: ['all'],
    url: '/downloads/safety-posters',
    priority: 'low',
    icon: 'Image'
  },

  // Concerned Family Resources
  {
    id: 'urgent-privacy-fixes',
    title: 'Urgent Privacy Fixes',
    description: 'Immediate actions to protect your family\'s privacy',
    type: 'guide',
    category: ['urgent', 'immediate-actions'],
    personaTags: ['concerned-family', 'cautious-parent'],
    ageGroups: ['all'],
    url: '/guides/urgent-protection',
    priority: 'high',
    icon: 'AlertTriangle'
  },
  {
    id: 'risk-assessment',
    title: 'Privacy Risk Assessment',
    description: 'Identify and prioritize privacy risks for your family',
    type: 'tool',
    category: ['assessment', 'risk-analysis'],
    personaTags: ['concerned-family'],
    ageGroups: ['all'],
    url: '/privacy-assessment',
    priority: 'high',
    icon: 'AlertCircle'
  },
  {
    id: 'breach-alerts',
    title: 'Data Breach Alerts',
    description: 'Stay informed about data breaches affecting your family',
    type: 'tool',
    category: ['alerts', 'breaches'],
    personaTags: ['concerned-family', 'privacy-focused-family'],
    ageGroups: ['all'],
    url: '/child-safety-alerts',
    priority: 'high',
    icon: 'Bell'
  }
];

/**
 * Get resources filtered by persona
 */
export function getResourcesByPersona(personaId: string): FamilyResource[] {
  return familyResources.filter(resource => 
    resource.personaTags.includes(personaId)
  ).sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Get resources filtered by category
 */
export function getResourcesByCategory(category: string): FamilyResource[] {
  return familyResources.filter(resource => 
    resource.category.includes(category)
  );
}

/**
 * Get resources filtered by age group
 */
export function getResourcesByAgeGroup(ageGroup: string): FamilyResource[] {
  return familyResources.filter(resource => 
    resource.ageGroups.includes(ageGroup) || resource.ageGroups.includes('all')
  );
}

/**
 * Get recommended resources based on persona and priorities
 */
export function getRecommendedResources(
  personaId: string,
  priorities: string[] = []
): FamilyResource[] {
  let resources = getResourcesByPersona(personaId);
  
  // Filter by priorities if provided
  if (priorities.length > 0) {
    resources = resources.filter(resource =>
      priorities.some(priority => resource.category.includes(priority))
    );
  }
  
  // Sort by priority and relevance
  return resources.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) {return priorityDiff;}
    
    // If priorities are equal, prefer resources that match more categories
    const aMatches = priorities.filter(p => a.category.includes(p)).length;
    const bMatches = priorities.filter(p => b.category.includes(p)).length;
    return bMatches - aMatches;
  });
}

