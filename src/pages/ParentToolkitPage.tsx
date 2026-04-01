import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowLeft, Download, FileText, Shield, MessageCircle, CheckCircle, Users, BookOpen, Settings, Lock, Eye, AlertTriangle, Search, Filter, Star, Clock } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ResourceModal from '../components/ResourceModal';

interface ToolkitResource {
  id: string;
  title: string;
  description: string;
  category: 'templates' | 'guides' | 'checklists' | 'conversations' | 'tools' | 'expert';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  downloadUrl?: string;
  preview?: string[];
  duration?: string;
}

const ParentToolkitPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<ToolkitResource | null>(null);

  const resources: ToolkitResource[] = [
    {
      id: 'privacy-policy-template',
      title: 'Family Privacy Policy Template',
      description: 'A customizable template to create your own family privacy policy that establishes clear rules and expectations.',
      category: 'templates',
      icon: FileText,
      downloadUrl: '/downloads/family-privacy-policy-template.pdf',
      preview: [
        'Device usage guidelines',
        'Social media rules',
        'Information sharing boundaries',
        'Consequences and rewards',
        'Review and update schedule'
      ],
      duration: '15 min'
    },
    {
      id: 'device-setup-checklist',
      title: 'Device Setup Checklist',
      description: 'Step-by-step checklist for setting up new devices with privacy and safety in mind.',
      category: 'checklists',
      icon: CheckCircle,
      downloadUrl: '/downloads/device-setup-checklist.pdf',
      preview: [
        'Initial security settings',
        'Privacy configuration steps',
        'App permission review',
        'Parental control setup',
        'Testing and verification'
      ],
      duration: '30 min'
    },
    {
      id: 'conversation-starters',
      title: 'Privacy Conversation Starters',
      description: 'Age-appropriate questions and prompts to start meaningful conversations about digital privacy.',
      category: 'conversations',
      icon: MessageCircle,
      downloadUrl: '/downloads/conversation-starters.pdf',
      preview: [
        'Questions for ages 5-8',
        'Discussion topics for ages 9-12',
        'Teen conversation prompts',
        'Scenario-based discussions',
        'Follow-up questions'
      ],
      duration: '10 min'
    },
    {
      id: 'app-review-guide',
      title: 'App Review & Selection Guide',
      description: 'Learn how to evaluate apps for privacy, safety, and age-appropriateness before your child uses them.',
      category: 'guides',
      icon: Search,
      downloadUrl: '/downloads/app-review-guide.pdf',
      preview: [
        'Privacy policy analysis',
        'Permission evaluation',
        'Age rating considerations',
        'Content review checklist',
        'Red flags to watch for'
      ],
      duration: '20 min'
    },
    {
      id: 'safety-checklist',
      title: 'Digital Safety Checklist',
      description: 'Comprehensive checklist to regularly review your child\'s digital safety and privacy settings.',
      category: 'checklists',
      icon: Shield,
      downloadUrl: '/downloads/digital-safety-checklist.pdf',
      preview: [
        'Account security review',
        'Privacy settings audit',
        'Friend/follower verification',
        'Content sharing review',
        'Location settings check'
      ],
      duration: '25 min'
    },
    {
      id: 'privacy-settings-guide',
      title: 'Privacy Settings Guide',
      description: 'Detailed guides for configuring privacy settings on popular platforms and devices.',
      category: 'guides',
      icon: Settings,
      downloadUrl: '/downloads/privacy-settings-guide.pdf',
      preview: [
        'iOS privacy settings',
        'Android privacy settings',
        'Social media platforms',
        'Gaming platforms',
        'Browser settings'
      ],
      duration: '45 min'
    },
    {
      id: 'monitoring-tools-guide',
      title: 'Monitoring Tools Guide',
      description: 'Overview of parental control and monitoring tools, their features, and best practices.',
      category: 'tools',
      icon: Eye,
      downloadUrl: '/downloads/monitoring-tools-guide.pdf',
      preview: [
        'Tool comparison chart',
        'Feature explanations',
        'Setup instructions',
        'Privacy considerations',
        'Recommendations by age'
      ],
      duration: '30 min'
    },
    {
      id: 'incident-response-plan',
      title: 'Incident Response Plan Template',
      description: 'A template to help you respond quickly and effectively if your child encounters online issues.',
      category: 'templates',
      icon: AlertTriangle,
      downloadUrl: '/downloads/incident-response-plan.pdf',
      preview: [
        'Immediate response steps',
        'Documentation checklist',
        'Who to contact',
        'Follow-up actions',
        'Prevention strategies'
      ],
      duration: '20 min'
    },
    {
      id: 'password-security-guide',
      title: 'Password Security Guide',
      description: 'Teach your children about creating strong passwords and managing them securely.',
      category: 'guides',
      icon: Lock,
      downloadUrl: '/downloads/password-security-guide.pdf',
      preview: [
        'Password creation rules',
        'Password manager basics',
        'Two-factor authentication',
        'Age-appropriate strategies',
        'Practice activities'
      ],
      duration: '25 min'
    },
    {
      id: 'expert-advice-library',
      title: 'Expert Advice Library',
      description: 'Curated articles and advice from privacy experts, child psychologists, and digital safety specialists.',
      category: 'expert',
      icon: BookOpen,
      downloadUrl: '/downloads/expert-advice-library.pdf',
      preview: [
        'Age-appropriate privacy education',
        'Balancing safety and independence',
        'Building trust and communication',
        'Recognizing warning signs',
        'When to seek professional help'
      ],
      duration: 'Variable'
    },
    {
      id: 'family-agreement-template',
      title: 'Family Internet Agreement Template',
      description: 'A comprehensive agreement template that establishes rules and expectations for internet use.',
      category: 'templates',
      icon: FileText,
      downloadUrl: '/downloads/family-agreement',
      preview: [
        'Device usage rules',
        'Time limits and schedules',
        'App and website guidelines',
        'Communication rules',
        'Consequences and rewards'
      ],
      duration: '30 min'
    },
    {
      id: 'social-media-guide',
      title: 'Social Media Safety Guide',
      description: 'Complete guide to helping your child navigate social media safely and responsibly.',
      category: 'guides',
      icon: Users,
      downloadUrl: '/downloads/social-media-guide.pdf',
      preview: [
        'Platform-specific safety tips',
        'Privacy setting walkthroughs',
        'Content sharing guidelines',
        'Dealing with cyberbullying',
        'Building positive online presence'
      ],
      duration: '40 min'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', icon: Wrench },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'guides', label: 'Guides', icon: BookOpen },
    { id: 'checklists', label: 'Checklists', icon: CheckCircle },
    { id: 'conversations', label: 'Conversations', icon: MessageCircle },
    { id: 'tools', label: 'Tools', icon: Settings },
    { id: 'expert', label: 'Expert Advice', icon: Star }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'templates': return 'bg-blue-100 text-blue-800';
      case 'guides': return 'bg-green-100 text-green-800';
      case 'checklists': return 'bg-yellow-100 text-yellow-800';
      case 'conversations': return 'bg-purple-100 text-purple-800';
      case 'tools': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout
      title="Parent Toolkit"
      subtitle="Comprehensive tools and resources to help parents guide their children's digital journey. Templates, guides, checklists, and expert advice all in one place."
      icon={Wrench}
      badge="TOOLKIT"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Introduction Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-8 border border-green-200">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            Everything You Need to Protect Your Family's Digital Privacy
          </h2>
          <p className="text-lg mb-4" style={{ color: 'var(--gray-700)' }}>
            Our Parent Toolkit provides you with practical, ready-to-use resources to help your children navigate the digital world safely. 
            From privacy policy templates to conversation starters, we've got you covered.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Ready-to-Use Templates</h3>
                <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Customizable templates for policies, agreements, and plans</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Step-by-Step Guides</h3>
                <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Detailed guides for setting up devices and configuring privacy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--gray-800)' }}>Conversation Starters</h3>
                <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Age-appropriate prompts to start meaningful discussions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-color)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <span className="text-sm font-medium" style={{ color: 'var(--gray-700)' }}>Filter by category:</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mb-8">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">No resources found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={resource.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200"
                    style={{ backgroundColor: 'var(--card-color)' }}
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white">
                          <Icon size={24} />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(resource.category)}`}>
                          {resource.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                        {resource.title}
                      </h3>
                      <p className="mb-4 leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                        {resource.description}
                      </p>
                      {resource.duration && (
                        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--gray-500)' }}>
                          <Clock size={14} />
                          <span>{resource.duration}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResource(resource);
                          }}
                        >
                          View Details
                        </button>
                        {resource.downloadUrl && (
                          <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              // In a real app, this would trigger a download
                              if (resource.downloadUrl === '/downloads/family-agreement') {
                                window.location.href = '/downloads/family-agreement';
                              } else {
                                alert('Download would start here');
                              }
                            }}
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Resource Modal */}
        <ResourceModal
          isOpen={selectedResource !== null}
          onClose={() => setSelectedResource(null)}
          title={selectedResource?.title || ''}
          description={selectedResource?.description || ''}
          preview={selectedResource?.preview}
          duration={selectedResource?.duration}
          downloadUrl={selectedResource?.downloadUrl}
          onDownload={() => {
            if (selectedResource?.downloadUrl) {
              if (selectedResource.downloadUrl === '/downloads/family-agreement') {
                window.location.href = '/downloads/family-agreement';
              } else {
                alert('Download would start here');
              }
            }
          }}
        />

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-8 text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Need More Help?
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Explore our guides, join the community forum, or access additional resources to support your family's digital privacy journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/guides/age-specific"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <BookOpen size={20} />
              View Guides
            </Link>
            <Link
              to="/community/forum"
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Join Forum
            </Link>
            <Link
              to="/resources"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Users size={20} />
              More Resources
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ParentToolkitPage;

