import React from 'react';
import ResourceSharing from '../../components/community/ResourceSharing';
import CommunityErrorBoundary from '../../components/community/CommunityErrorBoundary';
import PageLayout from '../../components/layout/PageLayout';

const ResourceSharingPage: React.FC = () => {
  return (
    <CommunityErrorBoundary>
      <PageLayout
        title="Community Resources"
        subtitle="Save helpful links and tips on this device. Tap Add a resource below to get started."
        breadcrumbs={true}
      >
        <ResourceSharing />
      </PageLayout>
    </CommunityErrorBoundary>
  );
};

export default ResourceSharingPage;

