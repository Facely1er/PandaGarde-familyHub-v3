/** Average adult reading speed for educational copy (words per minute). */
const WORDS_PER_MINUTE = 200;

export function countWords(...segments: string[]): number {
  const text = segments.join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

/** Estimate reading time in whole minutes (minimum 4). */
export function estimateReadingMinutes(...segments: string[]): number {
  const words = countWords(...segments);
  return Math.max(4, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min`;
}
