import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { loadDfaJourneyState } from '../lib/dfaJourney';
import { getFoundationStory, getHomepageLatestStory, ORIGIN_STORY_SLUG } from '../data/stories';
import { INDEPENDENT_AREAS_LEAD } from '../data/pandaGardeMessaging';
import { GUIDES_STORIES_NAV_LABEL } from '../data/siteNavigation';
import { PageSection, ShellLinkCard } from '../components/layout/PageContent';

const HomePage: React.FC = () => {
  const journey = useMemo(() => loadDfaJourneyState(), []);
  const foundationStory = useMemo(() => getFoundationStory(), []);
  const latestStory = useMemo(() => getHomepageLatestStory(), []);

  const trustPoints = [
    'Your data stays on your device',
    'Stories and guides work without a footprint review',
    'Catalog powers footprint scores when you want them',
  ];

  const entryPoints = [
    {
      label: 'Read with your kids',
      value: 'Privacy Panda stories',
      href: '/stories',
    },
    {
      label: 'Parent guides & plans',
      value: GUIDES_STORIES_NAV_LABEL,
      href: '/for-families',
    },
    {
      label: 'List apps → see exposure',
      value: 'Footprint review',
      href: '/digital-footprint',
    },
    {
      label: 'Missions on this device',
      value: 'Family Hub',
      href: '/family-hub',
    },
  ];

  const spotlightLinks = useMemo(() => {
    const links = [
      {
        title: 'Privacy Panda stories',
        description: 'Interactive adventures—open anytime, no catalog setup required.',
        href: '/stories',
        tag: 'Open anytime',
        cta: 'Browse stories',
      },
      {
        title: GUIDES_STORIES_NAV_LABEL,
        description: 'Stories, parent guides, and printables—independent of footprint review.',
        href: '/for-families',
        tag: 'Open anytime',
        cta: 'Browse',
      },
      {
        title: 'Footprint review',
        description: 'Add your family’s apps in the catalog, then see exposure scores from that list.',
        href: '/digital-footprint',
        tag: 'Uses service catalog',
        cta: 'Open',
      },
      {
        title: 'Family Hub',
        description: 'Age-matched missions and progress—optional, local to this device.',
        href: '/family-hub',
        tag: 'Open anytime',
        cta: 'Open',
      },
    ];

    if (foundationStory) {
      const storyLink = links[0];
      storyLink.title = foundationStory.title;
      storyLink.description = 'Read together—interactive scenes or chapters';
      storyLink.href = `/stories/${ORIGIN_STORY_SLUG}`;
      storyLink.cta = 'Open story';
    } else if (latestStory) {
      const storyLink = links[0];
      storyLink.title = latestStory.title;
      storyLink.description = latestStory.privacyTopic;
      storyLink.href = `/stories/${latestStory.slug}`;
      storyLink.cta = `Read episode ${latestStory.episodeNumber}`;
    }

    return links;
  }, [foundationStory, latestStory]);

  const primaryCta =
    journey.progressPercent > 0 && journey.resumePath.includes('footprint')
      ? { href: journey.resumePath, label: 'Continue footprint review' }
      : journey.progressPercent > 0 && journey.resumePath.includes('catalog')
        ? { href: journey.resumePath, label: 'Continue service catalog' }
        : { href: '/stories', label: 'Explore stories' };

  return (
    <div className="site-page">
      <section className="homepage-hero site-section" aria-labelledby="homepage-hero-title">
        <div className="container homepage-hero__inner">
          <header className="page-section__header homepage-hero__header">
            <span className="page-section__eyebrow homepage-hero__eyebrow">
              <ShieldCheck size={14} aria-hidden />
              Family privacy guidance
            </span>
            <img
              src="/LogoPandagarde.png"
              alt=""
              aria-hidden
              className="homepage-hero__logo h-16 w-16 shrink-0 object-contain sm:h-[4.5rem] sm:w-[4.5rem]"
            />
            <p className="page-section__lead homepage-hero__tagline">
              Stories · Guides · Footprint · Family Hub
            </p>
            <h1 id="homepage-hero-title" className="homepage-hero__title">
              A calmer way to protect your family’s
              <span> digital life</span>
            </h1>
            <p className="page-section__lead">{INDEPENDENT_AREAS_LEAD}</p>
          </header>

          <div className="homepage-hero__actions">
            <Link to={primaryCta.href} className="button button-primary inline-flex items-center justify-center gap-2">
              {primaryCta.label}
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              to="/digital-footprint"
              className="button button-secondary inline-flex items-center justify-center"
            >
              Footprint review
            </Link>
            <Link to="/how-it-works" className="button button-secondary inline-flex items-center justify-center">
              How it works
            </Link>
          </div>

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

      <main className="page-layout__main">
        <div className="container">
          <div className="page-content">
            <PageSection
              className="homepage-glance"
              header={{
                eyebrow: 'Four doors',
                title: 'Use what fits today',
                lead: 'Nothing on PandaGarde blocks the rest. Only footprint review needs apps listed in the catalog.',
              }}
            >
              <ul className="homepage-path shell-grid shell-grid--2 lg:grid-cols-4">
                {entryPoints.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="homepage-path__step shell-card h-full">
                      <h3 className="shell-card__title text-base">{item.value}</h3>
                      <p className="shell-card__body mt-2 text-sm">{item.label}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </PageSection>

            <PageSection
              className="homepage-spotlight"
              header={{
                eyebrow: 'Explore',
                title: 'Popular starting points',
                lead: 'Same areas as above—pick one; you are not locked into a single path.',
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
                    cta={
                      <>
                        {item.cta}
                        <ChevronRight size={16} aria-hidden />
                      </>
                    }
                  />
                ))}
              </div>
              {(foundationStory || latestStory) && (
                <p className="homepage-spotlight__see-all">
                  <Link to="/stories" className="font-medium text-green-700 hover:underline dark:text-green-400">
                    See all stories →
                  </Link>
                </p>
              )}
            </PageSection>

            <PageSection
              className="homepage-closing"
              header={{
                eyebrow: 'Footprint when you want it',
                title: 'Catalog establishes the review',
                lead: 'Add apps in the service catalog when you want scores and charts. Stories, guides, and Hub stay available before, during, and after.',
              }}
            >
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/service-catalog" className="button button-primary inline-flex items-center gap-1.5">
                  Service catalog
                  <ArrowRight size={14} aria-hidden />
                </Link>
                <Link to="/digital-footprint" className="button button-secondary inline-flex items-center gap-1.5">
                  Footprint review
                </Link>
                <Link to="/stories" className="button button-secondary inline-flex items-center gap-1.5">
                  Stories
                </Link>
              </div>
              <p className="homepage-closing__followup page-section__lead text-center">
                Still have questions?{' '}
                <Link to="/how-it-works#faq" className="font-semibold text-green-700 hover:underline dark:text-green-400">
                  See how PandaGarde works and common answers
                </Link>
              </p>
            </PageSection>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
