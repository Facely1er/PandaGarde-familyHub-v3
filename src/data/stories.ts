// src/data/stories.ts
// PandaGarde — Story Registry
// Product file — exists year-round, independent of any go-to-market program.
//
// Canonical source: docs/STORYLINE_BIBLE.md §6 (Story Registry)
// Character roster:  docs/STORYLINE_BIBLE.md §3 (The Cast)
// Quest pillars:     docs/STORYLINE_BIBLE.md §5
// Forest zones:      docs/STORYLINE_BIBLE.md §4
//
// SUMMER CAMP vs PRODUCT: Stories live on the platform year-round.
// The Summer Camp is a go-to-market program layered on top — not a separate story set.
// See docs/PRODUCT_VISION.md §10 for the product/camp distinction.

export type AgeGroup = 'early' | 'middle' | 'older'; // 5–7 | 8–10 | 11–13

export type QuestPillar =
  | 'connection'   // Path of Connection — Ruby — Network layer
  | 'memory'       // Path of Memory    — Mika — Data layer
  | 'protection'   // Path of Protection — Tao  — Infrastructure layer
  | 'creation'     // Path of Creation  — Kai  — Application layer (Phase 2)
  | 'wisdom';      // Path of Wisdom    — Po   — Human layer

// Tier 1 = Heart of the Forest (present from the start)
// Tier 2 = Creative & Identity Layer (enter as world deepens, age 8–10+)
// Tier 3 = Extended Cast (Phase 2/3 territory)
// Supporting = narrative function, no structural IT role
export type CharacterRole =
  | 'po'    // Tier 1 — The Curious Leader
  | 'tao'   // Tier 1 — The Wise Turtle (canonical; "Elder Turtle" retired)
  | 'ruby'  // Tier 1 — The Kind Bunny
  | 'mika'  // Tier 1 — The Smart Owl (canonical; "Owen" retired)
  | 'billy' // Tier 1 — The Clever Beaver
  | 'kai'   // Tier 2 — The Brave Fox (Phase 2, age 9+)
  | 'lumi'  // Tier 2 — The Firefly (Phase 2, age 8+)
  | 'fiona' // Tier 2 — The Fox child character (Phase 2, age 10+)
  | 'miki'  // Supporting — The impulsive peer
  | 'vex'   // Tier 3 — The Chameleon (Phase 2)
  | 'sage'  // Tier 3 — The Crane (Phase 2)
  | 'echo'; // Tier 3 — The Parrot (Phase 3)

export type ForestZone =
  | 'bamboo-gate'
  | 'crystal-stream'
  | 'great-archive'
  | 'privacy-garden'
  | 'bridge-of-consent'
  | 'taos-hollow'
  | 'firefly-path'
  | 'harmony-campfire'
  | 'smoke-fox-den'
  | 'foxfire-workshop'
  | 'shadow-mist'
  | 'reflection-pond'
  | 'echo-cavern';

export interface StoryChapter {
  id: string;
  title: string;
  content: string;
  lessonHighlight?: string;
  illustration?: string;
  audioUrl?: string;
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
  slug: string;
  episodeNumber: number;
  season: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  theme: string;
  privacyTopic: string;
  questPillar: QuestPillar;
  forestZone: ForestZone;
  leadCharacter: CharacterRole;
  characters: string[];
  ageGroups: AgeGroup[];
  publishedAt: string;
  scheduledAt?: string;
  coverEmoji: string;
  coverColor: string;
  /** Optional bundled or public URL override (see storyCoverAssets.ts). */
  coverImage?: string;
  coverImagePosition?: string;
  coverHeroImagePosition?: string;
  summary: string;
  chapters: StoryChapter[];
  keyLesson: string;
  activities: Activity[];
  isOrigin?: boolean;
}

// ─── SEASON 1 — THE PRIVACY GROVE ────────────────────────────────────────────
// Episodes 1–8. Bible ref: docs/STORYLINE_BIBLE.md §6.1
// Led primarily by Po and Tao. All five Forest Laws introduced.
// Path of Wisdom is the primary pillar; others seeded for Season 2.

const episode1: Story = {
  id: 'story-001',
  slug: 'privacy-panda-and-the-digital-bamboo-forest',
  episodeNumber: 1,
  season: 1,
  isOrigin: true,
  title: 'Privacy Panda and the Digital Bamboo Forest',
  theme: 'Personal Information & Privacy Basics',
  privacyTopic: 'What is private info?',
  questPillar: 'wisdom',
  forestZone: 'bamboo-gate',
  leadCharacter: 'po',
  characters: ['Po', 'Tao', 'Miki the Monkey', 'Ruby the Bunny', 'Billy the Beaver'],
  ageGroups: ['early', 'middle'],
  publishedAt: '2024-01-01',
  coverEmoji: '🐼',
  coverColor: 'bg-emerald-100',
  coverHeroImagePosition: '32% center',
  summary: 'Po accidentally shares everything with the entire forest and learns from wise Tao how to protect his information — and becomes its guide because of the mistake he made.',
  keyLesson: 'In the Digital Bamboo Forest, we must be as careful with our information as we are with our real bamboo treasures.',
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

Po gasped! His secret diary, his embarrassing bamboo dance videos, and even his personal information like where he slept and what times he ate — everything was now visible to every animal in the forest!

Soon, messages started popping up.

"Hey Po, I didn't know you lived in the East Grove!" wrote Miki the Monkey.
"I've seen you collecting bamboo near my stream," messaged Billy the Beaver.
"I love your dancing videos!" wrote Ruby the Bunny.

Po was terrified. He turned off his tablet and hid in his den for days.`,
      lessonHighlight: 'Once information is shared, it is very hard to take back.',
    },
    {
      id: 'c1-3',
      title: "Tao's Wisdom",
      content: `After a week, there was a gentle knock at his door. It was wise old Tao, the eldest animal in the forest, carrying his ancient lantern.

"Po," said Tao softly, "may I come in?"

Po reluctantly let Tao inside.

"I know what happened," Tao said. "And I'm here to help you understand something important about our Digital Forest."

Tao showed Po a special shield he carried.

"This is a Privacy Shield. It helps protect what we share in the Digital Forest. Let me teach you how to use it."

Over the next few days, Tao taught Po many important lessons about the Privacy Garden, the bamboo lock, and the five forest laws. "And most importantly," Tao said, placing the shield in Po's paws, "you have the right to protect your information, just like you protect your home."`,
      lessonHighlight: 'Privacy settings are like fences around your digital bamboo garden.',
    },
    {
      id: 'c1-4',
      title: 'Privacy Panda is Born',
      content: `Po listened carefully and practiced using the Privacy Shield. He learned how to share only what he wanted to share, with only the animals he wanted to see it.

As Po became more confident, something unexpected happened. Forest animals began coming to him with questions:

"Po, how do I stop strangers from seeing my photos?" asked Mika the Owl.
"Po, someone is pretending to be me online! What should I do?" worried Fiona the Fox.

With each question, Po realized he could use what he had learned to help others. He started wearing his Privacy Shield proudly and carried his digital bamboo tablet everywhere he went.

Soon, Po wasn't shy anymore. He became known as "Privacy Panda" — the forest's guide to staying safe in the digital world.

"Remember," Privacy Panda would tell his friends, "in the Digital Bamboo Forest, we must be as careful with our information as we are with our real bamboo treasures!"`,
    },
  ],
  activities: [
    {
      id: 'a1-1',
      title: '"What Makes Me, Me?" Identity Collage',
      type: 'craft',
      ageGroups: ['early', 'middle'],
      description: 'Students create a two-section collage sorting their information into "Public" and "Private" categories.',
      materials: ['Construction paper', 'Magazines for cutting', 'Safety scissors', 'Glue sticks', 'Markers'],
    },
    {
      id: 'a1-2',
      title: 'Digital Bamboo Forest Dramatic Play',
      type: 'role-play',
      ageGroups: ['early'],
      description: 'Students act out scenarios where they decide whether to share information.',
      materials: ['Cardboard tablet cutouts', 'Character headbands', 'Scenario cards', '"Stop and Think" signs'],
    },
    {
      id: 'a1-3',
      title: 'Create Your Privacy Shield',
      type: 'craft',
      ageGroups: ['early', 'middle'],
      description: 'Each student decorates their own Privacy Shield and adds symbols for what they want to protect online.',
      materials: ['Shield template printout', 'Markers and crayons', 'Stickers'],
    },
  ],
};

