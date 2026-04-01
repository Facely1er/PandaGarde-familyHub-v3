import React, { useState, useEffect } from 'react';
import { Save, Download, CheckCircle, Plus, X, Calendar, Users, Shield, Settings, AlertCircle } from 'lucide-react';
import { useFamily } from '../../contexts/FamilyContext';

export interface FamilyPrivacyPlan {
  id?: string;
  familyId?: string;
  sharingRules: SharingRule[];
  safetyTools: SafetyTool[];
  privacyDaySchedule: PrivacyDaySchedule;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
}

export interface SharingRule {
  id: string;
  rule: string;
  appliesTo: string[]; // age groups or member IDs
  requiresApproval: boolean;
  approvedBy: string[]; // member IDs who can approve
}

export interface SafetyTool {
  id: string;
  name: string;
  category: 'password-manager' | 'vpn' | 'browser' | 'filter' | 'other';
  installed: boolean;
  configured: boolean;
}

export interface PrivacyDaySchedule {
  frequency: 'quarterly' | 'monthly' | 'custom';
  nextDate: Date | null;
  reminders: boolean;
  reminderDaysBefore: number;
}

interface FamilyPrivacyPlanBuilderProps {
  initialPlan?: FamilyPrivacyPlan;
  onSave?: (plan: FamilyPrivacyPlan) => void;
  onExport?: (plan: FamilyPrivacyPlan) => void;
}

const defaultSharingRules: Omit<SharingRule, 'id'>[] = [
  {
    rule: 'Photos must be approved by a parent before posting online',
    appliesTo: ['5-8', '9-12'],
    requiresApproval: true,
    approvedBy: []
  },
  {
    rule: 'No sharing of home address, school name, or location',
    appliesTo: ['5-8', '9-12', '13-17'],
    requiresApproval: false,
    approvedBy: []
  },
  {
    rule: 'Ask before downloading new apps or games',
    appliesTo: ['5-8', '9-12'],
    requiresApproval: true,
    approvedBy: []
  },
  {
    rule: 'No sharing passwords with friends',
    appliesTo: ['5-8', '9-12', '13-17'],
    requiresApproval: false,
    approvedBy: []
  }
];

const defaultSafetyTools: Omit<SafetyTool, 'id'>[] = [
  { name: 'Family Password Manager', category: 'password-manager', installed: false, configured: false },
  { name: 'Privacy-Focused Browser', category: 'browser', installed: false, configured: false },
  { name: 'VPN for Public Wi-Fi', category: 'vpn', installed: false, configured: false },
  { name: 'Content Filter', category: 'filter', installed: false, configured: false }
];

