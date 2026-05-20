import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, LayoutDashboard, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const flow = [
  {
    title: 'Discover your privacy exposure',
    description: 'Start with the website to understand your family\'s digital footprint, privacy priorities, and immediate risks.',
    icon: ShieldCheck,
    href: '/digital-footprint'
  },
  {
    title: 'Learn what matters',
    description: 'Use age-based resources, guided content, and practical materials for parents, children, and educators.',
    icon: BookOpen,
    href: '/resources'
  },
  {
    title: 'Take action in Family Hub',
    description: 'Move into the Family Hub workspace to track activities, progress, and privacy goals in one place.',
    icon: LayoutDashboard,
    href: '/family-hub'
  },
];

const FeaturesPage: React.FC = () => {
  return (
    <PageLayout
      title="How PandaGarde Works"
      subtitle="PandaGarde is the website. Family Hub is the dedicated workspace inside the PandaGarde experience."
      icon={ShieldCheck}
      badge="HOW IT WORKS"
      breadcrumbs={true}
    >
      <section style={{ padding: '1rem 0 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '2rem' }}>
            {flow.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: '1rem', alignItems: 'center', padding: '1.25rem', borderRadius: '22px', border: '1px solid var(--gray-200)', background: 'var(--white)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '18px', background: '#f0fdf4', color: '#047857', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    <span style={{ fontSize: '0.75rem' }}>{index + 1}</span>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--gray-900)' }}>{item.title}</h2>
                    <p style={{ margin: '0.5rem 0 0', color: 'var(--gray-600)', lineHeight: 1.7 }}>{item.description}</p>
                  </div>
                  <Link to={item.href} className="button button-secondary" style={{ whiteSpace: 'nowrap' }}>
                    Open <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ background: 'var(--gray-100)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--gray-200)' }}>
            <h2 style={{ marginTop: 0 }}>What you get</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {[
                'A clear start instead of scattered pages',
                'Website guidance before workspace use',
                'Family Hub access without backend dependency',
                'Practical privacy steps instead of generic advice',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--white)', borderRadius: '16px', padding: '1rem', border: '1px solid var(--gray-200)' }}>
                  <CheckCircle2 size={18} color="#047857" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FeaturesPage;
