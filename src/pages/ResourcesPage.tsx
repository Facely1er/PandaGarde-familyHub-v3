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
    ]
  },
  {
    title: 'For Kids',
    icon: BookOpen,
    description: 'Stories, activities, and age-based materials that make privacy easier to understand.',
    links: [
      { label: 'Privacy Panda Story', href: '/privacy-panda' },
      { label: 'Activity Book', href: '/activity-book' },
      { label: 'Privacy Explorers', href: '/privacy-explorers' },
    ]
  },
  {
    title: 'For Educators',
    icon: GraduationCap,
    description: 'Classroom-ready resources for lessons, discussion, and privacy awareness activities.',
    links: [
      { label: 'Educator Tools', href: '/educator-tools' },
      { label: 'Classroom Activities', href: '/classroom-activities' },
      { label: 'Digital Rights Guide', href: '/digital-rights' },
    ]
  },
];

const ResourcesPage: React.FC = () => {
  return (
    <PageLayout
      title="Resources"
      subtitle="Use the right materials for the right audience: parents, kids, and educators."
      icon={BookOpen}
      badge="RESOURCES"
      breadcrumbs={true}
    >
      <section style={{ padding: '1rem 0 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: '1.5rem' }}>
          {resourceGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title} style={{ border: '1px solid var(--gray-200)', borderRadius: '24px', background: 'var(--white)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '18px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--gray-900)' }}>{group.title}</h2>
                    <p style={{ margin: '0.4rem 0 0', color: 'var(--gray-600)', lineHeight: 1.7 }}>{group.description}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {group.links.map((link) => (
                    <Link key={link.href} to={link.href} style={{ textDecoration: 'none', border: '1px solid var(--gray-200)', borderRadius: '18px', padding: '1rem', color: 'inherit', background: 'var(--gray-100)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>{link.label}</div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                        Open <ArrowRight size={16} />
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
