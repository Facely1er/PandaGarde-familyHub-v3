import React, { useState } from 'react';
import { CheckCircle, Circle, Award, Download, Share2 } from 'lucide-react';
import { useFamily } from '../../contexts/FamilyContext';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  title: string;
  ageGroup: string;
  items: ChecklistItem[];
}

const PrivacyChecklists: React.FC = () => {
  const { familyMembers } = useFamily();
  const [checklists, setChecklists] = useState<Record<string, Checklist>>({
    '5-12': {
      id: '5-12',
      title: 'Privacy Checklist for Ages 5-12',
      ageGroup: '5-12',
      items: [
        { id: '1', text: 'I know not to share my full name, address, phone number, or school name online', completed: false },
        { id: '2', text: 'I always ask a parent before clicking on links or downloading anything', completed: false },
        { id: '3', text: 'I know to tell a trusted adult if something online makes me feel uncomfortable', completed: false },
        { id: '4', text: 'I understand that not everyone online is who they say they are', completed: false },
        { id: '5', text: 'I know not to share passwords with anyone except my parents', completed: false },
        { id: '6', text: 'I understand that things I post online can stay there for a long time', completed: false },
        { id: '7', text: 'I know to ask before posting photos of myself or my family', completed: false },
        { id: '8', text: 'I understand that games and apps might collect information about me', completed: false }
      ]
    },
    '13-17': {
      id: '13-17',
      title: 'Privacy Checklist for Ages 13-17',
      ageGroup: '13-17',
      items: [
        { id: '1', text: 'I have reviewed and set privacy settings on all my social media accounts', completed: false },
        { id: '2', text: 'I understand what information is visible in my digital footprint', completed: false },
        { id: '3', text: 'I know how to recognize and report inappropriate content or behavior', completed: false },
        { id: '4', text: 'I use strong, unique passwords for each account', completed: false },
        { id: '5', text: 'I understand how location sharing works and when it\'s appropriate to use', completed: false },
        { id: '6', text: 'I know how to review and manage app permissions on my devices', completed: false },
        { id: '7', text: 'I understand that photos and posts can contain hidden information (metadata)', completed: false },
        { id: '8', text: 'I know how to block and report users who make me uncomfortable', completed: false },
        { id: '9', text: 'I regularly review my friend/follower lists and remove people I don\'t know', completed: false },
        { id: '10', text: 'I understand how companies use my data for advertising', completed: false }
      ]
    },
    'adult': {
      id: 'adult',
      title: 'Privacy Checklist for Adults',
      ageGroup: 'adult',
      items: [
        { id: '1', text: 'I use a password manager to create and store strong, unique passwords', completed: false },
        { id: '2', text: 'I have enabled two-factor authentication (2FA) on important accounts', completed: false },
        { id: '3', text: 'I can recognize phishing emails and suspicious links', completed: false },
        { id: '4', text: 'I regularly review and clean up unused apps and accounts', completed: false },
        { id: '5', text: 'I have reviewed app permissions and removed unnecessary access', completed: false },
        { id: '6', text: 'I understand how to adjust privacy settings on social media platforms', completed: false },
        { id: '7', text: 'I regularly update software and apps on my devices', completed: false },
        { id: '8', text: 'I know how to secure my home Wi-Fi network', completed: false },
        { id: '9', text: 'I understand what information companies collect about me online', completed: false },
        { id: '10', text: 'I have set up account recovery options for important accounts', completed: false }
      ]
    },
    'senior': {
      id: 'senior',
      title: 'Privacy Checklist for Seniors',
      ageGroup: 'senior',
      items: [
        { id: '1', text: 'I can recognize common online scams and phishing attempts', completed: false },
        { id: '2', text: 'I know not to share personal or financial information in response to unsolicited emails or calls', completed: false },
        { id: '3', text: 'I have set up strong passwords for my accounts', completed: false },
        { id: '4', text: 'I understand basic privacy settings on websites and apps I use', completed: false },
        { id: '5', text: 'I know who to contact if I suspect I\'ve been scammed', completed: false },
        { id: '6', text: 'I have a trusted person who can help me with technology questions', completed: false },
        { id: '7', text: 'I understand that legitimate companies won\'t ask for passwords via email or phone', completed: false },
        { id: '8', text: 'I know how to verify if a website or email is legitimate', completed: false }
      ]
    }
  });

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('5-12');

  const toggleItem = (ageGroup: string, itemId: string) => {
    setChecklists(prev => ({
      ...prev,
      [ageGroup]: {
        ...prev[ageGroup],
        items: prev[ageGroup].items.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      }
    }));
  };

  const getCompletionPercentage = (checklist: Checklist): number => {
    if (checklist.items.length === 0) {return 0;}
    const completed = checklist.items.filter(item => item.completed).length;
    return Math.round((completed / checklist.items.length) * 100);
  };

  const currentChecklist = checklists[selectedAgeGroup];
  const completionPercentage = getCompletionPercentage(currentChecklist);

  const exportChecklist = () => {
    const data = {
      checklist: currentChecklist,
      completedAt: new Date().toISOString(),
      completionPercentage
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `privacy-checklist-${selectedAgeGroup}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareChecklist = async () => {
    const text = `I completed ${completionPercentage}% of the Privacy Checklist for ${currentChecklist.title}!`;
    if (navigator.share) {
      try {
        await navigator.share({ text, title: currentChecklist.title });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Checklist progress copied to clipboard!');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '0.5rem' }}>
          Interactive Privacy Checklists
        </h2>
        <p style={{ color: '#666', fontSize: '1.125rem' }}>
          Track your family's privacy progress with age-appropriate checklists
        </p>
      </div>

      {/* Age Group Selector */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {Object.values(checklists).map(checklist => (
          <button
            key={checklist.id}
            onClick={() => setSelectedAgeGroup(checklist.id)}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              border: selectedAgeGroup === checklist.id ? '2px solid #4CAF50' : '2px solid #e5e7eb',
              backgroundColor: selectedAgeGroup === checklist.id ? '#f0fdf4' : 'white',
              color: selectedAgeGroup === checklist.id ? '#4CAF50' : '#666',
              fontWeight: selectedAgeGroup === checklist.id ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.25rem'
            }}
          >
            <span>{checklist.title}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              {getCompletionPercentage(checklist)}% complete
            </span>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>
            {currentChecklist.title}
          </h3>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4CAF50' }}>
            {completionPercentage}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#e5e7eb',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${completionPercentage}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={exportChecklist}
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
            <Download size={16} />
            Export
          </button>
          <button
            onClick={shareChecklist}
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
            <Share2 size={16} />
            Share Progress
          </button>
        </div>
      </div>

      {/* Checklist Items */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem'
      }}>
        {currentChecklist.items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => toggleItem(selectedAgeGroup, item.id)}
            style={{
              display: 'flex',
              alignItems: 'start',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: index < currentChecklist.items.length - 1 ? '0.5rem' : 0,
              backgroundColor: item.completed ? '#f0fdf4' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!item.completed) {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }
            }}
            onMouseLeave={(e) => {
              if (!item.completed) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {item.completed ? (
              <CheckCircle size={24} style={{ color: '#4CAF50', flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <Circle size={24} style={{ color: '#9ca3af', flexShrink: 0, marginTop: '2px' }} />
            )}
            <span style={{
              fontSize: '1rem',
              color: item.completed ? '#065f46' : '#2C3E50',
              textDecoration: item.completed ? 'line-through' : 'none',
              opacity: item.completed ? 0.7 : 1,
              lineHeight: 1.6
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Completion Certificate */}
      {completionPercentage === 100 && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '2rem',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <Award size={48} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e', marginBottom: '0.5rem' }}>
            Congratulations!
          </h3>
          <p style={{ color: '#92400e', fontSize: '1rem', marginBottom: '1rem' }}>
            You've completed the {currentChecklist.title}
          </p>
          <button
            onClick={exportChecklist}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default PrivacyChecklists;

