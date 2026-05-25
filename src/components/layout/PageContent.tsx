import React from 'react';
import { Link } from 'react-router-dom';

/** Vertical page stack — consistent section gaps inside PageLayout */
export const PageContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`page-content ${className}`.trim()}>{children}</div>;

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, lead, className = '' }) => (
  <header className={`page-section__header ${className}`.trim()}>
    {eyebrow ? <span className="page-section__eyebrow">{eyebrow}</span> : null}
    <h2 className="page-section__title">{title}</h2>
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

export const ShellLinkCard: React.FC<{
  to: string;
  title: string;
  description?: string;
  tag?: string;
  cta?: React.ReactNode;
}> = ({ to, title, description, tag, cta = 'Open' }) => (
  <Link to={to} className="shell-card shell-card--nested shell-link-card">
    {tag ? <span className="shell-link-card__tag">{tag}</span> : null}
    <h3 className="shell-card__title">{title}</h3>
    {description ? <p className="shell-card__body">{description}</p> : null}
    <span className="shell-link-card__cta">{cta}</span>
  </Link>
);
