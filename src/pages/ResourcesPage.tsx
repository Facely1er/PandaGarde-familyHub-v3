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
        <div className="flex flex-col gap-5">
          {resourceGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title} className="shell-card p-5">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="shell-icon h-16 w-16">
                    <Icon size={24} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="shell-card__title text-lg sm:text-xl">{group.title}</h2>
                    <p className="shell-card__body mt-2">{group.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.links.map((link) => (
                    <div key={link.href} className="shell-card shell-card--nested flex flex-col gap-3 p-4">
                      <h3 className="shell-card__title text-base">{link.label}</h3>
                      <Link
                        to={link.href}
                        className="button button-secondary mt-auto inline-flex items-center gap-2 self-start"
                      >
                        Open <ArrowRight size={16} aria-hidden />
                      </Link>
                    </div>
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
