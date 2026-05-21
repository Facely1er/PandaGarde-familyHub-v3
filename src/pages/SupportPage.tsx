import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, HelpCircle, Search, Clock, Users, BookOpen, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'account';
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  responseTime: string;
  availability: string;
  href?: string;
  external?: boolean;
  scrollToFaq?: boolean;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'How do I reset progress for a family member?',
    answer:
      'Open Family Hub → Family tab, select the member, and clear their mission progress from device settings if you need a fresh start. Progress is stored locally on your browser or app—there is no cloud reset from PandaGarde servers.',
    category: 'general',
  },
  {
    id: '2',
    question: 'Why are some activities not working on my device?',
    answer:
      'Use a modern browser (Chrome, Firefox, Safari, or Edge) with JavaScript enabled. Clear cache, refresh, and try again. Some features need network access (for example RSS safety headlines); core missions work offline after load.',
    category: 'technical',
  },
  {
    id: '3',
    question: 'Can I use PandaGarde on my tablet or phone?',
    answer:
      'Yes. The website is responsive, and Family Hub can be installed as a mobile app (iOS/Android) or added to your home screen as a PWA.',
    category: 'technical',
  },
  {
    id: '4',
    question: 'How is my family data stored?',
    answer:
      'Family profiles, missions, and progress stay on your device by default. We do not require a server account for the core journey. Optional email signup is only for newsletters or updates if you choose it.',
    category: 'general',
  },
  {
    id: '5',
    question: 'Is my data safe and private?',
    answer:
      'PandaGarde is built local-first: we do not sell your family data, and there is no child social network in Family Hub. Sensitive fields can be encrypted in the browser when supported.',
    category: 'general',
  },
  {
    id: '6',
    question: 'Can I use PandaGarde in my classroom?',
    answer:
      'Yes. See Educator Tools and Classroom Activities for guides. The device-local community forum demo is optional—not a live classroom network.',
    category: 'general',
  },
  {
    id: '7',
    question: 'Safety alerts and notifications feel empty. What should I do?',
    answer:
      'Add your family’s apps in the Service Catalog first. Notifications and RSS headlines are generated from that list—they do not monitor your child’s device automatically.',
    category: 'technical',
  },
  {
    id: '8',
    question: 'How do I contact support for a specific issue?',
    answer:
      'Use the Contact page or email support@pandagarde.com. We typically respond within 24–48 hours.',
    category: 'account',
  },
];

const supportOptions: SupportOption[] = [
  {
    id: 'email',
    title: 'Email Support',
    description: 'Send us a detailed message and we will get back to you within 24–48 hours.',
    icon: Mail,
    responseTime: '24–48 hours',
    availability: '24/7',
    href: 'mailto:support@pandagarde.com',
    external: true,
  },
  {
    id: 'contact-form',
    title: 'Contact Form',
    description: 'Use our online contact form for quick questions and feedback.',
    icon: MessageCircle,
    responseTime: '24–48 hours',
    availability: '24/7',
    href: '/contact',
  },
  {
    id: 'faq',
    title: 'FAQ Section',
    description: 'Jump to answers about Family Hub, local storage, and troubleshooting.',
    icon: HelpCircle,
    responseTime: 'Immediate',
    availability: '24/7',
    scrollToFaq: true,
  },
  {
    id: 'family-hub',
    title: 'Family Hub workspace',
    description: 'Open the on-device mission workspace for family members, missions, and progress.',
    icon: Users,
    responseTime: 'On your device',
    availability: '24/7',
    href: '/family-hub',
  },
];

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'general', label: 'General', icon: BookOpen },
  { id: 'technical', label: 'Technical', icon: Shield },
  { id: 'account', label: 'Account', icon: Users },
] as const;

function SupportOptionCard({
  option,
  onFaqScroll,
}: {
  option: SupportOption;
  onFaqScroll: () => void;
}) {
  const Icon = option.icon;
  const cardClass =
    'flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-md transition-all hover:border-green-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-500';

  const inner = (
    <>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
        <Icon size={24} aria-hidden />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">{option.title}</h3>
      <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1">
          <Clock size={12} aria-hidden />
          {option.responseTime}
        </span>
        <span>{option.availability}</span>
      </div>
    </>
  );

  if (option.scrollToFaq) {
    return (
      <button type="button" onClick={onFaqScroll} className={cardClass}>
        {inner}
      </button>
    );
  }

  if (option.external && option.href) {
    return (
      <a href={option.href} className={cardClass}>
        {inner}
      </a>
    );
  }

  if (option.href) {
    return (
      <Link to={option.href} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}

const SupportPage: React.FC = () => {
  const searchId = useId();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToFaq = () => {
    document.getElementById('support-faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageLayout
      title="Support"
      subtitle="Get help using PandaGarde: Family Hub missions, local storage, troubleshooting, and how to reach our team."
      breadcrumbs
    >
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              How can we help you?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose the option that fits your question.
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {supportOptions.map((option) => (
              <SupportOptionCard key={option.id} option={option} onFaqScroll={scrollToFaq} />
            ))}
          </div>
        </div>
      </section>

      <section id="support-faq" className="border-t border-gray-200 py-12 dark:border-gray-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Answers aligned with how PandaGarde works today (local-first Family Hub).
            </p>
          </div>

          <div className="relative mb-6">
            <label htmlFor={searchId} className="sr-only">
              Search FAQs
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
              aria-hidden
            />
            <input
              id={searchId}
              type="search"
              placeholder="Search FAQs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div
            className="mb-8 flex flex-wrap justify-center gap-3"
            role="group"
            aria-label="Filter FAQs by category"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                    isActive
                      ? 'bg-green-700 text-white dark:bg-green-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} aria-hidden />
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((item) => {
              const isExpanded = expandedFAQ === item.id;
              const panelId = `faq-panel-${item.id}`;
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <button
                    type="button"
                    id={`faq-trigger-${item.id}`}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => setExpandedFAQ(isExpanded ? null : item.id)}
                    className="flex w-full min-h-[44px] items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500 dark:hover:bg-gray-700/50"
                  >
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {item.question}
                    </span>
                    <span className="shrink-0 text-2xl text-gray-500" aria-hidden>
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div id={panelId} role="region" aria-labelledby={`faq-trigger-${item.id}`} className="px-6 pb-4">
                      <p className="leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="py-12 text-center">
              <HelpCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" aria-hidden />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No FAQs found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try different search terms or another category.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50 py-12 dark:border-gray-700 dark:bg-gray-900/50">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Still need help?</h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            Our team can help with account questions, technical issues, and educator setup.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="button button-primary inline-flex items-center gap-2">
              <MessageCircle size={20} aria-hidden />
              Contact Support
            </Link>
            <a
              href="mailto:support@pandagarde.com"
              className="button button-secondary inline-flex items-center gap-2"
            >
              <Mail size={20} aria-hidden />
              Email Us
            </a>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-700 to-green-600 py-12 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Explore privacy missions in Family Hub or browse activities on the website.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/activity-book"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-gray-100"
            >
              <BookOpen size={20} aria-hidden />
              Try Activities
            </Link>
            <Link
              to="/family-hub"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-green-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-950"
            >
              <Users size={20} aria-hidden />
              Open Family Hub
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SupportPage;
