import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  Fingerprint,
  LayoutDashboard,
  Library,
  Sparkles,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PageSection, ShellLinkCard, type SectionIconTone } from '../components/layout/PageContent';
import { GUIDES_STORIES_PAGE_LEAD } from '../data/pandaGardeMessaging';
import { FOOTPRINT_REVIEW_NAV_LABEL, GUIDES_STORIES_NAV_LABEL } from '../data/siteNavigation';
import {
  resourceGuideLinks,
  resourcePrintableLinks,
  resourceStoryLinks,
  type ResourceHubLink,
} from '../data/resourcesHubLinks';



const HUB_JUMP_LINKS = [

  { href: '#hub-stories', label: 'Stories' },

  { href: '#hub-guides', label: 'Guides' },

  { href: '#hub-printables', label: 'Printables' },

  { href: '#hub-footprint', label: 'Footprint' },

  { href: '#hub-missions', label: 'Family Hub' },

] as const;



const LINK_ICONS: Record<string, LucideIcon> = {

  '/stories/privacy-panda-and-the-digital-bamboo-forest': Sparkles,

  '/stories': Library,

  '/guides/family-privacy': BookOpen,

  '/family-privacy-plan': FileText,

  '/guides/emergency-safety': AlertTriangle,

  '/downloads/coloring-sheets': Download,

};



function linkIcon(href: string, fallback: LucideIcon): LucideIcon {

  return LINK_ICONS[href] ?? fallback;

}



function HubLinkGrid({
  links,
  fallbackIcon,
  columns,
  gridClassName = '',
  getCta,
  getTag,
  getCardClass,
}: {
  links: ResourceHubLink[];
  fallbackIcon: LucideIcon;
  columns: 2 | 3;
  gridClassName?: string;
  getCta?: (link: ResourceHubLink) => React.ReactNode;
  getTag?: (link: ResourceHubLink) => string | undefined;
  getCardClass?: (link: ResourceHubLink) => string | undefined;
}) {
  const gridClass =
    columns === 3 ? 'shell-grid shell-grid--3' : 'shell-grid shell-grid--2';

  return (
    <div className={`${gridClass} ${gridClassName}`.trim()}>
      {links.map((link) => {
        const Icon = linkIcon(link.href, fallbackIcon);

        return (
          <ShellLinkCard
            key={link.href}
            to={link.href}
            title={link.label}
            description={link.description}
            tag={getTag?.(link)}
            icon={<Icon size={20} strokeWidth={2} />}
            className={getCardClass?.(link)}
            cta={

              getCta?.(link) ?? (

                <>

                  Open

                  <ChevronRight size={16} aria-hidden />

                </>

              )

            }

          />

        );

      })}

    </div>

  );

}



