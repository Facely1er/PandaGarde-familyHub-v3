import React from 'react';
import { MessageCircle, HelpCircle, Library } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import PageLayout from '../components/layout/PageLayout';

const faqItems = [
  {
    question: 'Is PandaGarde free to use?',
    answer:
      'Yes. PandaGarde is free for families and educators. Privacy education should be accessible to everyone.',
  },
  {
    question: 'What age groups is this for?',
    answer: 'Our resources are for kids ages 5–17, with different activities for each age group.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Browse our resources, try the activities, and start with the service catalog—no account needed to explore.',
  },
  {
    question: 'Can educators use this in schools?',
    answer:
      'Yes. See Educator Tools and Classroom Activities for guides you can use in the classroom.',
  },
] as const;

const ContactPage: React.FC = () => {
  return (
    <PageLayout
      title="Contact Us"
      subtitle="Questions about PandaGarde or need help? Send a message below—we typically respond within 24 hours."
    >
      <section id="contact-form" className="mb-12" aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" className="sr-only">
          Contact form
        </h2>
        <ContactForm />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-gray-50 py-12 dark:border-gray-700 dark:bg-gray-100/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Quick answers to common questions about PandaGarde and privacy education.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                    <HelpCircle size={20} className="text-green-700 dark:text-green-400" aria-hidden />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{item.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            More answers on the{' '}
            <Link to="/faq" className="font-medium text-green-700 hover:underline dark:text-green-400">
              FAQ page
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-700 to-green-600 py-12 text-white sm:py-16">
        <div className="container mx-auto px-4 text-center sm:px-6">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Start learning about online privacy with your family today—it&apos;s free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/activity-book"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-gray-100"
            >
              <MessageCircle size={20} aria-hidden />
              Try Activities
            </Link>
            <Link
              to="/stories"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-green-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-950"
            >
              <Library size={20} aria-hidden />
              Read Stories
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactPage;
