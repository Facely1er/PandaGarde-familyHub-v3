import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Info,
  ExternalLink,
  Users,
  MessageCircle,
  Gamepad2,
  Film,
  GraduationCap,
  Palette,
  ChevronRight,
  Clock,
  Bell,
  BookOpen,
  School,
  Bot,
  Signal,
  Scale
} from 'lucide-react';
import { 
  childServiceCatalog, 
  getServicesByCategory, 
  type ServiceCategory,
  type ChildService
} from '../data/childServiceCatalog';
import { useFamily, type ServiceUsage } from '../contexts/FamilyContext';
import { calculatePrivacyExposureIndex, getExposureLevel } from '../lib/privacyExposureIndex';
import { getServiceLogoUrlWithBrandColor, hasServiceLogo } from '../utils/serviceLogos';
import ServiceRelationshipMap from './ServiceRelationshipMap';
import './ServiceCatalog.css';

const CATEGORY_LABELS: Record<ServiceCategory | 'all', string> = {
  all: 'All',
  'social-media': 'Social media',
  messaging: 'Messaging',
  gaming: 'Gaming',
  streaming: 'Streaming',
  education: 'Education',
  edtech: 'School Tools (EdTech)',
  ai: 'AI Apps',
  telecom: 'Mobile Carriers',
  creative: 'Creative',
  other: 'Other'
};

interface ServiceCatalogProps {
  memberId?: string; // If provided, shows services for specific member
  onServiceSelect?: (serviceId: string) => void;
  showRequestButton?: boolean; // Show request button for children
  guidedMode?: boolean; // Friendlier UI: category pills and tip
}

