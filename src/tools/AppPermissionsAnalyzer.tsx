import React, { useState } from 'react';
import Card from '../components/Card';

interface Permission {
  name: string;
  category: 'camera' | 'microphone' | 'location' | 'contacts' | 'storage' | 'network' | 'device' | 'other';
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  whyNeeded?: string;
  alternatives?: string[];
}

interface AppData {
  name: string;
  icon: string;
  permissions: Permission[];
  necessaryPermissions: string[];
  riskyPermissions: string[];
  privacyScore: number;
  description: string;
  ageRecommendation: string;
  platform: 'ios' | 'android' | 'both';
}

const apps: AppData[] = [
  {
    name: 'TikTok',
    icon: '🎵',
    description: 'Short-form video sharing platform',
    ageRecommendation: '13+',
    platform: 'both',
    permissions: [
      { name: 'Camera', category: 'camera', riskLevel: 'medium', description: 'Access to camera for recording videos', whyNeeded: 'Core functionality for video creation' },
      { name: 'Microphone', category: 'microphone', riskLevel: 'medium', description: 'Access to microphone for audio recording', whyNeeded: 'Required for video with sound' },
      { name: 'Location', category: 'location', riskLevel: 'high', description: 'Access to precise location data', whyNeeded: 'For location-based content discovery', alternatives: ['Disable location services', 'Use approximate location only'] },
      { name: 'Contacts', category: 'contacts', riskLevel: 'high', description: 'Access to device contacts', whyNeeded: 'To find friends on the platform', alternatives: ['Skip contact access', 'Manually add friends'] },
      { name: 'Storage', category: 'storage', riskLevel: 'low', description: 'Access to device storage', whyNeeded: 'To save and manage videos' },
      { name: 'Network', category: 'network', riskLevel: 'low', description: 'Internet access', whyNeeded: 'To upload and download content' }
    ],
    necessaryPermissions: ['Camera', 'Storage', 'Network'],
    riskyPermissions: ['Location', 'Contacts'],
    privacyScore: 65
  },
  {
    name: 'Instagram',
    icon: '📸',
    description: 'Photo and video sharing social network',
    ageRecommendation: '13+',
    platform: 'both',
    permissions: [
      { name: 'Camera', category: 'camera', riskLevel: 'medium', description: 'Access to camera for photos and videos', whyNeeded: 'Core functionality for content creation' },
      { name: 'Microphone', category: 'microphone', riskLevel: 'medium', description: 'Access to microphone for videos and stories', whyNeeded: 'Required for video content with audio' },
      { name: 'Location', category: 'location', riskLevel: 'high', description: 'Access to location for geotagging', whyNeeded: 'To tag posts with location', alternatives: ['Disable location tagging', 'Remove location from posts'] },
      { name: 'Contacts', category: 'contacts', riskLevel: 'high', description: 'Access to contacts to find friends', whyNeeded: 'To connect with existing contacts', alternatives: ['Skip contact sync', 'Search manually'] },
      { name: 'Storage', category: 'storage', riskLevel: 'low', description: 'Access to photo library', whyNeeded: 'To save and manage photos' },
      { name: 'Network', category: 'network', riskLevel: 'low', description: 'Internet access', whyNeeded: 'To share and view content' }
    ],
    necessaryPermissions: ['Camera', 'Storage', 'Network'],
    riskyPermissions: ['Location', 'Contacts'],
    privacyScore: 70
  },
  {
    name: 'Snapchat',
    icon: '👻',
    description: 'Ephemeral messaging and photo sharing',
    ageRecommendation: '13+',
    platform: 'both',
    permissions: [
      { name: 'Camera', category: 'camera', riskLevel: 'medium', description: 'Access to camera for snaps', whyNeeded: 'Core functionality for photo/video snaps' },
      { name: 'Microphone', category: 'microphone', riskLevel: 'medium', description: 'Access to microphone for video snaps', whyNeeded: 'Required for video snaps with audio' },
      { name: 'Location', category: 'location', riskLevel: 'high', description: 'Access to location for Snap Map', whyNeeded: 'For location sharing and discovery', alternatives: ['Disable Snap Map', 'Use Ghost Mode'] },
      { name: 'Contacts', category: 'contacts', riskLevel: 'high', description: 'Access to contacts to find friends', whyNeeded: 'To connect with existing contacts', alternatives: ['Skip contact access', 'Add friends manually'] },
      { name: 'Storage', category: 'storage', riskLevel: 'low', description: 'Access to photo library', whyNeeded: 'To save memories and photos' },
      { name: 'Network', category: 'network', riskLevel: 'low', description: 'Internet access', whyNeeded: 'To send and receive snaps' }
    ],
    necessaryPermissions: ['Camera', 'Storage', 'Network'],
    riskyPermissions: ['Location', 'Contacts'],
    privacyScore: 60
  },
  {
    name: 'Discord',
    icon: '💬',
    description: 'Voice, video, and text communication platform',
    ageRecommendation: '13+',
    platform: 'both',
    permissions: [
      { name: 'Microphone', category: 'microphone', riskLevel: 'medium', description: 'Access to microphone for voice chat', whyNeeded: 'Core functionality for voice communication' },
      { name: 'Camera', category: 'camera', riskLevel: 'medium', description: 'Access to camera for video calls', whyNeeded: 'For video chat functionality' },
      { name: 'Storage', category: 'storage', riskLevel: 'low', description: 'Access to storage for file sharing', whyNeeded: 'To share and download files' },
      { name: 'Network', category: 'network', riskLevel: 'low', description: 'Internet access', whyNeeded: 'To connect to Discord servers' },
      { name: 'Device', category: 'device', riskLevel: 'low', description: 'Access to device information', whyNeeded: 'For app optimization and notifications' }
    ],
    necessaryPermissions: ['Microphone', 'Storage', 'Network'],
    riskyPermissions: [],
    privacyScore: 80
  },
  {
    name: 'YouTube',
    icon: '📺',
    description: 'Video sharing and streaming platform',
    ageRecommendation: '13+',
    platform: 'both',
    permissions: [
      { name: 'Camera', category: 'camera', riskLevel: 'medium', description: 'Access to camera for video creation', whyNeeded: 'To create and upload videos' },
      { name: 'Microphone', category: 'microphone', riskLevel: 'medium', description: 'Access to microphone for video audio', whyNeeded: 'Required for video content with sound' },
      { name: 'Storage', category: 'storage', riskLevel: 'low', description: 'Access to storage for offline videos', whyNeeded: 'To download videos for offline viewing' },
      { name: 'Network', category: 'network', riskLevel: 'low', description: 'Internet access', whyNeeded: 'To stream and upload videos' },
      { name: 'Device', category: 'device', riskLevel: 'low', description: 'Access to device information', whyNeeded: 'For app optimization and recommendations' }
    ],
    necessaryPermissions: ['Storage', 'Network'],
    riskyPermissions: [],
    privacyScore: 85
  }
];

