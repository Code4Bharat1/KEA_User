'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock,
  Users,
  Download,
  ExternalLink,
  ArrowLeft,
  User
} from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function SeminarDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seminar, setSeminar] = useState(null);
  const [registering, setRegistering] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUserData();
    fetchSeminarDetail();
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

  const fetchSeminarDetail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/seminars/${params.id}`);
      setSeminar(data);
    } catch (error) {
      console.error('Error fetching seminar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/seminars/${params.id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Registration successful!');
      fetchSeminarDetail();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const handleDownload = (url, filename) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!seminar) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Seminar not found</p>
          <button
            onClick={() => router.push('/dashboard/seminars')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Seminars
          </button>
        </div>
      </div>
    );
  }

  const isRegistered = seminar.attendees?.some(a => a._id === user?._id);
  const isFull = seminar.maxAttendees && seminar.attendees?.length >= seminar.maxAttendees;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push('/dashboard/seminars')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Seminars</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="text-blue-600">{seminar.category}</span>
                        {' > '}
                        <span className="text-blue-600">{seminar.category}</span>
                        {' > '}
                        <span>{seminar.subcategory || seminar.title}</span>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{seminar.title}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(seminar.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}</span>
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
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Upcoming
                    </span>
                  </div>

                  {seminar.registrationLink && (
                    <a
                      href={seminar.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Follow links seminar session link
                    </a>
                  )}
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                  <div className="text-gray-600 space-y-3">
                    <p>{seminar.description}</p>
                    
                    {seminar.topics && seminar.topics.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Topics Covered:</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {seminar.topics.map((topic, idx) => (
                            <li key={idx}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {seminar.targetAudience && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Target Audience:</h3>
                        <p>{seminar.targetAudience}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resources */}
                {seminar.resources && seminar.resources.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Download resources
                    </h2>
                    <div className="space-y-3">
                      {seminar.resources.map((resource, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{resource.title}</p>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                          </div>
                          <button
                            onClick={() => handleDownload(resource.url, resource.title)}
                            className="px-4 py-2 text-sm text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registration Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Attending this will automatically add the event to your "My Profile" and you will be able to add this 
                    activity to your profile. Send any question via college email.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Organizer Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Organizer</h3>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{seminar.organizer}</p>
                      <p className="text-sm text-gray-600">{seminar.organizerRole || 'Organizer'}</p>
                    </div>
                  </div>
                  {seminar.organizerBio && (
                    <p className="text-sm text-gray-600">{seminar.organizerBio}</p>
                  )}
                </div>

                {/* Speaker Info */}
                {seminar.speaker && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Speaker</h3>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{seminar.speaker}</p>
                        <p className="text-sm text-gray-600">{seminar.speakerTitle || 'Speaker'}</p>
                      </div>
                    </div>
                    {seminar.speakerBio && (
                      <p className="text-sm text-gray-600">{seminar.speakerBio}</p>
                    )}
                  </div>
                )}

                {/* Registration */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Registration</h3>
                  
                  {seminar.attendees && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {seminar.attendees.length} 
                          {seminar.maxAttendees ? ` / ${seminar.maxAttendees}` : ''} registered
                        </span>
                      </div>
                      {seminar.maxAttendees && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(seminar.attendees.length / seminar.maxAttendees) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {isRegistered ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-sm font-medium text-green-800">✓ You're registered</p>
                    </div>
                  ) : isFull ? (
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                    >
                      Registration Full
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                      {registering ? 'Registering...' : 'Register for this seminar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}