import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { updateDfaJourneyPhase } from '../../lib/dfaJourney';
import { useAuth } from './AuthWrapper';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInLocally } = useAuth();

  const handleContinue = () => {
    signInLocally();
    updateDfaJourneyPhase('hub', { visited: true, completed: true, resumePath: '/family-hub/dashboard' });
    const nextPath = location.pathname.startsWith('/family-hub') ? location.pathname : '/family-hub/dashboard';
    navigate(nextPath === '/family-hub' ? '/family-hub/dashboard' : nextPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-100 text-green-700 mb-4">
          <LayoutDashboard size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">The PandaGarde Family Hub</h1>
        <p className="text-gray-600 mb-3">
          This is your family privacy workspace. It sits after the DFA journey, so families can continue from their digital footprint findings without a backend, remote auth provider, or external database.
        </p>
        <div className="text-sm text-gray-500 mb-6 space-y-2 text-left bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> <span>Local-first access</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> <span>Progress saved on this device</span></div>
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-600" /> <span>PandaGarde website first, Family Hub workspace second</span></div>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 transition-colors"
        >
          Continue locally
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
