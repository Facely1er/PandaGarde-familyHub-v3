/**
 * Family Persona Detection Engine
 * Analyzes family privacy assessment results to determine privacy persona
 */

import { FamilyPersonaProfiles, type FamilyPersonaProfile } from '../data/familyPersonaProfiles';
import type { AssessmentResult, AssessmentAnswer } from './familyPrivacyAssessment';

export interface PersonaDetectionResult {
  primary: string;
  secondary: string | null;
  confidence: number; // 0-1
  allScores: Record<string, number>;
  rawScores: Record<string, number>;
  profile: FamilyPersonaProfile | null;
}

export class FamilyPersonaDetectionEngine {
  /**
   * Analyze assessment results to detect family persona
   */
  analyzeAssessmentResults(
    assessmentResult: AssessmentResult,
    answers: AssessmentAnswer[]
  ): PersonaDetectionResult {
    const scores: Record<string, number> = {
      'cautious-parent': 0,
      'privacy-focused-family': 0,
      'learning-family': 0,
      'tech-savvy-family': 0,
      'balanced-family': 0,
      'concerned-family': 0
    };

    // Analyze category scores
    const categoryScores = assessmentResult.categoryScores;
    const overallScore = assessmentResult.overallScore;
    const riskLevel = assessmentResult.riskLevel;

    // Cautious Parent indicators
    if (categoryScores['parental-controls'] !== undefined) {
      if (categoryScores['parental-controls'] < 60) {
        scores['cautious-parent'] += 3; // Needs more parental controls
      } else if (categoryScores['parental-controls'] >= 75) {
        scores['cautious-parent'] += 2; // Already using parental controls
      }
    }
    
    // Check for child safety concerns in answers
    const hasChildSafetyConcerns = answers.some(a => {
      const questionId = a.questionId;
      if (questionId.includes('parental-controls') || questionId.includes('online-behavior')) {
        return true;
      }
      return false;
    });
    if (hasChildSafetyConcerns) {
      scores['cautious-parent'] += 2;
    }

    // Privacy-Focused Family indicators
    if (categoryScores['privacy-settings'] !== undefined && categoryScores['privacy-settings'] >= 70) {
      scores['privacy-focused-family'] += 3;
    }
    if (categoryScores['data-sharing'] !== undefined && categoryScores['data-sharing'] >= 70) {
      scores['privacy-focused-family'] += 2;
    }
    if (overallScore >= 75) {
      scores['privacy-focused-family'] += 1;
    }

    // Learning Family indicators
    if (riskLevel === 'high' && overallScore < 50) {
      scores['learning-family'] += 2; // Needs education
    }
    if (categoryScores['online-behavior'] !== undefined && categoryScores['online-behavior'] < 60) {
      scores['learning-family'] += 2; // Needs to learn better practices
    }
    // Check for educational interest in answers
    const hasEducationalInterest = answers.some(a => {
      const questionId = a.questionId;
      if (questionId.includes('online-behavior') && 
          (a.value === 'Occasionally' || a.value === 'Rarely or never')) {
        return true; // Wants to learn more
      }
      return false;
    });
    if (hasEducationalInterest) {
      scores['learning-family'] += 1;
    }

    // Tech-Savvy Family indicators
    if (categoryScores['device-security'] !== undefined && categoryScores['device-security'] >= 80) {
      scores['tech-savvy-family'] += 3;
    }
    // Check for advanced security practices
    const hasAdvancedSecurity = answers.some(a => {
      const questionId = a.questionId;
      if (questionId === 'device-security-2' && a.value === 'yes') {
        return true; // Uses 2FA
      }
      if (questionId === 'device-security-3' && a.value === 'As soon as updates are available') {
        return true; // Updates immediately
      }
      return false;
    });
    if (hasAdvancedSecurity) {
      scores['tech-savvy-family'] += 2;
    }

    // Balanced Family indicators
    if (overallScore >= 50 && overallScore < 75) {
      scores['balanced-family'] += 2; // Moderate score suggests balance
    }
    if (riskLevel === 'medium') {
      scores['balanced-family'] += 1;
    }
    // Check for practical approach
    const hasPracticalApproach = answers.some(a => {
      const questionId = a.questionId;
      if (questionId === 'privacy-settings-1' && 
          (a.value === 'Quarterly' || a.value === 'Yearly')) {
        return true; // Practical review schedule
      }
      return false;
    });
    if (hasPracticalApproach) {
      scores['balanced-family'] += 1;
    }

    // Concerned Family indicators
    if (riskLevel === 'high' && overallScore < 40) {
      scores['concerned-family'] += 4; // High risk, low score
    }
    if (assessmentResult.weaknesses.length > assessmentResult.strengths.length) {
      scores['concerned-family'] += 2; // More weaknesses than strengths
    }
    if (assessmentResult.recommendations.filter(r => r.priority === 'high').length > 3) {
      scores['concerned-family'] += 2; // Many high-priority recommendations
    }

    // Normalize scores
    const totalPossibleScore = 10;
    const normalizedScores: Record<string, number> = {};
    Object.keys(scores).forEach(persona => {
      normalizedScores[persona] = Math.min(scores[persona] / totalPossibleScore, 1);
    });

    // Get primary and secondary personas
    const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const primaryPersona = sortedScores[0][0];
    const secondaryPersona = sortedScores[1] && sortedScores[1][1] > 0 ? sortedScores[1][0] : null;
    const confidence = sortedScores[0][1] / totalPossibleScore;

    return {
      primary: primaryPersona,
      secondary: secondaryPersona,
      confidence: Math.min(confidence, 1),
      allScores: normalizedScores,
      rawScores: scores,
      profile: FamilyPersonaProfiles[primaryPersona] || null
    };
  }

