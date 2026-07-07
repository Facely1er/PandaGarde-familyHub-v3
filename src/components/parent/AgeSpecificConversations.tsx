import React, { useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface ConversationTemplate {
  id: string;
  title: string;
  script: string;
  followUpQuestions: string[];
  tips: string[];
}

interface AgeGroup {
  id: string;
  label: string;
  ageRange: string;
  templates: ConversationTemplate[];
}

const AgeSpecificConversations: React.FC = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('5-12');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const ageGroups: AgeGroup[] = [
    {
      id: '5-12',
      label: 'Ages 5-12',
      ageRange: '5-12 years old',
      templates: [
        {
          id: 'personal-details',
          title: 'Keep Personal Details Safe',
          script: `"Hey [child's name], I want to talk about keeping your personal information safe online. Personal information is like your special secret - things like your full name, where you live, your phone number, and your birthday. These are things that belong just to you, and we don't share them with people we don't know, even online. Can you think of some examples of personal information?"`,
          followUpQuestions: [
            'What kind of information do you think is okay to share online?',
            'What information should we keep private?',
            'Who is it okay to share your personal information with?'
          ],
          tips: [
            'Use simple examples they can relate to (like not telling a stranger at the playground where you live)',
            'Make it a conversation, not a lecture',
            'Use positive language - focus on keeping safe, not on scary things'
          ]
        },
        {
          id: 'ask-before-click',
          title: 'Ask Before You Click',
          script: `"I want to make sure you know it's always okay to ask me before you click on something online. If you see a button, a link, or something that asks you to download or sign up, come and ask me first. I'm here to help you make good choices. There's no such thing as a silly question when it comes to staying safe online."`,
          followUpQuestions: [
            'What should you do if you see something that makes you feel uncomfortable?',
            'When is it okay to click on something without asking?',
            'What should you do if someone online asks you to click on something?'
          ],
          tips: [
            'Reassure them that asking questions is good and smart',
            'Set clear boundaries but in a supportive way',
            'Practice scenarios together'
          ]
        },
        {
          id: 'trust-your-gut',
          title: 'Trust Your Gut',
          script: `"Your feelings are really important. If something online makes you feel uncomfortable, scared, or confused, that's your body's way of telling you something might not be right. Always trust those feelings and come tell me or another trusted adult right away. We'll help you figure out what to do."`,
          followUpQuestions: [
            'Can you tell me about a time when you had a "gut feeling" about something?',
            'What are some things that might make you feel uncomfortable online?',
            'Who are the trusted adults you can talk to if something feels wrong?'
          ],
          tips: [
            "Validate their feelings and let them know it's okay to feel uncomfortable",
            'Help them identify trusted adults in their life',
            "Make sure they know they won't get in trouble for telling you"
          ]
        }
      ]
    },
    {
      id: '13-17',
      label: 'Ages 13-17',
      ageRange: '13-17 years old',
      templates: [
        {
          id: 'digital-footprint',
          title: 'Digital Footprint Awareness',
          script: `"I want to talk about your digital footprint - that's everything you do online that creates a record. Every post, photo, comment, or like can be seen by others and might stay online for a long time. Think about what you want your digital footprint to say about you. How do you want people to see you online?"`,
          followUpQuestions: [
            'What kind of digital footprint do you want to have?',
            'How might your online posts affect your future?',
            'What should you think about before posting something?'
          ],
          tips: [
            'Use real examples they can relate to',
            'Focus on their future goals and how their online presence might affect them',
            'Help them understand permanence without being preachy'
          ]
        },
        {
          id: 'social-media-literacy',
          title: 'Social Media Literacy',
          script: `"Social media can be great for staying connected, but it's important to understand how it works. Companies use your information to show you ads, and not everything you see is real. People can edit photos, fake information, and create false impressions. Let's talk about how to be smart about what you see and share."`,
          followUpQuestions: [
            'How can you tell if something online is real or fake?',
            'Why do you think companies collect information about you?',
            'How can you protect your privacy on social media?'
          ],
          tips: [
            'Help them develop critical thinking skills',
            'Discuss privacy settings together',
            'Talk about the difference between public and private information'
          ]
        },
        {
          id: 'privacy-settings',
          title: 'Privacy Settings Walkthrough',
          script: `"Let's go through your privacy settings together. I want to make sure you understand what each setting does and how it affects who can see your information. We'll set them up together so you feel comfortable and safe. This isn't about me not trusting you - it's about helping you stay safe."`,
          followUpQuestions: [
            'What privacy settings are most important to you?',
            'Who should be able to see your posts and information?',
            'How often should we review your privacy settings?'
          ],
          tips: [
            'Do this together, not for them',
            'Explain each setting in simple terms',
            'Make it a regular check-in, not a one-time thing'
          ]
        }
      ]
    }
  ];

  const currentGroup = ageGroups.find(g => g.id === selectedAgeGroup) || ageGroups[0];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          Age-Specific Conversation Starters
        </h2>
        <p className="text-base text-gray-600 sm:text-lg dark:text-gray-300">
          Ready-to-use conversation scripts tailored to your child&apos;s age group
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 sm:mb-8 sm:gap-4">
        {ageGroups.map((group) => {
          const selected = selectedAgeGroup === group.id;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => {
                setSelectedAgeGroup(group.id);
                setExpandedTemplate(null);
              }}
              className={`rounded-lg border-2 px-4 py-3 text-sm transition-colors sm:px-6 sm:text-base ${
                selected
                  ? 'border-green-600 bg-green-50 font-semibold text-green-700 dark:border-green-500 dark:bg-green-950/30 dark:text-green-300'
                  : 'border-gray-200 bg-white font-normal text-gray-600 hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        {currentGroup.templates.map((template) => {
          const expanded = expandedTemplate === template.id;
          const panelId = `conversation-panel-${template.id}`;
          return (
            <div
              key={template.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <button
                type="button"
                id={`conversation-trigger-${template.id}`}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setExpandedTemplate(expanded ? null : template.id)}
                className="flex w-full cursor-pointer items-center justify-between bg-gray-50 p-4 text-left dark:bg-gray-800/80 sm:p-6"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <MessageCircle size={24} className="flex-shrink-0 text-green-600 dark:text-green-400" aria-hidden />
                  <h3 className="m-0 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-100">
                    {template.title}
                  </h3>
                </div>
                {expanded ? (
                  <ChevronUp size={20} className="flex-shrink-0 text-gray-500" aria-hidden />
                ) : (
                  <ChevronDown size={20} className="flex-shrink-0 text-gray-500" aria-hidden />
                )}
              </button>

              {expanded && (
                <div id={panelId} role="region" aria-labelledby={`conversation-trigger-${template.id}`} className="p-4 sm:p-6">
                  <div className="mb-6">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">What to Say:</h4>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(template.script, `script-${template.id}`)}
                        className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        {copiedId === `script-${template.id}` ? (
                          <>
                            <Check size={16} aria-hidden />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} aria-hidden />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="rounded-lg border-l-4 border-green-600 bg-gray-50 p-4 italic leading-relaxed text-gray-900 dark:border-green-500 dark:bg-gray-900/50 dark:text-gray-100">
                      {template.script}
                    </div>
                  </div>

                  {template.followUpQuestions.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
                        Follow-up Questions:
                      </h4>
                      <ul className="m-0 list-disc space-y-2 pl-5 leading-relaxed text-gray-600 dark:text-gray-300">
                        {template.followUpQuestions.map((question, idx) => (
                          <li key={idx}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {template.tips.length > 0 && (
                    <div className="rounded-lg border border-amber-500 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-950/30">
                      <h4 className="mb-3 text-base font-semibold text-amber-900 dark:text-amber-100">
                        Tips for This Conversation:
                      </h4>
                      <ul className="m-0 list-disc space-y-2 pl-5 leading-relaxed text-amber-900 dark:text-amber-200">
                        {template.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgeSpecificConversations;

