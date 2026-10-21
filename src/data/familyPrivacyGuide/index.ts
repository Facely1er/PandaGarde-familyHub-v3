/**
 * Family Digital Privacy Guide Content
 * Comprehensive privacy education content for all family members
 */

export type AgeGroup = '5-8' | '9-12' | '13-17' | 'adult' | 'senior' | 'all';

export interface GuideSection {
  id: string;
  title: string;
  subtitle?: string;
  ageGroups: AgeGroup[];
  content: GuideContent[];
  icon?: string;
}

export type GuideContentType = 'paragraph' | 'list' | 'quote' | 'card' | 'heading';

export interface GuideContent {
  type: GuideContentType;
  content: string | string[] | GuideCard | GuideHeading;
}

export interface GuideCard {
  title: string;
  items: string[];
  icon?: string;
}

export interface GuideHeading {
  level: 2 | 3 | 4;
  text: string;
}

// Section 1: Starting Privacy Conversations With Children (Ages 5–12)
export const childrenGuide: GuideSection = {
  id: 'children-5-12',
  title: 'Starting Privacy Conversations With Children (Ages 5–12)',
  subtitle: 'Let\'s talk about why we keep some things private online, just like we keep our home address private to strangers.',
  ageGroups: ['5-8', '9-12'],
  icon: 'heart',
  content: [
    {
      type: 'quote',
      content: 'Let\'s talk about why we keep some things private online, just like we keep our home address private to strangers.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Keep Personal Details Safe' }
    },
    {
      type: 'list',
      content: [
        'Teach kids not to share:',
        '  • Their full name',
        '  • Home address',
        '  • School name or location'
      ]
    },
    {
      type: 'list',
      content: [
        'Ask them to check with a trusted adult before:',
        '  • Sharing photos or videos',
        '  • Posting anything that shows where they live or go to school'
      ]
    },
    {
      type: 'paragraph',
      content: 'Explain why passwords must stay secret, even from friends.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Ask Before You Click' }
    },
    {
      type: 'list',
      content: [
        'Set a simple rule:',
        '  • Kids must ask a trusted adult before they:',
        '    - Download apps or games',
        '    - Create new online accounts',
        '    - Chat with people they don\'t know in real life'
      ]
    },
    {
      type: 'paragraph',
      content: 'Show them how to recognize "Ask a grown-up first" situations.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Trust Your Gut' }
    },
    {
      type: 'list',
      content: [
        'Encourage them to come to you if:',
        '  • Something online feels strange, scary, or confusing',
        '  • Someone asks for personal information or photos'
      ]
    },
    {
      type: 'list',
      content: [
        'Let them know it\'s always okay to:',
        '  • Close a website, game, or app that makes them uncomfortable',
        '  • Tell an adult what happened without fear of getting in trouble'
      ]
    }
  ]
};

