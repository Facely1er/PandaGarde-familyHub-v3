import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import CertificateGenerator from '../components/CertificateGenerator';
import AuthWrapper from './family-hub/AuthWrapper';

const CertificatePage: React.FC = () => {
  return (
    <PageLayout
      title="Certificate Generator"
      subtitle="Create and print a Privacy Champion certificate for your child."
      breadcrumbs={true}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link
          to="/family-hub"
          className="mb-6 inline-flex items-center gap-2 font-medium text-green-700 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to Family Hub
        </Link>
        {/* CertificateGenerator reads the saved family profile via useAuth();
            outside Family Hub's own routes that context isn't mounted, so wrap it
            here to avoid silently falling back to a generic placeholder name. */}
        <AuthWrapper>
          <CertificateGenerator />
        </AuthWrapper>
      </div>
    </PageLayout>
  );
};

export default CertificatePage;
