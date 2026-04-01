import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Users, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useAgeVerification } from '../contexts/AgeVerificationContext';

const AgeVerificationModal: React.FC = () => {
  const { verifyAge, showAgeModal, setShowAgeModal } = useAgeVerification();
  const [age, setAge] = useState<number | ''>('');
  const [parentEmail, setParentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap effect
  useEffect(() => {
    if (!showAgeModal || !modalRef.current) {return;}

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element on open
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {return;}

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => modal.removeEventListener('keydown', handleTabKey);
  }, [showAgeModal]);

  // Handle escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowAgeModal(false);
    }
  }, [setShowAgeModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (age === '') {
      setError('Please enter your age');
      setLoading(false);
      return;
    }

    if (age < 0 || age > 120) {
      setError('Please enter a valid age');
      setLoading(false);
      return;
    }

    if (age < 13 && !parentEmail) {
      setError('Parent email is required for users under 13');
      setLoading(false);
      return;
    }

    if (age < 13 && parentEmail && !isValidEmail(parentEmail)) {
      setError('Please enter a valid parent email address');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyAge(age, age < 13 ? parentEmail : undefined);
      if (!result.success) {
        setError(result.error || 'Failed to verify age. Please try again.');
        setLoading(false);
      }
      // If successful, modal will close automatically
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAge(value === '' ? '' : parseInt(value, 10));
    setError('');
  };

  if (!showAgeModal) {return null;}

  return (
    <div
      className="age-verification-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-verification-title"
      aria-describedby="age-verification-description"
      onKeyDown={handleKeyDown}
    >
      <div ref={modalRef} className="age-verification-modal">
        <div className="age-verification-header">
          <div className="age-verification-icon" aria-hidden="true">
            <Shield size={32} />
          </div>
          <h2 id="age-verification-title">Age Verification Required</h2>
          <p id="age-verification-description">We need to verify your age to provide age-appropriate content.</p>
        </div>

        <form onSubmit={handleSubmit} className="age-verification-form">
          <div className="form-group">
            <label htmlFor="age">What is your age?</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={handleAgeChange}
              min="0"
              max="120"
              placeholder="Enter your age"
              className={error ? 'error' : ''}
              required
            />
          </div>

          {age !== '' && age < 13 && (
            <div className="parental-consent-section">
              <div className="coppa-notice" style={{ 
                padding: '1rem', 
                backgroundColor: '#fef3c7', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                border: '1px solid #f59e0b'
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <AlertTriangle size={20} className="warning-icon" style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#92400e' }}>
                      Parental Consent Required
                    </strong>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#78350f' }}>
                      You are under 13 years old. We need your parent's or guardian's permission to collect any information.
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#78350f' }}>
                      We will send a consent request email to your parent. They must approve before you can use this site.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="parent-email">
                  Parent/Guardian Email Address *
                </label>
                <input
                  type="email"
                  id="parent-email"
                  value={parentEmail}
                  onChange={(e) => {
                    setParentEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="parent@example.com"
                  className={error && !parentEmail ? 'error' : ''}
                  required
                  disabled={loading}
                />
                <small style={{ display: 'block', marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  We'll send a consent request to this email. Your parent must click the link in the email to approve.
                </small>
              </div>
              
              <div className="consent-checkbox" style={{ marginTop: '1rem' }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    disabled
                  />
                  <span className="checkmark"></span>
                  <div className="checkbox-text">
                    <strong>I understand</strong>
                    <span>My parent will receive an email and must approve before I can use this site.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {age !== '' && age >= 13 && (
            <div className="age-confirmation">
              <CheckCircle size={20} className="success-icon" />
              <p>You are 13 or older. You can proceed without parental consent.</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <div className="age-verification-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => setShowAgeModal(false)}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="submit"
              className="button primary"
              disabled={age === '' || (age < 13 && !parentEmail) || loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Continue
                </>
              )}
            </button>
          </div>
        </form>

        <div className="age-verification-footer">
          <div className="privacy-info">
            <Users size={16} />
            <p>
              <strong>Privacy Notice:</strong> For users under 13, we require verifiable parental consent before collecting any personal information. 
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '0.5rem', color: '#3b82f6' }}>
                Read our Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;