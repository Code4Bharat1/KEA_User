'use client';

import { useState } from 'react';
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
  X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function KEALandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: Briefcase,
      title: 'Job Portal',
      description: 'Access exclusive engineering opportunities worldwide. Find your next role or hire top talent from our community.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Networking',
      description: 'Connect with mentors, industry leaders, and peers. Build relationships that last a lifetime.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Stay ahead with our technical library, expert-led webinars, and industry articles.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      quote: "KEA helped me find my first job in Dubai. The mentorship program was invaluable for my career transition.",
      author: "Ahmed K.",
      role: "Civil Engineer",
      avatar: "/api/placeholder/48/48"
    },
    {
      quote: "A fantastic platform for networking. I've connected with senior engineers who provided great guidance.",
      author: "Sanya M.",
      role: "Software Developer",
      avatar: "/api/placeholder/48/48"
    },
    {
      quote: "The webinars and technical resources are top-notch. It's great to see a community so focused on growth.",
      author: "Fahad R.",
      role: "Mechanical Lead",
      avatar: "/api/placeholder/48/48"
    }
  ];

  const upcomingEvents = [
    {
      date: 'OCT 18, 2024',
      title: 'Future of Civil Engineering',
      type: 'Conference',
      action: 'Register Now',
      color: 'blue'
    },
    {
      date: 'OCT 23, 2024',
      title: 'Webinar: AI in Tech',
      type: 'Online Event',
      action: 'Join Online',
      color: 'purple'
    },
    {
      date: 'NOV 06, 2024',
      title: 'Annual Members Meetup',
      type: 'Networking',
      action: 'RSVP',
      color: 'orange'
    }
  ];

  const stats = [
    { label: 'Active Members', value: '10,000+' },
    { label: 'Job Placements', value: '2,500+' },
    { label: 'Partner Companies', value: '500+' },
    { label: 'Success Rate', value: '95%' }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-500  backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4 mt-2">
              <img 
                src="/logo1.png" 
                alt="KEA Logo" 
                className="h-20  object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                About Us
              </Link>
              <Link href="#portal" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Career Portal
              </Link>
              <Link href="#knowledge" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Knowledge Hub
              </Link>
              <Link href="#events" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Events
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </Link>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                href="/register"
                className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Join KEA
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <Link href="#home" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">
                Home
              </Link>
              <Link href="#about" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">
                About Us
              </Link>
              <Link href="#portal" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">
                Career Portal
              </Link>
              <Link href="#knowledge" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">
                Knowledge Hub
              </Link>
              <Link href="#events" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">
                Events
              </Link>
              <Link href="#contact" className="block text-gray-700 hover:text-blue-600 py-2 font-medium">
                Contact
              </Link>
              <Link
                href="/register"
                className="block px-6 py-2.5 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-center"
              >
                Join KEA
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Connecting Kokani Engineers Worldwide
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">KEA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              Your premier community for professional networking, global job opportunities, and engineering knowledge sharing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 text-lg"
              >
                Join Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/jobs"
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all text-lg"
              >
                Explore Jobs
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What KEA Offers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to advance your engineering career and connect with your community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-linear-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Our Purpose
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              The Kokani Engineers Association (KEA) is dedicated to uniting engineers from our community on a single global platform. Our mission is to foster professional growth, facilitate meaningful connections, and provide resources that empower every member to achieve excellence in their field.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Globe className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h4 className="font-bold text-gray-900 mb-2">Global Network</h4>
                <p className="text-gray-600 text-sm">Connect with engineers worldwide</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                <h4 className="font-bold text-gray-900 mb-2">Career Growth</h4>
                <p className="text-gray-600 text-sm">Advance your professional journey</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Award className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                <h4 className="font-bold text-gray-900 mb-2">Excellence</h4>
                <p className="text-gray-600 text-sm">Achieve greatness in your field</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600">
              Hear from engineers who have grown with KEA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 relative hover:shadow-xl transition-shadow"
              >
                <Quote className="w-10 h-10 text-blue-600 mb-4 opacity-50" />
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600">
              Join our seminars, workshops, and meetups.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
              >
                <div className={`h-2 bg-linear-to-r ${
                  event.color === 'blue' ? 'from-blue-600 to-cyan-600' :
                  event.color === 'purple' ? 'from-purple-600 to-pink-600' :
                  'from-orange-600 to-red-600'
                }`}></div>
                <div className="p-8">
                  <div className="text-sm font-semibold text-blue-600 mb-2">
                    {event.date}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-6">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{event.type}</span>
                  </div>
                  <button className="w-full py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    {event.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stay Connected
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to our newsletter for the latest updates, job opportunities, and event announcements.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Subscribe
              <Mail className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center justify-center mb-4">
              <img 
                src="/logo1.png" 
                alt="KEA Logo" 
                className="h-20 object-cover"
              />
                {/* <span className="text-sm font-bold">KEA Platform</span> */}
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting engineers, creating opportunities, and fostering a stronger community together.
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#portal" className="text-gray-400 hover:text-white transition-colors">Career Portal</Link></li>
                <li><Link href="#events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
                <li><Link href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">Job Portal</Link></li>
                <li><Link href="/blogs" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/knowledge" className="text-gray-400 hover:text-white transition-colors">Knowledge Hub</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
              <p className="text-gray-400 mb-4">
                Join our community and never miss an update.
              </p>
              <div className="flex gap-3">
                <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p className="mb-2">© 2025 Kokani Engineers Association. All rights reserved.</p>
            <p className="text-sm">
              Deployed by{' '}
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