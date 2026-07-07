import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowRight, BarChart3, TrendingUp, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import DigitalFootprintVisualizer from '../components/DigitalFootprintVisualizer';
import EmptyStateWithServicePrompt from '../components/EmptyStateWithServicePrompt';
import DfaJourneyStepper from '../components/journey/DfaJourneyStepper';
import DfaScoreOverview from '../components/dfa/DfaScoreOverview';
import DfaMethodologyCallout from '../components/dfa/DfaMethodologyCallout';
import { useFamily } from '../contexts/FamilyContext';
import { footprintAnalyzer } from '../lib/footprintAnalyzer';
import { updateDfaJourneyPhase } from '../lib/dfaJourney';
import { buildDfaScore, loadDfaScoreTier } from '../lib/dfaScoreEngine';
import { downloadDfaExecutiveSummary } from '../lib/dfaReport';
import { logger } from '../lib/logger';
import { FOOTPRINT_REVIEW_NAV_LABEL } from '../data/siteNavigation';
import { dfaTheme } from '../styles/dfaTheme';

const DigitalFootprintEducator: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 overflow-hidden rounded-xl border-2 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
      <button type="button" onClick={() => setOpen(!open)} className="w-full p-4 text-left transition-colors hover:bg-green-100/50 dark:hover:bg-green-900/30" aria-expanded={open ? 'true' : 'false'}>
        <span className="flex items-center justify-between font-semibold text-green-900 dark:text-green-100">
          <span className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> What is a digital footprint, and why does it matter?</span>
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </button>
      {open && (
        <div className="space-y-4 px-4 pb-4 pt-0 text-sm text-green-900 dark:text-green-200">
          <p><strong>Your digital footprint</strong> is the trail of information that apps and websites collect when your family uses them — names, activity, location signals, school usage, purchases, and more.</p>
          <p><strong>Why it matters:</strong> children and parents use school tools, home apps, messaging, games, and AI services across the same household. This page shows how that exposure adds up.</p>
          <p><strong>How to use this page:</strong> review the privacy score, notice which services matter most, then pick stories or Family Hub when it fits your week—no long form required here.</p>
        </div>
      )}
    </div>
  );
};

