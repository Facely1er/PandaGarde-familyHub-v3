import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  ArrowRight,
  FileText,
  MessageCircle,
  CheckCircle,
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
      subtitle="Shortcuts to guides, plans, and activities already on PandaGarde—each card opens a real page. There are no separate PDF kits to download from this screen."
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Introduction Section */}
        <div className="mb-8 rounded-xl border border-green-200 bg-green-50/80 p-6 dark:border-green-800 dark:bg-green-950/30">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            How this page works
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Each card links to an existing guide, plan, activity, or download page. Use{' '}
            <strong>View details</strong> to see what is on that page, then <strong>Go to page</strong> to open it.
            For the full Digital Footprint Analysis path, start from{' '}
            <Link to="/service-catalog" className="font-semibold text-green-700 underline dark:text-green-400">
              Service catalog
            </Link>
            .
          </p>
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
                      <h3 className="text-xl font-bold mb-2 text-primary">
                        {resource.title}
                      </h3>
                      <p className="mb-4 leading-relaxed text-gray-600">
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
        <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-600 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Next steps</h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
            Run Footprint Review after your service catalog, or open Family Hub for optional kids&apos; missions on this device.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/digital-footprint"
              className="button button-primary inline-flex items-center gap-2"
            >
              Footprint Review
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              to="/family-hub"
              className="button button-secondary inline-flex items-center gap-2"
            >
              Family Hub
            </Link>
            <Link
              to="/community/forum"
              className="button button-secondary inline-flex items-center gap-2"
            >
              Community forum (demo)
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ParentToolkitPage;

