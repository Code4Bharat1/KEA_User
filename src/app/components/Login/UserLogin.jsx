"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function UserLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.post(`${API_URL}/auth/login`, formData);
    const { token, user } = response.data;

    if (user.role !== "user") {
      toast.error("Please use admin login for admin access.");
      return;
    }

    if (user.membershipStatus === "pending") {
      toast.error("Your membership is pending admin approval.");
      return;
    }

    if (user.membershipStatus === "inactive") {
      toast.error("Your membership has been deactivated.");
      return;
    }

    localStorage.setItem("userToken", token);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        membershipStatus: user.membershipStatus,
      })
    );

    toast.success("Login successful! Redirecting...");
    router.push("/dashboard");

  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-linear-to-br text-black from-gray-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="flex justify-center mb-6 bg-black">
            <img
              src="/logo1.png"
              alt="KEA Logo"
              className="h-20 object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              KEA User Login
            </h1>
            <p className="text-sm text-gray-600">
              Access your KEA account to manage your profile, jobs, and events.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
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

            {/* Forgot Password Link */}
            {/* <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div> */}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/register"
            className="block w-full py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
          >
            Register Now
          </Link>

          {/* Admin Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Are you an admin?{" "}
              <span className="font-semibold text-teal-600">Login here</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2025 Konkani Engineers Association. All rights reserved.
        </p>
      </div>
    </div>
  );
}
