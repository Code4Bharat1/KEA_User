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
  Facebook
} from "lucide-react";

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
      description: "Access exclusive engineering opportunities worldwide. Find your next role or hire top talent from our community.",
      gradient: "from-teal-600 to-emerald-600",
      borderColor: "border-teal-500",
      delay: "0",
    },
    {
      icon: Users,
      title: "Networking",
      description: "Connect with mentors, industry leaders, and peers. Build relationships that last a lifetime.",
      gradient: "from-orange-500 to-red-500",
      borderColor: "border-orange-500",
      delay: "100",
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Stay ahead with our technical library, expert-led webinars, and industry articles.",
      gradient: "from-emerald-600 to-teal-600",
      borderColor: "border-emerald-500",
      delay: "200",
    },
  ];

  const testimonials = [
    {
      quote: "KEA helped me find my first job in Dubai. The mentorship program was invaluable for my career transition.",
      author: "Ahmed K.",
      role: "Civil Engineer",
      rating: 5,
    },
    {
      quote: "A fantastic platform for networking. I've connected with senior engineers who provided great guidance.",
      author: "Sanya M.",
      role: "Software Developer",
      rating: 5,
    },
    {
      quote: "The webinars and technical resources are top-notch. It's great to see a community so focused on growth.",
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
      color: "teal",
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
      color: "orange",
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
      color: "emerald",
    },
  ];

  const stats = [
    { label: "Active Members", value: "10,000+", icon: Users, color: "teal" },
    { label: "Job Placements", value: "2,500+", icon: Briefcase, color: "orange" },
    { label: "Partner Companies", value: "500+", icon: Globe, color: "emerald" },
    { label: "Success Rate", value: "95%", icon: TrendingUp, color: "teal" },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-gradient-to-r from-teal-600 to-emerald-600 shadow-2xl" : "bg-gradient-to-r from-teal-600 to-emerald-600"}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <img src="/logo1.png" alt="KEA Logo" className="h-12 sm:h-16 md:h-20 object-cover transition-transform hover:scale-110 drop-shadow-lg" />
              
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {["Home", "About", "Career Portal", "Resources", "Events", "Contact"].map((item, index) => (
                <a key={index} href={`#${item.toLowerCase().replace(" ", "-")}`} className="px-3 xl:px-4 py-2 text-sm xl:text-base text-white hover:bg-white/20 font-semibold rounded-lg transition-all">
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <a href="#login" className="px-3 lg:px-5 py-2 lg:py-2.5 text-sm lg:text-base text-white hover:bg-white/20 font-semibold rounded-lg transition-all">
                Sign In
              </a>
              <a href="#register" className="px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 hover:shadow-2xl hover:scale-105 transition-all border-2 border-white/30">
                Join KEA
              </a>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors">
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-white/10 shadow-2xl">
            <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-2 max-h-screen overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
              {["Home", "About", "Career Portal", "Resources", "Events", "Contact"].map((item, index) => (
                <a key={index} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white hover:bg-teal-600 rounded-lg font-semibold transition-all">
                  {item}
                </a>
              ))}
              <div className="pt-3 sm:pt-4 space-y-2">
                <a href="#login" className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-center text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/10 transition-all">
                  Sign In
                </a>
                <a href="#register" className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-center bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600">
                  Join KEA Now
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 sm:pt-28 md:pt-36 lg:pt-44 pb-12 sm:pb-16 md:pb-20 lg:pb-28 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-white to-teal-50 relative overflow-hidden">
        <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-teal-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-orange-200 rounded-full blur-3xl opacity-25 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-48 sm:w-56 md:w-72 h-48 sm:h-56 md:h-72 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 md:mb-8 shadow-lg border-2 border-teal-300 animate-bounce">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Connecting Kokani Engineers Worldwide</span>
              <span className="sm:hidden">KEA Worldwide</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight px-2" style={{ textShadow: '0 2px 20px rgba(13, 148, 136, 0.3)' }}>
              Welcome to <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">KEA</span>
            </h1>

            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-teal-700 mb-3 sm:mb-4 px-2">
              Kokani Engineers Association
            </div>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 mb-6 sm:mb-8 md:mb-12 leading-relaxed px-3 sm:px-4 font-medium">
              Your premier community for professional networking, global job opportunities, and engineering excellence.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 md:gap-5 px-3 sm:px-4">
              <a href="#register" className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl md:rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 sm:gap-3 border-2 sm:border-4 border-teal-700">
                <span>Join KEA Today</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </a>
              <a href="#about" className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl bg-white border-2 sm:border-4 border-orange-500 text-orange-600 rounded-xl md:rounded-2xl font-bold hover:bg-orange-50 hover:shadow-xl hover:scale-105 transition-all">
                Learn More
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-8 sm:mt-12 md:mt-16 lg:mt-20 px-2 sm:px-4 md:px-6">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;

                const borderColor =
                  stat.color === "teal"
                    ? "border-l-teal-600 text-teal-600"
                    : stat.color === "orange"
                      ? "border-l-orange-500 text-orange-500"
                      : "border-l-emerald-600 text-emerald-600";

                return (
                  <div
                    key={index}
                    className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-7 
        shadow-lg hover:shadow-2xl transition-all duration-300 
        hover:-translate-y-1 sm:hover:-translate-y-2 
        border-l-4 ${borderColor}`}
                  >
                    {/* Icon */}
                    <StatIcon
                      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 
          mx-auto mb-2 sm:mb-3`}
                    />

                    {/* Value */}
                    <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl  font-extrabold text-gray-900 leading-tight">
                      {stat.value}
                    </div>

                    {/* Label */}
                    <div className="mt-1 text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-gray-600 text-center">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-transparent to-teal-600"></div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-500" />
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 bg-gradient-to-l from-transparent to-teal-600"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-3 sm:mb-4 md:mb-6 px-2">
              What KEA Offers
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-3xl mx-auto px-3 sm:px-4 font-medium">
              Everything you need to advance your engineering career and connect with your community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={index} className={`group bg-white border-l-4 sm:border-l-8 ${feature.borderColor} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-3 transition-all duration-300 shadow-lg`}>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xl`}>
                    <FeatureIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-gray-900 mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm md:text-base font-bold mb-6 sm:mb-8 shadow-lg border-2 border-orange-300">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              Our Purpose
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-6 sm:mb-8 md:mb-10 px-2">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-10 sm:mb-12 md:mb-16 px-3 sm:px-4 font-medium">
              The Kokani Engineers Association (KEA) is dedicated to uniting engineers from our community on a single global platform. Our mission is to foster professional growth, facilitate meaningful connections, and provide resources that empower every member to achieve excellence in their field.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {[
                { icon: Globe, title: "Global Network", desc: "Connect with engineers worldwide", gradient: "from-teal-600 to-emerald-600" },
                { icon: TrendingUp, title: "Career Growth", desc: "Advance your professional journey", gradient: "from-orange-500 to-red-500" },
                { icon: Award, title: "Excellence", desc: "Achieve greatness in your field", gradient: "from-emerald-600 to-teal-600" },
              ].map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-3 transition-all border-t-4 border-t-teal-600">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 bg-gradient-to-br ${item.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
                      <ItemIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-gray-900 mb-2 sm:mb-3">{item.title}</h4>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-medium">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-transparent to-orange-500"></div>
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-teal-600" />
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 bg-gradient-to-l from-transparent to-orange-500"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-3 sm:mb-4 md:mb-6 px-2">
              What Our Members Say
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 font-medium px-3">
              Hear from engineers who have grown with KEA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 relative hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-3 transition-all border-2 sm:border-4 border-teal-200">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-teal-600 mb-4 sm:mb-5 md:mb-6 opacity-40" />
                <p className="text-gray-800 italic mb-5 sm:mb-6 md:mb-8 leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-black text-base sm:text-lg md:text-xl shadow-lg shrink-0">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm sm:text-base md:text-lg">
                      {testimonial.author}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-semibold">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mt-4 sm:mt-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-500 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-transparent to-teal-600"></div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-500" />
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 bg-gradient-to-l from-transparent to-teal-600"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-3 sm:mb-4 md:mb-6 px-2">
              Upcoming Events
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 font-medium px-3">
              Join our seminars, workshops, and meetups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-3 transition-all group">
                <div className={`h-2 sm:h-3 bg-gradient-to-r ${event.color === "teal" ? "from-teal-600 to-emerald-600" : event.color === "orange" ? "from-orange-500 to-red-500" : "from-emerald-600 to-teal-600"}`}></div>

                <div className="p-5 sm:p-6 md:p-8 lg:p-10">
                  <div className="flex items-start gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5 md:mb-6">
                    <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-center min-w-[70px] sm:min-w-[80px] md:min-w-[90px] border-2 sm:border-4 shadow-lg shrink-0 ${event.color === "teal" ? "bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-300" : event.color === "orange" ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-300" : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300"}`}>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">{event.date}</div>
                      <div className="text-xs sm:text-sm font-bold text-gray-600 uppercase">{event.month}</div>
                      <div className="text-xs text-gray-500 font-semibold" style={{ fontSize: '10px' }}>{event.year}</div>
                    </div>

                    <div className="flex-1 pt-1 sm:pt-2">
                      <span className={`inline-block px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-bold shadow-md ${event.color === "teal" ? "bg-teal-100 text-teal-800 border-2 border-teal-300" : event.color === "orange" ? "bg-orange-100 text-orange-800 border-2 border-orange-300" : "bg-emerald-100 text-emerald-800 border-2 border-emerald-300"}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-gray-900 mb-4 sm:mb-5 md:mb-6 group-hover:text-teal-600 transition-colors min-h-[48px] sm:min-h-[56px] md:min-h-[72px]">
                    {event.title}
                  </h3>

                  <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base lg:text-lg">
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-700 font-semibold">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-700 font-semibold">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
                      <span>{event.attendees} Attendees</span>
                    </div>
                  </div>

                  <button className={`w-full py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl text-white font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3 group-hover:scale-105 text-sm sm:text-base md:text-lg ${event.color === "teal" ? "bg-gradient-to-r from-teal-600 to-emerald-600" : event.color === "orange" ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-emerald-600 to-teal-600"}`}>
                    {event.action}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl">
            <Mail className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6 px-2">
            Stay Connected
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-sky-100 mb-8 sm:mb-10 md:mb-12 px-3 sm:px-4 font-medium">
            Subscribe to our newsletter for the latest updates, job opportunities, and event announcements.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 max-w-2xl mx-auto px-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-xl font-semibold text-sm sm:text-base md:text-lg" />
            <button type="submit" className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-orange-500 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-orange-600 hover:scale-105 transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-2xl border-2 border-white/30 text-sm sm:text-base md:text-lg">
              <span className="hidden sm:inline">Subscribe Now</span>
              <span className="sm:hidden">Subscribe</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <img src="/logo1.png" alt="KEA Logo" className="h-16 sm:h-20 md:h-24 object-cover drop-shadow-2xl" />
              </div>
            
              <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed mb-5 sm:mb-6 font-medium">
                Connecting engineers, creating opportunities, and fostering a stronger community together.
              </p>
              <div className="flex gap-2 sm:gap-3">
                {[
                  { icon: Linkedin, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Facebook, href: "#" },
                ].map((social, index) => {
                  const SocialIcon = social.icon;
                  return (
                    <a key={index} href={social.href} className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-teal-600 hover:to-emerald-600 transition-all hover:scale-110 shadow-lg">
                      <SocialIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-black mb-4 sm:mb-6 text-teal-400">Company</h3>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                {["About KEA", "Career Portal", "Events", "Contact"].map((item, index) => (
                  <li key={index}>
                    <a href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 hover:text-white transition-colors hover:translate-x-1 sm:hover:translate-x-2 inline-block font-semibold">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-black mb-4 sm:mb-6 text-orange-400">Resources</h3>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                {["Job Portal", "Blog", "Knowledge Hub", "Privacy Policy"].map((item, index) => (
                  <li key={index}>
                    <a href={`/${item.toLowerCase().replace(" ", "-")}`} className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 hover:text-white transition-colors hover:translate-x-1 sm:hover:translate-x-2 inline-block font-semibold">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-black mb-4 sm:mb-6 text-emerald-400">Contact</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-400">
                <li className="flex items-start gap-2 sm:gap-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-0.5 shrink-0 text-teal-400" />
                  <a href="mailto:info@kea.com" className="text-xs sm:text-sm md:text-base lg:text-lg hover:text-white transition-colors font-semibold break-all">
                    info@kea.com
                  </a>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-0.5 shrink-0 text-orange-400" />
                  <a href="tel:+1234567890" className="text-xs sm:text-sm md:text-base lg:text-lg hover:text-white transition-colors font-semibold">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-0.5 shrink-0 text-emerald-400" />
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 sm:pt-8 md:pt-10 text-center">
            <p className="mb-2 sm:mb-3 text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 font-semibold">
              © 2025 Kokani Engineers Association. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-gray-500" style={{ fontSize: window.innerWidth < 375 ? '10px' : undefined }}>
              Deployed by{" "}
              <a href="https://nexcorealliance.com/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors font-bold">
                NexCore Alliance
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}