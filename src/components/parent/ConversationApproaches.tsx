import React, { useState } from 'react';
import { Heart, Lightbulb, MessageSquare, HelpCircle, BookOpen, Shield, Users, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Approach {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  description: string;
  doExamples: string[];
  dontExamples: string[];
  scenarios: Array<{
    situation: string;
    goodApproach: string;
    poorApproach: string;
  }>;
}

const ConversationApproaches: React.FC = () => {
  const [expandedApproach, setExpandedApproach] = useState<string | null>('show-care');

  const approaches: Approach[] = [
    {
      id: 'show-care',
      title: 'Show Care, Not Fear',
      icon: Heart,
      description: 'Focus on protecting and caring for your child, not on scary consequences. Children respond better when they feel supported.',
      doExamples: [
        'Say "I want to help you stay safe" instead of "You could get hurt"',
        'Use "We" language: "Let\'s make sure we\'re being safe"',
        'Express concern with love: "I care about you, so let\'s talk about this"'
      ],
      dontExamples: [
        'Don\'t use fear tactics: "Strangers online will hurt you"',
        'Don\'t make it about punishment: "If you do this, you\'ll be in trouble"',
        'Don\'t use threats: "I\'ll take away your device if..."'
      ],
      scenarios: [
        {
          situation: 'Your child wants to use a new social media app',
          goodApproach: '"I know you\'re excited about this app. Let\'s look at it together and make sure the privacy settings are set up right so you can use it safely."',
          poorApproach: '"No way! Social media is dangerous and you\'re too young. You can\'t use it."'
        }
      ]
    },
    {
      id: 'everyday-examples',
      title: 'Use Everyday Examples',
      icon: Lightbulb,
      description: 'Connect online safety to real-world situations your child already understands. Use analogies they can relate to.',
      doExamples: [
        'Compare online privacy to not sharing your house key with strangers',
        'Explain digital footprint like footprints in sand - they leave a mark',
        'Use playground rules: "Would you tell a stranger at the playground where you live?"'
      ],
      dontExamples: [
        'Don\'t use technical jargon they don\'t understand',
        'Don\'t use abstract concepts without examples',
        'Don\'t assume they understand adult-level privacy concerns'
      ],
      scenarios: [
        {
          situation: 'Explaining why they shouldn\'t share their address online',
          goodApproach: '"Remember how we don\'t tell strangers at the park where we live? The internet is like a huge park with lots of people we don\'t know. We keep our address private there too."',
          poorApproach: '"Don\'t share your address because of data privacy regulations and potential identity theft risks."'
        }
      ]
    },
    {
      id: 'talk-with',
      title: 'Talk With, Not At',
      icon: MessageSquare,
      description: 'Have a conversation, not a lecture. Ask questions, listen to their answers, and build understanding together.',
      doExamples: [
        'Ask open-ended questions: "What do you think about...?"',
        'Listen to their perspective before sharing yours',
        'Make it a dialogue: "I see your point. What if we also consider...?"'
      ],
      dontExamples: [
        'Don\'t lecture: "You need to understand that..."',
        'Don\'t interrupt when they\'re explaining their view',
        'Don\'t dismiss their concerns: "That\'s not important"'
      ],
      scenarios: [
        {
          situation: 'Your teen wants more privacy on their phone',
          goodApproach: '"I hear you want more privacy. Can you help me understand what that means to you? Let\'s figure out a way that works for both of us."',
          poorApproach: '"You\'re a minor and I have the right to check your phone whenever I want. End of discussion."'
        }
      ]
    },
    {
      id: 'practical-help',
      title: 'Give Practical Help',
      icon: HelpCircle,
      description: 'Don\'t just say "be careful" - show them how. Walk through privacy settings together and teach them the steps.',
      doExamples: [
        'Sit down together and go through privacy settings step-by-step',
        'Show them how to report inappropriate content',
        'Practice what to do in different scenarios together'
      ],
      dontExamples: [
        'Don\'t just say "be careful online" without explaining how',
        'Don\'t set up everything for them without teaching them',
        'Don\'t assume they\'ll figure it out on their own'
      ],
      scenarios: [
        {
          situation: 'Setting up privacy settings on a new app',
          goodApproach: '"Let\'s set this up together. I\'ll show you what each setting does, and you can decide what feels right. Here\'s what this privacy setting means..."',
          poorApproach: '"Just make sure your privacy is set to private. I don\'t have time to show you."'
        }
      ]
    },
    {
      id: 'simple-words',
      title: 'Use Simple Words',
      icon: BookOpen,
      description: 'Avoid technical jargon. Use language your child understands. If you must use a technical term, explain it simply.',
      doExamples: [
        'Say "app or website" instead of "platform"',
        'Say "who can see your information" instead of "privacy exposure"',
        'Say "secret code" instead of "encryption"'
      ],
      dontExamples: [
        'Don\'t use terms like "data breach", "encryption", "metadata" without explaining',
        'Don\'t assume they understand technical concepts',
        'Don\'t use industry jargon'
      ],
      scenarios: [
        {
          situation: 'Explaining why a password is important',
          goodApproach: '"Your password is like a secret code that only you know. It\'s like a key to your online accounts. We want to make sure only you have the key."',
          poorApproach: '"You need a strong password with proper encryption to prevent unauthorized access to your account credentials."'
        }
      ]
    },
    {
      id: 'dont-blame',
      title: 'Don\'t Blame for Mistakes',
      icon: Shield,
      description: 'Mistakes happen. When they do, focus on learning and fixing the problem, not on punishment or blame.',
      doExamples: [
        'Say "Let\'s figure out how to fix this together"',
        'Focus on what they learned: "What would you do differently next time?"',
        'Reassure them: "Everyone makes mistakes. What matters is what we learn."'
      ],
      dontExamples: [
        'Don\'t say "I told you so" or "You should have known better"',
        'Don\'t punish immediately - first understand what happened',
        'Don\'t make them feel ashamed for making a mistake'
      ],
      scenarios: [
        {
          situation: 'Your child accidentally shared personal information online',
          goodApproach: '"I know that was scary. Let\'s fix this together. First, let\'s remove that information. Then let\'s talk about what we learned so this doesn\'t happen again."',
          poorApproach: '"I told you not to do that! You\'re grounded and I\'m taking away your device. You should have known better."'
        }
      ]
    },
    {
      id: 'step-by-step',
      title: 'Take It Step by Step',
      icon: Users,
      description: 'Don\'t try to cover everything at once. Break privacy education into small, manageable conversations over time.',
      doExamples: [
        'Focus on one topic per conversation',
        'Build on previous conversations: "Remember when we talked about...?"',
        'Check in regularly: "How are you feeling about the privacy rules we set?"'
      ],
      dontExamples: [
        'Don\'t try to cover all privacy topics in one long conversation',
        'Don\'t overwhelm them with too much information at once',
        'Don\'t expect them to remember everything from one talk'
      ],
      scenarios: [
        {
          situation: 'Starting privacy education with your child',
          goodApproach: '"Today let\'s just talk about one thing: keeping your name and address private. Next week we can talk about something else."',
          poorApproach: '"We need to talk about passwords, privacy settings, social media, online predators, cyberbullying, and digital footprints. All of it. Right now."'
        }
      ]
    },
    {
      id: 'make-rules-together',
      title: 'Make Family Rules Together',
      icon: CheckCircle,
      description: 'Involve your child in creating family privacy rules. When they help make the rules, they\'re more likely to follow them.',
      doExamples: [
        'Ask for their input: "What do you think our family rules should be?"',
        'Compromise when appropriate: "I hear you want more freedom. What if we..."',
        'Write the rules down together and display them'
      ],
      dontExamples: [
        'Don\'t make all the rules without their input',
        'Don\'t be completely inflexible - listen to their perspective',
        'Don\'t change rules without discussing it first'
      ],
      scenarios: [
        {
          situation: 'Creating screen time rules',
          goodApproach: '"Let\'s talk about screen time rules together. What do you think is fair? I\'m thinking maybe 2 hours on weekdays. What do you think?"',
          poorApproach: '"The rule is 1 hour of screen time per day. No exceptions. No discussion."'
        }
      ]
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '0.5rem' }}>
          8 Ways to Talk About Privacy With Your Children
        </h2>
        <p style={{ color: '#666', fontSize: '1.125rem' }}>
          Effective approaches to help your children understand online privacy and stay safe
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {approaches.map(approach => {
          const Icon = approach.icon;
          const isExpanded = expandedApproach === approach.id;

          return (
            <div
              key={approach.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: isExpanded ? '#f0fdf4' : '#f8f9fa',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => setExpandedApproach(isExpanded ? null : approach.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} style={{ color: '#4CAF50' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0, marginBottom: '0.25rem' }}>
                      {approach.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
                      {approach.description}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={20} style={{ color: '#666' }} />
                ) : (
                  <ChevronDown size={20} style={{ color: '#666' }} />
                )}
              </div>

              {isExpanded && (
                <div style={{ padding: '1.5rem' }}>
                  {/* Do's and Don'ts */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      backgroundColor: '#f0fdf4',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #10b981'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <CheckCircle size={20} style={{ color: '#10b981' }} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#065f46', margin: 0 }}>
                          Do:
                        </h4>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#065f46', lineHeight: 1.8 }}>
                        {approach.doExamples.map((example, idx) => (
                          <li key={idx} style={{ marginBottom: '0.5rem' }}>{example}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{
                      backgroundColor: '#fef2f2',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #dc2626'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <X size={20} style={{ color: '#dc2626' }} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#991b1b', margin: 0 }}>
                          Don't:
                        </h4>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#991b1b', lineHeight: 1.8 }}>
                        {approach.dontExamples.map((example, idx) => (
                          <li key={idx} style={{ marginBottom: '0.5rem' }}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Scenarios */}
                  {approach.scenarios.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', marginBottom: '1rem' }}>
                        Example Scenario:
                      </h4>
                      {approach.scenarios.map((scenario, idx) => (
                        <div key={idx} style={{
                          backgroundColor: '#f8f9fa',
                          padding: '1.5rem',
                          borderRadius: '8px',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: '#2C3E50' }}>Situation: </strong>
                            <span style={{ color: '#666' }}>{scenario.situation}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            <div style={{
                              backgroundColor: '#f0fdf4',
                              padding: '1rem',
                              borderRadius: '8px',
                              borderLeft: '3px solid #10b981'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <CheckCircle size={16} style={{ color: '#10b981' }} />
                                <strong style={{ color: '#065f46' }}>Good Approach:</strong>
                              </div>
                              <p style={{ color: '#065f46', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                                "{scenario.goodApproach}"
                              </p>
                            </div>
                            <div style={{
                              backgroundColor: '#fef2f2',
                              padding: '1rem',
                              borderRadius: '8px',
                              borderLeft: '3px solid #dc2626'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <X size={16} style={{ color: '#dc2626' }} />
                                <strong style={{ color: '#991b1b' }}>Poor Approach:</strong>
                              </div>
                              <p style={{ color: '#991b1b', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                                "{scenario.poorApproach}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
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

export default ConversationApproaches;

