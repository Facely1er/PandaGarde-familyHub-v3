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
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '0.5rem' }}>
          Age-Specific Conversation Starters
        </h2>
        <p style={{ color: '#666', fontSize: '1.125rem' }}>
          Ready-to-use conversation scripts tailored to your child's age group
        </p>
      </div>

      {/* Age Group Selector */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {ageGroups.map(group => (
          <button
            key={group.id}
            onClick={() => {
              setSelectedAgeGroup(group.id);
              setExpandedTemplate(null);
            }}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              border: selectedAgeGroup === group.id ? '2px solid #4CAF50' : '2px solid #e5e7eb',
              backgroundColor: selectedAgeGroup === group.id ? '#f0fdf4' : 'white',
              color: selectedAgeGroup === group.id ? '#4CAF50' : '#666',
              fontWeight: selectedAgeGroup === group.id ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* Templates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {currentGroup.templates.map(template => (
          <div
            key={template.id}
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
                backgroundColor: '#f8f9fa'
              }}
              onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MessageCircle size={24} style={{ color: '#4CAF50' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>
                  {template.title}
                </h3>
              </div>
              {expandedTemplate === template.id ? (
                <ChevronUp size={20} style={{ color: '#666' }} />
              ) : (
                <ChevronDown size={20} style={{ color: '#666' }} />
              )}
            </div>

            {expandedTemplate === template.id && (
              <div style={{ padding: '1.5rem' }}>
                {/* Script */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50' }}>
                      What to Say:
                    </h4>
                    <button
                      onClick={() => copyToClipboard(template.script, `script-${template.id}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: '#666'
                      }}
                    >
                      {copiedId === `script-${template.id}` ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '8px',
                    borderLeft: '3px solid #4CAF50',
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    lineHeight: 1.8
                  }}>
                    {template.script}
                  </div>
                </div>

                {/* Follow-up Questions */}
                {template.followUpQuestions.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', marginBottom: '0.75rem' }}>
                      Follow-up Questions:
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#666', lineHeight: 1.8 }}>
                      {template.followUpQuestions.map((question, idx) => (
                        <li key={idx} style={{ marginBottom: '0.5rem' }}>{question}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tips */}
                {template.tips.length > 0 && (
                  <div style={{
                    backgroundColor: '#fef3c7',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #f59e0b'
                  }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#92400e', marginBottom: '0.75rem' }}>
                      Tips for This Conversation:
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#92400e', lineHeight: 1.8 }}>
                      {template.tips.map((tip, idx) => (
                        <li key={idx} style={{ marginBottom: '0.5rem' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgeSpecificConversations;

