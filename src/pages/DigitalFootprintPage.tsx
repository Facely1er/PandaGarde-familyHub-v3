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
    <div className="mb-6 overflow-hidden rounded-xl border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20">
      <button type="button" onClick={() => setOpen(!open)} className="w-full p-4 text-left transition-colors hover:bg-blue-100/50 dark:hover:bg-blue-900/30" aria-expanded={open ? 'true' : 'false'}>
        <span className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-100">
          <span className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> What is a digital footprint, and why does it matter?</span>
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </button>
      {open && (
        <div className="space-y-4 px-4 pb-4 pt-0 text-sm text-blue-900 dark:text-blue-200">
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
      resumePath: totalServicesCount >= 3 ? '/stories' : '/service-catalog',
    });
  }, [totalServicesCount]);

  if (totalServicesCount === 0) {
    return (
      <PageLayout
        title={FOOTPRINT_REVIEW_NAV_LABEL}
        subtitle="Scores come from apps you listed in the service catalog. Add at least three there if this page is empty—stories and guides work without that step."
        breadcrumbs={true}
      >
        <EmptyStateWithServicePrompt
          feature="Your family's digital footprint"
          description="Add at least 3 services in the service catalog so Digital Footprint Analysis has something real to analyze."
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
      logger.error('DFA PDF export failed', error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const nextPhaseHref =
    totalServicesCount >= 3 ? `/stories/privacy-panda-and-the-digital-bamboo-forest` : '/service-catalog';
  const nextPhaseLabel = totalServicesCount >= 3 ? 'Read Privacy Panda story' : 'Add more services';

  return (
    <PageLayout
      title={FOOTPRINT_REVIEW_NAV_LABEL}
      subtitle="Review where exposure is building across the apps and services you listed. Compare Basic and Advanced scores, then continue when you are ready."
      breadcrumbs={true}
    >
      <DfaJourneyStepper
        variant="strip"
        currentKey="dfa"
        ctaHref={nextPhaseHref}
        ctaLabel={nextPhaseLabel}
        className="mb-6"
      />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        {analysis && (
          <button
            type="button"
            onClick={() => { void handleExportPdf(); }}
            disabled={isExportingPdf}
            aria-busy={isExportingPdf}
            aria-label="Download digital footprint report as PDF"
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${dfaTheme.btnOutline}`}
          >
            <Download className="h-4 w-4" aria-hidden />
            {isExportingPdf ? 'Generating PDF…' : 'Download PDF'}
          </button>
        )}
        <Link
          to={nextPhaseHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
        >
          {nextPhaseLabel}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      <DigitalFootprintEducator />

        <DfaMethodologyCallout />

        {totalServicesCount < 5 && (
          <div className="mb-6 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600"><TrendingUp className="h-6 w-6 text-white" /></div>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Improve your analysis</h3>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-200">{totalServicesCount} of 5+ services</span>
                </div>
                <p className="mb-3 text-sm text-blue-800 dark:text-blue-200">You already have a usable footprint review. Add more services anytime—or explore stories and Family Hub when you are ready.</p>
                <div className="flex flex-wrap gap-3">
                  <Link to={nextPhaseHref} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">{nextPhaseLabel} <ArrowRight size={16} /></Link>
                  <Link to="/service-catalog" className="inline-flex items-center gap-2 rounded-lg border border-blue-300 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100/60 dark:border-blue-700 dark:text-blue-200">Add more services</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {analysis && <DfaScoreOverview analysis={analysis} />}

        {analysis && (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {[['Family score', `${analysis.familyScore}/100`], ['Privacy score', `${analysis.privacyScore}/100`], ['Services analyzed', `${analysis.totalServices}`]].map(([label, value]) => (
              <div key={label} className={`p-5 ${dfaTheme.cardLg}`}>
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-text-tertiary">{label}</div>
                <div className={`mt-2 text-3xl ${dfaTheme.titleBold}`}>{value}</div>
              </div>
            ))}
          </div>
        )}

        <DigitalFootprintVisualizer />

        <div className={`mt-8 p-6 ${dfaTheme.cardLg} border-green-200 dark:border-green-800/50`}>
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`text-xl ${dfaTheme.titleBold}`}>When you are ready — not before</h2>
              <p className={`mt-2 text-sm leading-6 ${dfaTheme.bodySm}`}>
                Your footprint review is complete on PandaGarde. Explore stories with your kids, open Family Hub for missions, or browse guides—all optional and saved on this device.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={nextPhaseHref}
                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
              >
                {nextPhaseLabel} <ArrowRight size={16} aria-hidden />
              </Link>
              <Link
                to="/family-hub"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Family Hub
              </Link>
              <Link
                to="/for-families"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Guides
              </Link>
            </div>
          </div>
        </div>
    </PageLayout>
  );
};

export default DigitalFootprintPage;
