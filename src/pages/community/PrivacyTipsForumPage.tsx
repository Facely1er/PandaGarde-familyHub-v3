import React from 'react';
import PrivacyTipsForum from '../../components/community/PrivacyTipsForum';
import CommunityErrorBoundary from '../../components/community/CommunityErrorBoundary';
import PageLayout from '../../components/layout/PageLayout';
const PrivacyTipsForumPage: React.FC = () => {
  return (
    <CommunityErrorBoundary>
      <PageLayout
        title="Privacy Tips Forum"
        subtitle="Read tips from other parents or share one of your own. Posts stay on this device only—not a public social network."
        breadcrumbs={true}
      >
        <PrivacyTipsForum />
      </PageLayout>
    </CommunityErrorBoundary>
  );
};

export default PrivacyTipsForumPage;

