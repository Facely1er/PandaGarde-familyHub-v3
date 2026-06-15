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
                <p className="empty-state-prompt__header-sub">First, tell us which apps your family uses</p>
              </div>
            </div>
            <span className="empty-state-prompt__badge">About 10 min</span>
          </header>

          <div className="empty-state-prompt__body">
            <p className="empty-state-prompt__lead">{description}</p>

            <div className="empty-state-prompt__unlock">
              <h3>
                <CheckCircle size={20} aria-hidden />
                What you will see after
              </h3>
              <div className="empty-state-prompt__unlock-grid">
                <div className="empty-state-prompt__unlock-item">
                  <div className="empty-state-prompt__unlock-icon" aria-hidden>
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <strong>Privacy scores</strong>
                    <span>Which apps collect the most data</span>
                  </div>
                </div>
                <div className="empty-state-prompt__unlock-item">
                  <div className="empty-state-prompt__unlock-icon" aria-hidden>
                    <Shield size={16} />
                  </div>
                  <div>
                    <strong>Talk prompts</strong>
                    <span>What to discuss as a family</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="empty-state-prompt__steps-title">Three quick steps</h3>
            <ol className="empty-state-prompt__steps">
              <li className="empty-state-prompt__step">
                <span className="empty-state-prompt__step-index" aria-hidden>
                  1
                </span>
                <div>
                  <strong>Open the app list</strong>
                  <p>Tap the apps and websites your family uses.</p>
                </div>
              </li>
              <li className="empty-state-prompt__step">
                <span className="empty-state-prompt__step-index" aria-hidden>
                  2
                </span>
                <div>
                  <strong>Add at least {minimumServices} apps</strong>
                  <p>School tools, games, social apps, health apps—whatever your kids use.</p>
                </div>
              </li>
              <li className="empty-state-prompt__step">
                <span className="empty-state-prompt__step-index" aria-hidden>
                  3
                </span>
                <div>
                  <strong>Come back here</strong>
                  <p>Your {feature.toLowerCase()} will be ready with scores and next steps.</p>
                </div>
              </li>
            </ol>

            <div className="empty-state-prompt__cta-wrap">
              <Link
                to="/service-catalog"
                className="button button-primary inline-flex items-center gap-2"
              >
                <ShoppingBag size={20} aria-hidden />
                <span>List your apps</span>
                <ArrowRight size={18} aria-hidden />
              </Link>
              <div className="empty-state-prompt__meta">
                <span>About 10 minutes</span>
                <span className="empty-state-prompt__meta-dot" aria-hidden />
                <span>No account needed</span>
              </div>
            </div>
          </div>
        </div>

        <p className="empty-state-prompt__footer">
          Prefer to start with a story?{' '}
          <Link to="/stories">Read Privacy Panda together (5 min)</Link>
        </p>
      </div>
    </div>
  );
};

export default EmptyStateWithServicePrompt;
