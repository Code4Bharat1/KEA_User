'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus,
  Users,
  Lock,
  Globe,
  Filter,
  Grid,
  List as ListIcon,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function GroupsList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: '',
    type: 'public',
    discipline: '',
    region: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchGroups();
    fetchCategories();
  }, [selectedCategory, searchQuery, filterType, currentPage]);

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

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All groups') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (filterType !== 'All') {
        params.append('type', filterType.toLowerCase());
      }
      params.append('page', currentPage);
      params.append('limit', 12);

      const { data } = await axios.get(`${API_URL}/groups?${params.toString()}`);
      setGroups(data.groups || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/groups/categories/stats`);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.post(`${API_URL}/groups`, newGroup, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowCreateModal(false);
      resetForm();
      router.push(`/dashboard/groups/${data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewGroup({
      name: '',
      description: '',
      category: '',
      type: 'public',
      discipline: '',
      region: ''
    });
  };

  const handleJoinGroup = async (groupId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/groups/${groupId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Joined group successfully!');
      fetchGroups();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join group');
    }
  };

  const getGroupIcon = (type) => {
    switch (type) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'secret':
        return <Lock className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900">Create New Group</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Name *</label>
                  <input
                    type="text"
                    required
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="e.g., Civil Engineering Group"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    placeholder="What is this group about?"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={newGroup.category}
                      onChange={(e) => setNewGroup({...newGroup, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="Any Student">Any Student</option>
                      <option value="Any location">Any location</option>
                      <option value="Discipline-based">Discipline-based</option>
                      <option value="Interest-based">Interest-based</option>
                      <option value="City chapters">City chapters</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      required
                      value={newGroup.type}
                      onChange={(e) => setNewGroup({...newGroup, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="secret">Secret</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discipline</label>
                    <input
                      type="text"
                      value={newGroup.discipline}
                      onChange={(e) => setNewGroup({...newGroup, discipline: e.target.value})}
                      placeholder="e.g., Civil Engineering"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <input
                      type="text"
                      value={newGroup.region}
                      onChange={(e) => setNewGroup({...newGroup, region: e.target.value})}
                      placeholder="e.g., Mumbai"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Group'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Join sub-groups, share experiences, and learn from the KEA members
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Create group</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search groups by name, location or keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['All groups', 'Any groups', 'Discipline-based', 'Interest-based', 'City chapters'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Groups Directory Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Groups directory
              </h2>
              <span className="text-sm text-gray-600">
                Showing {groups.length} groups
              </span>
            </div>

            {/* Groups Grid */}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : groups.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No groups found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create First Group
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groups.map((group) => (
                    <div
                      key={group._id}
                      onClick={() => router.push(`/dashboard/groups/${group._id}`)}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      {/* Group Header */}
                      <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      
                      <div className="p-4">
                        {/* Group Name & Type */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-1">
                            {group.name}
                          </h3>
                          <span className="ml-2 flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {getGroupIcon(group.type)}
                            <span className="capitalize">{group.type}</span>
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {group.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{group.memberCount} members</span>
                          </div>
                          {group.discipline && (
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {group.discipline}
                            </span>
                          )}
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={(e) => handleJoinGroup(group._id, e)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                        >
                          Join group
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}