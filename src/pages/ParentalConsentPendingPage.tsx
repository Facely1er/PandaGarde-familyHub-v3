import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Clock, Shield, CheckCircle } from 'lucide-react';

const ParentalConsentPendingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
              <Mail size={32} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              Parental Consent Pending
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We've sent a consent request email to your parent
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 sm:p-6 dark:border-green-800 dark:bg-green-900/20">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Shield size={20} />
                What Happens Next?
              </h2>
              <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-semibold text-white dark:bg-green-600">1</span>
                  <span>We've sent an email to your parent's email address with a consent link</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-semibold text-white dark:bg-green-600">2</span>
                  <span>Your parent needs to click the link in the email to approve your use of PandaGarde</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-semibold text-white dark:bg-green-600">3</span>
                  <span>Once approved, you'll be able to use all features of PandaGarde</span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Limited Access Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    While waiting for parental consent, you're in "zero-data mode". This means we won't collect or store any personal information about you. You can still browse some educational content, but full features require parental approval.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle size={20} />
                COPPA Compliance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                PandaGarde complies with COPPA (Children's Online Privacy Protection Act). We require verifiable parental consent before collecting any personal information from children under 13. This protects your privacy and keeps you safe online.
              </p>
              <Link
                to="/privacy"
                className="text-sm font-medium text-green-700 hover:underline dark:text-green-400"
              >
                Read our Privacy Policy →
              </Link>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 rounded-lg bg-green-700 py-3 px-6 font-medium text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentalConsentPendingPage;

