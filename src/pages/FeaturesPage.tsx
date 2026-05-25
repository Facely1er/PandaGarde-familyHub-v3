import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, LayoutDashboard, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const flow = [
  {
    title: 'Discover your privacy exposure',
    description: "Start with the website to understand your family's digital footprint, privacy priorities, and immediate risks.",
    icon: ShieldCheck,
    href: '/digital-footprint',
  },
  {
    title: 'Learn what matters',
    description: 'Use age-based resources, guided content, and practical materials for parents, children, and educators.',
    icon: BookOpen,
    href: '/resources',
  },
  {
    title: 'Take action in Family Hub',
    description: 'Move into the Family Hub workspace to track activities, progress, and privacy goals in one place.',
    icon: LayoutDashboard,
    href: '/family-hub',
  },
];

const benefits = [
  'A clear start instead of scattered pages',
  'Website guidance before workspace use',
  'Family Hub access without backend dependency',
  'Practical privacy steps instead of generic advice',
];

const FeaturesPage: React.FC = () => {
  return (
    <PageLayout
      title="How PandaGarde Works"
      subtitle="PandaGarde is the website. Family Hub is the dedicated workspace inside the PandaGarde experience."
      breadcrumbs={true}
    >
      <section className="py-4 pb-8">
        <div className="mb-8 flex flex-col gap-5">
          {flow.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="shell-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div className="shell-icon h-16 w-16 flex-col font-bold">
                  <span className="text-xs">{index + 1}</span>
                  <Icon size={22} aria-hidden />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="shell-card__title text-lg">{item.title}</h2>
                  <p className="shell-card__body mt-1">{item.description}</p>
                </div>

                <Link
                  to={item.href}
                  className="button button-secondary inline-flex items-center gap-2 self-start whitespace-nowrap sm:self-auto"
                >
                  Open <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="shell-card shell-card--panel p-6">
          <h2 className="shell-card__title mb-4 mt-0 text-xl">What you get</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {benefits.map((item) => (
              <div key={item} className="shell-card shell-card--nested flex items-center gap-3 p-4">
                <CheckCircle2 size={18} className="flex-shrink-0 text-green-700 dark:text-green-400" aria-hidden />
                <span className="shell-card__body text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FeaturesPage;
