'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, Home, Briefcase, Settings, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

export default function UnifiedSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Close sidebar on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setSidebarOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleLogout = async () => {
    await logout();
    setSidebarOpen(false);
    window.location.href = '/';
  };

  // Navigation items for authenticated users
  const authNavItems = [
    {
      icon: <Home size={18} />,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: <Briefcase size={18} />,
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
            icon: <FileText size={18} />,
            label: 'Verification',
            href: '/profile/verification',
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

  // Navigation items for unauthenticated users
  const publicNavItems = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Find Professionals',
      href: '/professionals',
    },
  ];

  const navItems = isAuthenticated ? authNavItems : publicNavItems;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 w-72 h-screen bg-slate-900 text-white flex-col z-40 border-r border-slate-800">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="block">
            <h1 className="text-2xl font-serif font-bold text-white">Consultancy</h1>
            <p className="text-xs text-slate-400 mt-1">
              {isAuthenticated ? 'Professional Services' : 'Find Verified Professionals'}
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
            >
              {item && 'icon' in item && <span>{(item as any).icon}</span>}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        {isAuthenticated && user ? (
          <div className="p-4 border-t border-slate-700 space-y-4">
            <div className="px-2">
              <p className="text-sm font-semibold text-white">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-slate-400 truncate mt-1">{user.email}</p>
              <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide">
                {user.role === 'PROFESSIONAL' ? '📌 Professional' : '👤 Client'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-700 space-y-3">
            <Link href="/auth/login">
              <button className="w-full px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium text-white">
                Sign In
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-medium text-white">
                Register
              </button>
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-30 md:hidden bg-black/50 transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white z-50 md:hidden transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <Link href="/" onClick={() => setSidebarOpen(false)} className="flex-1">
            <h1 className="text-2xl font-serif font-bold text-white">Consultancy</h1>
            <p className="text-xs text-slate-400 mt-1">Professional Services</p>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
            >
              {item && 'icon' in item && <span>{(item as any).icon}</span>}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        {isAuthenticated && user ? (
          <div className="p-4 border-t border-slate-700 space-y-4">
            <div className="px-2">
              <p className="text-sm font-semibold text-white">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-slate-400 truncate mt-1">{user.email}</p>
              <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide">
                {user.role === 'PROFESSIONAL' ? '📌 Professional' : '👤 Client'}
              </p>
            </div>
            <button
              onClick={() => {
                setSidebarOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-700 space-y-3">
            <Link href="/auth/login" onClick={() => setSidebarOpen(false)}>
              <button className="w-full px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium text-white">
                Sign In
              </button>
            </Link>
            <Link href="/auth/register" onClick={() => setSidebarOpen(false)}>
              <button className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-medium text-white">
                Register
              </button>
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center gap-4 px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-900 hover:text-slate-700"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link href="/" className="flex-1">
          <h1 className="text-lg font-serif font-bold text-slate-900">Consultancy</h1>
        </Link>
      </div>

      {/* Spacer for mobile */}
      <div className="md:hidden h-16" />

      {/* Desktop spacer */}
      <div className="hidden md:block w-72" />
    </>
  );
}
