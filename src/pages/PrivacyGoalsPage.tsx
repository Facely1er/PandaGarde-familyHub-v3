import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Lightbulb } from 'lucide-react';
import PrivacyGoals from '../components/PrivacyGoals';
import { privacyGoalManager, type PrivacyGoal } from '../lib/privacyGoals';
import { type AssessmentResult } from '../lib/familyPrivacyAssessment';

const PrivacyGoalsPage: React.FC = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedGoals, setSuggestedGoals] = useState<Omit<PrivacyGoal, 'id' | 'createdAt' | 'status' | 'progress'>[]>([]);

  useEffect(() => {
    loadSuggestedGoals();
  }, []);

  const loadSuggestedGoals = () => {
    try {
      const stored = localStorage.getItem('pandagarde_assessment_history');
      if (stored) {
        const history = JSON.parse(stored);
        if (history.length > 0) {
          const latestAssessment = history[0].result;
          const suggestions = privacyGoalManager.generateSuggestedGoals(latestAssessment);
          setSuggestedGoals(suggestions);
        }
      }
    } catch (error) {
      console.error('Error loading suggested goals:', error);
    }
  };

  const handleCreateFromSuggestion = (suggestion: Omit<PrivacyGoal, 'id' | 'createdAt' | 'status' | 'progress'>) => {
    const goal = privacyGoalManager.createGoal(suggestion);
    setShowSuggestions(false);
    // Refresh the component by reloading
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/family-hub"
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Family Hub
            </Link>
            {suggestedGoals.length > 0 && (
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Lightbulb className="h-4 w-4" />
                <span>View Suggestions</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Privacy Goals
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Set and track privacy improvement goals for your family
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Goals */}
        {showSuggestions && suggestedGoals.length > 0 && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Suggested Goals Based on Your Assessment
                </h3>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {suggestedGoals.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {suggestion.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {suggestion.description}
                      </p>
                      {suggestion.targetScore && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Target: {suggestion.targetScore} | Due: {new Date(suggestion.targetDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleCreateFromSuggestion(suggestion)}
                      className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Create Goal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Goals Component */}
        <PrivacyGoals />
      </div>
    </div>
  );
};

export default PrivacyGoalsPage;

