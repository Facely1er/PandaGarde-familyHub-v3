import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';

type KitItem = { title: string; href: string; badge: string };

const sections: { heading: string; items: KitItem[] }[] = [
  {
    heading: 'Start here',
    items: [
      { title: 'Privacy Panda Story', href: '/privacy-panda', badge: 'Story' },
      { title: 'Digital Footprint Analysis', href: '/digital-footprint', badge: 'Assessment' },
    ],
  },
  {
    heading: 'Learn and play',
    items: [
      { title: 'Privacy missions', href: '/family-hub/activities', badge: 'Family Hub' },
      { title: 'Printables & downloads', href: '/downloads/coloring-sheets', badge: 'Printable' },
      { title: 'Family Hub', href: '/family-hub', badge: 'Hub' },
    ],
  },
  {
    heading: 'Print and discuss',
    items: [
      { title: 'Privacy Worksheets', href: '/downloads/worksheets', badge: 'Printable' },
      { title: 'Coloring Sheets', href: '/downloads/coloring-sheets', badge: 'Printable' },
      { title: 'Family Agreement', href: '/downloads/family-agreement', badge: 'Family' },
    ],
  },
];

const PrivacyLearningKitPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout
      title="Privacy Learning Kit"
      subtitle="Story, missions, printables, and parent guides in one place."
      breadcrumbs
    >
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">
        {sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{section.heading}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-200 p-5 hover:border-teal-500 transition-colors min-h-[100px]"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
                      {item.badge}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mt-1">{item.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </PageLayout>
  );
};

export default PrivacyLearningKitPage;
