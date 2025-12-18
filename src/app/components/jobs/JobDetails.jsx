'use client';

import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Briefcase, 
  DollarSign,
  Clock,
  Building2,
  ExternalLink,
  Bookmark,
  Share2,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function JobDetails() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUserData();
    fetchJobDetails();
  }, [params.id]);

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

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/jobs/${params.id}`);
      setJob(res.data);
    } catch (err) {
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(
        `${API_URL}/users/jobs/save`,
        { jobId: job._id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsSaved(true);
      alert('Job saved successfully!');
    } catch (err) {
      console.error('Error saving job:', err);
      alert(err.response?.data?.message || 'Failed to save job');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
          <Link href="/dashboard/jobs" className="text-teal-600 hover:text-teal-700">
            Back to jobs
          </Link>
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
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Jobs</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveJob}
                        disabled={isSaved}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current text-teal-600' : 'text-gray-600'}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Posted {getTimeAgo(job.createdAt)}</span>
                    </div>
                  </div>

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Job Description */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {job.description}
                  </div>
                </div>

                {/* Requirements */}
                {job.requirements && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                      {job.requirements}
                    </div>
                  </div>
                )}

                {/* About Company */}
                {job.postedBy && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">About the Company</h2>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.company}</h3>
                        <p className="text-sm text-gray-600">Posted by {job.postedBy.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Apply Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                  <div className="space-y-4">
                    {job.applyUrl ? (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Apply on Company Website
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        onClick={() => setShowApplyModal(true)}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Apply Now
                      </button>
                    )}

                    <button
                      onClick={handleSaveJob}
                      disabled={isSaved}
                      className="w-full px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {isSaved ? 'Saved' : 'Save Job'}
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Job Type</span>
                      <span className="font-medium text-gray-900">{job.type}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Salary</span>
                        <span className="font-medium text-gray-900">{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-gray-900">{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Posted</span>
                      <span className="font-medium text-gray-900">{getTimeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyJobModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            alert('Application submitted successfully!');
          }}
        />
      )}
    </div>
  );
}

// Apply Job Modal Component
function ApplyJobModal({ job, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [formData, setFormData] = useState({
    resumeId: '',
    coverLetter: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/me/resumes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(res.data);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(
        `${API_URL}/users/jobs/apply`,
        {
          jobId: job._id,
          ...formData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      onSuccess();
    } catch (err) {
      console.error('Error applying for job:', err);
      alert(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
          <p className="text-sm text-gray-600 mt-1">at {job.company}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Resume *
            </label>
            <select
              value={formData.resumeId}
              onChange={(e) => setFormData({ ...formData, resumeId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Choose a resume</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.title}
                </option>
              ))}
            </select>
            {resumes.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                You haven't uploaded any resumes yet. Please upload one first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cover Letter
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              rows="6"
              placeholder="Tell us why you're interested in this role..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || resumes.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
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