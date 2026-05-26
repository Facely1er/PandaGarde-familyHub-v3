import React from 'react';

import { Link } from 'react-router-dom';

import { ShieldCheck, Target, Scale, BookOpen, ArrowRight } from 'lucide-react';

import PageLayout from '../components/layout/PageLayout';

import { PageSection } from '../components/layout/PageContent';

import { dfaWorkflowNavItems } from '../data/siteNavigation';



const groups = [

  {

    title: 'Digital Footprint Analysis',

    description: 'List services and review exposure—the core PandaGarde review (two steps).',

    icon: ShieldCheck,

    links: dfaWorkflowNavItems.map((item) => ({
      label: item.label,
      href: item.href,
    })),

  },

  {

    title: 'Plans & follow-through',

    description: 'Local goals and household plans—saved on this device.',

    icon: Target,

    links: [

      { label: 'Family privacy plan', href: '/family-privacy-plan', note: 'Household plan saved on this device.' },

      { label: 'Family privacy plan', href: '/family-privacy-plan', note: 'Guided household plan.' },

    ],

  },

  {

    title: 'Rights & reference',

    description: 'Privacy law education and how PandaGarde scores exposure.',

    icon: Scale,

    links: [
      { label: 'Digital privacy rights', href: '/digital-rights' },
      { label: 'Scoring methodology', href: '/scoring-methodology', note: 'How exposure scores are calculated.' },
    ],

  },

  {

    title: 'Stories & activities',

    description: 'Kids’ materials on the website.',

    icon: BookOpen,

    links: [

      { label: 'Privacy Panda story', href: '/stories/privacy-panda-and-the-digital-bamboo-forest' },

      { label: 'Activity book', href: '/activity-book' },

      { label: 'Guides & stories', href: '/for-families', note: 'Guides, stories, and printables.' },

    ],

  },

];



const PrivacyToolsPage: React.FC = () => {

  return (

    <PageLayout

      title="Privacy tools"

      subtitle="A link index for the DFA path and related pages. It does not change app settings on its own."

      breadcrumbs={true}

    >

      <PageSection className="pb-8">

        <div className="mx-auto grid max-w-[1100px] gap-6 lg:gap-8">

          {groups.map((group) => {

            const Icon = group.icon;

            return (

              <div key={group.title} className="theme-card rounded-3xl p-6">

                <div className="mb-4 flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">

                    <Icon size={24} aria-hidden />

                  </div>

                  <div>

                    <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">

                      {group.title}

                    </h2>

                    <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">{group.description}</p>

                  </div>

                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {group.links.map((link) => (

                    <Link

                      key={link.href}

                      to={link.href}

                      className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-inherit no-underline transition-all hover:border-green-600 dark:border-emerald-500/25 dark:bg-emerald-950/30 dark:hover:border-green-400"

                    >

                      <div className="mb-1 font-bold text-gray-900 dark:text-gray-100">{link.label}</div>

                      {'note' in link && link.note ? (

                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{link.note}</p>

                      ) : null}

                      <span className="inline-flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">

                        Open <ArrowRight size={16} aria-hidden />

                      </span>

                    </Link>

                  ))}

                </div>

              </div>

            );

          })}

        </div>

      </PageSection>

    </PageLayout>

  );

};



export default PrivacyToolsPage;


