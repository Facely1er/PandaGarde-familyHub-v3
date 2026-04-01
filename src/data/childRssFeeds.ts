/**
 * RSS Feed Configuration for Child Privacy and Safety Alerts
 * Focused on child safety, parental controls, and educational content
 */

export interface ChildRSSFeed {
  id: string;
  name: string;
  url: string;
  category: 'child-safety' | 'privacy' | 'data-breach' | 'parental-controls' | 'education';
  serviceKeywords: Record<string, string[]>;
  updateFrequency: number; // milliseconds
  isActive: boolean;
}

export const childRssFeeds: ChildRSSFeed[] = [
  // Child Safety & Privacy
  {
    id: 'common-sense-media',
    name: 'Common Sense Media - Privacy & Security',
    url: 'https://www.commonsensemedia.org/rss/articles',
    category: 'child-safety',
    serviceKeywords: {
      'tiktok': ['tiktok'],
      'snapchat': ['snapchat'],
      'instagram': ['instagram'],
      'youtube': ['youtube', 'youtube kids'],
      'roblox': ['roblox'],
      'fortnite': ['fortnite'],
      'discord': ['discord']
    },
    updateFrequency: 7200000, // 2 hours
    isActive: true
  },
  {
    id: 'connectsafely',
    name: 'ConnectSafely',
    url: 'https://www.connectsafely.org/feed/',
    category: 'child-safety',
    serviceKeywords: {
      'instagram': ['instagram'],
      'snapchat': ['snapchat'],
      'tiktok': ['tiktok'],
      'facebook': ['facebook']
    },
    updateFrequency: 7200000,
    isActive: true
  },
  {
    id: 'ftc-consumer-alerts',
    name: 'FTC Consumer Alerts',
    url: 'https://www.consumer.ftc.gov/rss/scam-alerts.xml',
    category: 'child-safety',
    serviceKeywords: {},
    updateFrequency: 3600000, // 1 hour
    isActive: true
  },
  // Data Breaches (Child Services)
  {
    id: 'haveibeenpwned',
    name: 'Have I Been Pwned - Latest Breaches',
    url: 'https://feeds.feedburner.com/HaveIBeenPwnedLatestBreaches',
    category: 'data-breach',
    serviceKeywords: {
      'roblox': ['roblox'],
      'minecraft': ['minecraft'],
      'fortnite': ['fortnite', 'epic games'],
      'tiktok': ['tiktok'],
      'instagram': ['instagram'],
      'snapchat': ['snapchat']
    },
    updateFrequency: 3600000,
    isActive: true
  },
  // Privacy News (Child-Focused)
  {
    id: 'eff-deeplinks',
    name: 'EFF - Deeplinks Blog',
    url: 'https://www.eff.org/rss/updates.xml',
    category: 'privacy',
    serviceKeywords: {
      'tiktok': ['tiktok'],
      'youtube': ['youtube'],
      'instagram': ['instagram']
    },
    updateFrequency: 3600000,
    isActive: true
  }
];

export const severityKeywords = {
  critical: [
    'critical', 'breach', 'hack', 'exposed', 'compromised', 'stolen', 'leaked',
    'child safety', 'predator', 'grooming', 'exploitation'
  ],
  high: [
    'vulnerability', 'attack', 'threat', 'phishing', 'scam', 'fraud',
    'inappropriate content', 'cyberbullying', 'data leak'
  ],
  medium: [
    'warning', 'alert', 'risk', 'concern', 'caution', 'update',
    'privacy change', 'policy update'
  ],
  low: [
    'information', 'notice', 'announcement', 'tip', 'reminder', 'education'
  ]
};

export const getActiveFeeds = (): ChildRSSFeed[] => {
  return childRssFeeds.filter(feed => feed.isActive);
};

