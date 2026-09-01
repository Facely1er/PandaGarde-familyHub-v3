import React from 'react';
import AssessmentHistory from '../components/AssessmentHistory';
import PageLayout from '../components/layout/PageLayout';

const AssessmentHistoryPage: React.FC = () => {
  return (
    <PageLayout
      title="Assessment History"
      subtitle="Review past family check-ins saved on this device."
      breadcrumbs
    >
      <AssessmentHistory />
    </PageLayout>
  );
};

export default AssessmentHistoryPage;

