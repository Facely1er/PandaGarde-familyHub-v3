import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const resourceGroups = [
  {
    title: 'For Parents',
    icon: Users,
    description: 'Guides, planning tools, and conversation support for leading privacy decisions at home.',
    links: [
      { label: 'Family Privacy Guide', href: '/guides/family-privacy' },
      { label: 'Family Privacy Plan', href: '/family-privacy-plan' },
      { label: 'Device Setup Guide', href: '/guides/device-setup' },
    ],
  },
  {
    title: 'For Kids',
    icon: BookOpen,
    description: 'Stories, activities, and age-based materials that make privacy easier to understand.',
    links: [
      { label: 'Privacy Panda Story', href: '/stories/privacy-panda-and-the-digital-bamboo-forest' },
      { label: 'Activity Book', href: '/activity-book' },
      { label: 'Privacy Explorers', href: '/privacy-explorers' },
    ],
  },
  {
    title: 'For Educators',
    icon: GraduationCap,
    description: 'Classroom-ready resources for lessons, discussion, and privacy awareness activities.',
    links: [
      { label: 'Educator Tools', href: '/educator-tools' },
      { label: 'Classroom Activities', href: '/classroom-activities' },
      { label: 'Digital Rights Guide', href: '/digital-rights' },
    ],
  },
];

const ResourcesPage: React.FC = () => {
  return (
    <PageLayout
      title="Resources"
      subtitle="Use the right materials for the right audience: parents, kids, and educators."
      breadcrumbs={true}
    >
      <section className="py-4 pb-8">
        <div className="mx-auto grid max-w-[1100px] gap-6">
          {resourceGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.title}
                className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
              >
                <div className="mb-4 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300">
                    <Icon size={24} aria-hidden />
                  </div>
                  <div>
                    <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
                      {group.title}
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">{group.description}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 p-4 no-underline text-inherit transition-all hover:border-green-600 dark:hover:border-green-400"
                    >
                      <div className="mb-2 font-bold text-gray-900 dark:text-gray-100">{link.label}</div>
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

export default ResourcesPage;
