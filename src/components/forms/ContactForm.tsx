import React, { useState, useEffect } from 'react';
import { Send, User, Mail, MessageSquare, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { newsletterService } from '../../lib/database';
import { submitContactNetlifyForm } from '../../lib/netlifyForms';
import { useToast } from '../../hooks/useToast';
import { logger } from '../../lib/logger';
import { Button } from '../ui/Button';

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

const fieldClass = (hasError: boolean) =>
  `w-full rounded-lg border px-4 py-3 text-base transition-colors bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 ${
    hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-200 dark:border-gray-600 focus:border-green-600 focus:ring-green-600/20 dark:focus:border-green-500'
  } focus:outline-none focus:ring-2`;

const labelClass =
  'mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: '',
    ageGroup: '',
    newsletter: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [botField, setBotField] = useState('');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as FormData;
        setFormData(parsedData);
      } catch (error) {
        logger.error('Error loading saved form data:', error);
      }
    }
  }, []);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
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

      showSuccess('Message Sent!', "Thank you for contacting us. We'll get back to you within 24 hours.");
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
      newsletter: false,
    });
    setErrors({});
    setIsSubmitted(false);
    setSubmitError('');
    localStorage.removeItem('contactFormData');
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-12">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-600 dark:text-green-400" aria-hidden />
        <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">Message sent successfully</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Thank you for contacting us. We&apos;ll get back to you within 24 hours.
        </p>
        <Button type="button" variant="primary" onClick={resetForm}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form
        name="contact"
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-10"
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

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              <User size={16} aria-hidden />
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={fieldClass(!!errors.name)}
              placeholder="Enter your full name"
              aria-describedby={errors.name ? 'name-error' : undefined}
              autoComplete="name"
            />
            {errors.name && (
              <p id="name-error" className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
                <AlertCircle size={14} aria-hidden />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              <Mail size={16} aria-hidden />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={fieldClass(!!errors.email)}
              placeholder="Enter your email address"
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <p id="email-error" className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
                <AlertCircle size={14} aria-hidden />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClass}>
              <Phone size={16} aria-hidden />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={fieldClass(!!errors.phone)}
              placeholder="Optional"
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              autoComplete="tel"
            />
            {errors.phone && (
              <p id="phone-error" className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
                <AlertCircle size={14} aria-hidden />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="inquiryType" className={labelClass}>
              <MessageSquare size={16} aria-hidden />
              Inquiry Type *
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleInputChange}
              className={fieldClass(!!errors.inquiryType)}
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
              <p id="inquiryType-error" className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
                <AlertCircle size={14} aria-hidden />
                {errors.inquiryType}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="subject" className={labelClass}>
            <MessageSquare size={16} aria-hidden />
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={fieldClass(!!errors.subject)}
            placeholder="Brief description of your inquiry"
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
              <AlertCircle size={14} aria-hidden />
              {errors.subject}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="ageGroup" className={labelClass}>
            <User size={16} aria-hidden />
            Age Group (optional)
          </label>
          <select
            id="ageGroup"
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleInputChange}
            className={fieldClass(false)}
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

        <div className="mb-6">
          <label htmlFor="message" className={labelClass}>
            <MessageSquare size={16} aria-hidden />
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={`${fieldClass(!!errors.message)} min-h-[140px] resize-y`}
            placeholder="Please provide details about your inquiry..."
            rows={6}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
              <AlertCircle size={14} aria-hidden />
              {errors.message}
            </p>
          )}
        </div>

        <div className="mb-8">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-green-700 focus:ring-green-600 dark:border-gray-600 dark:bg-gray-800"
            />
            <span>Subscribe to our newsletter for privacy education tips and updates</span>
          </label>
        </div>

        {submitError && (
          <div
            className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
            role="alert"
          >
            <AlertCircle size={16} aria-hidden />
            {submitError}
          </div>
        )}

        <div className="text-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Sending message"
            leftIcon={!isSubmitting ? <Send size={18} aria-hidden /> : undefined}
            disabled={isSubmitting}
          >
            Send Message
          </Button>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Submissions are delivered securely via Netlify Forms.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
