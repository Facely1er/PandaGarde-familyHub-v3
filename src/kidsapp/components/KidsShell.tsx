import React from 'react';
import { NavLink } from 'react-router-dom';
import { useKidsProgress } from '../KidsProgressContext';
import { getAvatar } from '../kidsContent';

const NAV_ITEMS = [
  { to: '/', label: 'Forest Map', emoji: '🗺️' },
  { to: '/badges', label: 'My Badges', emoji: '🏅' },
  { to: '/grown-ups', label: 'Grown-Ups', emoji: '🔒' },
];

/** Kid-friendly app frame: big header, oversized bottom navigation. */
const KidsShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, earnedBadges } = useKidsProgress();
  const avatar = getAvatar(profile?.avatarId ?? null);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
      <header className="flex items-center justify-between gap-3 px-4 pb-2 pt-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden>
            {avatar.emoji}
          </span>
          <div>
            <p className="text-lg font-bold leading-tight text-emerald-800 dark:text-emerald-300">
              {avatar.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{avatar.tagline}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
          aria-label={`${earnedBadges.length} badges earned`}
        >
          <span aria-hidden>🏅</span>
          <span className="text-lg font-bold">{earnedBadges.length}</span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 sm:px-6">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-gray-700 dark:bg-gray-800"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-3xl">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex min-h-[64px] flex-1 flex-col items-center justify-center gap-0.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default KidsShell;
