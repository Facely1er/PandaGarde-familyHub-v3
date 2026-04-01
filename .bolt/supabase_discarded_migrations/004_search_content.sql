-- Migration: Search content management system
-- Adds tables for dynamic search content instead of hardcoded data

-- Search content categories
CREATE TABLE IF NOT EXISTS pandagarde_search_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search content items
CREATE TABLE IF NOT EXISTS pandagarde_search_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('page', 'activity', 'resource', 'guide')),
    url VARCHAR(500) NOT NULL,
    category_id UUID REFERENCES pandagarde_search_categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search analytics for tracking popular searches
CREATE TABLE IF NOT EXISTS pandagarde_search_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    search_query VARCHAR(255) NOT NULL,
    results_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES pandagarde_users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    filters_applied JSONB DEFAULT '{}'::jsonb,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search suggestions for autocomplete
CREATE TABLE IF NOT EXISTS pandagarde_search_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suggestion VARCHAR(255) NOT NULL,
    suggestion_type VARCHAR(50) NOT NULL CHECK (suggestion_type IN ('popular', 'recent', 'recommended')),
    usage_count INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_categories_name ON pandagarde_search_categories(name);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_categories_active ON pandagarde_search_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_content_type ON pandagarde_search_content(content_type);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_content_category ON pandagarde_search_content(category_id);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_content_active ON pandagarde_search_content(is_active);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_content_tags ON pandagarde_search_content USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_analytics_query ON pandagarde_search_analytics(search_query);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_analytics_user ON pandagarde_search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_analytics_date ON pandagarde_search_analytics(searched_at);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_suggestions_type ON pandagarde_search_suggestions(suggestion_type);
CREATE INDEX IF NOT EXISTS idx_pandagarde_search_suggestions_active ON pandagarde_search_suggestions(is_active);

-- Add updated_at triggers
CREATE TRIGGER update_pandagarde_search_categories_updated_at 
    BEFORE UPDATE ON pandagarde_search_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pandagarde_search_content_updated_at 
    BEFORE UPDATE ON pandagarde_search_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pandagarde_search_suggestions_updated_at 
    BEFORE UPDATE ON pandagarde_search_suggestions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE pandagarde_search_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pandagarde_search_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pandagarde_search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pandagarde_search_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for search content (public read access)
CREATE POLICY "Anyone can view active search categories" ON pandagarde_search_categories
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view active search content" ON pandagarde_search_content
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view search suggestions" ON pandagarde_search_suggestions
    FOR SELECT USING (is_active = TRUE);

-- Analytics policies (authenticated users can insert their own analytics)
CREATE POLICY "Authenticated users can insert search analytics" ON pandagarde_search_analytics
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own search analytics" ON pandagarde_search_analytics
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

-- Insert initial search categories
INSERT INTO pandagarde_search_categories (name, display_name, description, sort_order) VALUES
('pages', 'Pages', 'Main application pages and sections', 1),
('age-groups', 'Age Groups', 'Content organized by age ranges', 2),
('resources', 'Resources', 'Downloadable materials and tools', 3),
('guides', 'Guides', 'Step-by-step guides and tutorials', 4),
('activities', 'Activities', 'Interactive learning activities', 5)
ON CONFLICT (name) DO NOTHING;

-- Insert initial search content (migrating from hardcoded data)
INSERT INTO pandagarde_search_content (title, description, content_type, url, category_id, tags, sort_order) VALUES
-- Pages
('Home', 'Welcome to PandaGarde - Your family privacy education platform', 'page', '/', (SELECT id FROM pandagarde_search_categories WHERE name = 'pages'), ARRAY['home', 'welcome', 'privacy', 'education'], 1),
('Activity Book', 'Interactive activities teaching privacy fundamentals', 'activity', '/activity-book', (SELECT id FROM pandagarde_search_categories WHERE name = 'activities'), ARRAY['activities', 'interactive', 'learning', 'privacy', 'fundamentals'], 2),
('Digital Bamboo Forest Story', 'Follow Privacy Panda''s adventure learning about digital safety', 'page', '/story', (SELECT id FROM pandagarde_search_categories WHERE name = 'pages'), ARRAY['story', 'privacy panda', 'adventure', 'digital safety', 'children'], 3),
('Family Hub', 'Your central dashboard for family privacy education and progress tracking', 'page', '/family-hub', (SELECT id FROM pandagarde_search_categories WHERE name = 'pages'), ARRAY['family', 'dashboard', 'progress', 'tracking', 'hub'], 4),
('About', 'Learn about PandaGarde and our mission to educate families about privacy', 'page', '/about', (SELECT id FROM pandagarde_search_categories WHERE name = 'pages'), ARRAY['about', 'mission', 'privacy', 'education', 'family'], 5),

-- Age Groups
('Privacy Explorers (Ages 5-8)', 'Age-appropriate privacy education for young children', 'page', '/privacy-explorers', (SELECT id FROM pandagarde_search_categories WHERE name = 'age-groups'), ARRAY['ages 5-8', 'young children', 'privacy', 'explorers', 'basic'], 1),
('Privacy Handbook (Ages 9-12)', 'Comprehensive privacy guide for elementary school children', 'page', '/privacy-handbook', (SELECT id FROM pandagarde_search_categories WHERE name = 'age-groups'), ARRAY['ages 9-12', 'elementary', 'handbook', 'privacy', 'comprehensive'], 2),
('Digital Citizenship (Ages 9-12)', 'Learn about responsible digital citizenship and online behavior', 'page', '/digital-citizenship', (SELECT id FROM pandagarde_search_categories WHERE name = 'age-groups'), ARRAY['ages 9-12', 'digital citizenship', 'online behavior', 'responsible'], 3),
('Teen Privacy Handbook (Ages 13-17)', 'Advanced privacy education for teenagers', 'page', '/teen-handbook', (SELECT id FROM pandagarde_search_categories WHERE name = 'age-groups'), ARRAY['ages 13-17', 'teenagers', 'advanced', 'privacy', 'handbook'], 4),
('Privacy Tools (Ages 13-17)', 'Practical tools and settings for protecting your privacy', 'page', '/privacy-tools', (SELECT id FROM pandagarde_search_categories WHERE name = 'age-groups'), ARRAY['ages 13-17', 'tools', 'settings', 'privacy protection', 'practical'], 5),
('Digital Rights (Ages 13-17)', 'Understanding your digital rights and how to protect them', 'page', '/digital-rights', (SELECT id FROM pandagarde_search_categories WHERE name = 'age-groups'), ARRAY['ages 13-17', 'digital rights', 'protection', 'understanding'], 6),

