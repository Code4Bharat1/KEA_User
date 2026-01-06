'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Filter,
  Plus,
  Eye,
  Download,
  X,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function SeminarList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seminars, setSeminars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // Changed from 'Seminars & Webinars' to 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [newSeminar, setNewSeminar] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    duration: '',
    venue: '',
    organizer: '',
    speaker: '',
    description: '',
    topics: '',
    targetAudience: '',
    registrationLink: '',
    resources: [],
    maxAttendees: ''
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchSeminars();
  }, [selectedCategory, searchQuery, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchSeminars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Only add category filter if not 'all'
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      params.append('page', currentPage);
      params.append('limit', 10);

      const { data } = await axios.get(`${API_URL}/seminars?${params.toString()}`);
      setSeminars(data.seminars || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching seminars:', error);
      setSeminars([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/seminars/categories/stats`);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateSeminar = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const seminarData = {
        ...newSeminar,
        topics: newSeminar.topics.split(',').map(t => t.trim()).filter(Boolean)
      };

      await axios.post(`${API_URL}/seminars`, seminarData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowCreateModal(false);
      resetForm();
      fetchSeminars();
      fetchCategories();
      alert('Seminar created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create seminar');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setNewSeminar({
      title: '',
      category: '',
      date: '',
      time: '',
      duration: '',
      venue: '',
      organizer: '',
      speaker: '',
      description: '',
      topics: '',
      targetAudience: '',
      registrationLink: '',
      resources: [],
      maxAttendees: ''
    });
  };

  const handleRegister = async (seminarId) => {
    if (actionLoading) return;
    setActionLoading(true);
    
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/seminars/${seminarId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Registration successful!');
      fetchSeminars();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (date, registrationDeadline) => {
    const now = new Date();
    const seminarDate = new Date(date);
    const deadline = registrationDeadline ? new Date(registrationDeadline) : seminarDate;

    if (now > seminarDate) {
      return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">Past</span>;
    }
    if (now > deadline) {
      return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">Closed</span>;
    }
    return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Open</span>;
  };

  const categories_list = [
    'Seminars & Webinars',
    'Workshops',
    'Conferences',
    'Training Programs',
    'Technical Talks',
    'Panel Discussions'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        {/* Create Seminar Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900">Create New Seminar</h2>
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  disabled={actionLoading}
                  className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSeminar} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seminar Title *</label>
                    <input
                      type="text"
                      required
                      value={newSeminar.title}
                      onChange={(e) => setNewSeminar({...newSeminar, title: e.target.value})}
                      placeholder="e.g., Bridge Design Masterclass"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={newSeminar.category}
                      onChange={(e) => setNewSeminar({...newSeminar, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories_list.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organizer *</label>
                    <input
                      type="text"
                      required
                      value={newSeminar.organizer}
                      onChange={(e) => setNewSeminar({...newSeminar, organizer: e.target.value})}
                      placeholder="e.g., Eng. Rajiv Gupta"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      required
                      value={newSeminar.date}
                      onChange={(e) => setNewSeminar({...newSeminar, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                    <input
                      type="time"
                      required
                      value={newSeminar.time}
                      onChange={(e) => setNewSeminar({...newSeminar, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={newSeminar.duration}
                      onChange={(e) => setNewSeminar({...newSeminar, duration: e.target.value})}
                      placeholder="e.g., 2 hours"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                    <input
                      type="text"
                      required
                      value={newSeminar.venue}
                      onChange={(e) => setNewSeminar({...newSeminar, venue: e.target.value})}
                      placeholder="e.g., IIT Bombay Auditorium"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                    <input
                      type="text"
                      value={newSeminar.speaker}
                      onChange={(e) => setNewSeminar({...newSeminar, speaker: e.target.value})}
                      placeholder="e.g., Dr. Amit Sharma"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                    <input
                      type="number"
                      value={newSeminar.maxAttendees}
                      onChange={(e) => setNewSeminar({...newSeminar, maxAttendees: e.target.value})}
                      placeholder="e.g., 100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Link</label>
                    <input
                      type="url"
                      value={newSeminar.registrationLink}
                      onChange={(e) => setNewSeminar({...newSeminar, registrationLink: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topics (comma separated)</label>
                    <input
                      type="text"
                      value={newSeminar.topics}
                      onChange={(e) => setNewSeminar({...newSeminar, topics: e.target.value})}
                      placeholder="e.g., Structural Design, Load Analysis, Safety Standards"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      required
                      value={newSeminar.description}
                      onChange={(e) => setNewSeminar({...newSeminar, description: e.target.value})}
                      placeholder="Detailed description of the seminar..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Creating...' : 'Create Seminar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={actionLoading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
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
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Seminars & Webinars</h1>
                  <p className="text-sm text-gray-600 mt-1">Upcoming seminars, webinars, and past recordings</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Create
                  </button>
                </div>
              </div>

              {/* Category Pills - Now shows all categories */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({categories.find(c => c.name === 'All')?.count || 0})
                </button>
                {categories.filter(c => c.name !== 'All').map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      selectedCategory === category.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search seminars and webinars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Seminars List */}
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-2">
                Showing {seminars.length} seminar(s)
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-sm text-gray-500">Loading seminars...</p>
                </div>
              ) : seminars.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">No seminars found</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                seminars.map((seminar) => (
                  <div
                    key={seminar._id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{seminar.title}</h3>
                          {getStatusBadge(seminar.date, seminar.registrationDeadline)}
                          <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                            {seminar.category}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{seminar.organizer}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(seminar.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{seminar.time}</span>
                          </div>
                          {seminar.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{seminar.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{seminar.venue}</span>
                          </div>
                        </div>

                        {seminar.attendees && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                            <Users className="w-4 h-4" />
                            <span>
                              {seminar.attendees.length} / {seminar.maxAttendees || '∞'} registered
                            </span>
                          </div>
                        )}

                        {seminar.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{seminar.description}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/seminars/${seminar._id}`)}
                          className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium whitespace-nowrap"
                        >
                          View details
                        </button>
                        <button
                          onClick={() => handleRegister(seminar._id)}
                          disabled={actionLoading}
                          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading ? 'Registering...' : 'Register'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Pagination */}
              {!loading && seminars.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && <span className="px-2">...</span>}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}