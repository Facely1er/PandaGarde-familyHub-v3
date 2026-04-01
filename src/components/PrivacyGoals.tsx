import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  X,
  Edit,
  Trash2,
  Award,
  ArrowRight
} from 'lucide-react';
import {
  privacyGoalManager,
  type PrivacyGoal
} from '../lib/privacyGoals';
import { type AssessmentResult } from '../lib/familyPrivacyAssessment';

interface PrivacyGoalsProps {
  compact?: boolean;
  onGoalCreate?: (goal: PrivacyGoal) => void;
}

const PrivacyGoals: React.FC<PrivacyGoalsProps> = ({ compact = false, onGoalCreate }) => {
  const [goals, setGoals] = useState<PrivacyGoal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<PrivacyGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'overall' as PrivacyGoal['category'],
    targetScore: 75,
    targetDate: '',
    actionItems: [''] as string[],
    resources: [] as Array<{ label: string; url: string }>
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const allGoals = privacyGoalManager.getGoals();
    // Update statuses
    const updatedGoals = allGoals.map(goal => {
      const targetDate = new Date(goal.targetDate);
      const now = new Date();
      let status = goal.status;
      
      if (goal.status !== 'completed') {
        if (targetDate < now) {
          status = 'overdue';
        } else {
          status = 'active';
        }
      }
      
      return { ...goal, status };
    });
    setGoals(updatedGoals);
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) {return;}

    const goal = privacyGoalManager.createGoal({
      ...newGoal,
      actionItems: newGoal.actionItems.filter(item => item.trim() !== '')
    });

    setGoals([...goals, goal]);
    setShowCreateModal(false);
    setNewGoal({
      title: '',
      description: '',
      category: 'overall',
      targetScore: 75,
      targetDate: '',
      actionItems: [''],
      resources: []
    });

    if (onGoalCreate) {
      onGoalCreate(goal);
    }
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<PrivacyGoal>) => {
    const updated = privacyGoalManager.updateGoal(goalId, updates);
    if (updated) {
      loadGoals();
      setEditingGoal(null);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      privacyGoalManager.deleteGoal(goalId);
      loadGoals();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data-sharing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'privacy-settings':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'online-behavior':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'device-security':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'parental-controls':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active' || g.status === 'overdue');
  const completedGoals = goals.filter(g => g.status === 'completed');

  if (compact) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-gray-900 dark:text-white">Privacy Goals</span>
          </div>
          <Link
            to="/privacy-goals"
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
          >
            View All →
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {activeGoals.length} active goal{activeGoals.length !== 1 ? 's' : ''}
        </p>
        {activeGoals.length > 0 && (
          <div className="space-y-2">
            {activeGoals.slice(0, 2).map(goal => (
              <div key={goal.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white sm:truncate break-words">
                    {goal.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Privacy Goals
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Set and track privacy improvement goals for your family
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Goals
          </h3>
          <div className="space-y-4">
            {activeGoals.map(goal => (
              <div
                key={goal.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {goal.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(goal.category)}`}>
                        {goal.category.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center space-x-1 ${getStatusColor(goal.status)}`}>
                        {getStatusIcon(goal.status)}
                        <span>{goal.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {goal.description}
                    </p>
                    {goal.targetScore && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <Target className="h-4 w-4" />
                        <span>Target Score: {goal.targetScore}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Items */}
                {goal.actionItems.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Action Items:
                    </h5>
                    <ul className="space-y-1">
                      {goal.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Update Progress Button */}
                <button
                  onClick={() => {
                    const newProgress = Math.min(100, goal.progress + 10);
                    handleUpdateGoal(goal.id, { progress: newProgress });
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  Update Progress
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span>Completed Goals</span>
          </h3>
          <div className="space-y-4">
            {completedGoals.map(goal => (
              <div
                key={goal.id}
                className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-900 dark:text-green-100">
                      {goal.title}
                    </span>
                  </div>
                  {goal.completedAt && (
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Completed {new Date(goal.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Goals Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first privacy goal to start tracking improvements.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Create Goal
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingGoal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingGoal(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingGoal?.title || newGoal.title}
                  onChange={(e) => editingGoal
                    ? setEditingGoal({ ...editingGoal, title: e.target.value })
                    : setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Improve Privacy Settings Score to 80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editingGoal?.description || newGoal.description}
                  onChange={(e) => editingGoal
                    ? setEditingGoal({ ...editingGoal, description: e.target.value })
                    : setNewGoal({ ...newGoal, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Describe what you want to achieve..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editingGoal?.category || newGoal.category}
                    onChange={(e) => editingGoal
                      ? setEditingGoal({ ...editingGoal, category: e.target.value as PrivacyGoal['category'] })
                      : setNewGoal({ ...newGoal, category: e.target.value as PrivacyGoal['category'] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="overall">Overall</option>
                    <option value="data-sharing">Data Sharing</option>
                    <option value="privacy-settings">Privacy Settings</option>
                    <option value="online-behavior">Online Behavior</option>
                    <option value="device-security">Device Security</option>
                    <option value="parental-controls">Parental Controls</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={editingGoal?.targetDate.split('T')[0] || newGoal.targetDate}
                    onChange={(e) => {
                      const dateValue = e.target.value ? new Date(e.target.value).toISOString() : '';
                      editingGoal
                        ? setEditingGoal({ ...editingGoal, targetDate: dateValue })
                        : setNewGoal({ ...newGoal, targetDate: dateValue });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {(editingGoal?.targetScore || newGoal.targetScore) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingGoal?.targetScore || newGoal.targetScore}
                    onChange={(e) => editingGoal
                      ? setEditingGoal({ ...editingGoal, targetScore: parseInt(e.target.value, 10) })
                      : setNewGoal({ ...newGoal, targetScore: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingGoal(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editingGoal) {
                      handleUpdateGoal(editingGoal.id, editingGoal);
                    } else {
                      handleCreateGoal();
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  {editingGoal ? 'Update' : 'Create'} Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyGoals;

