/**
 * Privacy Exposure Index Calculator for Children's Services
 * Calculates a 0-100 score representing privacy exposure/risk for child services
 * Adapted for educational, parent-friendly context
 */

import { childServiceCatalog, type ChildService, getRiskScore } from '../data/childServiceCatalog';
import { getServiceRelationship, getSiblingServices } from '../data/serviceRelationships';

/**
 * Calculate Privacy Exposure Index (0-100) for a child service
 * Higher score = higher privacy exposure/risk
 * 
 * @param serviceId - The service ID
 * @returns Exposure index (0-100) or null if service not found
 */
export function calculatePrivacyExposureIndex(serviceId: string): number | null {
  const service = childServiceCatalog.find(s => s.id === serviceId);
  
  if (!service) {return null;}
  
  let score = 0;
  const maxScore = 100;
  
  // Factor 1: Base risk level (0-40 points)
  const baseRiskScore = getRiskScore(service.riskLevel);
  score += baseRiskScore * 0.4;
  
  // Factor 2: Number of privacy concerns (0-25 points)
  const concernCount = service.privacyConcerns?.length || 0;
  score += Math.min(concernCount * 5, 25);
  
  // Factor 3: Age appropriateness (0-20 points)
  // Lower minimum age = higher risk for younger children
  if (service.minAge < 8) {
    score += 20; // Very young children need more protection
  } else if (service.minAge < 13) {
    score += 15;
  } else if (service.minAge < 16) {
    score += 10;
  } else {
    score += 5;
  }
  
  // Factor 4: Category risk (0-15 points)
  const categoryRiskScores: Record<string, number> = {
    'social-media': 15,
    'messaging': 12,
    'gaming': 10,
    'streaming': 8,
    'edtech': 10, // school-assigned: institutional data collection, limited parental control
    'education': 5,
    'ai': 14,     // conversation data, training use, no FERPA — second only to social-media
    'telecom': 15, // real-time location 24/7 + call metadata + device ID = maximum reach
    'creative': 5,
    'other': 10
  };
  score += categoryRiskScores[service.category] || 10;
  
  // Factor 5: Parent company complexity (0-10 points)
  // Services with parent companies and siblings have more data sharing potential
  const relationship = getServiceRelationship(serviceId);
  if (relationship?.parent) {
    score += 5; // Base parent company penalty (data sharing across services)
    const siblings = getSiblingServices(serviceId);
    if (siblings && siblings.length > 0) {
      // More sibling services = more data sharing opportunities
      score += Math.min(siblings.length * 2, 5);
    }
  }
  
  // Normalize to 0-100
  return Math.min(Math.round(score), maxScore);
}

/**
 * Get exposure level label and color styling
 * 
 * @param index - The exposure index (0-100)
 * @returns Object with level, color, and Tailwind classes
 */
export function getExposureLevel(index: number | null) {
  if (index === null || index === undefined) {
    return { 
      level: 'Unknown', 
      color: 'gray', 
      bgColor: 'bg-gray-100 dark:bg-gray-700', 
      textColor: 'text-gray-700 dark:text-gray-300',
      barColor: 'bg-gray-400',
      description: 'Privacy risk information not available'
    };
  }
  
  if (index >= 70) {
    return { 
      level: 'Very High', 
      color: 'red', 
      bgColor: 'bg-red-100 dark:bg-red-900/30', 
      textColor: 'text-red-700 dark:text-red-300',
      barColor: 'bg-red-500',
      description: 'Requires close parental supervision and strict privacy settings'
    };
  } else if (index >= 50) {
    return { 
      level: 'High', 
      color: 'orange', 
      bgColor: 'bg-orange-100 dark:bg-orange-900/30', 
      textColor: 'text-orange-700 dark:text-orange-300',
      barColor: 'bg-orange-500',
      description: 'Needs active parental monitoring and privacy controls'
    };
  } else if (index >= 30) {
    return { 
      level: 'Medium', 
      color: 'yellow', 
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', 
      textColor: 'text-yellow-700 dark:text-yellow-300',
      barColor: 'bg-yellow-500',
      description: 'Moderate privacy concerns - review settings regularly'
    };
  } else {
    return { 
      level: 'Low', 
      color: 'green', 
      bgColor: 'bg-green-100 dark:bg-green-900/30', 
      textColor: 'text-green-700 dark:text-green-300',
      barColor: 'bg-green-500',
      description: 'Generally safe with basic privacy settings'
    };
  }
}

/**
 * Get all services sorted by exposure index
 * 
 * @param services - Array of service objects
 * @param order - 'asc' or 'desc' (default: 'desc')
 * @returns Sorted array of services with exposure index
 */
export function sortServicesByExposure(services: ChildService[], order: 'asc' | 'desc' = 'desc') {
  return services
    .map(service => ({
      ...service,
      exposureIndex: calculatePrivacyExposureIndex(service.id)
    }))
    .sort((a, b) => {
      const indexA = a.exposureIndex || 0;
      const indexB = b.exposureIndex || 0;
      return order === 'desc' ? indexB - indexA : indexA - indexB;
    });
}

