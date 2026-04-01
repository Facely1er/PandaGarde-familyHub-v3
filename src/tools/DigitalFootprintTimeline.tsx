import React, { useState, useEffect } from 'react';
import Card from '../components/Card';

interface FootprintEvent {
  id: string;
  timestamp: number;
  platform: string;
  action: string;
  dataShared: string[];
  privacyRisk: 'low' | 'medium' | 'high';
  canDelete: boolean;
  description: string;
  icon: string;
  category: 'social' | 'communication' | 'entertainment' | 'shopping' | 'education' | 'other';
}

interface DailySummary {
  date: string;
  totalEvents: number;
  highRiskEvents: number;
  mediumRiskEvents: number;
  lowRiskEvents: number;
  platformsUsed: string[];
  dataTypesShared: string[];
  privacyScore: number;
}

const sampleEvents: FootprintEvent[] = [
  {
    id: '1',
    timestamp: Date.now() - 3600000, // 1 hour ago
    platform: 'Instagram',
    action: 'Posted a photo with location',
    dataShared: ['Photo', 'Location', 'Timestamp', 'Device Info'],
    privacyRisk: 'high',
    canDelete: true,
    description: 'Shared a photo with precise location data visible to followers',
    icon: '📸',
    category: 'social'
  },
  {
    id: '2',
    timestamp: Date.now() - 7200000, // 2 hours ago
    platform: 'TikTok',
    action: 'Watched videos',
    dataShared: ['Viewing History', 'Device Info', 'IP Address'],
    privacyRisk: 'medium',
    canDelete: false,
    description: 'Platform tracked viewing preferences and device information',
    icon: '🎵',
    category: 'entertainment'
  },
  {
    id: '3',
    timestamp: Date.now() - 10800000, // 3 hours ago
    platform: 'Discord',
    action: 'Sent a message',
    dataShared: ['Message Content', 'Timestamp', 'Server Info'],
    privacyRisk: 'low',
    canDelete: true,
    description: 'Sent a text message in a private server',
    icon: '💬',
    category: 'communication'
  },
  {
    id: '4',
    timestamp: Date.now() - 14400000, // 4 hours ago
    platform: 'Snapchat',
    action: 'Sent a snap',
    dataShared: ['Photo/Video', 'Timestamp', 'Recipient Info'],
    privacyRisk: 'medium',
    canDelete: true,
    description: 'Sent an ephemeral photo/video message',
    icon: '👻',
    category: 'communication'
  },
  {
    id: '5',
    timestamp: Date.now() - 18000000, // 5 hours ago
    platform: 'YouTube',
    action: 'Searched for videos',
    dataShared: ['Search Query', 'Viewing History', 'Device Info'],
    privacyRisk: 'medium',
    canDelete: false,
    description: 'Searched for content, creating a search history profile',
    icon: '📺',
    category: 'entertainment'
  },
  {
    id: '6',
    timestamp: Date.now() - 21600000, // 6 hours ago
    platform: 'Google',
    action: 'Searched the web',
    dataShared: ['Search Query', 'IP Address', 'Device Info', 'Location'],
    privacyRisk: 'high',
    canDelete: true,
    description: 'Web search query linked to location and device information',
    icon: '🔍',
    category: 'other'
  }
];

