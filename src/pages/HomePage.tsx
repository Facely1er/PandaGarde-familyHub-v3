import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { loadDfaJourneyState } from '../lib/dfaJourney';
import { getFoundationStory, getHomepageLatestStory, ORIGIN_STORY_SLUG } from '../data/stories';
import { PageSection, ShellLinkCard } from '../components/layout/PageContent';

const HomePage: React.FC = () => {
  const journey = useMemo(() => loadDfaJourneyState(), []);
  const foundationStory = useMemo(() => getFoundationStory(), []);
  const latestStory = useMemo(() => getHomepageLatestStory(), []);

  const trustPoints = [
    'Your data stays on your device',
    'Guidance for parents and kids',
    'Pick up where you left off in Family Hub',
  ];

  const pathCards = [
    {
      label: 'Best place to begin',
      value: 'Digital Footprint Analysis',
      href: '/digital-footprint',
    },
    { label: 'Learn and plan on the site', value: 'Guides & stories', href: '/resources' },
    { label: 'Practice as a family', value: 'Family Hub', href: '/family-hub' },
  ];

  const spotlightLinks = useMemo(() => {
    const links = [
      {
        title: 'Digital Footprint Analysis',
        description:
          'See which apps and services shape your household privacy—then decide what to tackle first.',
        href: '/digital-footprint',
        tag: 'Recommended first step',
        cta: 'Open',
      },
      {
        title: 'Family Hub',
        description: 'Missions, members, and progress on your device—continue after your first review.',
        href: '/family-hub',
        tag: 'Family workspace',
        cta: 'Open',
      },
      {
        title: 'Resources by audience',
        description: 'Parent guides, kids’ stories, and educator materials.',
        href: '/resources',
        tag: 'Guides & activities',
        cta: 'Browse',
      },
    ];

    if (foundationStory) {
      links.push({
        title: foundationStory.title,
        description: 'Read together—interactive scenes or chapters',
        href: `/stories/${ORIGIN_STORY_SLUG}`,
        tag: 'Story · start here',
        cta: 'Open story',
      });
    } else if (latestStory) {
      links.push({
        title: latestStory.title,
        description: latestStory.privacyTopic,
        href: `/stories/${latestStory.slug}`,
        tag: 'Latest story',
        cta: `Read episode ${latestStory.episodeNumber}`,
      });
    }

    return links;
  }, [foundationStory, latestStory]);

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
              Review first · Learn together · Act in Family Hub
            </p>
            <h1 id="homepage-hero-title" className="homepage-hero__title">
              A calmer way to protect your family’s
              <span> digital life</span>
            </h1>
            <p className="page-section__lead">
              Start with a guided privacy review, use age-appropriate resources when you need them, and keep
              momentum in Family Hub—without turning privacy into a pile of scattered tabs and notes.
            </p>
          </header>

          <div className="homepage-hero__actions">
            <Link to={journey.resumePath} className="button button-primary inline-flex items-center justify-center gap-2">
              {journey.progressPercent > 0 ? 'Continue your journey' : 'Start Digital Footprint Analysis'}
              <ArrowRight size={18} aria-hidden />
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
                eyebrow: 'At a glance',
                title: 'Review, learn, and follow through',
                lead: 'The site helps you map your footprint and find guidance; Family Hub helps you practice and keep progress on your device.',
              }}
            >
              <ol className="homepage-path shell-grid shell-grid--3">
                {pathCards.map((item, index) => (
                  <li key={item.label}>
                    <Link to={item.href} className="homepage-path__step shell-card">
                      <div className="homepage-path__head">
                        <span className="homepage-path__index" aria-hidden>
                          {index + 1}
                        </span>
                        <h3 className="shell-card__title text-base">{item.value}</h3>
                      </div>
                      <p className="shell-card__body text-sm">{item.label}</p>
                    </Link>
                  </li>
                ))}
              </ol>
            </PageSection>

            <PageSection
              className="homepage-spotlight"
              header={{
                eyebrow: 'Start here',
                title: 'Two places families use most',
                lead: 'Review on the site first—open Family Hub when you want missions and progress. Stories and guides are there when you want to learn together.',
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
                eyebrow: 'Ready when you are',
                title: 'Start with your family’s digital footprint review.',
                lead: 'It takes a few minutes to list what your household uses online. Family Hub is there when you want missions and follow-through—no rush to open it on day one.',
              }}
            >
              <Link to="/digital-footprint" className="button button-primary inline-flex items-center gap-1.5">
                Start Digital Footprint Analysis
                <ArrowRight size={14} aria-hidden />
              </Link>
              <Link to="/family-hub" className="button button-secondary inline-flex items-center gap-1.5">
                Open Family Hub
              </Link>
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
