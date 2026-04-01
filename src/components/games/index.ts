// Lazy-loaded game components for code splitting
import { lazy } from 'react';

export const PasswordStrengthLab = lazy(() => import('./PasswordStrengthLab'));
export const PrivacySettingsTrainer = lazy(() => import('./PrivacySettingsTrainer'));
export const SocialMediaAudit = lazy(() => import('./SocialMediaAudit'));
export const DigitalRightsQuiz = lazy(() => import('./DigitalRightsQuiz'));
export const PrivacyStoryAdventure = lazy(() => import('./PrivacyStoryAdventure'));
export const PasswordPetCreator = lazy(() => import('./PasswordPetCreator'));
export const SafeUnsafeSorting = lazy(() => import('./SafeUnsafeSorting'));
export const PhishingDetective = lazy(() => import('./PhishingDetective'));
export const DigitalFootprintVisualizer = lazy(() => import('./DigitalFootprintVisualizer'));
export const SocialMediaSimulator = lazy(() => import('./SocialMediaSimulator'));
export const PasswordFortressBuilder = lazy(() => import('./PasswordFortressBuilder'));
export const PrivacyPolicyDecoder = lazy(() => import('./PrivacyPolicyDecoder'));

// Game metadata for the Learning Hub
export const gamesList = [
  {
    id: 'password-strength',
    name: 'Password Strength Lab',
    description: 'Learn to create super strong passwords!',
    icon: '🔐',
    difficulty: 'Easy',
    ageGroup: 'all',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'safe-unsafe',
    name: 'Safe vs Unsafe Sorting',
    description: 'Sort online behaviors into safe and unsafe categories',
    icon: '✅',
    difficulty: 'Easy',
    ageGroup: 'all',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'phishing-detective',
    name: 'Phishing Detective',
    description: 'Identify phishing emails and protect yourself from scams',
    icon: '🔍',
    difficulty: 'Medium',
    ageGroup: 'middle',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'digital-rights',
    name: 'Digital Rights Quiz',
    description: 'Test your knowledge of digital privacy rights',
    icon: '⚖️',
    difficulty: 'Medium',
    ageGroup: 'high',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'privacy-story',
    name: 'Privacy Story Adventure',
    description: 'Make choices in an interactive privacy story',
    icon: '📖',
    difficulty: 'Easy',
    ageGroup: 'elementary',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'password-pet',
    name: 'Password Pet Creator',
    description: 'Create a pet that grows stronger with your password!',
    icon: '🐾',
    difficulty: 'Easy',
    ageGroup: 'elementary',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'social-media-audit',
    name: 'Social Media Audit',
    description: 'Review and improve your social media privacy settings',
    icon: '📱',
    difficulty: 'Medium',
    ageGroup: 'middle',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'privacy-settings',
    name: 'Privacy Settings Trainer',
    description: 'Learn to configure privacy settings on popular apps',
    icon: '⚙️',
    difficulty: 'Medium',
    ageGroup: 'all',
    color: 'from-gray-500 to-slate-600'
  },
  {
    id: 'digital-footprint',
    name: 'Digital Footprint Visualizer',
    description: 'See how your online activities create a digital footprint',
    icon: '👣',
    difficulty: 'Medium',
    ageGroup: 'all',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'social-simulator',
    name: 'Social Media Simulator',
    description: 'Practice safe social media habits in a simulation',
    icon: '🌐',
    difficulty: 'Medium',
    ageGroup: 'middle',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'password-fortress',
    name: 'Password Fortress Builder',
    description: 'Build an impenetrable password fortress!',
    icon: '🏰',
    difficulty: 'Medium',
    ageGroup: 'all',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'privacy-decoder',
    name: 'Privacy Policy Decoder',
    description: 'Learn to understand privacy policies in plain language',
    icon: '📜',
    difficulty: 'Hard',
    ageGroup: 'high',
    color: 'from-red-500 to-rose-600'
  }
];

