/**
 * Family Snapshot — the two-minute "big picture" before the named-app footprint review.
 * Route: /family-snapshot. Parents tick kinds of services across school, play, social
 * and home; nothing is written to the service catalog and nothing leaves the device.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  ExternalLink,
  Gamepad2,
  GraduationCap,
  Home,
  MessageCircle,
  School,
  Share2,
  type LucideIcon,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { EDUSOLUCE_SCHOOLS_URL } from '../config/portal';
import {
  SCHOOL_QUESTIONS,
  SNAPSHOT_AGE_BANDS,
  SNAPSHOT_CONTEXTS,
  SNAPSHOT_CONTEXT_ORDER,
  SNAPSHOT_DATA,
  SNAPSHOT_KINDS,
  SNAPSHOT_TIER_NAME,
  type SnapshotAgeBand,
  type SnapshotContextId,
  type SnapshotDataTier,
  type SnapshotKindId,
} from '../data/familySnapshot';
import { loadDfaJourneyState } from '../lib/dfaJourney';
import {
  SNAPSHOT_KIND_ORDER,
  analyseFamilySnapshot,
  familySnapshotShareText,
  loadFamilySnapshotSelection,
  saveFamilySnapshotSelection,
  type FamilySnapshotSelection,
} from '../lib/familySnapshot';
import { trackEvent } from '../lib/analytics';

const SHARE_URL = 'https://pandagarde.com/family-snapshot';
const INVENTORY_TEASER_CAP = 6;

const CONTEXT_ICON: Record<SnapshotContextId, LucideIcon> = {
  school: GraduationCap,
  play: Gamepad2,
  social: MessageCircle,
  home: Home,
};

const TIER_CLASS: Record<SnapshotDataTier, string> = {
  4: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  3: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  2: 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  1: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const barClass = (score: number): string => {
  if (score >= 80) {return 'bg-red-500 dark:bg-red-400';}
  if (score >= 55) {return 'bg-orange-500 dark:bg-orange-400';}
  if (score >= 35) {return 'bg-amber-500 dark:bg-amber-400';}
  return 'bg-green-600 dark:bg-green-400';
};

const CARD = 'rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 sm:p-6';
const H2 = 'text-lg font-bold text-gray-900 dark:text-gray-100';
const MUTED = 'text-xs text-gray-500 dark:text-gray-400';

const Gauge: React.FC<{ score: number; label: string }> = ({ score, label }) => {
  const r = 72;
  const c = 2 * Math.PI * r;
  const len = c * 0.75;
  const fill = (len * score) / 100;
  return (
    <div className="relative mx-auto h-32 w-32 shrink-0" role="img" aria-label={label}>
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
        <circle cx="100" cy="100" r={r} fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-600" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${len} ${c}`} transform="rotate(135 100 100)" />
        <circle cx="100" cy="100" r={r} fill="none" stroke="currentColor" className="text-green-700 dark:text-green-400" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${fill} ${c}`} transform="rotate(135 100 100)" />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="text-4xl font-extrabold leading-none tabular-nums text-gray-900 dark:text-gray-100">{score}</span>
        <span className="mt-1 text-[0.65rem] uppercase tracking-widest text-gray-500 dark:text-gray-400">/ 100</span>
      </div>
    </div>
  );
};

type RoadmapStep = {
  title: string;
  detail: string;
  href: string;
  cta: string;
  done: boolean;
  external?: boolean;
};

const FamilySnapshotPage: React.FC = () => {
  const [selection, setSelection] = useState<FamilySnapshotSelection>(() => loadFamilySnapshotSelection());
  const [showReport, setShowReport] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);
  const journey = useMemo(() => loadDfaJourneyState(), []);

  useEffect(() => {
    saveFamilySnapshotSelection(selection);
  }, [selection]);

  useEffect(() => {
    if (showReport) {reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });}
  }, [showReport]);

  const a = useMemo(() => analyseFamilySnapshot(selection), [selection]);
  const teaserTypes = a.types.slice(0, INVENTORY_TEASER_CAP);
  const hiddenTypeCount = Math.max(0, a.types.length - teaserTypes.length);
  const hasSchool = a.schoolAssignedCount > 0;
  const [topCombo, ...otherCombos] = a.combos;

  const toggleKind = (id: SnapshotKindId) =>
    setSelection((prev) => ({
      ...prev,
      kinds: prev.kinds.includes(id) ? prev.kinds.filter((k) => k !== id) : [...prev.kinds, id],
    }));

  const toggleAge = (id: SnapshotAgeBand) =>
    setSelection((prev) => ({
      ...prev,
      ages: prev.ages.includes(id) ? prev.ages.filter((x) => x !== id) : [...prev.ages, id],
    }));

  const clearAll = () => {
    setSelection({ ages: [], kinds: [] });
    setShowReport(false);
  };

  const seeSnapshot = () => {
    if (!a.kinds.length) {return;}
    setShowReport(true);
    trackEvent('family_snapshot_viewed', { kinds: a.kinds.length, score: a.score, school: a.schoolAssignedCount });
  };

  const changeSelection = () => {
    setShowReport(false);
    setShareStatus('');
  };

  const shareText = useMemo(() => familySnapshotShareText(a, SHARE_URL), [a]);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus('Summary copied.');
    } catch {
      setShareStatus('Copy is blocked here. Use Share instead.');
    }
  }, [shareText]);
  const onShare = useCallback(async () => {
    try {
      if (navigator.share) {await navigator.share({ title: 'Our Family Snapshot', text: shareText });}
      else {await onCopy();}
    } catch {
      // Share sheet dismissed.
    }
  }, [shareText, onCopy]);

  const phaseDone = (key: 'profile' | 'dfa') => journey.phases.some((p) => p.key === key && p.completed);

  const roadmap: RoadmapStep[] = [
    {
      title: 'See the big picture',
      detail: 'Kinds of services across school, play, social and home.',
      href: '/family-snapshot',
      cta: 'You are here',
      done: true,
    },
    {
      title: 'Name your family’s apps',
      detail: 'Pick the actual apps from the catalog — each one comes with privacy notes and parent tips.',
      href: '/service-catalog',
      cta: phaseDone('profile') ? 'Review your apps' : 'Add your apps',
      done: phaseDone('profile'),
    },
    {
      title: 'Get your footprint review',
      detail: 'Scores per app, data-broker reach, and what to fix first.',
      href: '/digital-footprint',
      cta: phaseDone('dfa') ? 'View your review' : 'Open footprint review',
      done: phaseDone('dfa'),
    },
    {
      title: 'Talk and practice together',
      detail: 'A Privacy Panda story to read together, then age-matched missions in Family Hub.',
      href: '/family-hub/activities',
      cta: 'Start missions',
      done: false,
    },
  ];
  if (hasSchool) {
    roadmap.push({
      title: 'Bring the school in',
      detail: 'Ask the five questions below and share EduSoluce with your school’s privacy lead.',
      href: '#school-questions',
      cta: 'See the questions',
      done: false,
    });
  }

  return (
    <PageLayout
      title="Family Snapshot"
      subtitle="Two minutes to see where your child’s data goes — at school, in games, on social apps and at home."
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {!showReport ? (
          <>
            <p className="max-w-3xl text-gray-600 dark:text-gray-300">
              Tick the <strong>kinds</strong> of services your child uses — no app names, no account. You get an
              exposure overview and where to start. It runs in your browser; nothing is sent anywhere.
            </p>

            <fieldset className={CARD}>
              <legend className="sr-only">Your children’s ages</legend>
              <p className={H2} aria-hidden="true">Your children’s ages</p>
              <p className={`${MUTED} mt-1`}>Optional — tick all that apply. Used for age-specific notes only.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SNAPSHOT_AGE_BANDS.map((band) => {
                  const on = selection.ages.includes(band.id);
                  return (
                    <label
                      key={band.id}
                      className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-green-600 ${
                        on
                          ? 'border-green-700 bg-green-50 text-green-800 dark:border-green-400 dark:bg-green-950 dark:text-green-300'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleAge(band.id)} />
                      {on ? <Check className="h-4 w-4" aria-hidden /> : null}
                      {band.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {SNAPSHOT_CONTEXT_ORDER.map((ctxId) => {
              const ctx = SNAPSHOT_CONTEXTS[ctxId];
              const Icon = CONTEXT_ICON[ctxId];
              const kinds = SNAPSHOT_KIND_ORDER.filter((k) => SNAPSHOT_KINDS[k].context === ctxId);
              return (
                <fieldset key={ctxId} className="flex flex-col gap-3">
                  <legend className="sr-only">{ctx.name}</legend>
                  <div className="flex items-start gap-3" aria-hidden="true">
                    <span className="mt-0.5 rounded-xl bg-green-50 p-2 text-green-700 dark:bg-green-950 dark:text-green-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className={H2}>{ctx.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {ctx.lede} <span className="text-gray-500 dark:text-gray-400">· {ctx.decidedBy}</span>
                      </p>
                    </div>
                  </div>
                  <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
                    {kinds.map((id) => {
                      const kind = SNAPSHOT_KINDS[id];
                      const on = selection.kinds.includes(id);
                      return (
                        <li key={id}>
                          <label
                            className={`flex h-full cursor-pointer gap-3 rounded-xl border p-3 transition-colors focus-within:ring-2 focus-within:ring-green-600 ${
                              on
                                ? 'border-green-700 bg-green-50 dark:border-green-400 dark:bg-green-950'
                                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-green-700 focus:ring-green-600"
                              checked={on}
                              onChange={() => toggleKind(id)}
                            />
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{kind.name}</span>
                              <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{kind.examples}</span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              );
            })}

            <div className="sticky bottom-2 z-10 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={seeSnapshot}
                disabled={!a.kinds.length}
                className="button button-primary inline-flex min-h-[44px] items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                See our big picture
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
                {a.kinds.length
                  ? `${a.kinds.length} kind${a.kinds.length === 1 ? '' : 's'} of services selected`
                  : 'Pick at least one kind of service.'}
              </p>
              {a.kinds.length || a.ages.length ? (
                <button type="button" onClick={clearAll} className="text-sm font-medium text-green-700 underline underline-offset-2 dark:text-green-400 sm:ml-auto">
                  Clear
                </button>
              ) : null}
            </div>
            <p className={MUTED}>
              Based on what services of each kind typically collect. Your child’s actual exposure depends on each app
              and its settings — the footprint review looks at the named apps.
            </p>
          </>
        ) : (
          <div ref={reportRef} className="flex scroll-mt-24 flex-col gap-5">
            <button
              type="button"
              onClick={changeSelection}
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-gray-600 hover:text-green-700 dark:text-gray-300 dark:hover:text-green-400"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Change selection
            </button>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
              <section className={`${CARD} lg:col-span-2`} aria-labelledby="fs-score">
                <h2 id="fs-score" className="sr-only">Overall exposure</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <Gauge score={a.score} label={`Exposure ${a.score} out of 100, ${a.band.label}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-green-700 dark:text-green-400">
                      {a.band.label} exposure
                    </p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{a.band.line}</p>
                    <p className={`${MUTED} mt-2`}>
                      {a.kinds.length} kinds · {a.types.length} data types · {a.critical.length} critical
                    </p>
                  </div>
                </div>
                {hasSchool ? (
                  <p className="mt-4 flex gap-2 rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-950 dark:text-sky-200">
                    <School className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span>
                      <strong>{a.schoolAssignedCount}</strong> of these kinds are usually chosen by the school, not by
                      you.
                    </span>
                  </p>
                ) : null}
              </section>

              <section className={`${CARD} lg:col-span-3`} aria-labelledby="fs-contexts">
                <h2 id="fs-contexts" className={H2}>Where exposure builds up</h2>
                <p className={`${MUTED} mt-1`}>Each part of your child’s online life, scored against every kind in it.</p>
                <ul className="mt-4 flex flex-col gap-4">
                  {a.contexts.map((c) => {
                    const Icon = CONTEXT_ICON[c.id];
                    return (
                      <li key={c.id}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="inline-flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                            <Icon className="h-4 w-4 text-green-700 dark:text-green-400" aria-hidden />
                            {c.name}
                          </span>
                          <span className="tabular-nums text-gray-600 dark:text-gray-300">
                            {c.kinds.length ? `${c.score}/100` : 'Not ticked'}
                          </span>
                        </div>
                        <div
                          className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
                          role="meter"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={c.score}
                          aria-label={`${c.name} exposure`}
                        >
                          <div className={`h-full rounded-full ${barClass(c.score)}`} style={{ width: `${c.score}%` }} />
                        </div>
                        {c.kinds.length ? (
                          <p className={`${MUTED} mt-1`}>
                            {c.decidedBy}. {c.lever}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>

            {a.ageFlags.length ? (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950 sm:p-6" aria-labelledby="fs-age">
                <h2 id="fs-age" className="text-lg font-bold text-amber-900 dark:text-amber-200">For your children’s ages</h2>
                <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm text-amber-900 dark:text-amber-100">
                  {a.ageFlags.map((f) => (
                    <li key={f.id}>{f.text}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <section className={CARD} aria-labelledby="fs-inventory">
                <h2 id="fs-inventory" className={H2}>What these services typically hold</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {teaserTypes.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 w-16 shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold ${TIER_CLASS[SNAPSHOT_DATA[d].tier]}`}>
                        {SNAPSHOT_TIER_NAME[SNAPSHOT_DATA[d].tier]}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-gray-900 dark:text-gray-100">{SNAPSHOT_DATA[d].label}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">{SNAPSHOT_DATA[d].note}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                {hiddenTypeCount > 0 ? (
                  <p className={`${MUTED} mt-3`}>+ {hiddenTypeCount} more data types. The footprint review shows which named apps hold each one.</p>
                ) : null}
              </section>

              <section className={CARD} aria-labelledby="fs-start">
                <h2 id="fs-start" className={H2}>Where to start this week</h2>
                <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm text-gray-800 dark:text-gray-100">
                  {a.nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                {topCombo ? (
                  <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Why it matters: {topCombo.title}</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{topCombo.text}</p>
                    {otherCombos.length ? (
                      <p className={`${MUTED} mt-1`}>Also: {otherCombos.map((c) => c.title).join(' · ')}</p>
                    ) : null}
                  </div>
                ) : null}
              </section>
            </div>

            {hasSchool ? (
              <section id="school-questions" className={`${CARD} scroll-mt-24`} aria-labelledby="fs-school">
                <div className="flex items-start gap-3">
                  <span className="rounded-xl bg-sky-50 p-2 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <School className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 id="fs-school" className={H2}>Questions to ask your child’s school</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      School apps are the part of your child’s footprint you didn’t choose. These questions are fair to
                      ask any teacher, principal or district privacy contact.
                    </p>
                  </div>
                </div>
                <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-sm text-gray-800 dark:text-gray-100">
                  {SCHOOL_QUESTIONS.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
                <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950">
                  <p className="text-sm text-sky-900 dark:text-sky-100">
                    <strong>No clear answers?</strong> EduSoluce helps schools keep a vendor list, data agreements and
                    parent data-rights requests in one place. Share it with your school’s privacy lead.
                  </p>
                  <a
                    href={EDUSOLUCE_SCHOOLS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('family_snapshot_edusoluce_click')}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-800 underline underline-offset-2 dark:text-sky-300"
                  >
                    EduSoluce for schools
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </section>
            ) : null}

            <section className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950 sm:p-6" aria-labelledby="fs-path">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-700 dark:text-green-400">Your path from here</p>
              <h2 id="fs-path" className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                From big picture to a plan your family actually follows
              </h2>
              <ol className="mt-4 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
                {roadmap.map((step, i) => {
                  const StatusIcon = step.done ? CheckCircle2 : Circle;
                  const linkClass =
                    'mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline dark:text-green-400';
                  return (
                    <li key={step.title} className="flex gap-3 rounded-xl border border-green-100 bg-white p-4 dark:border-green-900 dark:bg-gray-800">
                      <StatusIcon
                        className={`mt-0.5 h-5 w-5 shrink-0 ${step.done ? 'text-green-700 dark:text-green-400' : 'text-gray-300 dark:text-gray-600'}`}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          <span className="sr-only">{step.done ? 'Done: ' : `Step ${i + 1}: `}</span>
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">{step.detail}</p>
                        {i === 0 ? (
                          <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">{step.cta}</p>
                        ) : step.href.startsWith('#') ? (
                          <a href={step.href} className={linkClass}>
                            {step.cta}
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                          </a>
                        ) : (
                          <Link to={step.href} className={linkClass}>
                            {step.cta}
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/service-catalog" className="button button-primary inline-flex min-h-[44px] items-center justify-center gap-2">
                  Next: name your family’s apps
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <div className="flex gap-2">
                  <button type="button" onClick={onCopy} className="button button-secondary inline-flex min-h-[44px] items-center gap-1.5">
                    <Copy className="h-4 w-4" aria-hidden /> Copy summary
                  </button>
                  <button type="button" onClick={onShare} className="button button-secondary inline-flex min-h-[44px] items-center gap-1.5">
                    <Share2 className="h-4 w-4" aria-hidden /> Share
                  </button>
                </div>
              </div>
              {shareStatus ? (
                <p className="mt-2 flex items-center gap-1 text-xs text-green-700 dark:text-green-400" role="status">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  {shareStatus}
                </p>
              ) : null}
            </section>

            <p className={MUTED}>
              This is an educational overview of what services of each kind typically collect — not monitoring, and
              not a compliance audit. Your selection stays on this device.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FamilySnapshotPage;
