import { Activity } from '../../data/stories';

const TYPE_ICONS: Record<string, string> = {
  craft: '✂️',
  game: '🎮',
  discussion: '💬',
  worksheet: '📝',
  'role-play': '🎭',
};

const AGE_LABELS: Record<string, string> = {
  early: 'Ages 5–7',
  middle: '8–10',
  older: '11–13',
};

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-400 bg-gray-50 dark:bg-gray-200 p-4 mb-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          {TYPE_ICONS[activity.type] ?? '📌'}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
            <span className="text-xs text-gray-500 bg-white dark:bg-gray-300 border border-gray-200 dark:border-gray-500 px-2 py-0.5 rounded-full capitalize">
              {activity.type}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

          {activity.materials && activity.materials.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Materials:</p>
              <ul className="flex flex-wrap gap-1">
                {activity.materials.map((m) => (
                  <li
                    key={m}
                    className="text-xs bg-white dark:bg-gray-300 border border-gray-200 dark:border-gray-500 rounded px-2 py-0.5 text-gray-600"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-1 mt-2">
            {activity.ageGroups.map((ag) => (
              <span
                key={ag}
                className="text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/50 dark:ring-1 dark:ring-green-700/60 px-2 py-0.5 rounded-full"
              >
                {AGE_LABELS[ag]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
