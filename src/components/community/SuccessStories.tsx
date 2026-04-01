import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Plus, Search, Clock, Tag } from 'lucide-react';
import { communityStorage, SuccessStory } from '../../utils/communityStorageManager';

interface SuccessStoriesProps {
  compact?: boolean;
}

const SuccessStories: React.FC<SuccessStoriesProps> = ({ compact = false }) => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<SuccessStory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const categories: Array<{ value: string; label: string }> = [
    { value: 'all', label: 'All Stories' },
    { value: 'conversation-starter', label: 'Conversation Starters' },
    { value: 'activity-success', label: 'Activity Success' },
    { value: 'privacy-tool', label: 'Privacy Tools' },
    { value: 'family-agreement', label: 'Family Agreements' },
    { value: 'password-safety', label: 'Password Safety' },
    { value: 'digital-footprint', label: 'Digital Footprint' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'general', label: 'General' }
  ];

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    filterAndSortStories();
  }, [stories, selectedCategory, searchQuery, sortBy]);

  const loadStories = () => {
    const allStories = communityStorage.getAllStories();
    const publishedStories = Object.values(allStories)
      .filter(story => story.status === 'published')
      .map(story => {
        // Increment views when loaded
        communityStorage.incrementStoryViews(story.id);
        return { ...story, views: story.views + 1 };
      });
    setStories(publishedStories);
  };

  const filterAndSortStories = () => {
    let filtered = [...stories];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(story => story.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.story.toLowerCase().includes(query) ||
        story.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.votes - a.votes);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredStories(filtered);
  };

  const handleVote = (storyId: string) => {
    communityStorage.voteStory(storyId, 'up');
    loadStories();
  };

  const handleSubmit = (formData: {
    title: string;
    story: string;
    category: SuccessStory['category'];
    tags: string[];
  }) => {
    communityStorage.saveStory(formData);
    loadStories();
    setShowForm(false);
  };

  if (compact) {
    const featuredStories = filteredStories.slice(0, 3);
    return (
      <div className="bg-white rounded-lg p-4 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <Heart size={20} />
            Success Stories
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
          {featuredStories.map(story => (
            <div key={story.id} className="border-b border-gray-200 pb-3 last:border-0">
              <h4 className="font-medium mb-1" style={{ color: 'var(--primary)' }}>{story.title}</h4>
              <p className="text-sm line-clamp-2" style={{ color: 'var(--gray-600)' }}>
                {story.story.substring(0, 150)}...
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Heart size={12} />
                  {story.votes}
                </span>
                <span>{story.category}</span>
              </div>
            </div>
          ))}
        </div>
        {showForm && (
          <StorySubmissionForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <main id="main-content">
      {/* Back Navigation */}
      <div className="container py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="hero-simple">
        <div className="container">
          <div className="text-center fade-in">
            <span className="badge">COMMUNITY</span>
            <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Success Stories</p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-world examples of families teaching privacy to their children. Share your anonymous success story and inspire others.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-8">
        {/* Header Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                Success Stories
              </h2>
              <p className="text-lg" style={{ color: 'var(--gray-600)' }}>
                Real-world examples of families teaching privacy to their children
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Share Your Story
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 fade-in">
            <p className="text-sm text-green-800">
              <strong>Privacy First:</strong> All stories are completely anonymous. No personal information is collected or displayed. All data is stored locally on your device.
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
                placeholder="Search stories..."
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
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No stories found. Be the first to share your success story!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Share Your Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map(story => (
              <StoryCard
                key={story.id}
                story={story}
                onVote={handleVote}
              />
            ))}
          </div>
        )}

        {/* Submission Form Modal */}
        {showForm && (
          <StorySubmissionForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </section>
    </main>
  );
};

interface StoryCardProps {
  story: SuccessStory;
  onVote: (storyId: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onVote }) => {
  const [isVoted, setIsVoted] = useState(false);

  const handleVote = () => {
    if (!isVoted) {
      onVote(story.id);
      setIsVoted(true);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: 'var(--card-color)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
            {story.title}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              {story.category.replace('-', ' ')}
            </span>
            {story.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <p className="mb-4 line-clamp-4" style={{ color: 'var(--gray-600)' }}>
        {story.story}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <button
            onClick={handleVote}
            className={`flex items-center gap-1 ${isVoted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
          >
            <Heart size={16} fill={isVoted ? 'currentColor' : 'none'} />
            {story.votes}
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle size={16} />
            {story.views}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} />
            {new Date(story.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

interface StorySubmissionFormProps {
  onSubmit: (data: {
    title: string;
    story: string;
    category: SuccessStory['category'];
    tags: string[];
  }) => void;
  onCancel: () => void;
}

const StorySubmissionForm: React.FC<StorySubmissionFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [category, setCategory] = useState<SuccessStory['category']>('general');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {newErrors['title'] = 'Title is required';}
    if (title.length > 100) {newErrors['title'] = 'Title must be 100 characters or less';}
    if (!story.trim()) {newErrors['story'] = 'Story is required';}
    if (story.length > 2000) {newErrors['story'] = 'Story must be 2000 characters or less';}
    if (story.length < 50) {newErrors['story'] = 'Story must be at least 50 characters';}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        title: title.trim(),
        story: story.trim(),
        category,
        tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      });
      // Reset form
      setTitle('');
      setStory('');
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
            Share Your Success Story
          </h2>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Privacy Notice:</strong> Your story will be completely anonymous. No personal information will be collected or displayed. All data is stored locally on your device.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors['title'] ? 'border-red-500' : 'border-gray-300'}`}
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="A brief title for your story"
              />
              {errors['title'] && <p className="text-red-500 text-sm mt-1">{errors['title']}</p>}
              <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SuccessStory['category'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
              >
                <option value="conversation-starter">Conversation Starter</option>
                <option value="activity-success">Activity Success</option>
                <option value="privacy-tool">Privacy Tool</option>
                <option value="family-agreement">Family Agreement</option>
                <option value="password-safety">Password Safety</option>
                <option value="digital-footprint">Digital Footprint</option>
                <option value="social-media">Social Media</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Your Story *
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                maxLength={2000}
                rows={8}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors['story'] ? 'border-red-500' : 'border-gray-300'}`}
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="Share your success story about teaching privacy to your children. Remember: no personal information, names, or identifying details."
              />
              {errors['story'] && <p className="text-red-500 text-sm mt-1">{errors['story']}</p>}
              <p className="text-xs text-gray-500 mt-1">{story.length}/2000 characters (minimum 50)</p>
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
                placeholder="e.g., password, conversation, family"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
              >
                Submit Story
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

export default SuccessStories;

