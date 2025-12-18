'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, UserPlus, Briefcase, GraduationCap, Award } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserRegister() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Personal Details
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    
    // Professional Details
    headline: '',
    bio: '',
    company: '',
    position: '',
    experience: '',
    category: '',
    
    // References
    reference1Name: '',
    reference1Contact: '',
    reference2Name: '',
    reference2Contact: '',
    
    // Supporting Documents
    resume: null,
    certificates: [],
  });
  
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const categories = [
    'Software Engineering',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Electronics Engineering',
    'Chemical Engineering',
    'Computer Engineering',
    'Architecture',
    'Other'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'resume') {
      setFormData({ ...formData, resume: files[0] });
    } else if (name === 'certificates') {
      setFormData({ ...formData, certificates: Array.from(files) });
    }
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.location) {
      setError('Please fill in all personal details');
      return false;
    }
    if (!formData.password || !formData.confirmPassword) {
      setError('Please enter and confirm your password');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        setError('');
      }
    } else if (step === 2) {
      setStep(3);
      setError('');
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add basic data
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('role', 'user');
      
      // Add profile data as JSON
      const profileData = {
        phone: formData.phone,
        location: formData.location,
        headline: formData.headline,
        bio: formData.bio,
        company: formData.company,
        position: formData.position,
        experience: formData.experience,
        category: formData.category,
        references: [
          {
            name: formData.reference1Name,
            contact: formData.reference1Contact,
          },
          {
            name: formData.reference2Name,
            contact: formData.reference2Contact,
          }
        ].filter(ref => ref.name && ref.contact)
      };
      
      submitData.append('profile', JSON.stringify(profileData));
      
      // Add files if any
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }
      
      formData.certificates.forEach((cert, index) => {
        submitData.append(`certificate${index}`, cert);
      });

      await axios.post(`${API_URL}/auth/register`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success message
      alert('Registration successful! Your account is pending approval. You will receive an email once approved.');
      
      // Redirect to login
      router.push('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-teal-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-teal-500 to-cyan-500 px-8 py-6">
            <div className="flex items-center justify-center mb-4 bg-black">
              <img 
                src="/logo1.png" 
                alt="KEA Logo" 
                className="h-20 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-2">Become a KEA Member</h1>
            <p className="text-sm text-teal-50 text-center">
              Fill out this form to get verified for full search access
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Personal</span>
              </div>
              <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Professional</span>
              </div>
              <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">References</span>
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
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Personal details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
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
                        Email
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
                        Enter your email
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

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter your category
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
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter your email
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a password"
                          required
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter your category
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          required
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Location Full Width */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location (City, State, Country)
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
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Professional information</h3>
                  
                  {/* Headline */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Professional headline (e.g., "Senior Software Engineer")
                    </label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleInputChange}
                      placeholder="Enter your professional headline"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Short bio (optional, but recommended for profile)
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and your professional experience..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Company */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current company/organization (if applicable)
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
                        Current position/role (if applicable)
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

                    {/* Years of Experience */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Years of experience
                      </label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="e.g., 5 years"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: References */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">References</h3>
                  <p className="text-sm text-gray-600 mb-4">Provide two KEA member references (optional but recommended)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Reference 1 Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reference member #1
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
                        Enter member ID
                      </label>
                      <input
                        type="text"
                        name="reference1Contact"
                        value={formData.reference1Contact}
                        onChange={handleInputChange}
                        placeholder="KEA member ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Reference 2 Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reference member #2
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
                        Enter member ID
                      </label>
                      <input
                        type="text"
                        name="reference2Contact"
                        value={formData.reference2Contact}
                        onChange={handleInputChange}
                        placeholder="KEA member ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Supporting documents</h4>
                    <p className="text-sm text-gray-600 mb-4">Upload relevant documents (optional, PDF / JPEG only, max 5 MB)</p>
                    
                    {/* Resume */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Resume/CV
                      </label>
                      <input
                        type="file"
                        name="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Certificates */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Certificates/Licenses (you can upload multiple)
                      </label>
                      <input
                        type="file"
                        name="certificates"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
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
                    Back
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
                      <>
                        Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-gray-600">
                Already have an account? <span className="font-semibold text-blue-600 hover:text-blue-700">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}