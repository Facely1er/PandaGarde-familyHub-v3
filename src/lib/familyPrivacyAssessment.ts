/**
 * Family Privacy Assessment Tool
 * Helps families assess their privacy practices and get personalized recommendations
 */

export interface AssessmentQuestion {
  id: string;
  category: 'data-sharing' | 'privacy-settings' | 'online-behavior' | 'device-security' | 'parental-controls';
  question: string;
  description?: string;
  type: 'multiple-choice' | 'scale' | 'yes-no';
  options?: string[];
  scaleLabels?: { min: string; max: string };
  weight: number; // 1-5, importance for scoring
}

export interface AssessmentAnswer {
  questionId: string;
  value: string | number;
}

export interface AssessmentResult {
  overallScore: number; // 0-100, higher = better privacy practices
  categoryScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  resources?: Array<{ label: string; url: string }>;
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // Data Sharing
  {
    id: 'data-sharing-1',
    category: 'data-sharing',
    question: 'How often do you review privacy policies before signing up for new services?',
    description: 'Understanding what data services collect helps protect your family',
    type: 'multiple-choice',
    options: ['Always', 'Sometimes', 'Rarely', 'Never'],
    weight: 4
  },
  {
    id: 'data-sharing-2',
    category: 'data-sharing',
    question: 'Do you limit the personal information shared in online profiles?',
    type: 'yes-no',
    weight: 3
  },
  {
    id: 'data-sharing-3',
    category: 'data-sharing',
    question: 'How many services share data with each other through parent companies?',
    description: 'Services owned by the same company often share data',
    type: 'multiple-choice',
    options: ['None or very few', 'Some', 'Many', 'Not sure'],
    weight: 4
  },

  // Privacy Settings
  {
    id: 'privacy-settings-1',
    category: 'privacy-settings',
    question: 'How often do you review and update privacy settings on services your family uses?',
    type: 'multiple-choice',
    options: ['Monthly', 'Quarterly', 'Yearly', 'Never'],
    weight: 5
  },
  {
    id: 'privacy-settings-2',
    category: 'privacy-settings',
    question: 'Do you enable location sharing on apps and services?',
    description: 'Location data can reveal sensitive information about your family',
    type: 'multiple-choice',
    options: ['Never', 'Only when necessary', 'For most apps', 'Always enabled'],
    weight: 4
  },
  {
    id: 'privacy-settings-3',
    category: 'privacy-settings',
    question: 'Are social media accounts set to private?',
    type: 'yes-no',
    weight: 4
  },

  // Online Behavior
  {
    id: 'online-behavior-1',
    category: 'online-behavior',
    question: 'How often do family members share photos or videos online?',
    type: 'multiple-choice',
    options: ['Daily', 'Weekly', 'Monthly', 'Rarely or never'],
    weight: 3
  },
  {
    id: 'online-behavior-2',
    category: 'online-behavior',
    question: 'Do family members use strong, unique passwords for each account?',
    type: 'yes-no',
    weight: 5
  },
  {
    id: 'online-behavior-3',
    category: 'online-behavior',
    question: 'How often do you discuss online privacy and safety with your children?',
    type: 'multiple-choice',
    options: ['Weekly', 'Monthly', 'Occasionally', 'Rarely or never'],
    weight: 4
  },

  // Device Security
  {
    id: 'device-security-1',
    category: 'device-security',
    question: 'Are all family devices protected with passwords or biometric locks?',
    type: 'yes-no',
    weight: 5
  },
  {
    id: 'device-security-2',
    category: 'device-security',
    question: 'Do you use two-factor authentication (2FA) when available?',
    type: 'yes-no',
    weight: 4
  },
  {
    id: 'device-security-3',
    category: 'device-security',
    question: 'How often do you update software and apps on family devices?',
    type: 'multiple-choice',
    options: ['As soon as updates are available', 'Within a week', 'Within a month', 'Rarely or never'],
    weight: 4
  },

