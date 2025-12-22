'use client';

import { useState, useEffect } from 'react';
import { 
  Bookmark, 
  MapPin, 
  Briefcase, 
  Building2,
  Clock,
  Trash2,
  ExternalLink,
  Loader
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function SavedJobs() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [removingJob, setRemovingJob] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUserData();
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

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/jobs/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Saved jobs:', res.data);
      setSavedJobs(res.data);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setSavedJobs([]);
    }
  };

  const handleUnsaveJob = async (savedJobId) => {
    if (!confirm('Remove this job from saved list?')) return;

    setRemovingJob(savedJobId);
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_URL}/users/jobs/saved/${savedJobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove from list
      setSavedJobs(savedJobs.filter(item => item._id !== savedJobId));
      alert('Job removed from saved list');
    } catch (err) {
      console.error('Error removing saved job:', err);
      alert(err.response?.data?.message || 'Failed to remove job');
    } finally {
      setRemovingJob(null);
    }
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
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Bookmark className="w-8 h-8 text-teal-600" />
                <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
              </div>
              <p className="text-gray-600">
                Jobs you've bookmarked for later
                {savedJobs.length > 0 && (
                  <span className="ml-2 text-teal-600 font-medium">
                    ({savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'})
                  </span>
                )}
              </p>
            </div>

            {/* Saved Jobs List */}
            <div className="space-y-4">
              {savedJobs.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start saving jobs you're interested in to view them here
                  </p>
                  <Link
                    href="/dashboard/Jobs"
                    className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                savedJobs.map((savedJob) => {
                  const job = savedJob.job;
                  if (!job) return null;

                  return (
                    <div
                      key={savedJob._id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-teal-50 rounded-lg">
                              <Briefcase className="w-6 h-6 text-teal-600" />
                            </div>
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
                              </div>

                              <p className="mt-3 text-gray-700 line-clamp-2">
                                {job.description}
                              </p>

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

                              <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>Saved {getTimeAgo(savedJob.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <Link
                            href={`/dashboard/Jobs/${job._id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center flex items-center gap-2"
                          >
                            View Details
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          
                          <button
                            onClick={() => handleUnsaveJob(savedJob._id)}
                            disabled={removingJob === savedJob._id}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2 justify-center"
                          >
                            {removingJob === savedJob._id ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Removing...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Remove
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

            {/* Quick Actions */}
            {savedJobs.length > 0 && (
              <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Ready to apply?
                </h3>
                <p className="text-blue-800 mb-4">
                  Review your saved jobs and start applying to the ones that match your skills and interests.
                </p>
                <Link
                  href="/dashboard/Jobs"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse More Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}