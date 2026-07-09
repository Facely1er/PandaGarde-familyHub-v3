import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { hubPaths } from '../hubPaths';
import { useHubI18n } from '../hubI18n';

/**
 * Single-line premium cue — mission intro only. Full unlock lives in Settings.
 */
const PremiumMissionHint: React.FC = () => {
  const { t } = useHubI18n();

  return (
    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-xl border border-violet-200/80 bg-violet-50/50 px-3 py-2 text-xs text-violet-950 dark:border-violet-800/40 dark:bg-violet-950/20 dark:text-violet-100">
      <Sparkles size={13} className="shrink-0 text-violet-600 dark:text-violet-400" aria-hidden="true" />
      <span>
        <span className="font-semibold">{t('hub.premium.label')}</span> {t('hub.premium.hint')}{' '}
        <Link
          to={hubPaths.settings}
          className="font-medium text-violet-700 underline hover:no-underline dark:text-violet-300"
        >
          {t('hub.premium.unlockInSettings')}
        </Link>
      </span>
    </p>
  );
};

export default PremiumMissionHint;
