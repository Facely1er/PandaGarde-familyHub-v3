import { afterEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { openExternalUrl } from './openExternalUrl';

describe('openExternalUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens a new tab on web', async () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(false);
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);

    await openExternalUrl('https://pandagarde.com');

    expect(open).toHaveBeenCalledWith(
      'https://pandagarde.com',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('uses Capacitor Browser on native', async () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
    const browserOpen = vi.fn().mockResolvedValue(undefined);
    vi.doMock('@capacitor/browser', () => ({
      Browser: { open: browserOpen },
    }));

    const { openExternalUrl: openNative } = await import('./openExternalUrl');
    await openNative('https://pandagarde.com');

    expect(browserOpen).toHaveBeenCalledWith({ url: 'https://pandagarde.com' });
  });
});
