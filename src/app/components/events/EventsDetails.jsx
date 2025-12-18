'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  ExternalLink,
  Share2,
  Bookmark,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function EventDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUserData();
    fetchEventDetail();
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

  const fetchEventDetail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/events/${params.id}`);
      setEvent(data);
      
      // Check if user is registered
      if (user) {
        setIsRegistered(data.registeredUsers?.some(u => u._id === user._id || u === user._id));
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/events/${params.id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Successfully registered for event!');
      fetchEventDetail();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register for event');
    }
  };

  const handleUnregister = async () => {
    if (!confirm('Are you sure you want to unregister from this event?')) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/events/${params.id}/unregister`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Successfully unregistered from event');
      fetchEventDetail();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to unregister from event');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button
            onClick={() => router.push('/dashboard/events')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isFull = event.maxAttendees && event.registeredUsers?.length >= event.maxAttendees;
  const spotsLeft = event.maxAttendees ? event.maxAttendees - (event.registeredUsers?.length || 0) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push('/dashboard/events')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Events</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Event Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {event.eventType}
                    </span>
                    {isRegistered && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Registered
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </h1>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.startTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{event.venue}</span>
                    </div>
                    {event.registeredUsers && event.registeredUsers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>{event.registeredUsers.length} registered</span>
                      </div>
                    )}
                  </div>

                  {/* Event Type Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>Event Type</span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p className="whitespace-pre-wrap">{event.description}</p>
                  </div>

                  {/* What you will learn */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Topics covered:</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {event.notes && (
                  <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{event.notes}</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Date, Time & Location Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Date, time & Location</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date</p>
                      <p className="font-medium text-gray-900">{formatDate(event.startDate)}</p>
                    </div>

                    {event.startTime && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Time</p>
                        <p className="font-medium text-gray-900">
                          {formatTime(event.startTime)} {event.endTime && `- ${formatTime(event.endTime)}`}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Format</p>
                      <p className="font-medium text-gray-900">
                        {event.isOnline ? 'Online Event' : 'In-person'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Venue</p>
                      <p className="font-medium text-gray-900">{event.venue}</p>
                      {event.location && (
                        <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                      )}
                    </div>

                    {spotsLeft !== null && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Spots left</p>
                        <p className={`font-medium ${spotsLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {spotsLeft} of {event.maxAttendees}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Register Button */}
                  <div className="mt-6">
                    {isRegistered ? (
                      <button
                        onClick={handleUnregister}
                        className="w-full px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                      >
                        Cancel Registration
                      </button>
                    ) : (
                      <button
                        onClick={handleRegister}
                        disabled={isFull}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isFull ? 'Event Full' : 'Register'}
                      </button>
                    )}
                  </div>

                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium mt-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>External Registration</span>
                    </a>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Bookmark className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Don't be worried
                  </p>
                </div>

                {/* Organizer Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Organizer details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Organizer</p>
                      <p className="font-medium text-gray-900">
                        {event.organizerName || event.organizer?.name || 'KEA'}
                      </p>
                    </div>

                    {event.organizerEmail && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <a href={`mailto:${event.organizerEmail}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{event.organizerEmail}</span>
                        </a>
                      </div>
                    )}

                    {event.organizerPhone && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Contact phone</p>
                        <a href={`tel:${event.organizerPhone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{event.organizerPhone}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                {event.meetingLink && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Meeting Link</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      This is an online event. Join via:
                    </p>
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Join Meeting</span>
                    </a>
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