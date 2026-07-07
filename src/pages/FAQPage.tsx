import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle, Book, Users, Shield, Download, Gamepad2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'What is PandaGarde and who is it for?',
      answer: 'PandaGarde helps families with children and teens ages 5–17 learn about online privacy together. It combines Privacy Panda stories, parent guides, a footprint review, and Family Hub missions — use any of them in any order.',
      category: 'general'
    },
    {
      id: '2',
      question: 'Is PandaGarde free to use?',
      answer: 'Yes! PandaGarde is completely free for families and educators. We believe privacy education should be accessible to everyone, so all our resources, activities, and content are available at no cost.',
      category: 'general'
    },
    {
      id: '3',
      question: 'What age groups does PandaGarde support?',
      answer: 'PandaGarde is designed for ages 5–17, with Family Hub missions matched to three bands: young children (5–8), older kids (9–12), and teens (13–17). Stories, guides, and missions are all age-aware.',
      category: 'general'
    },
    {
      id: '4',
      question: 'How do I get started with PandaGarde?',
      answer: "Start anywhere — no account required. Most families open a Privacy Panda story first, or browse the parent guides. The footprint review and Family Hub are there when you're ready for them.",
      category: 'getting-started'
    },
    {
      id: '5',
      question: 'Can educators use PandaGarde in schools?',
      answer: 'Absolutely! We provide educator-specific resources and curriculum guides for classroom use. Teachers can use our activities, stories, and discussion guides to teach digital privacy concepts in their classrooms.',
      category: 'educators'
    },
    {
      id: '6',
      question: 'How do the interactive activities work?',
      answer: 'Interactive missions and games live in the Family Hub. Each mission pairs a real-life scenario and family conversation with an optional hands-on game — coloring, mazes, sorting, and word searches for younger kids, and simulations like the Phishing Detective for teens. Everything runs on your device.',
      category: 'activities'
    },
    {
      id: '7',
      question: 'Is my child\'s data safe on PandaGarde?',
      answer: 'Yes. We don’t collect personal info from kids, and progress is saved on your device. We don’t share your data with anyone else.',
      category: 'privacy'
    },
    {
      id: '8',
      question: 'Can I track my child\'s progress?',
      answer: 'Yes! In the Family Hub you can see which missions your child has done, their scores, and streaks — all saved on this device only. It’s a record of learning activities completed together, not monitoring of what your child does elsewhere online.',
      category: 'progress'
    },
    {
      id: '9',
      question: 'What if my child has questions about privacy?',
      answer: 'We provide discussion guides and conversation starters for parents to help answer questions about privacy. Our resources are designed to make these important conversations easier and more engaging for both parents and children.',
      category: 'support'
    },
    {
      id: '10',
      question: 'Are there offline resources available?',
      answer: 'Yes! We offer downloadable coloring sheets, certificates, family agreements, and printable activities that you can use offline. These are perfect for continuing the learning away from screens.',
      category: 'resources'
    },
    {
      id: '11',
      question: 'How often is new content added?',
      answer: 'We regularly add new activities, stories, and resources to keep the learning experience fresh and engaging. We also update our content based on feedback from families and educators.',
      category: 'content'
    },
    {
      id: '12',
      question: 'Can I use PandaGarde on mobile devices?',
      answer: 'Yes! PandaGarde works on phones, tablets, and computers. You can even add it to your home screen and use it like an app.',
      category: 'technical'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'general', label: 'General', icon: Book },
    { id: 'getting-started', label: 'Getting Started', icon: Users },
    { id: 'activities', label: 'Activities', icon: Gamepad2 },
    { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
    { id: 'educators', label: 'For Educators', icon: Users },
    { id: 'technical', label: 'Technical', icon: Download }
  ];

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
      title="FAQ"
      subtitle="Quick answers to questions about PandaGarde and how to use it with your family."
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          {/* Category Filter */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary">
              Browse by Category
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
                        : 'bg-gray-100 dark:bg-gray-200/80 text-gray-700 dark:text-gray-200 hover:bg-green-100/80 dark:hover:bg-green-900/30 dark:hover:text-green-200 dark:border dark:border-green-500/20'
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
                  className="w-full px-4 sm:px-6 py-4 min-h-[56px] text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-gray-50/50 dark:bg-gray-200"
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
              Still Have Questions?
            </h2>
            <p className="text-base sm:text-lg mb-5 sm:mb-6 opacity-90">
              Can't find what you're looking for? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white/95 text-green-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-white hover:shadow-lg transition-all text-center dark:bg-emerald-950/60 dark:text-green-300 dark:border dark:border-green-400/30 dark:hover:bg-emerald-900/50"
              >
                Contact Us
              </Link>
              <Link
                to="/family-hub"
                className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors text-center"
              >
                Try Family Hub
              </Link>
            </div>
          </div>
        </div>
    </PageLayout>
  );
};

export default FAQPage;