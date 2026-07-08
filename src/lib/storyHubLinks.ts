import { pandagardeWebsiteUrl } from '../familyhub/hubPaths';
import { openExternalUrl } from './openExternalUrl';

function isStandaloneHub(): boolean {
  return import.meta.env.VITE_HUB_STANDALONE === 'true';
}

function websiteOrigin(): string {
  return pandagardeWebsiteUrl.replace(/\/$/, '');
}

function normalizeSitePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/** Full URL or in-app path for a PandaGarde website route (stories, DFA, etc.). */
export function buildWebsitePath(path: string): string {
  const normalized = normalizeSitePath(path);
  if (isStandaloneHub()) {
    return `${websiteOrigin()}${normalized}`;
  }
  return normalized;
}

export function buildStoryUrl(storySlug: string): string {
  return buildWebsitePath(`/stories/${storySlug}`);
}

export function buildStoriesIndexUrl(): string {
  return buildWebsitePath('/stories');
}

export function buildMissionHubUrl(missionId: string): string {
  const activitiesBase = isStandaloneHub() ? '/activities' : '/family-hub/activities';
  return `${activitiesBase}?mission=${encodeURIComponent(missionId)}`;
}

/** Open a story in the system browser (standalone) or same tab (marketing site). */
export async function openStoryBySlug(storySlug: string): Promise<void> {
  const url = buildStoryUrl(storySlug);
  if (isStandaloneHub()) {
    await openExternalUrl(url);
    return;
  }
  window.location.assign(url);
}

export async function openWebsitePath(path: string): Promise<void> {
  const url = buildWebsitePath(path);
  if (isStandaloneHub()) {
    await openExternalUrl(url);
    return;
  }
  window.location.assign(url);
}
