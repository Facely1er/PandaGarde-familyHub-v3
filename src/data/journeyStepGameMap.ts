/**
 * Maps Privacy Journey step IDs to Learning Hub game IDs.
 * Journey progress is derived from recorded game completions for the active family member.
 */
export const JOURNEY_STEP_TO_GAME_ID: Record<string, string> = {
  'pack-backpack': 'safe-unsafe',
  'destination-decisions': 'privacy-story',
  'privacy-checkpoint': 'password-pet',
  'social-safety': 'social-simulator',
  'password-mastery': 'password-strength',
  'phishing-patrol': 'phishing-detective',
  'digital-rights': 'digital-rights',
  'data-detective': 'digital-footprint',
  'privacy-policy-pro': 'privacy-decoder',
};

export function gameIdForJourneyStep(stepId: string): string | undefined {
  return JOURNEY_STEP_TO_GAME_ID[stepId];
}
