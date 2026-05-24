// src/data/stories.ts
// PandaGarde — Story Registry
// Add new stories here; the StoryReader and StoryList components consume this automatically.

export type AgeGroup = 'early' | 'middle' | 'older'; // 5-7 | 8-10 | 11-13

export interface StoryChapter {
  id: string;
  title: string;
  content: string; // Plain text or simple markdown
  lessonHighlight?: string; // Pull-quote shown at end of chapter
}

export interface Activity {
  id: string;
  title: string;
  type: 'craft' | 'game' | 'discussion' | 'worksheet' | 'role-play';
  description: string;
  materials?: string[];
  ageGroups: AgeGroup[];
}

export interface Story {
  id: string;
  slug: string;              // URL-safe: "digital-bamboo-forest"
  episodeNumber: number;     // 1 = origin story
  title: string;
  subtitle?: string;
  theme: string;             // e.g. "Personal Info vs. Public Info"
  privacyTopic: string;      // Short tag shown on card
  ageGroups: AgeGroup[];
  publishedAt: string;       // ISO date string
  scheduledAt?: string;      // If future, component hides until date passes
  coverEmoji: string;        // Fallback when cover image unavailable
  coverColor: string;        // Tailwind bg class behind image / fallback
  coverImage?: string;       // Episode-specific cover under /public (see images/stories/covers/)
  coverImagePosition?: string; // CSS object-position for card/grid cover crop
  coverHeroImagePosition?: string; // CSS object-position for StoryListPage hero thumbnail
  summary: string;
  chapters: StoryChapter[];
  keyLesson: string;
  activities: Activity[];
  characters: string[];      // Character names featured
  isOrigin?: boolean;        // Marks episode 1
}

