import React, { useState, useEffect } from 'react';
import { Send, User, Mail, MessageSquare, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { newsletterService } from '../../lib/database';
import { submitContactNetlifyForm } from '../../lib/netlifyForms';
import { useToast } from '../../hooks/useToast';
import { logger } from '../../lib/logger';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
  ageGroup: string;
  newsletter: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  inquiryType?: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: '',
    ageGroup: '',
    newsletter: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [botField, setBotField] = useState('');
  const { showSuccess, showError } = useToast();

  // Load saved form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        logger.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage on change
  useEffect(() => {
    localStorage.setItem('contactFormData', JSON.stringify(formData));
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitContactNetlifyForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
        inquiryType: formData.inquiryType,
        ageGroup: formData.ageGroup || undefined,
        newsletter: formData.newsletter,
        botField,
      });

      if (formData.newsletter) {
        try {
          await newsletterService.subscribe(formData.email);
        } catch (newsletterError) {
          logger.warn('Newsletter subscription failed:', newsletterError);
        }
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: '',
        ageGroup: '',
        newsletter: false,
      });
      setBotField('');
      localStorage.removeItem('contactFormData');

      showSuccess('Message Sent!', 'Thank you for contacting us. We\'ll get back to you within 24 hours.');
      setIsSubmitted(true);
    } catch (error) {
      logger.error('Contact form submission error:', error);
      setSubmitError('Failed to send message. Please try again.');
      showError('Submission Failed', 'There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: '',
      ageGroup: '',
      newsletter: false
    });
    setErrors({});
    setIsSubmitted(false);
    setSubmitError('');
    localStorage.removeItem('contactFormData');
  };

  if (isSubmitted) {
    return (
      <div className="contact-form-success">
        <div className="success-content">
          <CheckCircle size={64} className="success-icon" />
          <h2>Message Sent Successfully!</h2>
          <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
          <div className="success-actions">
            <button onClick={resetForm} className="btn-primary">
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form">
      <form
        name="contact"
        onSubmit={handleSubmit}
        className="form"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden" aria-hidden="true">
          <label htmlFor="contact-bot-field">
            Don&apos;t fill this out if you&apos;re human:
            <input
              id="contact-bot-field"
              name="bot-field"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={botField}
              onChange={(e) => setBotField(e.target.value)}
            />
          </label>
        </p>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <User size={16} />
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <div id="name-error" className="error-message" role="alert" aria-live="polite">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail size={16} />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <div id="email-error" className="error-message" role="alert" aria-live="polite">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.email}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              <Phone size={16} />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number (optional)"
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <div id="phone-error" className="error-message" role="alert" aria-live="polite">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.phone}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="inquiryType" className="form-label">
              <MessageSquare size={16} />
              Inquiry Type *
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleInputChange}
              className={`form-select ${errors.inquiryType ? 'error' : ''}`}
              aria-describedby={errors.inquiryType ? 'inquiryType-error' : undefined}
            >
              <option value="">Select inquiry type</option>
              <option value="general">General Question</option>
              <option value="technical">Technical Support</option>
              <option value="partnership">Partnership Inquiry</option>
              <option value="media">Media Inquiry</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
            {errors.inquiryType && (
              <div id="inquiryType-error" className="error-message" role="alert" aria-live="polite">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.inquiryType}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            <MessageSquare size={16} />
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`form-input ${errors.subject ? 'error' : ''}`}
            placeholder="Brief description of your inquiry"
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          {errors.subject && (
            <div id="subject-error" className="error-message" role="alert" aria-live="polite">
              <AlertCircle size={14} aria-hidden="true" />
              {errors.subject}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ageGroup" className="form-label">
            <User size={16} />
            Age Group (Optional)
          </label>
          <select
            id="ageGroup"
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select age group</option>
            <option value="5-8">Ages 5-8</option>
            <option value="9-12">Ages 9-12</option>
            <option value="13-17">Ages 13-17</option>
            <option value="18+">Adult</option>
            <option value="educator">Educator</option>
            <option value="parent">Parent</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            <MessageSquare size={16} />
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={`form-textarea ${errors.message ? 'error' : ''}`}
            placeholder="Please provide details about your inquiry..."
            rows={6}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <div id="message-error" className="error-message" role="alert" aria-live="polite">
              <AlertCircle size={14} aria-hidden="true" />
              {errors.message}
            </div>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleInputChange}
              className="checkbox-input"
            />
            <span className="checkbox-text">
              Subscribe to our newsletter for privacy education tips and updates
            </span>
          </label>
        </div>

        {submitError && (
          <div className="submit-error" role="alert" aria-live="assertive">
            <AlertCircle size={16} aria-hidden="true" />
            {submitError}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary submit-btn"
            aria-busy={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" aria-hidden="true" />
                <span>Sending...</span>
                <span className="sr-only">Please wait while your message is being sent</span>
              </>
            ) : (
              <>
                <Send size={16} aria-hidden="true" />
                Send Message
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .contact-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .form {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #2C3E50;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          background: white;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .form-input.error,
        .form-select.error,
        .form-textarea.error {
          border-color: #e74c3c;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .checkbox-group {
          margin-bottom: 32px;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          font-size: 14px;
          line-height: 1.5;
        }

        .checkbox-input {
          margin: 0;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .checkbox-text {
          color: #666;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #e74c3c;
          font-size: 14px;
          margin-top: 6px;
        }

        .submit-error {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e74c3c;
          background: #fdf2f2;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .form-actions {
          text-align: center;
        }

        .submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #4CAF50;
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 160px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #45a049;
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .contact-form-success {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
          text-align: center;
        }

        .success-content {
          background: white;
          padding: 60px 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .success-icon {
          color: #4CAF50;
          margin-bottom: 24px;
        }

        .success-content h2 {
          font-size: 2rem;
          color: #2C3E50;
          margin-bottom: 16px;
        }

        .success-content p {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 32px;
        }

        .success-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #45a049;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .form {
            padding: 24px;
          }

          .success-content {
            padding: 40px 24px;
          }

          .success-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactForm;