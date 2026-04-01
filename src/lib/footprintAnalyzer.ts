/**
 * Digital Footprint Analyzer for Families
 * Analyzes family's online presence and privacy exposure
 * Provides actionable insights and recommendations
 */

import { childServiceCatalog, type ChildService } from '../data/childServiceCatalog';
import { calculatePrivacyExposureIndex, getExposureLevel } from './privacyExposureIndex';
import { getServiceRelationship, getSiblingServices } from '../data/serviceRelationships';
import { getDataChainsForServices, getUniqueBrokersForServices, type ServiceDataChain } from '../data/dataBrokerNetwork';

/** Map app category to where the app is typically used: school (EdTech), home, or in-between (both / everywhere). */
function getUsageContext(category: string): UsageContext {
  // edtech = school-assigned platforms (LMS, assessment, classroom tools)
  // education = family-chosen learning apps (Khan Academy, Duolingo, etc.)
  if (category === 'edtech' || category === 'education') {
    return 'school';
  }
  if (category === 'streaming' || category === 'creative') {
    return 'home';
  }
  // ai apps used everywhere — social media, messaging, gaming, ai, other
  return 'in-between';
}

const CONTEXT_LABELS: Record<UsageContext, { label: string; description: string }> = {
  school: {
    label: 'At school & learning',
    description: 'Apps used for school or learning — including school-assigned platforms (LMS, assessment tools) and family-chosen education apps. School-assigned apps expose your child\'s data even without a family choice.'
  },
  home: {
    label: 'At home',
    description: 'Apps used mainly at home (e.g. streaming, creative tools). Data stays in home devices but can still be collected by the app.'
  },
  'in-between': {
    label: 'Everywhere / in-between',
    description: 'Apps used at home, on the go, or in both (e.g. social media, messaging, games). Data exposure can add up across devices and places.'
  }
};

export interface FootprintAnalysis {
  familyScore: number; // 0-100, higher = larger footprint
  totalServices: number;
  totalMembers: number;
  averageExposureIndex: number;
  categoryBreakdown: CategoryBreakdown[];
  /** Apps grouped by where they're used: school (EdTech), home, in-between. Shows how data exposure accumulates across contexts. */
  contextBreakdown: ContextBreakdown[];
  serviceRisks: ServiceRisk[];
  dataSharingNetwork: DataSharingNode[];
  recommendations: Recommendation[];
  privacyScore: number; // 0-100, higher = better privacy
  /** Deep trace: 3rd/4th party trackers and data broker chains for tracked services */
  dataBrokerAnalysis: DataBrokerAnalysis;
  /** AI-specific risks for any AI category apps in the family's list */
  aiRiskSummary: AiRiskSummary | null;
}

/** Summary of 3rd-party and 4th-party (data broker) data flows */
export interface DataBrokerAnalysis {
  totalMappedServices: number;
  totalUniqueThirdParties: number;
  totalUniqueBrokers: number;
  /** Per-service chain entries, only for services we have mapping data for */
  serviceChains: Array<{
    serviceId: string;
    serviceName: string;
    thirdPartyCount: number;
    brokerCount: number;
    chainSummary: string;
    chainRiskLevel: 'low' | 'medium' | 'high' | 'very-high';
  }>;
  /** Brokers that appear across MULTIPLE services — data convergence risk */
  crossServiceBrokers: Array<{
    name: string;
    type: string;
    seenInServices: string[]; // service names
    note: string;
  }>;
}

/** Summary of AI-specific privacy risks */
export interface AiRiskSummary {
  totalAiApps: number;
  trainingDataRisk: boolean;    // at least one app uses conversations for AI training
  noFerpaApps: string[];        // AI apps with no FERPA compliance
  highRiskAiApps: string[];     // very-high risk AI apps
  keyWarnings: string[];
}

export type UsageContext = 'school' | 'home' | 'in-between';

export interface ContextBreakdown {
  context: UsageContext;
  label: string;
  description: string;
  count: number;
  averageExposure: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  serviceRisks: ServiceRisk[];
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  averageExposure: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
}

export interface ServiceRisk {
  serviceId: string;
  serviceName: string;
  category: string;
  exposureIndex: number;
  exposureLevel: ReturnType<typeof getExposureLevel>;
  riskFactors: string[];
  memberCount: number; // How many family members use this service
}

export interface DataSharingNode {
  serviceId: string;
  serviceName: string;
  parentCompany?: string;
  siblings: string[];
  dataShared: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'privacy' | 'safety' | 'data-sharing' | 'settings';
  title: string;
  description: string;
  actionItems: string[];
  affectedServices: string[];
}

export class FootprintAnalyzer {
  /**
   * Analyze family's digital footprint
   */
  analyzeFamilyFootprint(
    familyMembers: Array<{
      id: string;
      services?: Array<{ serviceId: string; status?: string }>;
    }>,
    memberServices: Record<string, string[]> = {}
  ): FootprintAnalysis {
    // Collect all unique service IDs from family members
    const allServiceIds = new Set<string>();
    const serviceMemberMap = new Map<string, Set<string>>(); // serviceId -> memberIds

    familyMembers.forEach(member => {
      const memberServiceIds = memberServices[member.id] || 
        (member as any).services?.map((s: any) => s.serviceId) || [];
      
      memberServiceIds.forEach(serviceId => {
        allServiceIds.add(serviceId);
        if (!serviceMemberMap.has(serviceId)) {
          serviceMemberMap.set(serviceId, new Set());
        }
        serviceMemberMap.get(serviceId)!.add(member.id);
      });
    });

    const serviceIds = Array.from(allServiceIds);
    const totalServices = serviceIds.length;
    const totalMembers = familyMembers.length;

    // Analyze services
    const serviceRisks: ServiceRisk[] = serviceIds.map(serviceId => {
      const service = childServiceCatalog.find(s => s.id === serviceId);
      if (!service) {
        return null;
      }

      const exposureIndex = calculatePrivacyExposureIndex(serviceId) || 0;
      const exposureLevel = getExposureLevel(exposureIndex);
      const memberCount = serviceMemberMap.get(serviceId)?.size || 0;

      return {
        serviceId,
        serviceName: service.name,
        category: service.category,
        exposureIndex,
        exposureLevel,
        riskFactors: service.privacyConcerns || [],
        memberCount
      };
    }).filter((r): r is ServiceRisk => r !== null);

    // Calculate average exposure index
    const totalExposure = serviceRisks.reduce((sum, risk) => sum + risk.exposureIndex, 0);
    const averageExposureIndex = serviceRisks.length > 0 
      ? Math.round(totalExposure / serviceRisks.length) 
      : 0;

    // Category breakdown
    const categoryMap = new Map<string, { count: number; totalExposure: number }>();
    serviceRisks.forEach(risk => {
      const existing = categoryMap.get(risk.category) || { count: 0, totalExposure: 0 };
      categoryMap.set(risk.category, {
        count: existing.count + 1,
        totalExposure: existing.totalExposure + risk.exposureIndex
      });
    });

    const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(([category, data]) => {
      const averageExposure = Math.round(data.totalExposure / data.count);
      const exposureLevel = getExposureLevel(averageExposure);
      
      let riskLevel: 'low' | 'medium' | 'high' | 'very-high' = 'low';
      if (averageExposure >= 70) {riskLevel = 'very-high';}
      else if (averageExposure >= 50) {riskLevel = 'high';}
      else if (averageExposure >= 30) {riskLevel = 'medium';}

      return {
        category,
        count: data.count,
        averageExposure,
        riskLevel
      };
    });

    // Context breakdown: school (EdTech), home, in-between — how data exposure accumulates across life contexts
    const contextMap = new Map<UsageContext, ServiceRisk[]>();
    serviceRisks.forEach(risk => {
      const ctx = getUsageContext(risk.category);
      if (!contextMap.has(ctx)) {
        contextMap.set(ctx, []);
      }
      contextMap.get(ctx)!.push(risk);
    });
    const contextBreakdown: ContextBreakdown[] = (['school', 'home', 'in-between'] as UsageContext[]).map(ctx => {
      const risks = contextMap.get(ctx) || [];
      const count = risks.length;
      const totalExposure = risks.reduce((s, r) => s + r.exposureIndex, 0);
      const averageExposure = count > 0 ? Math.round(totalExposure / count) : 0;
      let riskLevel: 'low' | 'medium' | 'high' | 'very-high' = 'low';
      if (averageExposure >= 70) {
        riskLevel = 'very-high';
      } else if (averageExposure >= 50) {
        riskLevel = 'high';
      } else if (averageExposure >= 30) {
        riskLevel = 'medium';
      }
      return {
        context: ctx,
        label: CONTEXT_LABELS[ctx].label,
        description: CONTEXT_LABELS[ctx].description,
        count,
        averageExposure,
        riskLevel,
        serviceRisks: risks
      };
    }).filter(c => c.count > 0);

    // Data sharing network
    const dataSharingNetwork: DataSharingNode[] = serviceRisks.map(risk => {
      const relationship = getServiceRelationship(risk.serviceId);
      const siblings = getSiblingServices(risk.serviceId);
      
      // Determine data shared based on category and risk
      const dataShared: string[] = [];
      if (risk.category === 'social-media') {
        dataShared.push('Profile Information', 'Posts & Photos', 'Location Data', 'Activity Logs');
      } else if (risk.category === 'messaging') {
        dataShared.push('Messages', 'Contacts', 'Metadata');
      } else if (risk.category === 'gaming') {
        dataShared.push('Game Progress', 'In-Game Purchases', 'Social Interactions');
      } else if (risk.category === 'streaming') {
        dataShared.push('Viewing History', 'Preferences', 'Device Information');
      } else if (risk.category === 'edtech') {
        dataShared.push('Student Records', 'Learning Analytics', 'Assessment Data', 'Usage Behavior', 'Behavioral Profiles');
      } else if (risk.category === 'education') {
        dataShared.push('Learning Progress', 'Performance Data', 'Usage Patterns');
      } else if (risk.category === 'ai') {
        dataShared.push('Conversation History', 'Prompts & Queries', 'Personal Disclosures', 'AI Training Data');
      } else if (risk.category === 'telecom') {
        dataShared.push('Real-Time Location', 'Call & SMS Metadata', 'Device Identifiers (IMEI/IMSI)', 'App & Data Traffic Patterns');
      }

      let networkRiskLevel: 'low' | 'medium' | 'high' = 'low';
      if (relationship?.parent && siblings.length > 0) {
        networkRiskLevel = 'high';
      } else if (relationship?.parent || siblings.length > 0) {
        networkRiskLevel = 'medium';
      }

      return {
        serviceId: risk.serviceId,
        serviceName: risk.serviceName,
        parentCompany: relationship?.parentName,
        siblings: siblings.map(id => {
          const s = childServiceCatalog.find(service => service.id === id);
          return s?.name || id;
        }),
        dataShared,
        riskLevel: networkRiskLevel
      };
    });

    // Calculate family footprint score (0-100, higher = larger footprint)
    const footprintScore = this.calculateFootprintScore(
      serviceRisks,
      averageExposureIndex,
      totalServices,
      totalMembers
    );

    // Calculate privacy score (0-100, higher = better privacy)
    const privacyScore = Math.max(0, 100 - footprintScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      serviceRisks,
      categoryBreakdown,
      dataSharingNetwork,
      averageExposureIndex
    );

    // Deep trace: data broker analysis
    const dataBrokerAnalysis = this.analyzeDataBrokerChains(serviceIds, serviceRisks);

    // AI risk summary
    const aiRiskSummary = this.analyzeAiRisks(serviceRisks);

    return {
      familyScore: footprintScore,
      totalServices,
      totalMembers,
      averageExposureIndex,
      categoryBreakdown,
      contextBreakdown,
      serviceRisks,
      dataSharingNetwork,
      recommendations,
      privacyScore,
      dataBrokerAnalysis,
      aiRiskSummary
    };
  }

