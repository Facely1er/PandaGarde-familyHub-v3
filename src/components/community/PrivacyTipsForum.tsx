import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Plus, Search, ArrowRight, Heart, CheckCircle, User, Users, Shield, Lock, GraduationCap, Briefcase, UserCircle, X, ArrowLeft } from 'lucide-react';
import { communityStorage, ForumTopic, ForumPost, ForumUser } from '../../utils/communityStorageManager';

interface PrivacyTipsForumProps {
  compact?: boolean;
}

// Avatar mapping helper
const getAvatarIcon = (avatarId: string | undefined) => {
  const avatarMap: Record<string, React.ComponentType<any>> = {
    'user': User,
    'shield': Shield,
    'lock': Lock,
    'graduation': GraduationCap,
    'briefcase': Briefcase,
    'usercircle': UserCircle
  };
  const IconComponent = avatarMap[avatarId || 'user'] || User;
  return IconComponent;
};

const PrivacyTipsForum: React.FC<PrivacyTipsForumProps> = ({ compact = false }) => {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<ForumTopic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [currentUser, setCurrentUser] = useState<ForumUser | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const categories: Array<{ value: string; label: string }> = [
    { value: 'all', label: 'All Topics' },
    { value: 'privacy-tips', label: 'Privacy Tips' },
    { value: 'conversation-starters', label: 'Conversation Starters' },
    { value: 'digital-footprint', label: 'Digital Footprint' },
    { value: 'password-safety', label: 'Password Safety' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'privacy-tools', label: 'Privacy Tools' },
    { value: 'family-agreement', label: 'Family Agreement' },
    { value: 'general-questions', label: 'General Questions' }
  ];

  useEffect(() => {
    loadCurrentUser();
    loadTopics();
    // Check if banner was dismissed
    const bannerDismissed = localStorage.getItem('privacy-tips-forum-banner-dismissed');
    if (bannerDismissed === 'true') {
      setShowBanner(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      loadPosts(selectedTopic.id);
    }
  }, [selectedTopic]);

  useEffect(() => {
    filterTopics();
  }, [topics, selectedCategory, searchQuery]);

  const loadCurrentUser = () => {
    const user = communityStorage.getCurrentForumUser();
    setCurrentUser(user);
    // Don't force the modal - let users browse first
  };

  const loadTopics = () => {
    const allTopics = communityStorage.getAllTopics();
    const topicsList = Object.values(allTopics)
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    setTopics(topicsList);
  };

  const loadPosts = (topicId: string) => {
    const topicPosts = communityStorage.getPostsForTopic(topicId);
    setPosts(topicPosts);
  };

  const filterTopics = () => {
    let filtered = [...topics];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(topic =>
        topic.title.toLowerCase().includes(query) ||
        topic.description?.toLowerCase().includes(query)
      );
    }

    setFilteredTopics(filtered);
  };

  const handleCreateUser = (username: string, displayName?: string, avatar?: string) => {
    const user = communityStorage.createForumUser(username, displayName, avatar);
    communityStorage.setCurrentForumUser(user.id);
    setCurrentUser(user);
    setShowUserForm(false);
  };

  const handleCreateTopic = (data: {
    title: string;
    category: ForumTopic['category'];
    description?: string;
  }) => {
    if (!currentUser) {return;}
    const topic = communityStorage.createTopic({
      ...data,
      authorId: currentUser.id
    });
    loadTopics();
    setShowTopicForm(false);
    setSelectedTopic(topic);
  };

  const handleCreatePost = (content: string) => {
    if (!currentUser || !selectedTopic) {return;}
    communityStorage.createPost({
      topicId: selectedTopic.id,
      authorId: currentUser.id,
      content
    });
    loadPosts(selectedTopic.id);
    loadTopics();
    setShowPostForm(false);
  };

  const handleVotePost = (postId: string) => {
    communityStorage.votePost(postId, 'up');
    if (selectedTopic) {
      loadPosts(selectedTopic.id);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('privacy-tips-forum-banner-dismissed', 'true');
  };

  if (compact) {
    const recentTopics = filteredTopics.slice(0, 5);
    return (
      <div className="bg-white rounded-lg p-4 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <MessageCircle size={20} />
            Privacy Tips Forum
          </h3>
          <button
            onClick={() => {
              if (currentUser) {
                setShowTopicForm(true);
              } else {
                setShowUserForm(true);
              }
            }}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            <Plus size={14} />
            New Topic
          </button>
        </div>
        <div className="space-y-3">
          {recentTopics.map(topic => {
            const author = communityStorage.getForumUser(topic.authorId);
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="border-b border-gray-200 pb-3 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <h4 className="font-medium mb-1" style={{ color: 'var(--primary)' }}>{topic.title}</h4>
                <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--gray-600)' }}>
                  {topic.description || 'No description'}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {author?.username || 'Anonymous'}
                  </span>
                  <span>{topic.postCount} posts</span>
                </div>
              </div>
            );
          })}
        </div>
        {showUserForm && (
          <UserRegistrationForm
            onSubmit={handleCreateUser}
            onCancel={() => setShowUserForm(false)}
          />
        )}
        {showTopicForm && currentUser && (
          <TopicCreationForm
            onSubmit={handleCreateTopic}
            onCancel={() => setShowTopicForm(false)}
          />
        )}
      </div>
    );
  }

  // Don't return early - show forum content even when not logged in (read-only mode)

  if (selectedTopic) {
    return (
      <TopicDetailView
        topic={selectedTopic}
        posts={posts}
        currentUser={currentUser}
        onBack={() => setSelectedTopic(null)}
        onCreatePost={handleCreatePost}
        onVotePost={handleVotePost}
        showPostForm={showPostForm}
        setShowPostForm={setShowPostForm}
      />
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Forum Description Section */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'left',
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginTop: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--primary)',
          marginBottom: '1rem'
        }}>
          What is the Privacy Tips Forum?
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'var(--gray-600)',
          lineHeight: '1.7',
          marginBottom: '1.5rem'
        }}>
          A community-driven space where parents, educators, and families come together to share knowledge, 
          ask questions, and support each other in teaching children about digital privacy and online safety.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div style={{ padding: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary-light) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <MessageCircle size={24} style={{ color: 'white' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
              Share Tips & Strategies
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: '1.6' }}>
              Exchange practical advice on teaching privacy concepts, managing screen time, and protecting your family's digital footprint.
            </p>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary-light) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Users size={24} style={{ color: 'white' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
              Ask Questions
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: '1.6' }}>
              Get answers from experienced parents and educators about age-appropriate privacy education, app safety, and digital citizenship.
            </p>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary-light) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Shield size={24} style={{ color: 'white' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
              Privacy First
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: '1.6' }}>
              All data is stored locally on your device. No backend required. Use pseudonymous usernames. Completely anonymous and secure.
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: '8px',
          border: '1px solid #86efac'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '0.75rem' }}>
            Topics You Can Explore:
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.filter(c => c.value !== 'all').map((category) => (
              <span
                key={category.value}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: 'white',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  color: '#166534',
                  border: '1px solid #86efac'
                }}
              >
                {category.label}
              </span>
            ))}
          </div>
        </div>

        {!currentUser && (
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
          background: 'var(--gradient-primary)',
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1rem', marginBottom: '1rem', opacity: 0.95 }}>
              <strong>Ready to join the conversation?</strong> Browse topics below or sign up to start sharing your own tips and questions.
            </p>
            <button
              onClick={() => setShowUserForm(true)}
              style={{
                padding: '0.75rem 2rem',
                background: 'white',
                color: 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Join Forum
            </button>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)', marginTop: '2rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem) 1.5rem' }}>
          {/* Join Banner - Closable */}
          {showBanner && currentUser && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6" style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '2px solid #86efac'
            }}>
              <button
                onClick={handleDismissBanner}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#16a34a',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  opacity: 0.7
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(22, 163, 74, 0.1)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.opacity = '0.7';
                }}
                aria-label="Dismiss banner"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white flex-shrink-0">
                  {React.createElement(getAvatarIcon(currentUser?.avatar), { size: 20 })}
                </div>
                <div style={{ flex: 1 }}>
                  <p className="font-semibold mb-1" style={{ color: 'var(--primary)', fontSize: '1rem' }}>
                    Welcome, {currentUser?.displayName || currentUser?.username || 'User'}!
                  </p>
                  <p className="text-sm" style={{ color: '#166534', lineHeight: '1.5' }}>
                    <strong>Privacy First:</strong> Your username is pseudonymous. All data is stored locally on your device. No backend required, completely anonymous.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: '700',
                  color: 'var(--gray-800)',
                  marginBottom: '0.5rem'
                }}>
                  Community Discussions
                </h2>
                <p style={{ color: 'var(--gray-600)', fontSize: '1rem' }}>
                  Join conversations and share your privacy tips
                </p>
              </div>
              {currentUser ? (
                <button
                  onClick={() => setShowTopicForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Plus size={20} />
                  New Topic
                </button>
              ) : (
                <button
                  onClick={() => setShowUserForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Users size={20} />
                  Join Forum
                </button>
              )}
            </div>
          </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-6" style={{ backgroundColor: 'var(--card-color)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search topics..."
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
          </div>
        </div>

        {/* Topics List */}
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No topics found. Start a new discussion!</p>
            {currentUser ? (
              <button
                onClick={() => setShowTopicForm(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Create First Topic
              </button>
            ) : (
              <button
                onClick={() => setShowUserForm(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Join Forum to Start Discussion
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map(topic => {
              const author = communityStorage.getForumUser(topic.authorId);
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  style={{ backgroundColor: 'var(--card-color)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                          {topic.title}
                        </h3>
                        {topic.pinned && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Pinned</span>}
                      </div>
                      {topic.description && (
                        <p className="mb-3" style={{ color: 'var(--gray-600)' }}>
                          {topic.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {topic.category.replace('-', ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {author?.username || 'Anonymous'}
                        </span>
                        <span>{topic.postCount} posts</span>
                        <span>{new Date(topic.lastActivity).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

          {/* Topic Creation Form */}
          {showUserForm && (
            <UserRegistrationForm
              onSubmit={handleCreateUser}
              onCancel={() => setShowUserForm(false)}
              required={true}
            />
          )}
          {showTopicForm && currentUser && (
            <TopicCreationForm
              onSubmit={handleCreateTopic}
              onCancel={() => setShowTopicForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Topic Detail View Component
interface TopicDetailViewProps {
  topic: ForumTopic;
  posts: ForumPost[];
  currentUser: ForumUser;
  onBack: () => void;
  onCreatePost: (content: string) => void;
  onVotePost: (postId: string) => void;
  showPostForm: boolean;
  setShowPostForm: (show: boolean) => void;
}

const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  posts,
  currentUser: _currentUser,
  onBack,
  onCreatePost,
  onVotePost,
  showPostForm,
  setShowPostForm
}) => {
  const [postContent, setPostContent] = useState('');

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim()) {
      onCreatePost(postContent.trim());
      setPostContent('');
    }
  };

  const author = communityStorage.getForumUser(topic.authorId);

  return (
    <main id="main-content" style={{ minHeight: '100vh' }}>
      {/* Back Navigation */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          style={{ textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
        >
          <ArrowLeft size={16} />
          Back to Forum
        </button>
      </div>

      {/* Page Header */}
      <section style={{ padding: 'clamp(3rem, 6vw, 4rem) 0', background: 'var(--gray-100)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '1rem',
            color: 'var(--gray-800)'
          }}>
            {topic.title}
          </h1>
          {topic.description && (
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--gray-600)',
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              {topic.description}
            </p>
          )}
        </div>
      </section>

      {/* Topic Content */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Topic Header */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6" style={{ backgroundColor: 'var(--card-color)' }}>
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
            {topic.title}
          </h2>
          {topic.description && (
            <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
              {topic.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              {topic.category.replace('-', ' ')}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} />
              {author?.username || 'Anonymous'}
            </span>
            <span>{topic.postCount} posts</span>
            <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4 mb-6">
          {posts.map(post => {
            const postAuthor = communityStorage.getForumUser(post.authorId);
            return (
              <div
                key={post.id}
                className="bg-white rounded-lg p-6 shadow-md"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white flex-shrink-0">
                    {React.createElement(getAvatarIcon(postAuthor?.avatar), { size: 20 })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                        {postAuthor?.displayName || postAuthor?.username || 'Anonymous'}
                      </span>
                      {post.isSolution && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded flex items-center gap-1">
                          <CheckCircle size={12} />
                          Solution
                        </span>
                      )}
                      {post.edited && (
                        <span className="text-xs text-gray-500">(edited)</span>
                      )}
                    </div>
                    <p className="mb-3 whitespace-pre-wrap" style={{ color: 'var(--gray-700)' }}>
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button
                        onClick={() => onVotePost(post.id)}
                        className="flex items-center gap-1 hover:text-green-600"
                      >
                        <Heart size={16} />
                        {post.upvotes}
                      </button>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Form */}
        {showPostForm ? (
          <div className="bg-white rounded-lg p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
            <form onSubmit={handleSubmitPost}>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="Write your reply..."
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Post Reply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPostForm(false);
                    setPostContent('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => {
              if (currentUser) {
                setShowPostForm(true);
              } else {
                setShowUserForm(true);
              }
            }}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Reply to Topic
          </button>
        )}
        </div>
      </section>
    </main>
  );
};

// User Registration Form
interface UserRegistrationFormProps {
  onSubmit: (username: string, displayName?: string, avatar?: string) => void;
  onCancel: () => void;
  required?: boolean;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ onSubmit, onCancel, required = false }) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('user');
  const [error, setError] = useState('');

  const avatars = [
    { id: 'user', icon: User, label: 'User' },
    { id: 'shield', icon: Shield, label: 'Shield' },
    { id: 'lock', icon: Lock, label: 'Lock' },
    { id: 'graduation', icon: GraduationCap, label: 'Graduation' },
    { id: 'briefcase', icon: Briefcase, label: 'Briefcase' },
    { id: 'usercircle', icon: UserCircle, label: 'User Circle' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    // Check if username exists
    const users = communityStorage.getAllForumUsers();
    const exists = Object.values(users).some(u => u.username === username);
    if (exists) {
      setError('Username already taken');
      return;
    }
    onSubmit(username.trim(), displayName.trim() || undefined, avatar);
  };

  return (
    <div className={`${required ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      <div className={`${required ? 'flex min-h-screen items-center justify-center p-4' : ''}`}>
        {required && <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />}
        <div className={`relative bg-white rounded-lg shadow-xl ${required ? 'max-w-md w-full' : 'w-full'} p-6`} style={{ backgroundColor: 'var(--card-color)' }}>
          {required && (
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          )}
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            Join Privacy Tips Forum
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Privacy First:</strong> Use a pseudonym (not your real name). All data is stored locally on your device.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Username (Pseudonym) *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="Choose a pseudonym"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="Optional display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Avatar
              </label>
              <div className="flex gap-2 flex-wrap">
                {avatars.map(av => {
                  const IconComponent = av.icon;
                  return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatar(av.id)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${avatar === av.id ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
                    title={av.label}
                  >
                    <IconComponent size={24} className={avatar === av.id ? 'text-green-600' : 'text-gray-600'} />
                  </button>
                );
                })}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
              >
                Join Forum
              </button>
              {!required && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Topic Creation Form
interface TopicCreationFormProps {
  onSubmit: (data: { title: string; category: ForumTopic['category']; description?: string }) => void;
  onCancel: () => void;
}

const TopicCreationForm: React.FC<TopicCreationFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ForumTopic['category']>('general-questions');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        category,
        ...(description.trim() ? { description: description.trim() } : {})
      });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6" style={{ backgroundColor: 'var(--card-color)' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            Create New Topic
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Topic Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="What's your topic about?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ForumTopic['category'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
              >
                <option value="privacy-tips">Privacy Tips</option>
                <option value="conversation-starters">Conversation Starters</option>
                <option value="digital-footprint">Digital Footprint</option>
                <option value="password-safety">Password Safety</option>
                <option value="social-media">Social Media</option>
                <option value="privacy-tools">Privacy Tools</option>
                <option value="family-agreement">Family Agreement</option>
                <option value="general-questions">General Questions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                placeholder="Add more details about your topic..."
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
              >
                Create Topic
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

export default PrivacyTipsForum;

