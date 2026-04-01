export interface Activity {
  id: string;
  title: string;
  learningObjective: string;
  materials: string[];
  instructions: string[];
  discussionPrompts: string[];
  assessment: string;
  adaptations: {
    younger: string;
    advanced: string;
  };
  storyConnection?: string;
  scenarioExamples?: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  storyQuote?: string;
  storyConnection: string;
  activities: Activity[];
}

export const classroomActivities: Chapter[] = [
  {
    id: 'chapter-1',
    number: 1,
    title: 'Understanding Personal Information',
    storyQuote: '"All your information has been shared with the entire forest!"',
    storyConnection: 'This chapter aligns with the beginning of the story when Po accidentally shares all his personal information, including his secret diary, embarrassing videos, and where he lives.',
    activities: [
      {
        id: 'activity-1-1',
        title: '"What Makes Me, Me?" Identity Collage',
        learningObjective: 'Students will identify and categorize different types of personal information.',
        materials: [
          'Construction paper',
          'Magazines for cutting',
          'Safety scissors',
          'Glue sticks',
          'Markers',
          'Template with "Public Information" and "Private Information" sections'
        ],
        instructions: [
          'Read Chapter 1 of "Privacy Panda and the Digital Bamboo Forest" to the class.',
          'Discuss what makes each student unique and special.',
          'Distribute the template with two sections: "Public Information" and "Private Information."',
          'Explain the difference between information that\'s okay to share with anyone (favorite color, hobbies) and information that\'s private (full name, address, phone number).',
          'Have students create a collage representing things about themselves, placing items in the appropriate section.',
          'Allow students to share the "Public Information" section of their collage with the class if they wish.'
        ],
        discussionPrompts: [
          'Why do you think some information needs to be kept private?',
          'Who are safe people to share your private information with?',
          'How did you decide what information belongs in which section?'
        ],
        assessment: 'Observe whether students correctly categorize different types of information. Listen for reasoning that demonstrates understanding of privacy concepts during sharing time.',
        adaptations: {
          younger: 'Provide pre-cut images representing different types of information',
          advanced: 'Add a third category for "Information to share only with close friends and family"'
        },
        storyConnection: 'This activity connects to when Po\'s personal information was accidentally shared with everyone in the forest, helping students understand what information should remain private.'
      },
      {
        id: 'activity-1-2',
        title: '"The Digital Bamboo Forest" Dramatic Play',
        learningObjective: 'Students will practice making safe choices about sharing information online through role-play.',
        materials: [
          'Simple props (cardboard tablet or computer cutouts)',
          'Character headbands or masks (panda, tiger, rabbit, etc.)',
          'Scenario cards',
          '"Stop and Think" signs'
        ],
        instructions: [
          'Set up a dramatic play area representing the "Digital Bamboo Forest."',
          'Assign roles to students (Po, Miki the Monkey, Billy the Beaver, Ruby the Rabbit, etc.).',
          'Present simple scenarios where characters must decide whether to share information.',
          'Provide "Stop and Think" signs that students can hold up when a character is about to share something private.',
          'After each scenario, discuss the choices made and why they were safe or unsafe.',
          'Switch roles and repeat with new scenarios.'
        ],
        discussionPrompts: [
          'How did you feel when asked to share private information?',
          'What helped you decide whether to share or not share?',
          'What could you say if someone asks for information you shouldn\'t share?'
        ],
        assessment: 'Note students\' decision-making during role-play scenarios and their reasoning during discussions.',
        adaptations: {
          younger: 'Use simpler scenarios and more teacher guidance',
          advanced: 'Let them create their own scenarios for the class to act out'
        },
        scenarioExamples: [
          'Miki the Monkey asks for your home address to send you a birthday present.',
          'A friend wants to know your favorite game to play together.',
          'Someone you don\'t know asks for your full name and birthday.'
        ],
        storyConnection: 'This activity uses the story characters (Miki, Billy, Ruby) who contacted Po after his information was shared, helping students practice responding to similar situations.'
      }
    ]
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'Privacy Settings & Digital Footprints',
    storyQuote: '"Information once shared is hard to take back," Turtle explained.',
    storyConnection: 'This chapter aligns with when Turtle teaches Po about privacy settings, the Privacy Shield, and how information shared in the Digital Forest is difficult to remove once it\'s out there.',
    activities: [
      {
        id: 'activity-2-1',
        title: '"Create Your Privacy Shield" Workshop',
        learningObjective: 'Students will understand how privacy settings protect their information, similar to how the Privacy Shield protects Po.',
        materials: [
          'Construction paper or cardboard',
          'Art supplies (markers, crayons, stickers)',
          'Yarn or string',
          'Privacy Shield template',
          'Whiteboard or chart paper'
        ],
        instructions: [
          'Read the section where Turtle introduces the Privacy Shield to Po.',
          'Discuss how the Privacy Shield helps protect information in the Digital Forest.',
          'Explain that privacy settings on devices are like having a Privacy Shield.',
          'Show students how to create their own physical Privacy Shield using the template.',
          'Have students decorate their shields with symbols representing what they want to protect (home, family, personal information).',
          'Create a class chart showing different privacy settings and what they protect.',
          'Have students share their shields and explain what they chose to protect.'
        ],
        discussionPrompts: [
          'How is a Privacy Shield like the privacy settings on a tablet or computer?',
          'What information would you want your Privacy Shield to protect?',
          'Why did Turtle say it\'s important to protect your information?'
        ],
        assessment: 'Evaluate students\' understanding of privacy protection based on their shield designs and explanations.',
        adaptations: {
          younger: 'Provide pre-decorated shield templates with simple symbols',
          advanced: 'Have students create a guide explaining how to use privacy settings on different devices'
        },
        storyConnection: 'This activity directly connects to Turtle\'s lesson about the Privacy Shield, helping students understand that privacy settings are tools they can use to protect their information.'
      },
      {
        id: 'activity-2-2',
        title: '"Digital Footprints Freeze Tag"',
        learningObjective: 'Students will understand that online actions leave lasting digital footprints that are hard to erase.',
        materials: [
          'Blue paper footprints (10-15 per student)',
          'Masking tape',
          'Music player',
          'Large open space (gym or playground)'
        ],
        instructions: [
          'Discuss the concept of digital footprints from Chapter 2, referencing Turtle\'s lesson: "Information once shared is hard to take back."',
          'Give each student a stack of paper footprints representing "digital actions."',
          'Explain that as the music plays, they\'ll move around the space, and when you call out a digital action (posting a photo, sending a message, playing a game), they must place a footprint on the floor with tape.',
          'After several rounds, have students try to collect all their footprints when you call "Delete!"',
          'Make some footprints harder to remove (extra tape) to demonstrate that some digital footprints can\'t be easily erased.',
          'Gather to discuss what they observed.'
        ],
        discussionPrompts: [
          'What happened when you tried to remove all your footprints?',
          'Why were some footprints harder to remove than others?',
          'How does this game relate to what Turtle taught Po about information being hard to take back?'
        ],
        assessment: 'Listen for connections students make between the activity and digital actions during discussion.',
        adaptations: {
          younger: 'Use fewer footprints and simpler concepts',
          advanced: 'Add discussions about the different "sizes" of digital footprints depending on the action'
        },
        scenarioExamples: [
          'You shared a photo of your art project!',
          'You played an online game with friends!',
          'You sent a message in a chat!'
        ],
        storyConnection: 'This activity demonstrates Turtle\'s important lesson that "information once shared is hard to take back," just like Po discovered when his information was shared with the entire forest.'
      }
    ]
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'Safe Sharing & Choosing What to Share',
    storyQuote: '"You have the right to protect your information, just like you protect your home," Turtle said.',
    storyConnection: 'This chapter aligns with when Po learns to share only what he wants to share, with only the animals he wants to see it. He discovers how to choose what information to share safely.',
    activities: [
      {
        id: 'activity-3-1',
        title: '"Permission Please!" Photo Booth',
        learningObjective: 'Students will practice asking for and giving permission before taking or sharing photos, learning to respect others\' privacy choices.',
        materials: [
          'Instant camera or digital camera/tablet (teacher operated)',
          'Photo props (silly hats, glasses, etc.)',
          '"Yes" and "No" cards for each student',
          '"Permission Granted" stamps or stickers',
          'Photo display area'
        ],
        instructions: [
          'Read the section where Po learns to share only what he wants to share, with only the animals he wants to see it.',
          'Discuss how Po learned to be careful about what he shares and with whom.',
          'Set up a simple "photo booth" area in the classroom.',
          'Give each student "Yes" and "No" cards to respond to photo requests.',
          'Model proper permission-asking: "May I take your photo?" and "May I share your photo on our class display?"',
          'Have students take turns asking classmates for permission to take photos.',
          'If permission is granted for both taking and sharing, mark the photo with a "Permission Granted" sticker and display it in the designated area.'
        ],
        discussionPrompts: [
          'How did it feel when someone asked for your permission?',
          'Why might someone say "no" to having their photo taken or shared?',
          'What should you do if someone doesn\'t want their photo taken?',
          'How does asking permission relate to what Po learned about choosing what to share?'
        ],
        assessment: 'Observe students\' ability to ask for permission respectfully and respect others\' decisions.',
        adaptations: {
          younger: 'Teacher can handle all photo-taking while students practice asking permission',
          advanced: 'Discuss different contexts where permission might change (school vs. home, etc.)'
        },
        storyConnection: 'This activity connects to Po\'s lesson about sharing only what he wants to share, with only the animals he wants to see it, teaching students to respect others\' privacy choices.'
      },
      {
        id: 'activity-3-2',
        title: '"Share or Don\'t Share" Sorting Game',
        learningObjective: 'Students will evaluate what information is appropriate to share in different contexts, learning to make thoughtful sharing decisions like Po did.',
        materials: [
          'Large sorting mats labeled "Safe to Share," "Ask a Grown-Up First," and "Keep Private"',
          'Information cards with various types of information and scenarios',
          'Small baskets for group work'
        ],
        instructions: [
          'Discuss how Po learned to think carefully about what information to share.',
          'Divide students into small groups.',
          'Provide each group with a set of sorting mats and information cards.',
          'Read each information card and discuss where it belongs.',
          'Have groups sort their cards onto the appropriate mats.',
          'Come together as a class to compare answers and discuss any differences.',
          'Create a class chart summarizing the guidelines for sharing, similar to how Po learned to use privacy settings.'
        ],
        discussionPrompts: [
          'Why might some information be okay to share in one situation but not another?',
          'Who are the grown-ups you can ask for help about sharing?',
          'What questions can you ask yourself before sharing something?',
          'How did Po learn to decide what to share?'
        ],
        assessment: 'Review group sorting decisions and listen to reasoning during discussions.',
        adaptations: {
          younger: 'Use pictures instead of written cards and fewer categories',
          advanced: 'Add more nuanced scenarios and contexts for sharing decisions'
        },
        scenarioExamples: [
          'Your favorite animal',
          'Your home address',
          'A photo of you and your friend',
          'Your password',
          'What you ate for lunch'
        ],
        storyConnection: 'This activity reinforces Po\'s learning about choosing what to share carefully, just like he learned to use privacy settings to control who sees his information.'
      }
    ]
  },
  {
    id: 'chapter-4',
    number: 4,
    title: 'Being a Privacy Hero',
    storyQuote: '"Remember," Privacy Panda would tell his friends, "in the Digital Bamboo Forest, we must be as careful with our information as we are with our real bamboo treasures!"',
    storyConnection: 'This chapter aligns with when Po becomes Privacy Panda, teaching other animals about online safety and helping them navigate the Digital Forest safely.',
    activities: [
      {
        id: 'activity-4-1',
        title: '"Privacy Panda Badges"',
        learningObjective: 'Students will identify ways they can be "privacy heroes" in their own lives, just like Po became Privacy Panda.',
        materials: [
          'Red construction paper circles (for badges)',
          'Yarn or safety pins (to wear badges)',
          'Art supplies for decorating',
          '"I\'m a Privacy Hero Because..." sentence strips',
          'Privacy hero action cards'
        ],
        instructions: [
          'Read Chapter 4 of "Privacy Panda and the Digital Bamboo Forest" to the class, focusing on how Po became Privacy Panda.',
          'Discuss how Po became Privacy Panda by learning and sharing knowledge with others.',
          'Brainstorm ways students can be "privacy heroes" at school and home.',
          'Have each student complete the sentence "I\'m a Privacy Hero Because..."',
          'Create Privacy Panda badges with their hero statements.',
          'Hold a "Privacy Hero Ceremony" where students share their statements and receive their badges.',
          'Create a classroom display of Privacy Hero actions.'
        ],
        discussionPrompts: [
          'How did Po help others in the story?',
          'What privacy skills are you good at that you could teach others?',
          'Why is it important to help others learn about privacy?',
          'What makes someone a Privacy Hero?'
        ],
        assessment: 'Evaluate students\' understanding of privacy concepts based on their hero statements.',
        adaptations: {
          younger: 'Provide sentence stems or specific action choices',
          advanced: 'Have them write or draw a short "privacy hero" comic showing how they would help someone'
        },
        storyConnection: 'This activity directly connects to Po\'s transformation into Privacy Panda, encouraging students to become privacy heroes who help others, just like Po did.'
      },
      {
        id: 'activity-4-2',
        title: '"Privacy Panda Club Meeting"',
        learningObjective: 'Students will apply and share their knowledge of digital privacy through collaborative problem-solving, like Privacy Panda does in the story.',
        materials: [
          'Privacy problem scenario cards',
          'Chart paper for solutions',
          'Privacy Panda puppet or stuffed animal',
          '"Club membership cards" for each student'
        ],
        instructions: [
          'Set up a special area for the "Privacy Panda Club Meeting."',
          'Provide each student with a club membership card.',
          'Use a Privacy Panda puppet as the "club leader" (teacher or student can operate).',
          'Present privacy problem scenarios similar to those Privacy Panda helps solve in the story.',
          'Have students work in small groups to discuss solutions.',
          'Come together to share solutions and create a class "Privacy Wisdom Book."',
          'End with a club pledge to protect privacy and help others, just like Privacy Panda does.'
        ],
        discussionPrompts: [
          'What would Privacy Panda say about this problem?',
          'How could you help someone understand why privacy matters?',
          'What is the most important privacy lesson you\'ve learned?',
          'How can we be like Privacy Panda and help others stay safe?'
        ],
        assessment: 'Observe students\' ability to apply privacy concepts to new scenarios and their collaborative problem-solving skills.',
        adaptations: {
          younger: 'Simplify scenarios and provide more teacher guidance',
          advanced: 'Have them create their own scenarios for the club to solve'
        },
        scenarioExamples: [
          'A friend shared your birthday on a public website without asking.',
          'Someone asks for your home address to send you a game.',
          'You want to share a photo of your school project that shows your full name.'
        ],
        storyConnection: 'This activity mirrors Privacy Panda\'s role as a teacher and helper in the story, where animals come to him with questions about staying safe online, and he helps them solve privacy problems.'
      }
    ]
  }
];