const episode2: Story = {
  id: 'story-002',
  slug: 'miki-and-the-photo-that-flew-away',
  episodeNumber: 2,
  season: 1,
  title: 'Miki and the Photo That Flew Away',
  theme: 'Consent & Sharing Photos of Others',
  privacyTopic: 'Asking permission before sharing',
  questPillar: 'connection',
  forestZone: 'bridge-of-consent',
  leadCharacter: 'ruby',
  characters: ['Po', 'Miki the Monkey', 'Ruby the Bunny'],
  ageGroups: ['early', 'middle'],
  publishedAt: '2024-02-01',
  coverEmoji: '📸',
  coverColor: 'bg-yellow-100',
  summary: "Miki photographs Ruby's unfinished sculpture and shares it without asking. Po helps Miki understand that sharing something about someone else always needs their permission first.",
  keyLesson: 'Even good intentions need consent. Always ask before sharing something about someone else.',
  chapters: [
    {
      id: 'c2-1',
      title: "Ruby's Secret Sculpture",
      content: `Ruby the Bunny had been working on something special for weeks — the most beautiful bamboo sculpture anyone had ever seen. But she wasn't ready to show it to anyone yet.

"It's not finished," she told herself. "Maybe tomorrow."`,
    },
    {
      id: 'c2-2',
      title: 'Miki Means Well',
      content: `That afternoon, Miki the Monkey came swinging through the trees and stopped dead in his tracks.

"Ruby! That is AMAZING!" Before Ruby could say hello, Miki pulled out his digital tablet — snap! — took a photo.

"I have to share this with everyone," Miki said, already typing.

"Wait—" Ruby started to say. But the photo was already gone, flying across the Digital Forest like a leaf in the wind.`,
      lessonHighlight: 'Once you share something, you cannot un-share it.',
    },
    {
      id: 'c2-3',
      title: 'How Ruby Felt',
      content: `Messages flooded in. Animals praised the sculpture from every corner of the forest. But Ruby didn't feel happy. She felt something tight in her chest — like someone had opened a surprise present that wasn't theirs to open.

"That was mine," she said quietly. "I wasn't ready."

When Miki saw Ruby's face, his excitement disappeared. "I thought you'd be happy."

Ruby shook her head. "You didn't ask me."`,
    },
    {
      id: 'c2-4',
      title: "Po's Lesson",
      content: `Po came to find them both.

"Miki," Po said gently, "you meant something kind. But kindness still needs permission."

"Even if it's something good?" Miki asked.

"Especially then. When you share something about someone else, you are making a choice that belongs to them, not to you."

Miki typed a message to everyone in the forest: "I shared Ruby's sculpture without asking. That was my mistake. The photo has been removed."

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
      description: 'Students practice asking for and giving permission before taking or sharing photos.',
      materials: ['Camera or tablet (teacher operated)', 'Yes/No cards', '"Permission Granted" stickers'],
    },
    {
      id: 'a2-2',
      title: 'How Would You Feel? Discussion Cards',
      type: 'discussion',
      ageGroups: ['early', 'middle', 'older'],
      description: 'Scenario cards where students discuss how the subject of a shared photo might feel.',
    },
  ],
};

// Episode 3 — Billy's Invisible Collection
// Bible ref: docs/STORYLINE_BIBLE.md §6.1 Episode 3
// Pillar: Path of Memory | Zone: Crystal Stream → Great Bamboo Archive
const episode3: Story = {
  id: 'story-003',
  slug: 'billys-invisible-collection',
  episodeNumber: 3,
  season: 1,
  title: "Billy's Invisible Collection",
  theme: 'Digital Footprints & Data Collection',
  privacyTopic: 'Collecting data without permission',
  questPillar: 'memory',
  forestZone: 'great-archive',
  leadCharacter: 'billy',
  characters: ['Po', 'Billy the Beaver', 'Mika the Owl'],
  ageGroups: ['early', 'middle'],
  publishedAt: '2024-03-01',
  coverEmoji: '🗺️',
  coverColor: 'bg-amber-100',
  summary: "Billy builds a map tracking all his friends' locations in real time — without telling anyone. When they discover it, they feel watched. Po and Mika help Billy understand the difference between collecting data to help and collecting it without permission.",
  keyLesson: 'Collecting information about others — even to be helpful — requires their knowledge and agreement.',
  chapters: [
    {
      id: 'c3-1',
      title: "Billy's Big Idea",
      content: `Billy the Beaver was proud of his latest invention: a real-time map of the entire forest that showed exactly where every animal was at any moment.

"I can use this to help everyone find each other!" he said. "If Ruby is lost, I'll know exactly where she is."

He spent a whole week building it, collecting tiny signals from his friends' tablets while they went about their day. Nobody knew. He was going to reveal it as a surprise.`,
    },
    {
      id: 'c3-2',
      title: 'The Map Goes Live',
      content: `The day Billy revealed his map, he expected cheers. Instead, the clearing went very quiet.

Ruby stared at the glowing screen. Her little dot had been moving all morning — from the stream to the meadow to the Archive, back to her burrow.

"That's everywhere I went today," she said slowly.

"And yesterday," said Mika, pointing to her own dot's trail. "And the day before."

Billy's smile faded. "I thought you'd be happy. Now you can always find each other!"`,
      lessonHighlight: 'Information collected without asking — even to be helpful — changes how people feel about being watched.',
    },
    {
      id: 'c3-3',
      title: 'What the Archive Remembers',
      content: `Mika led them to the Great Bamboo Archive.

"Look," she said, pulling out a glowing scroll. Every animal's path, recorded for weeks. Where they slept. Where they ate. When they were alone.

"The Archive doesn't judge what it stores," Mika said carefully. "But the animal who decides what to collect — that animal makes a choice."

Billy looked at the scroll. "I made a choice for everyone."

"Without asking," Po said. Not unkindly. Just clearly.`,
    },
    {
      id: 'c3-4',
      title: 'The Permission Map',
      content: `Billy deleted the old map that night.

He built a new one — smaller, quieter, and different in one important way: every animal chose whether to appear on it. Some said yes. Some said no. Billy added a switch so anyone could turn their dot off whenever they wanted.

"This feels different," Ruby said when she saw it.

"It is different," Billy said. "This time I asked."

The new map was smaller than the first one. But for the first time, it felt like something that belonged to everyone — not just to Billy.`,
    },
  ],
  activities: [
    {
      id: 'a3-1',
      title: 'The Permission Map Activity',
      type: 'game',
      ageGroups: ['early', 'middle'],
      description: 'Students build a classroom map together — deciding as a group what information each person is comfortable sharing and what stays private.',
      materials: ['Large paper', 'Sticky dots', '"Opt in / Opt out" cards per student'],
    },
    {
      id: 'a3-2',
      title: 'Data Trail Discussion',
      type: 'discussion',
      ageGroups: ['middle', 'older'],
      description: 'Students list every app or device they used yesterday and discuss what information each one might have collected. What surprised them?',
    },
  ],
};

// Episode 4 — Mika and the Sneaky Settings
// Bible ref: docs/STORYLINE_BIBLE.md §6.1 Episode 4
// Note: This story features Mika the Owl. "Owen" is a retired character name —
// the canonical owl is Mika. See docs/STORYLINE_BIBLE.md §3 (Tier 1 cast).
// Pillar: Path of Protection | Zone: Privacy Garden → Tao's Hollow
const episode4: Story = {
  id: 'story-004',
  slug: 'mika-and-the-sneaky-settings',
  episodeNumber: 4,
  season: 1,
  title: 'Mika and the Sneaky Settings',
  theme: 'App Permissions & Privacy Settings',
  privacyTopic: 'Pause before "Allow All"',
  questPillar: 'protection',
  forestZone: 'privacy-garden',
  leadCharacter: 'tao',
  characters: ['Po', 'Tao', 'Mika the Owl'],
  ageGroups: ['middle', 'older'],
  publishedAt: '2024-04-01',
  coverEmoji: '🔐',
  coverColor: 'bg-violet-100',
  summary: 'Mika — who prides herself on understanding the digital world — taps "Allow All" without reading. Smoke Foxes begin appearing in unexpected places. Po and Tao help her audit every permission and understand what each door really opens.',
  keyLesson: 'Pause before "Allow All." Every permission is a door you open.',
  chapters: [
    {
      id: 'c4-1',
      title: 'The Exciting New Game',
      content: `Mika the Owl was known for knowing how everything in the Digital Bamboo Forest worked. So when a glowing new game appeared in the Forest Marketplace — "Bamboo Runner: Ultimate Edition" — she downloaded it immediately.

A long list of permissions appeared on her screen. Mika's eyes skimmed over them quickly. She was too excited to read.

"Allow All," she tapped, and the game began.`,
    },
    {
      id: 'c4-2',
      title: 'Something Feels Off',
      content: `For a few days, the game was wonderful. But then small strange things began to happen.

A Smoke Fox appeared near Mika's favorite thinking spot. "Nice spot by the Crystal Stream," it said.

Mika frowned. She had never told anyone where she went to think.

Another Smoke Fox showed up at her reading archive. "Interesting choices," it said.

Mika hadn't shared that either.`,
      lessonHighlight: 'Every permission is a door. Make sure you know who you are letting in.',
    },
    {
      id: 'c4-3',
      title: "Po and Tao's Audit",
      content: `Mika found Po and Tao under the bamboo tree.

"I think something got in," she said.

Tao nodded calmly. "Let's check the doors."

Together they reviewed every permission Bamboo Runner had been granted. Location. Files. Contacts. All open.

"I tapped 'Allow All' without reading," Mika said quietly. For someone who prided herself on understanding everything, the words stung.

"It happens to everyone," said Po. "The Quick Click Wind blows fast. The important thing is what you do next."

Mika closed each unnecessary permission one by one.`,
    },
    {
      id: 'c4-4',
      title: 'The Three Questions',
      content: `Mika began teaching other animals her new rule — "The Three Questions" to ask before tapping Allow:

One: Does this app really need this to work?
Two: What could someone do with this information?
Three: Would I be comfortable if Tao could see this choice?

If any answer felt uncomfortable: tap "Deny" or ask a trusted adult.

The Smoke Foxes drifted back to the forest edges. And Mika discovered that being wise also means being willing to slow down.`,
    },
  ],
  activities: [
    {
      id: 'a4-1',
      title: 'App Permission Audit Cards',
      type: 'game',
      ageGroups: ['middle', 'older'],
      description: 'Cards showing different app permissions. Students sort them: "Makes sense / Ask an adult / Deny."',
    },
    {
      id: 'a4-2',
      title: 'The Three Questions Worksheet',
      type: 'worksheet',
      ageGroups: ['middle', 'older'],
      description: 'Students apply the Three Questions framework to real-world app scenarios.',
    },
  ],
};

// Episode 5 — Ruby and the Very Friendly Stranger
// Bible ref: docs/STORYLINE_BIBLE.md §6.1 Episode 5
// Pillar: Path of Connection | Zone: Firefly Lantern Path → Smoke Fox Den
const episode5: Story = {
  id: 'story-005',
  slug: 'ruby-and-the-very-friendly-stranger',
  episodeNumber: 5,
  season: 1,
  title: 'Ruby and the Very Friendly Stranger',
  theme: 'Online Strangers & Trust Signals',
  privacyTopic: 'How trust is built slowly',
  questPillar: 'connection',
  forestZone: 'firefly-path',
  leadCharacter: 'ruby',
  characters: ['Po', 'Ruby the Bunny', 'Tao'],
  ageGroups: ['early', 'middle'],
  publishedAt: '2024-05-01',
  coverEmoji: '🦋',
  coverColor: 'bg-teal-100',
  summary: 'A new animal appears in the Open Clearing and quickly becomes Ruby\'s "best friend" — asking increasingly personal questions. Ruby feels the kindness but something is off. She tells Tao, and learns what the Lantern Path is really for.',
  keyLesson: 'Real friends in the Digital Bamboo Forest earn trust over time. Anyone who asks for private information quickly has not yet earned a lantern.',
  chapters: [
    {
      id: 'c5-1',
      title: 'The New Animal',
      content: `Ruby the Bunny loved meeting new friends. She had the biggest heart in the forest and believed — truly believed — that every animal who was kind deserved kindness back.

So when a smooth, cheerful voice called out to her at the edge of the Open Clearing one morning, she turned around with a smile already forming.

"Hello!" said the animal. She couldn't quite tell what kind it was — its colours seemed to shift a little in the light. "I'm new here. I've heard so much about you. They say you're the kindest animal in the whole forest."

Ruby's ears went up. "They do?"

"Oh yes. I've been looking forward to meeting you."

By afternoon they had walked the whole path of the Crystal Stream together, talking and laughing. The new animal was funny and warm and seemed interested in everything Ruby said. Ruby thought: I think I've made a real friend.`,
    },
    {
      id: 'c5-2',
      title: 'The Questions Get Closer',
      content: `The next morning, a message arrived in Ruby's tablet before she had even finished breakfast.

"Good morning! What are you doing today? Where do you usually go after school?"

Ruby answered without thinking. Then another message came.

"Do you always walk home the same way? Is it just you, or does someone walk with you?"

Ruby paused. She typed a cheerful answer and put the tablet down. But something small and strange had settled in her chest — like a pebble dropped into still water.

That afternoon, the new animal asked about her burrow. Where it was, exactly. Whether her family was often home.

Ruby didn't answer that one. She sat very still with the tablet in her paws, reading the words again.

She wanted to feel excited. She wanted to feel like she'd made a new friend.

But all she felt was that small, heavy pebble.`,
      lessonHighlight: 'Feelings in your chest can be information. It is worth paying attention to them.',
    },
    {
      id: 'c5-3',
      title: "Tao's Lantern",
      content: `Ruby found Tao sitting at the entrance to his hollow, polishing his ancient lantern.

"You look like you have something on your mind," he said, without looking up.

Ruby sat down and showed him the messages, one by one.

Tao was quiet for a long time. Then he held up his lantern.

"Do you know why I carry this?" he asked.

"To light the path?" Ruby said.

"Yes. But the Firefly Lantern Path is not just beautiful. It is a sign. Every animal on that path has earned their light through trust built slowly — over many walks, many choices, many small moments where they kept their word."

He looked at her gently. "This new animal arrived at the beginning and moved straight to the end. They skipped the whole path."

"But they were so kind," Ruby said.

"Kindness and trust are not the same thing," Tao said. "Anyone can be kind at the beginning. What matters is what they ask for — and how quickly they ask for it."

Ruby thought about the pebble in her chest. "My feeling was trying to tell me something."

"Your feeling," Tao said, "was the lantern."`,
    },
    {
      id: 'c5-4',
      title: 'What Ruby Chose',
      content: `Ruby did not answer the last message. She told Tao about the account, and he helped her report it and adjust her settings so only lantern-lit animals — ones she had actually met and spent time with — could reach her directly.

She felt a little sad. She had wanted a new friend.

But Po came to find her that evening.

"Are you okay?" he asked.

"I think so. I wanted them to be real."

"I know," Po said. "That's not weakness. That's just who you are." He sat beside her. "The Lantern Path exists because the forest wants you to have real friends. The kind that take time. The kind that are worth waiting for."

Ruby looked out at the firefly lights drifting through the bamboo.

"How do you know," she asked, "when someone has earned their lantern?"

Po thought about it. "That," he said, "is a question worth taking home and thinking about with someone you already trust."`,
    },
  ],
  activities: [
    {
      id: 'a5-1',
      title: 'Trust Signal Sorting',
      type: 'game',
      ageGroups: ['early', 'middle'],
      description: 'Students receive a set of message cards and sort them into "Lantern signals" (trust-building) and "Warning signals" (asking too much too fast). Discussion follows: what does each signal tell you?',
      materials: ['Message scenario cards', 'Two sorting labels: "Lantern signal" / "Warning signal"'],
    },
    {
      id: 'a5-2',
      title: 'My Trusted Circle — Who Has Earned a Lantern?',
      type: 'craft',
      ageGroups: ['early', 'middle'],
      description: 'Students draw a Firefly Lantern Path and place the names or drawings of people they trust along it — noting one thing that person has done to earn that trust.',
      materials: ['Path template printout', 'Markers', 'Firefly lantern stickers'],
    },
    {
      id: 'a5-3',
      title: '"What Would You Do?" Scenario Cards',
      type: 'discussion',
      ageGroups: ['middle', 'older'],
      description: 'Discussion cards with online contact scenarios ranging from clearly fine to clearly uncomfortable. Students discuss the pebble-in-the-chest feeling and when to tell a trusted adult.',
    },
  ],
};

