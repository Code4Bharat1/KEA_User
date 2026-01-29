'use client';

import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FileText, 
  Calendar,
  BookOpen,
  Users,
  Settings,
  LogOut,
  X,
  Bell,
  FolderOpen,
  Library,
  Wrench,
  Image,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  // Disable body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
      const scrollY = window.scrollY;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: User, label: 'My Profile', href: '/dashboard/profile' },
    // { icon: FileText, label: 'My Documents', href: '/dashboard/documents' },
  ];

  const engineeringItems = [
    { icon: Briefcase, label: 'Find Jobs', href: '/dashboard/Jobs' },
    // { icon: FileText, label: 'Find Resumes', href: '/dashboard/resumes' },
    // { icon: Users, label: 'Networking', href: '/dashboard/networking' },
  ];

  const knowledgeItems = [
    { icon: Library, label: 'Knowledge Hub', href: '/dashboard/knowledge' },
    { icon: Wrench, label: 'Tools Library', href: '/dashboard/tools' },
    { icon: Users, label: 'Seminars / Webinars', href: '/dashboard/seminars' },
    { icon: FileText, label: 'Articles / Blogs', href: '/dashboard/blogs' },
  ];

  const communityItems = [
    { icon: MessageSquare, label: 'Forums', href: '/dashboard/forums' },
    { icon: Users, label: 'Groups', href: '/dashboard/groups' },
    { icon: Users, label: 'Mentorship', href: '/dashboard/mentorship' },
    { icon: Calendar, label: 'Events', href: '/dashboard/events' },
    { icon: Image, label: 'Gallery / Good Wishes', href: '/dashboard/gallery' },
  ];

  // const accountItems = [
  //   { icon: FolderOpen, label: 'Resources', href: '/dashboard/resources' },
  //   { icon: BookOpen, label: 'Track Activity', href: '/dashboard/activity' },
  //   { icon: Users, label: 'Members / Network', href: '/dashboard/members' },
  //   { icon: Bell, label: 'Library / Guest Articles', href: '/dashboard/library' },
  // ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      router.push('/login');
    }
  };

  const isActive = (href) => {
    // Exact match for dashboard
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    // For other routes, check if pathname starts with href
    return pathname.startsWith(href);
  };

  const renderMenuSection = (title, items) => (
    <div className="mb-10">
      <p className="text-xs font-semibold text-gray-400 mb-2 px-3 uppercase tracking-wider">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <li key={index}>
              <Link
                href={item.href}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group
                  ${active 
                    ? 'bg-teal-50 text-teal-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-teal-700' : 'text-gray-500'}`} />
                  <span className="text-sm truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-2 border-b border-gray-200 shrink-0 bg-gradient-to-br from-[#0D2847] to-[#1a3a5c]">
          <div className="flex items-center justify-between ">
            <img 
              src="/logo1.png" 
              alt="KEA Logo" 
              className="h-30"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{ display: 'none' }} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">KONKANI</p>
                <p className="text-xs text-gray-600">ENGINEERS</p>
                <p className="text-xs text-gray-600">ASSOCIATION</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {renderMenuSection('Main', menuItems)}
          {renderMenuSection('Career', engineeringItems)}
          {renderMenuSection('Knowledge', knowledgeItems)}
          {renderMenuSection('Community', communityItems)}
          {/* {renderMenuSection('Account', accountItems)} */}

          {/* Settings & Logout */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-400 mb-2 px-3 uppercase tracking-wider">
              Account
            </h3>
            <Link
              href="/dashboard/settings"
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-1
                ${isActive('/dashboard/settings')
                  ? 'bg-teal-50 text-teal-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Settings className={`w-5 h-5 shrink-0 ${isActive('/dashboard/settings') ? 'text-teal-700' : 'text-gray-500'}`} />
              <span className="text-sm">Settings</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
          <div className="px-3 text-xs text-gray-600">
            <p className="font-medium">KEA Community Resources</p>
            <p className="mt-1 text-gray-500">Managed by KEA Board</p>
          </div>
        </div>
      </aside>
    </>
  );
}