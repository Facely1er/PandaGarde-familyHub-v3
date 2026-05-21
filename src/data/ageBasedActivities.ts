export type ActivityDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ActivityFocus =
  | 'Safe sharing'
  | 'Account security'
  | 'Spotting scams'
  | 'Privacy settings'
  | 'Digital footprint'
  | 'Digital rights';

export type FamilyMode = 'Play together' | 'Talk together' | 'Teen-led reflection';

export interface AgeBasedActivity {
  id: string;
  name: string;
  icon: string;
  description: string;
  realLifeScenario: string;
  learningObjective: string;
  keyLearnings: string[];
  discussionPrompts: string[];
  familyPrompt: string;
  nextStep: string;
  duration: string;
  difficulty: ActivityDifficulty;
  focus: ActivityFocus;
  familyMode: FamilyMode;
  featured?: boolean;
  /** If set, this maps to an existing ActivityManager game ID */
  activityManagerId?: string;
  /** In-app tool page when there is no bundled game (e.g. full DFA) */
  sitePath?: string;
}

export interface AgeGroup {
  ageRange: string;
  label: string;
  emoji: string;
  description: string;
  activities: AgeBasedActivity[];
}

export interface FlattenedAgeBasedActivity extends AgeBasedActivity {
  groupAgeRange: string;
  groupLabel: string;
  groupEmoji: string;
}