const DigitalFootprintTimeline: React.FC = () => {
  const [events, setEvents] = useState<FootprintEvent[]>(sampleEvents);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);

  useEffect(() => {
    calculateDailySummary();
  }, [events, selectedDate]);

  const calculateDailySummary = (): void => {
    const selectedDateEvents = events.filter(event => {
      const eventDate = new Date(event.timestamp).toISOString().split('T')[0];
      return eventDate === selectedDate;
    });

    const platforms = [...new Set(selectedDateEvents.map(e => e.platform))];
    const dataTypes = [...new Set(selectedDateEvents.flatMap(e => e.dataShared))];
    
    const highRisk = selectedDateEvents.filter(e => e.privacyRisk === 'high').length;
    const mediumRisk = selectedDateEvents.filter(e => e.privacyRisk === 'medium').length;
    const lowRisk = selectedDateEvents.filter(e => e.privacyRisk === 'low').length;

    // Calculate privacy score (higher is better)
    const totalEvents = selectedDateEvents.length;
    const privacyScore = totalEvents === 0 ? 100 : Math.max(0, 100 - (highRisk * 30) - (mediumRisk * 15) - (lowRisk * 5));

    setDailySummary({
      date: selectedDate,
      totalEvents,
      highRiskEvents: highRisk,
      mediumRiskEvents: mediumRisk,
      lowRiskEvents: lowRisk,
      platformsUsed: platforms,
      dataTypesShared: dataTypes,
      privacyScore
    });
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) {return 'text-green-600';}
    if (score >= 60) {return 'text-yellow-600';}
    return 'text-red-600';
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredEvents = events.filter((event: FootprintEvent) => {
    const eventDate = new Date(event.timestamp).toISOString().split('T')[0];
    const matchesDate = eventDate === selectedDate;
    const matchesRisk = filterRisk === 'all' || event.privacyRisk === filterRisk;
    const matchesPlatform = filterPlatform === 'all' || event.platform === filterPlatform;
    
    return matchesDate && matchesRisk && matchesPlatform;
  });

  const addSampleEvent = (): void => {
    const newEvent: FootprintEvent = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      platform: 'Instagram',
      action: 'Liked a post',
      dataShared: ['Interaction Data', 'Timestamp', 'User ID'],
      privacyRisk: 'low',
      canDelete: false,
      description: 'Liked a post, creating interaction data',
      icon: '❤️',
      category: 'social'
    };
    setEvents([newEvent, ...events]);
  };

  const deleteEvent = (eventId: string): void => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const getCleanupSuggestions = (): Array<{type: string; description: string; impact: string; icon: string}> => {
    const highRiskEvents = events.filter(e => e.privacyRisk === 'high' && e.canDelete);
    const suggestions = [];

    if (highRiskEvents.length > 0) {
      suggestions.push({
        type: 'Delete High-Risk Content',
        description: `Remove ${highRiskEvents.length} high-risk posts or content`,
        impact: 'High',
        icon: '🗑️'
      });
    }

    const platformsWithManyEvents = [...new Set(events.map(e => e.platform))]
      .map(platform => ({
        platform,
        count: events.filter(e => e.platform === platform).length
      }))
      .filter(p => p.count > 3);

    if (platformsWithManyEvents.length > 0) {
      suggestions.push({
        type: 'Review Platform Usage',
        description: `Consider reducing activity on ${platformsWithManyEvents[0].platform}`,
        impact: 'Medium',
        icon: '📊'
      });
    }

    return suggestions;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Digital Footprint Timeline</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Track your daily digital activities and understand your privacy footprint. 
          Learn how your online actions create a digital trail and how to manage it.
        </p>
      </div>

      {/* Date Selector */}
      <div className="mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Select Date</h2>
              <button
                onClick={addSampleEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Sample Event
              </button>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-600 mt-2">
              Selected: {formatDate(selectedDate)}
            </p>
          </div>
        </Card>
      </div>

      {/* Daily Summary */}
      {dailySummary && (
        <div className="mb-8">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{dailySummary.totalEvents}</div>
                  <p className="text-gray-600">Total Activities</p>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(dailySummary.privacyScore)}`}>
                    {dailySummary.privacyScore}
                  </div>
                  <p className="text-gray-600">Privacy Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{dailySummary.highRiskEvents}</div>
                  <p className="text-gray-600">High Risk</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{dailySummary.platformsUsed.length}</div>
                  <p className="text-gray-600">Platforms Used</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Platforms Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {dailySummary.platformsUsed.map(platform => (
                      <span key={platform} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Types Shared</h3>
                  <div className="flex flex-wrap gap-2">
                    {dailySummary.dataTypesShared.map(dataType => (
                      <span key={dataType} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {dataType}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <Card>
          <div className="p-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Platforms</option>
                  {[...new Set(events.map(e => e.platform))].map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Timeline</h2>
        {filteredEvents.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <p className="text-gray-600">No activities found for this date and filter combination.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEvents
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((event) => (
                <Card key={event.id}>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <span className="text-2xl">{event.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{event.platform}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(event.privacyRisk)}`}>
                              {event.privacyRisk.toUpperCase()} RISK
                            </span>
                            <span className="text-sm text-gray-500">{formatTime(event.timestamp)}</span>
                          </div>
                          <p className="text-gray-900 font-medium mb-1">{event.action}</p>
                          <p className="text-gray-600 mb-3">{event.description}</p>
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Data Shared:</p>
                            <div className="flex flex-wrap gap-1">
                              {event.dataShared.map((data, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {data}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {event.canDelete && (
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        )}
                        <span className="text-sm text-gray-500">
                          {event.canDelete ? 'Deletable' : 'Permanent'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Cleanup Suggestions */}
      <div className="mb-8">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Cleanup Suggestions</h2>
            <div className="space-y-4">
              {getCleanupSuggestions().map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-xl">{suggestion.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{suggestion.type}</h3>
                    <p className="text-gray-600">{suggestion.description}</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                      suggestion.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {suggestion.impact} Impact
                    </span>
                  </div>
                </div>
              ))}
              {getCleanupSuggestions().length === 0 && (
                <p className="text-gray-600">Great job! Your digital footprint looks clean for today.</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Educational Content */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Your Digital Footprint</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔍 What is a Digital Footprint?</h3>
              <p className="text-gray-600 mb-4">
                Your digital footprint is the trail of data you leave behind when using digital services. 
                Every click, search, post, and interaction creates data that can be collected and analyzed.
              </p>
              <h3 className="font-semibold text-gray-900 mb-2">📊 Risk Levels Explained</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• <strong>Low Risk:</strong> Minimal personal data exposure</li>
                <li>• <strong>Medium Risk:</strong> Moderate data collection and tracking</li>
                <li>• <strong>High Risk:</strong> Significant personal data sharing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🛡️ Privacy Protection Tips</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Regularly review and delete old posts</li>
                <li>• Use privacy settings on all platforms</li>
                <li>• Be mindful of location sharing</li>
                <li>• Limit personal information in profiles</li>
                <li>• Use incognito/private browsing when possible</li>
                <li>• Regularly audit app permissions</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DigitalFootprintTimeline;