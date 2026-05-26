import { describe, expect, it } from 'vitest';

import { buildBreadcrumbTrail } from './breadcrumbTrail';
import { FOR_FAMILIES_PATH, GUIDES_STORIES_NAV_LABEL } from '../data/siteNavigation';

describe('buildBreadcrumbTrail', () => {
  it('returns only Home on root', () => {
    expect(buildBreadcrumbTrail('/')).toEqual([{ label: 'Home', path: '/' }]);
  });

  it('hub page is Home → Guides & stories', () => {
    expect(buildBreadcrumbTrail(FOR_FAMILIES_PATH).map((i) => i.label)).toEqual([
      'Home',
      GUIDES_STORIES_NAV_LABEL,
    ]);
  });

  it('story list is under Guides & stories', () => {
    expect(buildBreadcrumbTrail('/stories').map((i) => i.path)).toEqual([
      '/',
      FOR_FAMILIES_PATH,
      '/stories',
    ]);
  });

  it('story reader includes Privacy Panda Stories parent', () => {
    const trail = buildBreadcrumbTrail('/stories/privacy-panda-and-the-digital-bamboo-forest');
    expect(trail.map((i) => i.path)).toEqual([
      '/',
      FOR_FAMILIES_PATH,
      '/stories',
      '/stories/privacy-panda-and-the-digital-bamboo-forest',
    ]);
    expect(trail[3].label).toMatch(/Digital Bamboo|Privacy Panda/i);
  });

  it('parent guide is under Guides & stories not raw /guides segment', () => {
    expect(buildBreadcrumbTrail('/guides/family-privacy').map((i) => i.label)).toEqual([
      'Home',
      GUIDES_STORIES_NAV_LABEL,
      'Family privacy guide',
    ]);
  });

  it('family privacy plan is under Guides & stories', () => {
    expect(buildBreadcrumbTrail('/family-privacy-plan').map((i) => i.path)).toEqual([
      '/',
      FOR_FAMILIES_PATH,
      '/family-privacy-plan',
    ]);
  });

  it('printable download is under Guides & stories and printables hub', () => {
    expect(buildBreadcrumbTrail('/downloads/worksheets').map((i) => i.path)).toEqual([
      '/',
      FOR_FAMILIES_PATH,
      '/downloads/coloring-sheets',
      '/downloads/worksheets',
    ]);
  });

  it('scoring methodology is under Footprint review', () => {
    expect(buildBreadcrumbTrail('/scoring-methodology').map((i) => i.label)).toEqual([
      'Home',
      'Footprint Review',
      'Scoring methodology',
    ]);
  });

  it('service catalog is under Footprint review workflow', () => {
    expect(buildBreadcrumbTrail('/service-catalog').map((i) => i.path)).toEqual([
      '/',
      '/digital-footprint',
      '/service-catalog',
    ]);
  });

  it('footprint review page is Home → Footprint Review only', () => {
    expect(buildBreadcrumbTrail('/digital-footprint').map((i) => i.label)).toEqual([
      'Home',
      'Footprint Review',
    ]);
  });

  it('Family Hub missions include Family Hub parent', () => {
    expect(buildBreadcrumbTrail('/family-hub/activities').map((i) => i.path)).toEqual([
      '/',
      '/family-hub',
      '/family-hub/activities',
    ]);
  });

  it('help pages stay flat under Home', () => {
    expect(buildBreadcrumbTrail('/faq').map((i) => i.label)).toEqual(['Home', 'FAQ']);
  });

  it('legal hub is Home → Legal', () => {
    expect(buildBreadcrumbTrail('/legal').map((i) => i.label)).toEqual(['Home', 'Legal']);
  });

  it('cookie policy is under Legal', () => {
    expect(buildBreadcrumbTrail('/cookies').map((i) => i.label)).toEqual([
      'Home',
      'Legal',
      'Cookie policy',
    ]);
  });

  it('privacy policy is under Legal', () => {
    expect(buildBreadcrumbTrail('/privacy').map((i) => i.path)).toEqual(['/', '/legal', '/privacy']);
  });

  it('parental consent pending is under Legal and Parental consent', () => {
    expect(buildBreadcrumbTrail('/parental-consent/pending').map((i) => i.label)).toEqual([
      'Home',
      'Legal',
      'Parental consent',
      'Consent pending',
    ]);
  });
});