export const crossCurricularConnections = {
  languageArts: [
    'Write a letter from Po to a friend explaining a privacy tip',
    'Create privacy-themed acrostic poems',
    'Write an additional chapter for the Privacy Panda story'
  ],
  art: [
    'Design privacy posters for the classroom',
    'Create a Digital Bamboo Forest mural showing safe online practices',
    'Make Privacy Panda puppets for role-play activities'
  ],
  math: [
    'Graph class data about technology use (keeping responses anonymous)',
    'Create patterns for strong passwords',
    'Measure and compare digital footprint sizes based on different online actions'
  ],
  socialStudies: [
    'Discuss how privacy practices might differ across cultures',
    'Explore how privacy has changed throughout history',
    'Map the connections between community members and the information they need to know'
  ],
  science: [
    'Investigate how digital information is stored',
    'Experiment with different types of locks and keys (connecting to privacy protection)',
    'Study bamboo as a plant while making connections to the story setting'
  ]
};

export const assessmentTools = {
  observationChecklist: [
    'Student demonstrates understanding of public vs. private information',
    'Student can identify characteristics of privacy protection',
    'Student asks for permission before sharing information about others',
    'Student applies privacy concepts to new situations',
    'Student articulates privacy concepts in their own words'
  ],
  digitalPrivacyScenarioCards: 'Use scenario cards as formative assessment tools, asking students to explain what they would do in each situation and why.',
  privacyConceptMap: 'Have students create simple concept maps showing the connection between different privacy ideas from the story.',
  exitTickets: 'Use quick check-ins at the end of activities where students share one privacy tip they learned.',
  culminatingProject: 'A "Privacy Panda Guide" created by students to teach others about digital privacy.'
};