const AppPermissionsAnalyzer: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android'>('ios');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonApps, setComparisonApps] = useState<AppData[]>([]);

  const handleAppSelect = (app: AppData) => {
    setSelectedApp(app);
    setShowComparison(false);
  };

  const handleCompareApps = () => {
    if (comparisonApps.length >= 2) {
      setShowComparison(true);
    }
  };

  const addToComparison = (app: AppData): void => {
    if (!comparisonApps.find(a => a.name === app.name) && comparisonApps.length < 3) {
      setComparisonApps([...comparisonApps, app]);
    }
  };

  const removeFromComparison = (appName: string): void => {
    setComparisonApps(comparisonApps.filter(app => app.name !== appName));
  };

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
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


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">App Permissions Analyzer</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Understand what permissions apps request and learn how to protect your privacy. 
          Perfect for teens learning about digital privacy and security.
        </p>
      </div>

      {/* Platform Selector */}
      <div className="mb-8">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedPlatform('ios')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedPlatform === 'ios'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📱 iOS Guide
          </button>
          <button
            onClick={() => setSelectedPlatform('android')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedPlatform === 'android'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🤖 Android Guide
          </button>
        </div>
      </div>

      {/* App Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Apps Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Card key={app.name} className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{app.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-600">{app.ageRecommendation}</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(app.privacyScore)}`}>
                    {app.privacyScore}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{app.description}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleAppSelect(app)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => addToComparison(app)}
                    disabled={comparisonApps.length >= 3 || comparisonApps.find(a => a.name === app.name) !== undefined}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Compare
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison Section */}
      {comparisonApps.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">App Comparison</h2>
            <button
              onClick={handleCompareApps}
              disabled={comparisonApps.length < 2}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compare Apps ({comparisonApps.length}/3)
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {comparisonApps.map((app) => (
              <div key={app.name} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <span className="text-lg">{app.icon}</span>
                <span className="font-medium">{app.name}</span>
                <button
                  onClick={() => removeFromComparison(app.name)}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected App Analysis */}
      {selectedApp && !showComparison && (
        <div className="space-y-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{selectedApp.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedApp.name}</h2>
                    <p className="text-gray-600">{selectedApp.description}</p>
                    <p className="text-sm text-gray-500">Age Recommendation: {selectedApp.ageRecommendation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(selectedApp.privacyScore)}`}>
                    {selectedApp.privacyScore}
                  </div>
                  <p className="text-sm text-gray-600">Privacy Score</p>
                </div>
              </div>

              {/* Permissions Analysis */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Permission Analysis</h3>
                <div className="space-y-4">
                  {selectedApp.permissions.map((permission, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{permission.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(permission.riskLevel)}`}>
                          {permission.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{permission.description}</p>
                      {permission.whyNeeded && (
                        <p className="text-sm text-blue-600 mb-2">
                          <strong>Why needed:</strong> {permission.whyNeeded}
                        </p>
                      )}
                      {permission.alternatives && permission.alternatives.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Alternatives:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {permission.alternatives.map((alternative, altIndex) => (
                              <li key={altIndex}>{alternative}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform-specific Guide */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  How to Change Permissions - {selectedPlatform === 'ios' ? 'iOS' : 'Android'}
                </h3>
                <div className="space-y-4">
                  {selectedPlatform === 'ios' ? (
                    <>
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-600 font-bold">1.</span>
                        <div>
                          <p className="font-medium">Open Settings</p>
                          <p className="text-gray-600">Go to Settings → Privacy & Security</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-600 font-bold">2.</span>
                        <div>
                          <p className="font-medium">Select Permission Type</p>
                          <p className="text-gray-600">Choose Camera, Microphone, Location, etc.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-600 font-bold">3.</span>
                        <div>
                          <p className="font-medium">Find {selectedApp.name}</p>
                          <p className="text-gray-600">Toggle the switch to disable access</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start space-x-3">
                        <span className="text-green-600 font-bold">1.</span>
                        <div>
                          <p className="font-medium">Open Settings</p>
                          <p className="text-gray-600">Go to Settings → Apps & notifications</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-green-600 font-bold">2.</span>
                        <div>
                          <p className="font-medium">Find {selectedApp.name}</p>
                          <p className="text-gray-600">Tap on the app name</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-green-600 font-bold">3.</span>
                        <div>
                          <p className="font-medium">Manage Permissions</p>
                          <p className="text-gray-600">Tap "Permissions" and toggle off unwanted permissions</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Comparison View */}
      {showComparison && (
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">App Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">App</th>
                    <th className="text-left py-3 px-4 font-semibold">Privacy Score</th>
                    <th className="text-left py-3 px-4 font-semibold">Total Permissions</th>
                    <th className="text-left py-3 px-4 font-semibold">High Risk</th>
                    <th className="text-left py-3 px-4 font-semibold">Medium Risk</th>
                    <th className="text-left py-3 px-4 font-semibold">Low Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonApps.map((app) => (
                    <tr key={app.name} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{app.icon}</span>
                          <span className="font-medium">{app.name}</span>
                        </div>
                      </td>
                      <td className={`py-3 px-4 font-bold ${getScoreColor(app.privacyScore)}`}>
                        {app.privacyScore}
                      </td>
                      <td className="py-3 px-4">{app.permissions.length}</td>
                      <td className="py-3 px-4 text-red-600">
                        {app.permissions.filter(p => p.riskLevel === 'high').length}
                      </td>
                      <td className="py-3 px-4 text-yellow-600">
                        {app.permissions.filter(p => p.riskLevel === 'medium').length}
                      </td>
                      <td className="py-3 px-4 text-green-600">
                        {app.permissions.filter(p => p.riskLevel === 'low').length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Educational Tips */}
      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Tips for Teens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔒 Permission Best Practices</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Only grant permissions that are necessary for core app functionality</li>
                <li>• Regularly review and revoke unused permissions</li>
                <li>• Be cautious with location and contact permissions</li>
                <li>• Use app settings to limit data sharing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📱 Platform Differences</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• iOS: More granular permission controls</li>
                <li>• Android: Permission groups and runtime requests</li>
                <li>• Both platforms allow permission revocation</li>
                <li>• Check app privacy labels before downloading</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AppPermissionsAnalyzer;