/**
 * Child-Friendly Service Catalog
 * Age-appropriate apps and platforms that children commonly use
 * Includes privacy risk ratings and age recommendations
 */

export type ServiceCategory = 
  | 'social-media' 
  | 'messaging' 
  | 'gaming' 
  | 'streaming' 
  | 'education'
  | 'edtech'
  | 'ai'
  | 'telecom'
  | 'health'
  | 'creative' 
  | 'other';

/** Sub-type for health-category services (family-reported catalog only). */
export type HealthSubcategory =
  | 'wellness-fitness'
  | 'mental-wellness'
  | 'telehealth'
  | 'patient-portal'
  | 'school-health'
  | 'pharmacy-retail'
  | 'reproductive-health';

export type RiskLevel = 'low' | 'medium' | 'high' | 'very-high';

export type AgeGroup = '5-8' | '9-12' | '13-17';

export interface ChildService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  minAge: number; // Minimum recommended age
  riskLevel: RiskLevel;
  privacyConcerns: string[]; // Child-friendly explanations
  parentTips: string[]; // Tips for parents
  icon?: string; // Icon name or URL
  logoUrl?: string; // Service logo URL (will be generated from service ID)
  website?: string; // Official website
  /** True when the app is typically assigned by a school/district — exposure is involuntary */
  schoolAssigned?: boolean;
  /** Vendor or company behind the service */
  vendor?: string;
  /**
   * Documented concerns about this service sharing user data with
   * government agencies or law enforcement.
   * Presence of any items means the service has known LE data-sharing practices.
   */
  lawEnforcementConcerns?: string[];
  /** Present when category is health — drives DFA context and parent guidance. */
  healthSubcategory?: HealthSubcategory;
}

