'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  MapPin,
  Briefcase,
  Star,
  Calendar,
  Clock,
  Mail,
  Linkedin,
  Award,
  BookOpen,
  Languages,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function MentorDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mentor, setMentor] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    fetchUserData();
    fetchMentorDetail();
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

  const fetchMentorDetail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/mentors/${params.id}`);
      setMentor(data);
    } catch (error) {
      console.error('Error fetching mentor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async (slotId) => {
    if (!confirm('Do you want to book this session?')) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/mentors/${params.id}/book`, 
        { slotId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Session booked successfully!');
      fetchMentorDetail();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book session');
    }
  };

  const getCalendarDays = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const isDayAvailable = (day) => {
    if (!day || !mentor?.availability) return false;
    
    const dateToCheck = new Date(selectedYear, selectedMonth, day);
    
    return mentor.availability.some(slot => {
      const slotDate = new Date(slot.date);
      return slotDate.getDate() === day &&
             slotDate.getMonth() === selectedMonth &&
             slotDate.getFullYear() === selectedYear &&
             !slot.isBooked;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Mentor not found</p>
          <button
            onClick={() => router.push('/dashboard/mentorship')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Mentors
          </button>
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
            {/* Back Button */}
            <button
              onClick={() => router.push('/dashboard/mentorship')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Mentors</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mentor Profile Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-12 h-12 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          Mentor
                        </span>
                      </div>
                      <p className="text-lg text-gray-700 mb-1">{mentor.title}</p>
                      {mentor.organization && (
                        <p className="text-gray-600 mb-3">{mentor.organization}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {mentor.experience?.years && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{mentor.experience.years}+ years experience</span>
                          </div>
                        )}
                        {mentor.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{mentor.location}</span>
                          </div>
                        )}
                        {mentor.stats?.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{mentor.stats.rating.toFixed(1)} ({mentor.stats.reviews} reviews)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                      <Award className="w-4 h-4" />
                      <span>View public profile</span>
                    </button>
                    <button className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                      Request mentorship
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Bio</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{mentor.bio}</p>
                </div>

                {/* Skills & Focus Areas */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Focus areas</h2>
                  <div className="space-y-4">
                    {mentor.expertise && mentor.expertise.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map((exp, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {mentor.skills && mentor.skills.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {mentor.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {mentor.focusAreas && mentor.focusAreas.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Focus Areas</h3>
                        <div className="flex flex-wrap gap-2">
                          {mentor.focusAreas.map((area, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ideal mentee */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Ideal mentee</h2>
                  <p className="text-gray-700 mb-4">
                    I am looking for structural engineers in the first 3-5 years of their career who are working on 
                    bridges, marine works, or transitioning from design to site or vice-versa.
                  </p>
                </div>

                {/* Experience */}
                {mentor.experience?.description && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{mentor.title}</p>
                            {mentor.organization && (
                              <p className="text-sm text-gray-600">{mentor.organization}</p>
                            )}
                            <p className="text-sm text-gray-700 mt-2">{mentor.experience.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Education */}
                {mentor.education && mentor.education.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
                    <div className="space-y-3">
                      {mentor.education.map((edu, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{edu.degree}</p>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                            {edu.year && <p className="text-sm text-gray-500">{edu.year}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {mentor.achievements && mentor.achievements.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
                    <ul className="space-y-2">
                      {mentor.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Languages */}
                {mentor.languages && mentor.languages.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>
                    <div className="flex flex-wrap gap-2">
                      {mentor.languages.map((lang, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          <Languages className="w-4 h-4" />
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Availability Calendar */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Pick a slot that's emerging your interactive request
                  </p>

                  {/* Month/Year Selector */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => {
                        if (selectedMonth === 0) {
                          setSelectedMonth(11);
                          setSelectedYear(selectedYear - 1);
                        } else {
                          setSelectedMonth(selectedMonth - 1);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      ←
                    </button>
                    <span className="font-medium">
                      {months[selectedMonth]} {selectedYear}
                    </span>
                    <button
                      onClick={() => {
                        if (selectedMonth === 11) {
                          setSelectedMonth(0);
                          setSelectedYear(selectedYear + 1);
                        } else {
                          setSelectedMonth(selectedMonth + 1);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      →
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {getCalendarDays().map((day, idx) => (
                      <div
                        key={idx}
                        className={`aspect-square flex items-center justify-center text-sm rounded ${
                          day
                            ? isDayAvailable(day)
                              ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
                              : 'text-gray-400'
                            : ''
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Select timeslot
                  </button>
                </div>

                {/* Mentorship Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Mentorship details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Session via</p>
                      <p className="font-medium text-gray-900">Video via email invite (Zoom / GMeet)</p>
                    </div>
                    <div>
                      <p className="text-gray-600">English level</p>
                      <p className="font-medium text-gray-900">Proficient</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Max sessions per month</p>
                      <p className="font-medium text-gray-900">4 sessions</p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                {mentor.contact && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                    <div className="space-y-3">
                      {mentor.contact.email && (
                        <a href={`mailto:${mentor.contact.email}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{mentor.contact.email}</span>
                        </a>
                      )}
                      {mentor.contact.linkedin && (
                        <a href={mentor.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm">LinkedIn Profile</span>
                        </a>
                      )}
                    </div>
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