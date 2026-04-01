import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import FamilyPrivacyAssessment from '../components/FamilyPrivacyAssessment';
import DfaJourneyStepper from '../components/journey/DfaJourneyStepper';
import { updateDfaJourneyPhase } from '../lib/dfaJourney';

const PrivacyAssessmentPage: React.FC = () => {
  useEffect(() => {
    updateDfaJourneyPhase('plan', { visited: true, resumePath: '/privacy-assessment' });
  }, []);

  const handleAssessmentComplete = () => {
    updateDfaJourneyPhase('plan', { visited: true, completed: true, resumePath: '/family-hub/dashboard' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <DfaJourneyStepper currentKey="plan" compact ctaHref="/family-hub/dashboard" ctaLabel="Continue to Family Hub" subtitle="This phase turns DFA findings into action. Complete the assessment, then keep the plan alive inside Family Hub." />
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <ShieldCheck size={16} /> Phase 3 — Turn findings into action
              </div>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Privacy assessment</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Use this phase to prioritize what matters now. The point is not another abstract score — it is to decide what to fix first, what can wait, and what should move into the Family Hub.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/digital-footprint" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Review DFA</Link>
              <Link to="/family-hub/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700">Open Family Hub <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            ['Use your DFA results', 'Keep the assessment grounded in the actual services you already analyzed.'],
            ['Choose priorities', 'Focus on the most important family actions instead of trying to fix everything at once.'],
            ['Carry it forward', 'Save the plan into Family Hub so you can continue without redoing this work.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-1 text-emerald-600" />
                <div>
                  <h2 className="font-bold text-slate-900">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <FamilyPrivacyAssessment onComplete={handleAssessmentComplete} />

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Continue in Family Hub</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Once this phase is done, Family Hub becomes the place to keep progress visible for the family instead of letting the assessment disappear into a dead-end screen.</p>
            </div>
            <Link to="/family-hub/dashboard" onClick={handleAssessmentComplete} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
              <LayoutDashboard size={16} /> Continue to Family Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAssessmentPage;
