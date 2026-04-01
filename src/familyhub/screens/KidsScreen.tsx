import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Eye, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFamilyProgress } from '../../contexts/FamilyProgressContext';
import ChildProgressDetail from '../../components/ChildProgressDetail';

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

const KidsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useLocalStorage<FamilyMember[]>('pandagarde_family', []);
  const { calculateMemberScore } = useFamilyProgress();
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [newMember, setNewMember] = useState({ name: '', age: 0, role: 'Child' });

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
      lastActive: new Date().toISOString()
    };
    
    setFamilyMembers([...familyMembers, member]);
    setNewMember({ name: '', age: 0, role: 'Child' });
    setShowAddMember(false);
  };

  const removeFamilyMember = (id: number) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  if (selectedChildId) {
    const selectedChild = familyMembers.find(m => m.id === selectedChildId);
    if (selectedChild) {
      return (
        <ChildProgressDetail
          memberId={selectedChild.id}
          memberName={selectedChild.name}
          memberAge={selectedChild.age}
          onBack={() => setSelectedChildId(null)}
        />
      );
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Family Members</h1>
        <button
          onClick={() => setShowAddMember(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors min-h-[44px]"
        >
          <Plus size={18} />
          <span>Add Member</span>
        </button>
      </div>

      {familyMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            No Family Members Yet
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Add your first family member to start tracking progress together.
          </p>
          <button
            onClick={() => setShowAddMember(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold min-h-[44px]"
          >
            Add Your First Member
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {familyMembers.map(member => (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center text-white text-lg font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.role} • Age {member.age}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Privacy Score: {calculateMemberScore(member.id)}/100
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedChildId(member.id)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="View detailed progress"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => removeFamilyMember(member.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Remove family member"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Family Member</h3>
              <button
                onClick={() => setShowAddMember(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter family member's name"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Age</label>
                <input
                  type="number"
                  value={newMember.age || ''}
                  onChange={(e) => setNewMember({...newMember, age: parseInt(e.target.value, 10) || 0})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter age"
                  min="1"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
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
                  onClick={() => setShowAddMember(false)}
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
    </div>
  );
};

export default KidsScreen;

