import React from 'react';
import { ChevronRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PageLead, PageSection, ShellLinkCard } from '../components/layout/PageContent';
import { footerLegalLinks, LEGAL_HUB_LABEL } from '../data/siteNavigation';

const LEGAL_LINK_DESCRIPTIONS: Record<string, string> = {
  '/privacy': 'How we handle data on the website and in Family Hub.',
  '/terms': 'Rules for using PandaGarde educational content and tools.',
  '/cookies': 'Cookies and local storage used by the site and app.',
  '/accessibility': 'Our commitment to accessible design and how to get help.',
};

const LegalPage: React.FC = () => {
  const documentLinks = footerLegalLinks.filter((link) => link.href !== '/legal');

  return (
    <PageLayout
      title={LEGAL_HUB_LABEL}
      subtitle="Policies and compliance information for PandaGarde and Family Hub."
      breadcrumbs
    >
      <PageLead>
        These documents describe how the product works today—local-first education, not child monitoring.
        Contact privacy@pandagarde.com with questions.
      </PageLead>

      <PageSection header={{ title: 'Policies & compliance', lead: 'Open any document below.' }}>
        <div className="shell-grid shell-grid--2">
          {documentLinks.map((link) => {
            const Icon = link.icon;
            return (
              <ShellLinkCard
                key={link.href}
                to={link.href}
                title={link.label}
                description={LEGAL_LINK_DESCRIPTIONS[link.href] ?? 'Read the full policy.'}
                icon={<Icon size={20} strokeWidth={2} />}
                cta={
                  <>
                    Read
                    <ChevronRight size={16} aria-hidden />
                  </>
                }
              />
            );
          })}
        </div>
      </PageSection>
    </PageLayout>
  );
};

export default LegalPage;
