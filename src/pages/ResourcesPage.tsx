import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PageSection, ShellLinkCard } from '../components/layout/PageContent';

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
      <PageSection
        header={{
          eyebrow: 'Browse by audience',
          title: 'Guides, stories, and tools for your household',
          lead: 'Each section links to materials matched to how your family wants to learn—not one generic checklist for everyone.',
        }}
      >
        <div className="shell-stack">
          {resourceGroups.map((group) => {
            const Icon = group.icon;
            return (
              <article key={group.title} className="shell-card p-5">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="shell-icon shell-icon--lg">
                    <Icon size={24} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="shell-card__title text-lg sm:text-xl">{group.title}</h2>
                    <p className="shell-card__body mt-2">{group.description}</p>
                  </div>
                </div>
                <div className="shell-grid shell-grid--3">
                  {group.links.map((link) => (
                    <ShellLinkCard
                      key={link.href}
                      to={link.href}
                      title={link.label}
                      cta="Open"
                    />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </PageSection>
    </PageLayout>
  );
};

export default ResourcesPage;