const DigitalFootprintPage: React.FC = () => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const { familyMembers, getFamilyServices } = useFamily();
  const catalogServices = getFamilyServices();
  const memberServices: Record<string, string[]> = {};
  let totalServicesCount = 0;

  familyMembers.forEach(member => {
    const memberServiceIds = member.services?.map((s) => s.serviceId) ?? [];
    memberServices[member.id] = memberServiceIds;
    totalServicesCount += memberServiceIds.length;
  });

  if (totalServicesCount === 0 && catalogServices.length > 0) {
    totalServicesCount = catalogServices.length;
    memberServices['family'] = catalogServices;
  }

  useEffect(() => {
    updateDfaJourneyPhase('dfa', {
      visited: true,
      completed: totalServicesCount >= 3,
      resumePath: totalServicesCount >= 3 ? '/digital-footprint' : '/service-catalog',
    });
  }, [totalServicesCount]);

  if (totalServicesCount === 0) {
    return (
      <PageLayout
        title={FOOTPRINT_REVIEW_NAV_LABEL}
        subtitle="Scores come from apps you listed in the service catalog. Add at least three there to see your family's exposure—stories and guides work without that step."
        breadcrumbs={true}
      >
        <EmptyStateWithServicePrompt
          feature="Your family's digital footprint"
          description="Tap at least 3 apps your family uses in the app list. Then come back here to see your scores."
          minimumServices={3}
          icon={<BarChart3 size={24} className="text-white" />}
        />
      </PageLayout>
    );
  }

  const membersForAnalysis = familyMembers.length > 0 ? familyMembers : [{ id: 'family', services: catalogServices.map(id => ({ serviceId: id, status: 'approved' })) }];
  const analysis = footprintAnalyzer.analyzeFamilyFootprint(membersForAnalysis, memberServices);

  const handleExportPdf = async () => {
    if (!analysis || isExportingPdf) {return;}
    setIsExportingPdf(true);
    try {
      const tier = loadDfaScoreTier();
      const score = buildDfaScore(analysis, tier);
      await downloadDfaExecutiveSummary(analysis, score);
    } catch (error) {
      logger.error('Footprint review PDF export failed', error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const storyHref = '/stories/privacy-panda-and-the-digital-bamboo-forest';

  return (
    <PageLayout
      title={FOOTPRINT_REVIEW_NAV_LABEL}
      subtitle="Household scores from the apps you listed. Review exposure by service, download a summary, or update your app list for a fresher picture."
      breadcrumbs={true}
    >
      <section className="mb-6 overflow-hidden rounded-2xl border border-green-200 bg-green-50 shadow-sm dark:border-green-800/50 dark:bg-gray-800">
        <div className="px-4 pt-4 pb-3">
          <DfaJourneyStepper
            variant="strip"
            currentKey="dfa"
            embedded
            hideStripCta
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-green-200/80 bg-white/70 px-4 py-2.5 dark:border-green-800/50 dark:bg-gray-900/60">
          {analysis && (
            <button
              type="button"
              onClick={() => { void handleExportPdf(); }}
              disabled={isExportingPdf}
              aria-busy={isExportingPdf}
              aria-label="Download digital footprint report as PDF"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${dfaTheme.btnOutline}`}
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              {isExportingPdf ? 'Generating…' : 'Download PDF'}
            </button>
          )}
          <Link
            to="/service-catalog"
            className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/30"
          >
            Update app list
          </Link>
        </div>
      </section>

      {analysis && (
        <div className="mb-8 space-y-6">
          <DfaScoreOverview analysis={analysis} />
          <div className="grid gap-4 md:grid-cols-3">
            {[['Family score', `${analysis.familyScore}/100`], ['Privacy score', `${analysis.privacyScore}/100`], ['Services analyzed', `${analysis.totalServices}`]].map(([label, value]) => (
              <div key={label} className={`p-5 ${dfaTheme.cardLg}`}>
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-text-tertiary">{label}</div>
                <div className={`mt-2 text-3xl ${dfaTheme.titleBold}`}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <DigitalFootprintVisualizer />
      </div>

      <div className="mb-8 space-y-6">
        <DigitalFootprintEducator />
        <DfaMethodologyCallout />
      </div>

      {totalServicesCount < 5 && (
        <div className="mb-8 rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-5 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-700 dark:bg-green-600"><TrendingUp className="h-6 w-6 text-white" /></div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100">Improve your analysis</h3>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-800 dark:text-green-200">{totalServicesCount} of 5+ services</span>
              </div>
              <p className="mb-3 text-sm text-green-800 dark:text-green-200">You already have a usable footprint review. Add more services anytime for a fuller picture—or explore stories and Family Hub when you are ready.</p>
              <Link to="/service-catalog" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-300 px-4 py-2 font-semibold text-green-700 hover:bg-green-100/60 dark:border-green-700 dark:text-green-200 sm:w-auto">Add more services</Link>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 sm:p-6 ${dfaTheme.cardLg} border-green-200 dark:border-green-800/50`}>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className={`text-lg sm:text-xl ${dfaTheme.titleBold}`}>What to do with these scores</h2>
            <p className={`mt-2 text-sm leading-6 ${dfaTheme.bodySm}`}>
              Use the breakdown above to spot which listed apps collect the most data. Update your app list anytime, download a PDF for your records, or explore optional stories and Family Hub missions when you are ready to talk it through with kids.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/service-catalog"
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 sm:text-sm"
            >
              Update app list <ArrowRight size={14} aria-hidden />
            </Link>
            <Link
              to="/family-hub"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 sm:text-sm"
            >
              Family Hub missions
            </Link>
            <Link
              to="/for-families"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 sm:text-sm"
            >
              Parent guides
            </Link>
            <Link
              to={storyHref}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-green-700 hover:underline dark:text-green-400 sm:text-sm"
            >
              Privacy Panda stories
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DigitalFootprintPage;
