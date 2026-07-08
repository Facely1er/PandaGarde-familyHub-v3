import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, HelpCircle, Book, Users, Shield, Download, Gamepad2, type LucideIcon } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  all: HelpCircle,
  general: Book,
  'getting-started': Users,
  activities: Gamepad2,
  privacy: Shield,
  educators: Users,
  technical: Download,
};

const FAQPage: React.FC = () => {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqItems = t('faq.items', { returnObjects: true }) as FAQItem[];

  const categories = (
    t('faq.categories', { returnObjects: true }) as { id: string; label: string }[]
  ).map((category) => ({ ...category, icon: CATEGORY_ICONS[category.id] ?? HelpCircle }));

  const filteredItems = selectedCategory === 'all'
    ? faqItems
    : faqItems.filter(item => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <PageLayout
      title={t('faq.title')}
      subtitle={t('faq.subtitle')}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          {/* Category Filter */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary">
              {t('faq.browseByCategory')}
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    aria-pressed={selectedCategory === category.id}
                    className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white shadow-md shadow-green-900/30 ring-2 ring-green-400/40'
                        : 'bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-green-100/80 dark:hover:bg-green-900/30 dark:hover:text-green-200 dark:border dark:border-green-500/20'
                    }`}
                  >
                    <Icon size={15} aria-hidden />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="theme-card overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={openItems.includes(item.id)}
                  className="w-full px-4 sm:px-6 py-4 min-h-[56px] text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-gray-50/50 dark:bg-gray-800"
                >
                  <h3 className="text-base sm:text-lg font-semibold pr-4 text-primary">
                    {item.question}
                  </h3>
                  {openItems.includes(item.id) ? (
                    <ChevronUp size={20} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {openItems.includes(item.id) && (
                  <div className="px-6 pt-4 pb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 sm:mt-16 cta-banner">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              {t('faq.stillQuestions')}
            </h2>
            <p className="text-base sm:text-lg mb-5 sm:mb-6 opacity-90">
              {t('faq.stillQuestionsBody')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white/95 text-green-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-white hover:shadow-lg transition-all text-center dark:bg-emerald-950/60 dark:text-green-300 dark:border dark:border-green-400/30 dark:hover:bg-emerald-900/50"
              >
                {t('faq.contactUs')}
              </Link>
              <Link
                to="/family-hub"
                className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors text-center"
              >
                {t('faq.tryFamilyHub')}
              </Link>
            </div>
          </div>
        </div>
    </PageLayout>
  );
};

export default FAQPage;