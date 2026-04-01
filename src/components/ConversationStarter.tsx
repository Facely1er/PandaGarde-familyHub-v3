import React, { useState, useMemo } from 'react';
import { MessageCircle, RefreshCw, Heart, BookOpen, Shield, Users, Info, Copy, Check } from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';

export type ConversationTopic = 
  | 'Personal Information' 
  | 'Password Security' 
  | 'Digital Footprint' 
  | 'Social Media' 
  | 'Online Safety' 
  | 'Privacy Settings'
  | 'all';

export type ConversationAgeGroup = '5-8' | '9-12' | '13-17' | 'all';

export interface ConversationPrompt {
  id: string;
  topic: ConversationTopic;
  ageGroups: ConversationAgeGroup[];
  prompt: string;
  tips?: string[];
  context?: string;
}

const conversationPrompts: ConversationPrompt[] = [
  // Personal Information - Ages 5-8
  {
    id: 'personal-info-5-8-1',
    topic: 'Personal Information',
    ageGroups: ['5-8'],
    prompt: 'What information about yourself would you tell a stranger at the playground? The internet is like a big playground with lots of people we don\'t know.',
    tips: ['Use simple language', 'Give examples they can relate to', 'Let them ask questions'],
    context: 'Help children understand that online strangers are similar to strangers in real life.'
  },
  {
    id: 'personal-info-5-8-2',
    topic: 'Personal Information',
    ageGroups: ['5-8'],
    prompt: 'If someone online asked for your address, what would you do? Let\'s practice saying "I need to ask my parent first."',
    tips: ['Role-play the scenario', 'Make it a game', 'Praise them for asking for help']
  },
  
  // Personal Information - Ages 9-12
  {
    id: 'personal-info-9-12-1',
    topic: 'Personal Information',
    ageGroups: ['9-12'],
    prompt: 'If you had to choose between sharing your location with a friend or keeping it private, what would you do? Why? Let\'s talk about the pros and cons of each choice.',
    tips: ['Encourage critical thinking', 'Discuss real scenarios', 'Respect their opinions']
  },
  {
    id: 'personal-info-9-12-2',
    topic: 'Personal Information',
    ageGroups: ['9-12'],
    prompt: 'Some apps ask for your location, contacts, or photos. How do you decide if it\'s safe to share?',
    tips: ['Review app permissions together', 'Explain why apps need data', 'Teach them to question requests']
  },
  
  // Personal Information - Ages 13-17
  {
    id: 'personal-info-13-17-1',
    topic: 'Personal Information',
    ageGroups: ['13-17'],
    prompt: 'How much personal information do you think is too much to share online? Where do you draw the line?',
    tips: ['Have an open discussion', 'Share your own boundaries', 'Discuss future implications']
  },
  
  // Password Security - All Ages
  {
    id: 'password-all-1',
    topic: 'Password Security',
    ageGroups: ['5-8', '9-12', '13-17'],
    prompt: 'If your password was like a key to your house, would you give copies to all your friends? Let\'s create a strong password together and talk about why we keep passwords secret.',
    tips: ['Use analogies they understand', 'Make password creation fun', 'Explain the importance']
  },
  {
    id: 'password-9-12-1',
    topic: 'Password Security',
    ageGroups: ['9-12', '13-17'],
    prompt: 'What makes a password strong? Let\'s create one together and see if we can make it even stronger.',
    tips: ['Use password strength checker', 'Explain different password techniques', 'Practice creating multiple passwords']
  },
  
  // Digital Footprint - Ages 9-12
  {
    id: 'footprint-9-12-1',
    topic: 'Digital Footprint',
    ageGroups: ['9-12'],
    prompt: 'Everything you post online leaves a trail, like footprints in the sand. What kind of footprint do you want to leave?',
    tips: ['Use visual examples', 'Discuss permanence', 'Focus on positive footprint']
  },
  
  // Digital Footprint - Ages 13-17
  {
    id: 'footprint-13-17-1',
    topic: 'Digital Footprint',
    ageGroups: ['13-17'],
    prompt: 'Imagine everything you post online is like writing in permanent marker on a public wall. How would that change what you choose to share? Let\'s look at your social media profiles together.',
    tips: ['Review their actual profiles', 'Discuss college/employer views', 'Help them clean up if needed']
  },
  {
    id: 'footprint-13-17-2',
    topic: 'Digital Footprint',
    ageGroups: ['13-17'],
    prompt: 'How do you think your online presence might affect your future opportunities? Let\'s do a quick audit of what\'s publicly visible about you.',
    tips: ['Google their name together', 'Check privacy settings', 'Discuss reputation management']
  },
  
  // Social Media - Ages 13-17
  {
    id: 'social-media-13-17-1',
    topic: 'Social Media',
    ageGroups: ['13-17'],
    prompt: 'Who can see your posts? Let\'s review your privacy settings together and make sure you\'re comfortable with who has access.',
    tips: ['Go through each platform', 'Explain different privacy levels', 'Help them adjust settings']
  },
  {
    id: 'social-media-13-17-2',
    topic: 'Social Media',
    ageGroups: ['13-17'],
    prompt: 'How do you decide what to post and what to keep private? What\'s your personal rule?',
    tips: ['Respect their autonomy', 'Share your own rules', 'Discuss consequences']
  },
  
  // Online Safety - Ages 5-8
  {
    id: 'safety-5-8-1',
    topic: 'Online Safety',
    ageGroups: ['5-8'],
    prompt: 'If something online makes you feel uncomfortable, what should you do? Let\'s practice the steps together.',
    tips: ['Make it a game', 'Practice the steps', 'Reassure them it\'s okay to ask for help']
  },
  
  // Online Safety - Ages 9-12
  {
    id: 'safety-9-12-1',
    topic: 'Online Safety',
    ageGroups: ['9-12'],
    prompt: 'How can you tell if a website or app is safe? What are some warning signs to look for?',
    tips: ['Review real examples', 'Teach them to look for HTTPS', 'Discuss red flags']
  },
  
  // Privacy Settings - Ages 9-12
  {
    id: 'privacy-settings-9-12-1',
    topic: 'Privacy Settings',
    ageGroups: ['9-12', '13-17'],
    prompt: 'Let\'s review the privacy settings on your favorite apps together. Do you know what each setting does?',
    tips: ['Go through settings together', 'Explain each option', 'Help them make informed choices']
  }
];

