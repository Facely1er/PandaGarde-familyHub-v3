import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookMarked, BookOpen, ChevronRight, LayoutDashboard, ListChecks, ShieldCheck } from 'lucide-react';
import { loadDfaJourneyState } from '../lib/dfaJourney';
import { getFoundationStory, getHomepageLatestStory, ORIGIN_STORY_SLUG } from '../data/stories';
import { PageSection, ShellLinkCard, type ShellLinkCardVisual } from '../components/layout/PageContent';

const SPOTLIGHT_ICON_SIZE = 20;

const spotlightVisuals = {
  stories: {
    icon: <BookOpen size={SPOTLIGHT_ICON_SIZE} strokeWidth={1.75} aria-hidden />,
    tone: 'emerald',
  },
  guides: {
    icon: <BookMarked size={SPOTLIGHT_ICON_SIZE} strokeWidth={1.75} aria-hidden />,
    tone: 'sky',
  },
  footprint: {
    icon: <ListChecks size={SPOTLIGHT_ICON_SIZE} strokeWidth={1.75} aria-hidden />,
    tone: 'violet',
  },
  hub: {
    icon: <LayoutDashboard size={SPOTLIGHT_ICON_SIZE} strokeWidth={1.75} aria-hidden />,
    tone: 'amber',
  },
} as const satisfies Record<string, ShellLinkCardVisual>;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const journey = useMemo(() => loadDfaJourneyState(), []);
  const foundationStory = useMemo(() => getFoundationStory(), []);
  const latestStory = useMemo(() => getHomepageLatestStory(), []);

  const trustPoints = [
    t('home.trustDataStays'),
    t('home.trustFree'),
  ];

  const spotlightLinks = useMemo(() => {
    const links = [
      {
        title: t('home.spotlightStoriesTitle'),
        description: t('home.spotlightStoriesDesc'),
        href: '/stories',
        tag: t('home.spotlightStoriesTag'),
        cta: t('home.spotlightStoriesCta'),
        visual: spotlightVisuals.stories,
      },
      {
        title: t('nav.guidesStories'),
        description: t('home.spotlightGuidesDesc'),
        href: '/for-families',
        tag: t('home.spotlightGuidesTag'),
        cta: t('common.browse'),
        visual: spotlightVisuals.guides,
      },
      {
        title: t('common.footprintReview'),
        description: t('home.spotlightFootprintDesc'),
        href: '/digital-footprint',
        tag: t('home.spotlightFootprintTag'),
        cta: t('common.open'),
        visual: spotlightVisuals.footprint,
      },
      {
        title: t('common.familyHub'),
        description: t('home.spotlightHubDesc'),
        href: '/family-hub',
        tag: t('home.spotlightHubTag'),
        cta: t('common.open'),
        visual: spotlightVisuals.hub,
      },
    ];

    if (foundationStory) {
      const storyLink = links[0];
      storyLink.title = foundationStory.title;
      storyLink.description = t('home.readTogether');
      storyLink.href = `/stories/${ORIGIN_STORY_SLUG}`;
      storyLink.cta = t('home.openStory');
    } else if (latestStory) {
      const storyLink = links[0];
      storyLink.title = latestStory.title;
      storyLink.description = latestStory.privacyTopic;
      storyLink.href = `/stories/${latestStory.slug}`;
      storyLink.cta = t('home.readEpisode', { number: latestStory.episodeNumber });
    }

    return links;
  }, [foundationStory, latestStory, t]);

  const primaryCta =
    journey.progressPercent > 0 && journey.resumePath.includes('footprint')
      ? { href: journey.resumePath, label: t('home.continueFootprint') }
      : journey.progressPercent > 0 && journey.resumePath.includes('catalog')
        ? { href: journey.resumePath, label: t('home.continueApps') }
        : { href: '/stories', label: t('home.exploreStories') };

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
            <p className="page-section__lead homepage-hero__lead">
              {t('home.lead')}
            </p>
          </header>

          <div className="homepage-hero__actions">
            <Link to={primaryCta.href} className="button button-primary inline-flex items-center justify-center gap-1.5">
              {primaryCta.label}
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              to="/digital-footprint"
              className="button button-secondary inline-flex items-center justify-center"
            >
              {t('common.footprintReview')}
            </Link>
          </div>
          <p className="homepage-hero__helper">
            {t('home.notSure')}{' '}
            <Link to="/how-it-works" className="font-medium text-green-700 hover:underline dark:text-green-400">
              {t('common.seeHowItWorks')}
            </Link>
          </p>

          <p className="homepage-hero__trust-note">
            {trustPoints.map((item, index) => (
              <span key={item} className="homepage-hero__trust-item">
                {index > 0 ? <span className="homepage-hero__trust-sep" aria-hidden="true"> · </span> : null}
                {item}
              </span>
            ))}
          </p>
        </div>
      </section>

      <div className="page-layout__main">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="page-content">
            <PageSection
              className="homepage-spotlight"
              header={{
                eyebrow: t('home.spotlightEyebrow'),
                title: t('home.spotlightTitle'),
                lead: t('home.spotlightLead'),
              }}
            >
              <div className="homepage-spotlight__grid">
                {spotlightLinks.map((item) => (
                  <ShellLinkCard
                    key={item.href}
                    to={item.href}
                    tag={item.tag}
                    title={item.title}
                    description={item.description}
                    visual={item.visual}
                    layout="stacked"
                    className="homepage-spotlight__card"
                    cta={
                      <>
                        {item.cta}
                        <ChevronRight size={14} aria-hidden />
                      </>
                    }
                  />
                ))}
              </div>
              {(foundationStory || latestStory) && (
                <p className="homepage-spotlight__see-all">
                  <Link to="/stories" className="font-medium text-green-700 hover:underline dark:text-green-400">
                    {t('common.seeAllStories')}
                  </Link>
                </p>
              )}
            </PageSection>

            <PageSection
              className="homepage-closing"
              header={{
                eyebrow: t('home.closingEyebrow'),
                title: t('home.closingTitle'),
                lead: t('home.closingLead'),
              }}
            >
              <div className="homepage-closing__actions">
                <Link to="/service-catalog" className="button button-primary inline-flex items-center gap-1.5">
                  {t('home.addFamilyApps')}
                  <ArrowRight size={14} aria-hidden />
                </Link>
                <Link to="/digital-footprint" className="button button-secondary inline-flex items-center gap-1.5">
                  {t('common.footprintReview')}
                </Link>
              </div>
              <p className="homepage-closing__followup page-section__lead text-center">
                {t('home.stillQuestions')}{' '}
                <Link to="/how-it-works#faq" className="font-semibold text-green-700 hover:underline dark:text-green-400">
                  {t('home.howItWorksFaq')}
                </Link>
              </p>
            </PageSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
