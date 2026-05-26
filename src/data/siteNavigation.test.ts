import { describe, expect, it } from 'vitest';

import { buildMobileQuickNavItems, primaryNavItems } from './siteNavigation';

describe('buildMobileQuickNavItems', () => {
  it('matches desktop primary nav order including Home', () => {
    const quick = buildMobileQuickNavItems();

    expect(quick.map((item) => item.href)).toEqual(primaryNavItems.map((item) => item.href));
    expect(quick.map((item) => item.label)).toEqual(primaryNavItems.map((item) => item.label));
    expect(quick.map((item) => item.id)).toEqual([
      'mobile-quick-home',
      'mobile-quick-how-it-works',
      'mobile-quick-footprint',
      'mobile-quick-guides-stories',
    ]);
  });
});
