import React from 'react';
import { Link } from 'react-router-dom';

/** Vertical page stack — consistent section gaps inside PageLayout */
export const PageContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`page-content ${className}`.trim()}>{children}</div>;

export type SectionIconTone = 'emerald' | 'sky' | 'violet' | 'amber';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  icon?: React.ReactNode;
  iconTone?: SectionIconTone;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  lead,
  icon,
  iconTone = 'emerald',
  className = '',
}) => (
  <header
    className={`page-section__header ${icon ? 'page-section__header--with-icon' : ''} ${icon ? `page-section__header--tone-${iconTone}` : ''} ${className}`.trim()}
  >
    {eyebrow ? <span className="page-section__eyebrow">{eyebrow}</span> : null}
    {icon ? (
      <div className="page-section__heading-row">
        <div className="page-section__icon" aria-hidden="true">
          {icon}
        </div>
        <h2 className="page-section__title">{title}</h2>
      </div>
    ) : (
      <h2 className="page-section__title">{title}</h2>
    )}
    {lead ? <p className="page-section__lead">{lead}</p> : null}
  </header>
);

export const PageSection: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
  header?: SectionHeaderProps;
}> = ({ id, children, className = '', header }) => (
  <section id={id} className={`page-section ${className}`.trim()}>
    {header ? <SectionHeader {...header} /> : null}
    {children}
  </section>
);

export const PageLead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="page-lead">{children}</p>
);

/** Standard horizontal card: icon | copy | optional action */
export const ShellRowCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  iconLabel?: string;
}> = ({ icon, title, description, action, iconLabel }) => (
  <article className="shell-card shell-row">
    <div className="shell-icon shell-icon--lg" aria-hidden={iconLabel ? undefined : true}>
      {iconLabel ? <span className="shell-icon__step">{iconLabel}</span> : null}
      {icon}
    </div>
    <div className="shell-row__body">
      <h3 className="shell-card__title">{title}</h3>
      <p className="shell-card__body">{description}</p>
    </div>
    {action ? <div className="shell-row__action">{action}</div> : null}
  </article>
);

/** Grid card: icon and title on one row, body content below */
export const ShellIconCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ icon, title, children, className = '' }) => (
  <article className={`shell-card shell-card--stack p-5 ${className}`.trim()}>
    <div className="shell-card__head">
      <div className="shell-icon shell-icon--md" aria-hidden>
        {icon}
      </div>
      <h3 className="shell-card__title text-base">{title}</h3>
    </div>
    {children}
  </article>
);

/** Grid card: optional eyebrow pill, title, then body (e.g. bullet list) */
export const ShellPillarCard: React.FC<{
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ eyebrow, title, children, className = '' }) => (
  <article className={`shell-card shell-card--stack p-5 ${className}`.trim()}>
    {eyebrow ? <span className="shell-pill">{eyebrow}</span> : null}
    <h3 className="shell-card__title text-base">{title}</h3>
    {children}
  </article>
);

/** Grid card: title + body only (FAQ, simple callouts) */
export const ShellTextCard: React.FC<{
  title: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => (
  <article className={`shell-card shell-card--stack p-5 ${className}`.trim()}>
    <h3 className="shell-card__title text-base">{title}</h3>
    {children}
  </article>
);

export const ShellLinkCard: React.FC<{
  to: string;
  title: string;
  description?: string;
  tag?: string;
  cta?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ to, title, description, tag, cta = 'Open', icon, className = '' }) => (
  <Link
    to={to}
    className={`shell-card shell-card--nested shell-link-card ${icon ? 'shell-link-card--with-icon' : ''} ${className}`.trim()}
  >
    <div className="shell-link-card__main">
      {icon ? (
        <div className="shell-link-card__icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <div className="shell-link-card__copy">
        {tag ? <span className="shell-link-card__tag">{tag}</span> : null}
        <h3 className="shell-card__title">{title}</h3>
        {description ? <p className="shell-card__body">{description}</p> : null}
      </div>
    </div>
    <span className="shell-link-card__cta">{cta}</span>
  </Link>
);
