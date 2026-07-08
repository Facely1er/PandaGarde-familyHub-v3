import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  type LucideIcon,
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

const FLOW_ICONS: LucideIcon[] = [BookOpen, ShieldCheck, LayoutDashboard];
const FLOW_HREFS = ['/stories', '/service-catalog', '/family-hub'];
const JOURNEY_ICONS: LucideIcon[] = [BookOpen, Fingerprint, Home];
const AUDIENCE_ICONS: LucideIcon[] = [Users, GraduationCap, Lock];
const TRUST_ICONS: LucideIcon[] = [WifiOff, ShieldCheck, Users];

interface FlowItem {
  title: string;
  description: string;
}
interface CardWithPoints {
  title: string;
  description: string;
  points: string[];
}
interface TransformationColumn {
  eyebrow: string;
  title: string;
  points: string[];
}
interface TitleDescription {
  title: string;
  description: string;
}
interface QAItem {
  question: string;
  answer: string;
}

const FeaturesPage: React.FC = () => {
  const { t } = useTranslation();

  const flow = (t('howItWorks.flow', { returnObjects: true }) as FlowItem[]).map((item, index) => ({
    ...item,
    icon: FLOW_ICONS[index],
    href: FLOW_HREFS[index],
  }));
  const benefits = t('howItWorks.benefits', { returnObjects: true }) as string[];
  const transformationColumns = t('howItWorks.transformationColumns', {
    returnObjects: true,
  }) as TransformationColumn[];
  const journeyLayers = (
    t('howItWorks.journeyLayers', { returnObjects: true }) as CardWithPoints[]
  ).map((item, index) => ({ ...item, icon: JOURNEY_ICONS[index] }));
  const audienceCards = (
    t('howItWorks.audienceCards', { returnObjects: true }) as TitleDescription[]
  ).map((item, index) => ({ ...item, icon: AUDIENCE_ICONS[index] }));
  const faqCards = t('howItWorks.faqCards', { returnObjects: true }) as QAItem[];
  const trustPoints = (
    t('howItWorks.trustPoints', { returnObjects: true }) as TitleDescription[]
  ).map((item, index) => ({ ...item, icon: TRUST_ICONS[index] }));

  return (
    <PageLayout
      title={t('howItWorks.title')}
      subtitle={t('howItWorks.subtitle')}
      breadcrumbs={true}
    >
      <PageLead>
        {t('howItWorks.lead')}
      </PageLead>

      <PageSection header={{ eyebrow: t('howItWorks.yourPath'), title: t('howItWorks.fourAreas') }}>
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
                    {t('common.open')} <ArrowRight size={16} aria-hidden />
                  </Link>
                }
              />
            );
          })}
        </div>
      </PageSection>

      <PageSection header={{ title: t('howItWorks.whatYouGet') }}>
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
          eyebrow: t('howItWorks.beforeAfter'),
          title: t('howItWorks.beforeAfterTitle'),
          lead: t('howItWorks.beforeAfterLead'),
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
          eyebrow: t('howItWorks.journeyEyebrow'),
          title: t('howItWorks.journeyTitle'),
          lead: t('howItWorks.journeyLead'),
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

      <PageSection header={{ eyebrow: t('howItWorks.whoEyebrow'), title: t('howItWorks.whoTitle') }}>
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
        header={{ eyebrow: t('howItWorks.faqEyebrow'), title: t('howItWorks.faqTitle') }}
      >
        <div className="shell-grid shell-grid--3">
          {faqCards.map((item) => (
            <ShellTextCard key={item.question} title={item.question}>
              <p className="shell-card__body text-sm">{item.answer}</p>
            </ShellTextCard>
          ))}
        </div>
      </PageSection>

      <PageSection header={{ eyebrow: t('howItWorks.approachEyebrow'), title: t('howItWorks.approachTitle') }}>
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

      <div className="shell-card shell-card--panel shell-cta-panel flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="shell-cta-panel__copy">
          <h2 className="page-section__title">{t('howItWorks.readyTitle')}</h2>
          <p className="shell-card__body">
            {t('howItWorks.readyBody')}
          </p>
        </div>
        <div className="shell-cta-panel__actions flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link to="/digital-footprint" className="button button-primary inline-flex items-center gap-1.5">
            {t('howItWorks.startReview')} <ArrowRight size={14} aria-hidden />
          </Link>
          <Link to="/family-hub" className="button button-secondary inline-flex items-center gap-1.5">
            {t('common.familyHub')}
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default FeaturesPage;
