import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react';
import FamilyPrivacyAssessment from '../components/FamilyPrivacyAssessment';
import DfaJourneyStepper from '../components/journey/DfaJourneyStepper';
import {
  DFA_PHASE_THREE_KIDS_RESOURCES,
  DFA_PHASE_THREE_PARENT_RESOURCES,
} from '../data/dfaPhaseThreeResources';
import { JOURNAL_PUBLISHED } from '../data/siteNavigation';
import { updateDfaJourneyPhase } from '../lib/dfaJourney';
import { dfaTheme } from '../styles/dfaTheme';

const resourceLinkClass =
  'block rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:border-green-300 hover:bg-green-50/50 dark:border-dark-border dark:bg-dark-surface dark:hover:border-green-700/60 dark:hover:bg-gray-300';

const PrivacyAssessmentPage: React.FC = () => {
  useEffect(() => {
    updateDfaJourneyPhase('plan', { visited: true, resumePath: '/privacy-assessment' });
  }, []);

  const handleAssessmentComplete = () => {
    updateDfaJourneyPhase('plan', {
      visited: true,
      completed: true,
      resumePath: '/digital-footprint',
    });
  };

  return (
    <div className={dfaTheme.page}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className={`mb-6 overflow-hidden ${dfaTheme.cardLg}`}>
          <div className={`${dfaTheme.band} px-5 py-3 sm:px-6`}>
            <p className={`text-sm leading-relaxed ${dfaTheme.bodySm}`}>
              <span className={`font-medium ${dfaTheme.title}`}>DFA journey:</span>{' '}
              <Link to="/service-catalog" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Phase 1
              </Link>
              {' → '}
              <Link to="/digital-footprint" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Phase 2
              </Link>
              {' → '}
              <span className="font-medium text-green-700 dark:text-green-400">Phase 3</span>
            </p>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100">
              <ShieldCheck size={16} aria-hidden />
              Phase 3 — Parent assessment
            </div>
            <h1 className={`mt-3 text-2xl tracking-tight sm:text-3xl ${dfaTheme.titleBold}`}>
              Family privacy assessment
            </h1>
            <p className={`mt-2 max-w-3xl sm:text-base ${dfaTheme.bodySm}`}>
              Answer the questions below from your DFA results. Guides and stories are available after—you do not need
              Family Hub to finish this phase.
            </p>
            <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="Related pages">
              <Link to="/digital-footprint" className={`inline-flex items-center gap-1.5 ${dfaTheme.link}`}>
                <BarChart3 size={15} aria-hidden />
                Footprint review
              </Link>
              <Link
                to="/for-families"
                className="inline-flex items-center gap-1.5 font-medium text-green-700 hover:underline dark:text-green-400"
              >
                <ShieldCheck size={15} aria-hidden />
                Resources
              </Link>
              <Link
                to="/digital-rights"
                className="inline-flex items-center gap-1.5 font-medium text-green-700 hover:underline dark:text-green-400"
              >
                <Scale size={15} aria-hidden />
                Digital privacy rights
              </Link>
              <Link
                to="/for-families"
                className="inline-flex items-center gap-1.5 font-medium text-green-700 hover:underline dark:text-green-400"
              >
                <BookOpen size={15} aria-hidden />
                All resources
              </Link>
            </nav>

            <DfaJourneyStepper
              variant="strip"
              currentKey="plan"
              ctaHref="/digital-footprint"
              ctaLabel="Review DFA results"
              className="mt-4 border-t-0 pt-0"
            />
          </div>
        </header>

        <section
          id="family-privacy-assessment"
          className={`scroll-mt-24 p-5 sm:p-6 ${dfaTheme.cardLg}`}
          aria-labelledby="assessment-heading"
        >
          <h2 id="assessment-heading" className={`text-lg sm:text-xl ${dfaTheme.titleBold}`}>
            Complete your assessment
          </h2>
          <p className={`mt-1 ${dfaTheme.bodySm}`}>
            Progress saves on this device. You can retake or download a PDF when finished.
          </p>
          <div className="mt-5">
            <FamilyPrivacyAssessment onComplete={handleAssessmentComplete} />
          </div>
        </section>

        <details className={`group mt-6 overflow-hidden ${dfaTheme.cardLg} border-green-200 dark:border-green-800/50`}>
          <summary
            className={`flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 marker:content-none sm:px-6 ${dfaTheme.titleBold}`}
          >
            <span>Website resources for parents &amp; children</span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180 dark:text-dark-text-tertiary"
              aria-hidden
            />
          </summary>
          <div className="border-t border-green-100 px-5 pb-5 pt-4 dark:border-green-900/40 sm:px-6 sm:pb-6">
            <p className={dfaTheme.bodySm}>
              Use these after or alongside the assessment—parent guides, Privacy Panda stories, and Family Hub
              missions.
            </p>

            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-text-tertiary">
                  <Users size={14} aria-hidden />
                  For parents
                </h3>
                <ul className="mt-2 space-y-2">
                  {DFA_PHASE_THREE_PARENT_RESOURCES.map((item) => (
                    <li key={item.href}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={resourceLinkClass}
                        >
                          <span className={`font-semibold ${dfaTheme.title}`}>{item.label}</span>
                          <span className={`mt-0.5 block ${dfaTheme.bodySm}`}>{item.description}</span>
                          <span className="sr-only"> (opens in new tab)</span>
                        </a>
                      ) : (
                        <Link to={item.href} className={resourceLinkClass}>
                          <span className={`font-semibold ${dfaTheme.title}`}>{item.label}</span>
                          <span className={`mt-0.5 block ${dfaTheme.bodySm}`}>{item.description}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-text-tertiary">
                  <BookOpen size={14} aria-hidden />
                  For children
                </h3>
                <ul className="mt-2 space-y-2">
                  {DFA_PHASE_THREE_KIDS_RESOURCES.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={`${resourceLinkClass} hover:border-sky-300 hover:bg-sky-50/50 dark:hover:border-sky-700/60 dark:hover:bg-sky-950/30`}
                      >
                        <span className={`font-semibold ${dfaTheme.title}`}>{item.label}</span>
                        <span className={`mt-0.5 block ${dfaTheme.bodySm}`}>{item.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {JOURNAL_PUBLISHED ? (
              <div className="mt-4 rounded-lg border border-dashed border-amber-300 bg-amber-50/80 p-3 dark:border-amber-700/60 dark:bg-amber-950/30">
                <p className={`text-sm font-semibold ${dfaTheme.title}`}>Digital Bamboo Journal</p>
                <p className={`mt-1 text-xs ${dfaTheme.bodySm}`}>
                  A separate journal site for reflection and follow-up—aligned with PandaGarde stories, not required to
                  finish DFA.
                </p>
                <a
                  href="https://journal.pandagarde.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-900 hover:underline dark:text-amber-200"
                >
                  Open journal
                  <ExternalLink size={14} aria-hidden />
                </a>
              </div>
            ) : null}
          </div>
        </details>

        <div className={`mt-6 p-5 sm:p-6 ${dfaTheme.cardMuted}`}>
          <h2 className={`text-base ${dfaTheme.titleBold}`}>Optional: Family Hub</h2>
          <p className={`mt-1 ${dfaTheme.bodySm}`}>
            Device-local privacy missions for kids—separate from the website assessment above.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link to="/stories" className={dfaTheme.btnOutline}>
              <BookOpen size={15} aria-hidden />
              Stories
            </Link>
            <Link to="/family-hub/dashboard" className={dfaTheme.btnOutline}>
              <LayoutDashboard size={15} aria-hidden />
              Family Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAssessmentPage;
