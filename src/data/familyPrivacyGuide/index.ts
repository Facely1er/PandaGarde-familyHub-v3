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

// Section 1: Starting Privacy Conversations With Children (Ages 5â€“12)
export const childrenGuide: GuideSection = {
  id: 'children-5-12',
  title: 'Starting Privacy Conversations With Children (Ages 5â€“12)',
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
        '  â€¢ Their full name',
        '  â€¢ Home address',
        '  â€¢ School name or location'
      ]
    },
    {
      type: 'list',
      content: [
        'Ask them to check with a trusted adult before:',
        '  â€¢ Sharing photos or videos',
        '  â€¢ Posting anything that shows where they live or go to school'
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
        '  â€¢ Kids must ask a trusted adult before they:',
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
        '  â€¢ Something online feels strange, scary, or confusing',
        '  â€¢ Someone asks for personal information or photos'
      ]
    },
    {
      type: 'list',
      content: [
        'Let them know it\'s always okay to:',
        '  â€¢ Close a website, game, or app that makes them uncomfortable',
        '  â€¢ Tell an adult what happened without fear of getting in trouble'
      ]
    }
  ]
};

// Section 2: Empower Teens: Navigating Digital Identity (Ages 13â€“17)
export const teensGuide: GuideSection = {
  id: 'teens-13-17',
  title: 'Empower Teens: Navigating Digital Identity (Ages 13â€“17)',
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
        '  â€¢ Posts, comments, and photos can be saved or screenshotted',
        '  â€¢ Deleted content may still exist in backups or archives'
      ]
    },
    {
      type: 'list',
      content: [
        'Help teens think about:',
        '  â€¢ How a post might look to teachers, colleges, or employers',
        '  â€¢ Whether they\'d be comfortable seeing it on a big screen in front of a class'
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
        '  â€¢ Who can see their posts (friends, followers, public)',
        '  â€¢ The risks of sharing real-time location (e.g., live stories)'
      ]
    },
    {
      type: 'list',
      content: [
        'Talk about:',
        '  â€¢ How algorithms promote certain content',
        '  â€¢ How online drama or conflict can follow them offline'
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
        '  â€¢ Social media platforms',
        '  â€¢ Messaging apps',
        '  â€¢ Gaming accounts'
      ]
    },
    {
      type: 'list',
      content: [
        'Teach teens to:',
        '  â€¢ Turn off location sharing where it\'s not needed',
        '  â€¢ Limit who can tag or mention them',
        '  â€¢ Review and prune old posts periodically'
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
        '  â€¢ Password managers to create and store strong, unique passwords',
        '  â€¢ Two-factor authentication (2FA) or multi-factor authentication (MFA) on important accounts'
      ]
    },
    {
      type: 'list',
      content: [
        'Learn to spot phishing attempts:',
        '  â€¢ Suspicious emails or messages asking for urgent action',
        '  â€¢ Links that don\'t match the official website',
        '  â€¢ Unexpected attachments or login prompts'
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
        '  â€¢ Old or unused online accounts',
        '  â€¢ Subscriptions and services no longer needed'
      ]
    },
    {
      type: 'list',
      content: [
        'Remove data from:',
        '  â€¢ Data broker sites where possible',
        '  â€¢ Marketing lists or unnecessary newsletters'
      ]
    },
    {
      type: 'list',
      content: [
        'Audit app permissions:',
        '  â€¢ Check which apps have access to location, contacts, photos, or microphone',
        '  â€¢ Revoke permissions that no longer make sense'
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
        '  â€¢ VPNs for secure network connections on public Wi-Fi',
        '  â€¢ Privacy-focused browsers and search engines',
        '  â€¢ Secure messaging apps with end-to-end encryption'
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
        '  â€¢ Fake tech support calls or pop-up warnings',
        '  â€¢ "Urgent" messages claiming a problem with a bank account or government benefits',
        '  â€¢ Romance scams or fake online relationships'
      ]
    },
    {
      type: 'list',
      content: [
        'Teach simple rules:',
        '  â€¢ Don\'t give out financial or personal details over the phone or email',
        '  â€¢ Hang up and call the official number on the back of the card or from the official website'
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
        '  â€¢ Maintain a list of important accounts stored securely (e.g., password manager or locked document)',
        '  â€¢ Turn on 2FA/MFA for banking, email, and critical services'
      ]
    },
    {
      type: 'list',
      content: [
        'Encourage them to:',
        '  â€¢ Ask for help when something looks suspicious',
        '  â€¢ Confirm unexpected requests with a trusted family member'
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
        '  â€¢ How to adjust privacy settings on their main devices and apps',
        '  â€¢ How to control who can contact them or see their profiles'
      ]
    },
    {
      type: 'list',
      content: [
        'Set up:',
        '  â€¢ Spam filters on email',
        '  â€¢ Caller ID and call blocking on phones'
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
        '  â€¢ Identify who they can call in the family when they\'re unsure',
        '  â€¢ Create a simple step-by-step "What to do ifâ€¦" guide for suspicious messages or pop-ups'
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
        '  â€¢ Games kids play',
        '  â€¢ Apps teens use',
        '  â€¢ Online banking or shopping adults do'
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
        '  â€¢ "What do you think about this?"',
        '  â€¢ "How would you handle this situation?"'
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
        '  â€¢ Walk through changing privacy settings',
        '  â€¢ Install and configure tools (password manager, 2FA, etc.)',
        '  â€¢ Practice recognizing phishing or scam messages'
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
        '  â€¢ "Lock" instead of "encryption"',
        '  â€¢ "Strangers" instead of "unknown third parties"'
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
        '  â€¢ People can admit they clicked on something suspicious',
        '  â€¢ The focus is on fixing and learning, not shaming or punishing'
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
        '  â€¢ One or two changes at a time',
        '  â€¢ Follow up after a few days or weeks'
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
        '  â€¢ What is okay to share publicly',
        '  â€¢ What must always be private',
        '  â€¢ Who needs to approve pictures or posts involving children'
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
        '  â€¢ What personal information can be shared online',
        '  â€¢ Where photos and videos can be posted'
      ]
    },
    {
      type: 'list',
      content: [
        'Define approval processes:',
        '  â€¢ Who must approve photos before posting',
        '  â€¢ Which websites or apps are allowed for younger children'
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
        '  â€¢ A family password manager',
        '  â€¢ Privacy-focused browsers on shared devices',
        '  â€¢ Content filters where necessary'
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
        '  â€¢ Review account lists',
        '  â€¢ Update passwords and recovery options',
        '  â€¢ Remove unused apps, services, or extensions',
        '  â€¢ Discuss new apps or platforms family members are using'
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
        '  â€¢ On the fridge',
        '  â€¢ On a family bulletin board',
        '  â€¢ In a shared digital document everyone can access'
      ]
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Regular Review' }
    },
    {
      type: 'paragraph',
      content: 'Revisit the plan every 3â€“6 months: Adjust for new devices, apps, or services. Adapt as kids grow older and become more independent. Reflect new threats or lessons learned.'
    },
    {
      type: 'heading',
      content: { level: 3, text: 'Lead by Example' }
    },
    {
      type: 'list',
      content: [
        'Parents and caregivers should:',
        '  â€¢ Follow the same privacy rules they set for children',
        '  â€¢ Model good behavior, like not oversharing on social media',
        '  â€¢ Show how they handle suspicious messages or links'
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
        '  â€¢ Help others adjust settings',
        '  â€¢ Explain new features or updates',
        '  â€¢ Provide calm guidance when something goes wrong'
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
        '  â€¢ Who to call or message when they run into a digital privacy problem',
        '  â€¢ How to contact them quickly (phone, chat, in-person)'
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
        '  â€¢ Unexpected password reset emails',
        '  â€¢ Sudden device slowdowns or pop-up floods',
        '  â€¢ Friends reporting strange messages coming from your accounts'
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
        '  â€¢ When to pause online activities and ask for help',
        '  â€¢ What to do if an account seems hacked',
        '  â€¢ How to respond to unexpected money or data requests'
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
        '  â€¢ Praising family members who report suspicious messages',
        '  â€¢ Celebrating completed "Privacy Days" or successful clean-ups',
        '  â€¢ Recognizing kids and teens who make smart sharing decisions'
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

