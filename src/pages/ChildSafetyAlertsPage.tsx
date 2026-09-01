import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertTriangle, ShoppingBag, BarChart3, ArrowRight, Shield, Scale, ExternalLink } from 'lucide-react';
import ChildSafetyAlerts from '../components/alerts/ChildSafetyAlerts';
import ServiceNotificationCenter from '../components/ServiceNotificationCenter';
import EmailCaptureInline from '../components/EmailCaptureInline';
import { PRIVACY_PORTAL_URL, PRIVACY_PORTAL_OPT_OUT_URL } from '../config/portal';
import PageLayout from '../components/layout/PageLayout';

const ChildSafetyAlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'notifications'>('notifications');

  return (
    <PageLayout
      title="Safety Alerts & Notifications"
      subtitle="Headlines about apps you listed—not live monitoring of your child's phone. Add apps in the catalog first, then check back here."
      breadcrumbs
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/service-catalog"
            className="button button-primary inline-flex items-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            <span>Add Services</span>
          </Link>
          <Link
            to="/digital-footprint"
            className="button button-secondary inline-flex items-center gap-2"
          >
            <BarChart3 className="h-5 w-5" aria-hidden />
            <span>Footprint</span>
          </Link>
        </div>

          {/* Service Catalog Requirement Banner */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  Add Services to Enable Alerts
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                  Notifications and RSS headlines are tied to services in your catalog. Add the apps and sites your family uses to see catalog-based reminders and matched safety headlines (refresh RSS on this page when online).
                </p>
                <Link
                  to="/service-catalog"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <ShoppingBag size={16} />
                  Add Your Family's Services
                </Link>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Stay Informed About Your Services
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Service notifications are generated from your catalog and privacy checklist—not from watching your child&apos;s device. High-priority items appear first. Open a notification to jump to that service in the catalog.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-700">
                <Scale className="h-4 w-4 text-white" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-green-800 dark:bg-green-800 dark:text-green-200">
                    Policy Alert
                  </span>
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Maryland MODPA — In Effect</span>
                </div>
                <p className="mb-1 text-sm font-bold text-green-900 dark:text-green-100">
                  Maryland families can now formally request deletion of their child's app data
                </p>
                <p className="mb-3 text-xs leading-relaxed text-green-800 dark:text-green-200">
                  Under the Maryland Online Data Privacy Act (MODPA), you can submit access, correction, deletion, and opt-out requests to any qualifying data controller — including games, EdTech tools, and social platforms your children use. Requests must be honored within 45 days (15 days for opt-outs).
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/digital-rights"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-800"
                  >
                    <Scale size={12} aria-hidden />
                    Learn MODPA rights
                  </Link>
                  <a
                    href={PRIVACY_PORTAL_OPT_OUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-white px-3 py-1.5 text-xs font-semibold text-green-800 transition-colors hover:bg-green-50 dark:border-green-700 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-800/50"
                  >
                    <ExternalLink size={12} aria-hidden />
                    Opt-out of data sale
                  </a>
                  <a
                    href={PRIVACY_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-white px-3 py-1.5 text-xs font-semibold text-green-800 transition-colors hover:bg-green-50 dark:border-green-700 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-800/50"
                  >
                    <ExternalLink size={12} aria-hidden />
                    Privacy Portal
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'notifications'
                  ? 'border-green-600 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Service Notifications</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'alerts'
                  ? 'border-green-600 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>RSS Safety Alerts</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'notifications' ? (
          <ServiceNotificationCenter />
        ) : (
          <ChildSafetyAlerts />
        )}

        {/* Email Capture for Safety Alerts */}
        <div>
          <EmailCaptureInline
            title="Stay Updated on Child Safety Alerts"
            description="Optional email list for PandaGarde privacy and safety updates (when EmailJS is configured). This is not live monitoring of your child's apps or device."
            purpose="safety-alerts"
            compact={false}
          />
        </div>

        {/* Related Resources */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            to="/service-catalog"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-600 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="h-5 w-5 text-green-600 dark:text-green-400" />
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Add Services for Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add or update catalog entries to enable footprint analysis and catalog-based notifications
            </p>
          </Link>

          <Link
            to="/digital-footprint"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-600 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              View footprint review
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              See your family's overall privacy exposure and high-risk services
            </p>
          </Link>

          <Link
            to="/privacy-assessment"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-600 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Privacy Assessment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get personalized recommendations to improve your family's privacy
            </p>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default ChildSafetyAlertsPage;

