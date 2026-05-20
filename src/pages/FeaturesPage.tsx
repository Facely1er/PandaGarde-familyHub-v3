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
        <div className="flex flex-col gap-5 mb-8">
          {flow.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 flex flex-col items-center justify-center font-bold">
                  <span className="text-xs">{index + 1}</span>
                  <Icon size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h2>
                  <p className="mt-1 mb-0 text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </div>

                <Link
                  to={item.href}
                  className="button button-secondary inline-flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
                >
                  Open <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="mt-0 mb-4 text-gray-900 dark:text-gray-100">What you get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-2xl p-4 border border-gray-200 dark:border-gray-600"
              >
                <CheckCircle2 size={18} className="text-green-700 dark:text-green-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FeaturesPage;