  /**
   * Get personalized welcome message based on persona and risk level
   */
  getPersonalizedWelcome(personaId: string, riskLevel: 'low' | 'medium' | 'high'): string {
    const profile = FamilyPersonaProfiles[personaId];
    if (!profile) {
      return "Welcome to PandaGarde! Let's protect your family's digital privacy together.";
    }

    const messages: Record<string, Record<string, string>> = {
      'cautious-parent': {
        high: "Your family's digital safety needs immediate attention. Let's secure your household step by step with child-focused protection.",
        medium: "You're doing well protecting your family, but there's room for improvement in child safety measures.",
        low: "Excellent! Your family has strong child protection practices. Let's maintain this level of safety."
      },
      'privacy-focused-family': {
        high: "Time to lock down your family's digital privacy. Here are advanced strategies for maximum protection.",
        medium: "Your privacy foundation is solid. Let's implement some advanced protections for the whole family.",
        low: "Impressive privacy setup! Let's fine-tune and explore cutting-edge protection methods for your family."
      },
      'learning-family': {
        high: "Don't worry - everyone starts somewhere! We'll guide your family through privacy basics step by step with fun activities.",
        medium: "You're learning together! Let's build on your current knowledge with some key improvements and interactive learning.",
        low: "Great progress! Your family has mastered the basics. Ready for some advanced techniques and challenges?"
      },
      'tech-savvy-family': {
        high: "Your technical skills are great, but let's enhance your family's security with advanced tools and monitoring.",
        medium: "Good technical foundation! Let's optimize your family's security setup with advanced configurations.",
        low: "Excellent technical setup! Let's explore cutting-edge security tools and automation for your family."
      },
      'balanced-family': {
        high: "Let's find practical solutions that balance privacy with convenience for your family's needs.",
        medium: "You're on the right track! Let's enhance your family's privacy with practical, easy-to-use solutions.",
        low: "Great balance! Your family has good privacy practices. Let's explore some convenient improvements."
      },
      'concerned-family': {
        high: "We understand your concerns. Let's address your family's privacy risks immediately with clear, actionable steps.",
        medium: "Your concerns are valid. Let's improve your family's privacy protection with focused, practical solutions.",
        low: "Good awareness! Let's continue strengthening your family's privacy with ongoing improvements."
      }
    };

    return messages[personaId]?.[riskLevel] || 
           "Welcome to PandaGarde! Let's protect your family's digital privacy together.";
  }

  /**
   * Get recommended actions based on persona
   */
  getRecommendedActions(personaId: string): string[] {
    const profile = FamilyPersonaProfiles[personaId];
    if (!profile) {return [];}

    const actionMap: Record<string, string[]> = {
      'cautious-parent': [
        'Set up parental controls on all devices',
        'Review child safety alerts regularly',
        'Create a family internet agreement',
        'Monitor children\'s online activity'
      ],
      'privacy-focused-family': [
        'Review privacy settings on all services',
        'Analyze your digital footprint',
        'Minimize data sharing across services',
        'Use privacy-focused tools and services'
      ],
      'learning-family': [
        'Start with interactive privacy activities',
        'Read age-appropriate privacy guides',
        'Complete the Privacy Panda story',
        'Track learning progress together'
      ],
      'tech-savvy-family': [
        'Configure advanced security settings',
        'Set up automated privacy monitoring',
        'Review service relationships and data sharing',
        'Implement technical privacy solutions'
      ],
      'balanced-family': [
        'Focus on quick privacy wins',
        'Use practical privacy tools',
        'Review service catalog for safer alternatives',
        'Implement easy-to-use privacy settings'
      ],
      'concerned-family': [
        'Complete privacy assessment immediately',
        'Review high-priority recommendations',
        'Set up safety alerts',
        'Start with urgent privacy fixes'
      ]
    };

    return actionMap[personaId] || [];
  }
}

export const familyPersonaDetectionEngine = new FamilyPersonaDetectionEngine();

