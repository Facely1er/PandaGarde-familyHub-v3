import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Printer } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const WORKSHEETS = [
  { id: 'safe-sharing', title: 'Safe Sharing Reflection', ageGroup: 'Ages 5-9' },
  { id: 'password-strength', title: 'Password Strength Planner', ageGroup: 'Ages 9-12' },
  { id: 'digital-footprint', title: 'Digital Footprint Map', ageGroup: 'Ages 10-14' },
  { id: 'family-rules', title: 'Our Family Privacy Rules', ageGroup: 'All ages' },
];

const WorksheetsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openPrintablePack = () => {
    window.open('/downloads/worksheets.html', '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout
      title="Privacy Worksheets"
      subtitle="Printable reflection and writing activities for hands-on privacy learning."
      breadcrumbs
    >
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <button
            type="button"
            onClick={openPrintablePack}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 min-h-[44px]"
          >
            <Printer size={20} aria-hidden />
            Open full printable pack
          </button>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 m-0">
          {WORKSHEETS.map((sheet) => (
            <li key={sheet.id}>
              <article className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 h-full">
                <FileText className="text-teal-600 dark:text-teal-400 mb-2" size={28} aria-hidden />
                <h2 className="font-semibold text-gray-900 dark:text-white mb-1">{sheet.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{sheet.ageGroup}</p>
                <button
                  type="button"
                  onClick={openPrintablePack}
                  className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline min-h-[44px]"
                >
                  Print this pack
                </button>
              </article>
            </li>
          ))}
        </ul>

        <p className="text-center mt-10 text-gray-600 dark:text-gray-400">
          Pair worksheets with{' '}
          <Link to="/activities" className="text-teal-700 dark:text-teal-300 font-semibold hover:underline">
            interactive missions
          </Link>
          {' '}or the{' '}
          <Link to="/activities/privacy-learning-kit" className="text-teal-700 dark:text-teal-300 font-semibold hover:underline">
            full learning kit
          </Link>
          .
        </p>
      </main>
    </PageLayout>
  );
};

export default WorksheetsPage;
