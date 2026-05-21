import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, LayoutDashboard, ListChecks } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import DfaJourneyStepper from '../components/journey/DfaJourneyStepper';
import { loadDfaJourneyState, updateDfaJourneyPhase, type DfaJourneyState } from '../lib/dfaJourney';

const GetStartedPage: React.FC = () => {
  const [journey, setJourney] = useState<DfaJourneyState>(() => loadDfaJourneyState());

  useEffect(() => {
    setJourney(updateDfaJourneyPhase('profile', { visited: true, resumePath: '/service-catalog' }));
  }, []);

  const nextPhase = useMemo(() => journey.phases.find((phase) => !phase.completed) ?? journey.phases[journey.phases.length - 1], [journey]);

  return (
    <PageLayout
      title="Start Your Digital Footprint Analysis Journey"
      subtitle="PandaGarde starts with Digital Footprint Analysis. Move through four phases, save progress locally, and resume without losing your place."
      breadcrumbs={true}
    >
      <section style={{ padding: '1rem 0 2rem' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: '1.5rem' }}>
          <DfaJourneyStepper currentKey="profile" ctaHref={nextPhase.path} ctaLabel={`Continue to ${nextPhase.title}`} />

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <Sparkles size={16} /> Low-friction family onboarding
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">The journey revolves around Digital Footprint Analysis</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                Instead of dropping families into a pile of tools, PandaGarde uses one sequence: choose the services you want analyzed, run Digital Footprint Analysis, turn findings into an action plan, then continue inside Family Hub.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {journey.phases.map((phase, index) => (
                  <div key={phase.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phase {index + 1}</div>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">{phase.title}</h3>
                      </div>
                      {phase.completed ? <CheckCircle2 size={20} className="text-emerald-600" /> : <ListChecks size={20} className="text-sky-600" />}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{phase.description}</p>
                    <Link to={phase.path} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                      {phase.completed ? 'Review phase' : phase.visited ? 'Resume phase' : 'Start phase'} <ArrowRight size={15} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">What makes this easier</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <li className="flex gap-3"><CheckCircle2 size={18} className="mt-1 flex-shrink-0 text-emerald-600" /> Progress is saved locally on this device.</li>
                  <li className="flex gap-3"><CheckCircle2 size={18} className="mt-1 flex-shrink-0 text-emerald-600" /> Families can stop after any phase and resume from the right place.</li>
                  <li className="flex gap-3"><CheckCircle2 size={18} className="mt-1 flex-shrink-0 text-emerald-600" /> No backend or remote account is required for the core journey.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Current status</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{journey.progressPercent}% complete</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{journey.progressPercent === 0 ? 'Start with your service catalog so the Digital Footprint Analysis has something real to analyze.' : 'Keep following the Digital Footprint Analysis-led path instead of jumping between disconnected pages.'}</p>
                <div className="mt-5 space-y-3">
                  <Link to={nextPhase.path} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-700">
                    Continue to {nextPhase.title} <ArrowRight size={16} />
                  </Link>
                  <Link to="/family-hub" target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                    <LayoutDashboard size={16} /> Open Family Hub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default GetStartedPage;
