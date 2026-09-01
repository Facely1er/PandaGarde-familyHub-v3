import React from 'react';
import SafetyNetBuilder from '../../components/parent/SafetyNetBuilder';
import PageLayout from '../../components/layout/PageLayout';

const SafetyNetPage: React.FC = () => {
  return (
    <PageLayout
      title="Build Your Digital Safety Net"
      subtitle="Set up who your family can call for help with online problems. Work through each step below together."
      breadcrumbs={true}
    >
      <div className="mx-auto w-full max-w-4xl">
        <SafetyNetBuilder />
      </div>
    </PageLayout>
  );
};

export default SafetyNetPage;