export const FamilyPrivacyPlanBuilder: React.FC<FamilyPrivacyPlanBuilderProps> = ({
  initialPlan,
  onSave,
  onExport
}) => {
  const { currentFamily, familyMembers } = useFamily();
  const [plan, setPlan] = useState<FamilyPrivacyPlan>(() => {
    if (initialPlan) {return initialPlan;}
    
    // Load from localStorage if available
    const saved = localStorage.getItem('pandagarde-family-privacy-plan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          privacyDaySchedule: {
            ...parsed.privacyDaySchedule,
            nextDate: parsed.privacyDaySchedule.nextDate ? new Date(parsed.privacyDaySchedule.nextDate) : null
          }
        };
      } catch (e) {
        console.error('Error loading saved plan:', e);
      }
    }
    
    // Default plan
    return {
      sharingRules: defaultSharingRules.map((rule, idx) => ({
        ...rule,
        id: `rule-${idx + 1}`
      })),
      safetyTools: defaultSafetyTools.map((tool, idx) => ({
        ...tool,
        id: `tool-${idx + 1}`
      })),
      privacyDaySchedule: {
        frequency: 'quarterly',
        nextDate: null,
        reminders: true,
        reminderDaysBefore: 7
      },
      version: 1
    };
  });

  const [newRule, setNewRule] = useState('');
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [showAddRule, setShowAddRule] = useState(false);
  const [saved, setSaved] = useState(false);

  // Get parent members for approval selection
  const parentMembers = familyMembers.filter(m => m.role === 'parent');

  useEffect(() => {
    // Auto-save to localStorage
    const timer = setTimeout(() => {
      localStorage.setItem('pandagarde-family-privacy-plan', JSON.stringify(plan));
    }, 500);
    return () => clearTimeout(timer);
  }, [plan]);

  const handleSave = () => {
    const updatedPlan: FamilyPrivacyPlan = {
      ...plan,
      familyId: currentFamily?.id,
      updatedAt: new Date(),
      version: (plan.version || 1) + 1
    };
    
    setPlan(updatedPlan);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    if (onSave) {
      onSave(updatedPlan);
    }
  };

  const handleExport = () => {
    const planText = generatePlanText(plan);
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `family-privacy-plan-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    if (onExport) {
      onExport(plan);
    }
  };

  const generatePlanText = (plan: FamilyPrivacyPlan): string => {
    let text = 'FAMILY PRIVACY PLAN\n';
    text += '==================\n\n';
    text += `Created: ${plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}\n`;
    text += `Last Updated: ${plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}\n`;
    text += `Version: ${plan.version || 1}\n\n`;
    
    text += 'SHARING RULES\n';
    text += '-------------\n';
    plan.sharingRules.forEach((rule, idx) => {
      text += `${idx + 1}. ${rule.rule}\n`;
      text += `   Applies to: ${rule.appliesTo.join(', ')}\n`;
      if (rule.requiresApproval) {
        text += `   Requires approval: Yes\n`;
      }
      text += '\n';
    });
    
    text += '\nSAFETY TOOLS\n';
    text += '------------\n';
    plan.safetyTools.forEach((tool, idx) => {
      text += `${idx + 1}. ${tool.name} (${tool.category})\n`;
      text += `   Installed: ${tool.installed ? 'Yes' : 'No'}\n`;
      text += `   Configured: ${tool.configured ? 'Yes' : 'No'}\n\n`;
    });
    
    text += '\nPRIVACY DAY SCHEDULE\n';
    text += '--------------------\n';
    text += `Frequency: ${plan.privacyDaySchedule.frequency}\n`;
    if (plan.privacyDaySchedule.nextDate) {
      text += `Next Privacy Day: ${plan.privacyDaySchedule.nextDate.toLocaleDateString()}\n`;
    }
    text += `Reminders: ${plan.privacyDaySchedule.reminders ? 'Yes' : 'No'}\n`;
    if (plan.privacyDaySchedule.reminders) {
      text += `Reminder Days Before: ${plan.privacyDaySchedule.reminderDaysBefore}\n`;
    }
    
    return text;
  };

  const addSharingRule = () => {
    if (!newRule.trim()) {return;}
    
    const rule: SharingRule = {
      id: `rule-${Date.now()}`,
      rule: newRule,
      appliesTo: selectedAgeGroups.length > 0 ? selectedAgeGroups : ['all'],
      requiresApproval: false,
      approvedBy: []
    };
    
    setPlan({
      ...plan,
      sharingRules: [...plan.sharingRules, rule]
    });
    
    setNewRule('');
    setSelectedAgeGroups([]);
    setShowAddRule(false);
  };

  const removeSharingRule = (id: string) => {
    setPlan({
      ...plan,
      sharingRules: plan.sharingRules.filter(r => r.id !== id)
    });
  };

  const toggleSafetyTool = (id: string, field: 'installed' | 'configured') => {
    setPlan({
      ...plan,
      safetyTools: plan.safetyTools.map(tool =>
        tool.id === id ? { ...tool, [field]: !tool[field] } : tool
      )
    });
  };

  const calculateNextPrivacyDay = (frequency: 'quarterly' | 'monthly' | 'custom', startDate: Date = new Date()): Date => {
    const next = new Date(startDate);
    if (frequency === 'quarterly') {
      next.setMonth(next.getMonth() + 3);
    } else if (frequency === 'monthly') {
      next.setMonth(next.getMonth() + 1);
    }
    return next;
  };

  const handleFrequencyChange = (frequency: 'quarterly' | 'monthly' | 'custom') => {
    const nextDate = frequency !== 'custom' ? calculateNextPrivacyDay(frequency) : null;
    setPlan({
      ...plan,
      privacyDaySchedule: {
        ...plan.privacyDaySchedule,
        frequency,
        nextDate
      }
    });
  };

  return (
    <div className="privacy-plan-builder bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
            Create Your Family Privacy Plan
          </h2>
          <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
            A family privacy plan works best when everyone helps create it
          </p>
        </div>
      </div>

      {/* Step 1: Sharing Rules */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <Users size={20} />
            Set Clear Sharing Rules
          </h3>
          <button
            onClick={() => setShowAddRule(!showAddRule)}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Add Rule
          </button>
        </div>

        {showAddRule && (
          <div className="mb-4 p-4 border border-gray-300 rounded-lg" style={{ backgroundColor: 'var(--light)' }}>
            <textarea
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Enter a new sharing rule..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
              rows={2}
            />
            <div className="flex items-center gap-4 mb-3">
              <label className="text-sm font-medium" style={{ color: 'var(--gray-700)' }}>
                Applies to:
              </label>
              {['5-8', '9-12', '13-17', 'all'].map(age => (
                <label key={age} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedAgeGroups.includes(age)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAgeGroups([...selectedAgeGroups, age]);
                      } else {
                        setSelectedAgeGroups(selectedAgeGroups.filter(a => a !== age));
                      }
                    }}
                    className="rounded"
                  />
                  <span>{age === 'all' ? 'All Ages' : `Ages ${age}`}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addSharingRule}
                disabled={!newRule.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Add Rule
              </button>
              <button
                onClick={() => {
                  setShowAddRule(false);
                  setNewRule('');
                  setSelectedAgeGroups([]);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {plan.sharingRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
              style={{ backgroundColor: 'var(--light)' }}
            >
              <div className="flex-1">
                <p className="font-medium mb-2" style={{ color: 'var(--gray-800)' }}>
                  {rule.rule}
                </p>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--gray-600)' }}>
                  <span>Applies to: {rule.appliesTo.join(', ')}</span>
                  {rule.requiresApproval && (
                    <span className="px-2 py-1 bg-yellow-100 rounded text-yellow-800 text-xs">
                      Requires Approval
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeSharingRule(rule.id)}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove rule"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Step 2: Safety Tools */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4" style={{ color: 'var(--primary)' }}>
          <Settings size={20} />
          Set Up Safety Tools
        </h3>
        <div className="space-y-3">
          {plan.safetyTools.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              style={{ backgroundColor: 'var(--light)' }}
            >
              <div className="flex-1">
                <h4 className="font-medium mb-1" style={{ color: 'var(--gray-800)' }}>
                  {tool.name}
                </h4>
                <p className="text-sm capitalize" style={{ color: 'var(--gray-600)' }}>
                  {tool.category.replace('-', ' ')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tool.installed}
                    onChange={() => toggleSafetyTool(tool.id, 'installed')}
                    className="rounded"
                  />
                  <span style={{ color: 'var(--gray-700)' }}>Installed</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tool.configured}
                    onChange={() => toggleSafetyTool(tool.id, 'configured')}
                    className="rounded"
                    disabled={!tool.installed}
                  />
                  <span style={{ color: 'var(--gray-700)' }}>Configured</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 3: Privacy Day Schedule */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4" style={{ color: 'var(--primary)' }}>
          <Calendar size={20} />
          Plan Regular Check-Ups
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
              Frequency
            </label>
            <select
              value={plan.privacyDaySchedule.frequency}
              onChange={(e) => handleFrequencyChange(e.target.value as 'quarterly' | 'monthly' | 'custom')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
            >
              <option value="quarterly">Every 3 months (Quarterly)</option>
              <option value="monthly">Every month</option>
              <option value="custom">Custom schedule</option>
            </select>
          </div>

          {plan.privacyDaySchedule.frequency !== 'custom' && plan.privacyDaySchedule.nextDate && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                Next Privacy Day
              </label>
              <input
                type="date"
                value={plan.privacyDaySchedule.nextDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  setPlan({
                    ...plan,
                    privacyDaySchedule: {
                      ...plan.privacyDaySchedule,
                      nextDate: new Date(e.target.value)
                    }
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={plan.privacyDaySchedule.reminders}
                onChange={(e) => {
                  setPlan({
                    ...plan,
                    privacyDaySchedule: {
                      ...plan.privacyDaySchedule,
                      reminders: e.target.checked
                    }
                  });
                }}
                className="rounded"
              />
              <span className="text-sm" style={{ color: 'var(--gray-700)' }}>
                Enable reminders
              </span>
            </label>
            {plan.privacyDaySchedule.reminders && (
              <div className="flex items-center gap-2">
                <label className="text-sm" style={{ color: 'var(--gray-700)' }}>
                  Remind me
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={plan.privacyDaySchedule.reminderDaysBefore}
                  onChange={(e) => {
                    setPlan({
                      ...plan,
                      privacyDaySchedule: {
                        ...plan.privacyDaySchedule,
                        reminderDaysBefore: parseInt(e.target.value, 10) || 7
                      }
                    });
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}
                />
                <span className="text-sm" style={{ color: 'var(--gray-700)' }}>
                  days before
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle size={16} />
              Plan saved!
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Save Plan
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyPrivacyPlanBuilder;

