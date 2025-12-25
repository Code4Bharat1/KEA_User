'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter,
  MapPin,
  Briefcase,
  Star,
  Clock,
  Plus,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function MentorList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterExpertise, setFilterExpertise] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [myMentorProfile, setMyMentorProfile] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [newMentor, setNewMentor] = useState({
    name: '',
    title: '',
    organization: '',
    bio: '',
    expertise: '',
    skills: '',
    experience: { years: '', description: '' },
    location: '',
    contact: { email: '', linkedin: '' }
  });

  useEffect(() => {
    fetchUserData();
    fetchMentors();
    fetchMyMentorProfile();
  }, [searchQuery, filterExpertise, filterExperience, currentPage]);

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

  const fetchMyMentorProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.get(`${API_URL}/mentors/me/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyMentorProfile(data);
    } catch (error) {
      // User doesn't have a mentor profile yet
      setMyMentorProfile(null);
    }
  };

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterExpertise) params.append('expertise', filterExpertise);
      if (filterExperience) params.append('experience', filterExperience);
      params.append('page', currentPage);
      params.append('limit', 12);

      const { data } = await axios.get(`${API_URL}/mentors?${params.toString()}`);
      setMentors(data.mentors || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMentor = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const mentorData = {
        ...newMentor,
        expertise: newMentor.expertise.split(',').map(e => e.trim()).filter(Boolean),
        skills: newMentor.skills.split(',').map(s => s.trim()).filter(Boolean),
        experience: {
          years: parseInt(newMentor.experience.years) || 0,
          description: newMentor.experience.description
        }
      };

      const { data } = await axios.post(`${API_URL}/mentors`, mentorData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowCreateModal(false);
      resetForm();
      fetchMyMentorProfile();
      alert('Mentor profile submitted successfully! It will be reviewed by an administrator before becoming visible.');
    } catch (error) {
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.join('\n')
        : error.response?.data?.message || 'Failed to create mentor profile';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewMentor({
      name: '',
      title: '',
      organization: '',
      bio: '',
      expertise: '',
      skills: '',
      experience: { years: '', description: '' },
      location: '',
      contact: { email: '', linkedin: '' }
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: AlertCircle,
        text: 'Pending Review',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      approved: {
        icon: CheckCircle,
        text: 'Approved',
        className: 'bg-green-100 text-green-800 border-green-200'
      },
      rejected: {
        icon: XCircle,
        text: 'Rejected',
        className: 'bg-red-100 text-red-800 border-red-200'
      }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${badge.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.text}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        {/* My Mentor Profile Status Banner */}
        {myMentorProfile && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {myMentorProfile.approvalStatus === 'pending' && (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                    {myMentorProfile.approvalStatus === 'approved' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {myMentorProfile.approvalStatus === 'rejected' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">Your Mentor Profile</h3>
                      {getStatusBadge(myMentorProfile.approvalStatus)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {myMentorProfile.approvalStatus === 'pending' && 
                        'Your profile is under review by our administrators.'
                      }
                      {myMentorProfile.approvalStatus === 'approved' && 
                        'Your profile is live and visible to students!'
                      }
                      {myMentorProfile.approvalStatus === 'rejected' && 
                        `Reason: ${myMentorProfile.rejectionReason || 'Does not meet requirements'}`
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/mentorship/${myMentorProfile._id}`)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
                >
                  View My Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Mentor Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900">Become a Mentor</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              {/* Admin Approval Notice */}
              <div className="px-6 pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Admin Approval Required</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your mentor profile will be reviewed by administrators before becoming visible to students. Please ensure all required fields are complete and accurate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreateMentor} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newMentor.name}
                      onChange={(e) => setNewMentor({...newMentor, name: e.target.value})}
                      placeholder="e.g., Dr. Rajesh Kumar"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Professional Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newMentor.title}
                      onChange={(e) => setNewMentor({...newMentor, title: e.target.value})}
                      placeholder="e.g., Senior Structural Engineer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newMentor.organization}
                      onChange={(e) => setNewMentor({...newMentor, organization: e.target.value})}
                      placeholder="e.g., Larsen & Toubro"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newMentor.location}
                      onChange={(e) => setNewMentor({...newMentor, location: e.target.value})}
                      placeholder="e.g., Mumbai, India"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newMentor.experience.years}
                      onChange={(e) => setNewMentor({...newMentor, experience: {...newMentor.experience, years: e.target.value}})}
                      placeholder="e.g., 10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={newMentor.contact.email}
                      onChange={(e) => setNewMentor({...newMentor, contact: {...newMentor.contact, email: e.target.value}})}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="url"
                    value={newMentor.contact.linkedin}
                    onChange={(e) => setNewMentor({...newMentor, contact: {...newMentor.contact, linkedin: e.target.value}})}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Professional Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={newMentor.bio}
                    onChange={(e) => setNewMentor({...newMentor, bio: e.target.value})}
                    rows={4}
                    minLength={50}
                    maxLength={1000}
                    placeholder="Tell us about your professional journey, achievements, and what you can offer as a mentor... (minimum 50 characters)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newMentor.bio.length}/1000 characters (minimum 50)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Areas of Expertise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMentor.expertise}
                    onChange={(e) => setNewMentor({...newMentor, expertise: e.target.value})}
                    placeholder="e.g., Structural Design, Project Management, Civil Engineering"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Technical Skills <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMentor.skills}
                    onChange={(e) => setNewMentor({...newMentor, skills: e.target.value})}
                    placeholder="e.g., AutoCAD, STAAD Pro, Leadership, Team Management"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Experience Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={newMentor.experience.description}
                    onChange={(e) => setNewMentor({...newMentor, experience: {...newMentor.experience, description: e.target.value}})}
                    rows={3}
                    placeholder="Briefly describe your professional experience and key accomplishments..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    {loading ? 'Submitting...' : 'Submit for Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={loading}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
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
                  <h1 className="text-2xl font-bold text-gray-900">Mentorship</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Connect with experienced engineers & developers for guidance
                  </p>
                </div>
                {!myMentorProfile && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Become a mentor</span>
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, company, or skill"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <select
                    value={filterExperience}
                    onChange={(e) => {
                      setFilterExperience(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Experience</option>
                    <option value="5">5+ years</option>
                    <option value="10">10+ years</option>
                    <option value="15">15+ years</option>
                    <option value="20">20+ years</option>
                  </select>

                  <select
                    value={filterExpertise}
                    onChange={(e) => {
                      setFilterExpertise(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Disciplines</option>
                    <option value="Civil engineering">Civil Engineering</option>
                    <option value="Structural">Structural</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mentors List */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Available Mentors
              </h2>
              <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : mentors.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No mentors found</p>
                {!myMentorProfile && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Be the First Mentor
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {mentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                        <span className="text-2xl font-bold">
                          {mentor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Mentor Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
                            <p className="text-sm text-gray-600">{mentor.title}</p>
                            {mentor.organization && (
                              <p className="text-sm text-gray-500">{mentor.organization}</p>
                            )}
                          </div>
                          {mentor.stats?.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">{mentor.stats.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mentor.expertise?.slice(0, 4).map((exp, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              {exp}
                            </span>
                          ))}
                          {mentor.expertise?.length > 4 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              +{mentor.expertise.length - 4} more
                            </span>
                          )}
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{mentor.bio}</p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          {mentor.experience?.years && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{mentor.experience.years}+ years</span>
                            </div>
                          )}
                          {mentor.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{mentor.location}</span>
                            </div>
                          )}
                          {mentor.stats?.totalSessions > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{mentor.stats.totalSessions} sessions</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 md:w-40">
                        <button
                          onClick={() => router.push(`/dashboard/mentorship/${mentor._id}`)}
                          className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
                        >
                          View profile
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/mentorship/${mentor._id}`)}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                          Request mentorship
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && <span className="text-gray-500">...</span>}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}