import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Logo from '../components/Logo';
import FamilyPrivacyPlanBuilder, { type FamilyPrivacyPlan } from '../components/parent/FamilyPrivacyPlanBuilder';
import './FamilyPrivacyPlanPage.css';

const FamilyPrivacyPlanPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSave = (plan: FamilyPrivacyPlan) => {
    console.log('Privacy plan saved:', plan);
    // Could integrate with backend or analytics here
  };

  const handleExport = (plan: FamilyPrivacyPlan) => {
    console.log('Privacy plan exported:', plan);
    // Analytics tracking could go here
  };

  return (
    <div className="min-h-screen family-privacy-plan-page">
      {/* Page Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 family-privacy-header-pattern" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 mr-4">
              <Logo />
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
              <Shield size={16} />
              <span className="text-sm font-semibold">FAMILY PRIVACY PLAN</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Create Your Family Privacy Plan
            </h1>

            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              A family privacy plan works best when everyone helps create it. Set clear rules, choose safety tools, and schedule regular check-ups to keep your family safe online.
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="family-privacy-nav bg-gray-50">
        <div className="container mx-auto px-6 py-4">
          <Link
            to="/guides/family-privacy"
            className="family-privacy-nav-link inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Family Privacy Guide
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <FamilyPrivacyPlanBuilder
            onSave={handleSave}
            onExport={handleExport}
          />

          {/* Additional Information */}
          <div className="family-privacy-tips-box mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="family-privacy-tips-title text-lg font-semibold mb-3">
              Tips for Success
            </h3>
            <ul className="family-privacy-tips-list space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Have a family meeting to create the plan together - let kids and teens share their ideas too</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Display your plan somewhere visible - on the fridge, bulletin board, or in a shared digital document</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Revisit the plan every 3-6 months to adjust for new devices, apps, or as kids grow older</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Lead by example - follow the same privacy rules you set for children</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FamilyPrivacyPlanPage;

