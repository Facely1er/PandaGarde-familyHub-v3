import React, { useEffect, useId, useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, RotateCcw, Sparkles } from 'lucide-react';
import PremiumMissionHint from './PremiumMissionHint';
import type { ParentScenarioInput } from '../../lib/missionScenarioConfig';
import type { ResolvedMissionScenario } from '../../lib/personalizeActivity';
import type { FlattenedAgeBasedActivity } from '../../data/ageBasedActivities';

const SOURCE_LABELS: Record<ResolvedMissionScenario['source'], string> = {
  baseline: 'Default example',
  'parent-custom': 'Your custom scenario',
  'parent-template': 'Personalized with your input',
  'dfa-template': 'Personalized from your app list',
  'generic-template': 'Personalized template',
};

interface MissionScenarioCustomizeProps {
  activity: FlattenedAgeBasedActivity;
  scenario: ResolvedMissionScenario;
  isPremium: boolean;
  parentInput?: ParentScenarioInput;
  onSave: (input: ParentScenarioInput) => void;
  onClear: () => void;
  hasFootprintData: boolean;
}

const MissionScenarioCustomize: React.FC<MissionScenarioCustomizeProps> = ({
  activity,
  scenario,
  isPremium,
  parentInput,
  onSave,
  onClear,
  hasFootprintData,
}) => {
  const formId = useId();
  const [expanded, setExpanded] = useState(false);
  const [appName, setAppName] = useState(parentInput?.appName ?? '');
  const [childName, setChildName] = useState(parentInput?.childName ?? '');
  const [usageFrequency, setUsageFrequency] = useState(parentInput?.usageFrequency ?? '');
  const [customScenario, setCustomScenario] = useState(parentInput?.customScenario ?? '');
  const [parentNote, setParentNote] = useState(parentInput?.parentNote ?? '');

  useEffect(() => {
    setAppName(parentInput?.appName ?? '');
    setChildName(parentInput?.childName ?? '');
    setUsageFrequency(parentInput?.usageFrequency ?? '');
    setCustomScenario(parentInput?.customScenario ?? '');
    setParentNote(parentInput?.parentNote ?? '');
  }, [parentInput, activity.id]);

  if (!isPremium) {
    return <PremiumMissionHint />;
  }

  const handleSave = () => {
    onSave({ appName, childName, usageFrequency, customScenario, parentNote });
    setExpanded(false);
  };

  const hasTemplate = Boolean(activity.scenarioTemplate);

  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-700/40 dark:bg-violet-900/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
            <Sparkles size={14} aria-hidden="true" />
            Premium · tailor this scenario
          </p>
          <p className="mt-1 text-sm text-violet-950 dark:text-violet-100">
            Add your child&apos;s app or write your own situation so the conversation fits your family.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-violet-600 dark:bg-violet-950/40 dark:text-violet-100 dark:hover:bg-violet-900/40"
          aria-expanded={expanded}
          aria-controls={`${formId}-panel`}
        >
          <Pencil size={14} aria-hidden="true" />
          Customize
          {expanded ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
        </button>
      </div>

      {scenario.isPersonalized && (
        <p className="mt-3 text-xs font-medium text-violet-700 dark:text-violet-300">
          {SOURCE_LABELS[scenario.source]}
          {scenario.appName ? ` · ${scenario.appName}` : ''}
        </p>
      )}

      {expanded && (
        <div id={`${formId}-panel`} className="mt-4 space-y-4 border-t border-violet-200 pt-4 dark:border-violet-700/50">
          {hasTemplate && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${formId}-app`} className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                  App or platform
                </label>
                <input
                  id={`${formId}-app`}
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. Minecraft, TikTok, Discord"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
                {!appName && hasFootprintData && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave blank to use an app from your footprint review list.
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`${formId}-child`}
                  className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Child&apos;s name (optional)
                </label>
                <input
                  id={`${formId}-child`}
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor={`${formId}-frequency`}
                  className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  How often (optional)
                </label>
                <input
                  id={`${formId}-frequency`}
                  type="text"
                  value={usageFrequency}
                  onChange={(e) => setUsageFrequency(e.target.value)}
                  placeholder="e.g. every day, on weekends, after school"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor={`${formId}-custom`}
              className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200"
            >
              Or write your own scenario
            </label>
            <textarea
              id={`${formId}-custom`}
              value={customScenario}
              onChange={(e) => setCustomScenario(e.target.value)}
              rows={3}
              placeholder="Describe a real situation from your family to discuss together…"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor={`${formId}-note`}
              className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200"
            >
              Parent note (private)
            </label>
            <input
              id={`${formId}-note`}
              type="text"
              value={parentNote}
              onChange={(e) => setParentNote(e.target.value)}
              placeholder="Reminder for yourself — not shown during the mission"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Save for this mission
            </button>
            {(parentInput?.appName ||
              parentInput?.customScenario ||
              parentInput?.childName ||
              parentInput?.usageFrequency) && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <RotateCcw size={14} aria-hidden="true" />
                Reset to default
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionScenarioCustomize;
