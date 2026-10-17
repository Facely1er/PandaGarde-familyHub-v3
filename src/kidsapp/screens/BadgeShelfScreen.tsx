import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoryBySlug } from '../../data/stories';
import { logger } from '../../lib/logger';
import { TENT_THEMES, useKidsProgress } from '../KidsProgressContext';
import { TRUSTED_ROLES } from '../kidsTrustedRoles';
import {
  getAvatar,
  getKidsEpisodes,
  getKidsEpisodesBySeason,
  KIDS_SEASON_META,
  PILLAR_META,
} from '../kidsContent';

/** My Camp: badges, tent theme, memory journal, companion, Tao Circle, certificates. */
const BadgeShelfScreen: React.FC = () => {
  const {
    profile,
    earnedBadges,
    season1Complete,
    season2Complete,
    trustedTeam,
    camp,
    setTentTheme,
    addJournalNote,
  } = useKidsProgress();
  const [generatingSeason, setGeneratingSeason] = useState<1 | 2 | null>(null);
  const [certificateError, setCertificateError] = useState(false);
  const [journalDraft, setJournalDraft] = useState('');
  const avatar = getAvatar(profile?.avatarId ?? null);
  const totalEpisodes = getKidsEpisodes().length;
  const tent = TENT_THEMES.find((theme) => theme.id === camp.tentTheme) ?? TENT_THEMES[0];

  const companionGreeting = (() => {
    if (earnedBadges.length === 0) {
      return `${avatar.name} is ready for the first bamboo path adventure.`;
    }
    if (season2Complete) {
      return `${avatar.name} greets you in a full Kindness Clearing camp — every path explored!`;
    }
    if (season1Complete) {
      return `${avatar.name} waves from camp: the Kindness Clearing path is unlocked!`;
    }
    return `${avatar.name} says: “${earnedBadges.length} badge${earnedBadges.length === 1 ? '' : 's'} on the shelf — keep going!”`;
  })();

  const downloadCertificate = async (season: 1 | 2) => {
    setGeneratingSeason(season);
    setCertificateError(false);
    try {
      const { CertificateService } = await import('../../lib/certificateService');
      const seasonEpisodes = getKidsEpisodesBySeason(season);
      const blob = await CertificateService.generateCertificate({
        recipientName: avatar.name,
        achievement: KIDS_SEASON_META[season].certificate,
        date: new Date().toLocaleDateString(),
        completedActivities: seasonEpisodes.filter((story) =>
          earnedBadges.some((badge) => badge.slug === story.slug),
        ).length,
        totalActivities: seasonEpisodes.length,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pandagarde-kids-season-${season}-certificate.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.warn('Certificate generation failed', error);
      setCertificateError(true);
    } finally {
      setGeneratingSeason(null);
    }
  };

  const saveJournalNote = () => {
    addJournalNote(journalDraft);
    setJournalDraft('');
  };

  return (
    <div className="py-2">
      <h1 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 sm:text-3xl">
        My Camp
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-300">
        Your tent, badges, journal, and forest friends — saved on this device only.
      </p>

      {/* Companion corner */}
      <div
        className={`mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-br p-5 dark:border-emerald-800 ${tent.campClass}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-5xl" aria-hidden>
            {avatar.emoji}
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-emerald-900 dark:text-emerald-100">
              Companion corner
            </h2>
            <p className="mt-1 text-emerald-950 dark:text-emerald-50">{companionGreeting}</p>
          </div>
        </div>
      </div>

      {/* Tent theme */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
          {tent.emoji} My tent
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Pick a look for your camp. It stays on this device.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TENT_THEMES.map((theme) => {
            const selected = camp.tentTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setTentTheme(theme.id)}
                aria-pressed={selected}
                className={`flex min-h-[56px] flex-col items-center justify-center rounded-xl border px-2 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-100'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-300 dark:border-gray-600 dark:bg-gray-900/40 dark:text-gray-200'
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {theme.emoji}
                </span>
                {theme.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badge shelf */}
      <div className="mt-6">
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">Badge shelf</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {earnedBadges.length} of {totalEpisodes} badges earned across both seasons.
        </p>

        {earnedBadges.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <span className="text-5xl" aria-hidden>
              🎋
            </span>
            <p className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">No badges yet!</p>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Finish your first story on the Forest Map to earn one.
            </p>
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {earnedBadges.map((badge) => {
              const story = getStoryBySlug(badge.slug);
              const pillar = PILLAR_META[badge.pillar];
              return (
                <li
                  key={badge.slug}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <span className="text-4xl" aria-hidden>
                    {pillar.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{pillar.badgeName}</p>
                    <p className="truncate text-sm text-gray-600 dark:text-gray-300">
                      {story?.title ?? badge.slug}
                    </p>
                  </div>
                  <span className="ml-auto text-2xl" role="img" aria-label="Earned badge">
                    🏅
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Memory journal */}
      <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-800 dark:bg-sky-900/30">
        <h2 className="text-lg font-extrabold text-sky-900 dark:text-sky-100">📝 Memory journal</h2>
        <p className="mt-1 text-sm text-sky-900 dark:text-sky-100">
          Write one short note about what you learned. No names needed — keep it on this device.
        </p>
        <label htmlFor="camp-journal-note" className="sr-only">
          Journal note
        </label>
        <textarea
          id="camp-journal-note"
          value={journalDraft}
          onChange={(event) => setJournalDraft(event.target.value)}
          maxLength={280}
          rows={3}
          placeholder="Today I learned…"
          className="mt-3 w-full rounded-xl border border-sky-200 bg-white p-3 text-sm text-gray-900 dark:border-sky-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <button
          type="button"
          onClick={saveJournalNote}
          disabled={!journalDraft.trim()}
          className="mt-2 min-h-[48px] w-full rounded-xl bg-sky-600 font-bold text-white hover:bg-sky-500 disabled:opacity-50 dark:bg-sky-500 dark:text-gray-900"
        >
          Save note
        </button>
        {camp.journalNotes.length > 0 && (
          <ul className="mt-4 space-y-2">
            {camp.journalNotes.map((note) => (
              <li
                key={note}
                className="rounded-xl border border-sky-100 bg-white/80 px-3 py-2 text-sm text-sky-950 dark:border-sky-800 dark:bg-gray-900/60 dark:text-sky-50"
              >
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tao Circle */}
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-900/30">
        <h2 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100">
          🛡️ My Tao Circle
        </h2>
        {trustedTeam ? (
          <>
            <p className="mt-1 text-emerald-900 dark:text-emerald-100">
              Code word: <span className="font-extrabold">{trustedTeam.codeWord}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {trustedTeam.roleIds.map((id) => {
                const role = TRUSTED_ROLES.find((r) => r.id === id);
                return role ? (
                  <span
                    key={id}
                    className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-emerald-800 dark:bg-gray-800 dark:text-emerald-200"
                  >
                    {role.emoji} {role.label}
                  </span>
                ) : null;
              })}
            </div>
          </>
        ) : (
          <p className="mt-1 text-emerald-900 dark:text-emerald-100">
            Build your trusted grown-up team in Episode 8 — it helps you know who to tell when
            something online feels wrong.
          </p>
        )}
        <Link
          to="/tao-circle"
          className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-2xl border-2 border-emerald-700 font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
        >
          {trustedTeam ? 'View my Tao Circle' : 'Build my Tao Circle'}
        </Link>
      </div>

      {/* Certificates */}
      <div className="mt-6 space-y-4">
        {([1, 2] as const).map((season) => {
          const complete = season === 1 ? season1Complete : season2Complete;
          const seasonTotal = getKidsEpisodesBySeason(season).length;
          return (
            <div
              key={season}
              className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/30"
            >
              <h2 className="text-xl font-extrabold text-amber-900 dark:text-amber-100">
                🎓 Season {season} Certificate
              </h2>
              {complete ? (
                <>
                  <p className="mt-1 text-amber-900 dark:text-amber-100">
                    You finished {KIDS_SEASON_META[season].title}! Download your certificate and show
                    a grown-up.
                  </p>
                  <button
                    type="button"
                    onClick={() => downloadCertificate(season)}
                    disabled={generatingSeason !== null}
                    className="mt-4 min-h-[56px] w-full rounded-2xl bg-amber-500 text-lg font-extrabold text-gray-900 hover:bg-amber-400 disabled:opacity-60"
                  >
                    {generatingSeason === season
                      ? 'Making your certificate…'
                      : `Download Season ${season} Certificate 🎉`}
                  </button>
                </>
              ) : (
                <p className="mt-1 text-amber-900 dark:text-amber-100">
                  Earn all {seasonTotal} Season {season} badges to unlock this certificate.
                </p>
              )}
            </div>
          );
        })}
        {certificateError && (
          <p className="font-semibold text-red-700 dark:text-red-300" role="alert">
            Oops, the certificate could not be created. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default BadgeShelfScreen;
