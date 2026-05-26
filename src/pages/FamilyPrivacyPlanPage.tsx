import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PageSection } from '../components/layout/PageContent';
import FamilyPrivacyPlanBuilder, { type FamilyPrivacyPlan } from '../components/parent/FamilyPrivacyPlanBuilder';

const FamilyPrivacyPlanPage: React.FC = () => {
  const handleSave = (_plan: FamilyPrivacyPlan) => {
    // Plan saved locally in builder
  };

  const handleExport = (_plan: FamilyPrivacyPlan) => {
    // Export handled in builder
  };

  return (
    <PageLayout
      title="Create Your Family Privacy Plan"
      subtitle="Set clear rules, choose safety tools, and schedule check-ins—best when everyone helps build it together."
      breadcrumbs={true}
    >
      <p className="page-lead">
        <Link
          to="/guides/family-privacy"
          className="inline-flex items-center gap-1.5 font-medium text-green-700 hover:underline dark:text-green-400"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to Family Privacy Guide
        </Link>
      </p>

      <PageSection>
        <FamilyPrivacyPlanBuilder onSave={handleSave} onExport={handleExport} />
        <div className="shell-card shell-card--nested p-5">
          <h3 className="shell-card__title text-base">Tips for success</h3>
          <ul className="shell-list mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>Hold a family meeting so kids and teens can share ideas—not just parents dictating rules.</li>
            <li>Post the plan somewhere visible: fridge, bulletin board, or a shared document.</li>
            <li>Revisit every 3–6 months when devices, apps, or ages change.</li>
            <li>Follow the same rules you set for children.</li>
          </ul>
        </div>
      </PageSection>
    </PageLayout>
  );
};

export default FamilyPrivacyPlanPage;
