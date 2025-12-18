'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Star,
  Paperclip,
  X
} from 'lucide-react';
import axios from 'axios';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function FeedbackForm() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('submit');
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    message: '',
    priority: 'Medium',
    rating: 0,
    isAnonymous: false
  });

  const categories = [
    'Bug Report',
    'Feature Request',
    'General Feedback',
    'Complaint',
    'Suggestion',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    fetchUserData();
    fetchFeedbacks();
    fetchStats();
  }, [currentPage]);

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

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.get(`${API_URL}/feedback?page=${currentPage}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(data.feedbacks || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.get(`${API_URL}/feedback/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/feedback`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Feedback submitted successfully!');
      setFormData({
        category: '',
        subject: '',
        message: '',
        priority: 'Medium',
        rating: 0,
        isAnonymous: false
      });
      setActiveTab('history');
      fetchFeedbacks();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_URL}/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Feedback deleted successfully');
      fetchFeedbacks();
      fetchStats();
    } catch (error) {
      alert('Failed to delete feedback');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Feedback & Support</h1>
              <p className="text-sm text-gray-600 mt-1">
                Share your thoughts or report issues to help us improve
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <p className="text-sm text-yellow-800">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending || 0}</p>
              </div>
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <p className="text-sm text-blue-800">In Progress</p>
                <p className="text-2xl font-bold text-blue-900">{stats['in-progress'] || 0}</p>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-sm text-green-800">Resolved</p>
                <p className="text-2xl font-bold text-green-900">{stats.resolved || 0}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('submit')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'submit'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Submit Feedback
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'history'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Feedback History
                </button>
              </div>

              <div className="p-6">
                {/* Submit Feedback Tab */}
                {activeTab === 'submit' && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {priorities.map((priority) => (
                            <option key={priority} value={priority}>{priority}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Brief description of your feedback"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={6}
                        placeholder="Provide detailed feedback or describe the issue..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate your experience (optional)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({...formData, rating: star})}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= formData.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Anonymous Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.isAnonymous}
                        onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                        Submit anonymously
                      </label>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({
                          category: '',
                          subject: '',
                          message: '',
                          priority: 'Medium',
                          rating: 0,
                          isAnonymous: false
                        })}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Feedback</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Feedback History Tab */}
                {activeTab === 'history' && (
                  <div>
                    {loading && feedbacks.length === 0 ? (
                      <div className="flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : feedbacks.length === 0 ? (
                      <div className="text-center p-12">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No feedback submitted yet</p>
                        <button
                          onClick={() => setActiveTab('submit')}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Submit Your First Feedback
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {feedbacks.map((feedback) => (
                            <div key={feedback._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {feedback.subject}
                                    </h3>
                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                                      {getStatusIcon(feedback.status)}
                                      <span className="capitalize">{feedback.status}</span>
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-gray-100 rounded">{feedback.category}</span>
                                    <span className="px-2 py-1 bg-gray-100 rounded">{feedback.priority}</span>
                                    <span>{getTimeAgo(feedback.createdAt)}</span>
                                    {feedback.rating > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{feedback.rating}/5</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDelete(feedback._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <p className="text-gray-700 mb-4">{feedback.message}</p>

                              {feedback.adminResponse && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-blue-600" />
                                    <p className="font-medium text-blue-900">Admin Response</p>
                                  </div>
                                  <p className="text-gray-700 mb-2">{feedback.adminResponse.message}</p>
                                  <p className="text-xs text-gray-600">
                                    Responded by {feedback.adminResponse.respondedBy?.name || 'Admin'} • {getTimeAgo(feedback.adminResponse.respondedAt)}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2 mt-6">
                            {[...Array(totalPages)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-lg ${
                                  currentPage === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
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