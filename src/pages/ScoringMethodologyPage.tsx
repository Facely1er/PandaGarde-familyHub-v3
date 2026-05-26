import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  ChevronRight,
  Gauge,
  Info,
  Layers,
  LayoutGrid,
  ListChecks,
  Network,
  Shield,
  ShieldCheck,
  Tags,
  UserRound,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import {
  PageContent,
  PageLead,
  PageSection,
  ShellIconCard,
  ShellRowCard,
} from '../components/layout/PageContent';
import {
  dfaMethodology,
  perServiceMethodology,
  scoringLimitations,
  scoringLineageNote,
  scoringMethodologyIntro,
  SCORING_METHODOLOGY_VERSION,
} from '../data/scoringMethodology';

const JUMP_LINKS = [
  { href: '#score-bands', label: 'Score bands' },
  { href: '#per-app', label: 'Per-app index' },
  { href: '#dfa-methodology', label: 'DFA scoring' },
  { href: '#limitations', label: 'Limitations' },
] as const;

type ExposureBand = { range: string; label: string; meaning: string };

type BandTone = 'low' | 'medium' | 'high' | 'very-high';

function bandTone(label: string): BandTone {
  const normalized = label.toLowerCase();
  if (normalized.includes('very') || normalized === 'critical') return 'very-high';
  if (normalized === 'high') return 'high';
  if (normalized === 'moderate' || normalized === 'medium') return 'medium';
  return 'low';
}

