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
  | 'creative' 
  | 'other';

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
  /** True when the app is typically assigned by a school/district â€” exposure is involuntary */
  schoolAssigned?: boolean;
  /** Vendor or company behind the service */
  vendor?: string;
  /**
   * Documented concerns about this service sharing user data with
   * government agencies or law enforcement.
   * Presence of any items means the service has known LE data-sharing practices.
   */
  lawEnforcementConcerns?: string[];
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
      'Account content, DMs, and metadata can be handed to law enforcement with a valid legal order â€” messages are not end-to-end encrypted',
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

  // â”€â”€ EdTech / School-Assigned â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      'Google collects student behavioral and usage data',
      'Student account linked to broader Google ecosystem',
      'Third-party apps integrated via Google Marketplace can access student data',
      'Usage analytics shared with school administrators'
    ],
    parentTips: [
      'Ask your school for a copy of their Google for Education data agreement',
      'Review which Marketplace apps have been added by teachers',
      'Check that the account is "supervised" (school-managed)',
      'Understand that school admins can see all account activity'
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
      'Chat messages and meeting history stored by Microsoft',
      'Class recordings can be kept by school or Microsoft',
      'Usage and behavioral analytics collected',
      'Integrated with other Microsoft 365 school apps (OneDrive, OneNote)'
    ],
    parentTips: [
      'Ask school about their Microsoft 365 Education data agreement',
      'Understand meeting recording and retention policies',
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
      'Student grades, submissions, and activity logs stored on Instructure servers',
      'Learning analytics shared with school and district',
      'Third-party LTI tools within Canvas can access student data',
      'Student communication through Canvas messages is stored'
    ],
    parentTips: [
      'Ask school about their Instructure/Canvas data processing agreement',
      'Check which external LTI tools teachers have enabled',
      'Understand how long student submission data is retained',
      'Review the parent observer account features to monitor activity'
    ],
    website: 'https://www.instructure.com/canvas'
  },
  {
    id: 'schoology',
    name: 'Schoology',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'PowerSchool',
    description: 'Learning management system with SIS integration for Kâ€“12',
    minAge: 6,
    riskLevel: 'medium',
    privacyConcerns: [
      'Student academic records synced with PowerSchool SIS',
      'Usage patterns and learning analytics collected',
      'Parent and student messaging logged',
      'Data sharing between Schoology and other PowerSchool products'
    ],
    parentTips: [
      'Review school\'s PowerSchool/Schoology privacy policy',
      'Check parent portal access to see what data is visible',
      'Understand cross-product data sharing within the PowerSchool suite',
      'Ask school about data retention after graduation'
    ],
    website: 'https://www.schoology.com'
  },
  {
    id: 'seesaw',
    name: 'Seesaw',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Seesaw Learning',
    description: 'Digital portfolio and family communication app for Kâ€“5',
    minAge: 5,
    riskLevel: 'medium',
    privacyConcerns: [
      'Student photos, videos, and audio stored on platform',
      'Portfolio content may be visible to school community',
      'Parent and teacher messaging stored',
      'Student biometric data (voice, image) captured in portfolio items'
    ],
    parentTips: [
      'Review sharing settings â€” check whether portfolio is private or visible to class',
      'Understand data retention for student content after the school year',
      'Monitor what your child is posting to their portfolio',
      'Ask school about their Seesaw student data agreement'
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
      'Meeting metadata, chat, and usage data collected by Zoom',
      'Attention-tracking features may be enabled by the host',
      'Student likeness and voice captured on video'
    ],
    parentTips: [
      'Ask school about their meeting recording and retention policies',
      'Ensure your child joins from a private, appropriate space',
      'Check if attention tracking is enabled on school sessions',
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
      'Detailed behavioral profiles (points, demerits) stored indefinitely by default',
      'Student photos and videos in class portfolios',
      'Behavioral data visible to parents but controlled entirely by teachers',
      'Student content (portfolio, messages) hosted by ClassDojo',
      'No clear data deletion timeline for behavioral history'
    ],
    parentTips: [
      'Request deletion of behavioral history at the end of each school year',
      'Check privacy settings on your child\'s student account and portfolio',
      'Ask the school whether ClassDojo is used in a FERPA-compliant manner',
      'Opt out of community features if available',
      'Ask ClassDojo to delete old behavioral data via their privacy request process'
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
      'Communication patterns and metadata collected'
    ],
    parentTips: [
      'Use the parent account â€” do not share the student join code with others',
      'Review message history and notification settings',
      'Check Remind\'s data retention policy for message archives'
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
      'Review Kahoot\'s school data agreement with your school'
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
      'Student performance data shared with teachers'
    ],
    parentTips: [
      'Check whether your child uses the school-licensed version (no ads) or a free personal account',
      'Review account privacy settings to limit public profile visibility',
      'Monitor which study sets are shared publicly',
      'Ask school about their Quizlet data agreement'
    ],
    website: 'https://quizlet.com'
  },
  {
    id: 'ixl',
    name: 'IXL Learning',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'IXL Learning',
    description: 'Adaptive practice platform for math and ELA, Kâ€“12',
    minAge: 5,
    riskLevel: 'medium',
    privacyConcerns: [
      'Every answer and problem attempt is tracked and stored',
      'Detailed learning analytics and performance profiles built over time',
      'Progress data shared with teachers and school administrators',
      'Data used to improve IXL platform algorithms'
    ],
    parentTips: [
      'Review the parent dashboard to understand what data IXL holds on your child',
      'Ask school about their IXL data processing agreement',
      'Understand how long performance history is retained after school year',
      'Request data export or deletion via IXL privacy settings'
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
      'Article engagement used for platform recommendations'
    ],
    parentTips: [
      'Review reading analytics and progress reports with your child',
      'Ask school about Newsela\'s student data retention policy',
      'Check Newsela\'s COPPA compliance statement for under-13 students'
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
      'Teacher and school admins can see full student response history',
      'Session data stored by Nearpod and Renaissance Learning',
      'Cross-product data sharing potential with other Renaissance products'
    ],
    parentTips: [
      'Ask teacher about session recording and data retention',
      'Understand that all in-class responses are saved',
      'Review Nearpod\'s FERPA compliance documentation',
      'Ask school about Renaissance Learning\'s broader data practices'
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
      'Video-watching behavior and all quiz responses tracked',
      'Completion rates and scores stored per student',
      'Teacher has full visibility into individual student engagement'
    ],
    parentTips: [
      'Review what data is visible to teachers in Edpuzzle',
      'Ask school about their Edpuzzle data agreement',
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
      'Progress and assessment data shared with teachers and administrators',
      'Learning behavior patterns stored by Cambium Learning Group'
    ],
    parentTips: [
      'Review progress reports available to parents',
      'Ask school about their Cambium Learning Group / Lexia data agreement',
      'Understand assessment data retention after the school year'
    ],
    website: 'https://www.lexialearning.com'
  },
  {
    id: 'dreambox',
    name: 'DreamBox Math',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Discovery Education',
    description: 'Adaptive Kâ€“8 math program that adjusts to each student in real time',
    minAge: 5,
    riskLevel: 'low',
    privacyConcerns: [
      'Every decision and interaction tracked to build an adaptive learning model',
      'Detailed math learning profiles built over time',
      'Progress data shared with teachers, school, and district administrators',
      'Data shared with Discovery Education parent company'
    ],
    parentTips: [
      'Review parent progress reports in the DreamBox parent portal',
      'Ask school about Discovery Education\'s data practices',
      'Understand how long detailed learning data is retained',
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
      'Comprehensive reading and math assessment data built over years',
      'Renaissance also owns Nearpod â€” cross-product data sharing is possible',
      'Assessment and testing history shared with school and district',
      'Student data used for product development and benchmarking'
    ],
    parentTips: [
      'Ask school about Renaissance Learning\'s full data practices across all products',
      'Request access to your child\'s AR and STAR assessment history',
      'Understand that Renaissance also owns Nearpod (same data ecosystem)',
      'Ask whether student data is shared with third-party research partners'
    ],
    website: 'https://www.renaissance.com'
  },
  {
    id: 'prodigy',
    name: 'Prodigy Math',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Prodigy Education',
    description: 'Gamified adaptive math platform for grades 1â€“8',
    minAge: 6,
    riskLevel: 'medium',
    privacyConcerns: [
      'Free tier includes paid membership upsell messages targeting children',
      'Game engagement and learning analytics collected',
      'Marketing communications may target parents based on child activity',
      'In-app purchase prompts for premium membership'
    ],
    parentTips: [
      'Ensure the school-assigned account is used (not a personal account)',
      'Disable or ignore in-app membership purchase prompts',
      'Opt out of Prodigy marketing emails in parent account settings',
      'Be aware of the distinction between game play and actual learning progress'
    ],
    website: 'https://www.prodigygame.com'
  },
  {
    id: 'code-org',
    name: 'Code.org',
    category: 'edtech',
    schoolAssigned: true,
    vendor: 'Code.org (Non-profit)',
    description: 'Computer science and coding curriculum for Kâ€“12 classrooms',
    minAge: 6,
    riskLevel: 'low',
    privacyConcerns: [
      'Student coding progress and course completion tracked',
      'Teacher has visibility into student activity',
      'Non-profit with a strong stated privacy policy'
    ],
    parentTips: [
      'Code.org is a non-profit with COPPA and FERPA compliance',
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
      'Student video recordings (voice and likeness) stored by Microsoft',
      'Videos may be viewable by the entire class or wider audience depending on settings',
      'Microsoft data practices and retention policies apply',
      'Student biometric data (face, voice) captured in every video'
    ],
    parentTips: [
      'Ask teacher about topic visibility settings (class-only vs. open)',
      'Confirm the school uses the Microsoft-managed education version',
      'Understand Microsoft\'s retention policy for student videos',
      'Ask school about their data agreement for Flip with Microsoft'
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
      'Board visibility depends entirely on teacher settings â€” can be public by default',
      'Student posts, images, and comments stored on platform',
      'Public boards are indexable by search engines',
      'No strict FERPA compliance for free-tier accounts'
    ],
    parentTips: [
      'Ask teacher whether class boards are set to private or public',
      'Review what your child is posting on shared boards',
      'Ask school whether they use the Padlet for Schools (FERPA-compliant) version',
      'Understand that posts on public boards can be seen by anyone on the internet'
    ],
    website: 'https://padlet.com'
  },

  // â”€â”€ AI Apps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // AI-powered tools used by children and teens â€” many have no COPPA/FERPA
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
      'All conversations stored by OpenAI â€” including sensitive personal disclosures',
      'Free and Plus accounts: content may be used to train future AI models',
      'No FERPA or COPPA compliance for consumer accounts â€” schools using it informally have no protection',
      'Age verification is not enforced â€” children under 13 can and do access it',
      'Sensitive information shared (mental health, personal problems) is recorded'
    ],
    parentTips: [
      'Go to Settings â†’ Data Controls and disable "Improve the model for everyone" to stop training data use',
      'Talk with your child about not sharing personal details, passwords, or school credentials',
      'Delete conversation history regularly from the account sidebar',
      'If used for school, ask the school whether they have an enterprise agreement (which blocks training)',
      'ChatGPT has a minimum age of 13 â€” ensure younger children do not have access'
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
    description: 'Google\'s AI assistant â€” available through Google account on web, Android, and as a school add-on',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'Conversations linked to child\'s Google account and full Google data ecosystem',
      'Queries and responses stored and reviewed by Google to improve AI',
      'Accessible through school Google accounts â€” possible even on accounts set up for younger students',
      'Part of Google\'s broader ad and identity-resolution infrastructure'
    ],
    parentTips: [
      'Check Google Account â†’ Gemini Apps Activity and turn off history or delete it regularly',
      'In Family Link (under-13 accounts), Gemini should be blocked by default â€” verify this',
      'Ask your child\'s school whether Gemini is enabled in the school Google Workspace',
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
      'Conversations stored by Microsoft; retention varies by account type',
      'School accounts governed by Microsoft EDU terms (more protective)',
      'Consumer Copilot shows ads powered by Microsoft Advertising',
      'Integrated with Microsoft 365 â€” AI can access files, emails, and calendar if enabled'
    ],
    parentTips: [
      'If your child has a school Microsoft 365 account, verify that the Copilot settings are managed by the school',
      'For personal accounts, check Microsoft Privacy Dashboard â†’ Activity History and delete AI history',
      'Ensure Copilot is not connected to sensitive OneDrive files',
      'Consumer Copilot on Bing uses Microsoft\'s ad targeting â€” use the school account version for safer access'
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
    description: 'Platform where users chat with AI personas and "characters" â€” very popular with teens',
    minAge: 16,
    riskLevel: 'very-high',
    privacyConcerns: [
      'AI characters are designed to form emotional bonds â€” significant risk of dependency for vulnerable teens',
      'Full conversation history stored; includes highly personal disclosures about mental health, relationships',
      'Linked to multiple legal complaints and lawsuits alleging harm to minors',
      'Minimal robust content filtering â€” inappropriate conversations have been widely reported',
      'No parental controls or family-link features',
      'All conversations used to train Character.AI\'s models with no clear opt-out'
    ],
    parentTips: [
      'This app is not recommended for children under 16 â€” consider blocking it at the router or device level',
      'Character.AI now has a Teen Mode (under-18) with some content restrictions â€” ensure it is active',
      'Have an open conversation: AI personas are not real friends and cannot replace real support',
      'If your child is struggling emotionally, direct them to real mental health resources (Crisis Text Line, therapist)',
      'Review your child\'s account history at least monthly if they use this app'
    ],
    website: 'https://character.ai'
  },
  {
    id: 'snapchat-my-ai',
    name: 'Snapchat My AI',
    category: 'ai',
    vendor: 'Snap Inc.',
    description: 'AI chatbot built directly into Snapchat â€” enabled by default for all users including teens',
    minAge: 13,
    riskLevel: 'very-high',
    privacyConcerns: [
      'Enabled by default for all Snapchat users â€” children cannot easily disable it',
      'My AI conversations are stored and factor into Snap\'s ad targeting',
      'My AI previously shared a user\'s location with the AI without explicit consent (patched but noted)',
      'Children may share personal or sensitive information thinking it is private',
      'My AI may recommend products, links, and sponsored content â€” advertising without clear labelling for younger users'
    ],
    parentTips: [
      'Go to Snapchat â†’ Profile â†’ Privacy Controls â†’ Clear My AI Data and delete conversation history',
      'Snapchat+ subscribers can remove My AI from the chat list; free users cannot',
      'Discuss with your teen that My AI is not a confidential companion â€” Snap staff can review conversations',
      'If your child is under 13, they should not have Snapchat at all',
      'Check for My AI in the Friends list â€” it appears as a contact called "My AI"'
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
      'Meta AI conversations feed the same advertising system as Instagram and Facebook',
      'Accessible via WhatsApp blue circle â€” often activated unintentionally',
      'Content your child shares in AI chats may inform Meta\'s ad targeting',
      'Meta\'s data broker relationships (LiveRamp, Acxiom, etc.) apply to AI conversation data',
      'No separate parental controls for Meta AI within WhatsApp or Instagram'
    ],
    parentTips: [
      'Meta AI is embedded â€” you cannot fully remove it, but you can avoid actively using it',
      'Review Meta account Privacy Settings â†’ AI â†’ Interaction History and delete it',
      'Discuss with your teen that the blue circle in WhatsApp is Meta AI, not a private chat',
      'Check Instagram Accounts Center â†’ Privacy â†’ Your Activity on Meta AI'
    ],
    website: 'https://ai.meta.com'
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    category: 'ai',
    vendor: 'Grammarly Inc.',
    description: 'AI writing assistant used across browsers, Word, and Google Docs â€” widely used by students for essays and homework',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Every piece of writing (essays, personal statements, messages) passes through Grammarly\'s servers',
      'Writing content may be used to train Grammarly\'s AI models on standard consumer accounts',
      'Browser extension has broad access to all text typed in web pages',
      'De-identified writing data may be shared with third-party analytics partners'
    ],
    parentTips: [
      'Check Grammarly\'s Account Settings â†’ Privacy and opt out of "human review" and data-sharing options',
      'Grammarly for Education provides stronger privacy protections â€” ask your school if they have a licence',
      'The browser extension can see everything typed on websites â€” review what sites your child uses it on',
      'Remind your child not to paste personal information (SSN, passwords, home address) into Grammarly'
    ],
    website: 'https://www.grammarly.com'
  },
  {
    id: 'perplexity-ai',
    name: 'Perplexity AI',
    category: 'ai',
    vendor: 'Perplexity AI',
    description: 'AI-powered search engine that answers questions with cited sources â€” used as a search replacement by students',
    minAge: 13,
    riskLevel: 'high',
    privacyConcerns: [
      'All search queries and follow-up questions stored by Perplexity',
      'No age verification â€” children of any age can access it',
      'Queries used to improve the AI model (opt-out available in paid plans)',
      'Search patterns reveal personal interests, location, health questions, and academic topics',
      'Perplexity collects IP address, device info, and search patterns linked to an account or device fingerprint'
    ],
    parentTips: [
      'Perplexity allows disabling personalised AI on free accounts â€” check Settings â†’ Privacy',
      'Remind your child not to search for highly personal topics (health conditions, home address, etc.)',
      'Consider whether Perplexity is being used to bypass school search filters',
      'Use a school-controlled account if the school has an agreement with Perplexity'
    ],
    website: 'https://www.perplexity.ai'
  },
  {
    id: 'socratic',
    name: 'Socratic by Google',
    category: 'ai',
    vendor: 'Google (Alphabet)',
    description: 'AI homework help app for secondary students â€” photo-based problem solving for math, science, and more',
    minAge: 10,
    riskLevel: 'medium',
    privacyConcerns: [
      'Photos of homework and written work uploaded to Google\'s AI infrastructure',
      'Usage linked to Google account and feeds Google\'s data ecosystem',
      'Google may use query data to improve its AI products'
    ],
    parentTips: [
      'Check Google Account â†’ Data & Privacy â†’ My Activity to see Socratic history',
      'Disable Socratic activity history in Google Account if desired',
      'Discuss with your child that homework photos are processed by Google'
    ],
    website: 'https://socratic.org'
  },
  {
    id: 'khanmigo',
    name: 'Khanmigo (Khan Academy AI)',
    category: 'ai',
    schoolAssigned: true,
    vendor: 'Khan Academy / OpenAI',
    description: 'AI tutor built by Khan Academy on top of OpenAI\'s GPT â€” designed specifically for students',
    minAge: 13,
    riskLevel: 'medium',
    privacyConcerns: [
      'Conversations processed via OpenAI\'s API (subject to OpenAI\'s enterprise data terms)',
      'Khan Academy stores conversation history to track learning progress',
      'OpenAI enterprise API should prevent training on these conversations, but verify with the school',
      'Student academic struggles and misconceptions are logged in detail'
    ],
    parentTips: [
      'Khan Academy is a non-profit with strong stated privacy commitments',
      'Verify that your school\'s Khanmigo agreement includes OpenAI Enterprise API protections',
      'Review the Khan Academy parent dashboard for conversation and progress history',
      'Khanmigo is one of the more responsibly designed AI tutors â€” confirm version used is the school version'
    ],
    website: 'https://www.khanacademy.org/khanmigo'
  },

  // â”€â”€ Mobile Operators (Telecom) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      'Knows your child\'s precise location 24/7 via cell towers and GPS',
      'Sells "Custom Experience" advertising program uses app usage and web browsing data â€” opt-out required',
      'Verizon was fined $1.35M for inserting hidden "supercookies" (UIDH) into all mobile traffic to track users without consent',
      'Call and SMS metadata (who, when, how long) logged and retained',
      'Device identifier (IMEI/IMSI) linked to real-world identity and can be shared with data brokers',
      'Participated in the 2018 carrier location-data scandal (sold real-time location to aggregators)'
    ],
    parentTips: [
      'Opt out of Verizon\'s Custom Experience program: My Verizon app â†’ Account â†’ Privacy Settings',
      'Enable the Verizon Smart Family parental controls for location monitoring and content filters',
      'Review the Verizon Privacy Policy to understand data retention for call records',
      'Request deletion of advertising data via the Verizon Privacy Dashboard',
      'Ask Verizon to opt you out of sharing data with Oath/Yahoo and other advertising partners'
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
      'Real-time location data accessible to AT&T and historically sold to third-party aggregators',
      'AT&T operated "Project Hemisphere" â€” a surveillance program sharing call records with government and law enforcement at industrial scale',
      'AT&T\'s Xandr ad platform (now Microsoft) used carrier-level identity data for ad targeting',
      'CPNI (Customer Proprietary Network Information) â€” detailed calling patterns are protected by law but exceptions are broad',
      'AT&T broadband customers\' browsing history used for ad targeting ("Internet Preferences" program)',
      'Participated in the 2018 carrier location-data scandal'
    ],
    parentTips: [
      'Opt out of AT&T\'s advertising programs: att.com/privacy â†’ Advertising & Analytics',
      'Use AT&T Secure Family for parental controls, location sharing, and content filters',
      'Review and opt out of the "Internet Preferences" browsing data program in your AT&T account',
      'Request a copy of your child\'s data under CPNI rules via AT&T\'s Privacy Center',
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
      '2021 data breach exposed personal data of 76.6 million current and former customers â€” including names, SSNs, and driver\'s licenses',
      'T-Mobile Advertising Solutions uses network data (location, app usage, web traffic) for ad targeting â€” opt-out required',
      'Location data sold to aggregators; T-Mobile was cited in the 2018 carrier location-data scandal',
      'App and web usage data collected via "T-Mobile Insights" network analytics program',
      'Device identifiers and call metadata retained and may be shared with partners',
      'Sprint (now merged into T-Mobile) also had documented location-data sharing practices'
    ],
    parentTips: [
      'Opt out of T-Mobile\'s advertising programs: Account â†’ Privacy & Notifications â†’ Advertising in the T-Mobile app',
      'Enable T-Life / FamilyMode for parental controls and location tracking',
      'If you were a customer before 2021, check haveibeenpwned.com for breach exposure',
      'Request T-Mobile to delete advertising profile data via their Privacy Center',
      'Review what T-Mobile Insights data collection applies to your plan'
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
    description: 'Prepaid carrier fully owned by AT&T â€” shares AT&T\'s network infrastructure and data practices',
    minAge: 6,
    riskLevel: 'high',
    privacyConcerns: [
      'Fully owned and operated by AT&T â€” all AT&T data practices apply',
      'Location data accessible on AT&T network infrastructure',
      'Call and SMS metadata retained under AT&T policies',
      'Advertising data sharing follows AT&T\'s advertising programs'
    ],
    parentTips: [
      'Treat Cricket\'s privacy practices as equivalent to AT&T\'s â€” same opt-outs apply',
      'Log into my.cricketwireless.com to review account privacy settings',
      'Opt out of AT&T advertising programs (Cricket shares the AT&T infrastructure)',
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
      'Location and network data collected by DISH Wireless and EchoStar parent company',
      'DISH also operates satellite TV â€” combined data profile possible across products',
      'Call metadata and device identifiers retained per DISH privacy policy',
      'Advertising programs use network and device data for targeting'
    ],
    parentTips: [
      'Review DISH/Boost privacy settings at boostmobile.com/legal/privacy',
      'Opt out of advertising data use in your Boost account settings',
      'Use device-level parental controls (Android Family Link or iOS Screen Time)',
      'Be aware that DISH\'s merger with EchoStar creates a combined data profile'
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
    description: 'Prepaid carrier acquired by T-Mobile in 2023 â€” runs on T-Mobile\'s network',
    minAge: 6,
    riskLevel: 'high',
    privacyConcerns: [
      'Operates on T-Mobile\'s network â€” T-Mobile\'s data practices and 2021 breach history apply',
      'Location, call metadata, and device identifiers accessible via T-Mobile infrastructure',
      'Advertising data may be shared under T-Mobile\'s advertising programs post-acquisition'
    ],
    parentTips: [
      'Since Mint runs on T-Mobile\'s network, opt out of T-Mobile Advertising in the T-Mobile Privacy Center',
      'Use device-level parental controls (Android Family Link or iOS Screen Time)',
      'Review Mint\'s privacy policy at mintmobile.com/legal/privacy for Mint-specific data practices',
      'Be aware that T-Mobile\'s 2021 data breach affects the network your device is on'
    ],
    website: 'https://www.mintmobile.com/legal/privacy',
    lawEnforcementConcerns: [
      'Mint operates on T-Mobile\'s network — all T-Mobile CALEA interception capabilities and law enforcement cooperation practices apply',
      'Real-time location, call records, and content interception are available to law enforcement via T-Mobile\'s infrastructure under a valid court order'
    ]
  }
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

