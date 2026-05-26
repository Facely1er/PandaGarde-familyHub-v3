import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Gauge, Info, ShieldCheck } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PageLead, PageSection } from '../components/layout/PageContent';
import {
  dfaMethodology,
  perServiceMethodology,
  scoringLimitations,
  scoringLineageNote,
  scoringMethodologyIntro,
  SCORING_METHODOLOGY_VERSION,
} from '../data/scoringMethodology';

const ScoringMethodologyPage: React.FC = () => {
  return (
    <PageLayout
      title={scoringMethodologyIntro.title}
      subtitle={scoringMethodologyIntro.lead}
      breadcrumbs
    >
      <PageLead>
        Methodology version {SCORING_METHODOLOGY_VERSION}. Jump to{' '}
        <a href="#dfa-methodology" className="font-semibold text-green-700 hover:underline dark:text-green-400">
          Digital Footprint Analysis
        </a>{' '}
        or{' '}
        <a href="#per-app" className="font-semibold text-green-700 hover:underline dark:text-green-400">
          per-app indexes
        </a>
        .
      </PageLead>

      <PageSection
        id="per-app"
        header={{
          eyebrow: 'Service catalog',
          title: perServiceMethodology.title,
          lead: perServiceMethodology.summary,
        }}
      >
        <div className="shell-stack">
          {perServiceMethodology.factors.map((factor) => (
            <article
              key={factor.label}
              className="shell-card shell-card--panel shell-card--panel-inner rounded-2xl border border-gray-200 p-5 dark:border-gray-700 dark:bg-gray-200"
            >
              <h3 className="shell-card__title text-base font-bold text-gray-900 dark:text-gray-100">
                {factor.label}
              </h3>
              <p className="shell-card__body mt-2 text-sm text-gray-600 dark:text-gray-300">{factor.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-200">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                  Index range
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                  Label
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                  How to read it
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {perServiceMethodology.bands.map((band) => (
                <tr key={band.range} className="bg-white dark:bg-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{band.range}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{band.label}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{band.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/service-catalog" className="font-semibold text-green-700 hover:underline dark:text-green-400">
            Open Service Catalog
          </Link>{' '}
          to add apps and see per-service indexes.
        </p>
      </PageSection>

      <PageSection
        id="dfa-methodology"
        header={{
          eyebrow: 'Digital Footprint Analysis',
          title: dfaMethodology.title,
          lead: dfaMethodology.summary,
        }}
      >
        <div className="shell-card shell-card--panel rounded-2xl border border-gray-200 p-5 dark:border-gray-700 dark:bg-gray-200">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Before you run DFA</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
            {dfaMethodology.prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{dfaMethodology.scoresOnPage.title}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {dfaMethodology.scoresOnPage.items.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-600 dark:bg-gray-200/80"
              >
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.label}</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">DFA risk levels</h3>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                    Risk score
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                    Level
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                    How to read it
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {dfaMethodology.riskLevels.map((band) => (
                  <tr key={band.range} className="bg-white dark:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{band.range}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{band.label}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{band.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {dfaMethodology.tiers.map((tier) => (
            <article
              key={tier.id}
              className="shell-card shell-card--panel rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 dark:border-emerald-800 dark:bg-emerald-950/30"
            >
              <div className="mb-2 inline-flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Gauge size={18} aria-hidden />
                <h3 className="text-lg font-bold">{tier.label}</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{tier.description}</p>
              <p className="mt-3 rounded-lg bg-white/80 px-3 py-2 font-mono text-xs text-emerald-900 dark:bg-gray-100/60 dark:text-emerald-200">
                {tier.formula}
              </p>
              <ul className="mt-4 space-y-3">
                {tier.drivers.map((driver) => (
                  <li key={driver.label} className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {driver.label} ({driver.weight})
                    </span>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{driver.description}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-6 shell-card shell-card--panel rounded-2xl border border-gray-200 p-5 dark:border-gray-700 dark:bg-gray-200">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{dfaMethodology.flags.title}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{dfaMethodology.flags.description}</p>
        </div>

        <div className="mt-6 shell-card shell-card--panel rounded-2xl border border-gray-200 p-5 dark:border-gray-700 dark:bg-gray-200">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            {dfaMethodology.footprintSnapshot.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{dfaMethodology.footprintSnapshot.description}</p>
          <ul className="mt-3 space-y-2">
            {dfaMethodology.footprintSnapshot.factors.map((f) => (
              <li key={f.label} className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{f.label}</strong> ({f.portion}) — {f.detail}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">What DFA includes</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
            {dfaMethodology.whatDfaIncludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/digital-footprint" className="font-semibold text-green-700 hover:underline dark:text-green-400">
            Run Digital Footprint Analysis
          </Link>{' '}
          after you have at least three services in the catalog.
        </p>
      </PageSection>

      <PageSection
        id="limitations"
        header={{ title: 'Important limitations', lead: 'What these scores are not designed to do.' }}
      >
        <ul className="shell-card shell-card--panel space-y-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          {scoringLimitations.map((item) => (
            <li key={item} className="flex gap-2">
              <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{scoringLineageNote}</p>
      </PageSection>

      <PageSection header={{ title: 'Put scores to work' }}>
        <div className="flex flex-wrap gap-3">
          <Link to="/service-catalog" className="button button-secondary inline-flex items-center gap-2">
            <ShieldCheck size={16} aria-hidden />
            Service Catalog
          </Link>
          <Link to="/digital-footprint" className="button button-primary inline-flex items-center gap-2">
            <BarChart3 size={16} aria-hidden />
            Digital Footprint Analysis
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  );
};

export default ScoringMethodologyPage;