export const ageBasedActivities: AgeGroup[] = [
  {
    ageRange: '5-8',
    label: 'Little Explorers',
    emoji: '🐼',
    description: 'First fun steps into online safety — keeping secrets and making safe choices',
    activities: [
      {
        id: 'pack-digital-backpack',
        name: 'Pack Your Digital Backpack',
        icon: '🎒',
        description:
          'Decide what information goes in your school backpack — and what stays home. Then practice the same idea for the internet!',
        realLifeScenario:
          'You want to join a fun online game. It asks for your name, school, and home address. What should you share?',
        learningObjective: 'Help younger children tell the difference between friendly facts and private details.',
        keyLearnings: [
          'Your home address and full name are private — keep them at home',
          'A nickname or first name only is fine for games',
          'Ask a grown-up before filling in any forms online',
        ],
        discussionPrompts: [
          'Which backpack items feel safe to carry online, and which stay at home?',
          'Who in our family can help you decide before you share something new?',
        ],
        familyPrompt:
          'Create a “share / ask first / keep private” list together using examples from your child’s favourite apps or games.',
        nextStep: 'Do a one-minute check of one favourite app and spot the questions it asks before sign-up.',
        duration: '5 min',
        difficulty: 'Beginner',
        focus: 'Safe sharing',
        familyMode: 'Play together',
        featured: true,
        activityManagerId: 'sorting',
      },
      {
        id: 'traffic-light-safety',
        name: 'Traffic Light: Safe or Not?',
        icon: '🚦',
        description:
          'Use a red, yellow, and green light to decide if sharing something online is safe, risky, or definitely not okay.',
        realLifeScenario:
          'A fun game says: “You won a prize! Tell us your address to receive it.” Red, yellow, or green?',
        learningObjective: 'Build a simple family language for stop, slow down, and ask for help online.',
        keyLearnings: [
          'Green = safe to share (favourite colour, pet name)',
          'Yellow = ask a grown-up first (your photo, school name)',
          'Red = never share online (address, phone number, password)',
        ],
        discussionPrompts: [
          'What clues tell you a message should be red instead of green?',
          'What should our family do when something feels yellow and confusing?',
        ],
        familyPrompt:
          'Pick three real examples from games, videos, or chat messages and decide together whether they are red, yellow, or green.',
        nextStep: 'Place a traffic-light reminder near the family device you use most often.',
        duration: '6 min',
        difficulty: 'Beginner',
        focus: 'Safe sharing',
        familyMode: 'Play together',
        activityManagerId: 'maze',
      },
      {
        id: 'secret-keeper-club',
        name: 'Secret Keeper Club',
        icon: '🔒',
        description:
          "Privacy Panda's treasure chest needs a special password only family knows. Learn why passwords keep our secrets safe!",
        realLifeScenario:
          'Your best friend asks for your tablet password so they can show you something cool. What should you do?',
        learningObjective: 'Introduce passwords as family-only secrets that protect trusted spaces and devices.',
        keyLearnings: [
          'Passwords are like house keys — only for your family',
          'A good password is long and uses letters, numbers, and a symbol',
          'Never type your password where others can see',
        ],
        discussionPrompts: [
          'Why does a password need to stay private even from friends?',
          'What helps you remember a strong password without saying it out loud?',
        ],
        familyPrompt:
          'Invent a silly passphrase together and practise how to keep it secret when someone is watching.',
        nextStep: 'Review one child account together and check whether the password still feels strong and private.',
        duration: '6 min',
        difficulty: 'Beginner',
        focus: 'Account security',
        familyMode: 'Play together',
        featured: true,
        activityManagerId: 'connectdots',
      },
      {
        id: 'trusted-adults-online',
        name: 'Who Can I Talk To Online?',
        icon: '👨‍👩‍👧',
        description:
          'Sort online contacts into trusted family, known adults, and strangers — and learn when to ask a grown-up for help.',
        realLifeScenario:
          'While playing a game, someone you do not know sends you a message asking where you live. What do you do?',
        learningObjective: 'Help children recognise when online contacts are trusted helpers and when they are strangers.',
        keyLearnings: [
          'Online friends are still strangers until a trusted adult has checked',
          'It is always okay to say “I need to ask my parent” and log off',
          'Tell a trusted adult straight away if a message makes you uncomfortable',
        ],
        discussionPrompts: [
          'How can we tell the difference between someone we know and someone we only know online?',
          'What words can you use when you want to pause and ask for help?',
        ],
        familyPrompt:
          'Create a short “safe grown-ups” list and rehearse who your child can go to if an online message feels uncomfortable.',
        nextStep: 'Save your child’s trusted grown-up list somewhere they can find quickly.',
        duration: '7 min',
        difficulty: 'Beginner',
        focus: 'Safe sharing',
        familyMode: 'Talk together',
        activityManagerId: 'coloring',
      },
      {
        id: 'my-info-collage',
        name: 'My Public & Private Collage',
        icon: '🎨',
        description:
          'Create a collage that separates “okay to share” information from “keep private” information using Privacy Panda characters.',
        realLifeScenario:
          'Your class is making a school website. Which things about yourself can you put on it for everyone to see?',
        learningObjective: 'Show that every post or profile shares pieces of a child’s digital footprint.',
        keyLearnings: [
          'Public: hobbies, favourite food, what you like to draw',
          'Private: your address, phone, password, or full birthday',
          'Even friends should not share your private details for you',
        ],
        discussionPrompts: [
          'Which collage items would still feel safe to share with people you do not know?',
          'How could a private detail spread if one friend posts it for you?',
        ],
        familyPrompt:
          'Build the collage with your child and let them explain why each item belongs in the public or private side.',
        nextStep: 'Look at a family profile together and spot one detail you would keep private in the future.',
        duration: '8 min',
        difficulty: 'Beginner',
        focus: 'Digital footprint',
        familyMode: 'Play together',
        activityManagerId: 'memory',
      },
      {
        id: 'permission-please',
        name: 'Permission Please!',
        icon: '🤝',
        description:
          'Practice asking for and giving permission before sharing a photo or video of yourself or a friend online.',
        realLifeScenario:
          'Your mum takes a lovely photo of you and your friend at the park. She wants to post it. Should she ask your friend first?',
        learningObjective: 'Teach children that privacy includes asking before posting pictures, videos, or messages.',
        keyLearnings: [
          "Always ask before sharing someone else's photo",
          'It is okay to say “no” and that choice must be respected',
          'Once posted online, photos are very hard to remove completely',
        ],
        discussionPrompts: [
          'How does it feel when someone asks before posting a picture of you?',
          'What should happen if one person says yes and another says no?',
        ],
        familyPrompt:
          'Role-play asking permission before posting a picture from a family day out, then practise how to respond kindly to “no.”',
        nextStep: 'Choose one family sharing rule for photos and put it somewhere everyone can see.',
        duration: '6 min',
        difficulty: 'Beginner',
        focus: 'Safe sharing',
        familyMode: 'Talk together',
        activityManagerId: 'wordsearch',
      },
    ],
  },
  {
    ageRange: '9-12',
    label: 'Privacy Detectives',
    emoji: '🕵️',
    description: 'Hands-on investigations into social media, gaming apps, and real online threats',
    activities: [
      {
        id: 'digital-footprint-trail',
        name: 'Digital Footprint Trail',
        icon: '👣',
        description:
          'Trace exactly what data Roblox, YouTube, and popular games collect about you — and decide if you are comfortable with it.',
        realLifeScenario:
          'You have played Roblox every day for two years. What does Roblox probably know about you by now?',
        learningObjective: 'Help children recognise that apps build profiles from the information they collect over time.',
        keyLearnings: [
          'Games and apps track your location, search history, and play patterns',
          'This data can be sold to other companies',
          'Checking privacy settings regularly helps limit what is collected',
        ],
        discussionPrompts: [
          'Which bits of data would surprise you if an app collected them about our family?',
          'What is the difference between fun game data and information that feels too personal?',
        ],
        familyPrompt:
          'Pick one favourite app together and list what it probably knows about each family member who uses it.',
        nextStep: 'Open the privacy settings for one app you use often and review the data controls together.',
        duration: '10 min',
        difficulty: 'Intermediate',
        focus: 'Digital footprint',
        familyMode: 'Talk together',
        featured: true,
        activityManagerId: 'digital-footprint',
      },
      {
        id: 'phishing-patrol',
        name: 'Phishing Patrol',
        icon: '🎣',
        description:
          'Spot fake messages pretending to be from games, schools, or prize competitions. Real-style examples in a safe practice space.',
        realLifeScenario:
          '“You won 10,000 Robux! Click here and log in to claim your reward.” Is this message real or a trick?',
        learningObjective: 'Teach families to slow down, check the sender, and avoid urgent scam messages.',
        keyLearnings: [
          'Phishing messages create urgency and promise rewards',
          'Check the sender address — it is often slightly wrong',
          'Never click links in messages; go directly to the official website',
        ],
        discussionPrompts: [
          'What words in a message are trying to rush you before you think?',
          'What is our family rule when a message asks us to click a login link?',
        ],
        familyPrompt:
          'Share two fake-message examples and have your child point out the scam clues before you reveal the answer.',
        nextStep: 'Practise opening a trusted website directly instead of using a message link.',
        duration: '10 min',
        difficulty: 'Intermediate',
        focus: 'Spotting scams',
        familyMode: 'Play together',
        featured: true,
        activityManagerId: 'phishing-detective',
      },
      {
        id: 'app-permission-inspector',
        name: 'App Permission Inspector',
        icon: '🔍',
        description:
          'Investigate why apps request camera, location, and contacts — and decide which permissions are necessary vs. suspicious.',
        realLifeScenario:
          'A new game asks for access to your location, contacts, and microphone. Should you allow all of these?',
        learningObjective: 'Help children question whether an app really needs the data or device access it requests.',
        keyLearnings: [
          'A torch app never needs your contacts — that is a red flag',
          'Location should only be enabled when the app actually needs it',
          'You can change app permissions at any time in your phone settings',
        ],
        discussionPrompts: [
          'Which permission would you challenge first, and why?',
          'How can we decide whether an app request is useful or excessive?',
        ],
        familyPrompt:
          'Review one installed app together and vote on which permissions are essential, optional, or unnecessary.',
        nextStep: 'Audit one child-safe app together and turn off at least one permission you do not need.',
        duration: '8 min',
        difficulty: 'Intermediate',
        focus: 'Privacy settings',
        familyMode: 'Talk together',
        activityManagerId: 'privacy-settings',
      },
      {
        id: 'privacy-settings-pro',
        name: 'Privacy Settings Pro',
        icon: '⚙️',
        description:
          'Practice configuring privacy settings in simulated Instagram and Roblox accounts to protect your profile from strangers.',
        realLifeScenario:
          'Your parent just allowed you to create an Instagram account. Walk through making it private and safe, step by step.',
        learningObjective: 'Build confidence changing privacy settings before a child starts a new social or gaming account.',
        keyLearnings: [
          'Set your account to Private so only approved followers see your posts',
          'Turn off “Show activity status” to avoid telling strangers when you are online',
          'Never share your phone number on a public profile',
        ],
        discussionPrompts: [
          'Which settings feel most important before posting your first picture or video?',
          'How often should we review privacy settings together after an app update?',
        ],
        familyPrompt:
          'Use this activity as a family setup checklist before your child joins a new platform.',
        nextStep: 'Schedule a monthly ten-minute privacy-settings review for the apps your child uses most.',
        duration: '12 min',
        difficulty: 'Intermediate',
        focus: 'Privacy settings',
        familyMode: 'Talk together',
        activityManagerId: 'privacy-settings',
      },
      {
        id: 'screenshot-safety',
        name: 'Screenshot Safety Challenge',
        icon: '📸',
        description:
          'Learn what happens when screenshots are shared and practise the decision of whether to send or stop before you forward anything.',
        realLifeScenario:
          'A classmate messages you a funny screenshot of another friend looking silly. They want you to share it in the class group chat.',
        learningObjective: 'Show how screenshots can turn private moments into lasting digital footprints.',
        keyLearnings: [
          'Screenshots can spread far beyond the original audience',
          "Sharing someone else's image without permission can be a form of cyberbullying",
          'Ask: “Would I be okay if this were a screenshot of me?”',
        ],
        discussionPrompts: [
          'What changes when a private message becomes a screenshot?',
          'How could you step out of a screenshot chain without making things worse?',
        ],
        familyPrompt:
          'Talk through a real group-chat situation and decide together when forwarding a screenshot would cross a line.',
        nextStep: 'Create a family pause phrase for chats: “Would I share this if everyone could see it?”',
        duration: '8 min',
        difficulty: 'Intermediate',
        focus: 'Digital footprint',
        familyMode: 'Talk together',
        activityManagerId: 'safe-unsafe',
      },
      {
        id: 'password-strength-lab',
        name: 'Password Strength Lab',
        icon: '🧪',
        description:
          'Test real-looking passwords and learn what makes them strong or weak. Build a memorable passphrase you will actually use.',
        realLifeScenario:
          'Your school account password is “123abc”. Your IT teacher says it was found in a data breach. Create a better one now.',
        learningObjective: 'Teach families how to build strong, memorable passwords without reusing them everywhere.',
        keyLearnings: [
          'Longer passphrases (3–4 random words) beat short complex passwords',
          'Never reuse the same password across different accounts',
          'A password manager app can remember strong passwords for you',
        ],
        discussionPrompts: [
          'Why is a long phrase easier to remember and harder to crack?',
          'Which family accounts would cause the biggest problem if their password was reused?',
        ],
        familyPrompt:
          'Challenge each other to turn weak sample passwords into stronger passphrases and explain why the new version wins.',
        nextStep: 'Choose one important family account and update it to a stronger password or passphrase.',
        duration: '9 min',
        difficulty: 'Intermediate',
        focus: 'Account security',
        familyMode: 'Play together',
        activityManagerId: 'password-strength',
      },
    ],
  },
  {
    ageRange: '13-17',
    label: 'Digital Citizens',
    emoji: '🌐',
    description: 'Real-world privacy skills for social media, future careers, and digital rights',
    activities: [
      {
        id: 'password-fortress-builder',
        name: 'Password Fortress Builder',
        icon: '🏰',
        description:
          'Build a complete personal security system: passphrases, a password manager strategy, and two-factor authentication on key accounts.',
        realLifeScenario:
          'You have 25 different online accounts. One gets hacked and you realise you used the same password everywhere. Fix this now.',
        learningObjective: 'Help teens create a realistic account security plan they will actually keep using.',
        keyLearnings: [
          'Use a password manager (e.g. Bitwarden) — it is free and secure',
          'Enable 2FA (two-factor authentication) on email, banking, and social accounts',
          'Your email account is the master key — protect it most carefully',
        ],
        discussionPrompts: [
          'Which account would cause the most damage if it were compromised first?',
          'What security habits feel realistic to keep every week, not just today?',
        ],
        familyPrompt:
          'Ask your teen to map out their top three accounts and decide which one should get a stronger password or 2FA first.',
        nextStep: 'Turn on 2FA for one important account together and save the backup codes somewhere secure.',
        duration: '15 min',
        difficulty: 'Advanced',
        focus: 'Account security',
        familyMode: 'Teen-led reflection',
        featured: true,
        activityManagerId: 'password-fortress',
      },
      {
        id: 'online-reputation-audit',
        name: 'Online Reputation Audit',
        icon: '🔎',
        description:
          'Simulate what a college admissions officer or future employer finds when they search your name. Learn to manage your digital reputation.',
        realLifeScenario:
          'You are applying for a summer job at a local café. The manager Googles your name before the interview. What do they find?',
        learningObjective: 'Show teens how digital reputation affects opportunities long after a post is shared.',
        keyLearnings: [
          'Google yourself regularly to know what is publicly visible',
          'Old posts and tagged photos can surface years later',
          'A LinkedIn profile with good content can outrank embarrassing old posts',
        ],
        discussionPrompts: [
          'What parts of your current online footprint would you be proud to have a future employer see?',
          'What would you want to change before an interview or university application?',
        ],
        familyPrompt:
          'Invite your teen to do a private “search your name” review and talk through what feels accurate, outdated, or too public.',
        nextStep: 'Review one public-facing profile or search result and decide whether to edit, archive, or strengthen it.',
        duration: '12 min',
        difficulty: 'Advanced',
        focus: 'Digital footprint',
        familyMode: 'Teen-led reflection',
        featured: true,
        activityManagerId: 'social-media-audit',
      },
      {
        id: 'data-broker-discovery',
        name: 'Data Broker Discovery',
        icon: '📊',
        description:
          'Discover what data broker websites have gathered about your family, and walk through the opt-out process to reclaim your information.',
        realLifeScenario:
          'You find a website listing your home address, family members, and estimated income — all publicly searchable. How did they get it?',
        learningObjective: 'Reveal how public records and commercial data create detailed family profiles online.',
        keyLearnings: [
          'Data brokers collect information from public records, social media, and purchases',
          'Most brokers have an opt-out page — it takes time but is effective',
          'Services like DeleteMe automate removal requests for a subscription fee',
        ],
        discussionPrompts: [
          'Which personal details feel most surprising or invasive when listed by a broker?',
          'How much effort would our family invest to remove public listings, and where would we start?',
        ],
        familyPrompt:
          'Research one broker site together and decide whether your family wants to submit a removal request.',
        nextStep: 'Pick one broker or people-search site and document the opt-out steps for later follow-up.',
        duration: '15 min',
        difficulty: 'Advanced',
        focus: 'Digital footprint',
        familyMode: 'Talk together',
        activityManagerId: 'digital-footprint',
      },
      {
        id: 'privacy-rights-challenge',
        name: 'Privacy Rights Challenge',
        icon: '⚖️',
        description:
          'Test your knowledge of COPPA, GDPR, and the “right to be forgotten”. Understand what schools and companies can and cannot do with your data.',
        realLifeScenario:
          'Your school wants to share student assessment data with a third-party tutoring app. Do they need your parents’ permission first?',
        learningObjective: 'Help teens connect privacy laws to their real rights at school, online, and in everyday apps.',
        keyLearnings: [
          'COPPA (USA) and GDPR (Europe) give you rights over how your data is used',
          'You can request that a company delete your personal data in many countries',
          'Schools are covered by FERPA in the US — parents can inspect all education records',
        ],
        discussionPrompts: [
          'Which privacy right would you use first if a company collected too much about you?',
          'How should parents and teens work together when schools or apps request consent?',
        ],
        familyPrompt:
          'Read one privacy right together and discuss where it could matter in your teen’s school, sports, or app life.',
        nextStep: 'Choose one service your teen uses and check where it explains deletion, consent, or data-access rights.',
        duration: '12 min',
        difficulty: 'Advanced',
        focus: 'Digital rights',
        familyMode: 'Talk together',
        activityManagerId: 'digital-rights',
      },
      {
        id: 'social-media-simulator',
        name: 'Social Media Privacy Simulator',
        icon: '📱',
        description:
          'Make real privacy decisions in a realistic social media simulator — posting, sharing, DMs, and location tagging — and see the consequences.',
        realLifeScenario:
          'You post a photo from a party. Three days later it causes drama at school. Walk through removing it, managing reposts, and the aftermath.',
        learningObjective: 'Give teens a safe space to practise high-pressure sharing decisions before they happen for real.',
        keyLearnings: [
          'Location tags on photos reveal exactly where you were and when',
          'Even deleted posts can be screenshotted and saved by others',
          'Think before posting: “Am I happy for my grandparent, teacher, and future boss to see this?”',
        ],
        discussionPrompts: [
          'Which part of a post feels most risky: the caption, the photo, the location, or the audience?',
          'How would you recover if a post reached more people than you expected?',
        ],
        familyPrompt:
          'Use the scenario to agree on one family “pause before posting” habit that respects your teen’s independence.',
        nextStep: 'Review location-sharing settings on one social app and decide whether the default is still right for you.',
        duration: '18 min',
        difficulty: 'Advanced',
        focus: 'Safe sharing',
        familyMode: 'Teen-led reflection',
        activityManagerId: 'social-simulator',
      },
      {
        id: 'ai-and-your-privacy',
        name: 'AI & Your Privacy',
        icon: '🤖',
        description:
          'Understand what AI tools like ChatGPT do with your prompts, and learn safe practices for using AI without accidentally exposing personal information.',
        realLifeScenario:
          'You paste a friend\'s personal essay into ChatGPT to get feedback. What are the privacy implications for your friend — and for you?',
        learningObjective: 'Help teens treat AI prompts like public submissions unless they know the privacy settings and limits.',
        keyLearnings: [
          'AI prompts may be used to train future models — treat them like public messages',
          'Never paste personal data (passport numbers, addresses, medical info) into AI tools',
          'Check the privacy settings of any AI service before sharing sensitive content',
        ],
        discussionPrompts: [
          'What kinds of homework or personal data should stay out of an AI prompt completely?',
          'How can you get AI help without sharing someone else’s sensitive information?',
        ],
        familyPrompt:
          'Talk through one real AI use case from school and decide what information is safe to include and what must stay private.',
        nextStep: 'Choose one AI tool you use and review its privacy settings, history, and data controls together.',
        duration: '10 min',
        difficulty: 'Advanced',
        focus: 'Digital footprint',
        familyMode: 'Talk together',
        activityManagerId: 'privacy-decoder',
      },
    ],
  },
];

export const flattenAgeBasedActivities = (): FlattenedAgeBasedActivity[] =>
  ageBasedActivities.flatMap((group) =>
    group.activities.map((activity) => ({
      ...activity,
      groupAgeRange: group.ageRange,
      groupLabel: group.label,
      groupEmoji: group.emoji,
    }))
  );

export const getFeaturedAgeBasedActivities = (
  activities: FlattenedAgeBasedActivity[] = flattenAgeBasedActivities()
): FlattenedAgeBasedActivity[] => activities.filter((activity) => activity.featured);
