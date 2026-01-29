'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  Plus,
  Filter,
  Grid,
  List as ListIcon
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function EventsList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventType: '',
    venue: '',
    location: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    maxAttendees: '',
    tags: '',
    notes: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchEvents();
    fetchUpcomingEvents();
  }, [searchQuery, filterType, selectedMonth, selectedYear, currentPage, viewMode]);

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

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterType) params.append('eventType', filterType);
      
      if (viewMode === 'calendar') {
        params.append('month', selectedMonth);
        params.append('year', selectedYear);
      } else {
        params.append('page', currentPage);
        params.append('limit', 20);
      }

      const { data } = await axios.get(`${API_URL}/events?${params.toString()}`);
      setEvents(data.events || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/events?limit=5`);
      setUpcomingEvents(data.events?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const eventData = {
        ...newEvent,
        tags: newEvent.tags.split(',').map(t => t.trim()).filter(Boolean),
        maxAttendees: parseInt(newEvent.maxAttendees) || undefined
      };

      await axios.post(`${API_URL}/events`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowCreateModal(false);
      resetForm();
      fetchEvents();
      alert('Event submitted for approval!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      description: '',
      eventType: '',
      venue: '',
      location: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      maxAttendees: '',
      tags: '',
      notes: ''
    });
  };

  const getCalendarDays = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === selectedMonth &&
             eventDate.getFullYear() === selectedYear;
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        {/* Create Event Modal */}
        {/* {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 text-black z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900">Create New Event</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="e.g., Bridge Design Workshop"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                    <select
                      required
                      value={newEvent.eventType}
                      onChange={(e) => setNewEvent({...newEvent, eventType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select type</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Conference">Conference</option>
                      <option value="Meetup">Meetup</option>
                      <option value="Training">Training</option>
                      <option value="Seminar">Seminar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                    <input
                      type="text"
                      required
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                      placeholder="e.g., KEA Hall, Mumbai"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      required
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows={4}
                    placeholder="Describe the event..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                  <input
                    type="number"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({...newEvent, maxAttendees: e.target.value})}
                    placeholder="Leave empty for unlimited"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newEvent.tags}
                    onChange={(e) => setNewEvent({...newEvent, tags: e.target.value})}
                    placeholder="e.g., Engineering, Design, Workshop"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Submit for Approval'}
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
        )} */}

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Discover upcoming webinars, seminars, and KEA events
                  </p>
                </div>
                {/* <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button> */}
              </div>

              {/* View Toggle and Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* View Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'calendar'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>Calendar view</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                    <span>List</span>
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative text-black flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All formats</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Meetup">Meetup</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-6">
                  {/* Month/Year Selector */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => {
                        if (selectedMonth === 0) {
                          setSelectedMonth(11);
                          setSelectedYear(selectedYear - 1);
                        } else {
                          setSelectedMonth(selectedMonth - 1);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      ←
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {months[selectedMonth]} {selectedYear}
                    </h2>
                    <button
                      onClick={() => {
                        if (selectedMonth === 11) {
                          setSelectedMonth(0);
                          setSelectedYear(selectedYear + 1);
                        } else {
                          setSelectedMonth(selectedMonth + 1);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      →
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                    {getCalendarDays().map((day, idx) => {
                      const dayEvents = getEventsForDay(day);
                      return (
                        <div
                          key={idx}
                          className={`min-h-[100px] p-2 border border-gray-200 rounded-lg ${
                            day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                          }`}
                        >
                          {day && (
                            <>
                              <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                              <div className="space-y-1">
                                {dayEvents.slice(0, 2).map((event, eventIdx) => (
                                  <div
                                    key={eventIdx}
                                    onClick={() => router.push(`/dashboard/events/${event._id}`)}
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 truncate"
                                  >
                                    {event.title}
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-gray-500 px-2">
                                    +{dayEvents.length - 2} more
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span>Confirmed</span>
                    <div className="w-3 h-3 bg-yellow-500 rounded ml-4"></div>
                    <span>Waitlisted (when slots)</span>
                  </div>
                </div>

                {/* Upcoming Events Sidebar */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Upcoming events</h3>
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => (
                        <button
                          key={event._id}
                          onClick={() => router.push(`/dashboard/events/${event._id}`)}
                          className="block text-left w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <p className="font-medium text-gray-900 text-sm line-clamp-1">{event.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{event.venue}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border text-black border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Quick search</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Looking for events by location, speaker, or topic?
                    </p>
                    <div className="space-y-2">
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>All locations</option>
                        <option>Mumbai</option>
                        <option>Delhi</option>
                        <option>Bangalore</option>
                      </select>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>Any discipline</option>
                        <option>Civil</option>
                        <option>Mechanical</option>
                        <option>Electrical</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Events list
                </h2>
                <p className="text-sm text-gray-600 mb-4">Showing 1-50 of {events.length} events</p>

                {loading ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No events found</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Create First Event
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event._id}
                        onClick={() => router.push(`/dashboard/events/${event._id}`)}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                {event.eventType}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{formatDate(event.startDate)}</span>
                              </div>
                              {event.startTime && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatTime(event.startTime)}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.venue}</span>
                              </div>
                              {event.registeredCount > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{event.registeredCount} registered</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium ml-4">
                            View event
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {[...Array(Math.min(7, totalPages))].map((_, i) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}