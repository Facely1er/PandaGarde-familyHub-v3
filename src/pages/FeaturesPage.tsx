import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  Users,
  GraduationCap,
  Lock,
  Fingerprint,
  ClipboardCheck,
  Home,
  WifiOff,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const flow = [
  {
    title: 'Discover your privacy exposure',
    description:
      "List the apps and services your family uses. Digital Footprint Analysis turns that into a clear picture of where to focus—not a lecture about every possible risk.",
    icon: ShieldCheck,
    href: '/digital-footprint',
  },
  {
    title: 'Learn what matters',
    description:
      'Use parent guides, kids’ stories, and classroom-ready materials when you need them—without losing sight of your household plan.',
    icon: BookOpen,
    href: '/resources',
  },
  {
    title: 'Take action in Family Hub',
    description:
      'Open Family Hub for age-matched missions, member profiles, and progress that stays on your device.',
    icon: LayoutDashboard,
    href: '/family-hub',
  },
];

const benefits = [
  'A clear first step instead of dozens of unrelated pages',
  'Guidance on the site, practice in Family Hub',
  'Progress saved on your device—no PandaGarde account required for the core journey',
  'Practical steps tied to what your family actually uses online',
];

const transformationColumns = [
  {
    eyebrow: 'Without a shared plan',
    title: 'Privacy work scatters and restarts',
    tone: 'before',
    points: [
      'Notes, tabs, and one-off conversations never become a household routine.',
      'It is hard to know which setting or app to fix first.',
      'Kids hear different rules in different moments, without a shared story.',
    ],
  },
  {
    eyebrow: 'With PandaGarde',
    title: 'Review, learn, and follow through together',
    tone: 'after',
    points: [
      'Digital Footprint Analysis gives you a visible starting point before big changes.',
      'Resources and stories meet parents, kids, and educators where they are.',
      'Family Hub keeps missions and progress in one place on your device.',
    ],
  },
];

const journeyLayers = [
  {
    title: 'Review what is exposed',
    description: 'Start with the services and habits your family already has—not generic checklists.',
    icon: Fingerprint,
    points: ['Footprint review first', 'Priorities before settings', 'Less guesswork for parents'],
  },
  {
    title: 'Turn guidance into action',
    description: 'Move from “we should do something” to concrete steps for accounts, devices, and conversations.',
    icon: ClipboardCheck,
    points: ['Clear next steps', 'Shared family routines', 'Age-appropriate language'],
  },
  {
    title: 'Stay organized in Family Hub',
    description: 'Keep missions, members, and progress where you can return to them—not lost in browser history.',
    icon: Home,
    points: ['Local progress on your device', 'Parent-guided missions', 'Continuity after the first review'],
  },
];

const audienceCards = [
  {
    title: 'For parents',
    description: 'Prioritize what matters, lead calmer conversations, and track follow-through without overwhelm.',
    icon: Users,
  },
  {
    title: 'For children',
    description: 'Learn through stories and missions matched to age—not fear-based warnings.',
    icon: GraduationCap,
  },
  {
    title: 'For the household',
    description: 'One shared rhythm for accounts, devices, and online habits across the family.',
    icon: Lock,
  },
];

const faqCards = [
  {
    question: 'Do we have to open Family Hub on day one?',
    answer:
      'No. Many families start with Digital Footprint Analysis and resources on the site, then open Family Hub when they want missions and ongoing practice.',
  },
  {
    question: 'Does PandaGarde monitor what my child does online?',
    answer:
      'No. You list services your family uses; PandaGarde does not watch live activity on a child’s device. Alerts come from what you add and optional public safety headlines—not spying.',
  },
  {
    question: 'Why start with Digital Footprint Analysis?',
    answer:
      'Because calm decisions need context first. Knowing which apps and services matter to your household makes the next steps smaller and clearer.',
  },
];

const trustPoints = [
  {
    title: 'Private by default',
    description: 'Core progress stays on your device. PandaGarde is built for families who want guidance without unnecessary data collection.',
    icon: WifiOff,
  },
  {
    title: 'One job per step',
    description: 'The site helps you review and learn. Family Hub helps you practice and follow through—so each visit has a clear purpose.',
    icon: ShieldCheck,
  },
  {
    title: 'Built for households',
    description: 'Parents, kids, and educators each have an entry point, without splitting the family into separate products.',
    icon: Users,
  },
];

