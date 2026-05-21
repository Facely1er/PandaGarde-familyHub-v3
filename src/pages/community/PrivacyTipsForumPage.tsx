import React from 'react';
import PrivacyTipsForum from '../../components/community/PrivacyTipsForum';
import CommunityErrorBoundary from '../../components/community/CommunityErrorBoundary';
import PageLayout from '../../components/layout/PageLayout';
const PrivacyTipsForumPage: React.FC = () => {
  return (
    <CommunityErrorBoundary>
      <PageLayout
        title="Privacy Tips Forum"
        subtitle="Device-local demo forum: pseudonymous posts stay on your browser. Not connected to Family Hub or a live social network."
        breadcrumbs={true}
      >
        <PrivacyTipsForum />
      </PageLayout>
    </CommunityErrorBoundary>
  );
};

export default PrivacyTipsForumPage;