-- Resources
('Privacy Panda Coloring Sheets', 'Downloadable coloring pages featuring Privacy Panda and privacy concepts', 'resource', '/downloads/coloring-sheets', (SELECT id FROM pandagarde_search_categories WHERE name = 'resources'), ARRAY['coloring', 'download', 'privacy panda', 'printable', 'activities'], 1),
('Digital Safety Posters', 'Classroom-ready posters highlighting key privacy concepts', 'resource', '/downloads/safety-posters', (SELECT id FROM pandagarde_search_categories WHERE name = 'resources'), ARRAY['posters', 'download', 'classroom', 'safety', 'privacy concepts'], 2),
('Privacy Champion Certificates', 'Printable certificates to celebrate privacy education milestones', 'resource', '/downloads/certificates', (SELECT id FROM pandagarde_search_categories WHERE name = 'resources'), ARRAY['certificates', 'download', 'achievement', 'milestones', 'celebration'], 3),
('Family Internet Agreement', 'Customizable family guidelines for internet use', 'resource', '/downloads/family-agreement', (SELECT id FROM pandagarde_search_categories WHERE name = 'resources'), ARRAY['family agreement', 'download', 'guidelines', 'internet use', 'customizable'], 4),

-- Guides
('Child-Friendly Device Setup', 'Step-by-step guide for configuring devices with appropriate controls', 'guide', '/guides/device-setup', (SELECT id FROM pandagarde_search_categories WHERE name = 'guides'), ARRAY['device setup', 'guide', 'child-friendly', 'configuration', 'controls'], 1),
('Choosing Child-Safe Apps', 'Guidelines for selecting appropriate digital content for children', 'guide', '/guides/app-selection', (SELECT id FROM pandagarde_search_categories WHERE name = 'guides'), ARRAY['app selection', 'guide', 'child-safe', 'digital content', 'guidelines'], 2),
('Modeling Good Digital Citizenship', 'Tips for demonstrating healthy online behavior', 'guide', '/guides/modeling-behavior', (SELECT id FROM pandagarde_search_categories WHERE name = 'guides'), ARRAY['modeling', 'guide', 'digital citizenship', 'online behavior', 'tips'], 3),
('Responding to Privacy Concerns', 'What to do when privacy issues arise', 'guide', '/guides/privacy-concerns', (SELECT id FROM pandagarde_search_categories WHERE name = 'guides'), ARRAY['privacy concerns', 'guide', 'response', 'issues', 'help'], 4),

-- Activities
('Privacy Panda Coloring Activity', 'Interactive coloring activity teaching basic privacy concepts', 'activity', '/activity-book#coloring', (SELECT id FROM pandagarde_search_categories WHERE name = 'activities'), ARRAY['coloring', 'activity', 'privacy panda', 'interactive', 'basic concepts'], 1),
('Privacy Matching Game', 'Match privacy concepts with their meanings', 'activity', '/activity-book#matching', (SELECT id FROM pandagarde_search_categories WHERE name = 'activities'), ARRAY['matching', 'game', 'activity', 'privacy concepts', 'learning'], 2),
('Privacy Word Search', 'Find privacy-related words in this fun word search', 'activity', '/activity-book#word-search', (SELECT id FROM pandagarde_search_categories WHERE name = 'activities'), ARRAY['word search', 'activity', 'privacy words', 'fun', 'learning'], 3),
('Privacy Maze Adventure', 'Navigate through the maze while learning about privacy', 'activity', '/activity-book#maze', (SELECT id FROM pandagarde_search_categories WHERE name = 'activities'), ARRAY['maze', 'adventure', 'activity', 'privacy', 'navigation'], 4),
('Connect the Dots - Privacy Panda', 'Connect the dots to reveal Privacy Panda', 'activity', '/activity-book#connect-dots', (SELECT id FROM pandagarde_search_categories WHERE name = 'activities'), ARRAY['connect dots', 'activity', 'privacy panda', 'reveal', 'fun'], 5),
('Privacy Drag & Drop', 'Drag and drop items to learn about privacy settings', 'activity', '/activity-book#drag-drop', (SELECT id FROM pandagarde_search_categories WHERE name = 'activities'), ARRAY['drag drop', 'activity', 'privacy settings', 'interactive', 'learning'], 6)
ON CONFLICT DO NOTHING;

-- Insert initial search suggestions
INSERT INTO pandagarde_search_suggestions (suggestion, suggestion_type, usage_count) VALUES
('privacy', 'popular', 100),
('activities', 'popular', 85),
('coloring', 'popular', 70),
('family', 'popular', 65),
('safety', 'popular', 60),
('digital citizenship', 'popular', 55),
('privacy panda', 'popular', 50),
('guides', 'popular', 45),
('certificates', 'popular', 40),
('posters', 'popular', 35)
ON CONFLICT DO NOTHING;