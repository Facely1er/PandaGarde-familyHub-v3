import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { loadDfaJourneyState } from '../lib/dfaJourney';
import { getFoundationStory, getHomepageLatestStory, ORIGIN_STORY_SLUG } from '../data/stories';
// INDEPENDENT_AREAS_LEAD not used here — replaced with inline mental-model copy in hero
import { GUIDES_STORIES_NAV_LABEL } from '../data/siteNavigation';
import { PageSection, ShellLinkCard } from '../components/layout/PageContent';

const HomePage: React.FC = () => {
  const journey = useMemo(() => loadDfaJourneyState(), []);
  const foundationStory = useMemo(() => getFoundationStory(), []);
  const latestStory = useMemo(() => getHomepageLatestStory(), []);

  const trustPoints = [
    'Your data stays on your device',
    'Stories and guides work without a footprint review',
    'List your apps anytime to see your footprint scores',
  ];

  const spotlightLinks = useMemo(() => {
    const links = [
      {
        title: 'Privacy Panda stories',
        description: 'Read together with your child—interactive scenes or calm chapters, no setup required.',
        href: '/stories',
        tag: 'Read together',
        cta: 'Browse stories',
      },
      {
        title: GUIDES_STORIES_NAV_LABEL,
        description: 'Conversation starters, a household privacy plan, and printable activities for families.',
        href: '/for-families',
        tag: 'Parent reference',
        cta: 'Browse',
      },
      {
        title: 'Footprint review',
        description: 'List the apps your family uses, then see where your data exposure adds up.',
        href: '/digital-footprint',
        tag: 'List apps first',
        cta: 'Open',
      },
      {
        title: 'Family Hub',
        description: '18 age-matched privacy missions your family completes together, saved on this device.',
        href: '/family-hub',
        tag: 'Practice on device',
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
        ? { href: journey.resumePath, label: 'Continue adding your apps' }
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
            <h1 id="homepage-hero-title" className="homepage-hero__title">
              Your kids are online.
              <span> Here’s a calm way to talk about it.</span>
            </h1>
            <p className="page-section__lead">
              Stories help your child understand privacy. The footprint review shows where your family’s data goes. Family Hub is where you put it into practice—together.
            </p>
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
          </div>
          <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
            Not sure where to start?{' '}
            <Link to="/how-it-works" className="font-medium text-green-700 hover:underline dark:text-green-400">
              See how it works
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

      <main className="page-layout__main">
        <div className="container">
          <div className="page-content">
            <PageSection
              className="homepage-spotlight"
              header={{
                eyebrow: 'Where to start',
                title: 'Pick what fits this week',
                lead: 'Each area works on its own—only the footprint review needs your app list first.',
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
                title: 'List your apps to see your footprint',
                lead: 'Tell PandaGarde which apps your family uses — that\'s what powers the footprint review. Stories, guides, and Hub are available any time before or after.',
              }}
            >
              <div className="homepage-closing__actions">
                <Link to="/service-catalog" className="button button-primary inline-flex items-center gap-1.5">
                  Add your family's apps
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
