import React, { useState } from 'react';
import { HelpCircle, X, Search, BookOpen, MessageCircle, Video, FileText, ExternalLink, ChevronRight } from 'lucide-react';
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
    answer: 'Go to the Family Hub and click "Add Family Member". Enter their name and email, then select "Child" as their role.',
    category: 'getting-started',
    link: '/family-hub'
  },
  {
    id: '2',
    question: 'What is a privacy risk score?',
    answer: 'The privacy risk score (0-100) shows how safe your child\'s online activity is. Lower scores are better. It\'s calculated based on the apps and websites they use.',
    category: 'dashboard'
  },
  {
    id: '3',
    question: 'How do I approve or deny service requests?',
    answer: 'When your child requests a new app or website, you\'ll see it in the "Pending Requests" section of your dashboard. Click "Approve" or "Deny" to make your decision.',
    category: 'services'
  },
  {
    id: '4',
    question: 'What are conversation starters?',
    answer: 'Conversation starters are ready-to-use talking points to help you discuss privacy with your children. They\'re based on the apps your children use and their risk levels.',
    category: 'privacy',
    link: '/parent-resources'
  },
  {
    id: '5',
    question: 'How do I view my family\'s privacy status?',
    answer: 'The Overview tab in your dashboard shows your family\'s overall privacy score, action items, and quick stats. This is your main hub for privacy monitoring.',
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
    answer: 'Yes! You can add multiple children to your family account. Each child has their own privacy score and service list. You can view them all from the Children tab.',
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

  const positionStyles = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' }
  };

  return (
    <>
      {trigger === 'button' ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            ...positionStyles[position],
            zIndex: 1000,
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Open help"
        >
          <HelpCircle size={24} />
        </button>
      ) : (
        <HelpTooltip
          content="Click for help"
          trigger="click"
        >
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem'
            }}
            aria-label="Help"
          >
            <HelpCircle size={20} />
          </button>
        </HelpTooltip>
      )}

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C3E50', margin: 0 }}>
                  How can we help?
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.25rem 0 0 0' }}>
                  Find answers to common questions
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0.5rem'
                }}
                aria-label="Close help"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            {/* Categories */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto'
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    border: '2px solid',
                    borderColor: selectedCategory === cat.id ? '#4CAF50' : '#e5e7eb',
                    backgroundColor: selectedCategory === cat.id ? '#d1fae5' : 'white',
                    color: selectedCategory === cat.id ? '#065f46' : '#666',
                    fontSize: '0.875rem',
                    fontWeight: selectedCategory === cat.id ? 600 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Help Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                  <HelpCircle size={48} style={{ margin: '0 auto 1rem', color: '#ccc' }} />
                  <p>No help topics found. Try a different search term.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#4CAF50';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', marginBottom: '0.5rem' }}>
                        {item.question}
                      </h3>
                      <p style={{ fontSize: '0.9375rem', color: '#666', lineHeight: '1.6', marginBottom: item.link ? '0.75rem' : 0 }}>
                        {item.answer}
                      </p>
                      {item.link && (
                        <Link
                          to={item.link}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#4CAF50',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            marginTop: '0.5rem'
                          }}
                        >
                          Learn more
                          <ChevronRight size={16} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '1.5rem',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/faq"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#2C3E50',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  <FileText size={16} />
                  View Full FAQ
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#2C3E50',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  <MessageCircle size={16} />
                  Contact Support
                </Link>
                <Link
                  to="/parent-resources"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#2C3E50',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  <BookOpen size={16} />
                  Parent Guides
                </Link>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>
                Still need help? <Link to="/contact" style={{ color: '#4CAF50', textDecoration: 'none' }}>Contact our support team</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpSystem;

