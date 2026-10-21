import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle, ChevronRight, LayoutGrid, ListChecks, ShieldCheck, Telescope } from 'lucide-react';
import { loadDfaJourneyState } from '../lib/dfaJourney';
import { getFoundationStory, getHomepageLatestStory, ORIGIN_STORY_SLUG } from '../data/stories';
import { PageSection, ShellLinkCard, type ShellLinkCardVisual } from '../components/layout/PageContent';
import AppStoreBadges from '../components/AppStoreBadges';

const STEP_ICON_SIZE = 26;

const pathVisuals = {
  snapshot: {
    icon: <Telescope size={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden />,
    tone: 'sky',
  },
  apps: {
    icon: <LayoutGrid size={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden />,
    tone: 'violet',
  },
  plan: {
    icon: <ListChecks size={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden />,
    tone: 'emerald',
  },
} as const satisfies Record<string, ShellLinkCardVisual>;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const journey = useMemo(() => loadDfaJourneyState(), []);
  const foundationStory = useMemo(() => getFoundationStory(), []);
  const latestStory = useMemo(() => getHomepageLatestStory(), []);

  const trustPoints = [
    t('home.trustDataStays'),
    t('home.trustStoriesIndependent'),
    t('home.trustListApps'),
  ];

  const storyHref = foundationStory
    ? `/stories/${ORIGIN_STORY_SLUG}`
    : latestStory
      ? `/stories/${latestStory.slug}`
      : '/stories';

  const pathSteps = [
    {
      title: t('home.pathSnapshotTitle'),
      description: t('home.pathSnapshotDesc'),
      href: '/big-picture',
      tag: t('home.pathSnapshotTag'),
      cta: t('home.pathSnapshotCta'),
      visual: pathVisuals.snapshot,
    },
    {
      title: t('home.pathAppsTitle'),
      description: t('home.pathAppsDesc'),
      href: '/service-catalog',
      tag: t('home.pathAppsTag'),
      cta: t('home.pathAppsCta'),
      visual: pathVisuals.apps,
    },
    {
      title: t('home.pathPlanTitle'),
      description: t('home.pathPlanDesc'),
      href: '/digital-footprint',
      tag: t('home.pathPlanTag'),
      cta: t('home.pathPlanCta'),
      visual: pathVisuals.plan,
    },
  ];

  const primaryCta =
    journey.progressPercent > 0 && journey.resumePath.includes('footprint')
      ? { href: journey.resumePath, label: t('home.continueFootprint') }
      : journey.progressPercent > 0 && journey.resumePath.includes('catalog')
        ? { href: journey.resumePath, label: t('home.continueApps') }
        : { href: '/big-picture', label: t('home.seeBigPicture') };

  return (
    <div className="site-page">
      <section className="homepage-hero site-section" aria-labelledby="homepage-hero-title">
        <div className="container homepage-hero__inner">
          <header className="page-section__header homepage-hero__header">
            <span className="page-section__eyebrow homepage-hero__eyebrow">
              <ShieldCheck size={14} aria-hidden />
              {t('home.eyebrow')}
            </span>
            <h1 id="homepage-hero-title" className="homepage-hero__title">
              {t('home.title')}
              <span>{t('home.titleAccent')}</span>
            </h1>
            <p className="page-section__lead">{t('home.lead')}</p>
          </header>

          <div className="homepage-hero__actions">
            <Link to={primaryCta.href} className="button button-primary inline-flex items-center justify-center gap-2">
              {primaryCta.label}
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link to="/service-catalog" className="button button-secondary inline-flex items-center justify-center">
              {t('home.addFamilyApps')}
            </Link>
          </div>
          <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('home.snapshotMeta')} ·{' '}
            <Link to="/how-it-works" className="touch-link font-medium text-green-700 hover:underline dark:text-green-400">
              {t('common.seeHowItWorks')}
            </Link>
          </p>

          <ul className="homepage-hero__trust-list">
            {trustPoints.map((item) => (
              <li key={item}>
                <CheckCircle size={14} aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="page-layout__main">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="page-content">
            <PageSection
              className="homepage-spotlight"
              header={{
                eyebrow: t('home.pathEyebrow'),
                title: t('home.pathTitle'),
                lead: t('home.pathLead'),
              }}
            >
              <ol className="homepage-spotlight__grid m-0 list-none p-0">
                {pathSteps.map((item) => (
                  <li key={item.href} className="flex">
                    <ShellLinkCard
                      to={item.href}
                      tag={item.tag}
                      title={item.title}
                      description={item.description}
                      visual={item.visual}
                      className="w-full"
                      cta={
                        <>
                          {item.cta}
                          <ChevronRight size={16} aria-hidden />
                        </>
                      }
                    />
                  </li>
                ))}
              </ol>
              <p className="homepage-spotlight__see-all">
                {t('home.storyFirst')}{' '}
                <Link to={storyHref} className="touch-link font-semibold text-green-700 hover:underline dark:text-green-400">
                  {t('home.storyFirstCta')}
                </Link>
              </p>
              <p className="homepage-spotlight__see-all">
                {t('home.stillQuestions')}{' '}
                <Link to="/how-it-works#faq" className="touch-link font-semibold text-green-700 hover:underline dark:text-green-400">
                  {t('home.howItWorksFaq')}
                </Link>
              </p>
            </PageSection>

            <PageSection
              className="homepage-getapp"
              header={{
                eyebrow: t('home.getAppEyebrow'),
                title: t('home.getAppTitle'),
                lead: t('home.getAppLead'),
              }}
            >
              <AppStoreBadges size="lg" />
            </PageSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