const ForFamiliesPage: React.FC = () => {

  const sectionTone = {
    stories: 'emerald' as SectionIconTone,
    guides: 'sky' as SectionIconTone,
  };



  return (

    <PageLayout title={GUIDES_STORIES_NAV_LABEL} subtitle={GUIDES_STORIES_PAGE_LEAD} breadcrumbs={true}>

      <div className="guides-stories-hub">

        <nav className="guides-stories-hub__jump" aria-label="On this page">

          <ul className="guides-stories-hub__jump-list">

            {HUB_JUMP_LINKS.map((item) => (

              <li key={item.href}>

                <a href={item.href} className="guides-stories-hub__jump-link">

                  {item.label}

                </a>

              </li>

            ))}

          </ul>

        </nav>



        <PageSection

          id="hub-stories"

          className="guides-stories-hub__section guides-stories-hub__section--stories"

          header={{

            eyebrow: 'Open anytime',

            title: 'Stories',

            lead: 'Read Privacy Panda adventures together—at home or school, one chapter at a time.',

            icon: <Library size={26} strokeWidth={2} />,

            iconTone: sectionTone.stories,

          }}

        >

          <HubLinkGrid
            links={resourceStoryLinks}
            fallbackIcon={BookOpen}
            columns={2}
            gridClassName="guides-stories-hub__story-grid"
            getTag={(link) =>
              link.href.includes('digital-bamboo-forest') ? 'Start here' : undefined
            }
            getCardClass={(link) =>
              link.href.includes('digital-bamboo-forest') ? 'shell-link-card--highlight' : undefined
            }
            getCta={(link) =>

              link.href === '/stories' ? (

                <>

                  Browse

                  <ChevronRight size={16} aria-hidden />

                </>

              ) : (

                <>

                  Read story

                  <ChevronRight size={16} aria-hidden />

                </>

              )

            }

          />

        </PageSection>



        <PageSection

          id="hub-guides"

          className="guides-stories-hub__section guides-stories-hub__section--guides"

          header={{

            eyebrow: 'Open anytime',

            title: 'Guides for parents',

            lead: 'Conversation starters, a household privacy plan, and steps when something goes wrong online.',

            icon: <BookOpen size={26} strokeWidth={2} />,

            iconTone: sectionTone.guides,

          }}

        >

          <HubLinkGrid links={resourceGuideLinks} fallbackIcon={BookOpen} columns={3} />

        </PageSection>



        <PageSection
          id="hub-printables"
          className="guides-stories-hub__section guides-stories-hub__section--printables guides-stories-hub__section--compact"
        >
          {resourcePrintableLinks.map((link) => (
            <ShellLinkCard
              key={link.href}
              to={link.href}
              tag="Printables"
              title={link.label}
              description={link.description}
              icon={<Download size={20} strokeWidth={2} />}
              className="shell-link-card--compact-row"
              cta={
                <>
                  Open
                  <ChevronRight size={16} aria-hidden />
                </>
              }
            />
          ))}
        </PageSection>



        <PageSection
          id="hub-footprint"
          className="guides-stories-hub__section guides-stories-hub__section--footprint"
        >
          <article className="shell-card guides-stories-hub__cta guides-stories-hub__cta--footprint shell-cta-panel">
            <div className="guides-stories-hub__cta-icon shell-icon shell-icon--lg" aria-hidden="true">
              <Fingerprint size={24} />
            </div>
            <div className="shell-cta-panel__copy">
              <p className="shell-pill mb-2 self-start">When you want a snapshot</p>
              <h2 className="shell-card__title m-0 text-lg">{FOOTPRINT_REVIEW_NAV_LABEL}</h2>
              <p className="shell-card__body mt-2 mb-0">
                List the apps your family uses, then see exposure scores and what to do next—all on the
                Footprint Review page.
              </p>
            </div>
            <div className="shell-cta-panel__actions guides-stories-hub__cta-actions">
              <Link
                to="/digital-footprint"
                className="button button-primary inline-flex shrink-0 items-center gap-2"
              >
                {FOOTPRINT_REVIEW_NAV_LABEL}
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </article>
        </PageSection>



        <PageSection id="hub-missions" className="guides-stories-hub__section guides-stories-hub__section--hub pb-8">

          <article className="shell-card guides-stories-hub__cta shell-cta-panel">

            <div className="guides-stories-hub__cta-icon shell-icon shell-icon--lg" aria-hidden="true">

              <LayoutDashboard size={24} />

            </div>

            <div className="shell-cta-panel__copy">

              <h2 className="shell-card__title m-0 text-lg">Family Hub</h2>

              <p className="shell-card__body mt-2 mb-0">

                The only place for age-matched privacy missions and saved progress on this device.

              </p>

            </div>

            <div className="shell-cta-panel__actions">

              <Link to="/family-hub" className="button button-primary inline-flex shrink-0 items-center gap-2">

                Open Family Hub

                <ArrowRight size={16} aria-hidden />

              </Link>

            </div>

          </article>

        </PageSection>

      </div>

    </PageLayout>

  );

};



export default ForFamiliesPage;


