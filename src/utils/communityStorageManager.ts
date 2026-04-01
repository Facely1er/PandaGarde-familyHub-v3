/**
 * Community Storage Manager
 * Privacy-first localStorage-based storage for community features
 * All data stored locally on user's device - no backend required
 */

export interface SuccessStory {
  id: string;
  title: string;
  story: string;
  category: 'conversation-starter' | 'activity-success' | 'privacy-tool' | 'family-agreement' | 'password-safety' | 'digital-footprint' | 'social-media' | 'general';
  tags: string[];
  createdAt: string;
  votes: number;
  views: number;
  status: 'draft' | 'published' | 'deleted';
  // Privacy: Completely anonymous - no user identification
}

export interface ForumUser {
  id: string;
  username: string; // Pseudonym only
  displayName?: string; // Optional, not real name
  avatar: string; // Generic avatar (emoji or preset)
  createdAt: string;
  // Privacy: Minimal data - no email, real name, location
}

export interface ForumTopic {
  id: string;
  title: string;
  category: 'privacy-tips' | 'conversation-starters' | 'digital-footprint' | 'password-safety' | 'social-media' | 'privacy-tools' | 'family-agreement' | 'general-questions';
  description?: string;
  authorId: string; // Reference to ForumUser
  createdAt: string;
  lastActivity: string;
  postCount: number;
  pinned: boolean;
  locked: boolean;
}

export interface ForumPost {
  id: string;
  topicId: string;
  authorId: string; // Reference to ForumUser
  content: string;
  createdAt: string;
  editedAt?: string;
  edited: boolean;
  upvotes: number;
  isSolution: boolean;
}

export interface SharedResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'privacy-tools' | 'educational-content' | 'parent-guides' | 'conversation-starters' | 'privacy-settings' | 'family-agreements' | 'apps-services' | 'general';
  tags: string[];
  createdAt: string;
  upvotes: number;
  views: number;
  saves: number;
  featured: boolean;
  verified: boolean;
  status: 'draft' | 'published' | 'deleted';
  // Privacy: Anonymous submission - no user identification
}

export class CommunityStorageManager {
  private static readonly STORIES_KEY = 'pandagarde_community_stories';
  private static readonly FORUM_USERS_KEY = 'pandagarde_forum_users';
  private static readonly FORUM_TOPICS_KEY = 'pandagarde_forum_topics';
  private static readonly FORUM_POSTS_KEY = 'pandagarde_forum_posts';
  private static readonly RESOURCES_KEY = 'pandagarde_shared_resources';
  private static readonly USER_PREFERENCES_KEY = 'pandagarde_community_prefs';

  // ==================== Success Stories ====================

  /**
   * Save a success story (localStorage only)
   */
  saveStory(story: Omit<SuccessStory, 'id' | 'createdAt' | 'votes' | 'views' | 'status'>): SuccessStory {
    const stories = this.getAllStories();
    const newStory: SuccessStory = {
      ...story,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      votes: 0,
      views: 0,
      status: 'published' // Auto-publish for localStorage (no moderation needed)
    };
    stories[newStory.id] = newStory;
    this.setStories(stories);
    return newStory;
  }