const ServiceCatalog: React.FC<ServiceCatalogProps> = ({ 
  memberId, 
  onServiceSelect,
  showRequestButton = false,
  guidedMode = false
}) => {
  const { familyMembers, requestService, isChild, addServiceToFamily, removeServiceFromFamily, getFamilyServices } = useFamily();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedExposureLevel, setSelectedExposureLevel] = useState<string>('all');
  const [filterLawEnforcement, setFilterLawEnforcement] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'name' | 'exposure' | 'age'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedService, setSelectedService] = useState<ChildService | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [familyServices, setFamilyServices] = useState<string[]>(getFamilyServices());

  // Get member's current services
  const member = memberId ? familyMembers.find(m => m.id === memberId) : null;
  const memberServices = member?.services || [];

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let services = childServiceCatalog;

    // Filter by category
    if (selectedCategory !== 'all') {
      services = getServicesByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      services = services.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    // Filter by risk level
    if (selectedRisk !== 'all') {
      services = services.filter(s => s.riskLevel === selectedRisk);
    }

    // Filter by exposure index level
    if (selectedExposureLevel !== 'all') {
      services = services.filter(s => {
        const exposureIndex = calculatePrivacyExposureIndex(s.id);
        if (exposureIndex === null) {return false;}
        
        switch (selectedExposureLevel) {
          case 'very-high':
            return exposureIndex >= 70;
          case 'high':
            return exposureIndex >= 50 && exposureIndex < 70;
          case 'medium':
            return exposureIndex >= 30 && exposureIndex < 50;
          case 'low':
            return exposureIndex < 30;
          default:
            return true;
        }
      });
    }

    // Filter by law enforcement concerns
    if (filterLawEnforcement) {
      services = services.filter(
        s => s.lawEnforcementConcerns && s.lawEnforcementConcerns.length > 0
      );
    }

    // Sort services
    services = [...services].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'exposure': {
          const exposureA = calculatePrivacyExposureIndex(a.id) || 0;
          const exposureB = calculatePrivacyExposureIndex(b.id) || 0;
          comparison = exposureA - exposureB;
          break;
        }
        case 'age':
          comparison = a.minAge - b.minAge;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return services;
  }, [searchQuery, selectedCategory, selectedRisk, selectedExposureLevel, filterLawEnforcement, sortBy, sortOrder]);

  // Get category icon
  const getCategoryIcon = (category: ServiceCategory) => {
    switch (category) {
      case 'social-media':
        return Users;
      case 'messaging':
        return MessageCircle;
      case 'gaming':
        return Gamepad2;
      case 'streaming':
        return Film;
      case 'edtech':
        return School;
      case 'education':
        return GraduationCap;
      case 'ai':
        return Bot;
      case 'telecom':
        return Signal;
      case 'creative':
        return Palette;
      default:
        return Shield;
    }
  };

  // Get risk badge
  const getRiskBadge = (riskLevel: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      'very-high': 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[riskLevel as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {riskLevel === 'very-high' ? 'Very High' : riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
      </span>
    );
  };

  // Check if service is already added
  const isServiceAdded = (serviceId: string): ServiceUsage | null => {
    return memberServices.find(s => s.serviceId === serviceId) || null;
  };

  // Handle service request
  const handleRequestService = async (serviceId: string) => {
    if (!memberId) {return;}
    
    setIsRequesting(true);
    try {
      const result = await requestService(memberId, serviceId);
      if (result.success) {
        alert('Service request sent to parent for approval!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error requesting service:', error);
      alert('Failed to request service');
    } finally {
      setIsRequesting(false);
    }
  };

  // Handle adding/removing service to/from family
  const handleToggleFamilyService = async (serviceId: string) => {
    setIsRequesting(true);
    try {
      if (familyServices.includes(serviceId)) {
        const result = await removeServiceFromFamily(serviceId);
        if (result.success) {
          setFamilyServices(getFamilyServices());
        } else {
          alert(`Error: ${result.error}`);
        }
      } else {
        const result = await addServiceToFamily(serviceId);
        if (result.success) {
          setFamilyServices(getFamilyServices());
        } else {
          alert(`Error: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error toggling family service:', error);
      alert('Failed to update service');
    } finally {
      setIsRequesting(false);
    }
  };

  // Check if service is added to family
  const isServiceInFamily = (serviceId: string): boolean => {
    return familyServices.includes(serviceId);
  };

  // Get service status
  const getServiceStatus = (serviceId: string) => {
    const serviceUsage = isServiceAdded(serviceId);
    if (!serviceUsage) {return null;}
    
    return {
      status: serviceUsage.status,
      approvedAt: serviceUsage.approvedAt,
      notes: serviceUsage.notes
    };
  };

  return (
    <div className="service-catalog">
      {/* Standalone catalog only: ServiceCatalogPage sets guidedMode and provides the page h1 */}
      {!onServiceSelect && !guidedMode && (
        <div className="catalog-header">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="catalog-title">Service Catalog</h2>
              <p className="catalog-subtitle">Browse curated EdTech and family apps</p>
            </div>
            <Link
              to="/safety-alerts"
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
            >
              <Bell className="h-4 w-4" />
              <span>Safety Alerts</span>
            </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="catalog-filters">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder={guidedMode ? "Search by name or category..." : "Search services..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search services"
          />
        </div>

        {/* Category pills in guided mode for friendlier browsing */}
        {guidedMode && (
          <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Filter by category">
            {(['all', 'edtech', 'ai', 'telecom', 'social-media', 'messaging', 'gaming', 'streaming', 'education', 'creative'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? cat === 'edtech'
                      ? 'bg-amber-600 text-white shadow-md'
                      : cat === 'ai'
                        ? 'bg-purple-600 text-white shadow-md'
                        : cat === 'telecom'
                          ? 'bg-blue-700 text-white shadow-md'
                          : 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat === 'edtech' ? '🏫 ' : cat === 'ai' ? '🤖 ' : cat === 'telecom' ? '📡 ' : ''}{CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        )}

        <div className="filter-group">
          <Filter size={16} />
          {!guidedMode && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory | 'all')}
            className="filter-select"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="edtech">School Tools (EdTech)</option>
            <option value="ai">AI Apps</option>
            <option value="telecom">Mobile Carriers</option>
            <option value="social-media">Social Media</option>
            <option value="messaging">Messaging</option>
            <option value="gaming">Gaming</option>
            <option value="streaming">Streaming</option>
            <option value="education">Education</option>
            <option value="creative">Creative</option>
          </select>
          )}

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="filter-select"
            aria-label="Filter by risk level"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="very-high">Very High Risk</option>
          </select>

          <select
            value={selectedExposureLevel}
            onChange={(e) => setSelectedExposureLevel(e.target.value)}
            className="filter-select"
            aria-label="Filter by exposure level"
          >
            <option value="all">All Exposure Levels</option>
            <option value="very-high">Very High (70-100)</option>
            <option value="high">High (50-69)</option>
            <option value="medium">Medium (30-49)</option>
            <option value="low">Low (0-29)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'exposure' | 'age')}
            className="filter-select"
            aria-label="Sort by"
          >
            <option value="name">Sort by Name</option>
            <option value="exposure">Sort by Exposure Index</option>
            <option value="age">Sort by Age</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          {/* Law Enforcement filter toggle */}
          <button
            onClick={() => setFilterLawEnforcement(!filterLawEnforcement)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors border ${
              filterLawEnforcement
                ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-400 dark:border-red-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Show only services with law enforcement data-sharing concerns"
          >
            <Scale size={14} />
            LE Concerns
          </button>
        </div>
      </div>

      {/* Service Grid */}
      <div className="services-grid">
        {filteredServices.map((service) => {
          const CategoryIcon = getCategoryIcon(service.category);
          const serviceStatus = getServiceStatus(service.id);
          const isAdded = !!serviceStatus;

          const inFamily = isServiceInFamily(service.id);
          
          return (
            <div
              key={service.id}
              className={`service-card ${isAdded ? 'service-added' : ''} ${inFamily ? 'in-family' : ''}`}
              onClick={() => setSelectedService(service)}
            >
              <div className="service-card-header">
                {inFamily && (
                  <div className="in-family-badge">
                    <CheckCircle size={12} />
                    Added
                  </div>
                )}
                {service.schoolAssigned && (
                  <div className="school-assigned-badge">
                    <School size={12} />
                    School
                  </div>
                )}
                {service.lawEnforcementConcerns && service.lawEnforcementConcerns.length > 0 && (
                  <div
                    className="le-concerns-badge"
                    title="This service has documented law enforcement data-sharing concerns"
                  >
                    <Scale size={12} />
                    LE
                  </div>
                )}
                <div className="service-icon-wrapper">
                  {hasServiceLogo(service.id) ? (
                    <img
                      src={getServiceLogoUrlWithBrandColor(service.id) || undefined}
                      alt={`${service.name} logo`}
                      className="service-logo"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.classList.add('hide');
                        const fallback = target.parentElement?.querySelector('.service-icon-fallback') as HTMLElement;
                        if (fallback) {fallback.classList.remove('hide');}
                      }}
                    />
                  ) : null}
                  <CategoryIcon 
                    size={24} 
                    className={`service-icon service-icon-fallback ${hasServiceLogo(service.id) ? 'hide' : ''}`}
                  />
                </div>
                <div className="service-header-content">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
              </div>

              <div className="service-card-body">
                <div className="service-meta">
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>Age {service.minAge}+</span>
                  </div>
                  {getRiskBadge(service.riskLevel)}
                </div>

                {/* Privacy Exposure Index */}
                {(() => {
                  const exposureIndex = calculatePrivacyExposureIndex(service.id);
                  const exposureLevel = getExposureLevel(exposureIndex);
                  if (exposureIndex !== null) {
                    return (
                      <div className="mt-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Privacy Exposure
                          </span>
                          <span className={`text-xs font-semibold ${exposureLevel.textColor}`}>
                            {exposureIndex}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          {/* width from CSS var --exposure-pct (dynamic 0-100%) */}
                          <div
                            className={`h-2 rounded-full exposure-bar-width ${exposureLevel.barColor}`}
                            style={{ ['--exposure-pct' as string]: `${exposureIndex}%` } as React.CSSProperties}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {exposureLevel.level} - {exposureLevel.description}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {serviceStatus && (
                  <div className="service-status">
                    {serviceStatus.status === 'approved' && (
                      <span className="status-badge approved">
                        <CheckCircle size={14} />
                        Approved
                      </span>
                    )}
                    {serviceStatus.status === 'requested' && (
                      <span className="status-badge pending">
                        <Clock size={14} />
                        Pending Approval
                      </span>
                    )}
                    {serviceStatus.status === 'denied' && (
                      <span className="status-badge denied">
                        <X size={14} />
                        Denied
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="service-card-footer">
                {showRequestButton && !isAdded && isChild && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestService(service.id);
                    }}
                    disabled={isRequesting}
                    className="request-button"
                  >
                    Request Service
                  </button>
                )}
                {onServiceSelect && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onServiceSelect(service.id);
                    }}
                    className="select-button"
                  >
                    View Details
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="empty-state">
          <Shield size={48} className="empty-icon" />
          <p className="mb-2">
            {guidedMode
              ? "No services match your search or filters. Try a different category or clear the search."
              : "No services found matching your filters."}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedRisk('all');
              setSelectedExposureLevel('all');
              setFilterLawEnforcement(false);
            }}
            className="clear-filters-button"
          >
            {guidedMode ? 'Show all services' : 'Clear Filters'}
          </button>
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                {hasServiceLogo(selectedService.id) ? (
                  <img
                    src={getServiceLogoUrlWithBrandColor(selectedService.id) || undefined}
                    alt={`${selectedService.name} logo`}
                    className="modal-logo"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.classList.add('hide');
                      const fallback = target.parentElement?.querySelector('.modal-icon-fallback') as HTMLElement;
                      if (fallback) {fallback.classList.remove('hide');}
                    }}
                  />
                ) : null}
                {(() => {
                  const CategoryIcon = getCategoryIcon(selectedService.category);
                  return (
                    <CategoryIcon 
                      size={32} 
                      className={`modal-icon modal-icon-fallback ${hasServiceLogo(selectedService.id) ? 'hide' : ''}`}
                    />
                  );
                })()}
                <div>
                  <h2 className="modal-title">{selectedService.name}</h2>
                  <p className="modal-subtitle">{selectedService.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="modal-close"
                aria-label="Close"
                title="Close"
              >
                <X size={24} aria-hidden />
              </button>
            </div>

            {/* Quick Add Button at Top */}
            <div className={`modal-quick-add-section ${isServiceInFamily(selectedService.id) ? 'added' : ''}`}>
              {selectedService.schoolAssigned && (
                <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-3 text-sm text-amber-800 dark:text-amber-200">
                  <School size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>School-assigned app</strong> — your child may already be using this through school, independently of your choice. Add it to see how it contributes to your family's digital footprint.
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleToggleFamilyService(selectedService.id)}
                disabled={isRequesting}
                className={`modal-quick-add-btn ${isServiceInFamily(selectedService.id) ? 'added' : ''}`}
              >
                {isRequesting ? (
                  'Processing...'
                ) : isServiceInFamily(selectedService.id) ? (
                  <>
                    <X size={18} />
                    Remove from My Services
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Add to My Services
                  </>
                )}
              </button>
              {!isServiceInFamily(selectedService.id) && (
                <p className="modal-quick-add-hint">
                  Adding services enables Digital Footprint Analysis
                </p>
              )}
            </div>

            <div className="modal-body">
              {/* What Parents Need to Know Section */}
              <div className="modal-section modal-section-parents">
                <h3 className="section-title">
                  <Info size={20} className="icon-inline" />
                  What Parents Need to Know
                </h3>
                <div className="parents-meta">
                  <div className="parents-row">
                    <Shield size={16} className="icon-blue" />
                    <strong>Privacy Safety Level:</strong>
                    <span>{selectedService.riskLevel === 'very-high' ? 'Very High' : selectedService.riskLevel.charAt(0).toUpperCase() + selectedService.riskLevel.slice(1)}</span>
                  </div>
                  <div className="parents-row">
                    <Users size={16} className="icon-blue" />
                    <strong>Recommended Age:</strong>
                    <span>Age {selectedService.minAge} and older</span>
                  </div>
                  {(() => {
                    const exposureIndex = calculatePrivacyExposureIndex(selectedService.id);
                    const exposureLevel = getExposureLevel(exposureIndex);
                    if (exposureIndex !== null) {
                      return (
                        <div className="modal-exposure-inner">
                          <div className="exposure-row">
                            <strong>
                              <AlertTriangle size={16} />
                              Privacy Exposure Index:
                            </strong>
                            <span className={`font-bold ${exposureLevel.textColor}`}>
                              {exposureIndex}/100
                            </span>
                          </div>
                          <div className="modal-exposure-bar-track">
                            {/* width from CSS var --exposure-pct (dynamic 0-100%) */}
                            <div
                              className={`modal-exposure-bar-fill exposure-bar-width ${exposureLevel.barColor}`}
                              style={{ ['--exposure-pct' as string]: `${exposureIndex}%` } as React.CSSProperties}
                            />
                          </div>
                          <p>
                            <strong>{exposureLevel.level}</strong> - {exposureLevel.description}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                {selectedService.privacyConcerns && selectedService.privacyConcerns.length > 0 && (
                  <div className="concerns-block">
                    <strong>Privacy Concerns:</strong>
                    <ul>
                      {selectedService.privacyConcerns.slice(0, 3).map((concern, idx) => (
                        <li key={idx}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Law Enforcement Concerns */}
                {selectedService.lawEnforcementConcerns && selectedService.lawEnforcementConcerns.length > 0 && (
                  <div className="le-concerns-block">
                    <div className="le-concerns-header">
                      <Scale size={16} className="le-concerns-icon" />
                      <strong>Law Enforcement Data-Sharing Concerns:</strong>
                    </div>
                    <p className="le-concerns-intro">
                      This service has documented practices of sharing user data with government agencies or law enforcement.
                    </p>
                    <ul>
                      {selectedService.lawEnforcementConcerns.map((concern, idx) => (
                        <li key={idx}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="modal-section">
                <h3 className="section-title">Service Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Minimum Age:</span>
                    <span className="info-value">Age {selectedService.minAge}+</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Privacy Safety Level:</span>
                    {getRiskBadge(selectedService.riskLevel)}
                  </div>
                  {(() => {
                    const exposureIndex = calculatePrivacyExposureIndex(selectedService.id);
                    if (exposureIndex !== null) {
                      const exposureLevel = getExposureLevel(exposureIndex);
                      return (
                        <div className="info-item">
                          <span className="info-label">Privacy Exposure Index:</span>
                          <span className={`info-value ${exposureLevel.textColor} font-semibold`}>
                            {exposureIndex}/100 ({exposureLevel.level})
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <div className="info-item">
                    <span className="info-label">Category:</span>
                    <span className="info-value capitalize">{selectedService.category.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Service Relationships */}
              <ServiceRelationshipMap 
                serviceId={selectedService.id}
                onServiceClick={(serviceId) => {
                  const service = childServiceCatalog.find(s => s.id === serviceId);
                  if (service) {
                    setSelectedService(service);
                  }
                }}
              />

              {/* Quick Decision Guide */}
              <div className="modal-section modal-section-decision">
                <h3 className="section-title">
                  <AlertTriangle size={20} className="icon-inline" />
                  Quick Decision Guide
                </h3>
                <div className="decision-text">
                  {selectedService.riskLevel === 'low' && (
                    <p>
                      <strong>This app is generally safe.</strong> It has low privacy risks. You can approve it, but still review privacy settings with your child.
                    </p>
                  )}
                  {selectedService.riskLevel === 'medium' && (
                    <p>
                      <strong>This app has some privacy concerns.</strong> Review the privacy settings together with your child before approving. Make sure they understand what information is shared.
                    </p>
                  )}
                  {(selectedService.riskLevel === 'high' || selectedService.riskLevel === 'very-high') && (
                    <p>
                      <strong>This app has significant privacy risks.</strong> Consider if your child really needs this app. If you approve it, set strict privacy settings and monitor their usage closely.
                    </p>
                  )}
                </div>
              </div>

              {selectedService.parentTips && selectedService.parentTips.length > 0 && (
                <div className="modal-section modal-section-tips">
                  <h3 className="section-title">
                    <CheckCircle size={20} className="icon-inline" />
                    How to Set Up Privacy Settings
                  </h3>
                  <ul className="tips-list">
                    {selectedService.parentTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedService.website && (
                <div className="modal-section">
                  <a
                    href={selectedService.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-link"
                  >
                    <ExternalLink size={16} />
                    Visit Official Website
                  </a>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {/* Add/Remove Service Button - Always show */}
              <button
                type="button"
                onClick={() => handleToggleFamilyService(selectedService.id)}
                disabled={isRequesting}
                className={`modal-add-button ${isServiceInFamily(selectedService.id) ? 'added' : ''}`}
              >
                {isRequesting ? (
                  'Processing...'
                ) : isServiceInFamily(selectedService.id) ? (
                  <>
                    <X size={18} />
                    Remove from My Services
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Add to My Services
                  </>
                )}
              </button>
              
              {/* Request Button for children */}
              {showRequestButton && !isServiceAdded(selectedService.id) && isChild && (
                <button
                  onClick={() => {
                    if (memberId) {
                      handleRequestService(selectedService.id);
                      setSelectedService(null);
                    }
                  }}
                  disabled={isRequesting}
                  className="modal-request-button"
                >
                  Request Parental Approval
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCatalog;

