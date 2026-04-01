import React, { useState } from 'react';
import { ArrowLeft, Footprints, CheckCircle, Eye, Globe } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface DigitalFootprintVisualizerProps {
  onBack: () => void;
}

const DigitalFootprintVisualizer: React.FC<DigitalFootprintVisualizerProps> = ({ onBack }) => {
  const [activities, setActivities] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const onlineActivities = [
    { id: 'social', name: 'Posted on social media', icon: '📱', footprint: 'Your posts can be seen by friends, advertisers, and sometimes the public.' },
    { id: 'search', name: 'Searched for something', icon: '🔍', footprint: 'Search engines track your queries to personalize results and ads.' },
    { id: 'shop', name: 'Browsed online store', icon: '🛒', footprint: 'Shopping sites track what you view to show targeted recommendations.' },
    { id: 'video', name: 'Watched videos', icon: '📺', footprint: 'Streaming services remember your viewing history and preferences.' },
    { id: 'game', name: 'Played online game', icon: '🎮', footprint: 'Game platforms track your play time, achievements, and in-game purchases.' },
    { id: 'email', name: 'Sent an email', icon: '📧', footprint: 'Email providers may scan content for advertising purposes.' },
    { id: 'location', name: 'Shared location', icon: '📍', footprint: 'Location data creates a map of everywhere you go.' },
    { id: 'photo', name: 'Uploaded a photo', icon: '📷', footprint: 'Photos contain metadata like location and device information.' }
  ];

  const toggleActivity = (id: string) => {
    if (activities.includes(id)) {
      setActivities(activities.filter(a => a !== id));
    } else {
      setActivities([...activities, id]);
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    recordGameCompletion(
      'digital-footprint',
      'Digital Footprint Visualizer',
      Math.round((activities.length / onlineActivities.length) * 100),
      100,
      { activitiesExplored: activities.length }
    );
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <ArrowLeft size={20} /><span>Back to Learning Hub</span>
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Great Exploration! 👣</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You explored {activities.length} online activities and learned how they contribute to your digital footprint.
            </p>
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-3">Key Takeaways:</h3>
              <ul className="space-y-2 text-teal-700 dark:text-teal-300 text-sm">
                <li>• Every online action leaves a trace</li>
                <li>• Companies collect data to personalize experiences</li>
                <li>• You can control some of your footprint with privacy settings</li>
                <li>• Think before you post - your digital footprint can last forever</li>
              </ul>
            </div>
            <button onClick={onBack} className="bg-teal-600 text-white px-6 py-3 rounded-lg">Back to Learning Hub</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <ArrowLeft size={20} /><span>Back to Learning Hub</span>
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Footprints className="text-teal-600 dark:text-teal-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Digital Footprint Visualizer 👣</h1>
            <p className="text-gray-600 dark:text-gray-300">See how your online activities create a digital footprint</p>
          </div>

          {/* Footprint Visualization */}
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Globe className="text-blue-600 dark:text-blue-400" size={24} />
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Digital Footprint</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 min-h-[100px]">
              {activities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Select activities below to see your footprint grow...
                </p>
              ) : (
                activities.map(id => {
                  const activity = onlineActivities.find(a => a.id === id);
                  return activity ? (
                    <div key={id} className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 shadow-sm flex items-center space-x-2">
                      <span className="text-xl">{activity.icon}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{activity.name}</span>
                    </div>
                  ) : null;
                })
              )}
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Footprint size: {activities.length} / {onlineActivities.length} activities
              </span>
            </div>
          </div>

          {/* Activity Selection */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Select activities you've done online:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {onlineActivities.map(activity => (
                <button
                  key={activity.id}
                  onClick={() => toggleActivity(activity.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activities.includes(activity.id)
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-teal-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{activity.icon}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{activity.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Footprint Details */}
          {activities.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <Eye className="text-yellow-600 dark:text-yellow-400 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">What companies can see:</h4>
                  <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                    {activities.map(id => {
                      const activity = onlineActivities.find(a => a.id === id);
                      return activity ? (
                        <li key={id}>• {activity.footprint}</li>
                      ) : null;
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleComplete}
              disabled={activities.length < 3}
              className={`px-6 py-3 rounded-lg transition-colors ${
                activities.length >= 3
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {activities.length >= 3 ? 'Complete Exploration' : `Select ${3 - activities.length} more activities`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalFootprintVisualizer;

