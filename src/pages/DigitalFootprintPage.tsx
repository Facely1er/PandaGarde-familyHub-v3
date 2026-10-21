import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, ArrowRight, BookOpen, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import DigitalFootprintVisualizer from '../components/DigitalFootprintVisualizer';
import FamilyActionPlan from '../components/FamilyActionPlan';
import FamilyPlanSteps from '../components/journey/FamilyPlanSteps';
import DfaScoreOverview from '../components/dfa/DfaScoreOverview';
import DfaMethodologyCallout from '../components/dfa/DfaMethodologyCallout';
import { useFamily } from '../contexts/FamilyContext';
import { footprintAnalyzer } from '../lib/footprintAnalyzer';
import { resetDfaJourney, updateDfaJourneyPhase } from '../lib/dfaJourney';
import { buildDfaScore, loadDfaScoreTier } from '../lib/dfaScoreEngine';
import { downloadDfaExecutiveSummary } from '../lib/dfaReport';
import { loadFamilyPictureSelection } from '../lib/familyBigPicture';
import { logger } from '../lib/logger';
import { dfaTheme } from '../styles/dfaTheme';

const DigitalFootprintEducator: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 overflow-hidden rounded-xl border-2 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
      <button type="button" onClick={() => setOpen(!open)} className="w-full p-4 text-left transition-colors hover:bg-green-100/50 dark:hover:bg-green-900/30" aria-expanded={open ? 'true' : 'false'}>
        <span className="flex w-full items-start justify-between gap-3 font-semibold text-green-900 dark:text-green-100">
          <span className="flex min-w-0 flex-1 items-start gap-2 text-sm sm:text-base">
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>What is a digital footprint, and why does it matter?</span>
          </span>
          {open ? <ChevronUp className="h-5 w-5 shrink-0" aria-hidden="true" /> : <ChevronDown className="h-5 w-5 shrink-0" aria-hidden="true" />}
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
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { familyMembers, getFamilyServices, removeServiceFromFamily } = useFamily();
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

  const pictureDone = loadFamilyPictureSelection().kinds.length > 0;

  if (totalServicesCount === 0) {
    return (
      <PageLayout
        title="Your action plan"
        subtitle="Step 3 of 3 — built from the apps your family uses."
        breadcrumbs={true}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <FamilyPlanSteps current="plan" done={{ picture: pictureDone }} />
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Pick your apps first</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Your plan is built from the apps your child actually uses. Pick them in the app list — it takes about three
              minutes — and your step-by-step plan appears here.
            </p>
            <Link to="/service-catalog" className="button button-primary mt-4 inline-flex min-h-[44px] items-center gap-2">
              Pick your apps
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
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

  const handleStartOver = async () => {
    if (isResetting) {return;}
    const confirmed = window.confirm(
      'Start over? This clears your app list and footprint review progress on this device. Family Hub and story progress are not affected.'
    );
    if (!confirmed) {return;}
    setIsResetting(true);
    try {
      for (const serviceId of getFamilyServices()) {
        await removeServiceFromFamily(serviceId);
      }
      resetDfaJourney();
      navigate('/service-catalog');
    } finally {
      setIsResetting(false);
    }
  };


  const hasScores = totalServicesCount >= 3;

  return (
    <PageLayout
      title="Your action plan"
      subtitle="Step 3 of 3 — what to do about the apps your family uses, most important first."
      breadcrumbs={true}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FamilyPlanSteps current="plan" done={{ picture: pictureDone, apps: true }} />
          <Link to="/service-catalog" className="touch-link text-sm font-semibold text-green-700 hover:underline dark:text-green-400">
            Add or remove apps
          </Link>
        </div>

        <FamilyActionPlan serviceIds={catalogServices.length ? catalogServices : Object.values(memberServices).flat()} />

        <details className="group rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 p-5 font-semibold text-gray-900 dark:text-gray-100">
            <span>
              Detailed footprint review
              <span className="block text-sm font-normal text-gray-500 dark:text-gray-400">
                Scores, data sharing and a PDF summary — optional, for parents who want the detail.
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" aria-hidden />
          </summary>
          <div className="border-t border-gray-200 p-5 dark:border-gray-700">
            {hasScores ? (
              <>
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { void handleExportPdf(); }}
                    disabled={isExportingPdf}
                    aria-busy={isExportingPdf}
                    aria-label="Download digital footprint report as PDF"
                    className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${dfaTheme.btnOutline}`}
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden />
                    {isExportingPdf ? 'Generating…' : 'Download PDF'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { void handleStartOver(); }}
                    disabled={isResetting}
                    aria-busy={isResetting}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-70 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                    {isResetting ? 'Clearing…' : 'Start over'}
                  </button>
                </div>
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
                <div className="mb-8">
                  <DigitalFootprintVisualizer />
                </div>
                <div className="space-y-6">
                  <DigitalFootprintEducator />
                  <DfaMethodologyCallout />
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Add at least three apps to see the detailed review. Your action plan above already works with any number of apps.
              </p>
            )}
          </div>
        </details>
      </div>
    </PageLayout>
  );
};

export default DigitalFootprintPage;