const FeaturesPage: React.FC = () => {
  return (
    <PageLayout
      title="How PandaGarde Works"
      subtitle="Review on the website, learn with resources and stories, then continue in Family Hub on your device."
      breadcrumbs={true}
    >
      <section className="py-4 pb-8">
        <p className="shell-card__body mb-8 max-w-3xl">
          PandaGarde is two connected parts: this website for your first review and learning, and Family Hub for
          missions and progress. You can move at your own pace—there is no requirement to use everything at once.
        </p>

        <div className="mb-10 flex flex-col gap-5">
          {flow.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="shell-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div className="shell-icon h-16 w-16 flex-col font-bold">
                  <span className="text-xs">{index + 1}</span>
                  <Icon size={22} aria-hidden />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="shell-card__title text-lg">{item.title}</h2>
                  <p className="shell-card__body mt-1">{item.description}</p>
                </div>

                <Link
                  to={item.href}
                  className="button button-secondary inline-flex items-center gap-2 self-start whitespace-nowrap sm:self-auto"
                >
                  Open <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="shell-card shell-card--panel mb-10 p-6">
          <h2 className="shell-card__title mb-4 mt-0 text-xl">What you get</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {benefits.map((item) => (
              <div key={item} className="shell-card shell-card--nested flex items-center gap-3 p-4">
                <CheckCircle2 size={18} className="flex-shrink-0 text-green-700 dark:text-green-400" aria-hidden />
                <span className="shell-card__body text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wide text-green-800 dark:text-green-300">
            Before and after
          </span>
          <h2 className="shell-card__title mb-2 text-2xl">From scattered worry to a plan you can keep</h2>
          <p className="shell-card__body mb-6 max-w-2xl">
            Families often already care about privacy—the missing piece is a sequence that does not fall apart after
            the first weekend of good intentions.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {transformationColumns.map((column) => (
              <article
                key={column.title}
                className={`shell-card p-5 ${column.tone === 'before' ? '' : ''}`}
              >
                <span className="mb-2 inline-block rounded-full border border-gray-200 px-3 py-1 text-xs font-bold uppercase tracking-wide dark:border-gray-600">
                  {column.eyebrow}
                </span>
                <h3 className="shell-card__title mb-3 text-lg">{column.title}</h3>
                <ul className="shell-card__body list-none space-y-2 p-0">
                  {column.points.map((point) => (
                    <li key={point} className="relative pl-5 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-green-600 dark:before:bg-green-400">
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wide text-green-800 dark:text-green-300">
            How the journey is organized
          </span>
          <h2 className="shell-card__title mb-2 text-2xl">Three layers, one path</h2>
          <p className="shell-card__body mb-6 max-w-2xl">
            Each stage has a clear purpose so you are not asked to learn, plan, and operate in the same screen at once.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {journeyLayers.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="shell-card p-5">
                  <div className="shell-icon mb-4 h-12 w-12">
                    <Icon size={20} aria-hidden />
                  </div>
                  <h3 className="shell-card__title mb-2 text-base">{item.title}</h3>
                  <p className="shell-card__body mb-3 text-sm">{item.description}</p>
                  <ul className="shell-card__body list-none space-y-1 p-0 text-sm">
                    {item.points.map((point) => (
                      <li key={point}>· {point}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mb-10">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wide text-green-800 dark:text-green-300">
            Who it is for
          </span>
          <h2 className="shell-card__title mb-6 text-2xl">One family, different entry points</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {audienceCards.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="shell-card p-5">
                  <div className="shell-icon mb-4 h-12 w-12">
                    <Icon size={20} aria-hidden />
                  </div>
                  <h3 className="shell-card__title mb-2 text-base">{item.title}</h3>
                  <p className="shell-card__body text-sm">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mb-10">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wide text-green-800 dark:text-green-300">
            Common questions
          </span>
          <h2 className="shell-card__title mb-6 text-2xl">Quick answers</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {faqCards.map((item) => (
              <article key={item.question} className="shell-card p-5">
                <h3 className="shell-card__title mb-2 text-base">{item.question}</h3>
                <p className="shell-card__body text-sm">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wide text-green-800 dark:text-green-300">
            Our approach
          </span>
          <h2 className="shell-card__title mb-6 text-2xl">Designed for real family use</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {trustPoints.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="shell-card p-5">
                  <div className="shell-icon mb-4 h-12 w-12">
                    <Icon size={20} aria-hidden />
                  </div>
                  <h3 className="shell-card__title mb-2 text-base">{item.title}</h3>
                  <p className="shell-card__body text-sm">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="shell-card shell-card--panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="shell-card__title m-0 text-xl">Ready to begin?</h2>
            <p className="shell-card__body mt-2 mb-0">Start with Digital Footprint Analysis, or open Family Hub if you are already mid-journey.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/digital-footprint" className="button button-primary inline-flex items-center gap-2">
              Start review <ArrowRight size={16} aria-hidden />
            </Link>
            <Link to="/family-hub" className="button button-secondary inline-flex items-center gap-2">
              Open Family Hub
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FeaturesPage;
