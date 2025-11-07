import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import { User, Mail, Phone, MapPin, Edit, Save, Lock, Trash2 } from 'lucide-react';

function Profile({ user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile/me');
      setProfile(response.data.user);
      setFormData({
        name: response.data.user.name,
        profile: {
          college: response.data.user.profile?.college || '',
          year: response.data.user.profile?.year || '',
          homeTown: response.data.user.profile?.homeTown || '',
          phone: response.data.user.profile?.phone || '',
          bio: response.data.user.profile?.bio || '',
          commuting: response.data.user.profile?.commuting || false
        }
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await api.patch('/profile/me', formData);
      setProfile(response.data.user);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      await api.patch('/profile/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm('Are you sure you want to request account deletion? This action requires admin approval.')) return;
    
    try {
      await api.post('/profile/me/delete-request');
      toast.success('Account deletion requested. Admin approval required.');
    } catch (error) {
      toast.error('Failed to request account deletion');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
        <Header user={user} onLogout={onLogout} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/80">Manage your account settings</p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
                <p className="text-gray-600 capitalize">{profile?.role}</p>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                  <input
                    type="text"
                    value={formData.profile?.college}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, college: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.profile?.year}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, year: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.profile?.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, phone: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home Town</label>
                  <input
                    type="text"
                    value={formData.profile?.homeTown}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, homeTown: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.profile?.bio}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: { ...formData.profile, bio: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="commuting"
                  checked={formData.profile?.commuting}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: { ...formData.profile, commuting: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                />
                <label htmlFor="commuting" className="ml-2 text-sm text-gray-700">
                  I am a commuting student
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{profile?.email}</p>
                  </div>
                </div>
                {profile?.profile?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{profile.profile.phone}</p>
                    </div>
                  </div>
                )}
                {profile?.profile?.college && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">College</p>
                      <p className="font-semibold">{profile.profile.college}</p>
                    </div>
                  </div>
                )}
                {profile?.profile?.homeTown && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Home Town</p>
                      <p className="font-semibold">{profile.profile.homeTown}</p>
                    </div>
                  </div>
                )}
              </div>
              {profile?.profile?.bio && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bio</p>
                  <p className="text-gray-800">{profile.profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Password Change */}
        <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Change Password</span>
            </h3>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>
          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all"
              >
                Update Password
              </button>
            </form>
          )}
        </div>

        {/* Account Deletion */}
        <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Trash2 className="w-5 h-5 text-red-600" />
            <span>Danger Zone</span>
          </h3>
          <p className="text-gray-600 mb-4">
            Request account deletion. This action requires admin approval and cannot be undone.
          </p>
          <button
            onClick={handleDeleteRequest}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
          >
            Request Account Deletion
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

