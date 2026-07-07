import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { StoryCastGallery } from '../components/stories/StoryCastGallery';
import PageLayout from '../components/layout/PageLayout';

export function StoryCastPage() {
  return (
    <PageLayout
      title="Meet the Cast"
      subtitle="The friends of the Digital Bamboo Forest — who they are, when they arrive, and what they teach us about privacy and kindness online."
      breadcrumbs
    >
      <section className="py-4 pb-10">
        <div className="mx-auto max-w-[1100px] space-y-6">
          <p>
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
            >
              <ArrowLeft size={16} aria-hidden />
              Back to all stories
            </Link>
          </p>
          <StoryCastGallery showTiers />
        </div>
      </section>
    </PageLayout>
  );
}
