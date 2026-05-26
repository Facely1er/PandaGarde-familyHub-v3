import { describe, expect, it } from 'vitest';

import { PARENT_SURFACE_REDIRECTS } from './parentSiteSurface';
import {
  FOOTER_COLUMN_FAMILY_CONTENT,
  FOOTER_COLUMN_HELP_CENTER,
  FOOTER_COLUMN_REVIEW_WORKFLOW,
  FOOTPRINT_REVIEW_NAV_LABEL,
  GUIDES_STORIES_NAV_LABEL,
  primaryNavItems,
  footerColumns,
  footerFamilyLinks,
  footerFootprintLinks,
  footerHelpCenterLinks,
  footerLegalLinks,
  JOURNAL_PUBLISHED,
} from './siteNavigation';

const APP_STATIC_PATHS = new Set([
  '/service-catalog',
  '/digital-footprint',
  '/scoring-methodology',
  '/digital-rights',
  '/for-families',
  '/stories',
  '/family-privacy-plan',
  '/family-hub',
  '/family-hub/activities',
  '/how-it-works',
  '/faq',
  '/about',
  '/contact',
  '/support',
  '/legal',
  '/privacy',
  '/terms',
  '/cookies',
  '/accessibility',
]);

function pathResolves(href: string): boolean {
  const pathname = href.split('#')[0].split('?')[0];
  if (pathname.startsWith('http')) {
    return true;
  }
  if (PARENT_SURFACE_REDIRECTS[pathname]) {
    return true;
  }
  return APP_STATIC_PATHS.has(pathname);
}

describe('footer navigation links', () => {
  const allInternal = [
    ...footerFootprintLinks,
    ...footerFamilyLinks,
    ...footerHelpCenterLinks,
    ...footerLegalLinks,
  ];

  it('internal footer links resolve to routes or redirects', () => {
    const broken = allInternal.filter((item) => !pathResolves(item.href));
    expect(broken, broken.map((b) => b.href).join(', ')).toEqual([]);
  });

  it('journal link stays out of footer until published', () => {
    expect(JOURNAL_PUBLISHED).toBe(false);
    const familyCol = footerColumns.find((c) => c.id === 'family');
    expect(familyCol?.externalItems ?? []).toHaveLength(0);
  });

  it('footer link counts match planned IA', () => {
    expect(footerFootprintLinks).toHaveLength(4);
    expect(footerFamilyLinks).toHaveLength(4);
    expect(footerHelpCenterLinks).toHaveLength(5);
    expect(footerLegalLinks).toHaveLength(5);
  });

  it('footer column titles do not duplicate header nav labels', () => {
    const titles = footerColumns.map((col) => col.title);
    expect(titles).not.toContain(FOOTPRINT_REVIEW_NAV_LABEL);
    expect(titles).not.toContain(GUIDES_STORIES_NAV_LABEL);
    expect(titles).toContain(FOOTER_COLUMN_REVIEW_WORKFLOW);
    expect(titles).toContain(FOOTER_COLUMN_FAMILY_CONTENT);
    expect(titles).toContain(FOOTER_COLUMN_HELP_CENTER);
  });

  it('column titles are not repeated as link labels in the same column', () => {
    const familyCol = footerColumns.find((c) => c.id === 'family');
    const footprintCol = footerColumns.find((c) => c.id === 'footprint');
    const helpCol = footerColumns.find((c) => c.id === 'help-center');

    expect(familyCol?.title).toBe(FOOTER_COLUMN_FAMILY_CONTENT);
    expect(
      familyCol?.items.some((item) => item.label === FOOTER_COLUMN_FAMILY_CONTENT)
    ).toBe(false);

    const headerHub = primaryNavItems.find((item) => item.href === '/for-families');
    expect(headerHub?.label).toBe(GUIDES_STORIES_NAV_LABEL);
    expect(footerFamilyLinks[0].label).toBe(GUIDES_STORIES_NAV_LABEL);

    expect(footprintCol?.title).toBe(FOOTER_COLUMN_REVIEW_WORKFLOW);
    expect(
      footprintCol?.items.some((item) => item.label === FOOTER_COLUMN_REVIEW_WORKFLOW)
    ).toBe(false);
    const headerFootprint = primaryNavItems.find((item) => item.href === '/digital-footprint');
    const footerFootprint = footprintCol?.items.find((item) => item.href === '/digital-footprint');
    expect(headerFootprint?.label).toBe(FOOTPRINT_REVIEW_NAV_LABEL);
    expect(footerFootprint?.label).toBe(FOOTPRINT_REVIEW_NAV_LABEL);
    expect(footprintCol?.items.some((item) => item.label === 'Exposure review')).toBe(false);

    expect(helpCol?.title).toBe(FOOTER_COLUMN_HELP_CENTER);
    expect(helpCol?.items.some((item) => item.label === FOOTER_COLUMN_HELP_CENTER)).toBe(false);
  });

  it('columns are ordered family → workflow → help → legal', () => {
    expect(footerColumns.map((c) => c.id)).toEqual(['family', 'footprint', 'help-center', 'legal']);
  });
});
