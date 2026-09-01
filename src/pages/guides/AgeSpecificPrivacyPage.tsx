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
      <div className="mx-auto w-full max-w-4xl">
        <AgeSpecificConversations />
      </div>
    </PageLayout>
  );
};

export default AgeSpecificPrivacyPage;

