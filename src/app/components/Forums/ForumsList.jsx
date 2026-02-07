'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MessageSquare,
  Pin,
  Lock,
  Clock,
  User,
  Trash2,
  Shield,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';
import { toast } from 'react-hot-toast';


export default function ForumsList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [threads, setThreads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const [newCategory, setNewCategory] = useState('');

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'admin' || user?.role === 'moderator';

  useEffect(() => {
    fetchUserData();
    fetchThreads();
    fetchCategories();
  }, [selectedCategory, searchQuery, currentPage, sortBy]);

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

  // const fetchThreads = async () => {
  //   setLoading(true);
  //   try {
  //     const params = new URLSearchParams();
  //     if (selectedCategory !== 'All discussions') {
  //       params.append('category', selectedCategory);
  //     }
  //     if (searchQuery) {
  //       params.append('search', searchQuery);
  //     }
  //     if (sortBy) {
  //       params.append('sort', sortBy);
  //     }
  //     params.append('page', currentPage);
  //     params.append('limit', 20);

  //     const { data } = await axios.get(`${API_URL}/forums?${params.toString()}`);
  //     setThreads(data.threads || []);
  //     setTotalPages(data.pagination?.pages || 1);
  //   } catch (error) {
  //     console.error('Error fetching threads:', error);
  //     setThreads([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken'); // ✅ SAME token

      if (!token) {
        console.warn('No user token found');
        setThreads([]);
        return;
      }

      const params = new URLSearchParams();
      if (selectedCategory !== 'All discussions') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (sortBy) {
        params.append('sort', sortBy);
      }
      params.append('page', currentPage);
      params.append('limit', 20);

      const { data } = await axios.get(
        `${API_URL}/forums?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        }
      );

      setThreads(data.threads || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching threads:', error);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };


  // const fetchCategories = async () => {
  //   try {
  //     const { data } = await axios.get(`${API_URL}/forums/categories/stats`);
  //     setCategories(data.categories || []);
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //   }
  // };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        console.warn('No user token found for categories');
        setCategories([]);
        return;
      }

      const { data } = await axios.get(
        `${API_URL}/forums/categories/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  const handleCreateThread = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const threadData = {
        ...newThread,
        tags: newThread.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      const { data } = await axios.post(`${API_URL}/forums`, threadData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowCreateModal(false);
      resetForm();
      // router.push(`/dashboard/forums/${data._id}`);
      toast.success('Thread sent for admin approval');
      router.push('/dashboard/forums');

    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create thread');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteThread = async (threadId, e) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this thread? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_URL}/forums/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchThreads();
      alert('Thread deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete thread');
    }
  };

  const handleTogglePin = async (threadId, e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_URL}/forums/${threadId}/pin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchThreads();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to pin thread');
    }
  };

  const handleToggleLock = async (threadId, e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_URL}/forums/${threadId}/lock`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchThreads();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to lock thread');
    }
  };

  const resetForm = () => {
    setNewThread({
      title: '',
      content: '',
      category: '',
      tags: ''
    });
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const availableCategories = [
    'Structural engineering',
    'Civil & Infrastructure',
    'Mechanical & manufacturing',
    'Materials & testing',
    'Jobs & opportunities',
    'Geotechnical Engineering',
    'Transportation Engineering',
    'Environmental Engineering',
    'Water Resources & Hydrology',
    'Construction Management',
    'Automation & Robotics',
    'BIM & CAD',
    'Software & IT',
    'Quality & Safety (HSE)',
    'Jobs & Opportunities',
    'Internships & Training',
    'General'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        {/* Admin Notice */}
        {isAdmin && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-2">
            <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-blue-800">
              <Shield className="w-4 h-4" />
              <span>Admin mode: You have moderation privileges</span>
            </div>
          </div>
        )}

        {/* Create Thread Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 text-black z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900">New Thread</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    placeholder="What's your question or topic?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={newThread.category}
                    onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    required
                    value={newThread.content}
                    onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                    placeholder="Describe your question or topic in detail..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newThread.tags}
                    onChange={(e) => setNewThread({ ...newThread, tags: e.target.value })}
                    placeholder="e.g., design, analysis, steel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Posting...' : 'Post Thread'}
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
                <h1 className="text-2xl font-bold text-gray-900">Forums</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Ask questions, share experiences, and learn from the KEA members
                </p>
              </div>
              <div className="flex gap-2">
                {isAdmin && (
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                )}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>New thread</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.name
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-gray-500 ml-2">{cat.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <main className="lg:col-span-3">
                {/* Search and Sort */}
                <div className="bg-white text-black rounded-lg border border-gray-200 p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search threads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="latest">Latest</option>
                      <option value="popular">Most Popular</option>
                      <option value="unanswered">Unanswered</option>
                    </select>
                  </div>
                </div>

                {/* Threads List */}
                <div className="space-y-2">
                  {loading ? (
                    <div className="flex items-center justify-center p-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : threads.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No threads found</p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Start First Thread
                      </button>
                    </div>
                  ) : (
                    threads.map((thread) => (
                      <div
                        key={thread._id}
                        onClick={() => router.push(`/dashboard/forums/${thread._id}`)}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center gap-2 min-w-[80px]">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">{thread.replies?.length || 0}</div>
                              <div className="text-xs text-gray-600">replies</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">{thread.views || 0}</div>
                              <div className="text-xs text-gray-600">views</div>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              {thread.isPinned && (
                                <Pin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                              )}
                              {thread.isLocked && (
                                <Lock className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                              )}
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                {thread.title}
                              </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {thread.category}
                              </span>
                              {thread.tags?.map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>Started by {thread.author?.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{getTimeAgo(thread.lastActivity || thread.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Admin Controls */}
                          {isModerator && (
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => handleTogglePin(thread._id, e)}
                                className={`p-2 rounded-lg hover:bg-gray-100 ${thread.isPinned ? 'text-blue-600' : 'text-gray-400'
                                  }`}
                                title={thread.isPinned ? 'Unpin thread' : 'Pin thread'}
                              >
                                <Pin className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleToggleLock(thread._id, e)}
                                className={`p-2 rounded-lg hover:bg-gray-100 ${thread.isLocked ? 'text-orange-600' : 'text-gray-400'
                                  }`}
                                title={thread.isLocked ? 'Unlock thread' : 'Lock thread'}
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                              {isAdmin && (
                                <button
                                  onClick={(e) => handleDeleteThread(thread._id, e)}
                                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                                  title="Delete thread"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    {[...Array(Math.min(7, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg ${currentPage === pageNum
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
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}