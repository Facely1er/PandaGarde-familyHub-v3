import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { PICTURE_AREAS } from '../data/familyBigPicture';
import { ORIGIN_STORY_SLUG } from '../data/stories';
import { buildFamilyPicture, loadFamilyPictureSelection } from '../lib/familyBigPicture';
import {
  PLAN_PRIORITY_LABEL,
  PLAN_PRIORITY_ORDER,
  buildFamilyActionPlan,
  loadPlanProgress,
  planStepIds,
  savePlanProgress,
  type PlanPriority,
  type PlanStep,
} from '../lib/familyActionPlan';
import { getServiceLogoUrlWithBrandColor, hasServiceLogo } from '../utils/serviceLogos';
import { ProgressBar } from './ui/ProgressBar';

const PRIORITY_LEAD: Record<PlanPriority, string> = {
  first: 'These apps can share the most about your child. Start here.',
  next: 'Worth doing once the first ones are done.',
  later: 'Lower concern — a quick check is enough.',
};

const CARD = 'rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800';

const StepList: React.FC<{ steps: PlanStep[]; done: ReadonlySet<string>; onToggle: (id: string) => void }> = ({
  steps,
  done,
  onToggle,
}) => (
  <ul className="m-0 flex list-none flex-col gap-1 p-0">
    {steps.map((step) => (
      <li key={step.id}>
        <label className="flex cursor-pointer gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-green-700 focus:ring-green-600"
            checked={done.has(step.id)}
            onChange={() => onToggle(step.id)}
          />
          <span className={`text-sm ${done.has(step.id) ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
            {step.text}
          </span>
        </label>
      </li>
    ))}
  </ul>
);

interface Props {
  serviceIds: string[];
}

const FamilyActionPlan: React.FC<Props> = ({ serviceIds }) => {
  const picture = useMemo(() => buildFamilyPicture(loadFamilyPictureSelection()), []);
  const plan = useMemo(
    () => buildFamilyActionPlan({ serviceIds, ages: picture.ages, kinds: picture.kinds }),
    [serviceIds, picture]
  );
  const [done, setDone] = useState<Set<string>>(() => loadPlanProgress());

  useEffect(() => {
    savePlanProgress(done);
  }, [done]);

  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {next.delete(id);}
      else {next.add(id);}
      return next;
    });

  const doneCount = planStepIds(plan).filter((id) => done.has(id)).length;
  const percent = plan.totalSteps ? Math.round((doneCount / plan.totalSteps) * 100) : 0;
  const askArea = picture.startArea ? PICTURE_AREAS[picture.startArea] : null;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950 sm:p-6" aria-labelledby="plan-title">
        <h2 id="plan-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">Your family action plan</h2>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
          Built from the {plan.apps.length} app{plan.apps.length === 1 ? '' : 's'} you picked. Tick each step as you do it — your
          progress stays on this device.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <ProgressBar value={percent} size="sm" variant="low" aria-label="Action plan progress" className="h-2 w-full sm:max-w-xs" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100" aria-live="polite">
            {doneCount} of {plan.totalSteps} steps done
          </span>
        </div>
        {plan.totalSteps > 0 && doneCount === plan.totalSteps ? (
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-800 dark:text-green-300">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Every step done. Come back when your child starts a new app.
          </p>
        ) : null}
      </section>

      {PLAN_PRIORITY_ORDER.map((priority) => {
        const apps = plan.apps.filter((a) => a.priority === priority);
        if (!apps.length) {return null;}
        return (
          <section key={priority} aria-labelledby={`plan-${priority}`} className="flex flex-col gap-3">
            <div>
              <h3 id={`plan-${priority}`} className="text-lg font-bold text-gray-900 dark:text-gray-100">{PLAN_PRIORITY_LABEL[priority]}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{PRIORITY_LEAD[priority]}</p>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 lg:grid-cols-2">
              {apps.map((app) => {
                const appDone = app.steps.filter((s) => done.has(s.id)).length;
                return (
                  <li key={app.serviceId} className={CARD}>
                    <div className="flex items-center gap-3">
                      {hasServiceLogo(app.serviceId) ? (
                        <img src={getServiceLogoUrlWithBrandColor(app.serviceId) ?? undefined} alt="" className="h-8 w-8 rounded" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                      ) : null}
                      <h4 className="min-w-0 flex-1 text-base font-bold text-gray-900 dark:text-gray-100">{app.name}</h4>
                      <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">
                        {appDone === app.steps.length ? 'Done' : `${appDone} of ${app.steps.length}`}
                      </span>
                    </div>
                    {app.knows.length ? (
                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Good to know</p>
                        <ul className="mt-1 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                          {app.knows.map((k) => (
                            <li key={k}>{k}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {app.notes.map((note) => (
                      <p key={note} className="mt-2 flex gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                        {note}
                      </p>
                    ))}
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">What to do</p>
                    <StepList steps={app.steps} done={done} onToggle={toggle} />
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {plan.familySteps.length ? (
        <section className={CARD} aria-labelledby="plan-family">
          <h3 id="plan-family" className="text-lg font-bold text-gray-900 dark:text-gray-100">From your big picture</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">For parts of your child’s online life without a specific app in your list.</p>
          <div className="mt-2">
            <StepList steps={plan.familySteps.map((s) => ({ id: s.id, text: `${s.area}: ${s.text}` }))} done={done} onToggle={toggle} />
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/60 sm:p-6" aria-labelledby="plan-talk">
        <h3 id="plan-talk" className="text-lg font-bold text-gray-900 dark:text-gray-100">Talk about it together</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Settings help most when your child knows why. Ask one question, then read a short story together.
        </p>
        <blockquote className="mt-3 rounded-xl bg-white p-4 text-base text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          “{askArea ? askArea.askYourChild : 'Which app do you like most? Can you show me how it works?'}”
        </blockquote>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link to={`/stories/${ORIGIN_STORY_SLUG}`} className="button button-primary inline-flex min-h-[44px] items-center justify-center gap-2">
            Read a story together
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to="/family-hub/activities" className="touch-link text-sm font-semibold text-green-700 hover:underline dark:text-green-400">
            Or practice with Family Hub missions
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FamilyActionPlan;
