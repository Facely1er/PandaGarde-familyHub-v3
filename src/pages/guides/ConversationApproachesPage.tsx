import React from 'react';
import { MessageCircle } from 'lucide-react';
import ConversationApproaches from '../../components/parent/ConversationApproaches';
import PageLayout from '../../components/layout/PageLayout';

const ConversationApproachesPage: React.FC = () => {
  return (
    <PageLayout
      title="8 Ways to Talk About Privacy With Your Children"
      subtitle="Effective approaches to help your children understand online privacy and stay safe. Learn how to have meaningful conversations that build trust and understanding."
      icon={MessageCircle}
      badge="CONVERSATION GUIDE"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <ConversationApproaches />
      </div>
    </PageLayout>
  );
};

export default ConversationApproachesPage;