// ─────────────────────────────────────────────
// EPISODE 1 — Origin Story
// ─────────────────────────────────────────────
const episode1: Story = {
  id: 'story-001',
  slug: 'privacy-panda-and-the-digital-bamboo-forest',
  episodeNumber: 1,
  isOrigin: true,
  title: 'Privacy Panda and the Digital Bamboo Forest',
  theme: 'Personal Information & Privacy Basics',
  privacyTopic: 'What is private info?',
  ageGroups: ['early', 'middle'],
  publishedAt: '2024-01-01',
  coverEmoji: '🐼',
  coverColor: 'bg-emerald-100 dark:bg-emerald-950',
  coverImagePosition: 'left center',
  coverHeroImagePosition: '32% center',
  summary:
    'Po the panda accidentally shares everything with the entire forest — and learns from wise Elder Turtle how to protect his information and help others do the same.',
  characters: ['Po (Privacy Panda)', 'Elder Turtle', 'Miki the Monkey', 'Billy the Beaver', 'Ruby the Rabbit'],
  keyLesson:
    'In the Digital Bamboo Forest, we must be as careful with our information as we are with our real bamboo treasures.',
  chapters: [
    {
      id: 'c1-1',
      title: 'The Shy Panda',
      content: `Deep in the lush Bamboo Digital Forest lived a panda named Po. He was different from the other pandas because instead of munching on regular bamboo all day, he loved to play with digital bamboo tablets. These magical tablets could connect to all parts of the forest, letting animals share stories, photos, and messages.

Po was the shyest animal in the forest. He would hide behind the tallest bamboo stalks whenever other animals came near. Even though he loved his digital tablet, he rarely shared anything with others.

"What if they don't like my photos?" he would worry. "What if they laugh at my stories?"

So Po kept to himself, quietly exploring the digital pathways of the forest while staying hidden in the shadows.`,
    },
    {
      id: 'c1-2',
      title: 'The Wrong Button',
      content: `One sunny morning, Po was so excited about a new game on his tablet that he accidentally pressed the wrong button. Suddenly, a message appeared:

"All your information has been shared with the entire forest!"

Po gasped! His secret diary, his collection of embarrassing bamboo dance videos, and even his personal information like where he slept and what times he ate — everything was now visible to every animal in the forest!

"Oh no!" cried Po, hiding his face behind his paws.

Soon, messages started popping up on his tablet.

"Hey Po, I didn't know you lived in the East Grove!" wrote Miki the Monkey.
"I've seen you collecting bamboo near my stream," messaged Billy the Beaver.
"I love your dancing videos! Can I come watch you practice?" asked Ruby the Rabbit.

Po was terrified. He turned off his tablet and hid in his den for days, too embarrassed to come out.`,
      lessonHighlight: 'Once information is shared, it is very hard to take back.',
    },
    {
      id: 'c1-3',
      title: "Elder Turtle's Wisdom",
      content: `After a week, there was a gentle knock at his door. It was wise old Turtle, the eldest animal in the forest.

"Po," said Turtle softly, "may I come in?"

Po reluctantly let Turtle inside.

"I know what happened," Turtle said. "And I'm here to help you understand something important about our Digital Forest."

Turtle showed Po a special shield he carried.

"This is a Privacy Shield. It helps protect what we share in the Digital Forest. Let me teach you how to use it."

Over the next few days, Turtle taught Po many important lessons:

"Information once shared is hard to take back," Turtle explained. "That's why we must be careful what we share from the beginning."

"We can use special privacy settings," he demonstrated, showing Po how to adjust controls on his tablet. "These are like fences around your digital bamboo garden."

"And most importantly," Turtle said, placing the shield in Po's paws, "you have the right to protect your information, just like you protect your home."`,
      lessonHighlight: 'Privacy settings are like fences around your digital bamboo garden.',
    },
    {
      id: 'c1-4',
      title: 'Privacy Panda is Born',
      content: `Po listened carefully and practiced using the Privacy Shield. He learned how to share only what he wanted to share, with only the animals he wanted to see it. He discovered special locks for his diary and how to check if games and apps were safe before using them.

As Po became more confident, something unexpected happened. Forest animals began coming to him with questions:

"Po, how do I stop strangers from seeing my photos?" asked Owen the Owl.
"Po, someone is pretending to be me online! What should I do?" worried Fiona the Fox.

With each question, Po realized he could use what he had learned to help others. He started wearing his Privacy Shield proudly and carried his digital bamboo tablet everywhere he went.

Soon, Po wasn't shy anymore. He became known as "Privacy Panda" — the forest's expert on staying safe in the digital world. He created fun games to teach young animals about online safety and held special classes under the tallest bamboo tree.

"Remember," Privacy Panda would tell his friends, "in the Digital Bamboo Forest, we must be as careful with our information as we are with our real bamboo treasures!"`,
    },
  ],
  activities: [
    {
      id: 'a1-1',
      title: '"What Makes Me, Me?" Identity Collage',
      type: 'craft',
      ageGroups: ['early', 'middle'],
      description:
        'Students create a two-section collage sorting their information into "Public" and "Private" categories, just like Po learned to do.',
      materials: ['Construction paper', 'Magazines for cutting', 'Safety scissors', 'Glue sticks', 'Markers'],
    },
    {
      id: 'a1-2',
      title: 'Digital Bamboo Forest Dramatic Play',
      type: 'role-play',
      ageGroups: ['early'],
      description:
        'Students act out scenarios where they decide whether to share information, holding up "Stop and Think" signs when a character is about to overshare.',
      materials: ['Cardboard tablet cutouts', 'Character headbands', 'Scenario cards', '"Stop and Think" signs'],
    },
    {
      id: 'a1-3',
      title: 'Create Your Privacy Shield',
      type: 'craft',
      ageGroups: ['early', 'middle'],
      description:
        'Each student decorates their own Privacy Shield and adds symbols for what they want to protect online.',
      materials: ['Shield template printout', 'Markers and crayons', 'Stickers'],
    },
  ],
};