export const childServiceCatalog: ChildService[] = [
  // Social Media (13+)
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social-media',
    description: 'Photo and video sharing app',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'Shares photos and videos publicly',
      'Can receive messages from strangers',
      'Location can be shared in photos'
    ],
    parentTips: [
      'Set account to private',
      'Review followers regularly',
      'Disable location sharing',
      'Monitor direct messages'
    ],
    website: 'https://www.instagram.com',
    lawEnforcementConcerns: [
      'Meta (Instagram\'s parent) receives tens of thousands of government data requests annually and complies with a high percentage of them',
      'Account content, DMs, and metadata can be handed to law enforcement with a valid legal order — messages are not end-to-end encrypted',
      'Emergency disclosure requests allow Meta to share data without a warrant in certain circumstances'
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social-media',
    description: 'Short video sharing app',
    minAge: 13,
    riskLevel: 'very-high',
    privacyConcerns: [
      'Videos can go viral',
      'Comments from strangers',
      'Personal information in videos',
      'Addictive content'
    ],
    parentTips: [
      'Use Family Pairing feature',
      'Set screen time limits',
      'Enable Restricted Mode',
      'Review privacy settings'
    ],
    website: 'https://www.tiktok.com',
    lawEnforcementConcerns: [
      'ByteDance (TikTok\'s parent) is legally required under China\'s National Security Law to hand data to the Chinese government upon request — with no judicial oversight and no obligation to notify users',
      'TikTok employees in China have been confirmed to have accessed US user data, including private messages',
      'US law enforcement also submits data requests; TikTok publishes a transparency report but China-directed access is not disclosed',
      'Data may be stored on servers accessible to Chinese authorities despite "Project Texas" data localisation efforts'
    ]
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    category: 'social-media',
    description: 'Disappearing photo and video messages',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'Messages "disappear" but can be saved',
      'Location sharing with friends',
      'Can receive snaps from strangers',
      'Screenshots can be taken'
    ],
    parentTips: [
      'Review friend list regularly',
      'Disable location sharing',
      'Set "Who can contact me" to Friends only',
      'Monitor Snap Map usage'
    ],
    website: 'https://www.snapchat.com'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'social-media',
    description: 'Image discovery and idea boards',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Public boards can reveal interests and location',
      'Comments and messages from other users',
      'Suggested pins may show grown-up content',
      'Shopping links keep track of what your child looks at'
    ],
    parentTips: [
      'Set account to private',
      'Review boards and followers regularly',
      'Turn off personalized ads in settings, where offered',
      'Discuss what not to pin publicly'
    ],
    website: 'https://www.pinterest.com'
  },
  
  // Messaging Apps
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'messaging',
    description: 'Text and video messaging app',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Can message anyone with phone number',
      'Group chats can include strangers',
      'Read receipts show when messages are read'
    ],
    parentTips: [
      'Review contact list',
      'Set privacy to "My Contacts"',
      'Monitor group chats',
      'Disable read receipts if needed'
    ],
    website: 'https://www.whatsapp.com'
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'messaging',
    description: 'Chat app for gaming and communities',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'Can join public servers with strangers',
      'Voice and video chat with unknown people',
      'Direct messages from anyone',
      'Inappropriate content in some servers'
    ],
    parentTips: [
      'Review server memberships',
      'Set privacy to "Friends Only"',
      'Monitor direct messages',
      'Use Safe Direct Messaging setting'
    ],
    website: 'https://discord.com'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'messaging',
    description: 'Cloud-based messaging with groups and channels',
    minAge: 16,
    riskLevel: 'high',
    privacyConcerns: [
      'Public channels and large groups with strangers',
      'Secret chats are not visible to parents',
      'Bots and links can expose scams or mature content',
      'Others may find your teen by their phone number'
    ],
    parentTips: [
      'Restrict who can add your teen to groups',
      'Disable nearby people and username search if needed',
      'Discuss never joining unknown channels',
      'Check which devices are signed in to the account'
    ],
    website: 'https://telegram.org'
  },
  
  // Gaming
  {
    id: 'roblox',
    name: 'Roblox',
    category: 'gaming',
    description: 'Online game creation and playing platform',
    minAge: 7,
    riskLevel: 'medium',
    privacyConcerns: [
      'Can chat with other players',
      'User-generated content may be inappropriate',
      'In-game purchases',
      'Can receive friend requests from strangers'
    ],
    parentTips: [
      'Enable Account Restrictions',
      'Set up Parent PIN',
      'Disable chat or set to Friends only',
      'Monitor spending'
    ],
    website: 'https://www.roblox.com'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    category: 'gaming',
    description: 'Building and adventure game',
    minAge: 7,
    riskLevel: 'low',
    privacyConcerns: [
      'Multiplayer servers can have strangers',
      'Chat with other players',
      'User-generated content'
    ],
    parentTips: [
      'Play on private servers',
      'Disable online multiplayer if needed',
      'Review server rules',
      'Monitor chat'
    ],
    website: 'https://www.minecraft.net'
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    category: 'gaming',
    description: 'Battle royale game',
    minAge: 12,
    riskLevel: 'medium',
    privacyConcerns: [
      'Voice chat with strangers',
      'In-game purchases',
      'Addictive gameplay',
      'Can receive friend requests'
    ],
    parentTips: [
      'Disable voice chat',
      'Set up Parental Controls',
      'Monitor play time',
      'Review friend requests'
    ],
    website: 'https://www.epicgames.com/fortnite'
  },
  {
    id: 'among-us',
    name: 'Among Us',
    category: 'gaming',
    description: 'Multiplayer social deduction game',
    minAge: 10,
    riskLevel: 'medium',
    privacyConcerns: [
      'Public lobbies with voice/text from strangers',
      'Usernames and chat can expose personal info',
      'In-app purchases for cosmetics'
    ],
    parentTips: [
      'Play private games with friends only',
      'Turn off free chat or use quick chat',
      'Review username choices',
      'Set spending limits on the platform store'
    ],
    website: 'https://www.innersloth.com/games/among-us/'
  },
  {
    id: 'steam',
    name: 'Steam',
    category: 'gaming',
    description: 'PC game store, library, and community platform',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Community forums and friend lists',
      'Mature games available in the store',
      'Voice chat in some multiplayer titles',
      'Trading and marketplace interactions'
    ],
    parentTips: [
      'Use Family View parental controls',
      'Approve purchases and friend requests',
      'Review game age ratings before installing',
      'Limit community features for younger teens'
    ],
    website: 'https://store.steampowered.com'
  },
  
  // Streaming
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'streaming',
    description: 'Video sharing and watching platform',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'Inappropriate content',
      'Comments from strangers',
      'Can upload videos publicly',
      'Recommended videos may be unsuitable'
    ],
    parentTips: [
      'Use YouTube Kids for younger children',
      'Enable Restricted Mode',
      'Monitor watch history',
      'Disable comments on uploads'
    ],
    website: 'https://www.youtube.com'
  },
  {
    id: 'youtube-kids',
    name: 'YouTube Kids',
    category: 'streaming',
    description: 'Child-friendly version of YouTube',
    minAge: 4,
    riskLevel: 'low',
    privacyConcerns: [
      'Some content may still be inappropriate',
      'Ads may not be age-appropriate'
    ],
    parentTips: [
      'Set content level',
      'Review watch history',
      'Block specific channels',
      'Set time limits'
    ],
    website: 'https://www.youtubekids.com'
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'streaming',
    description: 'Movie and TV show streaming',
    minAge: 7,
    riskLevel: 'low',
    privacyConcerns: [
      'Viewing history tracked',
      'Recommendations based on viewing',
      'Some content may be inappropriate'
    ],
    parentTips: [
      'Set up Kids profile',
      'Review content ratings',
      'Monitor viewing history',
      'Set PIN for mature content'
    ],
    website: 'https://www.netflix.com'
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    category: 'streaming',
    description: 'Family movies, shows, and Disney-owned streaming content',
    minAge: 4,
    riskLevel: 'low',
    privacyConcerns: [
      'Viewing history and profiles tracked',
      'Suggestions, and ads on some plans, are based on what your child watches',
      'Child profiles still linked to a household account'
    ],
    parentTips: [
      'Use a Kids profile with content filters',
      'Set a PIN for switching profiles',
      'Review watch history together',
      'Turn off autoplay if it encourages binge-watching'
    ],
    website: 'https://www.disneyplus.com',
    vendor: 'Disney'
  },
  {
    id: 'amazon-prime-video',
    name: 'Prime Video',
    category: 'streaming',
    description: 'Movies and TV streaming tied to Amazon accounts',
    minAge: 7,
    riskLevel: 'medium',
    privacyConcerns: [
      'What your child watches is linked to your Amazon shopping and ads',
      'Rentals and channels can expose mature content',
      'Household sharing blurs who watched what'
    ],
    parentTips: [
      'Enable PIN for purchases and mature titles',
      'Use Amazon Kids or restricted profiles where available',
      'Review channel subscriptions',
      'Separate child viewing on a family profile when possible'
    ],
    website: 'https://www.primevideo.com',
    vendor: 'Amazon',
    lawEnforcementConcerns: [
      'Amazon receives large volumes of law enforcement requests and publishes compliance rates in its transparency reports',
      'Prime Video activity can be correlated with broader Amazon account, device, and purchase data'
    ]
  },
  {
    id: 'hulu',
    name: 'Hulu',
    category: 'streaming',
    description: 'TV, movies, and live TV streaming',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Mature content available on the same account',
      'What your child watches is used to choose ads',
      'Live TV may include unfiltered channels'
    ],
    parentTips: [
      'Create a teen-appropriate profile with restrictions',
      'Block mature titles with profile PINs',
      'Review Hulu Kids content only for younger children',
      'If your plan has ads, know that viewing is used to choose them'
    ],
    website: 'https://www.hulu.com',
    vendor: 'Disney (Hulu)'
  },
  {
    id: 'max',
    name: 'Max',
    category: 'streaming',
    description: 'HBO, Warner, and Discovery streaming shows and films',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Includes mature HBO content on shared accounts',
      'Viewing history used for recommendations',
      'Ad-supported tier collects viewing for advertising'
    ],
    parentTips: [
      'Use Kids & Family profile for younger viewers',
      'Set profile PINs to limit profile switching',
      'Review content ratings before allowing solo viewing',
      'Monitor watch history on shared family accounts'
    ],
    website: 'https://www.max.com',
    vendor: 'Warner Bros. Discovery'
  },
  {
    id: 'apple-tv',
    name: 'Apple TV',
    category: 'streaming',
    description: 'Apple shows, movies, and channels in the TV app',
    minAge: 7,
    riskLevel: 'low',
    privacyConcerns: [
      'Viewing tied to Apple ID and Family Sharing',
      'Channels from other companies have their own privacy rules',
      'Purchase history visible on shared devices'
    ],
    parentTips: [
      'Use Screen Time and content restrictions',
      'Require Ask to Buy for purchases',
      'Review Family Sharing settings',
      'Check channel-specific parental controls'
    ],
    website: 'https://www.apple.com/apple-tv-app/',
    vendor: 'Apple'
  },
  {
    id: 'paramount-plus',
    name: 'Paramount+',
    category: 'streaming',
    description: 'CBS, Nickelodeon, and Paramount movies and shows',
    minAge: 7,
    riskLevel: 'low',
    privacyConcerns: [
      'Kids and adult content on one subscription',
      'Viewing data used for recommendations',
      'Live sports and news may not be age-appropriate'
    ],
    parentTips: [
      'Use kid profiles where available',
      'Restrict live TV for younger children',
      'Review Nickelodeon vs. general catalog access',
      'Set PINs for profile changes'
    ],
    website: 'https://www.paramountplus.com',
    vendor: 'Paramount'
  },
  {
    id: 'peacock',
    name: 'Peacock',
    category: 'streaming',
    description: 'NBCUniversal streaming with shows, sports, and movies',
    minAge: 10,
    riskLevel: 'medium',
    privacyConcerns: [
      'Live TV and news may include mature content',
      'Ad-supported tiers track viewing for ads',
      'Sports and late-night content on shared accounts'
    ],
    parentTips: [
      'Use parental controls and PINs',
      'Choose ad-free family plans if available',
      'Block live channels for younger kids',
      'Review profile settings regularly'
    ],
    website: 'https://www.peacocktv.com',
    vendor: 'NBCUniversal'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'streaming',
    description: 'Music and podcast streaming',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'What your child listens to builds a detailed picture of their interests',
      'Podcasts may include explicit content',
      'Social features can expose activity to others',
      'Wrapped and recommendations reveal habits'
    ],
    parentTips: [
      'Use Spotify Kids for children under 13',
      'Turn off sharing of what your child listens to',
      'Review explicit content filters',
      'Discuss podcast sources before subscribing'
    ],
    website: 'https://www.spotify.com'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'streaming',
    description: 'Live game streaming and creator broadcasts',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'Unfiltered live chat with strangers',
      'Mature language and content on many streams',
      'Donations and private messages from viewers',
      'Recommendations can surface inappropriate streams'
    ],
    parentTips: [
      'Turn off whispers (private messages) and limit who can chat',
      'Follow only approved channels',
      'Use supervised viewing for younger teens',
      'Turn off notifications from unknown creators'
    ],
    website: 'https://www.twitch.tv',
    vendor: 'Amazon',
    lawEnforcementConcerns: [
      'Twitch is owned by Amazon; stream metadata, chat logs, and account data can be disclosed to law enforcement under Amazon\'s policies'
    ]
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    category: 'streaming',
    description: 'Anime and Asian media streaming',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Anime ratings vary; some series are mature',
      'Community forums and comments',
      'Watch history used for recommendations'
    ],
    parentTips: [
      'Review series ratings before approving',
      'Disable forums for younger teens',
      'Use mature content filters',
      'Co-watch unfamiliar series first'
    ],
    website: 'https://www.crunchyroll.com',
    vendor: 'Sony'
  },
  {
    id: 'pbs-kids',
    name: 'PBS Kids Video',
    category: 'streaming',
    description: 'Educational shows and games from PBS Kids',
    minAge: 3,
    riskLevel: 'low',
    privacyConcerns: [
      'Limited ads but usage may still be tracked',
      'Links can open external sites',
      'Local station branding varies by region'
    ],
    parentTips: [
      'Download for offline viewing when traveling',
      'Review games vs. video time balance',
      'Use together to discuss shows',
      'Check PBS Kids privacy policy for your region'
    ],
    website: 'https://pbskids.org/video'
  },
  
  // Education
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    category: 'education',
    description: 'Free educational videos and exercises',
    minAge: 5,
    riskLevel: 'low',
    privacyConcerns: [
      'Progress tracking',
      'Account creation required'
    ],
    parentTips: [
      'Review progress together',
      'Set learning goals',
      'Monitor account activity'
    ],
    website: 'https://www.khanacademy.org'
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    category: 'education',
    description: 'Language learning app',
    minAge: 6,
    riskLevel: 'low',
    privacyConcerns: [
      'Progress tracking',
      'Can add friends',
      'Leaderboards'
    ],
    parentTips: [
      'Review privacy settings',
      'Monitor friend requests',
      'Set learning goals'
    ],
    website: 'https://www.duolingo.com'
  },
  
  // Creative
  {
    id: 'scratch',
    name: 'Scratch',
    category: 'creative',
    description: 'Learn to code by creating games and animations',
    minAge: 8,
    riskLevel: 'low',
    privacyConcerns: [
      'Can share projects publicly',
      'Comments on projects',
      'Can follow other users'
    ],
    parentTips: [
      'Review shared projects',
      'Monitor comments',
      'Set privacy to "Unlisted" if needed'
    ],
    website: 'https://scratch.mit.edu'
  },
  {
    id: 'canva',
    name: 'Canva',
    category: 'creative',
    description: 'Design tool for presentations, posters, and social graphics',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Projects can be shared publicly via link',
      'Some templates and stock images track how they are used',
      'School accounts and personal accounts collect different information',
      'AI image tools may store prompts'
    ],
    parentTips: [
      'Use Canva for Education when offered by school',
      'Keep projects private by default',
      'Review AI feature settings',
      'Discuss copyright when using templates'
    ],
    website: 'https://www.canva.com'
  },

  // ── EdTech / School-Assigned ──────────────────────────────────────────────
  // These are commonly assigned by schools or districts. Students are exposed
  // to them as part of their school context, independently of family choice.

  {
    id: 'google-classroom',
    name: 'Google Classroom',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Google (Alphabet)',
    description: 'School LMS for assignments, grades, and class communication',
    minAge: 6,
    riskLevel: 'medium',
    privacyConcerns: [
      'Google keeps a record of how your child uses Classroom',
      'The school account also works with other Google apps',
      'Add-on apps that teachers connect can see your child’s schoolwork',
      'The school can see how and when your child uses it'
    ],
    parentTips: [
      'Ask the school for its written privacy agreement with Google',
      'Ask which add-on apps teachers have connected to Classroom',
      'Make sure your child uses the school account, not a personal Google account',
      'Know that the school can see everything done in the school account'
    ],
    website: 'https://classroom.google.com',
    lawEnforcementConcerns: [
      'Google receives government data requests and can be compelled to hand over student account data, assignments, and communications via court order',
      'National Security Letters (NSLs) issued to Google can require secret disclosure of student account data without notifying the school or family',
      'Google for Education accounts are not immune from law enforcement access — FERPA provides rights against the school but not against government subpoenas to Google'
    ]
  },
  {
    id: 'microsoft-teams-edu',
    name: 'Microsoft Teams (Education)',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Microsoft',
    description: 'School communication, video class, and assignment hub',
    minAge: 6,
    riskLevel: 'medium',
    privacyConcerns: [
      'Microsoft keeps class chats and meeting history',
      'Class recordings can be kept by school or Microsoft',
      'Records how your child uses Teams',
      'Connected to other school Microsoft apps like OneDrive and OneNote'
    ],
    parentTips: [
      'Ask the school for its written privacy agreement with Microsoft',
      'Ask whether class meetings are recorded and how long recordings are kept',
      'Review what assignments and files are stored in OneDrive',
      'Check that the account is school-managed, not a personal Microsoft account'
    ],
    website: 'https://www.microsoft.com/en-us/microsoft-teams/education',
    lawEnforcementConcerns: [
      'Microsoft receives government data requests and can be compelled to disclose Teams messages, meeting recordings, and files stored in OneDrive',
      'US law enforcement can use Electronic Communications Privacy Act (ECPA) orders to access chat history and file content without notifying students or parents',
      'Microsoft\'s National Security Requests (including FISA orders) may cover school accounts — Microsoft publishes aggregate counts but cannot disclose specific requests'
    ]
  },
  {
    id: 'canvas-lms',
    name: 'Canvas',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Instructure',
    description: 'Learning management system for assignments, grades, and courses',
    minAge: 6,
    riskLevel: 'medium',
    privacyConcerns: [
      'Grades, homework and a log of activity are kept by Instructure, the company behind Canvas',
      'Reports on your child’s learning are shared with the school and district',
      'Add-on tools that teachers connect can see your child’s work',
      'Messages sent in Canvas are kept'
    ],
    parentTips: [
      'Ask the school for its written privacy agreement with Canvas',
      'Ask which add-on tools teachers have connected to Canvas',
      'Ask how long homework and grades are kept',
      'Ask for a parent (observer) account so you can see what your child sees'
    ],
    website: 'https://www.instructure.com/canvas'
  },
  {
    id: 'schoology',
    name: 'Schoology',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'PowerSchool',
    description: 'Learning management system with SIS integration for K–12',
    minAge: 6,
    riskLevel: 'medium',
    privacyConcerns: [
      'Grades and records are shared with PowerSchool, the school’s student records system',
      'Records how your child uses it and how they are learning',
      'Messages between parents, students and teachers are kept',
      'Information can be shared with other PowerSchool products the school uses'
    ],
    parentTips: [
      'Ask the school for the Schoology privacy policy',
      'Check parent portal access to see what data is visible',
      'Ask which other PowerSchool products receive your child’s information',
      'Ask how long records are kept after your child leaves the school'
    ],
    website: 'https://www.schoology.com'
  },
  {
    id: 'seesaw',
    name: 'Seesaw',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Seesaw Learning',
    description: 'Digital portfolio and family communication app for K–5',
    minAge: 5,
    riskLevel: 'medium',
    privacyConcerns: [
      'Student photos, videos, and audio stored on platform',
      'Portfolio content may be visible to school community',
      'Parent and teacher messaging stored',
      'Recordings of your child’s face and voice are saved in their portfolio'
    ],
    parentTips: [
      'Review sharing settings — check whether portfolio is private or visible to class',
      'Ask how long your child’s work is kept after the school year',
      'Monitor what your child is posting to their portfolio',
      'Ask the school for its written privacy agreement with Seesaw'
    ],
    website: 'https://web.seesaw.me'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Zoom Video Communications',
    description: 'Video conferencing used for virtual classes and school meetings',
    minAge: 6,
    riskLevel: 'medium',
    privacyConcerns: [
      'Video sessions can be recorded by the host (teacher or school)',
      'Zoom records who joined, when, and what was said in chat',
      'The school can see attendance and how long your child stayed in each session',
      'Your child’s face and voice are captured on video'
    ],
    parentTips: [
      'Ask whether classes are recorded and how long recordings are kept',
      'Ensure your child joins from a private, appropriate space',
      'Use a plain or blurred background so your home stays private',
      'Confirm the school account is the managed education version (not a personal free account)'
    ],
    website: 'https://zoom.us/education',
    lawEnforcementConcerns: [
      'Zoom can be compelled via court order to provide meeting recordings, chat logs, and account information to law enforcement',
      'Meeting metadata (who attended, when, duration) is retained and subject to legal disclosure',
      'Zoom has historically routed some call data through servers in China — raising additional surveillance concerns for sensitive meetings'
    ]
  },
  {
    id: 'classdojo',
    name: 'ClassDojo',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'ClassDojo',
    description: 'Classroom behavior tracking and parent-teacher communication',
    minAge: 6,
    riskLevel: 'high',
    privacyConcerns: [
      'Behavior points (good and bad) can be kept for years unless deleted',
      'Student photos and videos in class portfolios',
      'You can see behavior points, but only teachers can change them',
      'Student content (portfolio, messages) hosted by ClassDojo',
      'There is no set date when old behavior points are deleted'
    ],
    parentTips: [
      'Ask for old behavior points to be deleted at the end of each school year',
      'Check privacy settings on your child\'s student account and portfolio',
      'Ask the school who can see your child’s behavior points and how long they are kept',
      'Turn off sharing beyond the class, if offered',
      'You can also ask ClassDojo directly to delete old behavior records'
    ],
    website: 'https://www.classdojo.com'
  },
  {
    id: 'remind',
    name: 'Remind',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Remind',
    description: 'Messaging platform connecting teachers, students, and parents',
    minAge: 13,
    riskLevel: 'low',
    privacyConcerns: [
      'Messages between teachers and students or parents stored on platform',
      'Phone number required to join',
      'Records who messages whom, and when'
    ],
    parentTips: [
      'Use the parent account — do not share the student join code with others',
      'Review message history and notification settings',
      'Ask how long old messages are kept'
    ],
    website: 'https://www.remind.com'
  },
  {
    id: 'kahoot',
    name: 'Kahoot!',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Kahoot AS',
    description: 'Gamified quiz and assessment tool used in classrooms',
    minAge: 6,
    riskLevel: 'low',
    privacyConcerns: [
      'Game scores and answer responses tracked per session',
      'Nicknames used in games may be visible to the whole class',
      'Free personal accounts may include advertising'
    ],
    parentTips: [
      'Ensure your child uses a school-managed account, not a personal free account',
      'Check whether the nickname includes any personal information',
      'Ask the school whether it has a privacy agreement with Kahoot'
    ],
    website: 'https://kahoot.com'
  },
  {
    id: 'quizlet',
    name: 'Quizlet',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Quizlet',
    description: 'Flashcard and study tools platform used by teachers and students',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Study sets and all learning activity tracked',
      'Free tier shows advertising to students',
      'Publicly shared study sets may contain student names or personal notes',
      'Teachers can see your child’s results'
    ],
    parentTips: [
      'Check whether your child uses the school-licensed version (no ads) or a free personal account',
      'Review account privacy settings to limit public profile visibility',
      'Monitor which study sets are shared publicly',
      'Ask the school whether it has a privacy agreement with Quizlet'
    ],
    website: 'https://quizlet.com'
  },
  {
    id: 'ixl',
    name: 'IXL Learning',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'IXL Learning',
    description: 'Adaptive practice platform for math and ELA, K–12',
    minAge: 5,
    riskLevel: 'medium',
    privacyConcerns: [
      'Every answer and problem attempt is tracked and stored',
      'Builds a detailed record of strengths and weak spots over the years',
      'Progress is shared with teachers and the school',
      'Answers are used to improve IXL’s product'
    ],
    parentTips: [
      'Review the parent dashboard to understand what data IXL holds on your child',
      'Ask the school for its written privacy agreement with IXL',
      'Ask how long results are kept after the school year',
      'You can ask IXL for a copy of your child’s data, or to delete it'
    ],
    website: 'https://www.ixl.com'
  },
  {
    id: 'newsela',
    name: 'Newsela',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Newsela / Sandbox EdTech',
    description: 'News-based reading comprehension platform with leveled articles',
    minAge: 6,
    riskLevel: 'low',
    privacyConcerns: [
      'Reading history and quiz responses tracked per article',
      'Student reading level and progress shared with teachers',
      'What your child reads is used to suggest more articles'
    ],
    parentTips: [
      'Look at reading progress reports together with your child',
      'Ask how long Newsela keeps your child’s reading history',
      'If your child is under 13, ask how the school gave consent for Newsela'
    ],
    website: 'https://newsela.com'
  },
  {
    id: 'nearpod',
    name: 'Nearpod',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Renaissance Learning',
    description: 'Interactive lesson platform with real-time student participation',
    minAge: 6,
    riskLevel: 'low',
    privacyConcerns: [
      'All student responses (polls, quizzes, open-ended) stored per session',
      'Teachers and the school can see every answer your child has given',
      'Answers are kept by Nearpod and its owner, Renaissance',
      'Information may be shared with other Renaissance products the school uses'
    ],
    parentTips: [
      'Ask the teacher how long class answers are kept',
      'Understand that all in-class responses are saved',
      'Ask the school who can see your child’s answers outside class',
      'Ask which other Renaissance products the school uses'
    ],
    website: 'https://nearpod.com'
  },
  {
    id: 'edpuzzle',
    name: 'Edpuzzle',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Edpuzzle',
    description: 'Video-based lessons with embedded quizzes used in class',
    minAge: 6,
    riskLevel: 'low',
    privacyConcerns: [
      'Tracks how your child watches each video and every quiz answer',
      'Completion rates and scores stored per student',
      'Teachers can see exactly how each student watched and answered'
    ],
    parentTips: [
      'Review what data is visible to teachers in Edpuzzle',
      'Ask the school whether it has a privacy agreement with Edpuzzle',
      'Understand what happens to student data after the school year ends'
    ],
    website: 'https://edpuzzle.com'
  },
  {
    id: 'lexia',
    name: 'Lexia Core5 / PowerUp',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Cambium Learning Group',
    description: 'Adaptive literacy program used in schools for reading intervention',
    minAge: 5,
    riskLevel: 'low',
    privacyConcerns: [
      'Detailed reading performance data collected per session',
      'Progress and test results are shared with teachers and the school',
      'Kept by Cambium Learning Group, the company behind Lexia'
    ],
    parentTips: [
      'Review progress reports available to parents',
      'Ask the school for its written privacy agreement with Lexia',
      'Ask how long test results are kept after the school year'
    ],
    website: 'https://www.lexialearning.com'
  },
  {
    id: 'dreambox',
    name: 'DreamBox Math',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Discovery Education',
    description: 'Adaptive K–8 math program that adjusts to each student in real time',
    minAge: 5,
    riskLevel: 'low',
    privacyConcerns: [
      'Every click and answer is recorded to adjust lessons to your child',
      'Detailed math learning profiles built over time',
      'Progress is shared with teachers, the school and the district',
      'Information is shared with Discovery Education, the company that owns DreamBox'
    ],
    parentTips: [
      'Review parent progress reports in the DreamBox parent portal',
      'Ask the school how Discovery Education uses your child’s information',
      'Ask how long detailed learning records are kept',
      'Request data deletion at the end of the school year if desired'
    ],
    website: 'https://www.dreambox.com'
  },
  {
    id: 'renaissance-learning',
    name: 'Renaissance Learning (AR / STAR)',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Renaissance Learning',
    description: 'Reading and math assessment platform (Accelerated Reader, STAR tests)',
    minAge: 5,
    riskLevel: 'medium',
    privacyConcerns: [
      'Builds a record of reading and math test results over many years',
      'Renaissance also owns Nearpod, so information can be shared between them',
      'Test history is shared with the school and district',
      'Student results are used to build products and compare schools'
    ],
    parentTips: [
      'Ask the school which Renaissance products it uses and what each keeps',
      'Ask to see your child’s reading and math test history (AR and STAR)',
      'Remember Renaissance also owns Nearpod — one company may hold both records',
      'Ask whether results are shared with outside researchers'
    ],
    website: 'https://www.renaissance.com'
  },
  {
    id: 'prodigy',
    name: 'Prodigy Math',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Prodigy Education',
    description: 'Gamified adaptive math platform for grades 1–8',
    minAge: 6,
    riskLevel: 'medium',
    privacyConcerns: [
      'The free version shows children ads for a paid membership',
      'Records how your child plays and learns',
      'Parents may get sales emails based on how their child plays',
      'In-app purchase prompts for premium membership'
    ],
    parentTips: [
      'Ensure the school-assigned account is used (not a personal account)',
      'Teach your child to ignore offers to buy a membership',
      'Turn off Prodigy sales emails in your parent account',
      'Time in the game is not the same as learning — check the progress report'
    ],
    website: 'https://www.prodigygame.com'
  },
  {
    id: 'code-org',
    name: 'Code.org',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Code.org (Non-profit)',
    description: 'Computer science and coding curriculum for K–12 classrooms',
    minAge: 6,
    riskLevel: 'low',
    privacyConcerns: [
      'Student coding progress and course completion tracked',
      'Teacher has visibility into student activity',
      'Non-profit with a strong stated privacy policy'
    ],
    parentTips: [
      'Good news: Code.org is a non-profit that follows US student privacy laws',
      'Review the parent guide on Code.org for data practices',
      'Check student account settings to limit data collection where possible'
    ],
    website: 'https://code.org'
  },
  {
    id: 'flip',
    name: 'Flip (formerly Flipgrid)',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Microsoft',
    description: 'Video discussion tool where students record and share short videos',
    minAge: 6,
    riskLevel: 'medium',
    privacyConcerns: [
      'Videos of your child’s face and voice are kept by Microsoft',
      'Videos may be viewable by the entire class or wider audience depending on settings',
      'Microsoft’s rules decide how long videos are kept',
      'Every video shows your child’s face and voice'
    ],
    parentTips: [
      'Ask the teacher whether videos are seen by the class only or by anyone',
      'Make sure your child uses the school account, not a personal one',
      'Ask how long your child’s videos are kept',
      'Ask the school for its written privacy agreement with Microsoft'
    ],
    website: 'https://flip.com'
  },
  {
    id: 'padlet',
    name: 'Padlet',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Wallwisher',
    description: 'Digital collaborative bulletin board used for class activities',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Board visibility depends entirely on teacher settings — can be public by default',
      'Student posts, images, and comments stored on platform',
      'Public boards can show up in Google searches',
      'The free version doesn’t include school-level privacy protections'
    ],
    parentTips: [
      'Ask teacher whether class boards are set to private or public',
      'Review what your child is posting on shared boards',
      'Ask whether the school uses Padlet for Schools, the version with student privacy protections',
      'Understand that posts on public boards can be seen by anyone on the internet'
    ],
    website: 'https://padlet.com'
  },

  // ── AI Apps ──────────────────────────────────────────────────────────────
  // AI-powered tools used by children and teens — many have no COPPA/FERPA
  // compliance for consumer accounts. Conversation data is often used for training.

  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'ai',
    vendor: 'OpenAI',
    description: 'AI chatbot widely used by students for homework help, writing, and research',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'All conversations stored by OpenAI — including sensitive personal disclosures',
      'On personal accounts, chats may be used to train future versions',
      'Personal accounts don’t have school privacy protections, even if a teacher suggests using it',
      'Age is not checked — children under 13 can sign up anyway',
      'Sensitive information shared (mental health, personal problems) is recorded'
    ],
    parentTips: [
      'In Settings → Data Controls, turn off “Improve the model for everyone” so chats aren’t used for training',
      'Talk with your child about not sharing personal details, passwords, or school credentials',
      'Delete conversation history regularly from the account sidebar',
      'If it’s used for school, ask whether the school has its own agreement that keeps chats out of training',
      'ChatGPT has a minimum age of 13 — ensure younger children do not have access'
    ],
    website: 'https://chat.openai.com',
    lawEnforcementConcerns: [
      'OpenAI stores all conversations and can be compelled by law enforcement to disclose chat history, account information, and IP addresses via legal order',
      'If a child shares sensitive information (threats, illegal activity, self-harm) in a conversation, OpenAI may proactively report it or be required to disclose it',
      'No special protections apply to minors using consumer ChatGPT — law enforcement access is governed by general ECPA rules, not COPPA'
    ]
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    category: 'ai',
    vendor: 'Google (Alphabet)',
    description: 'Google\'s AI assistant — available through Google account on web, Android, and as a school add-on',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'Chats are linked to your child’s Google account and other Google services',
      'Chats are saved, and people at Google may read some to improve it',
      'Accessible through school Google accounts — possible even on accounts set up for younger students',
      'Part of Google, whose business is built on advertising'
    ],
    parentTips: [
      'Check Google Account → Gemini Apps Activity and turn off history or delete it regularly',
      'For children under 13, check in Family Link whether Gemini is allowed, and turn it off if you prefer',
      'Ask the school whether Gemini is turned on for school Google accounts',
      'Discuss with your child that Google stores and may review AI conversations'
    ],
    website: 'https://gemini.google.com',
    lawEnforcementConcerns: [
      'Google (Gemini\'s owner) receives the highest volume of government data requests of any major tech company — AI conversation history is subject to the same legal access as Gmail and Google Search',
      'National Security Letters (NSLs) can compel Google to secretly disclose Gemini conversation data including topics discussed and queries made',
      'Conversations tied to a school Google account are no more protected than a personal account when law enforcement presents a valid court order'
    ]
  },
  {
    id: 'microsoft-copilot',
    name: 'Microsoft Copilot',
    category: 'ai',
    vendor: 'Microsoft',
    description: 'AI assistant built into Windows, Edge, Bing, and Microsoft 365 school accounts',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Microsoft saves chats; how long depends on the type of account',
      'School accounts come with stronger privacy rules',
      'The free personal version shows ads',
      'If turned on, it can read files, emails and the calendar in the account'
    ],
    parentTips: [
      'If your child has a school Microsoft account, use Copilot there — the school controls the settings',
      'On personal accounts, open the Microsoft privacy dashboard and delete Copilot history',
      'Make sure Copilot can’t open private files in OneDrive',
      'The free version on Bing uses chats for ads — the school version is safer'
    ],
    website: 'https://copilot.microsoft.com',
    lawEnforcementConcerns: [
      'Microsoft receives government data requests and can be compelled to disclose Copilot conversations, associated files, and account details via court order',
      'FISA-based surveillance orders may cover Microsoft cloud services including Copilot — Microsoft publishes aggregate transparency data but cannot disclose specific cases',
      'Conversations generated through school Microsoft 365 accounts are stored by Microsoft and subject to the same legal access as any other Microsoft cloud data'
    ]
  },
  {
    id: 'character-ai',
    name: 'Character.AI',
    category: 'ai',
    vendor: 'Character Technologies',
    description: 'Platform where users chat with AI personas and "characters" — very popular with teens',
    minAge: 16,
    riskLevel: 'very-high',
    privacyConcerns: [
      'AI characters are built to feel like friends — some teens come to depend on them',
      'Every chat is saved, including very personal things about feelings and relationships',
      'Families have filed lawsuits saying the app harmed their children',
      'Filters are weak — many inappropriate chats have been reported',
      'Few tools for parents to see or limit use',
      'Chats are used to train the app, with no clear way to say no'
    ],
    parentTips: [
      'Not recommended under 16 — consider blocking it in your phone or home Wi-Fi settings',
      'If your teen uses it, check the account has their real age so teen limits apply',
      'Have an open conversation: AI personas are not real friends and cannot replace real support',
      'If your child is struggling, point them to real people: you, a counselor, or Crisis Text Line (text HOME to 741741 in the US)',
      'If they use it, look at the chats together at least once a month'
    ],
    website: 'https://character.ai'
  },
  {
    id: 'snapchat-my-ai',
    name: 'Snapchat My AI',
    category: 'ai',
    vendor: 'Snap Inc.',
    description: 'AI chatbot built directly into Snapchat — enabled by default for all users including teens',
    minAge: 13,
    riskLevel: 'very-high',
    privacyConcerns: [
      'Turned on for every Snapchat user — it can’t easily be turned off',
      'Chats with My AI are saved and used to choose ads',
      'My AI can use your child’s location if Snapchat has it',
      'Children may share personal or sensitive information thinking it is private',
      'My AI can suggest products and paid links that aren’t clearly marked as ads'
    ],
    parentTips: [
      'Delete My AI chats: Snapchat → Profile → Settings → Privacy Controls → Clear Data',
      'Only paying Snapchat+ users can remove My AI from the chat list',
      'Tell your teen My AI is not a private friend — Snapchat staff can read the chats',
      'If your child is under 13, they should not have Snapchat at all',
      'Check for My AI in the Friends list — it appears as a contact called "My AI"'
    ],
    website: 'https://www.snapchat.com',
    lawEnforcementConcerns: [
      'Snapchat My AI conversations are stored by Snap and subject to the same law enforcement disclosure rules as regular Snap messages',
      'My AI data — including sensitive personal information a child may share thinking it is private — can be disclosed via subpoena or court order',
      'Snap cooperates with law enforcement on child safety investigations and can proactively report suspected illegal content including conversations with My AI'
    ]
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    category: 'ai',
    vendor: 'Meta',
    description: 'AI assistant embedded across WhatsApp, Instagram, Messenger, and Facebook',
    minAge: 13,
    riskLevel: 'very-high',
    privacyConcerns: [
      'Chats with Meta AI feed the same ad system as Instagram and Facebook',
      'The blue circle in WhatsApp opens Meta AI — easy to tap by accident',
      'What your child says to it may be used to choose ads',
      'Chats may be kept and reviewed to improve Meta’s AI',
      'Few parent controls for Meta AI inside WhatsApp or Instagram'
    ],
    parentTips: [
      'You can’t remove Meta AI, but your child can choose not to use it',
      'Delete past Meta AI chats in your Meta account privacy settings',
      'Discuss with your teen that the blue circle in WhatsApp is Meta AI, not a private chat',
      'In Instagram, open Accounts Center to see and delete Meta AI activity'
    ],
    website: 'https://ai.meta.com'
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    category: 'ai',
    vendor: 'Grammarly Inc.',
    description: 'AI writing assistant used across browsers, Word, and Google Docs — widely used by students for essays and homework',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Everything your child writes with it (essays, messages) goes through Grammarly’s computers',
      'On personal accounts, writing may be used to train Grammarly’s AI',
      'The browser add-on can see almost everything typed on websites',
      'Writing, with names removed, may be shared with outside companies'
    ],
    parentTips: [
      'In Grammarly’s privacy settings, turn off human review and data sharing',
      'Ask whether the school has Grammarly for Education, which has stronger privacy protections',
      'Turn the browser add-on off on sites where your child types private things',
      'Remind your child not to paste private details (passwords, home address, ID numbers) into it'
    ],
    website: 'https://www.grammarly.com'
  },
  {
    id: 'perplexity-ai',
    name: 'Perplexity AI',
    category: 'ai',
    vendor: 'Perplexity AI',
    description: 'AI-powered search engine that answers questions with cited sources — used as a search replacement by students',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'Every question your child asks is saved',
      'Age is not checked — children of any age can use it',
      'Questions are used to improve the AI',
      'Questions can reveal interests, location, health worries and schoolwork',
      'It records the device and internet connection used, even without an account'
    ],
    parentTips: [
      'Open Settings → Privacy and turn off what you can',
      'Remind your child not to ask about very personal things (health, home address)',
      'Check whether it’s being used to get around school web filters',
      'If the school offers its own account, use that instead'
    ],
    website: 'https://www.perplexity.ai'
  },
  {
    id: 'socratic',
    name: 'Socratic by Google',
    category: 'ai',
    vendor: 'Google (Alphabet)',
    description: 'AI homework help app for secondary students — photo-based problem solving for math, science, and more',
    minAge: 10,
    riskLevel: 'medium',
    privacyConcerns: [
      'Photos of homework are sent to Google’s computers',
      'Use is linked to your child’s Google account',
      'Google may use the questions to improve its AI'
    ],
    parentTips: [
      'Check Google Account → Data & Privacy → My Activity to see Socratic history',
      'Disable Socratic activity history in Google Account if desired',
      'Tell your child that homework photos are sent to Google'
    ],
    website: 'https://socratic.org'
  },
  {
    id: 'khanmigo',
    name: 'Khanmigo (Khan Academy AI)',
    category: 'ai',
    schoolAssigned: true,
    vendor: 'Khan Academy / OpenAI',
    description: 'AI tutor built by Khan Academy on top of OpenAI\'s GPT — designed specifically for students',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Chats are handled by OpenAI, the company behind ChatGPT, under a business agreement',
      'Khan Academy stores conversation history to track learning progress',
      'That agreement should keep chats out of AI training — confirm with the school',
      'What your child finds hard is recorded in detail'
    ],
    parentTips: [
      'Khan Academy is a non-profit with strong stated privacy commitments',
      'Ask the school whether chats are kept out of AI training',
      'Review the Khan Academy parent dashboard for conversation and progress history',
      'Make sure your child uses the school version of Khanmigo'
    ],
    website: 'https://www.khanacademy.org/khanmigo'
  },

  // ── Mobile Operators (Telecom) ────────────────────────────────────────────
  // Mobile carriers have uniquely deep access: real-time location 24/7,
  // call/SMS metadata, device identifiers, and app-traffic patterns.
  // All four major US carriers have a documented history of selling
  // location data to data brokers without meaningful consumer consent.

  {
    id: 'verizon',
    name: 'Verizon',
    category: 'telecom',
    vendor: 'Verizon Communications',
    description: 'Mobile carrier with continuous access to device location, call/text metadata, and data traffic',
    minAge: 6,
    riskLevel: 'very-high',
    privacyConcerns: [
      'Knows where your child’s phone is at all times',
      'Its “Custom Experience” program uses app and web activity for ads unless you opt out',
      'Verizon was fined $1.35M in 2016 for secretly tagging customers’ web traffic to track them',
      'Keeps a record of who your child calls and texts, when, and for how long',
      'The phone’s ID number is linked to your child’s real name and may be shared with marketing companies',
      'In 2018, US carriers including Verizon were found selling customers’ live location to other companies'
    ],
    parentTips: [
      'Opt out of Verizon\'s Custom Experience program: My Verizon app → Account → Privacy Settings',
      'Use Verizon Smart Family for content filters and location sharing',
      'Check how long Verizon keeps call and text records',
      'Ask Verizon to delete advertising data in its Privacy Dashboard',
      'Ask Verizon not to share your data with advertising partners'
    ],
    website: 'https://www.verizon.com/about/privacy'
  },
  {
    id: 'att',
    name: 'AT&T',
    category: 'telecom',
    vendor: 'AT&T Inc.',
    description: 'Mobile and broadband carrier; runs Xandr (now Microsoft) ad-targeting platform and "Project Hemisphere" surveillance program',
    minAge: 6,
    riskLevel: 'very-high',
    privacyConcerns: [
      'AT&T knows where your child’s phone is, and in the past sold live location to other companies',
      'AT&T has shared large amounts of call records with US law enforcement through a program called Hemisphere',
      'AT&T has used customer information to target ads',
      'Call records are protected by law, but with broad exceptions',
      'AT&T home internet browsing history has been used for ads',
      'In 2018, AT&T was among the carriers found selling customers’ live location'
    ],
    parentTips: [
      'Opt out of AT&T’s advertising programs at att.com/privacy (look for the advertising settings)',
      'Use AT&T Secure Family for parental controls, location sharing, and content filters',
      'If you have AT&T home internet, opt out of “Internet Preferences” in your account',
      'Ask AT&T for a copy of the call records it keeps, in its Privacy Center',
      'Disable "Relevant Advertising" in your myAT&T account settings'
    ],
    website: 'https://www.att.com/privacy'
  },
  {
    id: 'tmobile',
    name: 'T-Mobile',
    category: 'telecom',
    vendor: 'T-Mobile US (Deutsche Telekom)',
    description: 'Mobile carrier; suffered the largest-ever US carrier data breach (2021, 76M+ customers) and runs T-Mobile Advertising Solutions',
    minAge: 6,
    riskLevel: 'very-high',
    privacyConcerns: [
      'A 2021 breach exposed names, Social Security numbers and driver’s licenses of 76.6 million people',
      'Uses location, app and web activity for ads unless you opt out',
      'In 2018, T-Mobile was among the carriers found selling customers’ live location',
      'Collects app and web activity for its “Insights” marketing program',
      'Keeps call records and phone ID numbers, which may be shared with partners',
      'Sprint, now part of T-Mobile, also shared customers’ location'
    ],
    parentTips: [
      'Opt out of T-Mobile\'s advertising programs: Account → Privacy & Notifications → Advertising in the T-Mobile app',
      'Enable T-Life / FamilyMode for parental controls and location tracking',
      'If you were a customer before 2021, check haveibeenpwned.com to see if your email was exposed',
      'Ask T-Mobile to delete your advertising data in its Privacy Center',
      'Opt out of “Insights” in the privacy settings, if it applies to your plan'
    ],
    website: 'https://www.t-mobile.com/privacy-center',
    lawEnforcementConcerns: [
      'T-Mobile is a CALEA-compliant carrier with built-in interception capabilities — law enforcement can obtain real-time call, text, and location data via court order',
      'T-Mobile received thousands of law enforcement requests annually and complies with a majority — including real-time location tracking of devices',
      'The 2021 data breach that exposed 76M+ customers also means that sensitive personal data may already be in criminal hands — complicating law enforcement use of that data'
    ]
  },
  {
    id: 'cricket-wireless',
    name: 'Cricket Wireless',
    category: 'telecom',
    vendor: 'AT&T (subsidiary)',
    description: 'Prepaid carrier fully owned by AT&T — shares AT&T\'s network infrastructure and data practices',
    minAge: 6,
    riskLevel: 'high',
    privacyConcerns: [
      'Fully owned and operated by AT&T — all AT&T data practices apply',
      'Runs on AT&T’s network, so AT&T can see location',
      'Call and text records are kept under AT&T’s rules',
      'AT&T’s advertising programs apply'
    ],
    parentTips: [
      'Treat Cricket\'s privacy practices as equivalent to AT&T\'s — same opt-outs apply',
      'Log into my.cricketwireless.com to review account privacy settings',
      'Opt out of AT&T’s advertising programs — they cover Cricket too',
      'Use device-level parental controls since Cricket does not offer a dedicated family safety app'
    ],
    website: 'https://www.cricketwireless.com/legal-information/privacy-policy.html'
  },
  {
    id: 'boost-mobile',
    name: 'Boost Mobile',
    category: 'telecom',
    vendor: 'DISH Wireless (EchoStar)',
    description: 'Prepaid carrier now owned by DISH/EchoStar; previously on Sprint/T-Mobile network',
    minAge: 6,
    riskLevel: 'high',
    privacyConcerns: [
      'Location and phone activity are collected by EchoStar, the company behind Boost',
      'The same company runs DISH TV, so information can be combined',
      'Keeps records of calls and the phone’s ID number',
      'Phone activity is used for ads'
    ],
    parentTips: [
      'Review DISH/Boost privacy settings at boostmobile.com/legal/privacy',
      'Opt out of advertising data use in your Boost account settings',
      'Use device-level parental controls (Android Family Link or iOS Screen Time)',
      'Remember the same company may hold your phone and TV information'
    ],
    website: 'https://www.boostmobile.com/legal/privacy',
    lawEnforcementConcerns: [
      'Boost Mobile (DISH Wireless) is a CALEA-compliant carrier — law enforcement can obtain call records, real-time location, and content interception via court order',
      'DISH Wireless cooperates with government data requests; records including device location are available to law enforcement through legal process'
    ]
  },
  {
    id: 'mint-mobile',
    name: 'Mint Mobile',
    category: 'telecom',
    vendor: 'T-Mobile US (subsidiary)',
    description: 'Prepaid carrier acquired by T-Mobile in 2023 — runs on T-Mobile\'s network',
    minAge: 6,
    riskLevel: 'high',
    privacyConcerns: [
      'Runs on T-Mobile’s network, so T-Mobile’s privacy rules apply',
      'T-Mobile can see location, call records and the phone’s ID number',
      'Since T-Mobile bought Mint, T-Mobile’s ad programs may apply'
    ],
    parentTips: [
      'Since Mint runs on T-Mobile\'s network, opt out of T-Mobile Advertising in the T-Mobile Privacy Center',
      'Use device-level parental controls (Android Family Link or iOS Screen Time)',
      'Read Mint’s own privacy policy at mintmobile.com/legal/privacy',
      'Check haveibeenpwned.com to see if your email was exposed in past breaches'
    ],
    website: 'https://www.mintmobile.com/legal/privacy',
    lawEnforcementConcerns: [
      'Mint operates on T-Mobile\'s network — all T-Mobile CALEA interception capabilities and law enforcement cooperation practices apply',
      'Real-time location, call records, and content interception are available to law enforcement via T-Mobile\'s infrastructure under a valid court order'
    ]
  },

  // Health & medical (family-reported — wellness, portals, school health, pharmacy)
  {
    id: 'apple-health',
    name: 'Apple Health',
    category: 'health',
    healthSubcategory: 'wellness-fitness',
    description: 'Health and activity data on iPhone or Apple Watch',
    minAge: 5,
    riskLevel: 'high',
    vendor: 'Apple',
    privacyConcerns: [
      'Can store heart rate, sleep, cycle tracking and records from doctors',
      'Other apps can ask to read health data on the phone',
      'May sync to iCloud — not the same as a school health record, but still very personal',
    ],
    parentTips: [
      'Review Settings → Health → Data Access & Devices for apps your child allowed',
      'Turn off Health data sharing for apps that do not need it',
      'Use a strong device passcode; health data follows the phone',
    ],
    website: 'https://www.apple.com/health/',
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    category: 'health',
    healthSubcategory: 'wellness-fitness',
    description: 'Activity and wellness tracking linked to a Google account',
    minAge: 13,
    riskLevel: 'high',
    vendor: 'Google',
    privacyConcerns: [
      'Activity and health data can be combined with other Google account information',
      'Other fitness apps can connect and share data with Fit',
      'Not protected like a medical record from your doctor',
    ],
    parentTips: [
      'Check which apps and devices send data to Google Fit',
      'Disconnect unused apps from Google Fit',
      'Remind teens not to log highly personal health notes in connected apps',
    ],
    website: 'https://www.google.com/fit',
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    category: 'health',
    healthSubcategory: 'wellness-fitness',
    description: 'Wearable fitness and health tracking (Google)',
    minAge: 13,
    riskLevel: 'high',
    vendor: 'Google (Fitbit)',
    privacyConcerns: [
      'Continuous activity, sleep, and heart-rate data stored on Fitbit servers',
      'Social and challenge features can expose activity to others',
      'Wellness data can reveal routines, location patterns, and health conditions',
    ],
    parentTips: [
      'Set the account to private and limit social features for teens',
      'Review which data types sync from the watch or phone',
      'Use a strong password and turn on two-step sign-in (a code sent to your phone)',
    ],
    website: 'https://www.fitbit.com',
  },
  {
    id: 'calm',
    name: 'Calm',
    category: 'health',
    healthSubcategory: 'mental-wellness',
    description: 'Meditation, sleep stories, and relaxation content',
    minAge: 4,
    riskLevel: 'medium',
    vendor: 'Calm.com',
    privacyConcerns: [
      'Account and usage data show meditation and sleep habits',
      'Subscription and device details are linked to the account',
      'Not a clinical therapy service — still personal wellbeing data',
    ],
    parentTips: [
      'Use family sharing or a parent-managed account for younger children',
      'Review privacy settings and marketing email opt-outs',
      'Pair app use with offline coping strategies, not only screen-based calm',
    ],
    website: 'https://www.calm.com',
  },
  {
    id: 'headspace',
    name: 'Headspace',
    category: 'health',
    healthSubcategory: 'mental-wellness',
    description: 'Mindfulness and meditation for kids and adults',
    minAge: 5,
    riskLevel: 'medium',
    vendor: 'Headspace',
    privacyConcerns: [
      'Usage patterns reveal stress-management and sleep routines',
      'Kids mode still collects account and progress data',
      'If it comes through a school or employer, they may also see some information',
    ],
    parentTips: [
      'Choose age-appropriate content and supervise younger kids',
      'Review what profile data is stored for child accounts',
      'Discuss when to talk to a trusted adult instead of only using an app',
    ],
    website: 'https://www.headspace.com',
  },
  {
    id: 'teladoc',
    name: 'Teladoc',
    category: 'health',
    healthSubcategory: 'telehealth',
    description: 'Virtual urgent care and telehealth visits',
    minAge: 0,
    riskLevel: 'very-high',
    vendor: 'Teladoc Health',
    privacyConcerns: [
      'Video visits and messages can include symptoms, medicines and personal details',
      'Health information is protected by medical privacy law when used through your health plan',
      'Account data may include insurance, pharmacy, and family contact details',
    ],
    parentTips: [
      'Use only for legitimate care — guardian should manage accounts for minors',
      'Read the privacy notice before the first visit',
      'Do not share visit links or photos of records in group chats',
    ],
    website: 'https://www.teladoc.com',
  },
  {
    id: 'epic-mychart',
    name: 'MyChart (Epic patient portal)',
    category: 'health',
    healthSubcategory: 'patient-portal',
    description: 'Hospital or clinic patient portal for records, messages, and results',
    minAge: 0,
    riskLevel: 'very-high',
    vendor: 'Epic Systems',
    privacyConcerns: [
      'Can expose lab results, diagnoses, appointments, and provider messages',
      'The clinic decides which parents can see a child’s records',
      'Highly sensitive — treat portal login like banking credentials',
    ],
    parentTips: [
      'Turn on two-step sign-in and keep the password to yourself',
      'Ask the clinic who can see your child’s records',
      'Log out on shared family devices after viewing records',
    ],
    website: 'https://www.mychart.org',
  },
  {
    id: 'school-student-health-portal',
    name: 'School student health portal',
    category: 'health',
    healthSubcategory: 'school-health',
    description: 'District nurse, immunization, or student health record system',
    minAge: 5,
    riskLevel: 'high',
    schoolAssigned: true,
    vendor: 'Varies by district',
    privacyConcerns: [
      'May store immunizations, medications, allergies, and nurse visit notes',
      'Often required for enrollment — families may have limited opt-out',
      'Covered by school rules and student privacy laws',
    ],
    parentTips: [
      'Ask the school which vendor runs the health portal and request their privacy notice',
      'Ask who can see health entries: the nurse, teachers, office staff',
      'Keep copies of forms you submit — do not paste portal passwords into email',
    ],
  },
  {
    id: 'cvs-pharmacy',
    name: 'CVS Pharmacy',
    category: 'health',
    healthSubcategory: 'pharmacy-retail',
    description: 'Pharmacy account and prescriptions (CVS / MinuteClinic)',
    minAge: 0,
    riskLevel: 'very-high',
    vendor: 'CVS Health',
    privacyConcerns: [
      'Pharmacy profiles can include prescriptions, insurance, and contact information',
      'Purchase and loyalty data may combine with retail shopping history',
      'Highly sensitive — separate from general shopping apps in your family list',
    ],
    parentTips: [
      'Guardian should manage pharmacy accounts for minors',
      'Turn off marketing in the app and check the prescription privacy settings',
      'Never photograph prescription labels for social sharing',
    ],
    website: 'https://www.cvs.com',
  },
];

