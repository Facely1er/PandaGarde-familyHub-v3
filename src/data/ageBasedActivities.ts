export interface AgeBasedActivity {
  id: string;
  name: string;
  icon: string;
  description: string;
  realLifeScenario: string;
  keyLearnings: string[];
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  /** If set, this maps to an existing ActivityManager game ID */
  activityManagerId?: string;
}

export interface AgeGroup {
  ageRange: string;
  label: string;
  emoji: string;
  description: string;
  activities: AgeBasedActivity[];
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
        keyLearnings: [
          'Your home address and full name are private — keep them at home',
          'A nickname or first name only is fine for games',
          'Ask a grown-up before filling in any forms online',
        ],
        duration: '5 min',
        difficulty: 'Beginner',
        activityManagerId: 'sorting',
      },
      {
        id: 'traffic-light-safety',
        name: 'Traffic Light: Safe or Not?',
        icon: '🚦',
        description:
          'Use a red, yellow, and green light to decide if sharing something online is safe, risky, or definitely not okay.',
        realLifeScenario:
          'A fun game says: "You won a prize! Tell us your address to receive it." Red, yellow, or green?',
        keyLearnings: [
          'Green = safe to share (favourite colour, pet name)',
          'Yellow = ask a grown-up first (your photo, school name)',
          'Red = never share online (address, phone number, password)',
        ],
        duration: '6 min',
        difficulty: 'Beginner',
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
        keyLearnings: [
          'Passwords are like house keys — only for your family',
          'A good password is long and uses letters, numbers, and a symbol',
          'Never type your password where others can see',
        ],
        duration: '6 min',
        difficulty: 'Beginner',
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
        keyLearnings: [
          'Online friends are still strangers until a trusted adult has checked',
          'It is always okay to say "I need to ask my parent" and log off',
          'Tell a trusted adult straight away if a message makes you uncomfortable',
        ],
        duration: '7 min',
        difficulty: 'Beginner',
        activityManagerId: 'coloring',
      },
      {
        id: 'my-info-collage',
        name: 'My Public & Private Collage',
        icon: '🎨',
        description:
          'Create a collage that separates "okay to share" information from "keep private" information using Privacy Panda characters.',
        realLifeScenario:
          'Your class is making a school website. Which things about yourself can you put on it for everyone to see?',
        keyLearnings: [
          'Public: hobbies, favourite food, what you like to draw',
          'Private: your address, phone, password, or full birthday',
          'Even friends should not share your private details for you',
        ],
        duration: '8 min',
        difficulty: 'Beginner',
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
        keyLearnings: [
          'Always ask before sharing someone else\'s photo',
          'It is okay to say "no" and that choice must be respected',
          'Once posted online, photos are very hard to remove completely',
        ],
        duration: '6 min',
        difficulty: 'Beginner',
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
        keyLearnings: [
          'Games and apps track your location, search history, and play patterns',
          'This data can be sold to other companies',
          'Checking privacy settings regularly helps limit what is collected',
        ],
        duration: '10 min',
        difficulty: 'Intermediate',
      },
      {
        id: 'phishing-patrol',
        name: 'Phishing Patrol',
        icon: '🎣',
        description:
          'Spot fake messages pretending to be from games, schools, or prize competitions. Real-style examples in a safe practice space.',
        realLifeScenario:
          '"You won 10,000 Robux! Click here and log in to claim your reward." Is this message real or a trick?',
        keyLearnings: [
          'Phishing messages create urgency and promise rewards',
          'Check the sender address — it is often slightly wrong',
          'Never click links in messages; go directly to the official website',
        ],
        duration: '10 min',
        difficulty: 'Intermediate',
        activityManagerId: 'quiz',
      },
      {
        id: 'app-permission-inspector',
        name: 'App Permission Inspector',
        icon: '🔍',
        description:
          'Investigate why apps request camera, location, and contacts — and decide which permissions are necessary vs. suspicious.',
        realLifeScenario:
          'A new game asks for access to your location, contacts, and microphone. Should you allow all of these?',
        keyLearnings: [
          'A torch app never needs your contacts — that is a red flag',
          'Location should only be enabled when the app actually needs it',
          'You can change app permissions at any time in your phone settings',
        ],
        duration: '8 min',
        difficulty: 'Intermediate',
      },
      {
        id: 'privacy-settings-pro',
        name: 'Privacy Settings Pro',
        icon: '⚙️',
        description:
          'Practice configuring privacy settings in simulated Instagram and Roblox accounts to protect your profile from strangers.',
        realLifeScenario:
          'Your parent just allowed you to create an Instagram account. Walk through making it private and safe, step by step.',
        keyLearnings: [
          'Set your account to Private so only approved followers see your posts',
          'Turn off "Show activity status" to avoid telling strangers when you are online',
          'Never share your phone number on a public profile',
        ],
        duration: '12 min',
        difficulty: 'Intermediate',
      },
      {
        id: 'screenshot-safety',
        name: 'Screenshot Safety Challenge',
        icon: '📸',
        description:
          'Learn what happens when screenshots are shared and practise the decision of whether to send or stop before you forward anything.',
        realLifeScenario:
          'A classmate messages you a funny screenshot of another friend looking silly. They want you to share it in the class group chat.',
        keyLearnings: [
          'Screenshots can spread far beyond the original audience',
          'Sharing someone else\'s image without permission can be a form of cyberbullying',
          'Ask: "Would I be okay if this were a screenshot of me?"',
        ],
        duration: '8 min',
        difficulty: 'Intermediate',
      },
      {
        id: 'password-strength-lab',
        name: 'Password Strength Lab',
        icon: '🧪',
        description:
          'Test real-looking passwords and learn what makes them strong or weak. Build a memorable passphrase you will actually use.',
        realLifeScenario:
          'Your school account password is "123abc". Your IT teacher says it was found in a data breach. Create a better one now.',
        keyLearnings: [
          'Longer passphrases (3–4 random words) beat short complex passwords',
          'Never reuse the same password across different accounts',
          'A password manager app can remember strong passwords for you',
        ],
        duration: '9 min',
        difficulty: 'Intermediate',
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
        keyLearnings: [
          'Use a password manager (e.g. Bitwarden) — it is free and secure',
          'Enable 2FA (two-factor authentication) on email, banking, and social accounts',
          'Your email account is the master key — protect it most carefully',
        ],
        duration: '15 min',
        difficulty: 'Advanced',
      },
      {
        id: 'online-reputation-audit',
        name: 'Online Reputation Audit',
        icon: '🔎',
        description:
          'Simulate what a college admissions officer or future employer finds when they search your name. Learn to manage your digital reputation.',
        realLifeScenario:
          'You are applying for a summer job at a local café. The manager Googles your name before the interview. What do they find?',
        keyLearnings: [
          'Google yourself regularly to know what is publicly visible',
          'Old posts and tagged photos can surface years later',
          'A LinkedIn profile with good content can outrank embarrassing old posts',
        ],
        duration: '12 min',
        difficulty: 'Advanced',
      },
      {
        id: 'data-broker-discovery',
        name: 'Data Broker Discovery',
        icon: '📊',
        description:
          'Discover what data broker websites have gathered about your family, and walk through the opt-out process to reclaim your information.',
        realLifeScenario:
          'You find a website listing your home address, family members, and estimated income — all publicly searchable. How did they get it?',
        keyLearnings: [
          'Data brokers collect information from public records, social media, and purchases',
          'Most brokers have an opt-out page — it takes time but is effective',
          'Services like DeleteMe automate removal requests for a subscription fee',
        ],
        duration: '15 min',
        difficulty: 'Advanced',
      },
      {
        id: 'privacy-rights-challenge',
        name: 'Privacy Rights Challenge',
        icon: '⚖️',
        description:
          'Test your knowledge of COPPA, GDPR, and the "right to be forgotten". Understand what schools and companies can and cannot do with your data.',
        realLifeScenario:
          'Your school wants to share student assessment data with a third-party tutoring app. Do they need your parents\' permission first?',
        keyLearnings: [
          'COPPA (USA) and GDPR (Europe) give you rights over how your data is used',
          'You can request that a company delete your personal data in many countries',
          'Schools are covered by FERPA in the US — parents can inspect all education records',
        ],
        duration: '12 min',
        difficulty: 'Advanced',
      },
      {
        id: 'social-media-simulator',
        name: 'Social Media Privacy Simulator',
        icon: '📱',
        description:
          'Make real privacy decisions in a realistic social media simulator — posting, sharing, DMs, and location tagging — and see the consequences.',
        realLifeScenario:
          'You post a photo from a party. Three days later it causes drama at school. Walk through removing it, managing reposts, and the aftermath.',
        keyLearnings: [
          'Location tags on photos reveal exactly where you were and when',
          'Even deleted posts can be screenshotted and saved by others',
          'Think before posting: "Am I happy for my grandparent, teacher, and future boss to see this?"',
        ],
        duration: '18 min',
        difficulty: 'Advanced',
      },
      {
        id: 'ai-and-your-privacy',
        name: 'AI & Your Privacy',
        icon: '🤖',
        description:
          'Understand what AI tools like ChatGPT do with your prompts, and learn safe practices for using AI without accidentally exposing personal information.',
        realLifeScenario:
          'You paste a friend\'s personal essay into ChatGPT to get feedback. What are the privacy implications for your friend — and for you?',
        keyLearnings: [
          'AI prompts may be used to train future models — treat them like public messages',
          'Never paste personal data (passport numbers, addresses, medical info) into AI tools',
          'Check the privacy settings of any AI service before sharing sensitive content',
        ],
        duration: '10 min',
        difficulty: 'Advanced',
      },
    ],
  },
];
