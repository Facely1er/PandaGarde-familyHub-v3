import React from 'react';
import AgeSpecificConversations from '../../components/parent/AgeSpecificConversations';
import PageLayout from '../../components/layout/PageLayout';

const AgeSpecificPrivacyPage: React.FC = () => {
  return (
    <PageLayout
      title="Age-Specific Privacy Guidance"
      subtitle="Pick your child's age group for example questions and simple privacy tips you can use tonight."
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <AgeSpecificConversations />
      </div>
    </PageLayout>
  );
};

export default AgeSpecificPrivacyPage;