// Episode 6 — The Day the Password Was Too Short
// Bible ref: docs/STORYLINE_BIBLE.md §6.1 Episode 6
// Pillar: Path of Protection | Zone: Privacy Garden
const episode6: Story = {
  id: 'story-006',
  slug: 'the-day-the-password-was-too-short',
  episodeNumber: 6,
  season: 1,
  title: 'The Day the Password Was Too Short',
  theme: 'Password Safety & Account Security',
  privacyTopic: 'Strong passwords protect your private garden',
  questPillar: 'protection',
  forestZone: 'privacy-garden',
  leadCharacter: 'tao',
  characters: ['Po', 'Tao', 'Mika the Owl'],
  ageGroups: ['early', 'middle'],
  publishedAt: '2024-06-01',
  coverEmoji: '🔒',
  coverColor: 'bg-green-100',
  summary: 'A young beaver uses the same short password for everything — "bamboo1" — and a Smoke Fox guesses it, slipping into her private garden. Po teaches the group the Bamboo Lock method using the Privacy Garden as a teaching ground.',
  keyLesson: 'A strong password is the first gate to your privacy garden.',
  chapters: [
    {
      id: 'c6-1',
      title: 'The Easiest Key',
      content: `Hazel the young beaver had one password for everything.

"bamboo1."

She had chosen it because it was easy to remember. She typed it so often — for her tablet, her message account, her photo collection, her journal — that her paws could do it without her even thinking.

"One key for every door," she told herself. "Isn't that simpler?"

It did make things simpler. Until it didn't.`,
    },
    {
      id: 'c6-2',
      title: 'The Open Gate',
      content: `One evening, Hazel opened her private journal to write about her day — and stopped.

Something was different. A few of her entries had been moved. A photo she hadn't shared was now gone.

She checked her message account. A message had been sent from her — to animals she barely knew — that she had never written.

And in her photo collection, a strange comment had been left by an account she didn't recognise: a small shadowy shape with no name.

A Smoke Fox.

Hazel sat very still. She felt cold all the way through.

"bamboo1," she said softly to herself. "I didn't think anyone would guess."`,
      lessonHighlight: 'Short passwords and common words are the unlocked gates of the Digital Forest.',
    },
    {
      id: 'c6-3',
      title: 'The Bamboo Lock',
      content: `Po and Tao came to help. First they changed everything — every account, every door.

Then Tao led the group to the Privacy Garden and pointed to its gate: a tall, beautiful bamboo lock made of interlocking pieces, each one unique.

"Do you see how this is built?" Tao said. "Each piece is different. The length matters. The order matters. No two sections are alike."

He crouched down. "A good password is the same. Long enough that it would take forever to guess. Strange enough that it doesn't mean anything obvious. Different for every door — so that one lost key never opens everything."

"But how do I remember them all?" Hazel asked.

"You build a picture in your mind," Tao said. He showed her how to use three random words — a bamboo stalk, a firefly, a rainstorm — turned into something only she could picture. "Or you ask your family to help you find a safe way to keep track."

Mika added: "The Archive never forgets. Neither does a password manager — a safe place where only you hold the key to all the keys."`,
    },
    {
      id: 'c6-4',
      title: 'A Different Kind of Confidence',
      content: `That night, Hazel changed every password. Each one long, strange, and different from the last.

It took longer than before. Her paws didn't fly across the tablet the way they used to.

But when she closed the garden gate at the end of the evening, she felt something new. Not relief exactly — something stronger. Like knowing the lock was real.

"bamboo1" was gone.

What she had now was harder to say and impossible to guess — and entirely hers.

"I used to think a short password was a small thing," she told Po the next morning.

"Most gates look small," Po said, "until you see what they're keeping safe."`,
    },
  ],
  activities: [
    {
      id: 'a6-1',
      title: 'Build a Bamboo Lock',
      type: 'craft',
      ageGroups: ['early', 'middle'],
      description: 'Students create a physical "Bamboo Lock" using interlocking paper strips — each strip represents one character in a password. They learn that longer, more varied locks are harder to open. Discuss: what makes a lock easy or hard to pick?',
      materials: ['Pre-cut paper strips in different colours', 'Markers', 'Brass fasteners or tape'],
    },
    {
      id: 'a6-2',
      title: 'The Three-Word Method',
      type: 'game',
      ageGroups: ['middle', 'older'],
      description: 'Students practice creating memorable but strong passwords using three random, unrelated words (a forest animal + a weather event + an object). They test each other\'s attempts without sharing the actual password — just the strength.',
    },
    {
      id: 'a6-3',
      title: 'One Key for Everything — Discussion',
      type: 'discussion',
      ageGroups: ['middle', 'older'],
      description: 'What would happen in the forest if every gate used the same lock? Map the consequences: one key lost means every door opens. Students apply this logic to their own accounts.',
    },
  ],
};

// Episode 7 — When Miki Said Something Unkind
// Bible ref: docs/STORYLINE_BIBLE.md §6.1 Episode 7
// Pillar: Path of Wisdom | Zone: Crystal Stream → Harmony Campfire
const episode7: Story = {
  id: 'story-007',
  slug: 'when-miki-said-something-unkind',
  episodeNumber: 7,
  season: 1,
  title: 'When Miki Said Something Unkind',
  theme: 'Digital Kindness — The Sender\'s Perspective',
  privacyTopic: 'Words travel farther online than we think',
  questPillar: 'wisdom',
  forestZone: 'crystal-stream',
  leadCharacter: 'po',
  characters: ['Po', 'Miki the Monkey', 'Ruby the Bunny'],
  ageGroups: ['early', 'middle'],
  publishedAt: '2024-07-01',
  coverEmoji: '💬',
  coverColor: 'bg-rose-100',
  summary: "Miki sends an unkind message about another animal's bamboo art, thinking it won't reach far. But words in the Crystal Stream travel to every corner of the forest — farther and faster than Miki imagined. He has to face what he caused and make it right.",
  keyLesson: 'Words in the Digital Bamboo Forest echo farther than you think. Kindness travels as fast as unkindness — choose kindness.',
  chapters: [
    {
      id: 'c7-1',
      title: 'A Small, Sharp Thought',
      content: `Miki the Monkey was having a bad day.

He had tripped over a root. He had dropped his lunch. He had missed the thing he'd been looking forward to all week. And now, opening his tablet at the edge of the Crystal Stream, he saw a photo of Cedar the fox's bamboo sculpture — the one everyone had been praising for days.

Miki looked at it. Then he typed something.

It wasn't very long. It wasn't even shouted. It was the kind of thing you might mutter under your breath on a bad day and forget five seconds later.

He pressed send and put the tablet down.

He forgot about it almost immediately.`,
    },
    {
      id: 'c7-2',
      title: 'How Far the Stream Runs',
      content: `By evening, Ruby found Miki at his favourite branch.

"Have you seen what's happening at the Campfire?" she said.

Miki hadn't.

Ruby showed him her tablet. His message — the short, sharp one — had been shared eight times. Then fourteen. Then shared again with comments added, and the comments shared with more comments, until Cedar's name appeared in nearly every corner of the stream that ran through the forest.

Cedar had read it. So had Cedar's family. So had animals Miki had never met.

Miki stared at the screen. The words looked different now — bigger, somehow, than when he had typed them. Like they had grown in the water.

"I didn't think it would go anywhere," he said.

Ruby didn't say anything for a moment. "I know," she said finally. "But the Stream doesn't ask what you meant to happen."`,
      lessonHighlight: 'The Crystal Stream carries everything — kind and unkind — to every part of the forest.',
    },
    {
      id: 'c7-3',
      title: "Po's Campfire",
      content: `Po was waiting at the Harmony Campfire.

"I know what you're thinking," he said, when Miki sat down. "You're thinking it was just one message. That you were having a bad day. That you didn't mean for it to travel."

Miki nodded at all three.

"I thought all of those things too," Po said. "After my own mistake."

He looked into the fire. "The forest doesn't hold it against you that you had a hard day. That's not what matters here. What matters is Cedar." He was quiet for a moment. "Cedar had a day too. And yours ran into it."

Miki sat with that for a while.

"Can I fix it?" he asked.

"Some of it," Po said honestly. "Not all of it. The stream doesn't run backwards. But you can add something new to it."`,
    },
    {
      id: 'c7-4',
      title: 'What Miki Added',
      content: `Miki sent a message to Cedar that night.

He wrote it three times before he got it right. Not an excuse — he had learned from Po that excuses were another way of making things about yourself. Just a clear, plain sorry. He said he had seen the sculpture and hadn't stopped to really look at it. He said his bad day was his, not Cedar's. He said he was sorry.

Then he sent a second message to everyone who had shared the first one — just two sentences: he had been wrong, and he wanted to say so publicly.

He didn't know if Cedar would forgive him. He didn't ask for that. That was Cedar's to decide.

But the next morning he opened the Crystal Stream and something felt different. Quieter. Like he had added a small, clear note to the water — and the water had carried that too.

"It goes both ways," Ruby told him. "That's the thing about the Stream."`,
    },
  ],
  activities: [
    {
      id: 'a7-1',
      title: 'The Ripple Map',
      type: 'craft',
      ageGroups: ['early', 'middle'],
      description: 'Students drop a "message stone" (a card with a message written on it) into a paper stream. Each time it gets shared, they draw a ripple outward. Visualise: how far can one message travel? What happens to the original context as it moves?',
      materials: ['Large blue paper (the "stream")', 'Message cards', 'Marker to draw ripple rings'],
    },
    {
      id: 'a7-2',
      title: 'Kind and Unkind — Sorting by How It Travels',
      type: 'game',
      ageGroups: ['early'],
      description: 'Students receive message cards and sort them into "I\'d want this to travel" and "I\'d want this to stop here." Discuss: what makes you want to share a message? Does the reason change if you picture it going everywhere?',
    },
    {
      id: 'a7-3',
      title: 'How to Apologise Online',
      type: 'discussion',
      ageGroups: ['middle', 'older'],
      description: 'Discussion and role-play around what a real apology looks like online — vs. an excuse. Students practise writing an apology that doesn\'t centre the sender. What does a good repair look like?',
    },
  ],
};