function parseWeightPercent(weight: string): number {
  const match = weight.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

const FACTOR_ICONS: Record<string, LucideIcon> = {
  'Base risk level': Shield,
  'Privacy concern tags': Tags,
  'Minimum age': UserRound,
  Category: LayoutGrid,
  'Parent company & siblings': Building2,
};

function BandList({ bands }: { bands: ExposureBand[] }) {
  return (
    <ul className="methodology-bands__list">
      {bands.map((band) => {
        const tone = bandTone(band.label);
        return (
          <li key={band.range} className={`methodology-band methodology-band--${tone}`}>
            <div className="methodology-band__range" aria-hidden>
              <span className="methodology-band__range-text">{band.range}</span>
            </div>
            <div className="methodology-band__copy">
              <span className="methodology-band__label">{band.label}</span>
              <p className="methodology-band__meaning">{band.meaning}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ExposureBandComparison() {
  return (
    <section
      id="score-bands"
      className="scoring-methodology__section scoring-methodology__section--bands methodology-bands-compare"
      aria-labelledby="score-bands-heading"
    >
      <h2 id="score-bands-heading" className="methodology-bands-compare__title">
        Score bands at a glance
      </h2>
      <p className="methodology-bands-compare__lead">
        Both scores use 0–100 with the same color idea—green is calmer, red needs more attention. DFA household
        risk uses slightly different cutoffs than per-app indexes; compare them here once instead of repeating
        below.
      </p>
      <div className="methodology-bands-compare__grid">
        <div className="methodology-bands-compare__col">
          <h3 className="methodology-bands-compare__col-title">Per-app Privacy Exposure Index</h3>
          <p className="methodology-bands-compare__col-hint">Each service in the catalog</p>
          <BandList bands={perServiceMethodology.bands} />
        </div>
        <div className="methodology-bands-compare__col">
          <h3 className="methodology-bands-compare__col-title">DFA household risk score</h3>
          <p className="methodology-bands-compare__col-hint">Rollup on the footprint page gauge</p>
          <BandList bands={dfaMethodology.riskLevels} />
        </div>
      </div>
    </section>
  );
}

function WeightBar({ label, weight, description }: { label: string; weight: string; description: string }) {
  const pct = parseWeightPercent(weight);
  return (
    <li className="methodology-driver">
      <div className="methodology-driver__head">
        <span className="methodology-driver__label">{label}</span>
        <span className="methodology-driver__weight">{weight}</span>
      </div>
      <div
        className="methodology-driver__track"
        role="presentation"
        aria-hidden
      >
        <div className="methodology-driver__fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="methodology-driver__desc">{description}</p>
    </li>
  );
}

const ScoringMethodologyPage: React.FC = () => {
  return (
    <PageLayout
      title={scoringMethodologyIntro.title}
      subtitle={scoringMethodologyIntro.lead}
      breadcrumbs
    >
      <PageContent className="scoring-methodology">
        <div className="scoring-methodology__hero">
          <span className="scoring-methodology__version">Methodology v{SCORING_METHODOLOGY_VERSION}</span>
          <p className="scoring-methodology__hero-lead">
            Two related views—per-app exposure in the catalog, then household Digital Footprint Analysis when you
            are ready.
          </p>
          <ol className="scoring-methodology__flow" aria-label="How scores connect">
            <li className="scoring-methodology__flow-step">
              <span className="scoring-methodology__flow-icon" aria-hidden>
                <Layers size={22} />
              </span>
              <span className="scoring-methodology__flow-label">Service Catalog</span>
              <span className="scoring-methodology__flow-hint">You list apps</span>
            </li>
            <li className="scoring-methodology__flow-arrow" aria-hidden>
              <ChevronRight size={20} />
            </li>
            <li className="scoring-methodology__flow-step">
              <span className="scoring-methodology__flow-icon scoring-methodology__flow-icon--index" aria-hidden>
                <Gauge size={22} />
              </span>
              <span className="scoring-methodology__flow-label">0–100 index</span>
              <span className="scoring-methodology__flow-hint">Per-app exposure</span>
            </li>
            <li className="scoring-methodology__flow-arrow" aria-hidden>
              <ChevronRight size={20} />
            </li>
            <li className="scoring-methodology__flow-step">
              <span className="scoring-methodology__flow-icon scoring-methodology__flow-icon--dfa" aria-hidden>
                <BarChart3 size={22} />
              </span>
              <span className="scoring-methodology__flow-label">DFA risk score</span>
              <span className="scoring-methodology__flow-hint">Household rollup</span>
            </li>
          </ol>
        </div>

        <nav className="scoring-methodology__jump" aria-label="On this page">
          <ul className="scoring-methodology__jump-list">
            {JUMP_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="scoring-methodology__jump-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <PageLead>
          Educational scores from catalog metadata you choose—not live monitoring. Jump to any section above.
        </PageLead>

        <ExposureBandComparison />

        <PageSection
          id="per-app"
          className="scoring-methodology__section scoring-methodology__section--catalog"
          header={{
            eyebrow: 'Service catalog',
            title: perServiceMethodology.title,
            lead: perServiceMethodology.summary,
            icon: <Layers size={22} strokeWidth={2} />,
            iconTone: 'sky',
          }}
        >
          <div className="shell-grid shell-grid--2 methodology-factors">
            {perServiceMethodology.factors.map((factor) => {
              const Icon = FACTOR_ICONS[factor.label] ?? Shield;
              return (
                <ShellIconCard
                  key={factor.label}
                  icon={<Icon size={20} strokeWidth={2} />}
                  title={factor.label}
                  className="methodology-factor-card"
                >
                  <p className="shell-card__body text-sm">{factor.description}</p>
                </ShellIconCard>
              );
            })}
          </div>

          <p className="methodology-xref">
            Index ranges and labels are in{' '}
            <a href="#score-bands" className="scoring-methodology__text-link">
              Score bands at a glance
            </a>
            .
          </p>

          <p className="scoring-methodology__inline-cta">
            <Link to="/service-catalog" className="scoring-methodology__text-link">
              Open Service Catalog
              <ArrowRight size={16} aria-hidden />
            </Link>
            <span className="text-gray-500 dark:text-gray-400"> to add apps and see indexes.</span>
          </p>
        </PageSection>

        <PageSection
          id="dfa-methodology"
          className="scoring-methodology__section scoring-methodology__section--dfa"
          header={{
            eyebrow: 'Digital Footprint Analysis',
            title: dfaMethodology.title,
            lead: dfaMethodology.summary,
            icon: <BarChart3 size={22} strokeWidth={2} />,
            iconTone: 'emerald',
          }}
        >
          <ol className="methodology-steps">
            {dfaMethodology.prerequisites.map((item, index) => (
              <li key={item} className="methodology-steps__item">
                <span className="methodology-steps__num" aria-hidden>
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>

          <h3 className="methodology-subhead">{dfaMethodology.scoresOnPage.title}</h3>
          <div className="shell-grid shell-grid--2">
            {dfaMethodology.scoresOnPage.items.map((item) => (
              <ShellIconCard
                key={item.label}
                icon={<Gauge size={20} strokeWidth={2} />}
                title={item.label}
                className="methodology-score-card"
              >
                <p className="shell-card__body text-sm">{item.description}</p>
              </ShellIconCard>
            ))}
          </div>

          <p className="methodology-xref">
            DFA risk levels use different cutoffs than per-app indexes—see the{' '}
            <a href="#score-bands" className="scoring-methodology__text-link">
              household column in Score bands
            </a>
            .
          </p>

          <div className="methodology-tiers">
            {dfaMethodology.tiers.map((tier) => (
              <article
                key={tier.id}
                className={`methodology-tier methodology-tier--${tier.id}`}
              >
                <div className="methodology-tier__head">
                  <Gauge size={20} aria-hidden />
                  <h3 className="methodology-tier__title">{tier.label}</h3>
                </div>
                <p className="methodology-tier__desc">{tier.description}</p>
                <p className="methodology-tier__formula">{tier.formula}</p>
                <ul className="methodology-tier__drivers">
                  {tier.drivers.map((driver) => (
                    <WeightBar
                      key={driver.label}
                      label={driver.label}
                      weight={driver.weight}
                      description={driver.description}
                    />
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="shell-stack methodology-callouts">
            <ShellRowCard
              icon={<AlertTriangle size={20} />}
              title={dfaMethodology.flags.title}
              description={dfaMethodology.flags.description}
            />
            <article className="shell-card shell-card--panel methodology-snapshot">
              <div className="methodology-snapshot__head">
                <Network size={20} aria-hidden />
                <h3 className="shell-card__title text-base">{dfaMethodology.footprintSnapshot.title}</h3>
              </div>
              <p className="shell-card__body text-sm">{dfaMethodology.footprintSnapshot.description}</p>
              <ul className="methodology-snapshot__bars">
                {dfaMethodology.footprintSnapshot.factors.map((f) => {
                  const portionNum = parseInt(f.portion.replace(/\D/g, ''), 10) || 0;
                  return (
                    <li key={f.label} className="methodology-snapshot__row">
                      <div className="methodology-snapshot__row-head">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{f.label}</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{f.portion}</span>
                      </div>
                      <div className="methodology-snapshot__track" role="presentation" aria-hidden>
                        <div
                          className="methodology-snapshot__fill"
                          style={{ width: `${portionNum}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{f.detail}</p>
                    </li>
                  );
                })}
              </ul>
            </article>
          </div>

          <div className="methodology-includes">
            <h3 className="methodology-subhead">
              <ListChecks size={20} className="inline-block align-text-bottom" aria-hidden /> What DFA includes
            </h3>
            <ul className="methodology-includes__list">
              {dfaMethodology.whatDfaIncludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="scoring-methodology__inline-cta">
            <Link to="/digital-footprint" className="scoring-methodology__text-link">
              Run Digital Footprint Analysis
              <ArrowRight size={16} aria-hidden />
            </Link>
            <span className="text-gray-500 dark:text-gray-400"> after at least three catalog services.</span>
          </p>
        </PageSection>

        <PageSection
          id="limitations"
          className="scoring-methodology__section scoring-methodology__section--limits"
          header={{
            title: 'Important limitations',
            lead: 'What these scores are not designed to do.',
            icon: <Info size={22} strokeWidth={2} />,
            iconTone: 'amber',
          }}
        >
          <ul className="methodology-limits">
            {scoringLimitations.map((item) => (
              <li key={item} className="methodology-limits__item">
                <Info size={18} className="methodology-limits__icon" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="methodology-lineage">{scoringLineageNote}</p>
        </PageSection>

        <section className="scoring-methodology__cta" aria-labelledby="methodology-cta-heading">
          <h2 id="methodology-cta-heading" className="scoring-methodology__cta-title">
            Put scores to work
          </h2>
          <p className="scoring-methodology__cta-lead">
            Build your catalog, review exposure, then continue with assessment and Family Hub missions.
          </p>
          <div className="scoring-methodology__cta-actions">
            <Link to="/service-catalog" className="button button-secondary inline-flex items-center gap-2">
              <ShieldCheck size={16} aria-hidden />
              Service Catalog
            </Link>
            <Link to="/digital-footprint" className="button button-primary inline-flex items-center gap-2">
              <BarChart3 size={16} aria-hidden />
              Digital Footprint Analysis
            </Link>
          </div>
        </section>
      </PageContent>
    </PageLayout>
  );
};

export default ScoringMethodologyPage;