  // Parental Controls
  {
    id: 'parental-controls-1',
    category: 'parental-controls',
    question: 'Do you use parental control tools or apps?',
    type: 'yes-no',
    weight: 3
  },
  {
    id: 'parental-controls-2',
    category: 'parental-controls',
    question: 'How often do you monitor your children\'s online activity?',
    type: 'multiple-choice',
    options: ['Daily', 'Weekly', 'Monthly', 'Rarely or never'],
    weight: 3
  },
  {
    id: 'parental-controls-3',
    category: 'parental-controls',
    question: 'Do you have rules about what information children can share online?',
    type: 'yes-no',
    weight: 4
  }
];

export class FamilyPrivacyAssessment {
  /**
   * Calculate assessment score from answers
   */
  calculateScore(answers: AssessmentAnswer[]): AssessmentResult {
    const categoryScores: Record<string, { total: number; max: number }> = {};
    const categoryAnswers: Record<string, AssessmentAnswer[]> = {};

    // Group answers by category
    answers.forEach(answer => {
      const question = assessmentQuestions.find(q => q.id === answer.questionId);
      if (!question) {return;}

      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { total: 0, max: 0 };
        categoryAnswers[question.category] = [];
      }
      categoryAnswers[question.category].push(answer);
    });

    // Calculate scores for each category
    Object.keys(categoryScores).forEach(category => {
      const questions = assessmentQuestions.filter(q => q.category === category);
      const answersForCategory = categoryAnswers[category] || [];

      questions.forEach(question => {
        const answer = answersForCategory.find(a => a.questionId === question.id);
        if (!answer) {
          categoryScores[category].max += question.weight * 4; // Max score per question
          return;
        }

        const questionScore = this.scoreQuestion(question, answer.value);
        categoryScores[category].total += questionScore * question.weight;
        categoryScores[category].max += 4 * question.weight; // Max score is 4
      });
    });

    // Convert to percentages
    const finalCategoryScores: Record<string, number> = {};
    Object.keys(categoryScores).forEach(category => {
      const { total, max } = categoryScores[category];
      finalCategoryScores[category] = max > 0 ? Math.round((total / max) * 100) : 0;
    });

    // Calculate overall score
    const totalScore = Object.values(finalCategoryScores).reduce((sum, score) => sum + score, 0);
    const overallScore = Object.keys(finalCategoryScores).length > 0
      ? Math.round(totalScore / Object.keys(finalCategoryScores).length)
      : 0;

    // Determine risk level
    const riskLevel: 'low' | 'medium' | 'high' = 
      overallScore >= 75 ? 'low' :
      overallScore >= 50 ? 'medium' : 'high';

    // Identify strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.entries(finalCategoryScores).forEach(([category, score]) => {
      const categoryName = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (score >= 75) {
        strengths.push(categoryName);
      } else if (score < 50) {
        weaknesses.push(categoryName);
      }
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations(finalCategoryScores, answers, riskLevel);

