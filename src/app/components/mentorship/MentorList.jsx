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
  User
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

      await axios.post(`${API_URL}/mentors`, mentorData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowCreateModal(false);
      resetForm();
      fetchMentors();
      alert('Mentor profile created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create mentor profile');
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

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

              <form onSubmit={handleCreateMentor} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={newMentor.name}
                      onChange={(e) => setNewMentor({...newMentor, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      required
                      value={newMentor.title}
                      onChange={(e) => setNewMentor({...newMentor, title: e.target.value})}
                      placeholder="e.g., Senior Engineer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                    <input
                      type="text"
                      value={newMentor.organization}
                      onChange={(e) => setNewMentor({...newMentor, organization: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={newMentor.location}
                      onChange={(e) => setNewMentor({...newMentor, location: e.target.value})}
                      placeholder="e.g., Mumbai, India"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={newMentor.experience.years}
                      onChange={(e) => setNewMentor({...newMentor, experience: {...newMentor.experience, years: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newMentor.contact.email}
                      onChange={(e) => setNewMentor({...newMentor, contact: {...newMentor.contact, email: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                  <textarea
                    required
                    value={newMentor.bio}
                    onChange={(e) => setNewMentor({...newMentor, bio: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expertise (comma separated)</label>
                  <input
                    type="text"
                    value={newMentor.expertise}
                    onChange={(e) => setNewMentor({...newMentor, expertise: e.target.value})}
                    placeholder="e.g., Structural Design, Project Management"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={newMentor.skills}
                    onChange={(e) => setNewMentor({...newMentor, skills: e.target.value})}
                    placeholder="e.g., AutoCAD, STAAD Pro, Leadership"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Profile'}
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
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mentorship</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Connect with engineers & developers to get support guidance
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Become a mentor</span>
                </button>
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
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <select
                    value={filterExperience}
                    onChange={(e) => setFilterExperience(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">10+ years</option>
                    <option value="5">5+ years</option>
                    <option value="10">10+ years</option>
                    <option value="15">15+ years</option>
                  </select>

                  <select
                    value={filterExpertise}
                    onChange={(e) => setFilterExpertise(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Civil engineering</option>
                    <option value="Civil engineering">Civil engineering</option>
                    <option value="Structural">Structural</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mentors List */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Mentors
              </h2>
              <p className="text-sm text-gray-600">Page 1 of {totalPages}</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : mentors.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No mentors found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Be the First Mentor
                </button>
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
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-12 h-12 text-gray-600" />
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
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mentor.expertise?.slice(0, 3).map((exp, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              {exp}
                            </span>
                          ))}
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
                          className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                        >
                          View profile
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/mentorship/${mentor._id}`)}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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
          </div>
        </div>
      </div>
    </div>
  );
}