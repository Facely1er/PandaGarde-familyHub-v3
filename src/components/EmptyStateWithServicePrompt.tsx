import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle, Shield, BarChart3 } from 'lucide-react';

interface EmptyStateWithServicePromptProps {
  feature: string;
  description: string;
  minimumServices?: number;
  icon?: React.ReactNode;
}

const EmptyStateWithServicePrompt: React.FC<EmptyStateWithServicePromptProps> = ({
  feature,
  description,
  minimumServices = 3,
  icon,
}) => {
  return (
    <div className="empty-state-prompt">
      <div className="empty-state-prompt__shell">
        <div className="empty-state-prompt__card">
          <header className="empty-state-prompt__header">
            <div className="empty-state-prompt__header-main">
              <div className="empty-state-prompt__header-icon" aria-hidden>
                {icon || <Sparkles size={28} />}
              </div>
              <div>
                <h1>{feature}</h1>
                <p className="empty-state-prompt__header-sub">Footprint review needs apps in your catalog first</p>
              </div>
            </div>
            <span className="empty-state-prompt__badge">Catalog needed</span>
          </header>

          <div className="empty-state-prompt__body">
            <p className="empty-state-prompt__lead">{description}</p>

            <div className="empty-state-prompt__unlock">
              <h3>
                <CheckCircle size={20} aria-hidden />
                What you will unlock
              </h3>
              <div className="empty-state-prompt__unlock-grid">
                <div className="empty-state-prompt__unlock-item">
                  <div className="empty-state-prompt__unlock-icon" aria-hidden>
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <strong>Privacy analysis</strong>
                    <span>See your exposure score</span>
                  </div>
                </div>
                <div className="empty-state-prompt__unlock-item">
                  <div className="empty-state-prompt__unlock-icon" aria-hidden>
                    <Shield size={16} />
                  </div>
                  <div>
                    <strong>Risk assessment</strong>
                    <span>Identify higher-exposure services</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="empty-state-prompt__steps-title">Get started in 3 easy steps</h3>
            <ol className="empty-state-prompt__steps">
              <li className="empty-state-prompt__step">
                <span className="empty-state-prompt__step-index" aria-hidden>
                  1
                </span>
                <div>
                  <strong>Browse the service catalog</strong>
                  <p>Explore popular apps and services your family might use.</p>
                </div>
              </li>
              <li className="empty-state-prompt__step">
                <span className="empty-state-prompt__step-index" aria-hidden>
                  2
                </span>
                <div>
                  <strong>Add your family&apos;s services</strong>
                  <p>
                    Choose at least {minimumServices} services you use and add them to your catalog.
                  </p>
                </div>
              </li>
              <li className="empty-state-prompt__step">
                <span className="empty-state-prompt__step-index" aria-hidden>
                  3
                </span>
                <div>
                  <strong>Return to see your analysis</strong>
                  <p>Come back here to view your {feature.toLowerCase()} and recommendations.</p>
                </div>
              </li>
            </ol>

            <div className="empty-state-prompt__cta-wrap">
              <Link
                to="/service-catalog"
                className="button button-primary inline-flex items-center gap-2"
              >
                <ShoppingBag size={20} aria-hidden />
                <span>Open service catalog</span>
                <ArrowRight size={18} aria-hidden />
              </Link>
              <div className="empty-state-prompt__meta">
                <span>2–5 minutes</span>
                <span className="empty-state-prompt__meta-dot" aria-hidden />
                <span>Instant unlock</span>
                <span className="empty-state-prompt__meta-dot" aria-hidden />
                <span>Free to use</span>
              </div>
            </div>
          </div>
        </div>

        <p className="empty-state-prompt__footer">
          Questions about privacy protection?{' '}
          <Link to="/guides/family-privacy">Read the family privacy guide</Link>
        </p>
      </div>
    </div>
  );
};

export default EmptyStateWithServicePrompt;