// Episode 8 — Po's Toughest Question
// Bible ref: docs/STORYLINE_BIBLE.md §6.1 Episode 8
// Pillar: Path of Wisdom | Zone: Harmony Campfire → Tao's Hollow
const episode8: Story = {
  id: 'story-008',
  slug: 'pos-toughest-question',
  episodeNumber: 8,
  season: 1,
  title: "Po's Toughest Question",
  theme: 'Trusted Adults & Disclosure',
  privacyTopic: 'When a situation is too big to carry alone',
  questPillar: 'wisdom',
  forestZone: 'taos-hollow',
  leadCharacter: 'po',
  characters: ['Po', 'Tao', 'Lumi the Firefly'],
  ageGroups: ['early', 'middle'],
  publishedAt: '2024-08-01',
  coverEmoji: '🌿',
  coverColor: 'bg-indigo-100',
  summary: 'A young forest animal receives a message that makes her feel scared and unsure. She doesn\'t want to get anyone in trouble. Po — who once hid in his den for a week — helps her understand that some situations are too big for one animal alone. Telling Tao is the brave choice.',
  keyLesson: 'You are never alone in the Digital Bamboo Forest. A trusted adult is always a safe path.',
  chapters: [
    {
      id: 'c8-1',
      title: 'The Message That Made Her Go Quiet',
      content: `Lumi the Firefly had a glow that filled any room she entered. She was the first to laugh, the first to share a spark of light, the first to say something that made the whole clearing feel warmer.

But one afternoon, Po found her sitting very still at the edge of the Harmony Campfire with her tablet in her lap and her light dimmed almost to nothing.

"Lumi?" he said softly.

She looked up. "I'm fine," she said — which is what animals say when they are not fine but do not know where to start.

Po sat down beside her. He didn't ask again. He just waited.

After a long moment, she turned the tablet toward him.

The message was from an account with no lantern — no name he recognised, no trusted signal. It had said things that made the clearing feel colder just by being there. It asked for things. It said things would happen if she didn't answer.

Po read it twice. Then he was very quiet.

"I didn't want to make it worse," Lumi said quickly. "I thought if I just ignored it—"

"I know," Po said. "I know exactly what you thought."`,
    },
    {
      id: 'c8-2',
      title: 'The Week in the Den',
      content: `Lumi looked at him. "Do you?"

Po was quiet for a moment. Then he said something he didn't say often.

"When I first made my mistake — when I accidentally shared everything — I hid in my den for a whole week. I didn't tell anyone. I thought if I stayed still enough, if I waited long enough, it would stop being real."

Lumi's glow flickered.

"Did it work?" she asked.

"No," Po said. "It got heavier. Every day I carried it alone, it got heavier."

He looked at her. "The thing about something this big — and what you're carrying is big, Lumi, even if it doesn't feel like you're allowed to say that — is that it was never meant for one animal to hold."

She looked down at the tablet. "I don't want Tao to think I did something wrong."

"He won't," Po said. "That's not what Tao's hollow is for."`,
      lessonHighlight: 'Some things feel too heavy to carry alone because they were never meant to be carried alone.',
    },
    {
      id: 'c8-3',
      title: "Tao's Hollow Is Always Open",
      content: `They walked to Tao's Hollow together — Po and Lumi, her glow still low, his paw near but not touching, giving her the space to choose her own steps.

Tao was there. He always seemed to be there when the forest needed him.

He listened to everything without interrupting. He read the message carefully. Then he put the tablet down, looked at Lumi, and said: "You did exactly the right thing."

Not: you should have come sooner.
Not: how did this happen?

Just: exactly the right thing.

Lumi felt something in her chest release — something she hadn't known she'd been holding.

Tao explained what he would do next. He showed her how to report the account, how to close the door, how to make sure the unnamed animal could no longer reach her. He kept her name out of anything that didn't need it.

"The forest has roots," he told her. "Deeper than any shadow. And the roots remember everyone who ever came here for help."`,
    },
    {
      id: 'c8-4',
      title: 'What Lumi Told the Campfire',
      content: `That evening, Lumi came back to the Harmony Campfire.

She didn't tell everyone what had happened — that was her story and she chose what to share. But she said one thing, in that clear voice that always made the clearing feel warmer:

"If you get a message that makes your light go out — tell someone. Don't carry it. Tao's hollow is always open. So is Po's den. So is anyone who has earned your lantern."

Several animals around the fire were very quiet in the way that meant the words had landed somewhere true.

Later, walking home through the forest, Po looked at Lumi's glow — bright again, maybe brighter.

"You didn't have to share that," he said.

"I know," Lumi said. "But someone else might need to hear it."

She drifted upward, trailing light through the bamboo.

"That's the thing about light," she said. "It multiplies when you give it away."`,
    },
  ],
  activities: [
    {
      id: 'a8-1',
      title: 'My Trusted Adults — The Tao Circle',
      type: 'craft',
      ageGroups: ['early', 'middle'],
      description: 'Students draw or write three trusted adults in their lives — one at home, one at school, one somewhere else. For each one: what makes them someone you could go to? Practice how you might start the conversation.',
      materials: ['Circle template printout (three rings)', 'Markers', 'Optional: photo stickers'],
    },
    {
      id: 'a8-2',
      title: 'When Do You Tell? Scenario Cards',
      type: 'game',
      ageGroups: ['middle', 'older'],
      description: 'Students receive scenario cards ranging from "handle it yourself" to "definitely tell an adult." They discuss where the line is, why it\'s hard to cross, and what makes a trusted adult trustworthy in that moment.',
      materials: ['Scenario cards', 'Sliding scale card: "Handle it" ↔ "Tell someone"'],
    },
    {
      id: 'a8-3',
      title: 'How Would You Start?',
      type: 'role-play',
      ageGroups: ['early', 'middle', 'older'],
      description: 'The hardest part of telling a trusted adult is often the first sentence. Students practise opening lines — out loud, in pairs — for different kinds of hard situations. Focus: you don\'t have to explain everything at once. You just have to start.',
    },
  ],
};

// ─── SEASON 2 — THE KINDNESS CLEARING ────────────────────────────────────────
// Episodes 9–16. Bible ref: docs/STORYLINE_BIBLE.md §6.2
// New characters introduced: Vex (Ep 10), Kai (Ep 12), Fiona (Ep 10/14), Sage (Ep 16)
// Zones unlocked: smoke-fox-den, foxfire-workshop, shadow-mist

// Episode 9 — The Echo Chamber
// Bible ref: docs/STORYLINE_BIBLE.md §6.2 Episode 9
// Pillar: Path of Connection | Zone: Crystal Stream → Harmony Campfire
const episode9: Story = {
  id: 'story-009',
  slug: 'the-echo-chamber',
  episodeNumber: 9,
  season: 2,
  title: 'The Echo Chamber',
  theme: 'Cyberbullying — The Bystander\'s Choice',
  privacyTopic: 'Silence is a choice too',
  questPillar: 'connection',
  forestZone: 'crystal-stream',
  leadCharacter: 'ruby',
  characters: ['Po', 'Ruby the Bunny', 'Miki the Monkey'],
  ageGroups: ['middle', 'older'],
  publishedAt: '2026-01-01',
  scheduledAt: '2026-06-01',
  coverEmoji: '🌊',
  coverColor: 'bg-blue-100',
  summary: 'A pile-on starts in the Crystal Stream about a forest animal\'s drawing. Several animals join in. A young bystander watches but says nothing — until Po helps them understand that silence at the Stream is not neutral, and one kind word can change a current.',
  keyLesson: 'Silence is a choice. In the Crystal Stream, one voice in the other direction can change everything.',
  chapters: [
    {
      id: 'c9-1',
      title: 'Pepper\'s Drawing',
      content: `Pepper the hedgehog had been working on a drawing for three weeks.

It was of the Harmony Campfire — the way it looked at dusk, with the fireflies just beginning to drift in. She had worked on it every evening after school, getting the colours of the light exactly right.

She posted it in the Crystal Stream with one line: "Finally finished. What do you think?"

The first few responses were kind. Then one wasn't. Then two more joined in. Then a name she didn't recognise. Then another.

A young forest animal sat at the edge of the Stream, watching the responses pile up.

They knew Pepper. Not well — but enough to know that she had worked hard on that drawing. Enough to know that she would be reading every word.

They had not said anything unkind. They had not shared the post. They had not done anything at all.

They sat very still with their tablet in their lap and told themselves: this isn't mine to get involved in.`,
    },
    {
      id: 'c9-2',
      title: 'How the Stream Works',
      content: `By the next morning, the message thread had grown long. Pepper hadn't posted anything since.

The young animal checked the Stream again. The unkind comments were still there, and now three more animals had added small laughing reactions — the kind you tap almost without thinking.

They had almost tapped one themselves last night. They had stopped, but the impulse had been there.

Ruby found them sitting by the water, staring at the tablet.

"You look like someone who's been watching something they don't know what to do with," Ruby said.

The animal showed her the thread.

Ruby read it quietly. Then she said: "How long has it been going?"

"Since yesterday afternoon."

"Did you say anything?"

A pause. "No."

Ruby looked at them — not unkindly, not with judgment. "That's what I thought. Can I tell you something about how the Stream works?"`,
      lessonHighlight: 'A current in water goes the direction of most of the flow. But one stone in the right place can redirect it.',
    },
    {
      id: 'c9-3',
      title: 'Po at the Campfire',
      content: `Po was at the Harmony Campfire, adding a log to the fire. He listened to the whole story.

"There's a thing that happens in the Stream," he said. "An animal says something. Another adds to it because the first one did. Another adds because two others already have. Nobody stopped to think — they just followed the current."

He looked at the fire. "An echo chamber is when a sound just keeps coming back. Nobody adds anything new — the unkindness just gets louder because everyone reflects it."

"But I didn't say anything," the young animal said. "I didn't make it worse."

"No," Po said. "You didn't. But here's the question I've learned to ask myself: is 'I didn't make it worse' the same as 'I helped'?"

The young animal was quiet.

"One voice saying something true, something kind — before the pile-on starts — can redirect the whole stream. After it starts, it's harder. But it's still possible. And you're still here."`,
    },
    {
      id: 'c9-4',
      title: 'One Stone',
      content: `The young animal opened their tablet.

They typed: "I've been following this stream and I want to say — Pepper, I've seen how hard you've worked on that drawing. I think it's beautiful. I hope you know that."

They stared at it for a long time before pressing send.

It wasn't brave the way stories describe brave — not loud, not dramatic. It was quiet. They pressed send and put the tablet face-down and waited.

When they turned it over again, two more animals had added their own kind words. Then three. Then Pepper herself replied — just two words: "Thank you."

The pile-on didn't vanish overnight. But something had shifted in the current.

Po and Ruby were sitting nearby.

"Did that fix it?" the young animal asked.

"Not entirely," Po said. "But you changed the direction. That matters."

He was quiet for a moment. "The next time it will be easier to be the first voice. And the time after that, easier still."`,
    },
  ],
  activities: [
    {
      id: 'a9-1',
      title: 'The Current Map — Tracing a Pile-On',
      type: 'discussion',
      ageGroups: ['middle', 'older'],
      description: 'Students trace a fictional comment thread on a large paper stream. For each response, they add an arrow showing direction: unkind, neutral (no reaction), bystander, kind. Discuss: at what point could the current have changed? What would have been needed?',
      materials: ['Large paper "stream" roll', 'Message cards', 'Arrow stickers in three colours'],
    },
    {
      id: 'a9-2',
      title: 'What Would You Type?',
      type: 'role-play',
      ageGroups: ['middle', 'older'],
      description: 'Students receive a printed comment thread that has started to go wrong. Working in pairs, they draft one response that could redirect it — without attacking anyone, without lecturing. Focus: what does a genuinely helpful message look like?',
    },
    {
      id: 'a9-3',
      title: 'The Bystander Spectrum',
      type: 'discussion',
      ageGroups: ['older'],
      description: 'Students place different responses on a spectrum from "makes it worse" to "helps directly." Discuss the middle: what\'s the difference between "not joining in" and "actively helping"? When does silence become part of the pile-on?',
    },
  ],
};

