import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle, Shield, BarChart3, Bell } from 'lucide-react';

interface EmptyStateWithServicePromptProps {
  feature: string;
  description: string;
  minimumServices?: number;
  icon?: React.ReactNode;
}

const EmptyStateWithServicePrompt: React.FC<EmptyStateWithServicePromptProps> = ({
  feature,
  description,
  minimumServices = 3,
  icon
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-indigo-900/10 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  {icon || <Sparkles className="h-7 w-7 text-white" />}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {feature}
                  </h1>
                  <p className="text-blue-100 text-sm mt-1">
                    One quick setup step to unlock this feature
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="bg-white/20 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-full">
                  Setup Required
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {description}
            </p>

            {/* What You'll Get */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                What You'll Unlock
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100 text-sm">Privacy Analysis</p>
                    <p className="text-xs text-green-700 dark:text-green-300">See your exposure score</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100 text-sm">Risk Assessment</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Identify high-risk apps</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100 text-sm">Safety Alerts</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Stay informed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Get Started in 3 Easy Steps
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Browse the Service Catalog
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Explore 50+ popular apps and services your family might use
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Add Your Family's Services
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click "Add to My Services" on at least {minimumServices} services you use
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Return to See Your Analysis
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Come back here to view your {feature.toLowerCase()} and recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link
                to="/service-catalog"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ShoppingBag size={24} />
                <span>Open Service Catalog</span>
                <ArrowRight size={20} />
              </Link>
              
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="text-lg">⏱️</span> 2-5 minutes
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <span className="text-lg">🔓</span> Instant unlock
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <span className="text-lg">🆓</span> Always free
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Help Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Questions about privacy protection?{' '}
            <Link
              to="/privacy-handbook"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Read our Privacy Handbook →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateWithServicePrompt;
