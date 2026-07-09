import i18n from '../i18n';
import {
  HUB_BRAND_I18N_DEFAULTS,
  HUB_BRAND_LINE_1,
  HUB_BRAND_LINE_2,
  HUB_DISPLAY_NAME,
} from './constants';

const BRAND_STRING_KEYS = [
  'hub.nav.primary',
  'hub.dashboard.welcomeRegion',
  'hub.dashboard.welcomeTitle',
  'hub.tour.dialogLabel',
  'hub.settings.languageHint',
] as const;

describe('Family Hub brand naming', () => {
  it('combines brand lines into the store display name', () => {
    expect(`${HUB_BRAND_LINE_1} ${HUB_BRAND_LINE_2}`).toBe(HUB_DISPLAY_NAME);
  });

  it.each(['en', 'fr', 'es'] as const)(
    'keeps PandaGarde and Family Hub in hub copy for %s',
    async (language) => {
      await i18n.changeLanguage(language);

      for (const key of BRAND_STRING_KEYS) {
        const value = i18n.t(key, HUB_BRAND_I18N_DEFAULTS);
        expect(value).toContain(HUB_BRAND_LINE_2);
      }

      expect(i18n.t('hub.nav.openWebsite', HUB_BRAND_I18N_DEFAULTS)).toContain(HUB_BRAND_LINE_1);
      expect(i18n.t('hub.kids.privacyFormNote', HUB_BRAND_I18N_DEFAULTS)).toContain(HUB_BRAND_LINE_1);
    }
  );
});
