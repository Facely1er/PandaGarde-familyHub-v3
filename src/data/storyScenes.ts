export interface StorySceneData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  character?: 'panda' | 'turtle' | 'monkey' | 'beaver' | 'rabbit' | 'owl' | 'fox';
  animation?: 'bounce' | 'wave' | 'nod' | 'shake' | 'dance' | 'hide' | 'appear';
  background?: 'forest' | 'cave' | 'meadow' | 'river' | 'mountain' | 'village' | 'digital';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';
  mood?: 'happy' | 'mysterious' | 'tense' | 'peaceful' | 'exciting' | 'scary';
  choices?: Array<{
    text: string;
    nextScene: string;
    consequence?: string;
  }>;
  audioUrl?: string;
  duration?: number;
}

export const storyScenes: StorySceneData[] = [
  {
    id: 'po-in-shadows',
    title: 'Po in the Shadows',
    imageUrl: '/images/story/01-PoInTheShadows.png',
    content: 'Deep in the lush Bamboo Digital Forest lived a panda named Po. He was different from the other pandas because instead of munching on regular bamboo all day, he loved to play with digital bamboo tablets. These magical tablets could connect to all parts of the forest, letting animals share stories, photos, and messages. Po was the shyest animal in the forest. He would hide behind the tallest bamboo stalks whenever other animals came near. Even though he loved his digital tablet, he rarely shared anything with others. "What if they don\'t like my photos?" he would worry. "What if they laugh at my stories?" So Po kept to himself, quietly exploring the digital pathways of the forest while staying hidden in the shadows.',
    character: 'panda',
    animation: 'hide',
    background: 'forest',
    timeOfDay: 'afternoon',
    weather: 'cloudy',
    mood: 'mysterious',
    duration: 10
  },
  {
    id: 'digital-forest',
    title: 'The Digital Forest',
    imageUrl: '/images/story/2-ForestNetwork.png',
    content: 'The Digital Bamboo Forest was growing more connected every day. Po could see the digital pathways spreading through the forest like glowing vines, connecting every animal and every corner of their world. While Po loved exploring these digital pathways, he didn\'t fully understand how they worked or how information traveled through them. The forest was becoming a network of connections that Po found both fascinating and mysterious.',
    character: 'panda',
    animation: 'appear',
    background: 'digital',
    timeOfDay: 'morning',
    weather: 'sunny',
    mood: 'peaceful',
    duration: 8
  },
  {
    id: 'the-accident',
    title: 'The Accident',
    imageUrl: '/images/story/3-TheAccident.png',
    content: 'One sunny morning, Po was so excited about a new game on his tablet that he accidentally pressed the wrong button. Suddenly, a message appeared: "All your information has been shared with the entire forest!" Po gasped! His secret diary, his collection of embarrassing bamboo dance videos, and even his personal information like where he slept and what times he ate â€“ everything was now visible to every animal in the forest! "Oh no!" cried Po, hiding his face behind his paws. Notifications, messages, and alerts flooded his screen, overwhelming him with the realization that his private world was no longer private.',
    character: 'panda',
    animation: 'shake',
    background: 'digital',
    timeOfDay: 'morning',
    weather: 'sunny',
    mood: 'tense',
    duration: 12
  },
  {
    id: 'public-reaction',
    title: 'Public Reaction',
    imageUrl: '/images/story/04-PublicReaction.png',
    content: 'Soon, messages started popping up on his tablet. "Hey Po, I didn\'t know you lived in the East Grove!" wrote Miki the Monkey. "I\'ve seen you collecting bamboo near my stream," messaged Billy the Beaver. "I love your dancing videos! Can I come watch you practice?" asked Ruby the Rabbit. Po was terrified. Everyone knew his secrets now. His private life was no longer private, and he felt exposed and vulnerable.',
    character: 'panda',
    animation: 'hide',
    background: 'forest',
    timeOfDay: 'afternoon',
    weather: 'sunny',
    mood: 'tense',
    duration: 10
  },
  {
    id: 'pos-den',
    title: 'Po\'s Den',
    imageUrl: '/images/story/05-Po\'s Den.png',
    content: 'Po turned off his tablet and hid in his den for days, too embarrassed to come out. He wrapped himself in a blanket, trying to hide from the world. The digital tablet that had once brought him joy now brought only fear and sadness. Po felt lost and didn\'t know how to fix what had happened. He stayed hidden, hoping that if he couldn\'t see the messages, maybe they would go away. But deep down, Po knew that wasn\'t how the Digital Forest worked.',
    character: 'panda',
    animation: 'hide',
    background: 'cave',
    timeOfDay: 'evening',
    weather: 'rainy',
    mood: 'scary',
    duration: 10
  },
  {
    id: 'turtle-appears',
    title: 'A Wise Friend Appears',
    imageUrl: '/images/story/06-Turtle Appears.png',
    content: 'After a week, there was a gentle knock at his door. It was wise old Turtle, the eldest animal in the forest. "Po," said Turtle softly, "may I come in?" Po reluctantly let Turtle inside. "I know what happened," Turtle said. "And I\'m here to help you understand something important about our Digital Forest." Turtle showed Po a special shield he carried. "This is a Privacy Shield. It helps protect what we share in the Digital Forest. Let me teach you how to use it."',
    character: 'turtle',
    animation: 'wave',
    background: 'cave',
    timeOfDay: 'evening',
    weather: 'foggy',
    mood: 'peaceful',
    duration: 12
  },
  {
    id: 'learning-moments',
    title: 'Learning Moments',
    imageUrl: '/images/story/07-LearningMoments.png',
    content: 'Over the next few days, Turtle taught Po many important lessons: "Information once shared is hard to take back," Turtle explained. "That\'s why we must be careful what we share from the beginning." "We can use special privacy settings," he demonstrated, showing Po how to adjust controls on his tablet. "These are like fences around your digital bamboo garden." "And most importantly," Turtle said, placing the shield in Po\'s paws, "you have the right to protect your information, just like you protect your home." Po listened carefully and practiced using the Privacy Shield. He learned how to share only what he wanted to share, with only the animals he wanted to see it. He discovered special locks for his diary and how to check if games and apps were safe before using them.',
    character: 'panda',
    animation: 'nod',
    background: 'meadow',
    timeOfDay: 'afternoon',
    weather: 'sunny',
    mood: 'happy',
    duration: 15
  },
  {
    id: 'new-po',
    title: 'A New Po',
    imageUrl: '/images/story/08-New Po.png',
    content: 'As Po practiced with his Privacy Shield, he began to feel confident again. He learned to balance enjoying his digital tablet with protecting his privacy. Po started wearing his Privacy Shield proudly and carried his digital bamboo tablet everywhere he went. He was no longer afraid â€“ he was empowered with knowledge. The shy panda who once hid in the shadows was transforming into someone who understood how to navigate the Digital Forest safely.',
    character: 'panda',
    animation: 'dance',
    background: 'forest',
    timeOfDay: 'morning',
    weather: 'sunny',
    mood: 'happy',
    duration: 12
  },
  {
    id: 'po-teaches',
    title: 'Po Teaches Others',
    imageUrl: '/images/story/09-Po teaches.png',
    content: 'As Po became more confident, something unexpected happened. Forest animals began coming to him with questions: "Po, how do I stop strangers from seeing my photos?" asked Owen the Owl. "Po, someone is pretending to be me online! What should I do?" worried Fiona the Fox. With each question, Po realized he could use what he had learned to help others. Soon, Po wasn\'t shy anymore. He became known as "Privacy Panda" â€“ the forest\'s expert on staying safe in the digital world. He created fun games to teach young animals about online safety and held special classes under the tallest bamboo tree, sharing his knowledge with all who wanted to learn.',
    character: 'panda',
    animation: 'wave',
    background: 'village',
    timeOfDay: 'afternoon',
    weather: 'sunny',
    mood: 'happy',
    duration: 16
  },
  {
    id: 'final-wisdom',
    title: 'Final Wisdom',
    imageUrl: '/images/story/10-FinalWisdom.png',
    content: '"Remember," Privacy Panda would tell his friends, "in the Digital Bamboo Forest, we must be as careful with our information as we are with our real bamboo treasures!" The animals loved learning from Privacy Panda. His gentle voice and kind smile made even scary topics feel manageable. And whenever a new animal joined the forest, Privacy Panda was the first to greet them, Privacy Shield in hand, ready to guide them safely through their digital adventures. As the seasons changed and the Digital Bamboo Forest grew larger and more complex, Privacy Panda continued his important work. He never forgot how it felt to have his private information exposed, and that memory made him an even better teacher. "The Digital Forest can be wonderful," Privacy Panda would say, "but only when we explore it with knowledge and care." And so, Privacy Panda protected the forest one animal at a time, teaching them to navigate the digital wilderness with confidence, safety, and a little bit of bamboo-powered wisdom.',
    character: 'panda',
    animation: 'appear',
    background: 'forest',
    timeOfDay: 'evening',
    weather: 'sunny',
    mood: 'peaceful',
    duration: 18
  }
];

