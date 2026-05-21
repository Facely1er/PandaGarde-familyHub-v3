import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2, Clock, Download, Star, TrendingUp, X } from 'lucide-react';
import CertificateGenerator from '../../components/CertificateGenerator';
import ProgressExport from '../../components/ProgressExport';
import { useProgress } from '../../contexts/ProgressContext';
import { flattenAgeBasedActivities } from '../../data/ageBasedActivities';

const ACHIEVEMENT_META: Record<string, { label: string; emoji: string; description: string }> = {
  first_activity: { label: 'First Step', emoji: '🌱', description: 'Completed your first activity' },
  getting_started: { label: 'Getting Started', emoji: '🚀', description: 'Completed 3 activities' },
  privacy_champion: { label: 'Privacy Champion', emoji: '🏆', description: 'Completed 8 activities' },
  dedicated_learner: { label: 'Dedicated Learner', emoji: '⏱️', description: 'Spent 60+ minutes learning' },
};

const ProgressScreen: React.FC = () => {
  const [showCertificates, setShowCertificates] = useState(false);
  const [showProgressExport, setShowProgressExport] = useState(false);
  const { progress, getActivityProgress } = useProgress();

  const allActivities = useMemo(() => flattenAgeBasedActivities(), []);
  const totalCount = allActivities.length;
  const completedCount = progress.completedActivities.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const scores = useMemo(
    () =>
      Object.values(progress.activityDetails)
        .map((d) => d.score)
        .filter((s): s is number => s !== undefined),
    [progress.activityDetails]
  );
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  const recentCompletions = useMemo(() => {
    return allActivities
      .map((a) => {
        const key = a.activityManagerId ?? a.id;
        const detail = getActivityProgress(key);
        return detail?.completed ? { activity: a, detail } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => new Date(b.detail.completedAt).getTime() - new Date(a.detail.completedAt).getTime())
      .slice(0, 6);
  }, [allActivities, getActivityProgress]);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Progress &amp; Achievements</h1>
        <p className="text-gray-600 dark:text-gray-400">Your family's privacy learning journey so far.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 dark:border-teal-700/40 dark:bg-teal-900/20">
          <CheckCircle2 className="text-teal-600 dark:text-teal-400 mb-2" size={20} aria-hidden="true" />
          <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">{completedCount}</p>
          <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">Activities done</p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-700/40 dark:bg-indigo-900/20">
          <TrendingUp className="text-indigo-600 dark:text-indigo-400 mb-2" size={20} aria-hidden="true" />
          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{pct}%</p>
          <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">of {totalCount} available</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-700/40 dark:bg-amber-900/20">
          <Clock className="text-amber-600 dark:text-amber-400 mb-2" size={20} aria-hidden="true" />
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{progress.totalTimeSpent}</p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Minutes learning</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-700/40 dark:bg-emerald-900/20">
          <Star className="text-emerald-600 dark:text-emerald-400 mb-2" size={20} aria-hidden="true" />
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            {avgScore !== null ? `${avgScore}%` : '—'}
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Avg. score</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-end justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Overall journey progress</p>
          <p className="text-sm font-bold text-teal-700 dark:text-teal-300">{completedCount} / {totalCount}</p>
        </div>
        <div
          className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% of activities completed`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {completedCount === 0 && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            No activities completed yet — head to <strong>Activities</strong> to start your first mission.
          </p>
        )}
      </div>

      {/* Achievements */}
      {progress.achievements.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Badges earned</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {progress.achievements.map((id) => {
              const meta = ACHIEVEMENT_META[id];
              if (!meta) return null;
              return (
                <li key={id} className="flex flex-col items-center gap-1 rounded-xl border border-amber-100 bg-amber-50 p-3 text-center dark:border-amber-700/40 dark:bg-amber-900/20">
                  <span className="text-2xl" role="img" aria-label={meta.label}>{meta.emoji}</span>
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-200">{meta.label}</span>
                  <span className="text-[11px] text-amber-700/80 dark:text-amber-300/80">{meta.description}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Recent completions */}
      {recentCompletions.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Recently completed</h2>
          <ul className="space-y-3">
            {recentCompletions.map(({ activity, detail }) => (
              <li key={activity.id} className="flex items-center gap-3">
                <span className="text-xl flex-shrink-0" role="img" aria-label="">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ages {activity.groupAgeRange} · {activity.focus}
                    {detail.score !== undefined ? ` · ${detail.score}%` : ''}
                  </p>
                </div>
                <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
                  {new Date(detail.completedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setShowCertificates(true)}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all shadow-sm hover:shadow-md text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-teal-600 dark:text-teal-400" size={22} aria-hidden="true" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Certificates</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Generate and download certificates for completed activities.</p>
        </button>
        <button
          onClick={() => setShowProgressExport(true)}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all shadow-sm hover:shadow-md text-left"
        >
          <div className="flex items-center gap-3 mb-2">
            <Download className="text-teal-600 dark:text-teal-400" size={22} aria-hidden="true" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Export Progress</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Export your learning progress as a JSON file.</p>
        </button>
      </div>

      {showCertificates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button
              onClick={() => setShowCertificates(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close certificates"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Certificate Generator</h2>
              <CertificateGenerator />
            </div>
          </div>
        </div>
      )}

      {showProgressExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button
              onClick={() => setShowProgressExport(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close export"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Export Progress</h2>
              <ProgressExport onClose={() => setShowProgressExport(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressScreen;
