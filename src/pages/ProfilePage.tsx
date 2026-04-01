import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Shield, Save, Edit3, X, Download } from 'lucide-react';
import { useAuth } from './family-hub/AuthWrapper';
import { useToast } from '../contexts/ToastContext';
import ProgressExport from '../components/ProgressExport';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showProgressExport, setShowProgressExport] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: 'parent' as 'parent' | 'child',
    age: '',
    bio: ''
  });

  useEffect(() => {
    if (profile?.profile_data) {
      setFormData({
        firstName: profile.profile_data.firstName || '',
        lastName: profile.profile_data.lastName || '',
        role: profile.profile_data.role || 'parent',
        age: profile.profile_data.age?.toString() || '',
        bio: profile.profile_data.bio || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updates = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        bio: formData.bio
      };

      const { error } = await updateProfile(updates);
      
      if (error) {
        showError('Failed to update profile');
      } else {
        showSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('An error occurred while updating your profile');
    }
  };

  const handleCancel = () => {
    if (profile?.profile_data) {
      setFormData({
        firstName: profile.profile_data.firstName || '',
        lastName: profile.profile_data.lastName || '',
        role: profile.profile_data.role || 'parent',
        age: profile.profile_data.age?.toString() || '',
        bio: profile.profile_data.bio || ''
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
            <button 
              onClick={() => navigate('/')}
              className="cta-button"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/family-hub"
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Family Hub
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProgressExport(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Export Progress
              </button>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 size={16} className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Profile Information
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your first name"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {profile?.profile_data?.firstName || 'Not set'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your last name"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {profile?.profile_data?.lastName || 'Not set'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      {isEditing ? (
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="parent">Parent</option>
                          <option value="child">Child</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 dark:text-white capitalize">
                          {profile?.profile_data?.role || 'Not set'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Age
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          min="5"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your age"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {profile?.profile_data?.age || 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Account Information
                    </h3>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail size={20} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                        <p className="text-gray-900 dark:text-white">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</p>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Shield size={20} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</p>
                        <p className="text-green-600 dark:text-green-400">Active</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {profile?.profile_data?.bio || 'No bio provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Export Modal */}
      {showProgressExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ProgressExport onClose={() => setShowProgressExport(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;