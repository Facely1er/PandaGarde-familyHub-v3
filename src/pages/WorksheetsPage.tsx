import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Printer } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';

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
    window.open('/downloads/worksheets-print.html', '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout
      title="Privacy Worksheets"
      subtitle="Print a worksheet, talk through the prompts, and save it or hang it on the fridge."
      breadcrumbs
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="text-center">
          <Button type="button" onClick={openPrintablePack} leftIcon={<Printer size={20} />}>
            Open full printable pack
          </Button>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
          {WORKSHEETS.map((sheet) => (
            <li key={sheet.id}>
              <article className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <FileText className="mb-2 text-green-700 dark:text-green-400" size={28} aria-hidden />
                <h2 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">{sheet.title}</h2>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{sheet.ageGroup}</p>
                <button
                  type="button"
                  onClick={openPrintablePack}
                  className="min-h-[44px] text-sm font-medium text-green-700 hover:underline dark:text-green-400"
                >
                  Print this pack
                </button>
              </article>
            </li>
          ))}
        </ul>

        <p className="text-center text-gray-600 dark:text-gray-300">
          Pair worksheets with{' '}
          <Link to="/family-hub/activities" className="font-semibold text-green-700 hover:underline dark:text-green-400">
            interactive missions
          </Link>
          {' '}or the{' '}
          <Link to="/activities/privacy-learning-kit" className="font-semibold text-green-700 hover:underline dark:text-green-400">
            full learning kit
          </Link>
          .
        </p>
      </div>
    </PageLayout>
  );
};

export default WorksheetsPage;
