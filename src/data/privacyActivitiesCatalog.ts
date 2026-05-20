/** Shared privacy activity catalog for public /activities and Family Hub. */

export interface PrivacyActivity {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  ageGroup: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  category: string;
  educationalObjective: string;
}

export const PRIVACY_ACTIVITIES: PrivacyActivity[] = [
  { id: 'maze', slug: 'safe-online-journey', name: 'Safe Online Journey Maze', description: 'Navigate safely through the digital world with Privacy Panda.', icon: '🎮', ageGroup: '6-10', difficulty: 'Intermediate', durationMinutes: 12, category: 'Device Safety', educationalObjective: 'Recognize safe vs. risky paths online.' },
  { id: 'memory', slug: 'privacy-symbols', name: 'Privacy Symbol Matching', description: 'Match privacy symbols with their meanings.', icon: '🧩', ageGroup: '5-8', difficulty: 'Beginner', durationMinutes: 10, category: 'Privacy Rights', educationalObjective: 'Learn common privacy and safety symbols.' },
  { id: 'quiz', slug: 'password-safety', name: 'Password Safety Quiz', description: 'Test knowledge about strong passwords and account safety.', icon: '❓', ageGroup: '9-12', difficulty: 'Intermediate', durationMinutes: 10, category: 'Password Safety', educationalObjective: 'Understand how to create and protect passwords.' },
  { id: 'coloring', slug: 'privacy-panda-coloring', name: 'Privacy Panda Coloring', description: 'Color and learn about protecting your digital treasure.', icon: '🎨', ageGroup: '5-8', difficulty: 'Beginner', durationMinutes: 10, category: 'Family Privacy', educationalObjective: 'Connect creativity with privacy awareness.' },
  { id: 'sorting', slug: 'safe-sharing', name: 'Information Sorting', description: 'Sort information into safe to share vs. keep private.', icon: '📦', ageGroup: '5-8', difficulty: 'Beginner', durationMinutes: 8, category: 'Safe Sharing', educationalObjective: 'Decide what information should stay private.' },
  { id: 'wordsearch', slug: 'privacy-word-search', name: 'Privacy Word Search', description: 'Find important privacy vocabulary words.', icon: '🔍', ageGroup: '7-11', difficulty: 'Beginner', durationMinutes: 12, category: 'Privacy Rights', educationalObjective: 'Build privacy vocabulary through play.' },
  { id: 'connectdots', slug: 'privacy-shield', name: 'Privacy Shield Connect-the-Dots', description: 'Connect the dots to reveal the privacy shield.', icon: '🔗', ageGroup: '5-8', difficulty: 'Beginner', durationMinutes: 8, category: 'Device Safety', educationalObjective: 'See how protection layers fit together.' },
  { id: 'matching', slug: 'scam-awareness', name: 'Scam Awareness Matching', description: 'Match scenarios with safe responses.', icon: '🎯', ageGroup: '9-12', difficulty: 'Advanced', durationMinutes: 12, category: 'Scam Awareness', educationalObjective: 'Identify suspicious messages and requests.' },
];

export const resolveActivityId = (slugOrId: string): string | undefined => {
  const byId = PRIVACY_ACTIVITIES.find((a) => a.id === slugOrId);
  if (byId) {return byId.id;}
  return PRIVACY_ACTIVITIES.find((a) => a.slug === slugOrId)?.id;
};

export const getActivityById = (id: string): PrivacyActivity | undefined =>
  PRIVACY_ACTIVITIES.find((a) => a.id === id);
