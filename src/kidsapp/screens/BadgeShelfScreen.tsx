import React, { useState } from 'react';
import { getStoryBySlug } from '../../data/stories';
import { logger } from '../../lib/logger';
import { useKidsProgress } from '../KidsProgressContext';
import { getAvatar, getKidsEpisodes, PILLAR_META } from '../kidsContent';

/** Badge shelf: one badge per completed episode, plus the season certificate. */
const BadgeShelfScreen: React.FC = () => {
  const { profile, earnedBadges, seasonComplete } = useKidsProgress();
  const [generating, setGenerating] = useState(false);
  const [certificateError, setCertificateError] = useState(false);
  const avatar = getAvatar(profile?.avatarId ?? null);
  const totalEpisodes = getKidsEpisodes().length;

  const downloadCertificate = async () => {
    setGenerating(true);
    setCertificateError(false);
    try {
      // jsPDF stays lazy-loaded: only pulled in when a certificate is generated.
      const { CertificateService } = await import('../../lib/certificateService');
      const blob = await CertificateService.generateCertificate({
        recipientName: avatar.name,
        achievement: 'Privacy Grove Explorer — Season 1 Complete',
        date: new Date().toLocaleDateString(),
        completedActivities: earnedBadges.length,
        totalActivities: totalEpisodes,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pandagarde-kids-certificate.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.warn('Certificate generation failed', error);
      setCertificateError(true);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="py-2">
      <h1 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 sm:text-3xl">
        My Badge Shelf
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-300">
        {earnedBadges.length} of {totalEpisodes} badges earned in the Privacy Grove.
      </p>

      {earnedBadges.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <span className="text-5xl" aria-hidden>
            🎋
          </span>
          <p className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">
            No badges yet!
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Finish your first story on the Forest Map to earn one.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/30">
        <h2 className="text-xl font-extrabold text-amber-900 dark:text-amber-100">
          🎓 Season 1 Certificate
        </h2>
        {seasonComplete ? (
          <>
            <p className="mt-1 text-amber-900 dark:text-amber-100">
              You explored the whole Privacy Grove! Download your certificate and show a grown-up.
            </p>
            <button
              type="button"
              onClick={downloadCertificate}
              disabled={generating}
              className="mt-4 min-h-[56px] w-full rounded-2xl bg-amber-500 text-lg font-extrabold text-gray-900 hover:bg-amber-400 disabled:opacity-60"
            >
              {generating ? 'Making your certificate…' : 'Download My Certificate 🎉'}
            </button>
            {certificateError && (
              <p className="mt-2 font-semibold text-red-700 dark:text-red-300" role="alert">
                Oops, the certificate could not be created. Please try again.
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-amber-900 dark:text-amber-100">
            Earn all {totalEpisodes} badges to unlock your printable explorer certificate!
          </p>
        )}
      </div>
    </div>
  );
};

export default BadgeShelfScreen;