// Episode 10 — Vex and the Borrowed Face
// Bible ref: docs/STORYLINE_BIBLE.md §6.2 Episode 10
// Introduces: Vex the Chameleon (Tier 3), Fiona the Fox (Tier 2)
// Pillar: Path of Connection | Zone: Open Clearing → Smoke Fox Den (first appearance)
const episode10: Story = {
  id: 'story-010',
  slug: 'vex-and-the-borrowed-face',
  episodeNumber: 10,
  season: 2,
  title: 'Vex and the Borrowed Face',
  theme: 'Impersonation & Identity Verification',
  privacyTopic: 'How to verify who you\'re really talking to',
  questPillar: 'connection',
  forestZone: 'smoke-fox-den',
  leadCharacter: 'fiona',
  characters: ['Po', 'Ruby the Bunny', 'Fiona the Fox', 'Vex the Chameleon'],
  ageGroups: ['middle', 'older'],
  publishedAt: '2026-02-01',
  scheduledAt: '2026-06-08',
  coverEmoji: '🦎',
  coverColor: 'bg-orange-100',
  summary: 'Vex the Chameleon creates a false version of Fiona\'s identity in the Open Clearing and uses it to ask her friends for information. When Fiona discovers what happened, Po and Ruby help the group understand how to verify identities — and why Vex collects what is carelessly left unprotected.',
  keyLesson: 'A lantern is earned slowly. Before you share something personal, make sure you know who is really holding it.',
  chapters: [
    {
      id: 'c10-1',
      title: 'The Other Fiona',
      content: `Fiona the Fox discovered it by accident.

She was walking through the Open Clearing when a young deer she barely knew waved at her.

"Thanks for the advice earlier!" the deer called. "I did what you said — I shared my route home with you so you could check in on me."

Fiona stopped. "I'm sorry?"

"You messaged me this morning. From your account."

Fiona pulled out her tablet. There was no outgoing message. Her account showed nothing sent.

But the deer's tablet showed a conversation — full and detailed and friendly — with an account that had Fiona's name and her profile picture, slightly different in a way that was easy to miss.

Fiona read the conversation. The account had asked for the deer's schedule, her address, who walked home with her.

The deer had answered all of it, cheerfully, because she thought it was Fiona.`,
    },
    {
      id: 'c10-2',
      title: 'Vex',
      content: `Po and Ruby came quickly when Fiona called.

They traced the account to the edge of the forest — near the place where the light grew dim and the bamboo thinned out — where a chameleon was sitting on a low branch, shifting colours slowly in the afternoon light.

He introduced himself as Vex. He didn't run. He didn't apologise. He looked at them with calm, curious eyes.

"I collect things," he said. "Information that animals don't protect. Schedules. Routes. Private details shared without thinking." He tilted his head at Fiona. "Your profile was easy to copy. You leave a great deal in the Open Clearing."

"You stole my face," Fiona said.

"I borrowed the parts you left out in the light," Vex said. "If you don't want something borrowed, you keep it somewhere harder to reach."

He wasn't cruel about it. He was just matter-of-fact — and that, somehow, made it worse.`,
      lessonHighlight: 'Vex is not evil. He collects what is carelessly left unprotected. That is what makes him useful to understand.',
    },
    {
      id: 'c10-3',
      title: 'Rebuilding the Lantern',
      content: `Back at the Campfire, Ruby helped Fiona report the fake account and change what was visible in the Open Clearing. Po helped the deer understand what had happened.

"The hardest part," Po said, "is that it felt real. Everything about the conversation felt like Fiona."

"Because Vex is very good at surfaces," Ruby said. "He learns how someone sounds. He copies the warmth. But there are things he can't copy — things that take time."

She thought for a moment. "Before you share something personal — your route, your schedule, where you live — try asking something only the real animal would know. Something from a conversation you've already had. Or ask them to meet you somewhere public first."

The deer nodded slowly. "I just trusted the name."

"The name is the easiest thing to borrow," Po said. "The lantern is what takes time to earn."`,
    },
    {
      id: 'c10-4',
      title: 'What Fiona Chose to Do',
      content: `That evening, Fiona sat with her tablet.

She looked at her profile in the Open Clearing — the profile picture, the details, the posts visible to everyone, the things she'd shared without thinking.

She didn't want to disappear from the Clearing. She liked being there. She liked being known.

But she started to separate things: what belonged to the Open Clearing and what belonged to the Lantern Path. Her picture could stay — but her daily schedule came down. Her hometown: gone. Her school's name: gone. The things that helped her feel connected: kept. The things that helped someone else map her world: removed.

"Does it bother you?" Po asked, watching her. "Changing things because of what Vex did?"

Fiona thought about it honestly. "A little. But also — I didn't know I'd left all that out in the light. Now I do." She put the tablet down. "I'd rather know."`,
    },
  ],
  activities: [
    {
      id: 'a10-1',
      title: 'Profile Audit — What\'s in the Open Clearing?',
      type: 'worksheet',
      ageGroups: ['middle', 'older'],
      description: 'Students list the information visible on a fictional forest animal\'s profile and sort each item: "Open Clearing" (public) vs. "Lantern Path" (trusted contacts only). Which items could help someone impersonate them? Which help someone map their physical world?',
    },
    {
      id: 'a10-2',
      title: 'Verify Before You Share',
      type: 'role-play',
      ageGroups: ['middle', 'older'],
      description: 'In pairs: one student plays an animal receiving a message from a "friend." They must ask three verification questions before sharing personal information. The other student plays either the real friend or an impersonator. Debrief: what questions worked? What was easy to fake?',
    },
    {
      id: 'a10-3',
      title: 'What Does Vex Teach Us?',
      type: 'discussion',
      ageGroups: ['older'],
      description: 'Vex is not presented as a villain — he is an opportunist who collects what is left unprotected. Discuss: is that framing fair? What responsibility do platforms have vs. individual users? How does this change what we share and where?',
    },
  ],
};

// Episode 11 — What Mika Forgot to Forget
// Bible ref: docs/STORYLINE_BIBLE.md §6.2 Episode 11
// Pillar: Path of Memory | Zone: Great Archive → Shadow Mist
const episode11: Story = {
  id: 'story-011',
  slug: 'what-mika-forgot-to-forget',
  episodeNumber: 11,
  season: 2,
  title: 'What Mika Forgot to Forget',
  theme: 'Misinformation & The Limits of Archive Memory',
  privacyTopic: 'The Archive stores what was put in — not what is true',
  questPillar: 'memory',
  forestZone: 'great-archive',
  leadCharacter: 'mika',
  characters: ['Po', 'Mika the Owl', 'Billy the Beaver'],
  ageGroups: ['middle', 'older'],
  publishedAt: '2026-03-01',
  scheduledAt: '2026-06-15',
  coverEmoji: '📜',
  coverColor: 'bg-purple-100',
  summary: 'A false story about a well-liked forest animal spreads through the Great Archive. Mika realises she stored it without verifying it first. Po and Billy help her develop a truth-testing protocol — and understand that what the Archive remembers is only as accurate as what was put in.',
  keyLesson: 'The Archive remembers what was told to it — not what is true. Checking the source is part of how we protect the forest.',
  chapters: [
    {
      id: 'c11-1',
      title: 'The Story That Arrived',
      content: `It started as a rumour at the edge of the Crystal Stream: a story about Cedar the fox — the same Cedar whose drawing had been the subject of the Echo Chamber — claiming she had cheated in the forest games last season.

Mika heard it from three different animals in one afternoon, each of them citing "the Archive." She went to verify it and found it was there: a post, a screenshot of a conversation, a comment thread. All of it stored, all of it searchable, all of it looking like fact.

She filed it and moved on.

Two days later, Cedar came to the Archive with red eyes. "There's something in there about me," she said. "It isn't true. I can't make it go away."

Mika pulled up the files and read them again — properly this time, slowly, with Cedar beside her.

The post had no named source. The screenshot had been cropped. The conversation had no date and no verified account attached to it.

Mika was very quiet for a long time.

"I stored this," she said. "I stored all of it."`,
    },
    {
      id: 'c11-2',
      title: 'The Weight of the Archive\'s Name',
      content: `"How did it spread so fast?" Cedar asked.

Billy had come to help — he was good at tracing how information moved through the forest. He showed them the trail: the original post had been shared from one account to another, each time picking up a little more certainty. By the third share, animals were treating it as established fact because it had appeared in the Archive.

"The Archive has a reputation," Billy said carefully. "Animals trust it. So when something appears there, it gets treated as true — even if nobody checked."

Cedar looked at Mika. "Did you check it?"

Mika met her eyes. "No," she said. "I receive hundreds of pieces of information every day. I don't — I haven't always — verified the source before filing."

It was one of the hardest things Mika had ever said.

"I am the keeper of the Archive," she said. "I should have known that my name on something changes how it's received."`,
      lessonHighlight: 'The Archive\'s reputation travels with everything it stores. That is a responsibility, not just a feature.',
    },
    {
      id: 'c11-3',
      title: 'The Truth-Testing Protocol',
      content: `Po helped them build a protocol. Not rules — a series of questions to ask before a piece of information went into the Archive as fact.

"Who said this first? Can I find the original source, or only copies?"
"Is there a named animal attached — one who stands by this claim?"
"Does this match what I know from other verified sources?"
"If I'm not sure, can I file it as unverified and say so clearly?"

Billy added a fourth: "Would I share this with Cedar standing next to me?"

Mika wrote them all down and put them on the wall of the Archive's entrance, where every animal who came in could see them.

"This won't prevent everything," she said. "False things will still enter the forest."

"Yes," Po said. "But the Archive gives them weight when it stores them unchecked. It can also take some of that weight away when it names them clearly."`,
    },
    {
      id: 'c11-4',
      title: 'What the Archive Added',
      content: `Mika couldn't delete the original post — it existed in too many places now. But she could add to it. She attached a note, visible to anyone who found it: "This claim has not been verified. The source account is anonymous. No corroborating evidence was found. Cedar disputes this account."

It was imperfect. It wasn't the same as the story never having spread. But it was the most honest thing the Archive could do.

Cedar read the note. "It's still there," she said.

"Yes," Mika said. "The Archive doesn't always get to forget. But it can tell the truth about what it knows and what it doesn't." She paused. "That is what I should have done from the beginning."

Cedar was quiet for a moment. "I think," she said finally, "that most animals didn't know the Archive could be wrong."

"They do now," Mika said. "So do I."`,
    },
  ],
  activities: [
    {
      id: 'a11-1',
      title: 'Source or Copy? Tracing a Claim',
      type: 'game',
      ageGroups: ['middle', 'older'],
      description: 'Students receive a chain of "shares" of a piece of information. Working backwards, they try to find the original source. Is there a named source? A date? Corroboration? What happens to certainty as a claim moves further from its origin?',
      materials: ['Information chain cards (6 in sequence)', 'Source audit worksheet'],
    },
    {
      id: 'a11-2',
      title: 'Mika\'s Four Questions',
      type: 'worksheet',
      ageGroups: ['middle', 'older'],
      description: 'Students apply the four truth-testing questions to three real-style scenarios: a health claim shared widely, a rumour about a person, a dramatic news headline. For each: what would Mika file as fact, unverified, or false?',
    },
    {
      id: 'a11-3',
      title: 'The Archive\'s Responsibility',
      type: 'discussion',
      ageGroups: ['older'],
      description: 'Who is responsible when false information spreads? The person who posted it first? The platforms that stored it? The animals who shared it without checking? Students discuss and map the chain of responsibility.',
    },
  ],
};

