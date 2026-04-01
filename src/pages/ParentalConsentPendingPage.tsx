import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Clock, Shield, CheckCircle } from 'lucide-react';

const ParentalConsentPendingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
              <Mail size={32} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Parental Consent Pending
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We've sent a consent request email to your parent
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={20} />
                What Happens Next?
              </h2>
              <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">1</span>
                  <span>We've sent an email to your parent's email address with a consent link</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">2</span>
                  <span>Your parent needs to click the link in the email to approve your use of PandaGarde</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">3</span>
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
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                Read our Privacy Policy →
              </Link>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
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