  /**
   * Get all published stories
   */
  getAllStories(): Record<string, SuccessStory> {
    try {
      const data = localStorage.getItem(CommunityStorageManager.STORIES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Get story by ID
   */
  getStory(id: string): SuccessStory | null {
    const stories = this.getAllStories();
    return stories[id] || null;
  }

  /**
   * Vote on a story
   */
  voteStory(storyId: string, vote: 'up' | 'down'): void {
    const stories = this.getAllStories();
    const story = stories[storyId];
    if (story) {
      if (vote === 'up') {
        story.votes += 1;
      } else {
        story.votes = Math.max(0, story.votes - 1);
      }
      this.setStories(stories);
    }
  }

  /**
   * Increment story views
   */
  incrementStoryViews(storyId: string): void {
    const stories = this.getAllStories();
    const story = stories[storyId];
    if (story) {
      story.views += 1;
      this.setStories(stories);
    }
  }

  /**
   * Delete a story (user's own story)
   */
  deleteStory(storyId: string): void {
    const stories = this.getAllStories();
    if (stories[storyId]) {
      stories[storyId].status = 'deleted';
      this.setStories(stories);
    }
  }

  private setStories(stories: Record<string, SuccessStory>): void {
    localStorage.setItem(CommunityStorageManager.STORIES_KEY, JSON.stringify(stories));
  }

  // ==================== Forum Users ====================

  /**
   * Create or get forum user (pseudonymous)
   */
  createForumUser(username: string, displayName?: string, avatar?: string): ForumUser {
    const users = this.getAllForumUsers();
    
    // Check if username exists
    const existingUser = Object.values(users).find(u => u.username === username);
    if (existingUser) {
      return existingUser;
    }

    const newUser: ForumUser = {
      id: this.generateId(),
      username,
      displayName,
      avatar: avatar || '👤',
      createdAt: new Date().toISOString()
    };
    
    users[newUser.id] = newUser;
    this.setForumUsers(users);
    return newUser;
  }

  /**
   * Get all forum users
   */
  getAllForumUsers(): Record<string, ForumUser> {
    try {
      const data = localStorage.getItem(CommunityStorageManager.FORUM_USERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Get forum user by ID
   */
  getForumUser(userId: string): ForumUser | null {
    const users = this.getAllForumUsers();
    return users[userId] || null;
  }

  /**
   * Get current user (from preferences)
   */
  getCurrentForumUser(): ForumUser | null {
    const prefs = this.getUserPreferences();
    if (prefs.currentUserId) {
      return this.getForumUser(prefs.currentUserId);
    }
    return null;
  }

  /**
   * Set current user
   */
  setCurrentForumUser(userId: string): void {
    const prefs = this.getUserPreferences();
    prefs.currentUserId = userId;
    this.setUserPreferences(prefs);
  }

  private setForumUsers(users: Record<string, ForumUser>): void {
    localStorage.setItem(CommunityStorageManager.FORUM_USERS_KEY, JSON.stringify(users));
  }

  // ==================== Forum Topics ====================

  /**
   * Create a forum topic
   */
  createTopic(topic: Omit<ForumTopic, 'id' | 'createdAt' | 'lastActivity' | 'postCount' | 'pinned' | 'locked'>): ForumTopic {
    const topics = this.getAllTopics();
    const newTopic: ForumTopic = {
      ...topic,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      postCount: 0,
      pinned: false,
      locked: false
    };
    topics[newTopic.id] = newTopic;
    this.setTopics(topics);
    return newTopic;
  }

  /**
   * Get all topics
   */
  getAllTopics(): Record<string, ForumTopic> {
    try {
      const data = localStorage.getItem(CommunityStorageManager.FORUM_TOPICS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Get topic by ID
   */
  getTopic(topicId: string): ForumTopic | null {
    const topics = this.getAllTopics();
    return topics[topicId] || null;
  }

  /**
   * Update topic
   */
  updateTopic(topicId: string, updates: Partial<ForumTopic>): void {
    const topics = this.getAllTopics();
    if (topics[topicId]) {
      topics[topicId] = { ...topics[topicId], ...updates };
      this.setTopics(topics);
    }
  }

  private setTopics(topics: Record<string, ForumTopic>): void {
    localStorage.setItem(CommunityStorageManager.FORUM_TOPICS_KEY, JSON.stringify(topics));
  }

  // ==================== Forum Posts ====================

  /**
   * Create a forum post
   */
  createPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'edited' | 'upvotes' | 'isSolution'>): ForumPost {
    const posts = this.getAllPosts();
    const newPost: ForumPost = {
      ...post,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      edited: false,
      upvotes: 0,
      isSolution: false
    };
    posts[newPost.id] = newPost;
    this.setPosts(posts);

    // Update topic post count and last activity
    const topics = this.getAllTopics();
    const topic = topics[post.topicId];
    if (topic) {
      topic.postCount += 1;
      topic.lastActivity = new Date().toISOString();
      this.setTopics(topics);
    }

    return newPost;
  }

  /**
   * Get all posts
   */
  getAllPosts(): Record<string, ForumPost> {
    try {
      const data = localStorage.getItem(CommunityStorageManager.FORUM_POSTS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Get posts for a topic
   */
  getPostsForTopic(topicId: string): ForumPost[] {
    const posts = this.getAllPosts();
    return Object.values(posts)
      .filter(post => post.topicId === topicId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  /**
   * Update post
   */
  updatePost(postId: string, updates: Partial<ForumPost>): void {
    const posts = this.getAllPosts();
    if (posts[postId]) {
      posts[postId] = { ...posts[postId], ...updates, edited: true, editedAt: new Date().toISOString() };
      this.setPosts(posts);
    }
  }

  /**
   * Delete post
   */
  deletePost(postId: string): void {
    const posts = this.getAllPosts();
    if (posts[postId]) {
      delete posts[postId];
      this.setPosts(posts);

      // Update topic post count
      const topicId = posts[postId]?.topicId;
      if (topicId) {
        const topics = this.getAllTopics();
        const topic = topics[topicId];
        if (topic) {
          topic.postCount = Math.max(0, topic.postCount - 1);
          this.setTopics(topics);
        }
      }
    }
  }

  /**
   * Vote on a post
   */
  votePost(postId: string, vote: 'up' | 'down'): void {
    const posts = this.getAllPosts();
    const post = posts[postId];
    if (post) {
      if (vote === 'up') {
        post.upvotes += 1;
      } else {
        post.upvotes = Math.max(0, post.upvotes - 1);
      }
      this.setPosts(posts);
    }
  }

  private setPosts(posts: Record<string, ForumPost>): void {
    localStorage.setItem(CommunityStorageManager.FORUM_POSTS_KEY, JSON.stringify(posts));
  }

  // ==================== Shared Resources ====================

  /**
   * Save a shared resource
   */
  saveResource(resource: Omit<SharedResource, 'id' | 'createdAt' | 'upvotes' | 'views' | 'saves' | 'featured' | 'verified' | 'status'>): SharedResource {
    const resources = this.getAllResources();
    const newResource: SharedResource = {
      ...resource,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      views: 0,
      saves: 0,
      featured: false,
      verified: false,
      status: 'published' // Auto-publish for localStorage
    };
    resources[newResource.id] = newResource;
    this.setResources(resources);
    return newResource;
  }

  /**
   * Get all resources
   */
  getAllResources(): Record<string, SharedResource> {
    try {
      const data = localStorage.getItem(CommunityStorageManager.RESOURCES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Get resource by ID
   */
  getResource(id: string): SharedResource | null {
    const resources = this.getAllResources();
    return resources[id] || null;
  }

  /**
   * Vote on a resource
   */
  voteResource(resourceId: string, vote: 'up' | 'down'): void {
    const resources = this.getAllResources();
    const resource = resources[resourceId];
    if (resource) {
      if (vote === 'up') {
        resource.upvotes += 1;
      } else {
        resource.upvotes = Math.max(0, resource.upvotes - 1);
      }
      this.setResources(resources);
    }
  }

  /**
   * Increment resource views
   */
  incrementResourceViews(resourceId: string): void {
    const resources = this.getAllResources();
    const resource = resources[resourceId];
    if (resource) {
      resource.views += 1;
      this.setResources(resources);
    }
  }

  /**
   * Save resource to personal list
   */
  saveResourceToPersonalList(resourceId: string): void {
    const prefs = this.getUserPreferences();
    if (!prefs.savedResources) {
      prefs.savedResources = [];
    }
    if (!prefs.savedResources.includes(resourceId)) {
      prefs.savedResources.push(resourceId);
      this.setUserPreferences(prefs);

      // Increment save count
      const resources = this.getAllResources();
      const resource = resources[resourceId];
      if (resource) {
        resource.saves += 1;
        this.setResources(resources);
      }
    }
  }

  /**
   * Get saved resources
   */
  getSavedResources(): SharedResource[] {
    const prefs = this.getUserPreferences();
    const savedIds = prefs.savedResources || [];
    const resources = this.getAllResources();
    return savedIds
      .map(id => resources[id])
      .filter((r): r is SharedResource => r !== undefined && r.status === 'published');
  }

  /**
   * Delete resource
   */
  deleteResource(resourceId: string): void {
    const resources = this.getAllResources();
    if (resources[resourceId]) {
      resources[resourceId].status = 'deleted';
      this.setResources(resources);
    }
  }

  private setResources(resources: Record<string, SharedResource>): void {
    localStorage.setItem(CommunityStorageManager.RESOURCES_KEY, JSON.stringify(resources));
  }

  // ==================== User Preferences ====================

  /**
   * Get user preferences (stored locally)
   */
  getUserPreferences(): {
    currentUserId?: string;
    savedResources?: string[];
    favoriteCategories?: string[];
    hiddenResources?: string[];
  } {
    try {
      const data = localStorage.getItem(CommunityStorageManager.USER_PREFERENCES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Set user preferences
   */
  setUserPreferences(prefs: {
    currentUserId?: string;
    savedResources?: string[];
    favoriteCategories?: string[];
    hiddenResources?: string[];
  }): void {
    localStorage.setItem(CommunityStorageManager.USER_PREFERENCES_KEY, JSON.stringify(prefs));
  }

  // ==================== Utility Methods ====================

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `community_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all community data (privacy feature)
   */
  clearAllData(): void {
    localStorage.removeItem(CommunityStorageManager.STORIES_KEY);
    localStorage.removeItem(CommunityStorageManager.FORUM_USERS_KEY);
    localStorage.removeItem(CommunityStorageManager.FORUM_TOPICS_KEY);
    localStorage.removeItem(CommunityStorageManager.FORUM_POSTS_KEY);
    localStorage.removeItem(CommunityStorageManager.RESOURCES_KEY);
    localStorage.removeItem(CommunityStorageManager.USER_PREFERENCES_KEY);
  }

  /**
   * Export all community data (for user backup)
   */
  exportAllData(): string {
    return JSON.stringify({
      stories: this.getAllStories(),
      forumUsers: this.getAllForumUsers(),
      topics: this.getAllTopics(),
      posts: this.getAllPosts(),
      resources: this.getAllResources(),
      preferences: this.getUserPreferences(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Import community data (for user restore)
   */
  importData(data: string): void {
    try {
      const imported = JSON.parse(data);
      if (imported.stories) {this.setStories(imported.stories);}
      if (imported.forumUsers) {this.setForumUsers(imported.forumUsers);}
      if (imported.topics) {this.setTopics(imported.topics);}
      if (imported.posts) {this.setPosts(imported.posts);}
      if (imported.resources) {this.setResources(imported.resources);}
      if (imported.preferences) {this.setUserPreferences(imported.preferences);}
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }
}

// Export singleton instance
export const communityStorage = new CommunityStorageManager();

