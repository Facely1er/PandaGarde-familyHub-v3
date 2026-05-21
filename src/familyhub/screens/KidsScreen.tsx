import React, { lazy, Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Eye, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFamilyProgress } from '../../contexts/FamilyProgressContext';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';
import { HubScreenFallback } from '../lazyScreen';

const ChildProgressDetail = lazy(() => import('../../components/ChildProgressDetail'));

interface FamilyMember {
  id: number;
  name: string;
  age: number;
  role: string;
  privacyScore: number;
  completedActivities: number;
  badges: string[];
  lastActive: string;
}

type AgeGroupMeta = {
  range: '5-8' | '9-12' | '13-17';
  label: string;
  emoji: string;
  badgeClass: string;
};

function getAgeGroup(age: number): AgeGroupMeta | null {
  if (age >= 5 && age <= 8) {
    return {
      range: '5-8',
      label: 'Ages 5–8',
      emoji: '🐼',
      badgeClass:
        'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/50',
    };
  }
  if (age >= 9 && age <= 12) {
    return {
      range: '9-12',
      label: 'Ages 9–12',
      emoji: '🕵️',
      badgeClass:
        'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-900/50',
    };
  }
  if (age >= 13 && age <= 17) {
    return {
      range: '13-17',
      label: 'Ages 13–17',
      emoji: '🌐',
      badgeClass:
        'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/50',
    };
  }
  return null;
}

const KidsScreen: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useLocalStorage<FamilyMember[]>('pandagarde_family', []);
  const { calculateMemberScore } = useFamilyProgress();
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<FamilyMember | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [newMember, setNewMember] = useState({ name: '', age: 0, role: 'Child' });
  const addMemberTriggerRef = useRef<HTMLButtonElement>(null);

  const closeAddMember = () => setShowAddMember(false);
  const addDialogRef = useDialogFocusTrap({
    isOpen: showAddMember,
    onClose: closeAddMember,
    returnFocusRef: addMemberTriggerRef,
  });

  const closeRemoveConfirm = () => setMemberToRemove(null);
  const removeDialogRef = useDialogFocusTrap({
    isOpen: memberToRemove !== null,
    onClose: closeRemoveConfirm,
  });

  const addFamilyMember = () => {
    if (!newMember.name.trim() || newMember.age <= 0) {
      return;
    }

    const member: FamilyMember = {
      id: Date.now(),
      name: newMember.name,
      age: newMember.age,
      role: newMember.role,
      privacyScore: 0,
      completedActivities: 0,
      badges: [],
      lastActive: new Date().toISOString(),
    };

    setFamilyMembers([...familyMembers, member]);
    setNewMember({ name: '', age: 0, role: 'Child' });
    setShowAddMember(false);
  };

  const confirmRemoveFamilyMember = () => {
    if (!memberToRemove) {
      return;
    }
    setFamilyMembers(familyMembers.filter((member) => member.id !== memberToRemove.id));
    setMemberToRemove(null);
  };

  if (selectedChildId) {
    const selectedChild = familyMembers.find((m) => m.id === selectedChildId);
    if (selectedChild) {
      return (
        <Suspense fallback={<HubScreenFallback />}>
          <ChildProgressDetail
            memberId={selectedChild.id}
            memberName={selectedChild.name}
            memberAge={selectedChild.age}
            onBack={() => setSelectedChildId(null)}
          />
        </Suspense>
      );
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Family Members</h1>
        <button
          ref={addMemberTriggerRef}
          type="button"
          onClick={() => setShowAddMember(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors min-h-[44px]"
        >
          <Plus size={18} aria-hidden="true" />
          <span>Add Member</span>
        </button>
      </div>

      {familyMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-gray-400" size={32} aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Family Members Yet</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Add your first family member to start tracking progress together.
          </p>
          <button
            type="button"
            onClick={() => setShowAddMember(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold min-h-[44px]"
          >
            Add Your First Member
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {familyMembers.map((member) => {
            const ageGroup = getAgeGroup(member.age);
            return (
              <div
                key={member.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.role} &middot; Age {member.age}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                        Privacy Score: {calculateMemberScore(member.id)}/100
                      </p>
                      {ageGroup && (
                        <Link
                          to="/family-hub/activities"
                          state={{ initialAgeFilter: ageGroup.range }}
                          className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${ageGroup.badgeClass}`}
                          aria-label={`View ${ageGroup.label} activities for ${member.name}`}
                        >
                          <span aria-hidden="true">{ageGroup.emoji}</span>
                          {ageGroup.label} activities &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedChildId(member.id)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="View detailed progress"
                      aria-label={`View detailed progress for ${member.name}`}
                    >
                      <Eye size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMemberToRemove(member)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Remove family member"
                      aria-label={`Remove ${member.name} from family`}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeAddMember();
            }
          }}
        >
          <div
            ref={addDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-member-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 id="add-member-title" className="text-xl font-bold text-gray-900 dark:text-white">
                Add Family Member
              </h3>
              <button
                type="button"
                onClick={closeAddMember}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center text-3xl leading-none transition-colors"
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="member-name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  id="member-name"
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter family member's name"
                  maxLength={50}
                  autoFocus
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="member-age" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Age
                </label>
                <input
                  id="member-age"
                  type="number"
                  value={newMember.age || ''}
                  onChange={(e) => setNewMember({ ...newMember, age: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter age"
                  min="1"
                  max="100"
                  aria-required="true"
                />
                {newMember.age >= 5 && newMember.age <= 17 && (() => {
                  const g = getAgeGroup(newMember.age);
                  return g ? (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Age-matched activities: <span className="font-medium">{g.emoji} {g.label}</span>
                    </p>
                  ) : null;
                })()}
              </div>

              <div>
                <label htmlFor="member-role" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select
                  id="member-role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Teen">Teen</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeAddMember}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors min-h-[44px] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors min-h-[44px] font-medium"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {memberToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeRemoveConfirm();
            }
          }}
        >
          <div
            ref={removeDialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-member-title"
            aria-describedby="remove-member-desc"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <h3 id="remove-member-title" className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Remove {memberToRemove.name}?
            </h3>
            <p id="remove-member-desc" className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              This removes their profile and local progress on this device. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeRemoveConfirm}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors min-h-[44px] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemoveFamilyMember}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors min-h-[44px] font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidsScreen;
