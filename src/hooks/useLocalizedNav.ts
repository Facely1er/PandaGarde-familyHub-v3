import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  footerColumns,
  type FooterColumnConfig,
  type SiteNavItem,
} from '../data/siteNavigation';

/** Maps stable nav item ids to i18n keys under the `nav` namespace. */
const NAV_LABEL_KEYS: Record<string, string> = {
  'nav-home': 'nav.home',
  'mobile-quick-home': 'nav.home',
  'nav-how-it-works': 'nav.howItWorks',
  'nav-footprint': 'nav.footprintReview',
  'mobile-quick-footprint': 'nav.footprintReview',
  'dfa-footprint': 'nav.footprintReview',
  'footprint-review': 'nav.footprintReview',
  'nav-guides-stories': 'nav.guidesStories',
  'mobile-quick-guides-stories': 'nav.guidesStories',
  'footer-guides-stories': 'nav.guidesStories',
  'nav-family-hub': 'nav.familyHub',
  'mobile-quick-family-hub': 'nav.familyHub',
  'footer-family-hub': 'nav.familyHub',
  'dfa-service-catalog': 'nav.serviceCatalog',
  'mobile-nav-catalog': 'nav.serviceCatalog',
  'footprint-catalog': 'nav.serviceCatalog',
  'footprint-scoring': 'nav.scoringMethodology',
  'footprint-digital-rights': 'nav.digitalRights',
  'footer-stories': 'nav.privacyPandaStories',
  'footer-story-cast': 'nav.storyCast',
  'footer-family-plan': 'nav.familyPrivacyPlan',
  'footer-how-it-works': 'nav.howItWorks',
  'footer-faq': 'nav.faq',
  'mobile-nav-faq': 'nav.faq',
  'footer-support': 'nav.support',
  'footer-contact': 'nav.contact',
  'footer-about': 'nav.about',
  'footer-legal-hub': 'nav.legalOverview',
  'footer-privacy-policy': 'nav.privacy',
  'footer-terms': 'nav.terms',
  'footer-cookies': 'nav.cookies',
  'footer-accessibility': 'nav.accessibility',
  'footer-journal': 'nav.digitalBambooJournal',
};

const FOOTER_COLUMN_TITLE_KEYS: Record<string, string> = {
  family: 'footer.columnFamily',
  footprint: 'footer.columnReview',
  'help-center': 'footer.columnHelp',
  legal: 'footer.columnLegal',
};

export function localizeNavItem(item: SiteNavItem, t: (key: string) => string): SiteNavItem {
  const key = NAV_LABEL_KEYS[item.id];
  return key ? { ...item, label: t(key) } : item;
}

export function useLocalizedNavItems(items: SiteNavItem[]): SiteNavItem[] {
  const { t } = useTranslation();
  return useMemo(() => items.map((item) => localizeNavItem(item, t)), [items, t]);
}

export function useLocalizedFooterColumns(): FooterColumnConfig[] {
  const { t } = useTranslation();
  return useMemo(
    () =>
      footerColumns.map((column) => ({
        ...column,
        title: t(FOOTER_COLUMN_TITLE_KEYS[column.id] ?? column.title),
        items: column.items.map((item) => localizeNavItem(item, t)),
        externalItems: column.externalItems?.map((item) => localizeNavItem(item, t)),
      })),
    [t]
  );
}
