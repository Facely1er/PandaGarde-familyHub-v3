import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  ArrowRight,
  FileText,
  MessageCircle,
  BookOpen,
  Settings,
  Search,
  Filter,
  Clock,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ResourceModal from '../components/ResourceModal';
import { getToolkitRoute } from '../data/parentToolkitRoutes';
import { PARENT_TOOLKIT_RESOURCES, type ParentToolkitResource } from '../data/parentToolkitResources';

const ParentToolkitPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<ParentToolkitResource | null>(null);

  const resources = PARENT_TOOLKIT_RESOURCES;

  const categories = [
    { id: 'all', label: 'All shortcuts', icon: Wrench },
    { id: 'templates', label: 'Plans & agreements', icon: FileText },
    { id: 'guides', label: 'Guides', icon: BookOpen },
    { id: 'conversations', label: 'Conversations', icon: MessageCircle },
    { id: 'tools', label: 'Activities', icon: Settings },
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
      case 'conversations': return 'bg-purple-100 text-purple-800';
      case 'tools': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout
      title="Toolkit"
      subtitle="Pick a card below to open a guide, plan, or printable. Each card takes you somewhere useful—start with Family privacy plan if you are not sure."
      breadcrumbs={true}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="mb-8 rounded-xl border border-green-200 bg-green-50/80 p-6 dark:border-green-800 dark:bg-green-950/30">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Recommended first step
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            New here? Open the{' '}
            <Link to="/family-privacy-plan" className="font-semibold text-green-700 underline dark:text-green-400">
              Family privacy plan
            </Link>{' '}
            to write down your household rules together, or{' '}
            <Link to="/stories" className="font-semibold text-green-700 underline dark:text-green-400">
              read a Privacy Panda story
            </Link>{' '}
            with your child (about 5 minutes).
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden />
                <input
                  type="text"
                  id="toolkit-search"
                  aria-label="Search toolkit resources"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter by category:</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    aria-pressed={selectedCategory === category.id}
                    className={`flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-green-700 text-white dark:bg-green-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
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
            <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center shadow-md dark:border-gray-700 dark:bg-gray-800">
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
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer rounded-2xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    onClick={() => setSelectedResource(resource)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedResource(resource);
                      }
                    }}
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
                      <h3 className="text-xl font-bold mb-2 text-primary">
                        {resource.title}
                      </h3>
                      <p className="mb-4 leading-relaxed text-gray-600">
                        {resource.description}
                      </p>
                      {resource.duration && (
                        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{resource.duration}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          className="flex-1 rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800 dark:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResource(resource);
                          }}
                        >
                          View Details
                        </button>
                        {(() => {
                          const route = getToolkitRoute(resource.id);
                          return route ? (
                            <Link
                              to={route.href}
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-green-600 bg-white px-3 py-2 text-sm font-semibold text-green-800 transition-colors hover:bg-green-50 dark:border-green-500 dark:bg-gray-800 dark:text-green-200 dark:hover:bg-green-950/40"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Go to page
                              <ArrowRight size={15} aria-hidden />
                            </Link>
                          ) : null;
                        })()}
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
          primaryAction={
            selectedResource
              ? (() => {
                  const route = getToolkitRoute(selectedResource.id);
                  return route
                    ? {
                        label: route.label,
                        onClick: () => {
                          setSelectedResource(null);
                          navigate(route.href);
                        },
                      }
                    : undefined;
                })()
              : undefined
          }
        />

        {/* Call to Action */}
        <div className="rounded-2xl bg-green-700 p-6 text-center text-white dark:bg-green-800">
          <h2 className="text-xl font-bold">Next steps</h2>
          <p className="mx-auto mt-2 max-w-2xl text-green-50">
            Run Footprint Review after your service catalog, or open Family Hub for optional kids&apos; missions on this device.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/digital-footprint"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-green-800 hover:bg-green-50"
            >
              Footprint Review
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              to="/family-hub"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-white px-5 py-2.5 font-semibold text-white hover:bg-white/10"
            >
              Family Hub
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-white px-5 py-2.5 font-semibold text-white hover:bg-white/10"
            >
              How it works
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ParentToolkitPage;

