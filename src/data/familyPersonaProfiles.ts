/**
 * Family Privacy Persona Profiles
 * Adapted for PandaGarde\'s family-focused privacy education platform
 */

export interface FamilyPersonaProfile {
  id: string;
  name: string;
  description: string;
  primaryConcerns: string[];
  riskThreshold: 'low' | 'moderate' | 'high' | 'educational';
  preferredActions: string[];
  dashboardPriorities: string[];
  resourceFilters: string[];
  toolkitFocus: string[];
  color: string;
  icon: string;
  characteristics: string[];
  recommendedResources: string[];
}

export const FamilyPersonaProfiles: Record<string, FamilyPersonaProfile> = {
  'cautious-parent': {
    id: 'cautious-parent',
    name: 'Cautious Parent',
    description: 'Protecting family digital privacy and safety with active monitoring',
    primaryConcerns: ['child-safety', 'family-privacy', 'parental-controls', 'online-predators'],
    riskThreshold: 'high',
    preferredActions: ['immediate', 'family-focused', 'monitoring'],
    dashboardPriorities: ['child-protection', 'family-monitoring', 'school-privacy', 'safety-alerts'],
    resourceFilters: ['family-guides', 'child-safety', 'parental-tools', 'safety-resources'],
    toolkitFocus: ['family-protection', 'monitoring-tools', 'safe-communication', 'parental-controls'],
    color: 'blue',
    icon: 'Users',
    characteristics: [
      'Regularly monitors children\'s online activity',
      'Uses parental control tools',
      'Has clear rules about online sharing',
      'Prioritizes child safety over convenience'
    ],
    recommendedResources: [
      '/parent-resources',
      '/guides/parental-controls',
      '/child-safety-alerts',
      '/downloads/family-agreement'
    ]
  },
  
  'privacy-focused-family': {
    id: 'privacy-focused-family',
    name: 'Privacy-Focused Family',
    description: 'Maximum privacy protection for the entire family',
    primaryConcerns: ['data-minimization', 'privacy-settings', 'data-sharing', 'anonymity'],
    riskThreshold: 'high',
    preferredActions: ['advanced', 'comprehensive', 'privacy-maximizing'],
    dashboardPriorities: ['privacy-metrics', 'data-sharing', 'privacy-settings', 'footprint-analysis'],
    resourceFilters: ['privacy-guides', 'advanced-privacy', 'data-protection', 'privacy-tools'],
    toolkitFocus: ['privacy-tools', 'data-deletion', 'anonymity-tools', 'privacy-settings'],
    color: 'purple',
    icon: 'Shield',
    characteristics: [
      'Reviews privacy policies regularly',
      'Minimizes data sharing',
      'Uses privacy-focused services',
      'Teaches children about privacy from early age'
    ],
    recommendedResources: [
      '/privacy-tools',
      '/digital-footprint',
      '/guides/privacy-settings',
      '/service-catalog'
    ]
  },
  
  'learning-family': {
    id: 'learning-family',
    name: 'Learning Family',
    description: 'Building privacy knowledge together through education',
    primaryConcerns: ['education', 'learning', 'basic-security', 'understanding'],
    riskThreshold: 'educational',
    preferredActions: ['guided', 'step-by-step', 'educational', 'interactive'],
    dashboardPriorities: ['learning-modules', 'progress-tracking', 'educational-content', 'activities'],
    resourceFilters: ['beginner-guides', 'educational-content', 'interactive-activities', 'learning-resources'],
    toolkitFocus: ['learning-tools', 'educational-resources', 'interactive-activities', 'progress-tracking'],
    color: 'green',
    icon: 'BookOpen',
    characteristics: [
      'Values privacy education',
      'Learns together as a family',
      'Uses interactive activities',
      'Tracks progress and achievements'
    ],
    recommendedResources: [
      '/activities',
      '/interactive-story',
      '/age-groups',
      '/privacy-handbook'
    ]
  },
  
  'tech-savvy-family': {
    id: 'tech-savvy-family',
    name: 'Tech-Savvy Family',
    description: 'Advanced technical knowledge with focus on security',
    primaryConcerns: ['advanced-security', 'technical-privacy', 'device-security', 'network-security'],
    riskThreshold: 'moderate',
    preferredActions: ['technical', 'advanced', 'automated'],
    dashboardPriorities: ['security-metrics', 'device-security', 'network-monitoring', 'advanced-tools'],
    resourceFilters: ['advanced-guides', 'technical-resources', 'security-tools', 'advanced-privacy'],
    toolkitFocus: ['advanced-tools', 'security-tools', 'automation-tools', 'technical-resources'],
    color: 'teal',
    icon: 'Settings',
    characteristics: [
      'Uses advanced security tools',
      'Implements technical solutions',
      'Stays updated on security trends',
      'Teaches children technical privacy skills'
    ],
    recommendedResources: [
      '/privacy-tools',
      '/guides/device-security',
      '/service-catalog',
      '/digital-footprint'
    ]
  },
  
  'balanced-family': {
    id: 'balanced-family',
    name: 'Balanced Family',
    description: 'Balancing privacy with convenience and usability',
    primaryConcerns: ['practical-privacy', 'usability', 'convenience', 'reasonable-protection'],
    riskThreshold: 'moderate',
    preferredActions: ['practical', 'balanced', 'user-friendly'],
    dashboardPriorities: ['practical-tips', 'easy-solutions', 'quick-wins', 'mainstream-tools'],
    resourceFilters: ['practical-guides', 'easy-solutions', 'mainstream-tools', 'quick-tips'],
    toolkitFocus: ['practical-tools', 'easy-to-use', 'mainstream-services', 'convenient-solutions'],
    color: 'amber',
    icon: 'Target',
    characteristics: [
      'Seeks practical solutions',
      'Balances privacy with convenience',
      'Uses mainstream tools',
      'Focuses on reasonable protection'
    ],
    recommendedResources: [
      '/quick-start',
      '/guides/practical-privacy',
      '/service-catalog',
      '/parent-resources'
    ]
  },
  
  'concerned-family': {
    id: 'concerned-family',
    name: 'Concerned Family',
    description: 'Recently aware of privacy risks and seeking immediate help',
    primaryConcerns: ['immediate-risks', 'data-breaches', 'online-threats', 'urgent-protection'],
    riskThreshold: 'high',
    preferredActions: ['immediate', 'urgent', 'quick-fixes'],
    dashboardPriorities: ['risk-assessment', 'immediate-actions', 'safety-alerts', 'quick-fixes'],
    resourceFilters: ['urgent-guides', 'immediate-actions', 'risk-assessment', 'safety-resources'],
    toolkitFocus: ['immediate-protection', 'risk-mitigation', 'safety-tools', 'quick-solutions'],
    color: 'red',
    icon: 'AlertTriangle',
    characteristics: [
      'Recently discovered privacy risks',
      'Needs immediate guidance',
      'Wants quick solutions',
      'High concern about current exposure'
    ],
    recommendedResources: [
      '/privacy-assessment',
      '/child-safety-alerts',
      '/quick-start',
      '/guides/urgent-protection'
    ]
  }
};

export const PersonaColors: Record<string, string> = {
  'cautious-parent': 'blue',
  'privacy-focused-family': 'purple',
  'learning-family': 'green',
  'tech-savvy-family': 'teal',
  'balanced-family': 'amber',
  'concerned-family': 'red'
};

export function getPersonaProfile(personaId: string): FamilyPersonaProfile | null {
  return FamilyPersonaProfiles[personaId] || null;
}

export function getAllPersonas(): FamilyPersonaProfile[] {
  return Object.values(FamilyPersonaProfiles);
}

