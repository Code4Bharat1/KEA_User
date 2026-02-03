"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserRegister() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Calendar states for experience
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [fromCalendarDate, setFromCalendarDate] = useState(new Date());
  const [toCalendarDate, setToCalendarDate] = useState(new Date());

  const [formData, setFormData] = useState({
    // Personal Details
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",

    // Professional Details
    headline: "",
    bio: "",
    company: "",
    position: "",
    from: "",
    to: "",
    description: "",
    category: "",

    // References
    reference1Name: "",
    reference1Contact: "",
    reference2Name: "",
    reference2Contact: "",
  });

  const [error, setError] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:7101/api";

  const categories = [
    "Software Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Electronics Engineering",
    "Electronics and Telecommunications",
    "Instrumentation Engineering",
    "Chemical Engineering",
    "Computer Engineering",
    "Automobile Engineering",
    "Aeronautical Engineering",
    "Aerospace Engineering",
    "Petrochemical Engineering",
    "Polymer Engineering",
    "Agricultural Engineering",
    "Biomedical Engineering",
    "Industrial Engineering",
    "Production Engineering",
    "Mining Engineering",
    "Metallurgical Engineering",
    "Environmental Engineering",
    "Marine Engineering",
    "Textile Engineering",
    "Architecture",
    "Other",
  ];

  // Months array
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate years array (from 1970 to current year + 5)
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1970; year <= currentYear + 5; year++) {
      years.push(year);
    }
    return years;
  };

  // Generate days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Calendar component for date selection
  const CalendarPicker = ({ isOpen, date, onDateSelect, onClose, type = "from" }) => {
    if (!isOpen) return null;

    const [currentDate, setCurrentDate] = useState(date);
    const [view, setView] = useState('month'); // 'month' or 'year'

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const prevMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1));
    };
    
    const nextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1));
    };
    
    const handleDateClick = (day) => {
      const selectedDate = new Date(year, month, day);
      const formattedDate = `${selectedDate.getFullYear()}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
      onDateSelect(formattedDate);
      onClose();
    };
    
    const handleYearSelect = (selectedYear) => {
      setCurrentDate(new Date(selectedYear, month, 1));
      setView('month');
    };

    return (
      <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
        <div className="flex justify-between items-center mb-4">
          <button 
            type="button"
            onClick={prevMonth} 
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setView('month')}
              className="font-semibold hover:text-blue-600"
            >
              {months[month]}
            </button>
            <button 
              type="button"
              onClick={() => setView('year')}
              className="font-semibold hover:text-blue-600"
            >
              {year}
            </button>
          </div>
          <button 
            type="button"
            onClick={nextMonth} 
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {view === 'month' ? (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="h-8"></div>
              ))}
              
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isToday = day === new Date().getDate() && 
                               month === new Date().getMonth() && 
                               year === new Date().getFullYear();
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={`h-8 flex items-center justify-center text-sm rounded hover:bg-blue-100 ${
                      isToday ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // Year selection view
          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {getYears().map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => handleYearSelect(year)}
                className={`p-2 text-sm rounded hover:bg-blue-100 ${
                  year === currentDate.getFullYear() ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {type === "to" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                onDateSelect('Present');
                onClose();
              }}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
            >
              Set as Present
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateStep1 = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.location ||
      !formData.category
    ) {
      setError("Please fill in all required personal details");
      return false;
    }
    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter and confirm your password");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        setError("");
      }
    } else if (step === 2) {
      setStep(3);
      setError("");
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create experience array if dates are provided
      const experienceArray = [];
      if (formData.company && formData.position && formData.from) {
        experienceArray.push({
          company: formData.company,
          position: formData.position,
          from: formData.from,
          to: formData.to || "Present",
          description: formData.description || ""
        });
      }

      // Create references array if provided
      const referencesArray = [];
      if (formData.reference1Name || formData.reference1Contact) {
        referencesArray.push({
          name: formData.reference1Name || "",
          contact: formData.reference1Contact || ""
        });
      }
      if (formData.reference2Name || formData.reference2Contact) {
        referencesArray.push({
          name: formData.reference2Name || "",
          contact: formData.reference2Contact || ""
        });
      }

      const profileData = {
        phone: formData.phone || "",
        location: formData.location || "",
        headline: formData.headline || "",
        bio: formData.bio || "",
        company: formData.company || "",
        position: formData.position || "",
        category: formData.category || "Other", // ✅ Now inside profile
        skills: [],
        experience: experienceArray,
        references: referencesArray, // ✅ Now sending references
      };

      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user",
        profile: profileData,
        membershipStatus: "pending",
      });

      alert("Registration successful! Your account is pending approval.");
      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br text-black from-gray-50 via-blue-50 to-teal-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-6">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/logo1.png"
                alt="KEA Logo"
                className="h-20 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Become a KEA Member
            </h1>
            <p className="text-sm text-teal-50 text-center">
              Fill out this form to get verified for full search access
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-md mx-auto">
              {/* Step 1 */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Personal
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Professional
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= 3
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  3
                </div>
                <span className="text-sm font-medium text-gray-700">
                  References
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Personal details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Engineering Category{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a password (min. 6 characters)"
                          required
                          minLength={6}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          required
                          minLength={6}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Location Full Width */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location (City, State, Country){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Mumbai, Maharashtra, India"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Professional information
                  </h3>

                  {/* Headline */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleInputChange}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Short Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and your professional experience..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Company */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Company/Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Position/Role
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="Your position"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Experience Dates with Calendar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* From Date with Calendar */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <div className="flex items-center">
                          <input
                            type="text"
                            name="from"
                            value={formData.from}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow only numbers and slash, max length 7 (YYYY/MM)
                              if (/^\d*\/?\d*$/.test(value) && value.length <= 7) {
                                setFormData({
                                  ...formData,
                                  from: value
                                });
                              }
                            }}
                            placeholder="YYYY/MM"
                            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            onBlur={(e) => {
                              // Validate and format on blur
                              const value = e.target.value;
                              if (value && /^\d{4}\/\d{2}$/.test(value)) {
                                // Already in correct format
                              } else if (value) {
                                // Try to auto-format
                                const clean = value.replace(/\D/g, '');
                                if (clean.length >= 6) {
                                  const year = clean.substring(0, 4);
                                  const month = clean.substring(4, 6);
                                  setFormData({
                                    ...formData,
                                    from: `${year}/${month}`
                                  });
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setShowFromCalendar(!showFromCalendar);
                              setShowToCalendar(false);
                            }}
                            className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
                          >
                            <Calendar className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                        
                        {/* Calendar Picker for From Date */}
                        <CalendarPicker
                          isOpen={showFromCalendar}
                          date={fromCalendarDate}
                          onDateSelect={(date) => {
                            setFormData({
                              ...formData,
                              from: date
                            });
                            setShowFromCalendar(false);
                          }}
                          onClose={() => setShowFromCalendar(false)}
                          type="from"
                        />
                      </div>
                    </div>

                    {/* To Date with Calendar */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <div className="flex items-center">
                          <input
                            type="text"
                            name="to"
                            value={formData.to}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\/?\d*$/.test(value) && value.length <= 7) {
                                setFormData({
                                  ...formData,
                                  to: value
                                });
                              }
                            }}
                            placeholder="YYYY/MM or Present"
                            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value && value.toLowerCase() === 'present') {
                                setFormData({
                                  ...formData,
                                  to: 'Present'
                                });
                              } else if (value && /^\d{4}\/\d{2}$/.test(value)) {
                                // Already in correct format
                              } else if (value) {
                                const clean = value.replace(/\D/g, '');
                                if (clean.length >= 6) {
                                  const year = clean.substring(0, 4);
                                  const month = clean.substring(4, 6);
                                  setFormData({
                                    ...formData,
                                    to: `${year}/${month}`
                                  });
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setShowToCalendar(!showToCalendar);
                              setShowFromCalendar(false);
                            }}
                            className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
                          >
                            <Calendar className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                        
                        {/* Calendar Picker for To Date */}
                        <CalendarPicker
                          isOpen={showToCalendar}
                          date={toCalendarDate}
                          onDateSelect={(date) => {
                            setFormData({
                              ...formData,
                              to: date
                            });
                            setShowToCalendar(false);
                          }}
                          onClose={() => setShowToCalendar(false)}
                          type="to"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of your role and responsibilities..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: References */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    References
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide two KEA member references (optional but recommended)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Reference 1 Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reference Member #1 Name
                      </label>
                      <input
                        type="text"
                        name="reference1Name"
                        value={formData.reference1Name}
                        onChange={handleInputChange}
                        placeholder="Full name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Reference 1 Contact */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Member #1 ID or Contact
                      </label>
                      <input
                        type="text"
                        name="reference1Contact"
                        value={formData.reference1Contact}
                        onChange={handleInputChange}
                        placeholder="KEA member ID or email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Reference 2 Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reference Member #2 Name
                      </label>
                      <input
                        type="text"
                        name="reference2Name"
                        value={formData.reference2Name}
                        onChange={handleInputChange}
                        placeholder="Full name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Reference 2 Contact */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Member #2 ID or Contact
                      </label>
                      <input
                        type="text"
                        name="reference2Contact"
                        value={formData.reference2Contact}
                        onChange={handleInputChange}
                        placeholder="KEA member ID or email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-800">
                      💡 Your application will be reviewed by KEA
                      administrators. You'll receive an email notification once
                      your membership is approved.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-gray-600">
                Already have an account?{" "}
                <span className="font-semibold text-blue-600 hover:text-blue-700">
                  Sign in
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}