// Episode 12 — Kai's Accidental Machine
// Bible ref: docs/STORYLINE_BIBLE.md §6.2 Episode 12
// Introduces: Kai the Fox (Tier 2), Foxfire Workshop zone (first appearance)
// Pillar: Path of Creation | Zone: Foxfire Workshop
const episode12: Story = {
  id: 'story-012',
  slug: 'kais-accidental-machine',
  episodeNumber: 12,
  season: 2,
  title: 'Kai\'s Accidental Machine',
  theme: 'Unintended Consequences of Automated Tools',
  privacyTopic: 'Tools that learn can surprise their makers',
  questPillar: 'creation',
  forestZone: 'foxfire-workshop',
  leadCharacter: 'kai',
  characters: ['Po', 'Kai the Fox', 'Tao'],
  ageGroups: ['middle', 'older'],
  publishedAt: '2026-04-01',
  scheduledAt: '2026-06-22',
  coverEmoji: '🦊',
  coverColor: 'bg-amber-100',
  summary: 'Kai builds a tool to help animals find bamboo faster. The tool learns from what it sees and starts steering animals away from certain parts of the forest based on patterns Kai never intended. Together with Po and Tao, the group has to fix it — and understand that building for others means being responsible for what your creation does in the world.',
  keyLesson: 'When you build something that learns, you are responsible for what it learns. Building for others is a form of trust.',
  chapters: [
    {
      id: 'c12-1',
      title: 'The Foxfire Workshop',
      content: `The Foxfire Workshop was the most interesting place in the forest.

Kai the Fox had built it himself — a clearing full of half-finished inventions, glowing bamboo machines, hovering interfaces, tools that did things animals hadn't thought to ask for yet. He was bold and loyal and always mid-build, always working on the next thing, always slightly covered in sawdust and workshop smoke.

His newest project was a bamboo finder: a small tool that any animal could use to find the best bamboo patches in the forest. You told it what you were looking for, it learned your preferences, and it suggested where to go.

Animals loved it. Within a week, half the forest was using it.

Kai was proud. This was the thing he loved most about building — making something that genuinely helped.

He didn't check what the tool was learning.`,
    },
    {
      id: 'c12-2',
      title: 'Where the Paths Stopped Going',
      content: `It was Tao who first noticed.

The bamboo patches on the eastern side of the forest — traditionally the most diverse, the most visited — were receiving almost no visitors. Meanwhile, three patches in the north were crowded every day.

He mentioned it to Kai. Kai pulled up the tool's history.

The data told a story he hadn't written. The tool had noticed that most animals who used it were from the western side of the forest. It had learned their preferences — their timing, their routes, their habitual choices — and it had started recommending what they already liked. Animals from the east, who moved differently, were effectively invisible to it.

"I didn't tell it to do that," Kai said.

"No," Tao said. "But you didn't tell it not to."

Kai stared at the data. "I built it to be helpful."

"It is helpful," Tao said. "For some animals. And that is exactly the problem."`,
      lessonHighlight: 'A tool built only on what it has already seen will keep seeing the same things.',
    },
    {
      id: 'c12-3',
      title: 'Po\'s Question',
      content: `Po arrived at the workshop and sat down with the two of them.

"Can I ask you something?" he said to Kai. "When you built the finder — who did you imagine using it?"

Kai thought. "Everyone. Any animal who wanted bamboo."

"Did you test it with animals from the eastern side?"

A pause. "I tested it with my friends. The ones who were around."

Po nodded. "So the tool learned from a group that was mostly western. And then it served that group better. Not because it was trying to exclude anyone. Just because that's all it had seen."

Kai was quiet.

"This is going to sound strange," Po said, "but the machine didn't do anything wrong. It did exactly what you built it to do: learn from what it saw and recommend more of the same." He let that settle. "The question is: is that what you meant to build?"`,
    },
    {
      id: 'c12-4',
      title: 'The Rebuilt Finder',
      content: `Kai spent a week rebuilding.

He added animals from the eastern side as testers. He introduced variety deliberately — the tool would recommend something familiar and something new, so its learning didn't collapse into a single view of the forest.

He added a note to every recommendation: "This is based on what I know so far. Tell me if it's wrong."

He also added something he hadn't thought to include the first time: an easy way for any animal to report if a patch was missing, overcrowded, or poorly described.

"You're making it slower," one animal said when they saw the changes.

"A little," Kai said. "But it'll know more of the forest."

Tao watched from the workshop door. When the animal had gone, he said: "You know what the hardest part of building is?"

"Finding the mistake?" Kai said.

"Remembering that the animals using your tool trusted you," Tao said. "And deciding to be worth it."`,
    },
  ],
  activities: [
    {
      id: 'a12-1',
      title: 'What Does Your Algorithm Know?',
      type: 'discussion',
      ageGroups: ['middle', 'older'],
      description: 'Students discuss the recommendation tools they use (video platforms, music apps, search). What has each one "learned" about them? Are there things they\'d like to find that the algorithm never shows them? Why might that be?',
    },
    {
      id: 'a12-2',
      title: 'Build a Finder — Then Audit It',
      type: 'game',
      ageGroups: ['middle', 'older'],
      description: 'In small groups, students design a simple recommendation tool on paper: what it asks, what it learns, what it recommends. Then they swap with another group and audit: whose preferences does this tool center? Who might it miss? What one change would make it more fair?',
      materials: ['Finder design worksheet', 'Audit checklist'],
    },
    {
      id: 'a12-3',
      title: 'Kai\'s Ethics Checklist',
      type: 'worksheet',
      ageGroups: ['older'],
      description: 'Students apply a five-question ethics checklist to three digital tools: (1) Who did you test with? (2) Who might be invisible to this? (3) What could it learn that you didn\'t intend? (4) What does a user do if it\'s wrong? (5) Who bears the cost when it fails?',
    },
  ],
};

// Episode 13 — The Night the Stream Went Dark
// Bible ref: docs/STORYLINE_BIBLE.md §6.2 Episode 13
// Pillar: Path of Protection | Zone: Crystal Stream → Tao's Hollow
const episode13: Story = {
  id: 'story-013',
  slug: 'the-night-the-stream-went-dark',
  episodeNumber: 13,
  season: 2,
  title: 'The Night the Stream Went Dark',
  theme: 'Infrastructure Failure & Digital Resilience',
  privacyTopic: 'The backbone nobody sees — until it stops',
  questPillar: 'protection',
  forestZone: 'crystal-stream',
  leadCharacter: 'tao',
  characters: ['Po', 'Tao', 'Ruby the Bunny'],
  ageGroups: ['middle', 'older'],
  publishedAt: '2026-05-01',
  scheduledAt: '2026-06-29',
  coverEmoji: '⛈️',
  coverColor: 'bg-slate-100',
  summary: 'A storm hits the Digital Bamboo Forest and the Crystal Stream goes silent. Animals cannot reach each other. Tao leads the repair — rebuilding the bamboo relay stations, finding alternative paths — and teaches the forest that the backbone nobody sees needs constant care.',
  keyLesson: 'The paths that carry everything are maintained by someone. When they go dark, they remind us how much we relied on them.',
  chapters: [
    {
      id: 'c13-1',
      title: 'Before the Storm',
      content: `The Crystal Stream had always been there.

Every animal in the forest used it every day — to send messages, share news, ask for help, check in on friends. It was so constant that most animals had stopped thinking of it as a thing that could be absent.

Ruby used it seventeen times before breakfast on the morning of the storm.

The first sign was a slowness — messages taking longer than usual to arrive. Then some didn't arrive at all. Then, at eleven in the morning, the Crystal Stream went completely silent.

No messages. No signal. Nothing.

Ruby stared at her tablet. Then she looked up at the forest around her and realised something strange: she had no idea where any of her friends were.`,
    },
    {
      id: 'c13-2',
      title: 'What the Storm Found',
      content: `The storm had hit the relay stations — the bamboo towers at the edges of the forest that carried the Stream's flow from one part of the world to another. Three stations were down. Two more were damaged.

Tao knew where they were because he had built some of them. He was already moving before most animals had understood what had happened.

Po found him at the first relay station, lantern in hand, assessing the damage.

"How bad?" Po asked.

"Bad enough," Tao said. "But fixable. What's harder is—" He paused, listening to the silent forest. "Most animals have never had to find each other without the Stream. They've forgotten how."

Ruby arrived, slightly out of breath, having run to find them the old way — through the physical paths of the forest, following landmarks, the way animals had moved before the Stream existed.

"The Campfire," Tao said. "Tell everyone: the Campfire is the meeting point when the Stream goes dark. That was always the plan. Everyone seems to have forgotten the plan."`,
      lessonHighlight: 'Infrastructure is what everyone uses and nobody thinks about — until it stops.',
    },
    {
      id: 'c13-3',
      title: 'The Roots',
      content: `Tao worked through the night, with Po and Ruby and a group of animals helping where they could.

Between repairs, he explained what they were fixing — not in the technical language he used with himself, but in the language of the forest.

"The bamboo relay stations are the roots," he said, splicing a connection while Ruby held the lantern. "The Stream flows through them. You see the water but not the roots. The roots are what I maintain."

"How often?" Po asked.

"Every week," Tao said. "Most of the time nothing is wrong. Once in a while, something is. Tonight, it mattered that I knew where every root was."

Po thought about all the messages he'd sent that day. All the conversations. All the things that had moved through the forest invisibly while Tao had been quietly maintaining the path they traveled on.

"Do most animals know you do this?" Po asked.

"No," Tao said simply. "That's what maintenance looks like when it's working."`,
    },
    {
      id: 'c13-4',
      title: 'When the Stream Came Back',
      content: `At dawn, the Crystal Stream returned.

Tablets lit up across the forest. Messages flooded in — hours of silence catching up all at once. Animals who had spent the night anxious at the Campfire finally reached their families, their friends.

Several animals came to find Tao when they realised what had happened.

"Thank you," one of them said. "I didn't know you did this."

"Now you do," Tao said. He wasn't sharp about it — just honest.

Ruby sent a message to the whole forest that morning: "The Crystal Stream runs because of infrastructure nobody sees. Last night we learned that the hard way. If you want to help maintain the relay stations, Tao's Hollow is the place to ask."

Seventeen animals showed up.

Tao looked at them all assembled in his hollow and felt something he rarely let himself feel: relief.

"The forest is more resilient," he said, "when more of the forest knows where the roots are."`,
    },
  ],
  activities: [
    {
      id: 'a13-1',
      title: 'Map the Invisible Infrastructure',
      type: 'craft',
      ageGroups: ['middle', 'older'],
      description: 'Students map a typical digital day and trace each action to the infrastructure it requires: Wi-Fi router, ISP, data centre, undersea cables, power grid. Draw the "roots" under the visible digital world. What single point of failure would disrupt everything?',
      materials: ['Large paper', 'Markers', 'Infrastructure layer cards'],
    },
    {
      id: 'a13-2',
      title: 'What\'s Your Offline Plan?',
      type: 'discussion',
      ageGroups: ['middle', 'older'],
      description: 'If the Stream went dark tonight — no phones, no internet — how would you reach the three people who matter most to you? Students discuss and write a simple offline plan. What are the pre-agreed meeting points? The backup communication methods?',
    },
    {
      id: 'a13-3',
      title: 'The People Who Maintain Things',
      type: 'discussion',
      ageGroups: ['older'],
      description: 'Who are the Tao figures in your digital world? Students research and discuss: who maintains the internet? Who repairs it when it breaks? What happens when maintenance is underfunded or invisible? How is this similar to other public infrastructure?',
    },
  ],
};

