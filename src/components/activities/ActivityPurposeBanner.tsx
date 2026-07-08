import React, { useState } from 'react';
import { Lightbulb, MessageCircleHeart, ChevronDown } from 'lucide-react';

export interface ActivityContext {
  /** Family Hub mission this game belongs to. */
  missionTitle?: string;
  /** Emoji anchor (guide or theme). */
  guideEmoji?: string;
  /** Kid-friendly one-liner: what this game teaches in real life. */
  why: string;
  /** A single prompt parent and child can talk through together. */
  familyTalk: string;
}

interface ActivityPurposeBannerProps {
  context: ActivityContext;
}

/**
 * Compact, collapsible "why we're playing" strip shown inside Family Hub
 * mini-games so the learning purpose stays visible to both parent and child
 * during play — not only on the instructions screen.
 */
const ActivityPurposeBanner: React.FC<ActivityPurposeBannerProps> = ({ context }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {context.guideEmoji ?? '🐼'}
        </span>
        <span className="flex-1 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
          {context.missionTitle ? `Why we're playing — ${context.missionTitle}` : "Why we're playing"}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-emerald-700 transition-transform dark:text-emerald-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="space-y-2 px-4 pb-3">
          <p className="flex items-start gap-2 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" aria-hidden="true" />
            <span>{context.why}</span>
          </p>
          <p className="flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm text-emerald-900/90 dark:bg-gray-900/40 dark:text-emerald-100/90">
            <MessageCircleHeart className="mt-0.5 h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" aria-hidden="true" />
            <span>
              <span className="font-semibold">Talk together:</span> {context.familyTalk}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityPurposeBanner;
