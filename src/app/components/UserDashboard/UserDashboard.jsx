'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FileText, 
  Calendar,
  ChevronRight,
  Users,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Clock
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
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
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
      
      if (res.data && res.data.length > 0) {
        setRecentActivity(res.data);
      } else {
        setRecentActivity([]);
      }
    } catch (err) {
      console.error('Error fetching activity:', err);
      setRecentActivity([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'job_application':
        return <Briefcase className="w-4 h-4" />;
      case 'event_registration':
        return <Calendar className="w-4 h-4" />;
      case 'document_download':
        return <FileText className="w-4 h-4" />;
      case 'connection':
        return <Users className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'job_application':
        return 'from-blue-500 to-blue-600';
      case 'event_registration':
        return 'from-green-500 to-green-600';
      case 'document_download':
        return 'from-purple-500 to-purple-600';
      case 'connection':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-teal-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-teal-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 flex">
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
        <div className="p-6 max-w-7xl mx-auto">
          {/* Welcome Message with Gradient */}
          <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D2847] to-[#1a3a5c] p-8 shadow-xl">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user?.name?.split(' ')[0]}!
                </h1>
              </div>
              <p className="text-white text-opacity-90 text-sm">Here's what's happening with your KEA Profile today.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          </div>

          {/* Stats Cards with Enhanced Design */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Your Summary
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Job Applications Card */}
              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-10 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Job Applications</p>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stats.applications}</p>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className={`w-4 h-4 ${stats.applicationsChange >= 0 ? 'text-green-500' : 'text-red-500 rotate-90'}`} />
                    <p className={`text-sm font-semibold ${stats.applicationsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.applicationsChange >= 0 ? '+' : ''}{stats.applicationsChange}%
                    </p>
                    <p className="text-xs text-gray-500">from last month</p>
                  </div>
                </div>
              </div>

              {/* Saved Jobs Card */}
              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full opacity-10 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stats.savedJobs}</p>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className={`w-4 h-4 ${stats.savedJobsChange >= 0 ? 'text-green-500' : 'text-red-500 rotate-90'}`} />
                    <p className={`text-sm font-semibold ${stats.savedJobsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.savedJobsChange >= 0 ? '+' : ''}{stats.savedJobsChange}%
                    </p>
                    <p className="text-xs text-gray-500">from last month</p>
                  </div>
                </div>
              </div>

              {/* Events Card */}
              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full opacity-10 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Events Registered</p>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stats.eventsRegistered}</p>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className={`w-4 h-4 ${stats.eventsChange >= 0 ? 'text-green-500' : 'text-red-500 rotate-90'}`} />
                    <p className={`text-sm font-semibold ${stats.eventsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.eventsChange >= 0 ? '+' : ''}{stats.eventsChange}%
                    </p>
                    <p className="text-xs text-gray-500">from last month</p>
                  </div>
                </div>
              </div>

              {/* Connections Card */}
              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full opacity-10 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Connections</p>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stats.connections}</p>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className={`w-4 h-4 ${stats.connectionsChange >= 0 ? 'text-green-500' : 'text-red-500 rotate-90'}`} />
                    <p className={`text-sm font-semibold ${stats.connectionsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.connectionsChange >= 0 ? '+' : ''}{stats.connectionsChange}%
                    </p>
                    <p className="text-xs text-gray-500">from last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Single Column Layout */}
          <div className="space-y-6">
            {/* Quick Actions with Modern Design */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/dashboard/documents"
                  className="group relative overflow-hidden p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Upload Resume</p>
                      <p className="text-sm text-gray-600">Add or update resume</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/dashboard/groups"
                  className="group relative overflow-hidden p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Job Groups</p>
                      <p className="text-sm text-gray-600">Browse groups</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>

              <Link
                href="/dashboard/knowledge"
                className="group relative overflow-hidden mt-4 flex items-center justify-between p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200"
              >
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Explore KEA Knowledge Hub</p>
                  <p className="text-sm text-gray-600">Open knowledge hub</p>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">KEA Membership Feedback</h3>
              <p className="text-sm text-gray-600 mb-5">Help us improve your experience</p>
              <div className="space-y-3">
                <Link
                  href="/dashboard/feedback?type=membership"
                  className="block group p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 transition-all duration-300 border border-transparent hover:border-teal-200"
                >
                  <p className="text-sm font-medium text-gray-900 group-hover:text-teal-700">Feedback on membership experience</p>
                </Link>
                <Link
                  href="/dashboard/feedback?type=feature"
                  className="block group p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 transition-all duration-300 border border-transparent hover:border-teal-200"
                >
                  <p className="text-sm font-medium text-gray-900 group-hover:text-teal-700">Feature request</p>
                </Link>
                <Link
                  href="/dashboard/feedback"
                  className="block text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline"
                >
                  Submit any other feedback →
                </Link>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Profile</h3>
                <Link
                  href="/dashboard/profile"
                  className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                >
                  Manage →
                </Link>
              </div>
               <p className="text-sm text-gray-600 mb-5 leading-relaxed break-words overflow-wrap-anywhere">
                {user?.profile?.bio ? (
                  user.profile.bio.substring(0, 120) + (user.profile.bio.length > 120 ? '...' : '')
                ) : (
                  'Improve your profile and update basic information to showcase your skills and expertise among engineers.'
                )}
              </p>
              <Link
                href="/dashboard/profile"
                className="block w-full py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white text-center rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Update Profile
              </Link>
            </div>

            {/* Notifications */}
            {notifications.length > 0 ? (
              notifications.slice(0, 2).map((notification, index) => (
                <div 
                  key={index}
                  className={`rounded-2xl shadow-lg p-6 border ${
                    notification.type === 'success' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' :
                    notification.type === 'info' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' :
                    notification.type === 'warning' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' :
                    'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
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
              ))
            ) : (
              <>
                
              </>
            )}
            
            {/* Recent Activity with Vertical Table Format */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center shrink-0 shadow-md text-white`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">No recent activity</p>
                  <p className="text-xs text-gray-500">Start applying for jobs or registering for events!</p>
                </div>
              )}

              {recentActivity.length > 0 && (
                <Link
                  href="/dashboard/activity"
                  className="block mt-5 text-sm text-center text-teal-600 hover:text-teal-700 font-semibold hover:underline"
                >
                  View full activity →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}