// ─────────────────────────────────────────────
// EPISODE 2 — Miki and the Photo That Flew Away
// ─────────────────────────────────────────────
const episode2: Story = {
  id: 'story-002',
  slug: 'miki-and-the-photo-that-flew-away',
  episodeNumber: 2,
  title: 'Miki and the Photo That Flew Away',
  theme: 'Consent & Sharing Photos of Others',
  privacyTopic: 'Asking permission before sharing',
  ageGroups: ['early', 'middle'],
  publishedAt: '2024-02-01',
  coverEmoji: '📸',
  coverColor: 'bg-yellow-100 dark:bg-yellow-950',
  coverImagePosition: 'left top',
  summary:
    "Miki is so proud of Ruby's bamboo sculpture that he shares a photo of it everywhere — without asking. When Ruby is upset, Privacy Panda helps Miki understand that sharing something about someone else always needs their permission first.",
  characters: ['Po (Privacy Panda)', 'Miki the Monkey', 'Ruby the Rabbit'],
  keyLesson: 'Even good intentions need consent. Always ask before sharing something about someone else.',
  chapters: [
    {
      id: 'c2-1',
      title: "Ruby's Secret Sculpture",
      content: `Ruby the Rabbit had been working on something special for weeks. Deep in the quiet corner of the Digital Bamboo Forest, she had built the most beautiful bamboo sculpture anyone had ever seen — tall spiraling stalks woven together like a crown.

But Ruby wasn't ready to show it to anyone yet. She was still adding small flowers and polishing the edges.

"It's not finished," she told herself, stepping back to look at it. "Maybe tomorrow."`,
    },
    {
      id: 'c2-2',
      title: 'Miki Means Well',
      content: `That afternoon, Miki the Monkey came swinging through the trees and stopped dead in his tracks.

"Ruby! That is AMAZING!" he shouted, his eyes wide. Before Ruby could even say hello, Miki pulled out his digital tablet and — snap! — took a photo.

"I have to share this with everyone," Miki said, already typing. "The whole forest will love it!"

"Wait—" Ruby started to say.

But the photo was already gone, flying across the Digital Forest like a leaf in the wind.`,
      lessonHighlight: 'Once you share something, you cannot un-share it.',
    },
    {
      id: 'c2-3',
      title: 'How Ruby Felt',
      content: `Messages flooded in. Animals praised the sculpture from every corner of the forest. But Ruby didn't feel happy. She felt something tight in her chest — like someone had opened a surprise present that wasn't theirs to open.

"That was mine," she said quietly. "I wasn't ready."

When Miki saw Ruby's face, his excitement disappeared. "I thought you'd be happy," he said, confused.

Ruby shook her head. "You didn't ask me."`,
    },
    {
      id: 'c2-4',
      title: "Privacy Panda's Lesson",
      content: `Privacy Panda heard what had happened and came to find them both.

"Miki," Po said gently, "you meant something kind. But kindness still needs permission."

"Even if it's something good?" Miki asked.

"Especially then," said Po. "When you share something about someone else — a photo, a story, even a compliment — you are making a choice that belongs to them, not to you."

Miki sat quietly for a moment. Then he typed a message to everyone in the forest: "Please know — I shared Ruby's sculpture without asking. That was my mistake. The photo has been removed."

He looked at Ruby. "I'm sorry. Will you tell me when you're ready to share it yourself?"

Ruby smiled slowly. "Yes. And Miki — thank you for fixing it."`,
    },
  ],
  activities: [
    {
      id: 'a2-1',
      title: '"Permission Granted" Photo Booth',
      type: 'role-play',
      ageGroups: ['early', 'middle'],
      description:
        'Students practice asking for and giving permission before taking or sharing photos, using "Yes" and "No" cards to respond.',
      materials: ['Camera or tablet (teacher operated)', 'Yes/No cards', '"Permission Granted" stickers', 'Photo props'],
    },
    {
      id: 'a2-2',
      title: 'How Would You Feel? Discussion Cards',
      type: 'discussion',
      ageGroups: ['early', 'middle', 'older'],
      description:
        'Scenario cards where students discuss how the subject of a shared photo or story might feel, building empathy around consent.',
    },
  ],
};