    return {
      overallScore,
      categoryScores: finalCategoryScores,
      strengths,
      weaknesses,
      recommendations,
      riskLevel
    };
  }

  /**
   * Score a single question answer
   */
  private scoreQuestion(question: AssessmentQuestion, value: string | number): number {
    if (question.type === 'yes-no') {
      return value === 'yes' || value === true ? 4 : 1;
    }

    if (question.type === 'multiple-choice') {
      const options = question.options || [];
      const index = options.indexOf(String(value));
      if (index === -1) {return 0;}
      // Higher index = better answer (assuming options are ordered from best to worst)
      return 4 - index;
    }

    if (question.type === 'scale') {
      const numValue = typeof value === 'number' ? value : parseInt(String(value), 10);
      if (isNaN(numValue)) {return 0;}
      // Scale 1-5 maps to score 1-4
      return Math.max(1, Math.min(4, numValue));
    }

    return 0;
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    categoryScores: Record<string, number>,
    answers: AssessmentAnswer[],
    riskLevel: 'low' | 'medium' | 'high'
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Privacy Settings recommendations
    if (categoryScores['privacy-settings'] < 70) {
      recommendations.push({
        id: 'privacy-settings-review',
        category: 'privacy-settings',
        priority: categoryScores['privacy-settings'] < 50 ? 'high' : 'medium',
        title: 'Review Privacy Settings Regularly',
        description: 'Regularly reviewing privacy settings helps protect your family\'s data.',
        actionItems: [
          'Set a monthly reminder to review privacy settings',
          'Check location sharing settings on all apps',
          'Set social media accounts to private',
          'Review app permissions on all devices'
        ],
        resources: [
          { label: 'Privacy Settings Guide', url: '/guides/privacy-settings' },
          { label: 'Service Catalog', url: '/service-catalog' }
        ]
      });
    }

    // Data Sharing recommendations
    if (categoryScores['data-sharing'] < 70) {
      recommendations.push({
        id: 'data-sharing-awareness',
        category: 'data-sharing',
        priority: categoryScores['data-sharing'] < 50 ? 'high' : 'medium',
        title: 'Improve Data Sharing Awareness',
        description: 'Understanding how data is shared helps you make better decisions.',
        actionItems: [
          'Review privacy policies before signing up',
          'Check which services share data through parent companies',
          'Limit personal information in online profiles',
          'Use the Digital Footprint tool to see your data sharing network'
        ],
        resources: [
          { label: 'Digital Footprint Analysis', url: '/digital-footprint' },
          { label: 'Service Relationships', url: '/service-catalog' }
        ]
      });
    }

    // Device Security recommendations
    if (categoryScores['device-security'] < 70) {
      recommendations.push({
        id: 'device-security-improve',
        category: 'device-security',
        priority: categoryScores['device-security'] < 50 ? 'high' : 'medium',
        title: 'Strengthen Device Security',
        description: 'Strong device security protects your family from unauthorized access.',
        actionItems: [
          'Enable passwords or biometric locks on all devices',
          'Enable two-factor authentication (2FA) where available',
          'Keep software and apps updated',
          'Use a password manager for strong, unique passwords'
        ],
        resources: [
          { label: 'Security Best Practices', url: '/guides/security' }
        ]
      });
    }

    // Online Behavior recommendations
    if (categoryScores['online-behavior'] < 70) {
      recommendations.push({
        id: 'online-behavior-education',
        category: 'online-behavior',
        priority: categoryScores['online-behavior'] < 50 ? 'high' : 'medium',
        title: 'Improve Online Behavior Practices',
        description: 'Good online habits protect your family\'s privacy and safety.',
        actionItems: [
          'Use strong, unique passwords for each account',
          'Limit sharing of photos and personal information',
          'Have regular conversations about online privacy',
          'Teach children about safe online behavior'
        ],
        resources: [
          { label: 'Privacy Education Resources', url: '/parent-resources' },
          { label: 'Age-Appropriate Guides', url: '/age-groups' }
        ]
      });
    }

    // Parental Controls recommendations
    if (categoryScores['parental-controls'] < 70) {
      recommendations.push({
        id: 'parental-controls-setup',
        category: 'parental-controls',
        priority: categoryScores['parental-controls'] < 50 ? 'high' : 'medium',
        title: 'Enhance Parental Controls',
        description: 'Parental controls help you protect and guide your children online.',
        actionItems: [
          'Set up parental control tools on all devices',
          'Establish clear rules about online sharing',
          'Monitor children\'s online activity regularly',
          'Use age-appropriate privacy settings'
        ],
        resources: [
          { label: 'Parental Control Guide', url: '/guides/parental-controls' },
          { label: 'Family Hub', url: '/family-hub' }
        ]
      });
    }

    // Overall risk level recommendation
    if (riskLevel === 'high') {
      recommendations.push({
        id: 'overall-high-risk',
        category: 'overall',
        priority: 'high',
        title: 'Take Immediate Action to Improve Privacy',
        description: 'Your family\'s privacy practices need significant improvement. Focus on the highest priority recommendations first.',
        actionItems: [
          'Review all high-priority recommendations',
          'Start with privacy settings and device security',
          'Schedule regular privacy check-ins',
          'Use PandaGarde resources to learn more'
        ],
        resources: [
          { label: 'Privacy Education', url: '/parent-resources' },
          { label: 'Digital Footprint Analysis', url: '/digital-footprint' }
        ]
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
}

export const familyPrivacyAssessment = new FamilyPrivacyAssessment();

