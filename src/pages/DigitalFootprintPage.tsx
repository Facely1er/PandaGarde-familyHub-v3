import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ShoppingBag, ArrowRight, BarChart3, TrendingUp, LayoutDashboard, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
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
          <p><strong>How to use this page:</strong> review the privacy score, identify higher-exposure services, then continue straight into assessment so you can act on what you just learned.</p>
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
      completed: true,
      resumePath: totalServicesCount >= 3 ? '/privacy-assessment' : '/service-catalog',
    });
  }, [totalServicesCount]);

  if (totalServicesCount === 0) {
    return (
      <EmptyStateWithServicePrompt
        feature="Your family's digital footprint"
        description="See how your family's data is used across school, home, and everyday apps. Add at least 3 services first so the Digital Footprint Analysis has something real to analyze."
        minimumServices={3}
        icon={<BarChart3 size={24} className="text-white" />}
      />
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 text-gray-900 dark:bg-[var(--white)] dark:text-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <DfaJourneyStepper currentKey="dfa" compact ctaHref={totalServicesCount >= 3 ? '/privacy-assessment' : '/service-catalog'} ctaLabel={totalServicesCount >= 3 ? 'Continue to assessment' : 'Add more services'} subtitle="This is the core PandaGarde phase. Review the footprint, then move directly into action planning instead of losing momentum." />
        </div>

        <div className="mb-8">
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">Current phase:</span> Digital Footprint Analysis results
            {' · '}
            <Link to="/get-started" className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline dark:text-blue-400">
              <ShoppingBag size={14} /> Review overall journey
            </Link>
          </p>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/service-catalog" className="inline-flex items-center gap-2 font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                <ArrowLeft size={16} /> Service Catalog
              </Link>
              <Link to="/family-hub" className="inline-flex items-center gap-2 font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                <LayoutDashboard size={16} /> Family Hub
              </Link>
            </div>
            {analysis && (
              <button
                type="button"
                onClick={() => { void handleExportPdf(); }}
                disabled={isExportingPdf}
                aria-busy={isExportingPdf}
                aria-label="Download digital footprint report as PDF"
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Download className="h-4 w-4" aria-hidden />
                <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>
            )}
          </div>
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Your family's digital footprint</h1>
            <p className="text-gray-600 dark:text-gray-400">Review where exposure is building across apps and services, compare the Basic and Advanced Digital Footprint Analysis scores, then continue straight into privacy assessment while the context is still fresh.</p>
          </div>
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
                <p className="mb-3 text-sm text-blue-800 dark:text-blue-200">You already have a usable Digital Footprint Analysis. Add more services later if you want a broader household view, but you do not need to wait to continue into assessment.</p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/privacy-assessment" className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">Continue to assessment <ArrowRight size={16} /></Link>
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
              <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-600 dark:bg-gray-200">
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-600">{label}</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        )}

        <DigitalFootprintVisualizer />

        <div className="mt-8 rounded-2xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-800/50 dark:bg-gray-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Turn this into action</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-700">Do not stop at the visualization. Continue into the assessment phase to translate the footprint into priorities, actions, and Family Hub continuity.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/privacy-assessment" className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500">Continue to assessment <ArrowRight size={16} /></Link>
              <Link to="/family-hub" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-700 dark:hover:bg-gray-300">Open Family Hub</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalFootprintPage;
