import { describe, expect, it } from 'vitest';

import { PARENT_SURFACE_REDIRECTS } from './parentSiteSurface';
import { allResourceHubLinks, resourceFootprintLinks } from './resourcesHubLinks';

const APP_STATIC_PATHS = new Set([
  '/',
  '/how-it-works',
  '/service-catalog',
  '/digital-footprint',
  '/scoring-methodology',
  '/digital-rights',
  '/for-families',
  '/family-hub',
  '/stories',
  '/stories/privacy-panda-and-the-digital-bamboo-forest',
  '/guides/family-privacy',
  '/family-privacy-plan',
  '/guides/emergency-safety',
  '/family-hub/activities',
  '/downloads/coloring-sheets',
]);

function pathResolves(href: string): boolean {
  const pathname = href.split('#')[0].split('?')[0];
  if (PARENT_SURFACE_REDIRECTS[pathname]) {
    return true;
  }
  return APP_STATIC_PATHS.has(pathname);
}

describe('resourcesHubLinks', () => {
  it('every hub link resolves to a route or parent-surface redirect', () => {
    const broken = allResourceHubLinks.filter((link) => !pathResolves(link.href));
    expect(broken, broken.map((b) => b.href).join(', ')).toEqual([]);
  });

  it('guide links exclude retired handbook scaffolds', () => {
    const retired = ['/privacy-handbook', '/privacy-explorers', '/teen-handbook', '/activity-book'];
    const hits = allResourceHubLinks.filter((l) => retired.includes(l.href));
    expect(hits).toEqual([]);
  });

  it('footprint workflow links stay defined for footer and footprint page', () => {
    const footprintHrefs = resourceFootprintLinks.map((l) => l.href);
    expect(footprintHrefs).toEqual([
      '/service-catalog',
      '/digital-footprint',
      '/scoring-methodology',
      '/digital-rights',
    ]);
  });
});
