'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FileText, 
  Calendar,
  ChevronRight,
  Users,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    applications: 0,
    savedJobs: 0,
    eventsRegistered: 0,
    connections: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUserData();
    fetchDashboardStats();
    fetchRecentActivity();
    fetchNotifications();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Stats response:', res.data);
      setStats(res.data);
      console.log('Stats state updated to:', res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Set default stats on error
      setStats({
        applications: 0,
        applicationsChange: 0,
        savedJobs: 0,
        savedJobsChange: 0,
        eventsRegistered: 0,
        eventsChange: 0,
        connections: 0,
        connectionsChange: 0
      });
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/dashboard/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Activity response:', res.data);
      
      if (res.data && res.data.length > 0) {
        setRecentActivity(res.data);
      } else {
        // No activities yet - show empty state
        setRecentActivity([]);
      }
    } catch (err) {
      console.error('Error fetching activity:', err);
      // Show empty state on error
      setRecentActivity([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Notifications response:', res.data);
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'job_application':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'event_registration':
        return <Calendar className="w-4 h-4 text-green-600" />;
      case 'document_download':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'connection':
        return <Users className="w-4 h-4 text-orange-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type) => {
    switch(type) {
      case 'job_application':
        return 'bg-blue-100';
      case 'event_registration':
        return 'bg-green-100';
      case 'document_download':
        return 'bg-purple-100';
      case 'connection':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar */}
        <UserNavbar 
          onMenuClick={() => setSidebarOpen(true)} 
          user={user}
        />

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your KEA account today.</p>
          </div>

          {/* User Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your summary</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Job Applications</p>
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.applications}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.applicationsChange >= 0 ? '+' : ''}{stats.applicationsChange}% from last month
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Saved Jobs</p>
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.savedJobs}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.savedJobsChange >= 0 ? '+' : ''}{stats.savedJobsChange}% from last month
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Events Registered</p>
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.eventsRegistered}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.eventsChange >= 0 ? '+' : ''}{stats.eventsChange}% from last month
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Connections</p>
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.connections}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.connectionsChange >= 0 ? '+' : ''}{stats.connectionsChange}% from last month
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Actions & Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/dashboard/documents"
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">Upload resume</p>
                      <p className="text-sm text-gray-600">Add or update resume</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                  </Link>

                  <Link
                    href="/dashboard/groups"
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">Job groups</p>
                      <p className="text-sm text-gray-600">Browse groups</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-green-600" />
                  </Link>
                </div>

                <div className="mt-4">
                  <Link
                    href="/dashboard/knowledge"
                    className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">Explore KEA Knowledge Hub</p>
                      <p className="text-sm text-gray-600">Open knowledge hub</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-purple-600" />
                  </Link>
                </div>
              </div>

              {/* KEA Membership Feedback */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">KEA membership feedback</h3>
                <p className="text-sm text-gray-600 mb-4">Help us improve your experience</p>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/feedback?type=membership"
                    className="block w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">Feedback on membership experience</p>
                  </Link>
                  <Link
                    href="/dashboard/feedback?type=feature"
                    className="block w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">Feature request</p>
                  </Link>
                  <Link
                    href="/dashboard/feedback"
                    className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Submit any other feedback
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Recent Activity & Profile */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recent activity <span className="text-sm font-normal text-gray-500">(Latest updates)</span>
                </h3>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center shrink-0`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{getTimeAgo(activity.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-500 mb-1">No recent activity</p>
                      <p className="text-xs text-gray-400">Start applying for jobs or registering for events!</p>
                    </div>
                  )}
                </div>

                {recentActivity.length > 0 && (
                  <Link
                    href="/dashboard/activity"
                    className="block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View my full activity
                  </Link>
                )}
              </div>

              {/* Profile Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Profile</h3>
                  <Link
                    href="/dashboard/profile"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Manage →
                  </Link>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {user?.profile?.bio ? (
                    user.profile.bio.substring(0, 120) + (user.profile.bio.length > 120 ? '...' : '')
                  ) : (
                    'Improve your profile and update basic information to showcase your skills and expertise among engineers.'
                  )}
                </p>
                <Link
                  href="/dashboard/profile"
                  className="block w-full py-2 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Update profile
                </Link>
              </div>

              {/* Dynamic Notifications */}
              {notifications.length > 0 && notifications.slice(0, 2).map((notification, index) => (
                <div 
                  key={index}
                  className={`rounded-lg border p-6 ${
                    notification.type === 'success' ? 'bg-green-50 border-green-200' :
                    notification.type === 'info' ? 'bg-blue-50 border-blue-200' :
                    notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <h3 className={`text-sm font-bold mb-2 ${
                    notification.type === 'success' ? 'text-green-900' :
                    notification.type === 'info' ? 'text-blue-900' :
                    notification.type === 'warning' ? 'text-yellow-900' :
                    'text-gray-900'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className={`text-sm ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'info' ? 'text-blue-800' :
                    notification.type === 'warning' ? 'text-yellow-800' :
                    'text-gray-800'
                  }`}>
                    {notification.message}
                  </p>
                </div>
              ))}

              {/* Default Notifications if none exist */}
              {notifications.length === 0 && (
                <>
                  <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                    <h3 className="text-sm font-bold text-green-900 mb-2">Membership Active</h3>
                    <p className="text-sm text-green-800">Your KEA membership is active and in good standing.</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <h3 className="text-sm font-bold text-blue-900 mb-2">Welcome to KEA</h3>
                    <p className="text-sm text-blue-800">Start exploring resources and connect with fellow engineers.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}