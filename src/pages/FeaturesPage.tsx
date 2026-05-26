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
    title: 'Stories & guides',
    description:
      'Privacy Panda adventures and parent materials—open anytime. No catalog or footprint review required.',
    icon: BookOpen,
    href: '/stories',
  },
  {
    title: 'Footprint from your catalog',
    description:
      'List apps in the service catalog when you want scores. Footprint review reads that list—it does not unlock the rest of the site.',
    icon: ShieldCheck,
    href: '/service-catalog',
  },
  {
    title: 'Family Hub',
    description:
      'Missions and progress on your device—optional, before or after a footprint review.',
    icon: LayoutDashboard,
    href: '/family-hub',
  },
];

const benefits = [
  'Stories, guides, Hub, and footprint review—use any door first',
  'Catalog lists apps; footprint review reads that list (nothing else is gated)',
  'Progress saved on your device—no PandaGarde account required',
  'Emotional, age-matched content—not a single forced checklist',
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
      'Footprint review gives a snapshot when you list apps in the catalog.',
      'Stories and resources work on their own when you need a calm moment.',
      'Family Hub keeps missions and progress in one place on your device.',
    ],
  },
];

const journeyLayers = [
  {
    title: 'Stories & guides',
    description: 'Privacy Panda and parent materials—open anytime, no catalog required.',
    icon: BookOpen,
    points: ['Read together', 'Independent of footprint', 'Age-matched tone'],
  },
  {
    title: 'Footprint from catalog',
    description: 'List apps once; review exposure when you want a household snapshot.',
    icon: Fingerprint,
    points: ['Catalog builds the list', 'Review uses that list', 'Optional timing'],
  },
  {
    title: 'Family Hub',
    description: 'Missions and progress on your device—before, after, or without a review.',
    icon: Home,
    points: ['Local progress', 'Parent-guided missions', 'Not blocked by DFA'],
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
    question: 'Do we have to finish footprint review before stories or Family Hub?',
    answer:
      'No. Stories, guides, and Family Hub are independent. Only the footprint review page needs apps in your service catalog so scores have something to analyze.',
  },
  {
    question: 'Do we have to open Family Hub on day one?',
    answer:
      'No. Many families start with a story or a guide, use footprint review when they want a snapshot, and open Family Hub whenever missions fit the week.',
  },
  {
    question: 'Does PandaGarde monitor what my child does online?',
    answer:
      'No. You list services your family uses; PandaGarde does not watch live activity on a child’s device.',
  },
  {
    question: 'What is the service catalog for?',
    answer:
      'It is the list of apps and services your family uses. Footprint review reads that list to show exposure. The catalog does not gate stories, resources, or Family Hub.',
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
      subtitle="Stories, guides, and Family Hub stand on their own. The catalog feeds footprint review when you want a snapshot."
      breadcrumbs={true}
    >
      <PageLead>
        PandaGarde is not one long checklist. Families read stories, use guides, open Family Hub, or run a footprint
        review when it helps—only the review needs apps listed in the catalog.
      </PageLead>

      <PageSection header={{ eyebrow: 'Your path', title: 'Four areas—pick what fits' }}>
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
