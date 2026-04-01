import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search, 
  Globe, 
  ArrowRight, 
  Wrench, 
  Target, 
  Shield,
  Play,
  Download,
  Image,
  AlertTriangle,
  Rocket,
  Lightbulb,
  Network,
  ClipboardCheck,
  Bell,
  MessageCircle,
  Settings,
  Book,
  Users,
  Palette
} from 'lucide-react';
import { 
  familyResources, 
  getRecommendedResources
} from '../data/familyResources';
import { FamilyPersonaProfiles } from '../data/familyPersonaProfiles';

interface AdaptiveResourcesProps {
  personaId?: string;
  priorities?: string[];
  ageGroup?: string;
  compact?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Shield,
  FileText,
  Bell,
  MessageCircle,
  Globe,
  Search,
  Settings,
  Wrench,
  Book,
  Play,
  Users,
  BookOpen,
  Palette,
  Network,
  ClipboardCheck,
  Rocket,
  Lightbulb,
  Image,
  AlertTriangle,
  AlertCircle: AlertTriangle
};

const AdaptiveResources: React.FC<AdaptiveResourcesProps> = ({ 
  personaId, 
  priorities = [],
  ageGroup,
  compact = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Get persona from context or prop
  const [storedPersona] = useState<string | null>(() => {
    if (personaId) {return personaId;}
    const stored = localStorage.getItem('pandagarde_family_persona');
    return stored ? JSON.parse(stored).primary : null;
  });

  const activePersona = personaId || storedPersona;
  const personaProfile = activePersona ? FamilyPersonaProfiles[activePersona] : null;

  // Get recommended resources
  const recommendedResources = useMemo(() => {
    if (activePersona) {
      return getRecommendedResources(activePersona, priorities);
    }
    return familyResources;
  }, [activePersona, priorities]);

  // Filter resources
  const filteredResources = useMemo(() => {
    let resources = recommendedResources;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      resources = resources.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.category.some(c => c.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      resources = resources.filter(r => r.category.includes(selectedCategory));
    }

    // Filter by type
    if (selectedType !== 'all') {
      resources = resources.filter(r => r.type === selectedType);
    }

    // Filter by age group if provided
    if (ageGroup) {
      resources = resources.filter(r => 
        r.ageGroups.includes(ageGroup) || r.ageGroups.includes('all')
      );
    }

    return resources;
  }, [recommendedResources, searchQuery, selectedCategory, selectedType, ageGroup]);

  // Get all unique categories
  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    recommendedResources.forEach(r => {
      r.category.forEach(c => allCategories.add(c));
    });
    return ['all', ...Array.from(allCategories).sort()];
  }, [recommendedResources]);

  // Get all unique types
  const types = useMemo(() => {
    const allTypes = new Set<string>();
    recommendedResources.forEach(r => allTypes.add(r.type));
    return ['all', ...Array.from(allTypes).sort()];
  }, [recommendedResources]);

  const getIcon = (iconName?: string) => {
    if (!iconName) {return FileText;}
    return iconMap[iconName] || FileText;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen;
      case 'activity': return Play;
      case 'tool': return Wrench;
      case 'article': return FileText;
      case 'video': return Video;
      case 'download': return Download;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-amber-600 dark:text-amber-400';
      case 'low': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {personaProfile && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Recommended for {personaProfile.name}
              </h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {personaProfile.description}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.slice(0, 6).map(resource => {
            const Icon = getIcon(resource.icon);
            const TypeIcon = getTypeIcon(resource.type);
            
            return (
              <Link
                key={resource.id}
                to={resource.url}
                className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 sm:truncate break-words">
                        {resource.title}
                      </h4>
                      <TypeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-xs font-medium ${getPriorityColor(resource.priority)}`}>
                        {resource.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Personalized Privacy Resources
          </h1>
          {personaProfile && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-semibold text-blue-900 dark:text-blue-100">
                  Recommended for {personaProfile.name}
                </h2>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {personaProfile.description}
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No resources found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => {
              const Icon = getIcon(resource.icon);
              const TypeIcon = getTypeIcon(resource.type);
              
              return (
                <Link
                  key={resource.id}
                  to={resource.url}
                  className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-all hover:border-blue-500 dark:hover:border-blue-400"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {resource.title}
                        </h3>
                        <TypeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {resource.category.slice(0, 2).map(cat => (
                          <span
                            key={cat}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${getPriorityColor(resource.priority)}`}>
                          {resource.priority} priority
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptiveResources;

