import React, { useState } from 'react';
import { CheckCircle, Circle, Award, Download, Share2 } from 'lucide-react';
import { logger } from '../../lib/logger';

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
        logger.warn('Error sharing', error, 'SHARE');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Checklist progress copied to clipboard!');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          Interactive Privacy Checklists
        </h2>
        <p className="text-base text-gray-600 sm:text-lg dark:text-gray-300">
          Track your family&apos;s privacy progress with age-appropriate checklists
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 sm:mb-8 sm:gap-4">
        {Object.values(checklists).map((checklist) => {
          const selected = selectedAgeGroup === checklist.id;
          return (
            <button
              key={checklist.id}
              type="button"
              onClick={() => setSelectedAgeGroup(checklist.id)}
              className={`flex flex-col items-start gap-1 rounded-lg border-2 px-4 py-3 text-left transition-colors sm:px-6 ${
                selected
                  ? 'border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-950/30 dark:text-green-300'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <span className={selected ? 'font-semibold' : 'font-normal'}>{checklist.title}</span>
              <span className="text-xs opacity-80">{getCompletionPercentage(checklist)}% complete</span>
            </button>
          );
        })}
      </div>

      <div className="mb-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60 sm:mb-8 sm:p-6">
        <div className="mb-2 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-100">
            {currentChecklist.title}
          </h3>
          <span className="text-lg font-bold text-green-700 sm:text-xl dark:text-green-400">
            {completionPercentage}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-green-600 transition-[width] duration-300 dark:bg-green-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={exportChecklist}
            className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Download size={16} aria-hidden />
            Export
          </button>
          <button
            type="button"
            onClick={shareChecklist}
            className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Share2 size={16} aria-hidden />
            Share Progress
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        {currentChecklist.items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleItem(selectedAgeGroup, item.id)}
            className={`mb-2 flex w-full items-start gap-4 rounded-lg p-4 text-left transition-colors last:mb-0 ${
              item.completed
                ? 'bg-green-50 dark:bg-green-950/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            {item.completed ? (
              <CheckCircle size={24} className="mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" aria-hidden />
            ) : (
              <Circle size={24} className="mt-0.5 flex-shrink-0 text-gray-400" aria-hidden />
            )}
            <span
              className={`text-base leading-relaxed ${
                item.completed
                  ? 'text-green-800 line-through opacity-70 dark:text-green-200'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {item.text}
            </span>
          </button>
        ))}
      </div>

      {completionPercentage === 100 && (
        <div className="mt-6 rounded-xl border-2 border-amber-500 bg-amber-50 p-6 text-center dark:border-amber-600 dark:bg-amber-950/30 sm:mt-8 sm:p-8">
          <Award size={48} className="mx-auto mb-4 text-amber-500" aria-hidden />
          <h3 className="mb-2 text-xl font-bold text-amber-900 sm:text-2xl dark:text-amber-100">
            Congratulations!
          </h3>
          <p className="mb-4 text-amber-900 dark:text-amber-200">
            You&apos;ve completed the {currentChecklist.title}
          </p>
          <button
            type="button"
            onClick={exportChecklist}
            className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
          >
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default PrivacyChecklists;

