import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Target, BookOpen, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const groups = [
  {
    title: 'Exposure Checks',
    description: 'Identify where your family\'s data is exposed and what needs attention first.',
    icon: ShieldCheck,
    links: [
      { label: 'Start / Resume DFA Journey', href: '/get-started' },
      { label: 'Digital Footprint Analysis', href: '/digital-footprint' },
    ]
  },
  {
    title: 'Privacy Actions',
    description: 'Turn findings into practical next steps, planning, and family-level improvements.',
    icon: Target,
    links: [
      { label: 'Privacy Goals', href: '/privacy-goals' },
      { label: 'Family Privacy Plan', href: '/family-privacy-plan' },
    ]
  },
  {
    title: 'Learning Tools',
    description: 'Use guided stories, activities, and educational content to build better habits.',
    icon: BookOpen,
    links: [
      { label: 'Privacy Panda Story', href: '/privacy-panda' },
      { label: 'Activity Book', href: '/activity-book' },
    ]
  },
];

const PrivacyToolsPage: React.FC = () => {
  return (
    <PageLayout
      title="Privacy Tools"
      subtitle="The DFA journey is the main flow. These tools support the journey before, during, and after Digital Footprint Analysis."
      icon={Wrench}
      badge="TOOLS"
      breadcrumbs={true}
    >
      <section style={{ padding: '1rem 0 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: '1.5rem' }}>
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: '24px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '18px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--gray-900)' }}>{group.title}</h2>
                    <p style={{ margin: '0.45rem 0 0', color: 'var(--gray-600)', lineHeight: 1.7 }}>{group.description}</p>
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

export default PrivacyToolsPage;
