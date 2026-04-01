import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Plus, Search, Star, TrendingUp, Save, CheckCircle, Tag, Eye } from 'lucide-react';
import { communityStorage, SharedResource } from '../../utils/communityStorageManager';

interface ResourceSharingProps {
  compact?: boolean;
}

const ResourceSharing: React.FC<ResourceSharingProps> = ({ compact = false }) => {
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<SharedResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'verified'>('popular');
  const [savedResources, setSavedResources] = useState<string[]>([]);

  const categories: Array<{ value: string; label: string }> = [
    { value: 'all', label: 'All Resources' },
    { value: 'privacy-tools', label: 'Privacy Tools' },
    { value: 'educational-content', label: 'Educational Content' },
    { value: 'parent-guides', label: 'Parent Guides' },
    { value: 'conversation-starters', label: 'Conversation Starters' },
    { value: 'privacy-settings', label: 'Privacy Settings' },
    { value: 'family-agreements', label: 'Family Agreements' },
    { value: 'apps-services', label: 'Apps & Services' },
    { value: 'general', label: 'General' }
  ];

  useEffect(() => {
    loadResources();
    loadSavedResources();
  }, []);

  useEffect(() => {
    filterAndSortResources();
  }, [resources, selectedCategory, searchQuery, sortBy]);

  const loadResources = () => {
    const allResources = communityStorage.getAllResources();
    const publishedResources = Object.values(allResources)
      .filter(resource => resource.status === 'published')
      .map(resource => {
        // Increment views when loaded
        communityStorage.incrementResourceViews(resource.id);
        return { ...resource, views: resource.views + 1 };
      });
    setResources(publishedResources);
  };

  const loadSavedResources = () => {
    const saved = communityStorage.getSavedResources();
    setSavedResources(saved.map(r => r.id));
  };

  const filterAndSortResources = () => {
    let filtered = [...resources];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'verified') {
      filtered.sort((a, b) => {
        if (a.verified && !b.verified) {return -1;}
        if (!a.verified && b.verified) {return 1;}
        return b.upvotes - a.upvotes;
      });
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredResources(filtered);
  };

  const handleVote = (resourceId: string) => {
    communityStorage.voteResource(resourceId, 'up');
    loadResources();
  };

  const handleSave = (resourceId: string) => {
    communityStorage.saveResourceToPersonalList(resourceId);
    loadResources();
    loadSavedResources();
  };

  const handleSubmit = (formData: {
    title: string;
    description: string;
    url: string;
    category: SharedResource['category'];
    tags: string[];
  }) => {
    communityStorage.saveResource(formData);
    loadResources();
    setShowForm(false);
  };

  if (compact) {
    const featuredResources = filteredResources
      .filter(r => r.verified || r.featured)
      .slice(0, 5);
    
    return (
      <div className="bg-white rounded-lg p-4 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <BookOpen size={20} />
            Community Resources
          </h3>
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            <Plus size={14} />
            Share
          </button>
        </div>
        <div className="space-y-3">
          {featuredResources.map(resource => (
            <div key={resource.id} className="border-b border-gray-200 pb-3 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                    {resource.title}
                    {resource.verified && <CheckCircle size={14} className="text-green-600" />}
                  </h4>
                  <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--gray-600)' }}>
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star size={12} />
                      {resource.upvotes}
                    </span>
                    <span>{resource.category}</span>
                  </div>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-green-600 hover:text-green-700"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
        {showForm && (
          <ResourceSubmissionForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                Community Resources
              </h2>
              <p className="text-lg" style={{ color: 'var(--gray-600)' }}>
                Privacy tools, guides, and educational resources shared by the community
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Share Resource
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Privacy First:</strong> All resource submissions are anonymous. No personal information is collected. All data is stored locally on your device.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-6" style={{ backgroundColor: 'var(--card-color)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'verified')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
            >
              <option value="popular">Most Popular</option>
              <option value="verified">Verified First</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No resources found. Be the first to share a resource!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Share Resource
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isSaved={savedResources.includes(resource.id)}
                onVote={handleVote}
                onSave={handleSave}
              />
            ))}
          </div>
        )}

        {/* Submission Form Modal */}
        {showForm && (
          <ResourceSubmissionForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

interface ResourceCardProps {
  resource: SharedResource;
  isSaved: boolean;
  onVote: (resourceId: string) => void;
  onSave: (resourceId: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, isSaved, onVote, onSave }) => {
  const [isVoted, setIsVoted] = useState(false);

  const handleVote = () => {
    if (!isVoted) {
      onVote(resource.id);
      setIsVoted(true);
    }
  };

  const handleSave = () => {
    onSave(resource.id);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: 'var(--card-color)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
              {resource.title}
            </h3>
            {resource.verified && (
              <CheckCircle size={18} className="text-green-600" title="Verified Resource" />
            )}
            {resource.featured && (
              <Star size={18} className="text-yellow-500 fill-current" title="Featured Resource" />
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              {resource.category.replace('-', ' ')}
            </span>
            {resource.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <p className="mb-4 line-clamp-3" style={{ color: 'var(--gray-600)' }}>
        {resource.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <button
            onClick={handleVote}
            className={`flex items-center gap-1 ${isVoted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
          >
            <Star size={16} fill={isVoted ? 'currentColor' : 'none'} />
            {resource.upvotes}
          </button>
          <span className="flex items-center gap-1">
            <Eye size={16} />
            {resource.views}
          </span>
          <span className="flex items-center gap-1">
            <Save size={16} />
            {resource.saves}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className={`p-2 rounded ${isSaved ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
            title={isSaved ? 'Saved' : 'Save to list'}
          >
            <Save size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-green-600 hover:text-green-700 rounded"
            title="Open resource"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

interface ResourceSubmissionFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    url: string;
    category: SharedResource['category'];
    tags: string[];
  }) => void;
  onCancel: () => void;
}

const ResourceSubmissionForm: React.FC<ResourceSubmissionFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<SharedResource['category']>('general');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {newErrors.title = 'Title is required';}
    if (!description.trim()) {newErrors.description = 'Description is required';}
    if (description.length > 500) {newErrors.description = 'Description must be 500 characters or less';}
    if (!url.trim()) {newErrors.url = 'URL is required';}
    try {
      new URL(url);
    } catch {
      newErrors.url = 'Please enter a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        category,
        tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      });
      // Reset form
      setTitle('');
      setDescription('');
      setUrl('');
      setCategory('general');
      setTags('');
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6" style={{ backgroundColor: 'var(--card-color)' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            Share a Resource
          </h2>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Privacy Notice:</strong> Your submission is completely anonymous. No personal information is collected. All data is stored locally on your device.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Resource Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="Name of the resource"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.url ? 'border-red-500' : 'border-gray-300'}`}
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="https://example.com"
              />
              {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SharedResource['category'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
              >
                <option value="privacy-tools">Privacy Tools</option>
                <option value="educational-content">Educational Content</option>
                <option value="parent-guides">Parent Guides</option>
                <option value="conversation-starters">Conversation Starters</option>
                <option value="privacy-settings">Privacy Settings</option>
                <option value="family-agreements">Family Agreements</option>
                <option value="apps-services">Apps & Services</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="Brief description of the resource and why it's useful for privacy education"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Tags (optional, comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="e.g., password, privacy, tools"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
              >
                Submit Resource
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceSharing;

