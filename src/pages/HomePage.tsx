import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Fingerprint,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { loadDfaJourneyState } from '../lib/dfaJourney';
import { getFoundationStory, getHomepageLatestStory, ORIGIN_STORY_SLUG } from '../data/stories';
import { StoryCoverArt } from '../components/stories/StoryCoverArt';

const HomePage: React.FC = () => {
  const journey = useMemo(() => loadDfaJourneyState(), []);
  const foundationStory = useMemo(() => getFoundationStory(), []);
  const latestStory = useMemo(() => getHomepageLatestStory(), []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animationElements = document.querySelectorAll('.reveal-on-scroll, .slide-in-left, .slide-in-right');
    animationElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const trustPoints = [
    'Your data stays on your device',
    'Guidance for parents and kids',
    'Pick up where you left off in Family Hub',
  ];

  const flowSteps = [
    {
      eyebrow: 'Start',
      title: 'Map your family’s digital footprint',
      description: 'List the apps and services your household uses so you know where to focus first.',
    },
    {
      eyebrow: 'Prioritize',
      title: 'See what matters now',
      description: 'Turn the review into a short list of practical next steps—not an endless checklist.',
    },
    {
      eyebrow: 'Sustain',
      title: 'Keep progress in one place',
      description: 'Use Family Hub for missions, goals, and follow-through after the first review.',
    },
  ];

  const quickStats = [
    { label: 'Best place to begin', value: 'Digital Footprint Analysis' },
    { label: 'Learn and plan on the site', value: 'Guides & stories' },
    { label: 'Practice as a family', value: 'Family Hub' },
  ];

  const spotlightCards = [
    {
      title: 'Digital Footprint Analysis',
      description: 'See which apps and services shape your household privacy—then decide what to tackle first.',
      href: '/digital-footprint',
      tag: 'Recommended first step',
    },
    {
      title: 'Family Hub',
      description: 'Missions, members, and progress on your device—continue after your first review.',
      href: '/family-hub',
      tag: 'Family workspace',
    },
  ];

  return (
    <>
      <section className="homepage-hero premium-hero py-6 md:py-10">
        <div className="container premium-hero__container px-4 sm:px-6 lg:px-8">
          <div className="premium-hero__content slide-in-left">
            <div className="premium-hero__intro">
              <span className="premium-hero__eyebrow-pill">
                <ShieldCheck size={14} aria-hidden />
                Family privacy guidance
              </span>
              <div className="premium-hero__logo-badge">
                <img src="/LogoPandagarde.png" alt="" aria-hidden />
              </div>
              <p className="premium-hero__eyebrow-text">Review first · Learn together · Act in Family Hub</p>
            </div>

            <div className="premium-hero__copy">
              <h1>
                A calmer way to protect your family’s
                <span> digital life</span>
              </h1>
              <p>
                Start with a guided privacy review, use age-appropriate resources when you need them, and keep
                momentum in Family Hub—without turning privacy into a pile of scattered tabs and notes.
              </p>
            </div>

            <div className="premium-hero__actions">
              <Link to={journey.resumePath} className="button button-primary premium-hero__primary-action">
                {journey.progressPercent > 0 ? 'Continue your journey' : 'Start Digital Footprint Analysis'}
                <ArrowRight size={18} aria-hidden />
              </Link>
              <Link to="/how-it-works" className="button button-secondary premium-hero__secondary-action">
                How it works
              </Link>
            </div>

            <div className="premium-hero__trust-row">
              {trustPoints.map((item) => (
                <div key={item} className="premium-hero__trust-item">
                  <CheckCircle size={16} aria-hidden />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-hero__visual slide-in-right" aria-hidden="true">
            <div className="premium-hero__glow premium-hero__glow--one" />
            <div className="premium-hero__glow premium-hero__glow--two" />
            <div className="premium-hero__floating-chip premium-hero__floating-chip--top premium-hero__floating-chip--accent">
              <ShieldCheck size={14} />
              Stays on your device
            </div>
            <div className="premium-hero__floating-chip premium-hero__floating-chip--bottom premium-hero__floating-chip--info">
              <BookOpen size={14} />
              For the whole household
            </div>

            <div className="premium-hero__workspace-card">
              <div className="premium-hero__workspace-topbar">
                <div className="premium-hero__workspace-brand">
                  <div className="premium-hero__workspace-icon premium-hero__workspace-icon--logo">
                    <img src="/LogoPandagarde.png" alt="" />
                  </div>
                  <div>
                    <strong>Family Hub</strong>
                    <span>Your family workspace</span>
                  </div>
                </div>
                <div className="premium-hero__status-pill">On this device</div>
              </div>

              <div className="premium-hero__workspace-grid">
                <div className="premium-hero__metric-card premium-hero__metric-card--primary">
                  <span className="premium-hero__metric-label">Your path</span>
                  <strong>Review → plan → Family Hub</strong>
                  <p>One sequence instead of jumping between unrelated tools.</p>
                </div>

                <div className="premium-hero__metric-row">
                  <div className="premium-hero__mini-card">
                    <span>Step 1</span>
                    <strong>Footprint review</strong>
                  </div>
                  <div className="premium-hero__mini-card">
                    <span>Step 2</span>
                    <strong>Family follow-through</strong>
                  </div>
                </div>

                <div className="premium-hero__journey-list">
                  {flowSteps.map((step, index) => (
                    <div key={step.title} className="premium-hero__journey-item">
                      <div className="premium-hero__journey-index">0{index + 1}</div>
                      <div className="premium-hero__journey-copy">
                        <span>{step.eyebrow}</span>
                        <strong>{step.title}</strong>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-stats reveal-on-scroll py-8 md:py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="homepage-stats__grid">
            {quickStats.map((item, index) => (
              <article key={item.label} className="homepage-stats__card">
                <div className="homepage-stats__index">0{index + 1}</div>
                <div className="homepage-stats__content">
                  <span className="homepage-stats__label">{item.label}</span>
                  <strong className="homepage-stats__value">{item.value}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-spotlight reveal-on-scroll">
        <div className="container homepage-spotlight__container">
          <div className="homepage-spotlight__copy">
            <span className="badge">Start here</span>
            <h2>Two places families use most</h2>
            <p>
              Run your first review on the site, then open Family Hub when you are ready for missions and ongoing
              progress. Stories and guides are there when you want to learn together.
            </p>
          </div>
          <div className="homepage-spotlight__grid">
            {spotlightCards.map((item) => (
              <Link key={item.title} to={item.href} className="homepage-spotlight__card">
                <span className="homepage-spotlight__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="homepage-spotlight__cta">
                  Open
                  <ChevronRight size={16} aria-hidden />
                </span>
              </Link>
            ))}
            <Link to="/resources" className="homepage-spotlight__card">
              <span className="homepage-spotlight__tag">Guides & activities</span>
              <h3>Resources by audience</h3>
              <p>Parent guides, kids’ stories, and educator materials in one place.</p>
              <span className="homepage-spotlight__cta">
                Browse resources
                <ChevronRight size={16} aria-hidden />
              </span>
            </Link>
            {foundationStory && (
              <Link
                to={`/stories/${ORIGIN_STORY_SLUG}`}
                className="homepage-spotlight__card homepage-spotlight__card--story"
              >
                <span className="homepage-spotlight__tag">Story · start here</span>
                <div className="flex items-start gap-3">
                  <StoryCoverArt story={foundationStory} variant="inline" />
                  <div>
                    <h3>{foundationStory.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Read together—interactive scenes or chapters
                    </p>
                  </div>
                </div>
                <span className="homepage-spotlight__cta">
                  Open story
                  <ChevronRight size={16} aria-hidden />
                </span>
              </Link>
            )}
            {latestStory && latestStory.slug !== ORIGIN_STORY_SLUG && (
              <Link
                to={`/stories/${latestStory.slug}`}
                className="homepage-spotlight__card homepage-spotlight__card--story"
              >
                <span className="homepage-spotlight__tag">Latest story</span>
                <div className="flex items-start gap-3">
                  <span className="text-3xl" aria-hidden="true">
                    {latestStory.coverEmoji}
                  </span>
                  <div>
                    <h3>{latestStory.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{latestStory.privacyTopic}</p>
                  </div>
                </div>
                <span className="homepage-spotlight__cta">
                  Read episode {latestStory.episodeNumber}
                  <ChevronRight size={16} aria-hidden />
                </span>
              </Link>
            )}
          </div>
          {(foundationStory || latestStory) && (
            <p className="homepage-spotlight__see-all mt-4">
              <Link to="/stories" className="font-medium text-green-700 hover:underline dark:text-green-400">
                See all stories →
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="homepage-closing-cta reveal-on-scroll">
        <div className="container homepage-closing-cta__container">
          <div className="homepage-closing-cta__copy">
            <span className="badge">Ready when you are</span>
            <h2>Start with your family’s digital footprint review.</h2>
            <p>
              It takes a few minutes to list what your household uses online. Family Hub is there when you want
              missions and follow-through—no rush to open it on day one.
            </p>
          </div>
          <div className="homepage-closing-cta__actions">
            <Link to="/digital-footprint" className="button button-primary">
              Start Digital Footprint Analysis
            </Link>
            <Link to="/family-hub" className="button button-secondary">
              Open Family Hub
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
