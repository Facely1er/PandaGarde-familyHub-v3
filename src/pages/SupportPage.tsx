import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Headphones, Mail, MessageCircle, HelpCircle, Search, Clock, Star, Users, BookOpen, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'account' | 'billing';
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  responseTime: string;
  availability: string;
}

const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I reset my progress in the activities?',
      answer: 'You can reset your progress by going to the Family Hub, selecting the activity you want to reset, and clicking the "Reset Progress" button. This will clear all completion data for that specific activity.',
      category: 'general'
    },
    {
      id: '2',
      question: 'Why are some activities not working on my device?',
      answer: 'Make sure you\'re using a modern web browser (Chrome, Firefox, Safari, or Edge) with JavaScript enabled. Clear your browser cache and cookies, then try refreshing the page. If the issue persists, try using a different browser or device.',
      category: 'technical'
    },
    {
      id: '3',
      question: 'Can I use PandaGarde on my tablet or phone?',
      answer: 'Yes! PandaGarde is fully responsive and works on all devices including tablets and smartphones. The activities are optimized for touch interactions and mobile screens.',
      category: 'technical'
    },
    {
      id: '4',
      question: 'How do I save my child\'s completed activities?',
      answer: 'All progress is automatically saved to your device\'s local storage. You can also export your progress data from the Family Hub by clicking the "Export Progress" button. This creates a downloadable file you can save or print.',
      category: 'general'
    },
    {
      id: '5',
      question: 'Is my data safe and private?',
      answer: 'Absolutely! PandaGarde is designed with privacy in mind. We don\'t collect personal information, and all progress data is stored locally on your device. We don\'t track or share your data with third parties.',
      category: 'general'
    },
    {
      id: '6',
      question: 'Can I use PandaGarde in my classroom?',
      answer: 'Yes! We have special educator resources and curriculum guides available. Check out our Educator Tools section for classroom-specific materials and implementation guides.',
      category: 'general'
    },
    {
      id: '7',
      question: 'The activities are loading slowly. What should I do?',
      answer: 'Slow loading can be due to internet connection or device performance. Try closing other browser tabs, restarting your browser, or checking your internet connection. The activities work best with a stable internet connection.',
      category: 'technical'
    },
    {
      id: '8',
      question: 'How do I contact support if I have a specific issue?',
      answer: 'You can reach our support team through the contact form on our Contact page, or email us directly at support@pandagarde.com. We typically respond within 24-48 hours.',
      category: 'account'
    }
  ];

  const supportOptions: SupportOption[] = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us a detailed message and we\'ll get back to you within 24-48 hours.',
      icon: Mail,
      responseTime: '24-48 hours',
      availability: '24/7'
    },
    {
      id: 'contact-form',
      title: 'Contact Form',
      description: 'Use our online contact form for quick questions and feedback.',
      icon: MessageCircle,
      responseTime: '24-48 hours',
      availability: '24/7'
    },
    {
      id: 'faq',
      title: 'FAQ Section',
      description: 'Find quick answers to common questions and troubleshooting tips.',
      icon: HelpCircle,
      responseTime: 'Immediate',
      availability: '24/7'
    },
    {
      id: 'community',
      title: 'Family Hub Community',
      description: 'Connect with other families and share experiences through our Family Hub.',
      icon: Users,
      responseTime: 'Variable',
      availability: '24/7'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'general', label: 'General', icon: BookOpen },
    { id: 'technical', label: 'Technical', icon: Shield },
    { id: 'account', label: 'Account', icon: Users }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <PageLayout
      title="Support"
      subtitle="Get help and support for using PandaGarde resources. Find answers to common questions, troubleshoot issues, and connect with our support team."
      icon={Headphones}
      badge="SUPPORT"
      breadcrumbs={true}
    >

      {/* Support Options */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            How Can We Help You?
          </h2>
          <p className="text-lg" style={{ color: 'var(--gray-600)' }}>
            Choose the support option that works best for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer"
                style={{ backgroundColor: 'var(--card-color)' }}
                onClick={() => {
                  if (option.id === 'contact-form') {
                    navigate('/contact');
                  } else if (option.id === 'email') {
                    window.open('mailto:support@pandagarde.com', '_blank');
                  } else if (option.id === 'community') {
                    navigate('/family-hub');
                  }
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--primary)' }}>
                  {option.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--gray-600)' }}>
                  {option.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {option.responseTime}
                  </span>
                  <span>{option.availability}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-6 mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg" style={{ color: 'var(--gray-600)' }}>
              Find quick answers to common questions about PandaGarde.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-indigo-500 text-white'
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

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  style={{ backgroundColor: 'var(--gray-100)' }}
                >
                  <h3 className="text-lg font-semibold pr-4" style={{ color: 'var(--primary)' }}>
                    {item.question}
                  </h3>
                  {expandedFAQ === item.id ? (
                    <span className="text-2xl text-gray-500">−</span>
                  ) : (
                    <span className="text-2xl text-gray-500">+</span>
                  )}
                </button>

                {expandedFAQ === item.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                No FAQs Found
              </h3>
              <p style={{ color: 'var(--gray-600)' }}>
                Try adjusting your search terms or category filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 py-16" style={{ backgroundColor: 'var(--light)' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            Still Need Help?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--gray-600)' }}>
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all inline-flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Contact Support
            </Link>
            <a
              href="mailto:support@pandagarde.com"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 border border-indigo-600"
            >
              <Mail size={20} />
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Now that you know how to get help, explore our privacy education resources and start learning!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/activity-book"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <BookOpen size={20} />
              Try Activities
            </Link>
            <Link to="/family-hub"
              className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors inline-flex items-center gap-2"
            >
              <Users size={20} />
              Family Hub
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SupportPage;