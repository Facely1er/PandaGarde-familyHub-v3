import React from 'react';
import PrivacyTipsForum from '../../components/community/PrivacyTipsForum';
import CommunityErrorBoundary from '../../components/community/CommunityErrorBoundary';
import PageLayout from '../../components/layout/PageLayout';
import { MessageCircle } from 'lucide-react';

const PrivacyTipsForumPage: React.FC = () => {
  return (
    <CommunityErrorBoundary>
      <PageLayout
        title="Privacy Tips Forum"
        subtitle="Share tips, ask questions, and learn from other parents in our privacy-first community forum."
        icon={MessageCircle}
        badge="COMMUNITY"
        breadcrumbs={true}
      >
        <PrivacyTipsForum />
      </PageLayout>
    </CommunityErrorBoundary>
  );
};

export default PrivacyTipsForumPage;

