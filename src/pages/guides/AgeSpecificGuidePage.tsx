import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Shield, Heart, Brain, CheckCircle, type LucideIcon } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';

const cardClass =
  'rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800';
const headingClass = 'mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100';
const resourceLinkClass =
  `${cardClass} text-center transition-colors hover:border-green-400 dark:hover:border-green-500`;

interface AgeGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const ageGroups: AgeGroup[] = [
  {
    id: '5-8',
    label: 'Ages 5-8',
    icon: Heart,
    description: 'Early learners who are just beginning to explore digital devices',
  },
  {
    id: '9-12',
    label: 'Ages 9-12',
    icon: Shield,
    description: 'Elementary school children with growing digital independence',
  },
  {
    id: '13-17',
    label: 'Ages 13-17',
    icon: Brain,
    description: 'Teens navigating social media and complex online relationships',
  },
];

const getAgeGroupContent = (ageGroup: string) => {
  switch (ageGroup) {
    case '5-8':
      return {
        title: 'Early digital learners (ages 5-8)',
        concepts: [
          'Personal information is like a secret — only share with trusted adults',
          'The internet is like a big playground — stay where adults can see you',
          'If something online makes you feel uncomfortable, tell an adult',
          'Never share your name, address, or school with strangers',
        ],
        activities: [
          'Privacy Panda coloring activities',
          '"Safe or Unsafe" sorting games',
          'Role-playing scenarios with stuffed animals',
          'Simple password creation games',
        ],
        conversationStarters: [
          'What information about yourself would you tell a stranger at the playground?',
          'If someone online asked for your address, what would you do?',
          'How do you know if a website is safe for kids?',
        ],
        parentalGuidance: [
          'Supervise all online activities',
          'Use child-friendly apps and websites only',
          'Set up parental controls on all devices',
          'Model good digital behavior',
        ],
        resources: [
          { to: '/downloads/coloring-sheets', icon: Heart, title: 'Coloring sheets', description: 'Fun activities for young learners' },
          { to: '/stories', icon: BookOpen, title: 'Privacy Panda stories', description: 'Stories you can read together anytime' },
          { to: '/family-hub/activities', icon: Shield, title: 'Privacy missions', description: 'Age-matched missions in Family Hub' },
        ],
      };
    case '9-12':
      return {
        title: 'Growing digital citizens (ages 9-12)',
        concepts: [
          'Understanding digital footprints and permanence',
          'Password security and why it matters',
          'Recognizing phishing and suspicious content',
          'Privacy settings and how to use them',
        ],
        activities: [
          'Password strength challenges',
          'Digital footprint mapping',
          'Privacy settings exploration',
          'Safe online research projects',
        ],
        conversationStarters: [
          'What would happen if everyone could see everything you post online?',
          'How can you tell if a website or app is trustworthy?',
          'Why do you think some people try to trick others online?',
        ],
        parentalGuidance: [
          'Talk regularly about what they do online',
          'Teach critical thinking about online content',
          'Discuss the permanence of online posts',
          'Encourage questions and open communication',
        ],
        resources: [
          { to: '/family-hub/activities', icon: BookOpen, title: 'Privacy missions', description: 'Interactive learning in Family Hub' },
          { to: '/downloads/safety-posters', icon: Shield, title: 'Safety posters', description: 'Visual reminders for home or classroom' },
          { to: '/for-families', icon: Brain, title: 'Guides & stories', description: 'Parent guides and printables' },
        ],
      };
    case '13-17':
      return {
        title: 'Digital natives (ages 13-17)',
        concepts: [
          'Data privacy and how companies collect information',
          'Social media privacy and reputation management',
          'Cybersecurity threats and protection strategies',
          'Digital rights and responsibilities',
        ],
        activities: [
          'Privacy policy analysis',
          'Social media audit projects',
          'Cybersecurity simulations',
          'Digital citizenship campaigns',
        ],
        conversationStarters: [
          'How do you think social media companies make money?',
          'What would you do if someone posted something embarrassing about you?',
          'How can you protect your friends\' privacy online?',
        ],
        parentalGuidance: [
          'Respect their growing independence while maintaining safety',
          'Discuss real-world consequences of online actions',
          'Help them understand their digital rights',
          'Support their development of critical thinking skills',
        ],
        resources: [
          { to: '/family-hub/activities', icon: Brain, title: 'Teen privacy missions', description: 'Age-matched scenarios in Family Hub' },
          { to: '/how-it-works', icon: Users, title: 'How PandaGarde works', description: 'Stories, catalog, and Family Hub' },
          { to: '/digital-rights', icon: Shield, title: 'Digital rights', description: 'Understanding your digital rights' },
        ],
      };
    default:
      return null;
  }
};

