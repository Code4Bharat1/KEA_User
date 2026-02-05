'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FileText, 
  Calendar,
  Users,
  TrendingUp,
  Filter,
  Download,
  Search
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function UserActivity() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'job_application', label: 'Job Applications' },
    { value: 'event_registration', label: 'Event Registrations' },
    { value: 'document_download', label: 'Documents' },
    { value: 'connection', label: 'Connections' },
    { value: 'profile_update', label: 'Profile Updates' }
  ];

  useEffect(() => {
    fetchUserData();
    fetchActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, filterType, searchQuery]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/dashboard/activity?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivities([]);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'job_application':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'event_registration':
        return <Calendar className="w-5 h-5 text-green-600" />;
      case 'document_download':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'connection':
        return <Users className="w-5 h-5 text-orange-600" />;
      case 'profile_update':
        return <TrendingUp className="w-5 h-5 text-teal-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type) => {
    switch(type) {
      case 'job_application':
        return 'bg-blue-50';
      case 'event_registration':
        return 'bg-green-50';
      case 'document_download':
        return 'bg-purple-50';
      case 'connection':
        return 'bg-orange-50';
      case 'profile_update':
        return 'bg-teal-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getActivityBorderColor = (type) => {
    switch(type) {
      case 'job_application':
        return 'border-blue-200';
      case 'event_registration':
        return 'border-green-200';
      case 'document_download':
        return 'border-purple-200';
      case 'connection':
        return 'border-orange-200';
      case 'profile_update':
        return 'border-teal-200';
      default:
        return 'border-gray-200';
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    const typeObj = activityTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const exportActivities = () => {
    // Create CSV content
    const headers = ['Date', 'Type', 'Activity', 'Description'];
    const rows = filteredActivities.map(activity => [
      formatDate(activity.createdAt),
      getTypeLabel(activity.type),
      activity.title,
      activity.description || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kea_activity_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-teal-600" />
                  <h1 className="text-2xl font-bold text-gray-900">My Activity</h1>
                </div>
                {filteredActivities.length > 0 && (
                  <button
                    onClick={exportActivities}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export
                  </button>
                )}
              </div>
              <p className="text-gray-600">
                Track all your actions and engagement on KEA platform
                {filteredActivities.length > 0 && (
                  <span className="ml-2 text-teal-600 font-medium">
                    ({filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'})
                  </span>
                )}
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                  >
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="bg-white rounded-lg  text-black border border-gray-200 p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery || filterType !== 'all' 
                      ? 'No activities found' 
                      : 'No activity yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || filterType !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Start applying for jobs, registering for events, or connecting with other members!'}
                  </p>
                  {(searchQuery || filterType !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('all');
                      }}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                filteredActivities.map((activity, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg border ${getActivityBorderColor(activity.type)} p-6 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 ${getActivityBgColor(activity.type)} rounded-lg shrink-0`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {activity.title}
                            </h3>
                            {activity.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {activity.description}
                              </p>
                            )}
                          </div>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap">
                            {getTypeLabel(activity.type)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatDate(activity.createdAt)}</span>
                          <span>•</span>
                          <span>{getTimeAgo(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Activity Stats */}
            {activities.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activityTypes.slice(1).map((type) => {
                    const count = activities.filter(a => a.type === type.value).length;
                    return (
                      <div key={type.value} className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                        <p className="text-sm text-gray-600">{type.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}