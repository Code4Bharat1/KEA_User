"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  BookOpen,
  ArrowRight,
  Calendar,
  MapPin,
  Quote,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  Mail,
  Menu,
  X,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";
import Link from "next/link";

export default function KEALandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Briefcase,
      title: "Job Portal",
      description:
        "Access exclusive engineering opportunities worldwide. Find your next role or hire top talent from our community.",
      gradient: "from-blue-500 to-cyan-500",
      delay: "0",
    },
    {
      icon: Users,
      title: "Networking",
      description:
        "Connect with mentors, industry leaders, and peers. Build relationships that last a lifetime.",
      gradient: "from-purple-500 to-pink-500",
      delay: "100",
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description:
        "Stay ahead with our technical library, expert-led webinars, and industry articles.",
      gradient: "from-orange-500 to-red-500",
      delay: "200",
    },
  ];

  const testimonials = [
    {
      quote:
        "KEA helped me find my first job in Dubai. The mentorship program was invaluable for my career transition.",
      author: "Ahmed K.",
      role: "Civil Engineer",
      rating: 5,
    },
    {
      quote:
        "A fantastic platform for networking. I've connected with senior engineers who provided great guidance.",
      author: "Sanya M.",
      role: "Software Developer",
      rating: 5,
    },
    {
      quote:
        "The webinars and technical resources are top-notch. It's great to see a community so focused on growth.",
      author: "Fahad R.",
      role: "Mechanical Lead",
      rating: 5,
    },
  ];

  const upcomingEvents = [
    {
      date: "18",
      month: "OCT",
      year: "2024",
      title: "Future of Civil Engineering",
      type: "Conference",
      location: "Mumbai, India",
      attendees: "500+",
      action: "Register Now",
      color: "blue",
    },
    {
      date: "23",
      month: "OCT",
      year: "2024",
      title: "Webinar: AI in Tech",
      type: "Online Event",
      location: "Virtual",
      attendees: "1000+",
      action: "Join Online",
      color: "purple",
    },
    {
      date: "06",
      month: "NOV",
      year: "2024",
      title: "Annual Members Meetup",
      type: "Networking",
      location: "Dubai, UAE",
      attendees: "300+",
      action: "RSVP",
      color: "orange",
    },
  ];

  const stats = [
    { label: "Active Members", value: "10,000+", icon: Users },
    { label: "Job Placements", value: "2,500+", icon: Briefcase },
    { label: "Partner Companies", value: "500+", icon: Globe },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group ">
              <img
                src="/logo1.png"
                alt="KEA Logo"
                className="h-16 object-cover transition-transform group-hover:scale-110"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {["Home", "About", "Career Portal", "Knowledge Hub", "Events", "Contact"].map(
                (item, index) => (
                  <Link
                    key={index}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                Join KEA
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
            <div className="px-4 py-6 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
              {["Home", "About", "Career Portal", "Knowledge Hub", "Events", "Contact"].map(
                (item, index) => (
                  <Link
                    key={index}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all"
                  >
                    {item}
                  </Link>
                )
              )}
              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-3 text-center text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold"
                >
                  Join KEA
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 animate-bounce">
              <Sparkles className="w-4 h-4" />
              Connecting Kokani Engineers Worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                KEA
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed px-4">
              Your premier community for professional networking, global job
              opportunities, and engineering knowledge sharing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Join Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              {/* <Link
                href="/Jobs"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 hover:shadow-lg transition-all text-lg"
              >
                Explore Jobs
              </Link> */}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 px-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What KEA Offers
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Everything you need to advance your engineering career and connect
              with your community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300 transition-all duration-300"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Our Purpose
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-12">
              The Kokani Engineers Association (KEA) is dedicated to uniting
              engineers from our community on a single global platform. Our
              mission is to foster professional growth, facilitate meaningful
              connections, and provide resources that empower every member to
              achieve excellence in their field.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: Globe, title: "Global Network", desc: "Connect with engineers worldwide", color: "blue" },
                { icon: TrendingUp, title: "Career Growth", desc: "Advance your professional journey", color: "purple" },
                { icon: Award, title: "Excellence", desc: "Achieve greatness in your field", color: "orange" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all"
                >
                  <item.icon className={`w-10 h-10 sm:w-12 sm:h-12 text-${item.color}-600 mx-auto mb-4`} />
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Hear from engineers who have grown with KEA.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 sm:p-8 relative hover:shadow-2xl hover:-translate-y-2 transition-all border-2 border-blue-100"
              >
                <Quote className="w-10 h-10 text-blue-600 mb-4 opacity-30" />
                <p className="text-gray-700 italic mb-6 leading-relaxed text-sm sm:text-base">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                {/* Star Rating */}
                <div className="flex gap-1 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section - FIXED LAYOUT */}
      <section id="events" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Join our seminars, workshops, and meetups.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all group"
              >
                {/* Top Color Bar */}
                <div
                  className={`h-2 bg-gradient-to-r ${
                    event.color === "blue"
                      ? "from-blue-600 to-cyan-600"
                      : event.color === "purple"
                      ? "from-purple-600 to-pink-600"
                      : "from-orange-600 to-red-600"
                  }`}
                ></div>

                <div className="p-6 sm:p-8">
                  {/* Date Badge and Type - Side by Side */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center min-w-[80px] border-2 border-blue-200 shrink-0">
                      <div className="text-3xl font-bold text-gray-900">{event.date}</div>
                      <div className="text-sm font-semibold text-gray-600 uppercase">
                        {event.month}
                      </div>
                      <div className="text-xs text-gray-500">{event.year}</div>
                    </div>

                    {/* Event Type Badge */}
                    <div className="flex-1 pt-2">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                        event.color === "blue"
                          ? "bg-blue-100 text-blue-700"
                          : event.color === "purple"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Event Title - Fixed Height */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors min-h-[64px]">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-2 mb-6 text-sm sm:text-base">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 shrink-0" />
                      <span>{event.attendees} Attendees</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                    {event.action}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Mail className="w-16 h-16 text-white mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Stay Connected
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 px-4">
            Subscribe to our newsletter for the latest updates, job
            opportunities, and event announcements.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-white border-2 border-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition-all"
            />
            <button
              type="submit"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              Subscribe
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo1.png"
                  alt="KEA Logo"
                  className="h-20 object-cover"
                />
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Connecting engineers, creating opportunities, and fostering a
                stronger community together.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Linkedin, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Facebook, href: "#" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Career Portal", "Events", "Contact"].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-3">
                {["Job Portal", "Blog", "Knowledge Hub", "Privacy Policy"].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <Mail className="w-5 h-5 mt-0.5 shrink-0" />
                  <a href="mailto:info@kea.com" className="hover:text-white transition-colors">
                    info@kea.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-5 h-5 mt-0.5 shrink-0" />
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p className="mb-2 text-sm sm:text-base">
              © 2025 Kokani Engineers Association. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm">
              Deployed by{" "}
              <a
                href="https://nexcorealliance.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                NexCore Alliance
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}