import React from 'react';
import ResourceSharing from '../../components/community/ResourceSharing';
import CommunityErrorBoundary from '../../components/community/CommunityErrorBoundary';
import PageLayout from '../../components/layout/PageLayout';

const ResourceSharingPage: React.FC = () => {
  return (
    <CommunityErrorBoundary>
      <PageLayout
        title="Community Resources"
        subtitle="Device-local resource list demo—saved in your browser only. Not a live marketplace or part of Family Hub sync."
        breadcrumbs={true}
      >
        <ResourceSharing />
      </PageLayout>
    </CommunityErrorBoundary>
  );
};

export default ResourceSharingPage;

