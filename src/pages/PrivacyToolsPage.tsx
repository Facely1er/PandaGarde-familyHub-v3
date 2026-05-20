import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, BookOpen, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const groups = [
  {
    title: 'Exposure Checks',
    description: "Identify where your family's data is exposed and what needs attention first.",
    icon: ShieldCheck,
    links: [
      { label: 'Start / Resume DFA Journey', href: '/get-started' },
      { label: 'Digital Footprint Analysis', href: '/digital-footprint' },
    ],
  },
  {
    title: 'Privacy Actions',
    description: 'Turn findings into practical next steps, planning, and family-level improvements.',
    icon: Target,
    links: [
      { label: 'Privacy Goals', href: '/privacy-goals' },
      { label: 'Family Privacy Plan', href: '/family-privacy-plan' },
    ],
  },
  {
    title: 'Learning Tools',
    description: 'Use guided stories, activities, and educational content to build better habits.',
    icon: BookOpen,
    links: [
      { label: 'Privacy Panda Story', href: '/privacy-panda' },
      { label: 'Activity Book', href: '/activity-book' },
    ],
  },
];

const PrivacyToolsPage: React.FC = () => {
  return (
    <PageLayout
      title="Privacy Tools"
      subtitle="The DFA journey is the main flow. These tools support the journey before, during, and after Digital Footprint Analysis."
      breadcrumbs={true}
    >
      <section className="py-4 pb-8">
        <div className="mx-auto grid max-w-[1100px] gap-6">
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.title}
                className="theme-card rounded-3xl p-6"
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                    <Icon size={24} aria-hidden />
                  </div>
                  <div>
                    <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
                      {group.title}
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="rounded-2xl border border-gray-200 dark:border-emerald-500/25 bg-gray-50 dark:bg-emerald-950/30 p-4 no-underline text-inherit transition-all hover:border-green-600 dark:hover:border-green-400 dark:hover:shadow-[0_0_24px_rgba(74,222,128,0.12)]"
                    >
                      <div className="mb-2 font-bold text-gray-900 dark:text-gray-100">
                        {link.label}
                      </div>
                      <span className="inline-flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                        Open <ArrowRight size={16} aria-hidden />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageLayout>
  );
};

export default PrivacyToolsPage;
