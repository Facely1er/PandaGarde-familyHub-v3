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
import {
  PageLead,
  PageSection,
  ShellIconCard,
  ShellPillarCard,
  ShellRowCard,
  ShellTextCard,
} from '../components/layout/PageContent';

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
    points: [
      'Notes, tabs, and one-off conversations never become a household routine.',
      'It is hard to know which setting or app to fix first.',
      'Kids hear different rules in different moments, without a shared story.',
    ],
  },
  {
    eyebrow: 'With PandaGarde',
    title: 'Review, learn, and follow through together',
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
    description:
      'Core progress stays on your device. PandaGarde is built for families who want guidance without unnecessary data collection.',
    icon: WifiOff,
  },
  {
    title: 'One job per step',
    description:
      'The site helps you review and learn. Family Hub helps you practice and follow through—so each visit has a clear purpose.',
    icon: ShieldCheck,
  },
  {
    title: 'Built for households',
    description:
      'Parents, kids, and educators each have an entry point, without splitting the family into separate products.',
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
      <PageLead>
        PandaGarde is two connected parts: this website for your first review and learning, and Family Hub for
        missions and progress. You can move at your own pace—there is no requirement to use everything at once.
      </PageLead>

      <PageSection header={{ eyebrow: 'Your path', title: 'Three steps families follow' }}>
        <div className="shell-stack">
          {flow.map((item, index) => {
            const Icon = item.icon;
            return (
              <ShellRowCard
                key={item.title}
                iconLabel={`${index + 1}`}
                icon={<Icon size={22} />}
                title={item.title}
                description={item.description}
                action={
                  <Link
                    to={item.href}
                    className="button button-secondary inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    Open <ArrowRight size={16} aria-hidden />
                  </Link>
                }
              />
            );
          })}
        </div>
      </PageSection>

      <PageSection header={{ title: 'What you get' }}>
        <div className="shell-card shell-card--panel shell-card--panel-inner">
          <div className="shell-grid shell-grid--2">
            {benefits.map((item) => (
              <div key={item} className="shell-card shell-card--nested flex items-center gap-3 p-4">
                <CheckCircle2
                  size={18}
                  className="flex-shrink-0 text-green-700 dark:text-green-400"
                  aria-hidden
                />
                <span className="shell-card__body text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection
        header={{
          eyebrow: 'Before and after',
          title: 'From scattered worry to a plan you can keep',
          lead: 'Families often already care about privacy—the missing piece is a sequence that does not fall apart after the first weekend of good intentions.',
        }}
      >
        <div className="shell-grid shell-grid--2">
          {transformationColumns.map((column) => (
            <ShellPillarCard key={column.title} eyebrow={column.eyebrow} title={column.title}>
              <ul className="shell-list">
                {column.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </ShellPillarCard>
          ))}
        </div>
      </PageSection>

      <PageSection
        header={{
          eyebrow: 'How the journey is organized',
          title: 'Three layers, one path',
          lead: 'Each stage has a clear purpose so you are not asked to learn, plan, and operate in the same screen at once.',
        }}
      >
        <div className="shell-grid shell-grid--3">
          {journeyLayers.map((item) => {
            const Icon = item.icon;
            return (
              <ShellIconCard key={item.title} icon={<Icon size={20} aria-hidden />} title={item.title}>
                <p className="shell-card__body text-sm">{item.description}</p>
                <ul className="shell-list">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </ShellIconCard>
            );
          })}
        </div>
      </PageSection>

      <PageSection header={{ eyebrow: 'Who it is for', title: 'One family, different entry points' }}>
        <div className="shell-grid shell-grid--3">
          {audienceCards.map((item) => {
            const Icon = item.icon;
            return (
              <ShellIconCard key={item.title} icon={<Icon size={20} aria-hidden />} title={item.title}>
                <p className="shell-card__body text-sm">{item.description}</p>
              </ShellIconCard>
            );
          })}
        </div>
      </PageSection>

      <PageSection
        id="faq"
        className="scroll-mt-24"
        header={{ eyebrow: 'Common questions', title: 'Quick answers' }}
      >
        <div className="shell-grid shell-grid--3">
          {faqCards.map((item) => (
            <ShellTextCard key={item.question} title={item.question}>
              <p className="shell-card__body text-sm">{item.answer}</p>
            </ShellTextCard>
          ))}
        </div>
      </PageSection>

      <PageSection header={{ eyebrow: 'Our approach', title: 'Designed for real family use' }}>
        <div className="shell-grid shell-grid--3">
          {trustPoints.map((item) => {
            const Icon = item.icon;
            return (
              <ShellIconCard key={item.title} icon={<Icon size={20} aria-hidden />} title={item.title}>
                <p className="shell-card__body text-sm">{item.description}</p>
              </ShellIconCard>
            );
          })}
        </div>
      </PageSection>

      <div className="shell-card shell-card--panel shell-cta-panel">
        <div className="shell-cta-panel__copy">
          <h2 className="page-section__title">Ready to begin?</h2>
          <p className="shell-card__body">
            Start with Digital Footprint Analysis, or open Family Hub when you are ready.
          </p>
        </div>
        <div className="shell-cta-panel__actions">
          <Link to="/digital-footprint" className="button button-primary inline-flex items-center gap-1.5">
            Start review <ArrowRight size={14} aria-hidden />
          </Link>
          <Link to="/family-hub" className="button button-secondary inline-flex items-center gap-1.5">
            Family Hub
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default FeaturesPage;