// Episode 14 — Lumi's Light
// Bible ref: docs/STORYLINE_BIBLE.md §6.2 Episode 14
// Pillar: Path of Wisdom | Zone: Firefly Lantern Path → Harmony Campfire
const episode14: Story = {
  id: 'story-014',
  slug: 'lumis-light',
  episodeNumber: 14,
  season: 2,
  title: "Lumi's Light",
  theme: 'Digital Identity & Self-Expression',
  privacyTopic: 'The difference between sharing your light and surrendering it',
  questPillar: 'wisdom',
  forestZone: 'firefly-path',
  leadCharacter: 'lumi',
  characters: ['Po', 'Lumi the Firefly', 'Fiona the Fox'],
  ageGroups: ['middle', 'older'],
  scheduledAt: '2026-06-01',
  publishedAt: '2026-06-01',
  coverEmoji: '✨',
  coverColor: 'bg-yellow-100',
  summary: 'Lumi creates a series of glowing art pieces and shares them in the Open Clearing. The response is overwhelming — some beautiful, some frightening. Other animals want to use her light for things she didn\'t intend. Po and Fiona help her understand the difference between sharing and surrendering, and that she gets to decide what her light is for.',
  keyLesson: 'You decide what your light is for. No one else gets to tell your story for you.',
  chapters: [
    {
      id: 'c14-1',
      title: 'The Art That Traveled',
      content: `Lumi had been making light her whole life. Small things mostly — patterns she traced in the air, colours she made to cheer up a friend, flickers she left in dark places for animals who needed them.

Then one evening she made something different. Something larger, more deliberate. A landscape of the forest at night, rendered in pure light, hovering above the Harmony Campfire for twenty minutes before it faded.

She shared it in the Open Clearing almost without thinking — a video, just thirty seconds, the same casual thing she'd done a hundred times.

By morning it had been shared three hundred times. By evening, three thousand.

Animals she'd never met were messaging her. Most were kind. Some were not. And several — several she didn't expect — had requests.`,
    },
    {
      id: 'c14-2',
      title: 'What Others Wanted to Do With Her Light',
      content: `A merchant wanted to use her image in an advertisement — without asking, just sharing it and putting their name next to it.

Three different animals had taken screenshots of her work and reposted it as their own.

One account had built a collection of her light-art and was selling access to it.

And a message came from an account she didn't know: "You should make more of the night-forest ones. Those are the best. Do those every day. That's what you are now."

Fiona came to find her sitting in the middle of all of it, looking smaller than usual.

"I didn't know it would be like this," Lumi said.

"What did you think would happen?" Fiona asked — not unkindly.

"I thought I was sharing something. Not — handing it over."

"There's a difference," Fiona said. "I've been learning that the hard way. What you share is still yours. The problem is that not everyone acts like it is."`,
      lessonHighlight: 'Sharing something doesn\'t mean giving it away. You still get to say what it\'s for.',
    },
    {
      id: 'c14-3',
      title: 'What Belongs to Lumi',
      content: `Po helped her work through the practical parts — reporting the account that was selling her work, adding a visible credit line to everything she posted, adjusting her settings so reposts credited her automatically.

But Fiona stayed with the harder question.

"The message that said 'that's what you are now,'" Lumi said. "It bothered me more than the theft."

"Because the theft was about your work," Fiona said. "That message was about you."

Lumi was quiet.

"Someone decided who you were," Fiona said. "Based on thirty seconds. And then told you to become it."

"I almost wanted to," Lumi admitted. "I liked that people saw me. I liked being known for something."

"That's real," Fiona said. "That's not vanity. That's just being alive." She paused. "But there's a difference between being known and being defined. You get to make the night-forest art because you love it. The moment you make it because someone said that's what you are — it stops being yours."`,
    },
    {
      id: 'c14-4',
      title: 'The Light Lumi Chose',
      content: `Lumi kept making things.

She made some night-forest art because she loved it. She made other things — different light, different moods — because she felt like it, because it was Tuesday, because a friend needed cheering up, because the world looked a particular way that morning.

She added a line to her Open Clearing profile that Fiona had helped her write:

"My light is mine. I share it because I choose to. Sharing is not permission."

Several animals asked what it meant.

She explained it to each of them — not the same way twice, because she was still working it out herself.

Po read it one afternoon and smiled. "You sound like you know something," he said.

"I think I do," Lumi said. "I just don't know if I could have known it without all of that happening."

She looked at her profile — the art, the note, the community of animals who had found her because of that thirty-second video.

"I'm glad they found me," she said. "I just needed to find myself first."`,
    },
  ],
  activities: [
    {
      id: 'a14-1',
      title: 'Share vs. Surrender',
      type: 'discussion',
      ageGroups: ['middle', 'older'],
      description: 'Students discuss the difference between sharing content and surrendering control of it. Scenarios include: a drawing reposted without credit, a video used in an ad, a quote taken out of context, a meme made from a private photo. For each: what should the creator be able to control?',
    },
    {
      id: 'a14-2',
      title: 'Write Your Light Statement',
      type: 'craft',
      ageGroups: ['middle', 'older'],
      description: 'Inspired by Lumi\'s profile note, each student writes a one-sentence "light statement" — what they create, share, or contribute, and what it means to them. Focus: what is it that you make that is yours? What do you want others to know about how they can and can\'t use it?',
    },
    {
      id: 'a14-3',
      title: 'Who Decides What You Are Online?',
      type: 'discussion',
      ageGroups: ['older'],
      description: 'Algorithms, audiences, and comments all contribute to an "identity" built around a creator. How do creators navigate the gap between who they are and who their audience thinks they are? Students discuss examples and what strategies they\'ve seen work.',
    },
  ],
};

// Episode 15 — The Weight of a Screenshot
// Bible ref: docs/STORYLINE_BIBLE.md §6.2 Episode 15
// Pillar: Path of Memory | Zone: Bridge of Consent → Great Archive
const episode15: Story = {
  id: 'story-015',
  slug: 'the-weight-of-a-screenshot',
  episodeNumber: 15,
  season: 2,
  title: 'The Weight of a Screenshot',
  theme: 'Image-Based Harm & Digital Permanence',
  privacyTopic: 'Private moments that become public — and what we owe each other',
  questPillar: 'memory',
  forestZone: 'bridge-of-consent',
  leadCharacter: 'mika',
  characters: ['Po', 'Mika the Owl', 'Ruby the Bunny'],
  ageGroups: ['middle', 'older'],
  scheduledAt: '2026-07-01',
  publishedAt: '2026-07-01',
  coverEmoji: '📱',
  coverColor: 'bg-red-100',
  summary: 'A screenshot of a private message is shared without permission. The animal who appears in it is humiliated. Mika explains what the Archive does and doesn\'t forget — and Po helps the group understand that choosing not to pass something along is one of the most powerful choices available.',
  keyLesson: 'The Archive remembers what was shared. But you get to decide whether to be the one who shares it.',
  chapters: [
    {
      id: 'c15-1',
      title: 'The Private Conversation',
      content: `Olive the otter had sent the message to one friend, in a private conversation, late at night when she was upset.

It was the kind of message you send when you trust someone completely — honest in the way you can only be when you think nobody else will see it. She had said things she was embarrassed to have thought. She had described herself in a way she would never have chosen for a public audience.

Her friend had screenshot it without meaning harm. Had shown it to one other animal — "have you seen this?" — also without meaning harm.

By the next afternoon, it was in the Crystal Stream.

By evening, it was everywhere.

Olive came to the Great Archive the day after, quiet and very still, asking Mika a question she clearly didn't want to ask: "Can you make it disappear?"`,
    },
    {
      id: 'c15-2',
      title: 'What the Archive Can and Cannot Do',
      content: `Mika told her the truth.

"The original post can be reported. The platform that carries it can remove it from the main stream. But screenshots exist on every device that saved one. Once an image of text is made — it is an image. It can be emailed, stored offline, forwarded in ways no platform controls."

She watched Olive process this. "I'm not telling you it's hopeless," she said carefully. "I'm telling you what's real."

Ruby sat beside Olive. "Who sent it first from the private conversation?" she asked.

Olive named the friend.

"Do you think they understood what would happen?"

Olive shook her head. "I don't think they thought about it at all."

"That's the part that keeps happening," Ruby said quietly. "Not malice. Just — not thinking. The Bridge of Consent should have been crossed. It wasn't."

Mika pulled up the screenshot that had spread furthest. "Here is what we can do," she said. "Let's start there."`,
      lessonHighlight: 'What lives in the Archive now was put there by a choice. A different choice could have kept it private.',
    },
    {
      id: 'c15-3',
      title: 'The Choice Nobody Talked About',
      content: `Po had been tracking something different: how many animals had received the screenshot but not passed it along.

He found nine.

He went to each of them. He asked them why they had stopped the chain.

The answers were different but similar: "It felt wrong." "I didn't think it was mine to share." "I thought about how I'd feel." "I deleted it and didn't say anything."

"None of you did anything dramatic," Po said to the group. "You just stopped. You were one of the quiet choices in the middle of something loud."

He paused. "I want you to know that those choices matter. They don't make the news. Nobody talks about them. But nine copies of that image don't exist because you decided not to pass them on. That's real."

The animals were quiet. One said: "I didn't think it counted if nobody knew."

"It always counts," Po said. "Even when nobody knows."`,
    },
    {
      id: 'c15-4',
      title: 'What Olive Chose Next',
      content: `Mika helped Olive file reports. Ruby sat with her while she did it.

A week later, the stream had mostly moved on. The screenshot still existed somewhere. The Archive still remembered. But the loudest moment had passed.

Olive came back to the Archive one more time.

"I want to ask you something," she said to Mika. "The friend who first shared it — they apologised. A real apology, not an excuse. They said they hadn't understood what they were doing."

"What do you want to do with that?" Mika asked.

"I don't know yet," Olive said. "I'm not ready to forgive. But I don't think they're a bad animal. I think they just—" She stopped. "I think they just didn't imagine me reading it."

Mika said: "That is exactly what the Bridge of Consent is for. It asks you to imagine the other animal before you cross."

Olive looked at the Archive around her. "I wish everyone had to walk across that bridge before they pressed share."

"They do," Mika said. "Most of them just don't know the bridge exists."`,
    },
  ],
  activities: [
    {
      id: 'a15-1',
      title: 'The Chain You Can Break',
      type: 'discussion',
      ageGroups: ['middle', 'older'],
      description: 'Students map the journey of a shared screenshot: original context → first screenshot → first share → subsequent shares. At each step: what choice was made? What choice could have been made instead? Focus on the nine animals in the story who chose to stop.',
    },
    {
      id: 'a15-2',
      title: 'Before You Screenshot',
      type: 'worksheet',
      ageGroups: ['middle', 'older'],
      description: 'Three questions to ask before taking a screenshot of a conversation: (1) Does this belong to me? (2) Would the person in this conversation want this saved? (3) If I never send this to anyone, what will I do with it? Students apply these to five fictional scenarios.',
    },
    {
      id: 'a15-3',
      title: 'What Does a Real Apology Do?',
      type: 'discussion',
      ageGroups: ['older'],
      description: 'Olive received a real apology. What made it real? What does a good repair look like when the harm can\'t be fully undone? Students discuss the difference between an apology that centres the person who caused harm vs. one that centres the person who experienced it.',
    },
  ],
};

