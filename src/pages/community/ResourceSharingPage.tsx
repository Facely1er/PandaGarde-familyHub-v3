import React from 'react';
import ResourceSharing from '../../components/community/ResourceSharing';
import CommunityErrorBoundary from '../../components/community/CommunityErrorBoundary';
import PageLayout from '../../components/layout/PageLayout';
import { Globe } from 'lucide-react';

const ResourceSharingPage: React.FC = () => {
  return (
    <CommunityErrorBoundary>
      <PageLayout
        title="Community Resources"
        subtitle="Discover privacy tools and resources shared and voted on by the community. Find trusted recommendations from other families navigating digital privacy education."
        icon={Globe}
        badge="COMMUNITY"
        breadcrumbs={true}
      >
        <ResourceSharing />
      </PageLayout>
    </CommunityErrorBoundary>
  );
};

export default ResourceSharingPage;

