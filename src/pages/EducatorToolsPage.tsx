import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type LucideIcon, GraduationCap, BookOpen, Users, ArrowRight, CheckCircle, FileText, Presentation, Award, Scale } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ResourceModal from '../components/ResourceModal';
import { PRIVACY_PORTAL_URL } from '../config/portal';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'curriculum' | 'activities' | 'assessments' | 'presentations' | 'handouts' | 'training';
  gradeLevel: string;
  duration: string;
  completed: boolean;
  icon: LucideIcon;
  /** In-app destination (PDF/ZIP packs are not in public/downloads yet) */
  navigateTo: string;
  actionLabel: string;
  preview: string[];
}

const EducatorToolsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showResource, setShowResource] = useState(false);
  const [completedResources, setCompletedResources] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const resources: Resource[] = [
    {
      id: 'k-5-curriculum',
      title: 'K-5 Privacy Curriculum',
      description:
        'Roadmap for teaching digital privacy in elementary school. Use Guides & stories, classroom activities, and printables on PandaGarde today.',
      category: 'curriculum',
      gradeLevel: 'K-5',
      duration: 'Full Year',
      completed: false,
      icon: BookOpen,
      navigateTo: '/for-families',
      actionLabel: 'Open Resources',
      preview: [
        'Year-long pacing outline via Guides & stories and implementation guide',
        'Guides & stories: guides, discussion prompts, and printables you can use now',
        'Pair with Privacy Panda story, coloring sheets, and safety posters',
        'Assessment: try Quick Assessment with older students / families',
        'Digital citizenship: link to age-specific guides from Guides & stories'
      ]
    },
    {
      id: 'middle-school-curriculum',
      title: '6-8 Privacy Curriculum',
      description:
        'Middle school privacy themes and pacing using live guides, assessments, and Family Hub activities.',
      category: 'curriculum',
      gradeLevel: '6-8',
      duration: 'Full Year',
      completed: false,
      icon: BookOpen,
      navigateTo: '/for-families',
      actionLabel: 'Open Resources',
      preview: [
        'Printable worksheets at /downloads/worksheets',
        'Use Guides & stories and Family Hub missions from the main site',
        'Classroom discussion guides under Guides & stories → Comprehensive Guides',
        'Digital footprint topics: Digital Footprint tool for family/school context'
      ]
    },
    {
      id: 'high-school-curriculum',
      title: '9-12 Privacy Curriculum',
      description:
        'Advanced privacy and digital rights themes via Teen Handbook, Digital Rights page, and pilot extras.',
      category: 'curriculum',
      gradeLevel: '9-12',
      duration: 'Full Year',
      completed: false,
      icon: BookOpen,
      navigateTo: '/for-families',
      actionLabel: 'Open Resources',
      preview: [
        'Pilot program for extended slide decks and educator packs',
        'Teen Handbook, Digital Rights, and related pages are available now',
        'Join the pilot for educator-facing slide decks and fuller packs (see Presentation Slides card)'
      ]
    },
    {
      id: 'classroom-activities',
      title: 'Privacy Panda Classroom Activities',
      description:
        'Chapter-by-chapter activities aligned with the Privacy Panda story — fully on the site (no PDF required).',
      category: 'activities',
      gradeLevel: 'K-3',
      duration: '4-6 weeks',
      completed: false,
      icon: Presentation,
      navigateTo: '/classroom-activities',
      actionLabel: 'Open activities',
      preview: [
        '8 hands-on activities (2 per chapter)',
        'Chapter 1: Understanding Personal Information',
        'Chapter 2: Privacy Settings & Digital Footprints',
        'Chapter 3: Safe Sharing & Choosing What to Share',
        'Chapter 4: Being a Privacy Hero',
        'Assessment ideas and cross-curricular connections on the same page'
      ]
    },
    {
      id: 'interactive-activities',
      title: 'Interactive Activity Library',
      description: 'Browser-based activities and the Privacy Panda interactive story — use in class or assign for home.',
      category: 'activities',
      gradeLevel: 'All',
      duration: 'Variable',
      completed: false,
      icon: Presentation,
      navigateTo: '/activity-book',
      actionLabel: 'Open Activity Book',
      preview: [
        'Activity Book: structured activities on the site',
        'Privacy Panda (/privacy-panda): interactive story experience',
        'No ZIP download — everything runs in the browser',
        'Supplement with coloring sheets and certificates under Downloads'
      ]
    },
    {
      id: 'assessment-tools',
      title: 'Assessment & Evaluation Tools',
      description: 'Use the live privacy assessments on PandaGarde and mark resources complete as you teach.',
      category: 'assessments',
      gradeLevel: 'All',
      duration: 'Variable',
      completed: false,
      icon: FileText,
      navigateTo: '/quick-assessment',
      actionLabel: 'Open Quick Assessment',
      preview: [
        'Quick Assessment and full Privacy Assessment flows are functional',
        'Great for pre/post checks with families or older students',
        'Use “Mark as used” to track your classroom workflow'
      ]
    },
    {
      id: 'teacher-training',
      title: 'Teacher Training & Implementation',
      description: 'Implementation guide and educator-focused context — professional-development PDF is not a separate download yet.',
      category: 'training',
      gradeLevel: 'All',
      duration: '8 hours',
      completed: false,
      icon: GraduationCap,
      navigateTo: '/implementation-guide',
      actionLabel: 'Open implementation guide',
      preview: [
        'Step-by-step implementation content on the site',
        'Pair with Guides & stories → Educator toolkit and discussion guides',
        'Contact us for district / PD questions'
      ]
    },
    {
      id: 'presentation-slides',
      title: 'Presentation Slides',
      description: 'Ready-made slide decks are not hosted as downloads yet. Join the pilot to help prioritize educator decks.',
      category: 'presentations',
      gradeLevel: 'All',
      duration: 'Variable',
      completed: false,
      icon: Presentation,
      navigateTo: '/pilot',
      actionLabel: 'Learn about the pilot',
      preview: [
        'No presentation-slides.zip on the server yet (previously advertised in error)',
        'Pilot program: early access to educator materials we are building',
        'Meanwhile: use safety posters HTML/PDF and Guides & stories for visual aids'
      ]
    },
    {
      id: 'student-handouts',
      title: 'Student Handouts & Printables',
      description: 'Real printables: coloring sheets, certificates, posters, and family agreement — all on the site.',
      category: 'handouts',
      gradeLevel: 'All',
      duration: 'Variable',
      completed: false,
      icon: FileText,
      navigateTo: '/downloads/coloring-sheets',
      actionLabel: 'Open coloring sheets',
      preview: [
        'Coloring sheets, certificates, safety posters, family agreement: linked from Guides & stories → Printables',
        'This button goes to Coloring Sheets first; use Guides & stories for the full printable set',
        'Bundled “student-handouts.zip” does not exist'
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'activities', label: 'Activities', icon: Presentation },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'presentations', label: 'Presentations', icon: Presentation },
    { id: 'handouts', label: 'Handouts', icon: FileText },
    { id: 'training', label: 'Training', icon: GraduationCap }
  ];

  const filteredResources = activeCategory === 'all'
    ? resources
    : resources.filter(resource => resource.category === activeCategory);

  useEffect(() => {
    // Load completed resources from localStorage
    const savedCompleted = localStorage.getItem('educator_tools_completed');
    if (savedCompleted) {
      setCompletedResources(JSON.parse(savedCompleted));
    }
  }, []);

  const handleResourceStart = (resource: Resource) => {
    if (resource.id === 'classroom-activities') {
      navigate(resource.navigateTo);
      return;
    }
    setSelectedResource(resource);
    setShowResource(true);
  };

  const goToResource = (resource: Resource) => {
    navigate(resource.navigateTo);
  };

  const handleResourceComplete = (resourceId: string) => {
    if (!completedResources.includes(resourceId)) {
      const newCompleted = [...completedResources, resourceId];
      setCompletedResources(newCompleted);
      localStorage.setItem('educator_tools_completed', JSON.stringify(newCompleted));
    }
    setShowResource(false);
    setSelectedResource(null);
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = categories.find(cat => cat.id === category);
    return categoryInfo ? categoryInfo.icon : BookOpen;
  };

  const getGradeLevelColor = (gradeLevel: string) => {
    switch (gradeLevel) {
      case 'K-3': return 'bg-green-100 text-green-800';
      case 'K-5': return 'bg-green-100 text-green-800';
      case '6-8': return 'bg-blue-100 text-blue-800';
      case '9-12': return 'bg-purple-100 text-purple-800';
      case 'All': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout
      title="Educator Tools"
      subtitle="Classroom activities, interactive missions, assessments, printables, and guides — each card opens a live page on PandaGarde or the pilot program for extended packs."
      breadcrumbs={true}
    >

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 mb-6 text-sm text-gray-800"
          role="status"
        >
          <strong className="text-amber-900 dark:text-amber-100">Note for educators:</strong>{' '}
          Each card opens a{' '}
          <strong>real page</strong> on the site or the <Link to="/pilot" className="underline font-medium text-amber-900 dark:text-amber-100">pilot</Link>{' '}
          for upcoming packs. Questions?{' '}
          <Link to="/contact" className="underline font-medium text-amber-900 dark:text-amber-100">Contact us</Link>.
        </div>

        {/* Progress Section */}
        <div className="py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8" style={{
            backgroundColor: 'var(--card-color)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                Your Resource Library
              </h2>
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{completedResources.length}</div>
                  <div className="text-sm text-gray-600">Resources Used</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: 'var(--primary-light)' }}>{resources.length}</div>
                  <div className="text-sm text-gray-600">Total Resources</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round((completedResources.length / resources.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Library Usage</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                      activeCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: activeCategory === category.id ? 'var(--primary-light)' : undefined,
                      color: activeCategory === category.id ? 'white' : undefined
                    }}
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
        <div className="pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            const CategoryIcon = getCategoryIcon(resource.category);
            const isCompleted = completedResources.includes(resource.id);

            return (
              <div
                key={resource.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer border-2 ${
                  isCompleted ? 'border-green-500' : 'border-transparent'
                }`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onClick={() => handleResourceStart(resource)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white">
                      <Icon size={24} />
                    </div>
                    {isCompleted && (
                      <CheckCircle size={24} className="text-green-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <CategoryIcon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500 capitalize">{resource.category}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-primary">
                    {resource.title}
                  </h3>

                  <p className="mb-4 leading-relaxed text-gray-600">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeLevelColor(resource.gradeLevel)}`}>
                      {resource.gradeLevel}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                      {resource.duration}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResourceStart(resource);
                      }}
                    >
                      {isCompleted ? 'Review' : 'View Details'}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToResource(resource);
                      }}
                      aria-label={resource.actionLabel}
                      title={resource.actionLabel}
                    >
                      <ArrowRight size={16} aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Resource Modal */}
        <ResourceModal
          isOpen={showResource && selectedResource !== null}
          onClose={() => {
            setShowResource(false);
            setSelectedResource(null);
          }}
          title={selectedResource?.title || ''}
          description={selectedResource?.description || ''}
          preview={selectedResource?.preview}
          duration={selectedResource?.duration}
          gradeLevel={selectedResource?.gradeLevel}
          primaryAction={
            selectedResource
              ? {
                  label: selectedResource.actionLabel,
                  onClick: () => {
                    navigate(selectedResource.navigateTo);
                    setShowResource(false);
                    setSelectedResource(null);
                  }
                }
              : undefined
          }
          onComplete={() => {
            if (selectedResource) {
              handleResourceComplete(selectedResource.id);
            }
          }}
          completeButtonText="Mark as Used"
          getGradeLevelColor={getGradeLevelColor}
        />

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-8 text-center mt-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Teach Digital Privacy?
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Start with classroom activities, printables, and assessments on the site today. Help us prioritize PDF curricula and slide decks via the pilot or contact.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/family-hub"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Users size={20} />
              Family Hub
            </Link>
            <Link
              to="/pilot"
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors inline-flex items-center gap-2"
            >
              <Presentation size={20} />
              Educator pilot
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            >
              <Award size={20} />
              Contact
            </Link>
          </div>
          <p className="mt-4 text-sm opacity-95">
            Maryland residents (MODPA):{' '}
            <a href={PRIVACY_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline hover:opacity-90">
              <Scale size={14} />
              Exercise your privacy rights
            </a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default EducatorToolsPage;