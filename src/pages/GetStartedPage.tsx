import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, LayoutDashboard, ListChecks } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import DfaJourneyStepper from '../components/journey/DfaJourneyStepper';
import { getCoreDfaPhases, getOptionalDfaPhases, loadDfaJourneyState, updateDfaJourneyPhase, type DfaJourneyState } from '../lib/dfaJourney';

const GetStartedPage: React.FC = () => {
  const [journey, setJourney] = useState<DfaJourneyState>(() => loadDfaJourneyState());

  useEffect(() => {
    setJourney(updateDfaJourneyPhase('profile', { visited: true, resumePath: '/service-catalog' }));
  }, []);

  const corePhases = useMemo(() => getCoreDfaPhases(journey.phases), [journey.phases]);
  const optionalPhases = useMemo(() => getOptionalDfaPhases(journey.phases), [journey.phases]);
  const nextPhase = useMemo(
    () => corePhases.find((phase) => !phase.completed) ?? corePhases[corePhases.length - 1],
    [corePhases]
  );

  return (
    <PageLayout
      title="Start Your Digital Footprint Analysis Journey"
      subtitle="PandaGarde starts with parent-led Digital Footprint Analysis: three core phases on the website, saved locally. Family Hub is optional—for kids’ privacy missions, not required to finish DFA."
      breadcrumbs={true}
    >
      <section className="py-4 pb-8">
        <div className="mx-auto grid max-w-[1120px] gap-6">
          <DfaJourneyStepper currentKey="profile" ctaHref={nextPhase.path} ctaLabel={`Continue to ${nextPhase.title}`} />

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-200">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-950/50 dark:text-green-300">
                <Sparkles size={16} /> Low-friction family onboarding
              </div>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">The journey revolves around Digital Footprint Analysis</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
                Parents complete a focused sequence on the website: list family services, run Digital Footprint Analysis, then turn findings into a privacy action plan. Family Hub is a separate optional space for children’s missions—not a required step in DFA.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {corePhases.map((phase, index) => (
                  <div key={phase.key} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-100/60">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Phase {index + 1}</div>
                        <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">{phase.title}</h3>
                      </div>
                      {phase.completed ? <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" /> : <ListChecks size={20} className="text-sky-600 dark:text-sky-400" />}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{phase.description}</p>
                    <Link to={phase.path} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                      {phase.completed ? 'Review phase' : phase.visited ? 'Resume phase' : 'Start phase'} <ArrowRight size={15} />
                    </Link>
                  </div>
                ))}
              </div>
              {optionalPhases.length > 0 && (
                <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white/60 p-4 dark:border-gray-600 dark:bg-gray-900/30">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Optional</p>
                  {optionalPhases.map((phase) => (
                    <div key={phase.key} className="mt-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{phase.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{phase.description}</p>
                      <Link to={phase.path} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                        Open Family Hub <ArrowRight size={15} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-sky-50 p-6 shadow-sm dark:border-green-800/50 dark:from-green-950/40 dark:to-gray-900/40">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">What makes this easier</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3"><CheckCircle2 size={18} className="mt-1 flex-shrink-0 text-green-600 dark:text-green-400" /> Progress is saved locally on this device.</li>
                  <li className="flex gap-3"><CheckCircle2 size={18} className="mt-1 flex-shrink-0 text-green-600 dark:text-green-400" /> Families can stop after any phase and resume from the right place.</li>
                  <li className="flex gap-3"><CheckCircle2 size={18} className="mt-1 flex-shrink-0 text-green-600 dark:text-green-400" /> No backend or remote account is required for the core journey.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-200">
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Current status</div>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{journey.progressPercent}% complete</div>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{journey.progressPercent === 0 ? 'Start with your service catalog so the Digital Footprint Analysis has something real to analyze.' : 'Keep following the Digital Footprint Analysis-led path instead of jumping between disconnected pages.'}</p>
                <div className="mt-5 space-y-3">
                  <Link to={nextPhase.path} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500">
                    Continue to {nextPhase.title} <ArrowRight size={16} />
                  </Link>
                  <Link to="/family-hub" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
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
