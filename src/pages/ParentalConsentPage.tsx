import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle, Mail, X } from 'lucide-react';
import { coppaComplianceManager, type ConsentVerificationResult } from '../lib/coppaCompliance';

const ParentalConsentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState('');
  const [consentRecord, setConsentRecord] = useState<ConsentVerificationResult | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No consent token provided. Please use the link from the consent email.');
      return;
    }

    verifyConsent();
  }, [token]);

  const verifyConsent = async () => {
    if (!token) {return;}

    try {
      const result = await coppaComplianceManager.verifyConsentToken(token);
      
      if (result.valid && result.record) {
        setStatus('success');
        setMessage('Parental consent has been verified successfully! Your child can now use PandaGarde.');
        setConsentRecord(result);
        
        // Store consent token in session for the child's session
        sessionStorage.setItem('coppa_consent_token', token);
        
        // Disable zero-data mode
        coppaComplianceManager.disableZeroDataMode();
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.error || 'Invalid or expired consent token.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while verifying consent. Please try again or contact support.');
      console.error('Error verifying consent:', error);
    }
  };

  const handleRevokeConsent = async () => {
    if (!token) {return;}

    try {
      const success = await coppaComplianceManager.revokeConsent(token);
      if (success) {
        setStatus('error');
        setMessage('Consent has been revoked. All data has been deleted.');
      } else {
        setMessage('Failed to revoke consent. Please contact support.');
      }
    } catch (error) {
      console.error('Error revoking consent:', error);
      setMessage('An error occurred while revoking consent.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying consent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              status === 'success' 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {status === 'success' ? (
                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {status === 'success' ? 'Consent Verified' : 'Consent Verification Failed'}
            </h1>
          </div>

          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${
              status === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <p className={`text-center ${
                status === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {message}
              </p>
            </div>

            {status === 'success' && consentRecord?.record && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield size={20} />
                  Consent Details
                </h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Child's Age:</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">{consentRecord.record.childAge} years old</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Parent Email:</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">{consentRecord.record.parentEmail}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Consent Date:</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {new Date(consentRecord.record.consentDate).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Mail size={20} />
                What's Next?
              </h3>
              {status === 'success' ? (
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Your child can now use PandaGarde with full access</li>
                  <li>• You will be redirected to the home page shortly</li>
                  <li>• You can revoke consent at any time from your account settings</li>
                </ul>
              ) : (
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Please check that you used the correct link from the consent email</li>
                  <li>• Consent tokens expire after 7 days for security</li>
                  <li>• If you need a new consent link, please contact support</li>
                </ul>
              )}
            </div>

            {status === 'success' && (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Go to Home
                </button>
                <button
                  onClick={handleRevokeConsent}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Revoke Consent
                </button>
              </div>
            )}

            {status === 'error' && (
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Return to Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentalConsentPage;

