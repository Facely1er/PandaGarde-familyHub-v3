import React from 'react';

import { Link } from 'react-router-dom';

import { ShieldCheck, Target, Scale, BookOpen, ArrowRight } from 'lucide-react';

import PageLayout from '../components/layout/PageLayout';

import { PageSection } from '../components/layout/PageContent';

import { dfaWorkflowNavItems, FOOTPRINT_REVIEW_NAV_LABEL } from '../data/siteNavigation';



const groups = [

  {

    title: FOOTPRINT_REVIEW_NAV_LABEL,

    description: 'Step 1: tap the apps your family uses. Step 2: see which ones collect the most data.',

    icon: ShieldCheck,

    links: dfaWorkflowNavItems.map((item) => ({
      label: item.label,
      href: item.href,
    })),

  },

  {

    title: 'Plans & follow-through',

    description: 'Write down your family rules and goals—saved on this device.',

    icon: Target,

    links: [

      { label: 'Family privacy plan', href: '/family-privacy-plan', note: 'Build a simple household plan together.' },

    ],

  },

  {

    title: 'Rights & reference',

    description: 'Optional deep dives for when you want more detail—not required to get started.',

    icon: Scale,

    links: [
      { label: 'Digital privacy rights', href: '/digital-rights', note: 'Especially helpful for Maryland families.' },
      { label: 'How scores are calculated', href: '/scoring-methodology', note: 'Skip this unless you are curious.' },
    ],

  },

  {

    title: 'Stories & activities',

    description: 'Read with your kids or print something to do offline.',

    icon: BookOpen,

    links: [

      { label: 'Privacy Panda story', href: '/stories/privacy-panda-and-the-digital-bamboo-forest', note: 'Best first step—about 5 minutes.' },

      { label: 'Activity book', href: '/activity-book', note: 'Printables and coloring sheets.' },

      { label: 'Guides & stories', href: '/for-families', note: 'All parent guides in one place.' },

    ],

  },

];



const PrivacyToolsPage: React.FC = () => {

  return (

    <PageLayout

      title="Privacy tools"

      subtitle="Tools to review your family's apps, make a plan, and read with your kids. Pick a section below—each link opens a page with its own next step."

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


