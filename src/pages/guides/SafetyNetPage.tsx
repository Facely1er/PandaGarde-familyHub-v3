import React from 'react';
import { Shield } from 'lucide-react';
import SafetyNetBuilder from '../../components/parent/SafetyNetBuilder';
import PageLayout from '../../components/layout/PageLayout';

const SafetyNetPage: React.FC = () => {
  return (
    <PageLayout
      title="Build Your Digital Safety Net"
      subtitle="Set up your family's support network for handling online privacy issues and emergencies. Designate tech guides, establish points of contact, and learn to recognize warning signs."
      icon={Shield}
      badge="SAFETY GUIDE"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <SafetyNetBuilder />
      </div>
    </PageLayout>
  );
};

export default SafetyNetPage;