// ─────────────────────────────────────────────
// EPISODE 3 — Owen and the Sneaky Settings
// ─────────────────────────────────────────────
const episode3: Story = {
  id: 'story-003',
  slug: 'owen-and-the-sneaky-settings',
  episodeNumber: 3,
  title: 'Owen and the Sneaky Settings',
  theme: 'App Permissions & Privacy Settings',
  privacyTopic: 'Pause before "Allow All"',
  ageGroups: ['middle', 'older'],
  publishedAt: '2024-03-01',
  coverEmoji: '🦉',
  coverColor: 'bg-violet-100 dark:bg-violet-950',
  coverImagePosition: 'left top',
  summary:
    'Owen downloads a new game and taps "Allow All" without reading. Strange things start happening — the Smoke Foxes seem to know too much. Privacy Panda helps Owen audit his settings and understand what each permission really means.',
  characters: ['Po (Privacy Panda)', 'Owen the Owl', 'The Smoke Foxes'],
  keyLesson: 'Pause before "Allow All." Every permission is a door you open.',
  chapters: [
    {
      id: 'c3-1',
      title: 'The Exciting New Game',
      content: `Owen the Owl was famous in the Digital Bamboo Forest for knowing how everything worked. He had read every guide, tested every app, and could explain digital things in ways even the youngest animals understood.

So when a glowing new game appeared in the Forest Marketplace — "Bamboo Runner: Ultimate Edition" — Owen downloaded it immediately.

A long list of permissions appeared on his screen. Owen's eyes skimmed over them quickly. He was too excited to read.

"Allow All," he tapped, and the game began.`,
    },
    {
      id: 'c3-2',
      title: 'Something Feels Off',
      content: `For a few days, the game was wonderful. But then small strange things began to happen.

A Smoke Fox appeared near Owen's favorite tree. "Nice spot you've got here, by the Crystal Stream," it said with a sly smile.

Owen frowned. He had never told anyone where he went to think.

Then another Smoke Fox showed up at the Archive where Owen kept his reading list. "Interesting choices," it said, flipping through pages.

Owen hadn't shared that either.`,
      lessonHighlight: 'Every permission is a door. Make sure you know who you are letting in.',
    },
    {
      id: 'c3-3',
      title: "Privacy Panda's Audit",
      content: `Owen found Privacy Panda under the bamboo tree.

"I think something got in," Owen said, looking worried.

Privacy Panda nodded calmly. "Let's check the doors."

Together they went through Owen's tablet, looking at every permission he had granted to Bamboo Runner. Location — the game had it. Files — it had access. Contacts — it could read them all.

"I tapped 'Allow All' without reading," Owen said quietly. For someone who prided himself on understanding everything, the words stung.

"It happens to everyone," said Po. "The Quick Click Wind blows fast. The important thing is what you do next."

Owen closed each unnecessary permission one by one. Then he reported the game to the Forest Safety Council.`,
    },
    {
      id: 'c3-4',
      title: 'The Permission Rule',
      content: `Owen began teaching other animals his new rule — what he called "The Three Questions" to ask before tapping Allow:

One: Does this app really need this to work?
Two: What could someone do with this information?
Three: Would I be comfortable if Elder Turtle could see this choice?

If any answer felt uncomfortable, the right move was to tap "Deny" or ask a trusted adult.

The Smoke Foxes drifted back to the edges of the Forest. And Owen — who thought he already knew everything — discovered that being wise also means being willing to slow down.`,
    },
  ],
  activities: [
    {
      id: 'a3-1',
      title: 'App Permission Audit Cards',
      type: 'game',
      ageGroups: ['middle', 'older'],
      description:
        'Cards showing different app permissions (location, camera, contacts, microphone). Students sort them: "Makes sense / Ask an adult / Deny."',
    },
    {
      id: 'a3-2',
      title: "Owen's Three Questions Worksheet",
      type: 'worksheet',
      ageGroups: ['middle', 'older'],
      description:
        'Students apply the Three Questions framework to real-world app scenarios and write their reasoning.',
    },
  ],
};

// ─────────────────────────────────────────────
// STORY REGISTRY — Add new episodes here
// ─────────────────────────────────────────────
export const STORIES: Story[] = [episode1, episode2, episode3];

/** Canonical URL slug for the interactive Digital Bamboo Forest origin story. */
export const ORIGIN_STORY_SLUG = 'privacy-panda-and-the-digital-bamboo-forest';

/** Origin episode: InteractiveStoryPlayer + storyScenes, plus chapter reader on the same URL. */
export const isFoundationStory = (story: Story): boolean =>
  story.isOrigin === true || story.slug === ORIGIN_STORY_SLUG;

export const getFoundationStory = (): Story | undefined =>
  STORIES.find((s) => s.slug === ORIGIN_STORY_SLUG);

// Helpers
export const isStoryPublished = (story: Story, at: Date = new Date()): boolean =>
  !story.scheduledAt || new Date(story.scheduledAt) <= at;

export const getPublishedStories = (): Story[] =>
  STORIES.filter((s) => isStoryPublished(s)).sort((a, b) => a.episodeNumber - b.episodeNumber);

/** Published episodes after the foundation story (for the stories grid — avoids duplicating episode 1). */
export const getContinuationStories = (): Story[] =>
  getPublishedStories().filter((s) => !isFoundationStory(s));

export const getStoryBySlug = (slug: string): Story | undefined =>
  STORIES.find((s) => s.slug === slug);

export const getStoriesByAgeGroup = (age: AgeGroup): Story[] =>
  getPublishedStories().filter((s) => s.ageGroups.includes(age));

export const getLatestStory = (): Story | undefined => {
  const published = getPublishedStories();
  return published[published.length - 1];
};

export const getNextScheduledStory = (): Story | undefined => {
  const now = new Date();
  return STORIES.filter((s) => s.scheduledAt && new Date(s.scheduledAt) > now).sort(
    (a, b) =>
      new Date(a.scheduledAt as string).getTime() - new Date(b.scheduledAt as string).getTime()
  )[0];
};
