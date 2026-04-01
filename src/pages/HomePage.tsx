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
  Sparkles,
  Users,
  WifiOff,
  Lock,
  GraduationCap,
  ClipboardCheck,
  Home,
  Shield,
} from 'lucide-react';
import { loadDfaJourneyState } from '../lib/dfaJourney';

const HomePage: React.FC = () => {
  const journey = useMemo(() => loadDfaJourneyState(), []);


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
    'Local-first privacy workflow',
    'Family-ready guidance',
    'Progress continuity from website to Family Hub',
  ];

  const coreActions = [
    {
      title: 'Understand exposure first',
      description: 'Run Digital Footprint Analysis to see where attention is needed before you start changing settings blindly.',
      icon: Fingerprint,
      href: '/digital-footprint',
      label: 'Open analysis',
      meta: 'Best first step',
    },
    {
      title: 'Learn together by age group',
      description: 'Use guided resources for parents, children, and educators without losing the larger family protection plan.',
      icon: BookOpen,
      href: '/resources',
      label: 'Explore resources',
      meta: 'Guided content',
    },
    {
      title: 'Continue inside Family Hub',
      description: 'Move findings into goals, checklists, and next actions with a workspace built for practical follow-through.',
      icon: LayoutDashboard,
      href: '/family-hub',
      label: 'Open Family Hub',
      meta: 'Operational workspace',
    },
  ];

  const flowSteps = [
    {
      eyebrow: 'Start',
      title: 'Map your family’s digital footprint',
      description: 'List the services, apps, and habits shaping your household exposure so you stop guessing where the risks are.',
    },
    {
      eyebrow: 'Prioritize',
      title: 'See what matters now',
      description: 'Separate high-value fixes from noise with a guided path that keeps parents focused on the next best action.',
    },
    {
      eyebrow: 'Sustain',
      title: 'Keep progress in one place',
      description: 'Carry findings into Family Hub so privacy work becomes an operating rhythm instead of a one-time checklist.',
    },
  ];

  const outcomeCards = [
    {
      title: 'Clarity without overload',
      description: 'A focused path for families who need practical guidance, not a pile of disconnected tools.',
      icon: Sparkles,
    },
    {
      title: 'Protection with continuity',
      description: 'From exposure review to action plan, the journey keeps context instead of forcing families to restart.',
      icon: ShieldCheck,
    },
    {
      title: 'Private by design',
      description: 'Built for local-first usage patterns so families can learn and act without unnecessary data collection.',
      icon: WifiOff,
    },
  ];

  const architectureCards = [
    {
      title: 'Review what is exposed',
      description: 'Start with one strong intake so the product knows where the family stands before it starts teaching or prompting.',
      icon: Fingerprint,
      points: ['Digital footprint first', 'Signal before settings', 'Fewer false priorities'],
    },
    {
      title: 'Turn guidance into action',
      description: 'Convert findings into practical steps with a cleaner system for accounts, devices, and household routines.',
      icon: ClipboardCheck,
      points: ['Structured action cards', 'Shared family routines', 'Clear next-best step'],
    },
    {
      title: 'Operate from one hub',
      description: 'Keep the progress, reminders, and follow-through inside a workspace that feels persistent rather than disposable.',
      icon: Home,
      points: ['Family Hub continuity', 'Progress visibility', 'Reusable privacy habits'],
    },
  ];


  const quickStats = [
    { label: 'One guided family journey', value: 'Website → Hub' },
    { label: 'Primary first action', value: 'Digital Footprint Analysis' },
    { label: 'Design principle', value: 'Local-first' },
  ];

  const spotlightCards = [
    {
      title: 'Digital Footprint Analysis',
      description: 'A practical intake that turns scattered services and habits into a visible privacy picture.',
      href: '/digital-footprint',
      tag: 'Best first action',
    },
    {
      title: 'Family Hub',
      description: 'A persistent workspace for priorities, routines, and follow-through after the initial review.',
      href: '/family-hub',
      tag: 'Operational continuity',
    },
  ];

  const transformationColumns = [
    {
      eyebrow: 'Without a system',
      title: 'Families guess, react, and restart',
      tone: 'before',
      points: [
        'Privacy work lives in scattered notes, browser tabs, and one-off conversations.',
        'Parents do not know what matters first, so urgent fixes compete with noise.',
        'Children learn fragmented rules without a shared household rhythm behind them.',
      ],
    },
    {
      eyebrow: 'With PandaGarde',
      title: 'One guided path from review to routine',
      tone: 'after',
      points: [
        'Digital Footprint Analysis creates a visible starting point before any major changes are made.',
        'The website routes families into the right next step instead of forcing every page to do everything.',
        'Family Hub keeps priorities, actions, and progress together so the work actually sticks.',
      ],
    },
  ];

  const faqCards = [
    {
      question: 'Do families need to start in Family Hub immediately?',
      answer: 'No. The homepage is designed to guide the first review clearly, then hand families into Family Hub once they are ready for follow-through.',
    },
    {
      question: 'What makes PandaGarde feel lighter than typical privacy tools?',
      answer: 'The structure separates discovery, guidance, and operations instead of dumping every concept into one interface on day one.',
    },
    {
      question: 'Why lead with Digital Footprint Analysis?',
      answer: 'Because families need signal before settings. A better intake produces better priorities and calmer decisions.',
    },
  ];

  const audienceCards = [
    {
      title: 'For parents',
      description: 'Make better decisions faster with clearer priorities, fewer distractions, and calmer guidance.',
      icon: Users,
    },
    {
      title: 'For children',
      description: 'Build healthier digital habits with age-aware explanations instead of fear-based warnings.',
      icon: GraduationCap,
    },
    {
      title: 'For the household',
      description: 'Create one shared privacy rhythm across accounts, devices, and online behavior.',
      icon: Lock,
    },
  ];

  const journeyRail = [
    {
      step: '01',
      title: 'Discover what is exposed',
      description: 'Start with Digital Footprint Analysis so the first decision is based on signal, not anxiety.',
      accent: 'Website start',
    },
    {
      step: '02',
      title: 'Turn findings into actions',
      description: 'Route the family into practical next steps for accounts, devices, and household routines.',
      accent: 'Guided action',
    },
    {
      step: '03',
      title: 'Keep momentum in Family Hub',
      description: 'Carry the context forward so progress, reminders, and ownership stay visible over time.',
      accent: 'Operational continuity',
    },
  ];

  const trustPrinciples = [
    {
      title: 'Privacy-first architecture',
      description: 'The experience is designed to minimize unnecessary data exposure and keep the workflow calm and intentional.',
    },
    {
      title: 'Product-led guidance',
      description: 'Each page has one job. The website guides. Family Hub helps the family operate and follow through.',
    },
    {
      title: 'Household-ready by design',
      description: 'The system is built around family routines, not just individual checklists or one-time audits.',
    },
  ];

  return (
    <>
      <section className="homepage-hero premium-hero">
        <div className="container premium-hero__container">
          <div className="premium-hero__content slide-in-left">
            <div className="premium-hero__eyebrow">
              <span className="premium-hero__eyebrow-pill">
                <ShieldCheck size={14} />
                Family Privacy Intelligence
              </span>
              <span className="premium-hero__eyebrow-text">Website guidance + Family Hub continuity</span>
            </div>

            <div className="premium-hero__copy">
              <h1>
                A calmer way to protect your family’s
                <span> digital life</span>
              </h1>
              <p>
                PandaGarde gives families one guided journey: understand exposure first, learn what to do next,
                and continue inside Family Hub with a cleaner, more confident privacy workflow.
              </p>
            </div>

            <div className="premium-hero__actions">
              <Link to={journey.resumePath} className="button button-primary premium-hero__primary-action">
                Continue your journey
                <ArrowRight size={18} />
              </Link>
              <Link to="/family-hub" className="button button-secondary premium-hero__secondary-action">
                Explore Family Hub
              </Link>
            </div>

            <div className="premium-hero__trust-row">
              {trustPoints.map((item) => (
                <div key={item} className="premium-hero__trust-item">
                  <CheckCircle size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-hero__visual slide-in-right" aria-hidden="true">
            <div className="premium-hero__glow premium-hero__glow--one" />
            <div className="premium-hero__glow premium-hero__glow--two" />
            <div className="premium-hero__floating-chip premium-hero__floating-chip--top">Local-first by design</div>
            <div className="premium-hero__floating-chip premium-hero__floating-chip--bottom">Website → Family Hub</div>

            <div className="premium-hero__workspace-card">
              <div className="premium-hero__workspace-topbar">
                <div className="premium-hero__workspace-brand">
                  <div className="premium-hero__workspace-icon">
                    <Shield size={18} />
                  </div>
                  <div>
                    <strong>PandaGarde Family Hub</strong>
                    <span>Operational workspace</span>
                  </div>
                </div>
                <div className="premium-hero__status-pill">Private workflow</div>
              </div>

              <div className="premium-hero__workspace-grid">
                <div className="premium-hero__metric-card premium-hero__metric-card--primary">
                  <span className="premium-hero__metric-label">Current path</span>
                  <strong>DFA → Action Plan → Hub</strong>
                  <p>One coherent route instead of disconnected pages and tools.</p>
                </div>

                <div className="premium-hero__metric-row">
                  <div className="premium-hero__mini-card">
                    <span>Exposure review</span>
                    <strong>Guided first step</strong>
                  </div>
                  <div className="premium-hero__mini-card">
                    <span>Family actions</span>
                    <strong>Prioritized next</strong>
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


      <section className="homepage-stats reveal-on-scroll">
        <div className="container">
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
            <span className="badge">What the product actually gives you</span>
            <h2>A guided website in front. A practical family workspace behind it.</h2>
            <p>
              The homepage should not feel like documentation. It should route families into the right starting point,
              then make the next operational step obvious.
            </p>
          </div>
          <div className="homepage-spotlight__grid">
            {spotlightCards.map((item) => (
              <Link key={item.title} to={item.href} className="homepage-spotlight__card">
                <span className="homepage-spotlight__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="homepage-spotlight__cta">
                  Open now
                  <ChevronRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-proofband reveal-on-scroll">
        <div className="container homepage-proofband__container">
          <div className="homepage-proofband__intro">
            <span>What PandaGarde is built to do</span>
            <h2>Make family privacy feel navigable, not overwhelming.</h2>
          </div>
          <div className="homepage-proofband__grid">
            {outcomeCards.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="homepage-proofband__card">
                  <div className="homepage-proofband__icon">
                    <Icon size={20} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="homepage-architecture reveal-on-scroll">
        <div className="container homepage-architecture__container">
          <div className="homepage-architecture__intro">
            <span className="badge">Why the product feels cleaner</span>
            <h2>A homepage that leads somewhere. A workspace that keeps the progress.</h2>
            <p>
              PandaGarde works because it separates discovery, guidance, and follow-through instead of forcing every page to do everything at once.
            </p>
          </div>

          <div className="homepage-architecture__grid">
            {architectureCards.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="homepage-architecture__card">
                  <div className="homepage-architecture__card-top">
                    <div className="homepage-architecture__icon">
                      <Icon size={20} />
                    </div>
                    <span className="homepage-architecture__eyebrow">System layer</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul className="homepage-architecture__list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="homepage-audience reveal-on-scroll">
        <div className="container homepage-audience__container">
          <div className="section-header homepage-section-header">
            <span className="badge">Built for real family use</span>
            <h2>One product, multiple ways to enter.</h2>
            <p>
              PandaGarde is designed to support parents, children, and the full household without fragmenting the experience into disconnected tools.
            </p>
          </div>

          <div className="homepage-audience__grid">
            {audienceCards.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="homepage-audience__card">
                  <div className="homepage-audience__icon"><Icon size={20} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="homepage-actions-section reveal-on-scroll">
        <div className="container">
          <div className="section-header homepage-section-header">
            <span className="badge">Start with the right entry point</span>
            <h2>Use the site for guidance. Use Family Hub for follow-through.</h2>
            <p>
              The homepage should immediately show where families begin, how they progress, and what the product becomes after the first review.
            </p>
          </div>

          <div className="homepage-action-grid">
            {coreActions.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} to={item.href} className="homepage-action-card">
                  <div className="homepage-action-card__header">
                    <div className="homepage-action-card__icon">
                      <Icon size={22} />
                    </div>
                    <span className="homepage-action-card__meta">{item.meta}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="homepage-action-card__cta">
                    {item.label}
                    <ChevronRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="homepage-transformation reveal-on-scroll">
        <div className="container homepage-transformation__container">
          <div className="homepage-transformation__intro">
            <span className="badge">Why the flow matters</span>
            <h2>Move from scattered privacy effort to a guided household operating rhythm.</h2>
            <p>
              The real value is not just more content. It is replacing fragmented family privacy work with a clearer sequence that holds together over time.
            </p>
          </div>
          <div className="homepage-transformation__grid">
            {transformationColumns.map((column) => (
              <article
                key={column.title}
                className={`homepage-transformation__card homepage-transformation__card--${column.tone}`}
              >
                <span className="homepage-transformation__eyebrow">{column.eyebrow}</span>
                <h3>{column.title}</h3>
                <ul className="homepage-transformation__list">
                  {column.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-faq reveal-on-scroll">
        <div className="container homepage-faq__container">
          <div className="homepage-faq__intro">
            <span className="badge">What families usually need clarified</span>
            <h2>Answering the friction before it slows the first step.</h2>
          </div>
          <div className="homepage-faq__grid">
            {faqCards.map((item) => (
              <article key={item.question} className="homepage-faq__card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-journey-rail reveal-on-scroll">
        <div className="container homepage-journey-rail__container">
          <div className="homepage-journey-rail__intro">
            <span className="badge">A clearer product rhythm</span>
            <h2>Designed to move families from uncertainty to steady follow-through.</h2>
            <p>
              Instead of dropping families into a dense privacy interface, PandaGarde stages the experience so each step feels smaller, clearer, and more actionable.
            </p>
            <div className="homepage-journey-rail__panel">
              <span className="homepage-journey-rail__panel-label">Product model</span>
              <strong>Website for guidance. Family Hub for continuity.</strong>
              <p>The system becomes more useful because the front door is simple and the operational layer keeps the progress alive.</p>
            </div>
          </div>

          <div className="homepage-journey-rail__timeline">
            {journeyRail.map((item) => (
              <article key={item.step} className="homepage-journey-rail__item">
                <div className="homepage-journey-rail__step">{item.step}</div>
                <div className="homepage-journey-rail__content">
                  <span>{item.accent}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-principles reveal-on-scroll">
        <div className="container homepage-principles__container">
          <div className="homepage-principles__intro">
            <span className="badge">Why the experience feels more premium</span>
            <h2>Built around product discipline, not page clutter.</h2>
          </div>
          <div className="homepage-principles__grid">
            {trustPrinciples.map((item) => (
              <article key={item.title} className="homepage-principles__card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-closing-cta reveal-on-scroll">
        <div className="container homepage-closing-cta__container">
          <div className="homepage-closing-cta__copy">
            <span className="badge">Begin with one clear next step</span>
            <h2>Start the review now, then continue inside Family Hub when you are ready.</h2>
            <p>
              PandaGarde works best when the first action is obvious. Start with exposure, then move into a structured family privacy workflow.
            </p>
          </div>
          <div className="homepage-closing-cta__actions">
            <Link to="/digital-footprint" className="button button-primary">
              Run Digital Footprint Analysis
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
