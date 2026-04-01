// Newsletter content data
import { NewsletterContent } from '../../types/newsletter';

export const newsletterArchive: NewsletterContent[] = [
  {
    id: '2026-04',
    month: 'April',
    year: 2026,
    title: 'Your New Rights: Maryland MODPA in Action',
    featuredTopic: {
      title: 'Maryland MODPA Is Now in Effect â€” Here\'s What Your Family Can Do',
      description:
        'The Maryland Online Data Privacy Act (MODPA) is now fully in force. Maryland families can request access to personal data held by apps and websites, correct errors, delete records, receive a portable copy, and opt out of sale and targeted advertising â€” including for their children. This issue walks through each right in plain language and shows exactly how to submit a request.',
      articleUrl: '/digital-rights'
    },
    monthlyTip: {
      title: 'Submit Your First MODPA Opt-Out',
      content:
        'The fastest way to exercise a MODPA right is an opt-out of sale or targeted advertising â€” most apps must honor it within 15 days. If your school or EdTech provider uses the EduSoluce Privacy Portal, you can send a formal request there in minutes.',
      linkUrl: '/digital-rights'
    },
    newActivities: [
      {
        title: 'Digital Rights Module',
        description: 'Walk through MODPA rights, key terms, and real-world examples in our beginner-friendly module.',
        pageUrl: '/digital-rights'
      }
    ],
    privacyNews: [
      {
        title: 'What MODPA Covers (and What It Doesn\'t)',
        summary:
          'MODPA applies to many commercial data controllers that process Maryland residents\' data, but exempts some non-profits, government agencies, and small businesses. If you use a mainstream app, game, or EdTech platform, MODPA almost certainly applies.',
        linkUrl: '/digital-rights'
      },
      {
        title: 'How to Submit a Deletion Request for Your Child\'s EdTech Data',
        summary:
          'Under MODPA (and FERPA), parents have the right to request deletion of personal data held by educational apps. Start with the service\'s privacy portal or contact form, cite MODPA, and keep a copy of your request.',
        linkUrl: '/resources'
      }
    ],
    publishedAt: '2026-04-15',
    featured: true
  },
  {
    id: '2026-03',
    month: 'March',
    year: 2026,
    title: 'AI, Deepfakes, and Family Trust',
    featuredTopic: {
      title: 'Talking With Kids About AI-Generated Content',
      description:
        'Help your family spot synthetic images, voices, and messages. Practice simple habits: pause before sharing, verify unusual requests, and agree on when to ask a trusted adultâ€”especially as chatbots and creative tools show up in homework, games, and social feeds.',
      articleUrl: '/guides/conversation-approaches'
    },
    monthlyTip: {
      title: 'Use a Family Verification Phrase',
      content:
        'Pick a short phrase only your household knows. If someone texts or calls claiming to be family in an emergency, kids know to ask for the phrase before acting or sending money or codes.',
      linkUrl: '/guides/emergency-safety'
    },
    newActivities: [
      {
        title: 'Digital Footprint Check-In',
        description: 'Walk through what appears online about each family member and what you want to keep private.',
        pageUrl: '/digital-footprint'
      }
    ],
    privacyNews: [
      {
        title: 'Maryland MODPA: Rights for families',
        summary:
          'Marylandâ€™s Maryland Online Data Privacy Act (MODPA) gives residents powerful tools: know what data is collected, access and correct it, delete it, take a portable copy, and opt out of sale and targeted advertising. Our Digital Rights page explains MODPA in plain language and links to the EduSoluce Privacy Portal when your school or organization uses it.',
        linkUrl: '/digital-rights'
      }
    ],
    publishedAt: '2026-03-15',
    featured: true
  },
  {
    id: '2026-02',
    month: 'February',
    year: 2026,
    title: 'Safer Internet Season at Home',
    featuredTopic: {
      title: 'Turning â€œSafer Internetâ€ Into Weekly Habits',
      description:
        'Safer Internet Day is a great prompt to refresh passwords, privacy settings, and your family agreementâ€”not as a one-day event, but as small, repeatable routines everyone can follow.',
      articleUrl: '/guides/family-privacy-plan'
    },
    monthlyTip: {
      title: 'Review Location and Camera Access',
      content:
        'On phones and tablets, audit which apps can use location, microphone, and camera. Turn off access for apps that do not need it, and talk with kids about why those permissions matter.',
      linkUrl: '/guides/device-setup'
    },
    newActivities: [
      {
        title: 'Family Internet Agreement',
        description: 'Download or update your written rules for screens, sharing, and asking for help.',
        pageUrl: '/family-agreement'
      }
    ],
    privacyNews: [
      {
        title: 'Platform Teen and Default Privacy Settings',
        summary:
          'Major apps still adjust defaults for minors and new accounts. Revisit settings after updatesâ€”what was private last year may not match todayâ€™s defaults.',
        linkUrl: '/guides/age-specific'
      }
    ],
    publishedAt: '2026-02-15',
    featured: false
  },
  {
    id: '2026-01',
    month: 'January',
    year: 2026,
    title: 'New Year Privacy Reset',
    featuredTopic: {
      title: 'A Practical Privacy Reset for the Whole Family',
      description:
        'Start the year by cleaning up accounts from holiday gifts, unsubscribing from noisy apps, and aligning on what your family shares in group chats, school portals, and social spaces.',
      articleUrl: '/guides/privacy-concerns'
    },
    monthlyTip: {
      title: 'Inventory New Devices and Accounts',
      content:
        'List every new tablet, console, or wearable from the holidays. For each, set parental controls, disable unnecessary data collection where you can, and note which adult account owns the purchase.',
      linkUrl: '/guides/app-selection'
    },
    newActivities: [
      {
        title: 'Privacy Assessment',
        description: 'Take a quick check-in on your familyâ€™s digital privacy strengths and next steps.',
        pageUrl: '/privacy-assessment'
      }
    ],
    privacyNews: [
      {
        title: 'School and EdTech Data Practices',
        summary:
          'Districts and classroom tools often share more data than families expect. Review notices sent at the start of the term and ask how student information is used and protected.',
        linkUrl: '/resources'
      },
      {
        title: 'Maryland: MODPA and student data',
        summary:
          'If you live in Maryland, MODPA adds state-level rights over personal data that can apply to many online servicesâ€”not only consumer apps. Pair district notices with an understanding of access, deletion, and opt-out so you can advocate clearly for your child.',
        linkUrl: '/digital-rights'
      }
    ],
    publishedAt: '2026-01-15',
    featured: false
  }
];

export const getNewsletterById = (id: string): NewsletterContent | undefined => {
  return newsletterArchive.find(newsletter => newsletter.id === id);
};

export const getLatestNewsletter = (): NewsletterContent | undefined => {
  return newsletterArchive.length > 0 ? newsletterArchive[0] : undefined;
};

export const getNewslettersByYear = (year: number): NewsletterContent[] => {
  return newsletterArchive.filter(newsletter => newsletter.year === year);
};
