/**
 * Family big picture — a calm, two-minute look at where a child's information goes.
 * Route: /big-picture. Parents tick everyday kinds of apps; the result is plain words
 * and one next step — no scores. Nothing is sent anywhere or added to the app list.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ExternalLink, Gamepad2, GraduationCap, Home, MessageCircle, type LucideIcon } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { EDUSOLUCE_SCHOOLS_URL } from '../config/portal';
import {
  PICTURE_AGE_BANDS,
  PICTURE_AREAS,
  PICTURE_AREA_ORDER,
  PICTURE_KINDS,
  SCHOOL_QUESTIONS,
  type PictureAgeBand,
  type PictureAreaId,
  type PictureKindId,
} from '../data/familyBigPicture';
import { ORIGIN_STORY_SLUG } from '../data/stories';
import {
  AREA_LEVEL_LABEL,
  PICTURE_KIND_ORDER,
  buildFamilyPicture,
  loadFamilyPictureSelection,
  saveFamilyPictureSelection,
  type AreaLevel,
  type FamilyPictureSelection,
} from '../lib/familyBigPicture';
import { trackEvent } from '../lib/analytics';

const AREA_ICON: Record<PictureAreaId, LucideIcon> = {
  school: GraduationCap,
  play: Gamepad2,
  social: MessageCircle,
  home: Home,
};

const LEVEL_PILL: Record<AreaLevel, string> = {
  start: 'bg-green-700 text-white dark:bg-green-400 dark:text-gray-900',
  look: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  light: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  none: 'bg-transparent text-gray-400 dark:text-gray-500',
};

const CARD = 'rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 sm:p-6';
const H2 = 'text-lg font-bold text-gray-900 dark:text-gray-100';

const FamilyBigPicturePage: React.FC = () => {
  const [selection, setSelection] = useState<FamilyPictureSelection>(() => loadFamilyPictureSelection());
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveFamilyPictureSelection(selection);
  }, [selection]);

  useEffect(() => {
    if (showResult) {resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });}
  }, [showResult]);

  const picture = useMemo(() => buildFamilyPicture(selection), [selection]);
  const startArea = picture.startArea ? PICTURE_AREAS[picture.startArea] : null;

  const toggleKind = (id: PictureKindId) =>
    setSelection((prev) => ({
      ...prev,
      kinds: prev.kinds.includes(id) ? prev.kinds.filter((k) => k !== id) : [...prev.kinds, id],
    }));

  const toggleAge = (id: PictureAgeBand) =>
    setSelection((prev) => ({
      ...prev,
      ages: prev.ages.includes(id) ? prev.ages.filter((x) => x !== id) : [...prev.ages, id],
    }));

  const showPicture = () => {
    if (!picture.kinds.length) {return;}
    setShowResult(true);
    trackEvent('family_big_picture_viewed', { kinds: picture.kinds.length, start: picture.startArea });
  };

  return (
    <PageLayout
      title="Your family’s big picture"
      subtitle="Two minutes, no account. See where your child’s information goes and what to do first."
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {!showResult ? (
          <>
            <p className="text-gray-600 dark:text-gray-300">
              Tick the kinds of apps your child uses. You don’t need to know app names or settings. Your answers stay on
              this device.
            </p>

            <fieldset className="flex flex-wrap items-center gap-2">
              <legend className="mb-2 w-full text-sm font-semibold text-gray-900 dark:text-gray-100">
                How old are your children? <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
              </legend>
              {PICTURE_AGE_BANDS.map((band) => {
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
            </fieldset>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {PICTURE_AREA_ORDER.map((areaId) => {
                const Icon = AREA_ICON[areaId];
                return (
                  <fieldset key={areaId} className={CARD}>
                    <legend className="sr-only">{PICTURE_AREAS[areaId].name}</legend>
                    <p className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100" aria-hidden="true">
                      <Icon className="h-5 w-5 text-green-700 dark:text-green-400" />
                      {PICTURE_AREAS[areaId].name}
                    </p>
                    <ul className="m-0 mt-3 flex list-none flex-col gap-1 p-0">
                      {PICTURE_KIND_ORDER.filter((k) => PICTURE_KINDS[k].area === areaId).map((id) => (
                        <li key={id}>
                          <label className="flex cursor-pointer gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <input
                              type="checkbox"
                              className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-green-700 focus:ring-green-600"
                              checked={selection.kinds.includes(id)}
                              onChange={() => toggleKind(id)}
                            />
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{PICTURE_KINDS[id].name}</span>
                              <span className="block text-xs text-gray-500 dark:text-gray-400">{PICTURE_KINDS[id].examples}</span>
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                );
              })}
            </div>

            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={showPicture}
                disabled={!picture.kinds.length}
                className="button button-primary inline-flex min-h-[44px] items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Show our big picture
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              {!picture.kinds.length ? (
                <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">Tick at least one kind of app.</p>
              ) : null}
            </div>
          </>
        ) : (
          <div ref={resultRef} className="flex scroll-mt-24 flex-col gap-6">
            <button
              type="button"
              onClick={() => setShowResult(false)}
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-gray-600 hover:text-green-700 dark:text-gray-300 dark:hover:text-green-400"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Change my answers
            </button>

            <section aria-labelledby="bp-areas">
              <h2 id="bp-areas" className={H2}>Where your child’s information goes</h2>
              <ul className="m-0 mt-3 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
                {picture.areas.map((area) => {
                  const Icon = AREA_ICON[area.id];
                  const isStart = area.level === 'start';
                  return (
                    <li
                      key={area.id}
                      className={`rounded-2xl border p-4 ${
                        isStart
                          ? 'border-green-700 bg-green-50 dark:border-green-400 dark:bg-green-950'
                          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                          <Icon className="h-5 w-5 text-green-700 dark:text-green-400" aria-hidden />
                          {area.name}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_PILL[area.level]}`}>
                          {AREA_LEVEL_LABEL[area.level]}
                        </span>
                      </div>
                      {area.kinds.length ? (
                        <>
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">These apps usually know:</p>
                          <ul className="m-0 mt-1.5 flex list-none flex-wrap gap-1.5 p-0">
                            {area.knows.map((w) => (
                              <li key={w} className="rounded-full bg-white px-2.5 py-0.5 text-xs text-gray-800 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-600">
                                {w}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{area.decidedBy}.</p>
                        </>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className={CARD} aria-labelledby="bp-week">
              <h2 id="bp-week" className={H2}>This week</h2>
              <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm text-gray-800 dark:text-gray-100">
                {picture.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {startArea ? (
                <figure className="mt-5 rounded-xl bg-green-50 p-4 dark:bg-green-950">
                  <figcaption className="text-xs font-semibold uppercase tracking-wide text-green-800 dark:text-green-300">
                    Ask your child
                  </figcaption>
                  <blockquote className="mt-1 text-base text-gray-900 dark:text-gray-100">“{startArea.askYourChild}”</blockquote>
                </figure>
              ) : null}
            </section>

            {picture.ageNotes.length ? (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950" aria-labelledby="bp-age">
                <h2 id="bp-age" className="text-base font-bold text-amber-900 dark:text-amber-200">Good to know for their age</h2>
                <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm text-amber-900 dark:text-amber-100">
                  {picture.ageNotes.map((n) => (
                    <li key={n.id}>{n.text}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {picture.hasSchool ? (
              <details className={`${CARD} group`}>
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 font-semibold text-gray-900 dark:text-gray-100">
                  Questions to ask your child’s school
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" aria-hidden />
                </summary>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  You didn’t choose the school’s apps, but you can ask about them. These questions are fair for any teacher
                  or principal.
                </p>
                <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-gray-800 dark:text-gray-100">
                  {SCHOOL_QUESTIONS.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  If the school isn’t sure, EduSoluce helps schools answer these questions.{' '}
                  <a
                    href={EDUSOLUCE_SCHOOLS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('family_big_picture_edusoluce_click')}
                    className="inline-flex items-center gap-1 font-semibold text-green-700 underline underline-offset-2 dark:text-green-400"
                  >
                    Share EduSoluce with your school
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </p>
              </details>
            ) : null}

            <section className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/60 sm:p-6" aria-labelledby="bp-next">
              <h2 id="bp-next" className={H2}>Next: talk about it together</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                A short Privacy Panda story gives you and your child the same words for all of this.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to={`/stories/${ORIGIN_STORY_SLUG}`} className="button button-primary inline-flex min-h-[44px] items-center justify-center gap-2">
                  Read a story together
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link to="/family-hub/activities" className="touch-link text-sm font-semibold text-green-700 hover:underline dark:text-green-400">
                  Or practice with Family Hub missions
                </Link>
              </div>
              <p className="mt-4 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Want app-by-app detail? List your apps in the{' '}
                <Link to="/service-catalog" className="font-medium text-green-700 underline underline-offset-2 dark:text-green-400">
                  app list
                </Link>
                .
              </p>
            </section>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Based on what these kinds of apps usually collect — not on your child’s device or settings. Nothing is
              monitored or sent anywhere.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FamilyBigPicturePage;