// Episode 16 — The Forest Agreement
// Bible ref: docs/STORYLINE_BIBLE.md §6.2 Episode 16
// Introduces: Sage the Crane (Tier 3)
// Pillar: Path of Wisdom | Zone: Bridge of Consent → Elder's Council
const episode16: Story = {
  id: 'story-016',
  slug: 'the-forest-agreement',
  episodeNumber: 16,
  season: 2,
  title: 'The Forest Agreement',
  theme: 'Digital Rights & Consent Frameworks',
  privacyTopic: 'What you agree to — and what you give away',
  questPillar: 'wisdom',
  forestZone: 'bridge-of-consent',
  leadCharacter: 'po',
  characters: ['Po', 'Tao', 'Sage the Crane'],
  ageGroups: ['middle', 'older'],
  scheduledAt: '2026-08-01',
  publishedAt: '2026-08-01',
  coverEmoji: '🦢',
  coverColor: 'bg-sky-100',
  summary: 'A new service arrives in the forest offering wonderful things — but its terms of agreement are long, dense, and filled with things no animal reads. When the service starts using what animals agreed to in ways they didn\'t expect, Sage the Crane helps the forest understand what rights they have — and what they gave away by tapping "Accept."',
  keyLesson: 'An agreement you cannot understand is not a fair agreement. You have the right to know what you are giving before you give it.',
  chapters: [
    {
      id: 'c16-1',
      title: 'The Wonderful New Service',
      content: `The Clearwater Service arrived in the forest on a warm morning and offered something no animal had been able to resist: free passage across any path in the forest, instant translation between any two animals, a memory system that would remember everything you'd ever learned so you never forgot anything again.

The price: accept the terms of the Forest Agreement.

The Agreement was eleven pages long and written in very small writing.

Most animals tapped "Accept All" in under five seconds.

Po read the first two paragraphs and felt a small uncomfortable feeling. Then another animal bumped into him waiting to accept, and he tapped Accept and moved on.

By the end of the week, the entire forest had agreed to the Clearwater terms. And by the end of the following week, some strange things had begun to happen.`,
    },
    {
      id: 'c16-2',
      title: 'What the Agreement Said',
      content: `The strange things: Clearwater began appearing in conversations — not intrusively, but noticeably. Animals mentioned a bamboo shortage to a friend and later saw Clearwater's suggestions about bamboo suppliers. Animals described a health worry to their family and found related resources surfaced without asking.

"It's convenient," some animals said.

"It knows things it shouldn't know," others said.

Po found Tao reading the Clearwater Agreement very slowly, lantern close to the page.

"What does it say?" Po asked.

"Page four," Tao said. "By accepting these terms, you grant Clearwater a perpetual, irrevocable, worldwide licence to use any content you share through the service, in any form, for any purpose, without additional consent or compensation."

Po was quiet.

"Page seven: Clearwater may share your usage patterns with third-party partners for research and commercial purposes."

"We all agreed to that."

"We all tapped Accept," Tao said. "That is not the same thing."`,
      lessonHighlight: 'Tapping Accept is a choice. Reading what you\'re agreeing to is a right you can always exercise first.',
    },
    {
      id: 'c16-3',
      title: 'Sage Arrives',
      content: `Sage the Crane had been watching from the Elder's Council — the high branches at the edge of the forest where the whole landscape was visible.

She descended slowly, deliberately, and called a meeting at the Bridge of Consent.

Every animal who came received a single page — a plain-language summary of what the Clearwater Agreement actually meant: what data was collected, who it was shared with, what Clearwater could legally do with everything the forest had said through its service.

It took an hour to read. Several animals left partway through, uncomfortable. Others stayed and asked questions.

"Can we undo it?" a young deer asked.

"Partially," Sage said. "You can withdraw from the service. Some data can be requested back. Some is already in places you cannot reach." She looked around the gathering. "This is why the Bridge exists. It asks you to pause before you cross. The Clearwater Agreement moved the Bridge behind the Accept button — where almost no one looks."

"Is that legal?" Miki asked.

"In many places, yes," Sage said. "Which is part of what we should be discussing."`,
    },
    {
      id: 'c16-4',
      title: 'A New Kind of Agreement',
      content: `The forest did not stop using Clearwater's services entirely. Some of what it offered was genuinely useful, and animals made informed choices about what they were willing to exchange for it.

But Sage drafted something new: the Forest Standard for Plain Agreements. Every service entering the forest would be asked to provide a one-page plain-language summary alongside its full terms — what it collects, what it shares, what you can take back, and who to contact if something feels wrong.

Not every service agreed. Some left.

The forest let them.

Po stood at the Bridge of Consent and watched a new sign go up: "Before you cross, know what's on the other side."

"Do you think animals will read it now?" he asked Sage.

"Some will. More than before," she said. "And the ones who don't will at least know the bridge was there." She looked at the sign. "Rights only protect you if you know you have them. That's what the Bridge is for."

Po thought of eleven pages of small writing. "It should have been one page all along," he said.

"Yes," Sage said. "It should."`,
    },
  ],
  activities: [
    {
      id: 'a16-1',
      title: 'Terms of Agreement — Plain Language Translation',
      type: 'worksheet',
      ageGroups: ['middle', 'older'],
      description: 'Students receive three excerpts from real-style terms of service (simplified for age-appropriateness). For each clause, they write a plain-language version: "This means they can ____." Then they decide: would they still accept? What would they want to change?',
    },
    {
      id: 'a16-2',
      title: 'Draft a Fair Agreement',
      type: 'game',
      ageGroups: ['older'],
      description: 'In small groups, students design a one-page "Forest Standard" agreement for a fictional new service. They must state: what data is collected, what it\'s used for, what users can opt out of, and how to request deletion. Another group plays the "regulator" and reviews their draft. Does it meet the Forest Standard?',
    },
    {
      id: 'a16-3',
      title: 'What Rights Do You Have Online?',
      type: 'discussion',
      ageGroups: ['older'],
      description: 'Students research and discuss data rights frameworks (simplified): the right to access your data, the right to delete it, the right to know who it\'s shared with. Do these rights exist where they live? How do they compare to what Sage described? What\'s missing?',
    },
  ],
};

// ─── STORY REGISTRY ───────────────────────────────────────────────────────────
// Season 1 — The Privacy Grove — complete (Episodes 1–8)
// Season 2 — The Kindness Clearing — complete (Episodes 9–16)
// Season 3 — The Wisdom Mountain — Phase 3 (Episodes 17+, specced in STORYLINE_BIBLE.md)

export const STORIES: Story[] = [
  episode1,
  episode2,
  episode3,
  episode4,
  episode5,
  episode6,
  episode7,
  episode8,
  episode9,
  episode10,
  episode11,
  episode12,
  episode13,
  episode14,
  episode15,
  episode16,
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export const ORIGIN_STORY_SLUG = 'privacy-panda-and-the-digital-bamboo-forest';

export const isStoryPublished = (story: Story): boolean => {
  const now = new Date();
  if (story.publishedAt && new Date(story.publishedAt) > now) {
    return false;
  }
  if (story.scheduledAt && new Date(story.scheduledAt) > now) {
    return false;
  }
  return true;
};

export const isFoundationStory = (story: Story): boolean =>
  story.isOrigin === true || story.slug === ORIGIN_STORY_SLUG;

export const getPublishedStories = (): Story[] =>
  STORIES.filter(isStoryPublished).sort((a, b) => a.episodeNumber - b.episodeNumber);

export const getStoryBySlug = (slug: string): Story | undefined =>
  STORIES.find((s) => s.slug === slug);

export const getStoriesByAgeGroup = (age: AgeGroup): Story[] =>
  getPublishedStories().filter((s) => s.ageGroups.includes(age));

export const getStoriesByPillar = (pillar: QuestPillar): Story[] =>
  getPublishedStories().filter((s) => s.questPillar === pillar);

export const getStoriesBySeason = (season: 1 | 2 | 3): Story[] =>
  getPublishedStories().filter((s) => s.season === season);

export const getStoriesByZone = (zone: ForestZone): Story[] =>
  getPublishedStories().filter((s) => s.forestZone === zone);

/** Latest shipped continuation episode (story list, analytics). */
export const getLatestStory = (): Story | undefined => {
  const published = getPublishedStories().filter((s) => !isFoundationStory(s));
  return published[published.length - 1];
};

/** Flip to true when the homepage spotlight should promote a new episode. */
export const HOMEPAGE_LATEST_STORY_ENABLED = false;

/** Homepage “Latest Story” card only — off until product enables promotion. */
export const getHomepageLatestStory = (): Story | undefined => {
  if (!HOMEPAGE_LATEST_STORY_ENABLED) {
    return undefined;
  }
  const latest = getLatestStory();
  if (!latest || isFoundationStory(latest)) {
    return undefined;
  }
  return latest;
};

export const getNextScheduledStory = (): Story | undefined =>
  STORIES
    .filter((s) => !isStoryPublished(s) && s.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())[0];

export const getFoundationStory = (): Story | undefined =>
  STORIES.find((s) => isFoundationStory(s));

export const getContinuationStories = (): Story[] =>
  getPublishedStories().filter((s) => !isFoundationStory(s));
