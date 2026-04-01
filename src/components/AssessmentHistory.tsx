import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart3,
  ArrowRight,
  Target,
  Award
} from 'lucide-react';
import { type AssessmentResult } from '../lib/familyPrivacyAssessment';

interface AssessmentHistoryEntry {
  result: AssessmentResult;
  completedAt: string;
}

const AssessmentHistory: React.FC = () => {
  const [history, setHistory] = useState<AssessmentHistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<AssessmentHistoryEntry | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('pandagarde_assessment_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sort by date, most recent first
        const sorted = parsed.sort((a: AssessmentHistoryEntry, b: AssessmentHistoryEntry) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
        setHistory(sorted);
        if (sorted.length > 0 && !selectedEntry) {
          setSelectedEntry(sorted[0]);
        }
      }
    } catch (error) {
      console.error('Error loading assessment history:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreChange = (current: number, previous?: number) => {
    if (!previous) {return null;}
    const change = current - previous;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) {return 'text-green-600 dark:text-green-400';}
    if (score >= 50) {return 'text-yellow-600 dark:text-yellow-400';}
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (history.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Assessment History
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Complete your first privacy assessment to start tracking your progress.
        </p>
        <Link
          to="/privacy-assessment"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <span>Take Assessment</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const latestEntry = history[0];
  const previousEntry = history.length > 1 ? history[1] : null;
  const scoreChange = getScoreChange(
    latestEntry.result.overallScore,
    previousEntry?.result.overallScore
  );

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Assessment History
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Track your privacy practices over time
            </p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(latestEntry.result.overallScore)}`}>
              {latestEntry.result.overallScore}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Latest Score</div>
            {scoreChange && (
              <div className={`mt-2 flex items-center justify-center space-x-1 text-sm font-medium ${
                scoreChange.direction === 'up' ? 'text-green-600 dark:text-green-400' :
                scoreChange.direction === 'down' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {scoreChange.direction === 'up' && <TrendingUp className="h-4 w-4" />}
                {scoreChange.direction === 'down' && <TrendingDown className="h-4 w-4" />}
                {scoreChange.direction === 'same' && <Minus className="h-4 w-4" />}
                <span>{scoreChange.value} points</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {history.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Assessments</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(latestEntry.result.overallScore)}`}>
              {latestEntry.result.overallScore}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Score</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              history.length > 1 ? getScoreColor(
                Math.max(...history.map(h => h.result.overallScore))
              ) : 'text-gray-600 dark:text-gray-400'
            }`}>
              {history.length > 1 ? Math.max(...history.map(h => h.result.overallScore)) : '—'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Best Score</div>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Assessment Timeline</span>
        </h3>
        <div className="space-y-4">
          {history.map((entry, index) => {
            const isSelected = selectedEntry?.completedAt === entry.completedAt;
            const previousScore = index < history.length - 1 
              ? history[index + 1].result.overallScore 
              : null;
            const change = getScoreChange(entry.result.overallScore, previousScore);

            return (
              <div
                key={entry.completedAt}
                onClick={() => setSelectedEntry(entry)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(entry.result.overallScore)}`}>
                        {entry.result.overallScore}
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full mt-1 ${getRiskColor(entry.result.riskLevel)}`}>
                        {entry.result.riskLevel}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(entry.completedAt)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {Object.keys(entry.result.categoryScores).length} categories assessed
                      </div>
                    </div>
                  </div>
                  {change && (
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      change.direction === 'up' ? 'text-green-600 dark:text-green-400' :
                      change.direction === 'down' ? 'text-red-600 dark:text-red-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {change.direction === 'up' && <TrendingUp className="h-4 w-4" />}
                      {change.direction === 'down' && <TrendingDown className="h-4 w-4" />}
                      {change.direction === 'same' && <Minus className="h-4 w-4" />}
                      <span>{change.value}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Entry Details */}
      {selectedEntry && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Assessment Details</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({formatDate(selectedEntry.completedAt)})
            </span>
          </h3>

          {/* Category Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(selectedEntry.result.categoryScores).map(([category, score]) => (
              <div
                key={category}
                className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {category.replace('-', ' ')}
                  </span>
                  <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                    {score}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      score >= 75 ? 'bg-green-500' :
                      score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedEntry.result.strengths.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {selectedEntry.result.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-800 dark:text-green-200">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEntry.result.weaknesses.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {selectedEntry.result.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm text-red-800 dark:text-red-200">
                      • {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/privacy-assessment"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Award className="h-4 w-4" />
          <span>Take New Assessment</span>
        </Link>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all assessment history?')) {
              localStorage.removeItem('pandagarde_assessment_history');
              setHistory([]);
              setSelectedEntry(null);
            }
          }}
          className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Clear History
        </button>
      </div>
    </div>
  );
};

export default AssessmentHistory;

