import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle, X, Search, BookOpen, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HelpTooltip from './HelpTooltip';

interface HelpItem {
  id: string;
  question: string;
  answer: string;
  category: 'getting-started' | 'dashboard' | 'privacy' | 'services' | 'troubleshooting';
  link?: string;
}

const helpItems: HelpItem[] = [
  {
    id: '1',
    question: 'How do I add my children?',
    answer: 'Open Family Hub → Family tab → Add Family Member. Enter their name and age (no email required). Missions and progress are saved on this device.',
    category: 'getting-started',
    link: '/family-hub'
  },
  {
    id: '2',
    question: 'What is a privacy risk score?',
    answer: 'The privacy risk score (0-100) reflects services you add to your family catalog—not live device monitoring. Lower scores are better. Scores come from footprint review and the service catalog.',
    category: 'dashboard'
  },
  {
    id: '3',
    question: 'How do I approve or deny service requests?',
    answer: 'On the website service catalog, you can mark services as requested, approved, or denied for planning and footprint analysis. Family Hub missions do not include a child app-approval workflow.',
    category: 'services'
  },
  {
    id: '4',
    question: 'What are conversation starters?',
    answer: 'Conversation starters are ready-to-use talking points to help you discuss privacy with your children. They\'re based on the apps your children use and their risk levels.',
    category: 'privacy',
    link: '/for-families'
  },
  {
    id: '5',
    question: 'How do I view my family\'s privacy status?',
    answer: 'Use footprint review on the website for household exposure, then Family Hub dashboard for today\'s mission, goals, and per-member progress—all stored locally.',
    category: 'dashboard'
  },
  {
    id: '6',
    question: 'What should I do if my child has a high risk score?',
    answer: 'Review the apps and websites they\'re using. Check the privacy settings for high-risk services. Use the conversation starters to discuss privacy with them. Consider removing or restricting access to very high-risk services.',
    category: 'privacy'
  },
  {
    id: '7',
    question: 'How do I set up privacy settings for an app?',
    answer: 'Click on a service in the catalog to see detailed information. Each service has a "How to Set Up Privacy Settings" section with step-by-step instructions.',
    category: 'services'
  },
  {
    id: '8',
    question: 'Can I track multiple children?',
    answer: 'Yes. Add each child in Family Hub with name and age. Mission progress and rewards are tracked per member on this device.',
    category: 'getting-started'
  }
];

interface HelpSystemProps {
  trigger?: 'button' | 'icon';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const HelpSystem: React.FC<HelpSystemProps> = ({ trigger = 'button', position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeHelp = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeHelp();
    };

    modal.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscape);
    return () => {
      modal.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeHelp]);

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'services', label: 'Services' },
    { id: 'troubleshooting', label: 'Troubleshooting' }
  ];

  const filteredItems = helpItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const positionClasses: Record<NonNullable<HelpSystemProps['position']>, string> = {
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5',
    'top-right': 'top-5 right-5',
    'top-left': 'top-5 left-5',
  };

  return (
    <>
      {trigger === 'button' ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className={`fixed z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-white shadow-lg transition-transform hover:scale-110 dark:bg-green-600 ${positionClasses[position]}`}
          aria-label="Open help"
        >
          <HelpCircle size={24} aria-hidden />
        </button>
      ) : (
        <HelpTooltip content="Click for help" trigger="click">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(true)}
            className="cursor-pointer border-none bg-transparent p-1 text-gray-500 dark:text-gray-400"
            aria-label="Help"
          >
            <HelpCircle size={20} aria-hidden />
          </button>
        </HelpTooltip>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4 sm:p-5"
          onClick={closeHelp}
          role="presentation"
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-system-title"
            className="flex max-h-[90vh] w-full max-w-[700px] flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700 sm:p-6">
              <div>
                <h2
                  id="help-system-title"
                  className="m-0 text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl"
                >
                  How can we help?
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Find answers to common questions
                </p>
              </div>
              <button
                type="button"
                onClick={closeHelp}
                className="cursor-pointer rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Close help"
              >
                <X size={24} aria-hidden />
              </button>
            </div>

            <div className="border-b border-gray-200 p-4 dark:border-gray-700 sm:px-6">
              <div className="relative">
                <Search
                  size={20}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search for help"
                  className="w-full rounded-lg border-2 border-gray-200 bg-white py-3 pl-10 pr-3 text-base text-gray-900 focus:border-green-600 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto border-b border-gray-200 p-4 dark:border-gray-700 sm:px-6">
              {categories.map((cat) => {
                const selected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm transition-colors ${
                      selected
                        ? 'border-green-600 bg-green-100 font-semibold text-green-800 dark:border-green-500 dark:bg-green-950/40 dark:text-green-200'
                        : 'border-gray-200 bg-white font-normal text-gray-600 hover:border-green-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-12 text-center text-gray-600 dark:text-gray-300">
                  <HelpCircle size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" aria-hidden />
                  <p>No help topics found. Try a different search term.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-gray-200 p-4 transition-shadow hover:border-green-500 hover:shadow-md dark:border-gray-600 dark:hover:border-green-500"
                    >
                      <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                        {item.question}
                      </h3>
                      <p className="text-[0.9375rem] leading-relaxed text-gray-600 dark:text-gray-300">
                        {item.answer}
                      </p>
                      {item.link && (
                        <Link
                          to={item.link}
                          onClick={closeHelp}
                          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Learn more
                          <ChevronRight size={16} aria-hidden />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 sm:p-6">
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/faq"
                  onClick={closeHelp}
                  className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-green-700 dark:text-gray-200 dark:hover:text-green-400"
                >
                  <FileText size={16} aria-hidden />
                  View Full FAQ
                </Link>
                <Link
                  to="/contact"
                  onClick={closeHelp}
                  className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-green-700 dark:text-gray-200 dark:hover:text-green-400"
                >
                  <MessageCircle size={16} aria-hidden />
                  Contact Support
                </Link>
                <Link
                  to="/for-families"
                  onClick={closeHelp}
                  className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-green-700 dark:text-gray-200 dark:hover:text-green-400"
                >
                  <BookOpen size={16} aria-hidden />
                  Parent Guides
                </Link>
              </div>
              <p className="m-0 text-xs text-gray-600 dark:text-gray-400">
                Still need help?{' '}
                <Link
                  to="/contact"
                  className="font-medium text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpSystem;