  /**
   * Calculate overall footprint score
   */
  private calculateFootprintScore(
    serviceRisks: ServiceRisk[],
    averageExposure: number,
    totalServices: number,
    totalMembers: number
  ): number {
    // Base score from average exposure (0-40 points)
    let score = averageExposure * 0.4;

    // Number of services (0-20 points)
    score += Math.min(totalServices * 2, 20);

    // High-risk services (0-25 points)
    const highRiskServices = serviceRisks.filter(r => r.exposureIndex >= 70).length;
    score += Math.min(highRiskServices * 5, 25);

    // Services with data sharing networks (0-15 points)
    const networkedServices = serviceRisks.filter(r => {
      const relationship = getServiceRelationship(r.serviceId);
      return relationship?.parent !== undefined;
    }).length;
    score += Math.min(networkedServices * 3, 15);

    return Math.min(Math.round(score), 100);
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(
    serviceRisks: ServiceRisk[],
    categoryBreakdown: CategoryBreakdown[],
    dataSharingNetwork: DataSharingNode[],
    averageExposure: number
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // School-assigned services — involuntary exposure
    const schoolAssignedServices = serviceRisks.filter(r => {
      const service = childServiceCatalog.find(s => s.id === r.serviceId);
      return service?.schoolAssigned === true;
    });
    if (schoolAssignedServices.length > 0) {
      recommendations.push({
        id: 'school-assigned-exposure',
        priority: 'high',
        category: 'privacy',
        title: 'School-Assigned Apps — Involuntary Exposure',
        description: `Your child uses ${schoolAssignedServices.length} app${schoolAssignedServices.length > 1 ? 's' : ''} assigned by school. Unlike family-chosen apps, you may have limited control over these — but you still have rights.`,
        actionItems: [
          'Ask your school for a list of all EdTech vendors they use and their data agreements',
          'Under FERPA, you have the right to review your child\'s education records — including digital ones',
          'Request data deletion for school-assigned tools your child no longer uses',
          'Ask your school district whether each vendor is FERPA- and COPPA-compliant',
          'Check state laws (e.g. Student Privacy laws) for additional protections in your state'
        ],
        affectedServices: schoolAssignedServices.map(r => r.serviceId)
      });
    }

    // High exposure services
    const highRiskServices = serviceRisks.filter(r => r.exposureIndex >= 70);
    if (highRiskServices.length > 0) {
      recommendations.push({
        id: 'high-risk-services',
        priority: 'high',
        category: 'privacy',
        title: 'Review High-Risk Services',
        description: `Your family uses ${highRiskServices.length} service${highRiskServices.length > 1 ? 's' : ''} with very high privacy exposure.`,
        actionItems: [
          'Review privacy settings for these services',
          'Consider limiting usage or finding alternatives',
          'Set up parental controls where available',
          'Discuss privacy risks with family members'
        ],
        affectedServices: highRiskServices.map(r => r.serviceId)
      });
    }

    // Data sharing networks
    const networkedServices = dataSharingNetwork.filter(n => n.parentCompany);
    if (networkedServices.length > 0) {
      const parentCompanies = new Set(networkedServices.map(n => n.parentCompany).filter(Boolean));
      recommendations.push({
        id: 'data-sharing-networks',
        priority: 'medium',
        category: 'data-sharing',
        title: 'Data Sharing Networks Detected',
        description: `Your family uses services from ${parentCompanies.size} parent compan${parentCompanies.size > 1 ? 'ies' : 'y'} that may share data across services.`,
        actionItems: [
          'Review privacy settings across all related services',
          'Understand how data is shared between sibling services',
          'Consider limiting services from the same parent company',
          'Review privacy policies for data sharing practices'
        ],
        affectedServices: networkedServices.map(n => n.serviceId)
      });
    }

    // Social media concentration
    const socialMediaServices = serviceRisks.filter(r => r.category === 'social-media');
    if (socialMediaServices.length >= 3) {
      recommendations.push({
        id: 'social-media-concentration',
        priority: 'medium',
        category: 'privacy',
        title: 'Multiple Social Media Services',
        description: 'Your family uses multiple social media platforms, increasing privacy exposure.',
        actionItems: [
          'Consolidate to fewer social media platforms',
          'Review privacy settings on all platforms',
          'Set consistent privacy standards across platforms',
          'Consider using privacy-focused alternatives'
        ],
        affectedServices: socialMediaServices.map(r => r.serviceId)
      });
    }

    // High average exposure
    if (averageExposure >= 60) {
      recommendations.push({
        id: 'high-average-exposure',
        priority: 'high',
        category: 'privacy',
        title: 'High Overall Privacy Exposure',
        description: 'Your family\'s average privacy exposure is high. Take action to improve privacy.',
        actionItems: [
          'Review all service privacy settings',
          'Remove unused services',
          'Use privacy-focused alternatives where possible',
          'Set up family privacy rules and guidelines'
        ],
        affectedServices: serviceRisks.map(r => r.serviceId)
      });
    }

    // Services used by multiple members
    const multiMemberServices = serviceRisks.filter(r => r.memberCount > 1);
    if (multiMemberServices.length > 0) {
      recommendations.push({
        id: 'multi-member-services',
        priority: 'low',
        category: 'settings',
        title: 'Shared Services Across Family',
        description: `${multiMemberServices.length} service${multiMemberServices.length > 1 ? 's are' : ' is'} used by multiple family members.`,
        actionItems: [
          'Ensure each member has their own account',
          'Review shared account settings',
          'Set appropriate privacy levels for each member',
          'Monitor usage across family members'
        ],
        affectedServices: multiMemberServices.map(r => r.serviceId)
      });
    }

    // Telecom recommendation — carrier data is the deepest reach possible
    const telecomServices = serviceRisks.filter(r => r.category === 'telecom');
    if (telecomServices.length > 0) {
      recommendations.push({
        id: 'telecom-location-data',
        priority: 'high',
        category: 'privacy',
        title: 'Mobile Carrier — Real-Time Location & Data Broker Risk',
        description: `Your family's mobile carrier${telecomServices.length > 1 ? 's' : ''} (${telecomServices.map(r => r.serviceName).join(', ')}) ${telecomServices.length > 1 ? 'have' : 'has'} the deepest access of any service — continuous location, call metadata, and device identifiers — and all major US carriers have a history of selling this data to brokers.`,
        actionItems: [
          'Opt out of carrier advertising programs: look for "Advertising & Analytics" in your account settings',
          'Enable parental controls via your carrier\'s family safety app (Verizon Smart Family, AT&T Secure Family, T-Mobile FamilyMode)',
          'Review your carrier\'s privacy policy to understand what data is retained and for how long',
          'Request deletion of advertising profile data via your carrier\'s Privacy Center',
          'Under CPNI rules, you can ask your carrier to restrict how they use your calling data'
        ],
        affectedServices: telecomServices.map(r => r.serviceId)
      });
    }

    // AI-specific recommendation
    const aiServices = serviceRisks.filter(r => r.category === 'ai');
    if (aiServices.length > 0) {
      const highRiskAi = aiServices.filter(r => r.exposureIndex >= 70);
      const trainingRiskApps = aiServices.filter(r =>
        ['chatgpt', 'character-ai', 'grammarly', 'snapchat-my-ai', 'meta-ai', 'perplexity-ai'].includes(r.serviceId)
      );
      recommendations.push({
        id: 'ai-apps-risk',
        priority: 'high',
        category: 'privacy',
        title: 'AI Apps — Conversation Data & Training Risk',
        description: `Your family uses ${aiServices.length} AI app${aiServices.length > 1 ? 's' : ''}${trainingRiskApps.length > 0 ? `, including ${trainingRiskApps.length} that may use your child's conversations to train their AI models` : ''}.`,
        actionItems: [
          'Review each AI app\'s settings and disable "improve the model" / training data opt-ins',
          'Regularly delete AI conversation history in each app',
          'Remind your child: never share passwords, home address, school name, or mental health details with AI apps',
          'AI apps do not have FERPA protection unless the school has an enterprise agreement — do not use consumer AI for school work',
          highRiskAi.length > 0
            ? `Review ${highRiskAi.map(r => r.serviceName).join(', ')} — these have very high privacy risk scores`
            : 'Review the privacy settings on all AI apps in your list'
        ],
        affectedServices: aiServices.map(r => r.serviceId)
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Analyse 3rd-party and 4th-party (data broker) data chains for the tracked services
   */
  private analyzeDataBrokerChains(
    serviceIds: string[],
    serviceRisks: ServiceRisk[]
  ): DataBrokerAnalysis {
    const chains = getDataChainsForServices(serviceIds);
    const uniqueBrokers = getUniqueBrokersForServices(serviceIds);

    // Collect unique 3rd-party trackers across all chains
    const trackerNames = new Set<string>();
    chains.forEach(c => c.thirdPartyTrackers.forEach(t => trackerNames.add(t.name)));

    const serviceChains = chains.map(chain => {
      const risk = serviceRisks.find(r => r.serviceId === chain.serviceId);
      return {
        serviceId: chain.serviceId,
        serviceName: risk?.serviceName || chain.serviceId,
        thirdPartyCount: chain.thirdPartyTrackers.length,
        brokerCount: chain.fourthPartyBrokers.length,
        chainSummary: chain.chainSummary,
        chainRiskLevel: chain.chainRiskLevel
      };
    });

    // Cross-service brokers: brokers that appear in 2+ services = data convergence
    const crossServiceBrokers = uniqueBrokers
      .filter(b => b.seenIn.length >= 2)
      .map(b => ({
        name: b.name,
        type: b.type,
        seenInServices: b.seenIn.map(id => {
          const s = childServiceCatalog.find(svc => svc.id === id);
          return s?.name || id;
        }),
        note: `Receives data from ${b.seenIn.length} of your family\'s apps — this broker can build a combined profile of your child across multiple platforms.`
      }));

    return {
      totalMappedServices: chains.length,
      totalUniqueThirdParties: trackerNames.size,
      totalUniqueBrokers: uniqueBrokers.length,
      serviceChains,
      crossServiceBrokers
    };
  }

  /**
   * Summarise AI-specific risks for any AI category apps in the family's list
   */
  private analyzeAiRisks(serviceRisks: ServiceRisk[]): AiRiskSummary | null {
    const aiRisks = serviceRisks.filter(r => r.category === 'ai');
    if (aiRisks.length === 0) {return null;}

    const TRAINING_DATA_APPS = new Set(['chatgpt', 'character-ai', 'grammarly', 'snapchat-my-ai', 'meta-ai', 'perplexity-ai', 'google-gemini']);
    const FERPA_NON_COMPLIANT = new Set(['chatgpt', 'character-ai', 'snapchat-my-ai', 'meta-ai', 'perplexity-ai', 'google-gemini', 'microsoft-copilot']);

    const trainingDataRisk = aiRisks.some(r => TRAINING_DATA_APPS.has(r.serviceId));
    const noFerpaApps = aiRisks
      .filter(r => FERPA_NON_COMPLIANT.has(r.serviceId))
      .map(r => r.serviceName);
    const highRiskAiApps = aiRisks
      .filter(r => r.exposureIndex >= 70)
      .map(r => r.serviceName);

    const keyWarnings: string[] = [];
    if (trainingDataRisk) {
      keyWarnings.push('One or more AI apps may use your child\'s conversations to train future AI models — check and disable training opt-ins.');
    }
    if (noFerpaApps.length > 0) {
      keyWarnings.push(`${noFerpaApps.join(', ')} ${noFerpaApps.length === 1 ? 'has' : 'have'} no FERPA protection for consumer accounts — school use creates unprotected student data.`);
    }
    if (highRiskAiApps.length > 0) {
      keyWarnings.push(`${highRiskAiApps.join(', ')} ${highRiskAiApps.length === 1 ? 'has' : 'have'} a very high privacy exposure score — consider limiting or removing access.`);
    }
    if (aiRisks.some(r => r.serviceId === 'character-ai')) {
      keyWarnings.push('Character.AI is linked to lawsuits over harm to minors — this app is not recommended for children under 16.');
    }

    return {
      totalAiApps: aiRisks.length,
      trainingDataRisk,
      noFerpaApps,
      highRiskAiApps,
      keyWarnings
    };
  }
}

export const footprintAnalyzer = new FootprintAnalyzer();