interface ConversationStarterProps {
  compact?: boolean;
  onPromptSelected?: (prompt: ConversationPrompt) => void;
}

export const ConversationStarter: React.FC<ConversationStarterProps> = ({ 
  compact = false,
  onPromptSelected 
}) => {
  const { familyMembers } = useFamily();
  const [selectedAge, setSelectedAge] = useState<ConversationAgeGroup>('all');
  const [selectedTopic, setSelectedTopic] = useState<ConversationTopic>('all');
  const [currentPrompt, setCurrentPrompt] = useState<ConversationPrompt | null>(null);
  const [copied, setCopied] = useState(false);

  // Get available age groups from family members
  const availableAges = useMemo(() => {
    const ages = familyMembers
      .filter(m => m.role === 'child' && m.profile_data?.age)
      .map(m => {
        const age = m.profile_data!.age!;
        if (age >= 5 && age <= 8) {return '5-8' as ConversationAgeGroup;}
        if (age >= 9 && age <= 12) {return '9-12' as ConversationAgeGroup;}
        if (age >= 13 && age <= 17) {return '13-17' as ConversationAgeGroup;}
        return null;
      })
      .filter((age): age is ConversationAgeGroup => age !== null);
    
    return [...new Set(ages)];
  }, [familyMembers]);

  const filteredPrompts = useMemo(() => {
    return conversationPrompts.filter(p => {
      if (selectedAge !== 'all' && !p.ageGroups.includes(selectedAge)) {return false;}
      if (selectedTopic !== 'all' && p.topic !== selectedTopic) {return false;}
      return true;
    });
  }, [selectedAge, selectedTopic]);

  const getRandomPrompt = () => {
    if (filteredPrompts.length === 0) {return;}
    const random = filteredPrompts[Math.floor(Math.random() * filteredPrompts.length)];
    setCurrentPrompt(random);
    setCopied(false);
    if (onPromptSelected) {
      onPromptSelected(random);
    }
  };

  const copyToClipboard = async () => {
    if (currentPrompt) {
      await navigator.clipboard.writeText(currentPrompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTopicIcon = (topic: ConversationTopic) => {
    switch (topic) {
      case 'Personal Information': return Users;
      case 'Password Security': return Shield;
      case 'Digital Footprint': return BookOpen;
      case 'Social Media': return MessageCircle;
      case 'Online Safety': return Shield;
      case 'Privacy Settings': return Shield;
      default: return Info;
    }
  };

  if (compact) {
    return (
      <div className="conversation-starter-compact bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <MessageCircle size={20} />
            Conversation Starter
          </h3>
          <button
            onClick={getRandomPrompt}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            <RefreshCw size={14} />
            New Prompt
          </button>
        </div>
        
        {currentPrompt ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs" style={{ backgroundColor: 'var(--light)' }}>
                Ages {currentPrompt.ageGroups.join(', ')}
              </span>
              <span className="px-2 py-1 bg-blue-100 rounded text-xs text-blue-700">
                {currentPrompt.topic}
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--gray-700)' }}>
              {currentPrompt.prompt}
            </p>
            {currentPrompt.tips && currentPrompt.tips.length > 0 && (
              <details className="text-xs">
                <summary className="cursor-pointer text-green-600 hover:text-green-700">
                  Show Tips
                </summary>
                <ul className="mt-2 space-y-1 list-disc list-inside" style={{ color: 'var(--gray-600)' }}>
                  {currentPrompt.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Click "New Prompt" to get a conversation starter
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="conversation-starter bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
          <MessageCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
            Privacy Conversation Starters
          </h2>
          <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
            Get age-appropriate prompts to start meaningful privacy conversations
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
            Age Group
          </label>
          <select
            value={selectedAge}
            onChange={(e) => {
              setSelectedAge(e.target.value as ConversationAgeGroup);
              setCurrentPrompt(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
          >
            <option value="all">All Ages</option>
            {availableAges.length > 0 ? (
              availableAges.map(age => (
                <option key={age} value={age}>Ages {age}</option>
              ))
            ) : (
              <>
                <option value="5-8">Ages 5-8</option>
                <option value="9-12">Ages 9-12</option>
                <option value="13-17">Ages 13-17</option>
              </>
            )}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
            Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value as ConversationTopic);
              setCurrentPrompt(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
          >
            <option value="all">All Topics</option>
            <option value="Personal Information">Personal Information</option>
            <option value="Password Security">Password Security</option>
            <option value="Digital Footprint">Digital Footprint</option>
            <option value="Social Media">Social Media</option>
            <option value="Online Safety">Online Safety</option>
            <option value="Privacy Settings">Privacy Settings</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={getRandomPrompt}
        disabled={filteredPrompts.length === 0}
        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        <RefreshCw size={18} />
        Get Conversation Starter
        {filteredPrompts.length > 0 && (
          <span className="text-sm opacity-90">({filteredPrompts.length} available)</span>
        )}
      </button>

      {filteredPrompts.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            No conversation starters match your selected filters. Try adjusting your selections.
          </p>
        </div>
      )}

      {/* Display Prompt */}
      {currentPrompt && (
        <div className="prompt-card bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = getTopicIcon(currentPrompt.topic);
                return <Icon size={24} className="text-green-600" />;
              })()}
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                  {currentPrompt.topic}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-white rounded text-xs font-medium" style={{ backgroundColor: 'var(--white)' }}>
                    Ages {currentPrompt.ageGroups.join(', ')}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <Copy size={18} className="text-gray-600" />
              )}
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-4" style={{ backgroundColor: 'var(--white)' }}>
            <p className="text-base leading-relaxed" style={{ color: 'var(--gray-800)' }}>
              {currentPrompt.prompt}
            </p>
          </div>

          {currentPrompt.context && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Context:</strong> {currentPrompt.context}
              </p>
            </div>
          )}

          {currentPrompt.tips && currentPrompt.tips.length > 0 && (
            <div className="bg-white rounded-lg p-4" style={{ backgroundColor: 'var(--white)' }}>
              <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                <Info size={18} />
                Tips for This Conversation
              </h4>
              <ul className="space-y-2">
                {currentPrompt.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--gray-700)' }}>
                    <span className="text-green-600 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!currentPrompt && filteredPrompts.length > 0 && (
        <div className="text-center py-8">
          <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">
            Click the button above to get a conversation starter
          </p>
        </div>
      )}
    </div>
  );
};

export default ConversationStarter;