const AgeSpecificGuidePage: React.FC = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('5-8');
  const content = getAgeGroupContent(selectedAgeGroup);

  if (!content) {
    return null;
  }

  return (
    <PageLayout
      title="Age-Specific Privacy Education Guide"
      subtitle="Pick your child's age to see conversation starters and activities that fit."
      breadcrumbs
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {ageGroups.map((group) => {
            const IconComponent = group.icon;
            const isSelected = selectedAgeGroup === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedAgeGroup(group.id)}
                aria-pressed={isSelected}
                className={`flex min-h-[44px] flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'border-green-700 bg-green-700 text-white dark:border-green-600 dark:bg-green-600'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-green-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-green-500'
                }`}
              >
                <IconComponent size={20} aria-hidden />
                <span>
                  <span className="block font-bold">{group.label}</span>
                  <span className={`block text-xs ${isSelected ? 'text-green-50' : 'text-gray-500 dark:text-gray-400'}`}>
                    {group.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <section>
          <h2 className={headingClass}>{content.title}</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className={cardClass}>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Key concepts to teach</h3>
              <ul className="space-y-3">
                {content.concepts.map((concept) => (
                  <li key={concept} className="flex items-start gap-3">
                    <CheckCircle size={20} className="mt-0.5 shrink-0 text-green-700 dark:text-green-400" aria-hidden />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={cardClass}>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Recommended activities</h3>
              <ul className="space-y-3">
                {content.activities.map((activity) => (
                  <li key={activity} className="flex items-start gap-3">
                    <BookOpen size={20} className="mt-0.5 shrink-0 text-green-700 dark:text-green-400" aria-hidden />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className={headingClass}>Conversation starters</h2>
          <div className={cardClass}>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Use these questions to start a privacy conversation that matches this age:
            </p>
            <div className="space-y-3">
              {content.conversationStarters.map((starter) => (
                <p
                  key={starter}
                  className="rounded-xl bg-gray-50 p-4 text-sm font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                >
                  “{starter}”
                </p>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className={headingClass}>Parental guidance tips</h2>
          <div className={cardClass}>
            <ul className="space-y-4">
              {content.parentalGuidance.map((tip, index) => (
                <li key={tip} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                    <span className="text-sm font-bold text-green-700 dark:text-green-300">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className={headingClass}>Age-specific resources</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Link key={resource.to + resource.title} to={resource.to} className={resourceLinkClass}>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                    <Icon size={24} className="text-green-700 dark:text-green-400" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{resource.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{resource.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="rounded-2xl bg-green-700 p-6 text-center text-white sm:p-8 dark:bg-green-800">
          <h2 className="mb-3 text-xl font-bold sm:text-2xl">Ready to start a privacy conversation?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-green-50">
            Choose the resources that fit your child&apos;s age. Stories and guides are open anytime; Family Hub missions are optional practice on this device.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/for-families"
              className="inline-flex min-h-[44px] items-center rounded-xl bg-white px-5 py-2.5 font-semibold text-green-800 hover:bg-green-50"
            >
              Explore guides &amp; stories
            </Link>
            <Link
              to="/downloads/family-agreement"
              className="inline-flex min-h-[44px] items-center rounded-xl border-2 border-white px-5 py-2.5 font-semibold text-white hover:bg-white/10"
            >
              Download family agreement
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AgeSpecificGuidePage;
