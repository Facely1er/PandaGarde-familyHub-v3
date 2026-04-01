import React from 'react';
import { Users } from 'lucide-react';
import AgeSpecificConversations from '../../components/parent/AgeSpecificConversations';
import PageLayout from '../../components/layout/PageLayout';

const AgeSpecificPrivacyPage: React.FC = () => {
  return (
    <PageLayout
      title="Age-Specific Privacy Guidance"
      subtitle="Ready-to-use conversation starters and privacy guidance tailored to your child's age group. Learn what to say and how to say it."
      icon={Users}
      badge="AGE-SPECIFIC GUIDE"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <AgeSpecificConversations />
      </div>
    </PageLayout>
  );
};

export default AgeSpecificPrivacyPage;

