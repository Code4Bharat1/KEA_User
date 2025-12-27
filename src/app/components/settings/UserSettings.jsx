'use client';

import { useState, useEffect } from 'react';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function UserSettings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Account settings
  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    city: '',
    discipline: ''
  });

  // Notification settings
  const [notificationData, setNotificationData] = useState({
    email: true,
    jobUpdates: true,
    eventReminders: true,
    newsletter: true,
    communityActivity: true
  });

  // Privacy settings
  const [privacyData, setPrivacyData] = useState({
    profileVisibility: 'members',
    showEmail: false,
    showPhone: false
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Delete account
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.get(`${API_URL}/settings/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(data);
      setAccountData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        branch: data.profile?.branch || '',
        city: data.profile?.city || '',
        discipline: data.profile?.discipline || ''
      });

      if (data.settings?.notifications) {
        setNotificationData(data.settings.notifications);
      }

      if (data.settings?.privacy) {
        setPrivacyData(data.settings.privacy);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`${API_URL}/settings/user/account`, accountData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Account settings updated successfully!');
      fetchSettings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update account settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotifications = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`${API_URL}/settings/user/notifications`, notificationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Notification preferences updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrivacy = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`${API_URL}/settings/user/privacy`, privacyData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Privacy settings updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`${API_URL}/settings/user/password`, 
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteAccount = async () => {
  //   if (!deletePassword) {
  //     alert('Please enter your password to confirm deletion');
  //     return;
  //   }

  //   if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const token = localStorage.getItem('userToken');
  //     await axios.delete(`${API_URL}/settings/user/account`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       data: { password: deletePassword }
  //     });

  //     alert('Account deleted successfully');
  //     localStorage.removeItem('userToken');
  //     router.push('/');
  //   } catch (error) {
  //     alert(error.response?.data?.message || 'Failed to delete account');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">User settings</h1>
            <p className="text-sm text-gray-600 mb-6">
              Manage your account settings and security
            </p>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {/* <button
                  onClick={() => setActiveTab('account')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'account'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Account settings
                </button> */}
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'notifications'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Notification preferences
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'security'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Security & privacy
                </button>
              </div>

              <div className="p-6">
                {/* Account Settings Tab */}
                {/* {activeTab === 'account' && (
                  <form onSubmit={handleUpdateAccount} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account settings</h3>
                      <p className="text-sm text-gray-600 mb-6">Update your profile and personal details</p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                          <input
                            type="text"
                            value={accountData.name}
                            onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                            <input
                              type="email"
                              value={accountData.email}
                              onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                            <input
                              type="tel"
                              value={accountData.phone}
                              onChange={(e) => setAccountData({...accountData, phone: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Branch / city</label>
                            <input
                              type="text"
                              value={accountData.branch}
                              onChange={(e) => setAccountData({...accountData, branch: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Engineering discipline</label>
                            <input
                              type="text"
                              value={accountData.discipline}
                              onChange={(e) => setAccountData({...accountData, discipline: e.target.value})}
                              placeholder="e.g., Civil Engineering"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          type="button"
                          onClick={() => fetchSettings()}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save changes</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )} */}

                {/* Notification Preferences Tab */}
                {activeTab === 'notifications' && (
                  <form onSubmit={handleUpdateNotifications} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification preferences</h3>
                      <p className="text-sm text-gray-600 mb-6">Choose how and when KEA contacts you</p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Email</p>
                            <p className="text-sm text-gray-600">Receive email notifications</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationData.email}
                              onChange={(e) => setNotificationData({...notificationData, email: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Job updates</p>
                            <p className="text-sm text-gray-600">New job postings and career opportunities</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationData.jobUpdates}
                              onChange={(e) => setNotificationData({...notificationData, jobUpdates: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Event reminders</p>
                            <p className="text-sm text-gray-600">Upcoming webinars, seminars, and KEA events</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationData.eventReminders}
                              onChange={(e) => setNotificationData({...notificationData, eventReminders: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">KEA newsletter</p>
                            <p className="text-sm text-gray-600">Monthly updates and important announcements</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationData.newsletter}
                              onChange={(e) => setNotificationData({...notificationData, newsletter: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium text-gray-900">Community activity</p>
                            <p className="text-sm text-gray-600">Forum replies, group updates, and community milestones</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationData.communityActivity}
                              onChange={(e) => setNotificationData({...notificationData, communityActivity: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>Update preferences</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Security & Privacy Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    {/* Privacy Settings */}
                    <form onSubmit={handleUpdatePrivacy}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & privacy</h3>
                      <p className="text-sm text-gray-600 mb-6">Control your password </p>

                      {/* <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile visibility</label>
                          <select
                            value={privacyData.profileVisibility}
                            onChange={(e) => setPrivacyData({...privacyData, profileVisibility: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="public">Public - Anyone can view</option>
                            <option value="members">Members only - Only KEA members</option>
                            <option value="private">Private - Only me</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Show email on profile</p>
                            <p className="text-sm text-gray-600">Display your email address publicly</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacyData.showEmail}
                              onChange={(e) => setPrivacyData({...privacyData, showEmail: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium text-gray-900">Show phone on profile</p>
                            <p className="text-sm text-gray-600">Display your phone number publicly</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacyData.showPhone}
                              onChange={(e) => setPrivacyData({...privacyData, showPhone: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>Update privacy</span>
                        </button>
                      </div> */}
                    </form>

                    {/* Change Password */}
                    <form onSubmit={handleChangePassword} className="border-t border-gray-200 pt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Change password</h3>

                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
                          <div className="relative">
                            <input
                              type={showPassword.current ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword.current ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                          <div className="relative">
                            <input
                              type={showPassword.new ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword.new ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
                          <div className="relative">
                            <input
                              type={showPassword.confirm ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword.confirm ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Change password
                        </button>
                      </div>
                    </form>

                    {/* Delete Account */}
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}