// Section 2: Empower Teens: Navigating Digital Identity (Ages 13–17)
export const teensGuide: GuideSection = {
  id: 'teens-13-17',
  title: 'Empower Teens: Navigating Digital Identity (Ages 13–17)',
  subtitle: 'Let\'s discuss how future schools or employers might view your digital footprint.',
  ageGroups: ['13-17'],
  icon: 'brain',
  content: [
    {
      type: 'quote',
      content: 'Let\'s discuss how future schools or employers might view your digital footprint.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Digital Footprint Awareness' }
    },
    {
      type: 'list',
      content: [
        'Explain that online content can become permanent:',
        '  • Posts, comments, and photos can be saved or screenshotted',
        '  • Deleted content may still exist in backups or archives'
      ]
    },
    {
      type: 'list',
      content: [
        'Help teens think about:',
        '  • How a post might look to teachers, colleges, or employers',
        '  • Whether they\'d be comfortable seeing it on a big screen in front of a class'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Social Media Literacy' }
    },
    {
      type: 'list',
      content: [
        'Discuss:',
        '  • Who can see their posts (friends, followers, public)',
        '  • The risks of sharing real-time location (e.g., live stories)'
      ]
    },
    {
      type: 'list',
      content: [
        'Talk about:',
        '  • How algorithms promote certain content',
        '  • How online drama or conflict can follow them offline'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Privacy Settings' }
    },
    {
      type: 'list',
      content: [
        'Review privacy settings together across:',
        '  • Social media platforms',
        '  • Messaging apps',
        '  • Gaming accounts'
      ]
    },
    {
      type: 'list',
      content: [
        'Teach teens to:',
        '  • Turn off location sharing where it\'s not needed',
        '  • Limit who can tag or mention them',
        '  • Review and prune old posts periodically'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Extra Awareness: Metadata and Regular Check-Ups' }
    },
    {
      type: 'paragraph',
      content: 'Explain that photos can contain hidden details (metadata), including location data and device information.'
    },
    {
      type: 'paragraph',
      content: 'Encourage regular "privacy check-ups": Once every few months, review settings, posts, and connected apps on all platforms.'
    }
  ]
};

// Section 3: Empowering Adult Family Members
export const adultsGuide: GuideSection = {
  id: 'adults',
  title: 'Empowering Adult Family Members',
  subtitle: 'Have you ever checked what information about you is publicly available online?',
  ageGroups: ['adult', 'all'],
  icon: 'shield',
  content: [
    {
      type: 'quote',
      content: 'Have you ever checked what information about you is publicly available online?'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Data Security' }
    },
    {
      type: 'list',
      content: [
        'Implement:',
        '  • Password managers to create and store strong, unique passwords',
        '  • Two-factor authentication (2FA) or multi-factor authentication (MFA) on important accounts'
      ]
    },
    {
      type: 'list',
      content: [
        'Learn to spot phishing attempts:',
        '  • Suspicious emails or messages asking for urgent action',
        '  • Links that don\'t match the official website',
        '  • Unexpected attachments or login prompts'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Digital De-cluttering' }
    },
    {
      type: 'list',
      content: [
        'Review and clean up:',
        '  • Old or unused online accounts',
        '  • Subscriptions and services no longer needed'
      ]
    },
    {
      type: 'list',
      content: [
        'Remove data from:',
        '  • Data broker sites where possible',
        '  • Marketing lists or unnecessary newsletters'
      ]
    },
    {
      type: 'list',
      content: [
        'Audit app permissions:',
        '  • Check which apps have access to location, contacts, photos, or microphone',
        '  • Revoke permissions that no longer make sense'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Privacy Tools' }
    },
    {
      type: 'list',
      content: [
        'Explore tools that support everyday privacy:',
        '  • VPNs for secure network connections on public Wi-Fi',
        '  • Privacy-focused browsers and search engines',
        '  • Secure messaging apps with end-to-end encryption'
      ]
    }
  ]
};

// Section 4: Supporting Elderly Family Members
export const seniorsGuide: GuideSection = {
  id: 'seniors',
  title: 'Supporting Elderly Family Members',
  subtitle: 'Let\'s talk about how to recognize online scams that often target seniors.',
  ageGroups: ['senior', 'adult'],
  icon: 'heart',
  content: [
    {
      type: 'quote',
      content: 'Let\'s talk about how to recognize online scams that often target seniors.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Spot Scams' }
    },
    {
      type: 'list',
      content: [
        'Learn common scam tactics targeting seniors:',
        '  • Fake tech support calls or pop-up warnings',
        '  • "Urgent" messages claiming a problem with a bank account or government benefits',
        '  • Romance scams or fake online relationships'
      ]
    },
    {
      type: 'list',
      content: [
        'Teach simple rules:',
        '  • Don\'t give out financial or personal details over the phone or email',
        '  • Hang up and call the official number on the back of the card or from the official website'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Keep Accounts Safe' }
    },
    {
      type: 'list',
      content: [
        'Use simple, manageable steps:',
        '  • Maintain a list of important accounts stored securely (e.g., password manager or locked document)',
        '  • Turn on 2FA/MFA for banking, email, and critical services'
      ]
    },
    {
      type: 'list',
      content: [
        'Encourage them to:',
        '  • Ask for help when something looks suspicious',
        '  • Confirm unexpected requests with a trusted family member'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Basic Privacy Settings' }
    },
    {
      type: 'list',
      content: [
        'Help seniors learn the most important controls:',
        '  • How to adjust privacy settings on their main devices and apps',
        '  • How to control who can contact them or see their profiles'
      ]
    },
    {
      type: 'list',
      content: [
        'Set up:',
        '  • Spam filters on email',
        '  • Caller ID and call blocking on phones'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Get Help' }
    },
    {
      type: 'list',
      content: [
        'Make support clear and accessible:',
        '  • Identify who they can call in the family when they\'re unsure',
        '  • Create a simple step-by-step "What to do if…" guide for suspicious messages or pop-ups'
      ]
    }
  ]
};

// Section 5: Effective Conversation Approaches
export const conversationApproachesGuide: GuideSection = {
  id: 'conversation-approaches',
  title: 'Effective Conversation Approaches',
  subtitle: 'When talking about online privacy with family members, use approaches that build trust, not fear.',
  ageGroups: ['all'],
  icon: 'message-circle',
  content: [
    {
      type: 'quote',
      content: 'When talking about online privacy with family members, use approaches that build trust, not fear.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Show Care, Not Fear' }
    },
    {
      type: 'paragraph',
      content: 'Focus on safety and empowerment rather than scary stories.'
    },
    {
      type: 'paragraph',
      content: 'Emphasize: "I want us to stay safe together," not "The internet is dangerous."'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Use Everyday Examples' }
    },
    {
      type: 'list',
      content: [
        'Connect privacy ideas to real situations:',
        '  • Games kids play',
        '  • Apps teens use',
        '  • Online banking or shopping adults do'
      ]
    },
    {
      type: 'paragraph',
      content: 'Use recent news or family experiences as teaching moments.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Talk With, Not At' }
    },
    {
      type: 'list',
      content: [
        'Ask questions:',
        '  • "What do you think about this?"',
        '  • "How would you handle this situation?"'
      ]
    },
    {
      type: 'paragraph',
      content: 'Listen to their experiences and opinions before giving advice.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Give Practical Help' }
    },
    {
      type: 'list',
      content: [
        'Sit down together and:',
        '  • Walk through changing privacy settings',
        '  • Install and configure tools (password manager, 2FA, etc.)',
        '  • Practice recognizing phishing or scam messages'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Use Simple Words' }
    },
    {
      type: 'paragraph',
      content: 'Avoid complex technical jargon.'
    },
    {
      type: 'list',
      content: [
        'Replace technical terms with:',
        '  • "Lock" instead of "encryption"',
        '  • "Strangers" instead of "unknown third parties"'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Don\'t Blame for Mistakes' }
    },
    {
      type: 'list',
      content: [
        'Create a safe environment where:',
        '  • People can admit they clicked on something suspicious',
        '  • The focus is on fixing and learning, not shaming or punishing'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Take It Step by Step' }
    },
    {
      type: 'list',
      content: [
        'Share privacy tips gradually:',
        '  • One or two changes at a time',
        '  • Follow up after a few days or weeks'
      ]
    },
    {
      type: 'paragraph',
      content: 'Avoid overwhelming family members with long checklists in a single conversation.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Make Family Rules Together' }
    },
    {
      type: 'list',
      content: [
        'Co-create privacy rules:',
        '  • What is okay to share publicly',
        '  • What must always be private',
        '  • Who needs to approve pictures or posts involving children'
      ]
    },
    {
      type: 'paragraph',
      content: 'Ensure everyone understands and agrees to follow them.'
    }
  ]
};

// Section 6: Create Your Family Privacy Plan
export const privacyPlanGuide: GuideSection = {
  id: 'privacy-plan',
  title: 'Create Your Family Privacy Plan',
  subtitle: 'A family privacy plan works best when everyone helps create it.',
  ageGroups: ['all'],
  icon: 'check-circle',
  content: [
    {
      type: 'heading',
      content: { level: 3, text: 'Set Clear Sharing Rules' }
    },
    {
      type: 'list',
      content: [
        'Agree on:',
        '  • What personal information can be shared online',
        '  • Where photos and videos can be posted'
      ]
    },
    {
      type: 'list',
      content: [
        'Define approval processes:',
        '  • Who must approve photos before posting',
        '  • Which websites or apps are allowed for younger children'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Set Up Safety Tools' }
    },
    {
      type: 'list',
      content: [
        'Use shared tools such as:',
        '  • A family password manager',
        '  • Privacy-focused browsers on shared devices',
        '  • Content filters where necessary'
      ]
    },
    {
      type: 'paragraph',
      content: 'Schedule regular digital safety check-ins: Short sessions to make sure everything still works as intended.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Plan Regular Check-Ups' }
    },
    {
      type: 'list',
      content: [
        'Hold quarterly "Privacy Days":',
        '  • Review account lists',
        '  • Update passwords and recovery options',
        '  • Remove unused apps, services, or extensions',
        '  • Discuss new apps or platforms family members are using'
      ]
    },
    {
      type: 'quote',
      content: 'A family privacy plan works best when everyone helps create it. Have a family meeting to make the first version and let kids and teens share their ideas too.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Display Your Plan' }
    },
    {
      type: 'list',
      content: [
        'Put your plan somewhere visible:',
        '  • On the fridge',
        '  • On a family bulletin board',
        '  • In a shared digital document everyone can access'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Regular Review' }
    },
    {
      type: 'paragraph',
      content: 'Revisit the plan every 3–6 months: Adjust for new devices, apps, or services. Adapt as kids grow older and become more independent. Reflect new threats or lessons learned.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Lead by Example' }
    },
    {
      type: 'list',
      content: [
        'Parents and caregivers should:',
        '  • Follow the same privacy rules they set for children',
        '  • Model good behavior, like not oversharing on social media',
        '  • Show how they handle suspicious messages or links'
      ]
    }
  ]
};

// Section 7: Building Your Family\'s Digital Safety Net
export const safetyNetGuide: GuideSection = {
  id: 'safety-net',
  title: 'Building Your Family\'s Digital Safety Net',
  subtitle: 'Create a support system for digital privacy challenges.',
  ageGroups: ['all'],
  icon: 'users',
  content: [
    {
      type: 'heading',
      content: { level: 3, text: 'Designate Tech Guides' }
    },
    {
      type: 'list',
      content: [
        'Identify tech-savvy family members who can:',
        '  • Help others adjust settings',
        '  • Explain new features or updates',
        '  • Provide calm guidance when something goes wrong'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Establish Points of Contact' }
    },
    {
      type: 'list',
      content: [
        'Make sure everyone knows:',
        '  • Who to call or message when they run into a digital privacy problem',
        '  • How to contact them quickly (phone, chat, in-person)'
      ]
    },
    {
      type: 'paragraph',
      content: 'Consider designating: One primary contact and one backup person.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Recognize Warning Signs' }
    },
    {
      type: 'list',
      content: [
        'Learn together to spot potential online risks, such as:',
        '  • Unexpected password reset emails',
        '  • Sudden device slowdowns or pop-up floods',
        '  • Friends reporting strange messages coming from your accounts'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Establish Safety Protocols' }
    },
    {
      type: 'list',
      content: [
        'Create simple rules for:',
        '  • When to pause online activities and ask for help',
        '  • What to do if an account seems hacked',
        '  • How to respond to unexpected money or data requests'
      ]
    },
    {
      type: 'paragraph',
      content: 'Example protocol: 1. Stop interacting with the suspicious message or site. 2. Take a screenshot if helpful. 3. Contact the designated tech guide. 4. Change passwords and enable 2FA where needed.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Celebrate Privacy Wins' }
    },
    {
      type: 'list',
      content: [
        'Reinforce positive behavior by:',
        '  • Praising family members who report suspicious messages',
        '  • Celebrating completed "Privacy Days" or successful clean-ups',
        '  • Recognizing kids and teens who make smart sharing decisions'
      ]
    },
    {
      type: 'paragraph',
      content: 'Create a culture where protecting personal information is valued and everyone feels proud of their privacy habits.'
    }
  ]
};

// Export all sections
export const allGuideSections: GuideSection[] = [
  childrenGuide,
  teensGuide,
  adultsGuide,
  seniorsGuide,
  conversationApproachesGuide,
  privacyPlanGuide,
  safetyNetGuide
];

// Helper functions
export const getSectionsByAgeGroup = (ageGroup: AgeGroup): GuideSection[] => {
  return allGuideSections.filter(section => 
    section.ageGroups.includes(ageGroup) || section.ageGroups.includes('all')
  );
};

export const getSectionById = (id: string): GuideSection | undefined => {
  return allGuideSections.find(section => section.id === id);
};

export const getRelevantSectionsForAges = (ages: number[]): GuideSection[] => {
  const ageGroups: AgeGroup[] = [];
  
  ages.forEach(age => {
    if (age >= 5 && age <= 8) {ageGroups.push('5-8');}
    if (age >= 9 && age <= 12) {ageGroups.push('9-12');}
    if (age >= 13 && age <= 17) {ageGroups.push('13-17');}
    if (age >= 18 && age < 65) {ageGroups.push('adult');}
    if (age >= 65) {ageGroups.push('senior');}
  });
  
  const uniqueAgeGroups = [...new Set(ageGroups)];
  
  return allGuideSections.filter(section => 
    section.ageGroups.some(ag => uniqueAgeGroups.includes(ag) || ag === 'all')
  );
};

