import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ExternalLink } from 'lucide-react';
import SuccessStories from '../../components/community/SuccessStories';
import CommunityErrorBoundary from '../../components/community/CommunityErrorBoundary';
import PageLayout from '../../components/layout/PageLayout';
import { Heart } from 'lucide-react';
import { PRIVACY_PORTAL_URL } from '../../config/portal';

const SuccessStoriesPage: React.FC = () => {
  return (
    <CommunityErrorBoundary>
      <PageLayout
        title="Success Stories"
        subtitle="Read and share anonymous success stories about teaching privacy to children. Learn from other families' experiences and celebrate privacy education wins."
        icon={Heart}
        badge="COMMUNITY"
        breadcrumbs={true}
      >
        {/* MODPA awareness callout for Maryland families */}
        <div className="pt-6">
          <div className="rounded-xl border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center">
                <Scale size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-teal-900 dark:text-teal-100 mb-1 text-sm">
                  Maryland families: MODPA gives you real tools — not just tips
                </h3>
                <p className="text-xs text-teal-800 dark:text-teal-200 mb-3 leading-relaxed">
                  Under the Maryland Online Data Privacy Act, you can formally request that any qualifying app access, correct, delete, or stop selling your family's personal data. Many families in our community are already using these rights. Share your story or learn the steps below.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/digital-rights"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Scale size={12} />
                    Understand your MODPA rights
                  </Link>
                  <a
                    href={PRIVACY_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 border border-teal-400 dark:border-teal-600 text-xs font-semibold rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <ExternalLink size={12} />
                    Privacy Portal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SuccessStories />
      </PageLayout>
    </CommunityErrorBoundary>
  );
};

export default SuccessStoriesPage;