/**
 * Get all services that have documented law enforcement data-sharing concerns
 */
export const getServicesWithLawEnforcementConcerns = (): ChildService[] => {
  return childServiceCatalog.filter(
    service => service.lawEnforcementConcerns && service.lawEnforcementConcerns.length > 0
  );
};

/**
 * Get services by category
 */
export const getServicesByCategory = (category: ServiceCategory): ChildService[] => {
  return childServiceCatalog.filter(service => service.category === category);
};

/**
 * All health-category services (wellness, portals, telehealth, pharmacy, school health).
 */
export const getHealthServices = (): ChildService[] => {
  return getServicesByCategory('health');
};

/**
 * Get all school-assigned EdTech services
 */
export const getSchoolAssignedServices = (): ChildService[] => {
  return childServiceCatalog.filter(service => service.schoolAssigned === true);
};

/**
 * Get services appropriate for age group
 */
export const getServicesByAge = (age: number): ChildService[] => {
  return childServiceCatalog.filter(service => service.minAge <= age);
};

/**
 * Get service by ID
 */
export const getServiceById = (id: string): ChildService | undefined => {
  return childServiceCatalog.find(service => service.id === id);
};

/**
 * Get risk level color
 */
export const getRiskColor = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case 'low':
      return 'green';
    case 'medium':
      return 'yellow';
    case 'high':
      return 'orange';
    case 'very-high':
      return 'red';
    default:
      return 'gray';
  }
};

/**
 * Calculate risk score (0-100, higher = more risky)
 */
export const getRiskScore = (riskLevel: RiskLevel): number => {
  switch (riskLevel) {
    case 'low':
      return 25;
    case 'medium':
      return 50;
    case 'high':
      return 75;
    case 'very-high':
      return 90;
    default:
      return 0;
  }
};

