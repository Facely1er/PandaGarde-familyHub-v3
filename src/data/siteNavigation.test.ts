import { describe, expect, it } from 'vitest';

import { buildMobileQuickNavItems, mobileQuickNavItems, primaryNavItems } from './siteNavigation';

describe('buildMobileQuickNavItems', () => {
  it('mirrors desktop primary nav order including Home and Family Hub', () => {
    const quick = buildMobileQuickNavItems();

    expect(quick.map((item) => item.href)).toEqual(primaryNavItems.map((item) => item.href));
    expect(quick.map((item) => item.label)).toEqual(primaryNavItems.map((item) => item.label));
    expect(quick.map((item) => item.id)).toEqual([
      'mobile-quick-home',
      'mobile-quick-how-it-works',
      'mobile-quick-footprint',
      'mobile-quick-guides-stories',
      'mobile-quick-family-hub',
    ]);
  });
});

describe('mobileQuickNavItems', () => {
  it('exposes a trimmed tablet quick-nav set without Home or How It Works', () => {
    expect(mobileQuickNavItems.map((item) => item.id)).toEqual([
      'mobile-quick-footprint',
      'mobile-quick-guides-stories',
      'mobile-quick-family-hub',
    ]);
  });
});
