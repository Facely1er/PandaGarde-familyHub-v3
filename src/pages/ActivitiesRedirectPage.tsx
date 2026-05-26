import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { resolveLegacyActivitiesPath } from '../lib/legacyActivitiesRedirect';
import { setHubOrigin } from '../lib/hubMission';
import { HUB_MISSIONS_CTA, WEBSITE_ACTIVITIES_RETIRED_NOTE } from '../data/websiteHubBoundary';

/**
 * Legacy /activities URLs forward to Family Hub missions (no duplicate game catalog on the website).
 */
const ActivitiesRedirectPage: React.FC = () => {
  const navigate = useNavigate();
  const { activityId } = useParams<{ activityId?: string }>();

  useEffect(() => {
    setHubOrigin('web');
    const target = resolveLegacyActivitiesPath(activityId);
    navigate(target.path, { replace: true, state: target.state });
  }, [activityId, navigate]);

  return (
    <PageLayout title="Redirecting…" subtitle={WEBSITE_ACTIVITIES_RETIRED_NOTE} breadcrumbs>
      <p className="text-gray-600 dark:text-gray-300">
        Taking you to {HUB_MISSIONS_CTA.toLowerCase()}…
      </p>
    </PageLayout>
  );
};

export default ActivitiesRedirectPage;
