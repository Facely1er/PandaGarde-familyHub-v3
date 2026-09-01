import React from 'react';
import ConversationApproaches from '../../components/parent/ConversationApproaches';
import PageLayout from '../../components/layout/PageLayout';

const ConversationApproachesPage: React.FC = () => {
  return (
    <PageLayout
      title="8 Ways to Talk About Privacy With Your Children"
      subtitle="Pick one approach below that fits your child's age and mood. Each includes ready-to-use words you can say tonight."
      breadcrumbs={true}
    >
      <div className="mx-auto w-full max-w-4xl">
        <ConversationApproaches />
      </div>
    </PageLayout>
  );
};

export default ConversationApproachesPage;

