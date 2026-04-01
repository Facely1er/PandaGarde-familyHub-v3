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
      answer: 'PandaGarde helps kids ages 5–17 learn about online privacy and safety. We use stories, games, and fun activities so the whole family can learn together.',
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
      answer: 'We have content for kids ages 5–17, with different activities for each stage: young kids (5–8), tweens (9–12), and teens (13–17).',
      category: 'general'
    },
    {
      id: '4',
      question: 'How do I get started with PandaGarde?',
      answer: 'It’s easy! Browse our free resources, try the activities in our Activity Book, or start with the Privacy Panda story. There’s no account required to explore.',
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
      answer: 'Our activities are designed to be engaging and educational. They include coloring pages, drag-and-drop games, mazes, word searches, and matching games. Each activity teaches specific privacy concepts while being fun to complete.',
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
      answer: 'Yes! You can see which activities your child has done, their scores, and how they’re doing. That makes it easier to talk about what they’ve learned.',
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
      icon={HelpCircle}
      badge="FAQ"
    >
      <div className="max-w-4xl mx-auto">
          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category.id ? 'var(--primary-light)' : undefined,
                      color: selectedCategory === category.id ? 'white' : undefined
                    }}
                  >
                    <Icon size={16} />
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
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                style={{ backgroundColor: 'var(--card-color)', boxShadow: 'var(--shadow-md)' }}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  style={{ backgroundColor: 'var(--gray-100)' }}
                >
                  <h3 className="text-lg font-semibold pr-4" style={{ color: 'var(--primary)' }}>
                    {item.question}
                  </h3>
                  {openItems.includes(item.id) ? (
                    <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openItems.includes(item.id) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Can't find what you're looking for? We're here to help!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/activity-book"
                className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
              >
                Try Activities
              </Link>
            </div>
          </div>
        </div>
    </PageLayout>
  );
};

export default FAQPage;