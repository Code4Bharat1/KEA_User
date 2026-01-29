'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Clock,
  Filter,
  Plus,
  Building2,
  Calendar,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function FindJobs() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [savingJob, setSavingJob] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    category: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
  const categories = [
    'Software Engineering',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Data Science',
    'Product Management',
    'Other'
  ];

  useEffect(() => {
    fetchUserData();
    fetchJobs();
    fetchSavedJobs();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (page = 1) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('q', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.type) params.append('type', filters.type);
      params.append('page', page);
      params.append('limit', 10);
      
      const res = await axios.get(`${API_URL}/jobs?${params.toString()}`);
      
      // Handle both response formats
      if (res.data.jobs) {
        // New format with pagination
        setJobs(res.data.jobs);
        setPagination(res.data.pagination);
      } else if (Array.isArray(res.data)) {
        // Old format - direct array
        setJobs(res.data);
      } else {
        // Fallback
        setJobs([]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs([]);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/jobs/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Extract job IDs from saved jobs
      const jobIds = res.data.map(saved => saved.job?._id || saved.job);
      setSavedJobIds(jobIds);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    }
  };

  const handleSearch = () => {
    fetchJobs(1);
  };

  const handleSaveJob = async (jobId) => {
    setSavingJob(jobId);
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/users/jobs/save`, 
        { jobId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setSavedJobIds([...savedJobIds, jobId]);
      alert('Job saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSavingJob(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handlePageChange = (newPage) => {
    fetchJobs(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const days = Math.floor(seconds / 86400);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Find Jobs</h1>
                <p className="text-gray-600 mt-1">
                  Discover engineering opportunities across globe
                  {pagination.total > 0 && (
                    <span className="ml-2 text-teal-600 font-medium">
                      ({pagination.total} jobs found)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/saved-jobs"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                >
                  <Bookmark className="w-5 h-5" />
                  Saved Jobs ({savedJobIds.length})
                </Link>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Post a Job
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg border text-black border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by title, company, or keyword"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Search
                </button>
              </div>

              <div className="flex gap-4 mt-4 flex-wrap">
                <select
                  value={filters.type}
                  onChange={(e) => {
                    handleFilterChange('type', e.target.value);
                    handleSearch();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Types</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select
                  value={filters.category}
                  onChange={(e) => {
                    handleFilterChange('category', e.target.value);
                    handleSearch();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {!jobs || jobs.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search filters</p>
                </div>
              ) : (
                jobs.map((job) => {
                  const isSaved = savedJobIds.includes(job._id);
                  return (
                    <div
                      key={job._id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/dashboard/Jobs/${job._id}`}
                            className="text-xl font-bold text-gray-900 hover:text-teal-600 transition-colors"
                          >
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{job.type}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                          </div>

                          <p className="mt-3 text-gray-700 line-clamp-2">{job.description}</p>

                          {job.tags && job.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.tags.slice(0, 5).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                              {job.tags.length > 5 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                  +{job.tags.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                            <Clock className="w-4 h-4" />
                            <span>{getTimeAgo(job.createdAt)}</span>
                          </div>
                          
                          <Link
                            href={`/dashboard/Jobs/${job._id}`}
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                          >
                            View Details
                          </Link>

                          <button
                            onClick={() => handleSaveJob(job._id)}
                            disabled={isSaved || savingJob === job._id}
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                              isSaved
                                ? 'bg-teal-50 text-teal-700 border border-teal-200 cursor-not-allowed'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <BookmarkCheck className="w-4 h-4" />
                                Saved
                              </>
                            ) : savingJob === job._id ? (
                              'Saving...'
                            ) : (
                              <>
                                <Bookmark className="w-4 h-4" />
                                Save Job
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {jobs && jobs.length > 0 && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {[...Array(pagination.pages)].map((_, index) => {
                  const pageNum = index + 1;
                  const showPage = 
                    pageNum === 1 || 
                    pageNum === pagination.pages || 
                    Math.abs(pageNum - pagination.page) <= 1;

                  if (!showPage) {
                    if (pageNum === 2 || pageNum === pagination.pages - 1) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-teal-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <CreateJobModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchJobs(1);
          }}
        />
      )}
    </div>
  );
}

// Create Job Modal Component
function CreateJobModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    applyUrl: '',
    tags: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      
      const jobData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      await axios.post(`${API_URL}/jobs`, jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Job posted successfully! It will be visible after admin approval.');
      onSuccess();
    } catch (err) {
      console.error('Error creating job:', err);
      alert(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 text-black z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
          <p className="text-sm text-gray-600 mt-1">Fill in the details below to post a new job opening</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Senior Software Engineer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                placeholder="Company name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., Mumbai, Maharashtra"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="e.g., ₹10L - ₹15L per annum"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows="3"
              placeholder="List the key requirements and qualifications..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Application URL
            </label>
            <input
              type="url"
              name="applyUrl"
              value={formData.applyUrl}
              onChange={handleInputChange}
              placeholder="https://company.com/apply"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="React, Node.js, MongoDB"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}