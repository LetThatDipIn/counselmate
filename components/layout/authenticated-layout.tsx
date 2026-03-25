'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LogOut,
  Home,
  Briefcase,
  Settings,
  FileText,
  Users,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const navItems = [
    {
      icon: <Home size={18} />,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: <Users size={18} />,
      label: 'Find Professionals',
      href: '/professionals',
    },
    ...(user?.role === 'PROFESSIONAL'
      ? [
          {
            icon: <FileText size={18} />,
            label: 'My Profile',
            href: '/profile',
          },
          {
            icon: <BarChart3 size={18} />,
            label: 'Verification',
            href: '/profile/verification',
          },
          {
            icon: <Briefcase size={18} />,
            label: 'Job Board',
            href: '/jobs',
          },
        ]
      : [
          {
            icon: <Briefcase size={18} />,
            label: 'My Bookings',
            href: '/booking',
          },
        ]),
    {
      icon: <Settings size={18} />,
      label: 'Settings',
      href: '/settings',
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 ${sidebarOpen ? 'w-64' : 'w-0'} md:w-64`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <Link href="/" className="flex-1">
            <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Consultancy
            </h1>
            <p className="text-xs text-slate-400 mt-1">Professional Services</p>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700 space-y-4">
          <div className="px-2">
            <p className="text-sm font-semibold text-white">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-slate-400 truncate mt-1">{user?.email}</p>
            <div className="flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-slate-700/50 w-fit">
              <div
                className={`w-2 h-2 rounded-full ${
                  user?.role === 'PROFESSIONAL' ? 'bg-green-400' : 'bg-blue-400'
                }`}
              />
              <p className="text-xs text-slate-300 font-medium">
                {user?.role === 'PROFESSIONAL' ? '📌 Professional' : '👤 Client'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-900 hover:text-slate-700"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Consultancy</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
