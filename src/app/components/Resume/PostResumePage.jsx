"use client";

import { useState, useEffect } from "react";
import { Upload, Save, Eye } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserSidebar from "../layout/sidebar";
import UserNavbar from "../layout/navbar";

export default function PostResume() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [resumes, setResumes] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const categories = [
    "Software Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Data Science",
    "Product Management",
    "Other",
  ];

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    // experience: "",
    phone: "",
    email: "",
    cvId: "",
    profileVisibility: "public",
    yearsOfExperience: "",
    afterSubmission: "resume",
  });

  useEffect(() => {
    fetchUserData();
    fetchResumes();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);

      // Pre-fill form with user data
      setFormData((prev) => ({
        ...prev,
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.profile?.phone || "",
        category: res.data.profile?.category || "",
        experience: res.data.profile?.experience || "",
        yearsOfExperience: res.data.profile?.yearsOfExperience || "",
        cvId: res.data.profile?.resumeId || "",
        profileVisibility: res.data.profile?.profileVisibility || "public",
      }));
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(`${API_URL}/users/me/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(res.data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5 MB");
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("userToken");

      // If new CV file is selected, upload it first
      let cvId = formData.cvId;
      if (cvFile) {
        const cvFormData = new FormData();
        cvFormData.append("file", cvFile);
        cvFormData.append("title", `${formData.name} - Resume`);

        const uploadRes = await axios.post(
          `${API_URL}/users/me/resume`,
          cvFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        cvId = uploadRes.data._id;
      }

      // Update user profile
      const profileData = {
        name: formData.name,
        email: formData.email,
        profile: {
          phone: formData.phone,
          category: formData.category,
          resumeId: cvId,
          yearsOfExperience: formData.yearsOfExperience,
          profileVisibility: formData.profileVisibility,
        },
      };

      await axios.put(`${API_URL}/users/me`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(
        "Resume posted successfully! Your profile is now visible to employers."
      );

      if (formData.afterSubmission === "resume") {
        router.push("/dashboard/documents");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error posting resume:", err);
      alert(err.response?.data?.message || "Failed to post resume");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("userToken");
      const profileData = {
        profile: {
          ...formData,
          profileVisibility: "draft",
        },
      };

      await axios.put(`${API_URL}/users/me`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Resume saved as draft");
    } catch (err) {
      console.error("Error saving draft:", err);
      alert("Failed to save draft");
    } finally {
      setSaving(false);
    }
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Post Resume
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Upload your CV and fill basic details so KEA employers can
                    discover you
                  </p>
                </div>
                {/* <div className="flex items-center gap-2">
                  <span className="text-sm text-teal-600 font-medium">
                    Profile 80% complete
                  </span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                    Arun Kumar
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Civil Engineering
                  </span>
                </div> */}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume Upload */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Resume upload
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Upload your CV and fill basic details so employers can
                  discover you
                </p>

                <div className="space-y-4">
                  {/* File Upload Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drag and drop your resume here
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                      <input
                        type="file"
                        id="cv-upload"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-1">
                          {cvFile ? cvFile.name : "Upload CV"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Supported file types: PDF, DOC, DOCX
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Max 5 MB</p>
                      </label>
                    </div>
                  </div>

                  {/* OR Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* Select Existing Resume */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select from uploaded resumes
                    </label>
                    <select
                      name="cvId"
                      value={formData.cvId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Choose a resume</option>
                      {resumes.map((resume) => (
                        <option key={resume._id} value={resume._id}>
                          {resume.title} - {resume.originalName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select engineering category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience *
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 5 years"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter mobile number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If resume is applied with your email one and projects
                    </p>
                  </div>
                </div>
              </div>

              {/* Visibility & Notes */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Visibility & notes
                </h2>

                <div className="space-y-4">
                  {/* Profile Visibility */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile visibility
                    </label>
                    <select
                      name="profileVisibility"
                      value={formData.profileVisibility}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="public">
                        Public - Visible to all employers
                      </option>
                      <option value="kea-only">KEA Members Only</option>
                      <option value="private">
                        Private - Only visible to you
                      </option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Share only with verified KEA employers
                    </p>
                  </div>

                  {/* After Submission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      After submission
                    </label>
                    <select
                      name="afterSubmission"
                      value={formData.afterSubmission}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="resume">Go to Resume Page</option>
                      <option value="dashboard">Go to Dashboard</option>
                      <option value="jobs">Browse Jobs</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      You can update your details or upload a new resume anytime
                      from this page
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Save as draft
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Submitting..." : "Submit resume"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
