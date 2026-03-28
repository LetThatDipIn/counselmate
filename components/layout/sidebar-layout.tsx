'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu, X, LogOut, Home, Briefcase, Settings,
  FileText, MessageSquare, Users, Scale, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const isLanding = pathname === '/';

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const appNavItems = [
    { icon: <Home size={16} />,        label: 'Dashboard',         href: '/dashboard' },
    { icon: <Users size={16} />,       label: 'Find Professionals', href: '/professionals' },
    { icon: <MessageSquare size={16} />, label: 'Messages',         href: '/messages' },
    ...(user?.role === 'PROFESSIONAL'
      ? [
          { icon: <FileText size={16} />, label: 'My Profile', href: '/profile' },
          { icon: <Briefcase size={16} />, label: 'Job Board',  href: '/jobs' },
        ]
      : [
          { icon: <Briefcase size={16} />, label: 'My Bookings', href: '/bookings' },
        ]
    ),
    { icon: <Settings size={16} />, label: 'Settings', href: '/settings' },
  ];

  const landingNavLinks = [
    { label: 'About',         href: '#about' },
    { label: 'Services',      href: '#services' },
    { label: 'How It Works',  href: '#how-it-works' },
    { label: 'Why Us',        href: '#why-us' },
    { label: 'Contact',       href: '#contact' },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="sl-shell">

        {/* ════════ SIDEBAR ════════ */}
        <aside className={`sl-sidebar${open ? ' open' : ''}`}>
          <button className="sl-close-btn" onClick={() => setOpen(false)}>
            <X size={16} />
          </button>

          {/* ── Masthead (always visible) ── */}
          <div className="sl-masthead">
            <div className="sl-masthead-rule" />
            <Link href="/" className="sl-masthead-name" onClick={() => setOpen(false)}>
              Consultancy
            </Link>
            <div className="sl-masthead-sub">
              India's Verified Professional<br />& Financial Directory
            </div>
            <div className="sl-masthead-rule" />
          </div>

          {/* ── LANDING sidebar ── */}
          {isLanding && (
            <>
              <nav className="sl-nav">
                <div className="sl-nav-heading">Contents</div>
                {landingNavLinks.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="sl-landing-link"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sl-landing-num">{String(i + 1).padStart(2, '0')}</span>
                    <span>{l.label}</span>
                  </a>
                ))}
              </nav>

              <div className="sl-rule" />

              <div className="sl-landing-ctas">
                <div className="sl-cta-heading">Join Consultancy</div>

                <Link href="/auth/register-professional" className="sl-cta-professional" onClick={() => setOpen(false)}>
                  <Scale size={14} />
                  <div>
                    <div className="sl-cta-title">Register as Professional</div>
                    <div className="sl-cta-sub">CA · Consultant</div>
                  </div>
                  <ChevronRight size={13} className="sl-cta-arrow" />
                </Link>

                <Link href="/auth/register?role=APPRENTICE" className="sl-cta-client" onClick={() => setOpen(false)}>
                  <Users size={14} />
                  <div>
                    <div className="sl-cta-title">Register as Client</div>
                    <div className="sl-cta-sub">Find expert guidance</div>
                  </div>
                  <ChevronRight size={13} className="sl-cta-arrow" />
                </Link>

                <Link href="/auth/login" className="sl-signin-link" onClick={() => setOpen(false)}>
                  Already a member? Sign In →
                </Link>
              </div>
            </>
          )}

          {/* ── APP sidebar (authenticated) ── */}
          {!isLanding && isAuthenticated && (
            <>
              {/* User pill */}
              <div className="sl-user-pill">
                <div className="sl-user-avatar">
                  {user?.profile_picture
                    ? <img src={user.profile_picture} alt="" className="sl-user-avatar-img" />
                    : <span>{(user?.first_name?.[0] ?? '') + (user?.last_name?.[0] ?? '')}</span>
                  }
                </div>
                <div className="sl-user-info">
                  <div className="sl-user-name">{user?.first_name} {user?.last_name}</div>
                  <div className="sl-user-role">{user?.role}</div>
                </div>
              </div>

              <div className="sl-rule" />

              <nav className="sl-nav">
                <div className="sl-nav-heading">Navigation</div>
                {appNavItems.map(item => {
                  const active = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`sl-app-link${active ? ' active' : ''}`}
                      onClick={() => setOpen(false)}
                    >
                      <span className="sl-app-link-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="sl-rule" />

              <div className="sl-logout-wrap">
                <button className="sl-logout-btn" onClick={handleLogout}>
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}

          {/* ── APP sidebar (guest visiting app route) ── */}
          {!isLanding && !isAuthenticated && (
            <div className="sl-guest-wrap">
              <div className="sl-cta-heading">Get Started</div>
              <Link href="/auth/login" className="sl-cta-professional" onClick={() => setOpen(false)}>
                Sign In <ChevronRight size={13} className="sl-cta-arrow" style={{ marginLeft: 'auto' }} />
              </Link>
              <Link href="/auth/register?role=APPRENTICE" className="sl-cta-client" onClick={() => setOpen(false)}>
                Create Account <ChevronRight size={13} className="sl-cta-arrow" style={{ marginLeft: 'auto' }} />
              </Link>
            </div>
          )}

          <div className="sl-sidebar-footer">
            <span>Est. 2025 · India</span>
          </div>
        </aside>

        {/* Overlay */}
        {open && <div className="sl-overlay" onClick={() => setOpen(false)} />}

        {/* ════════ CONTENT ════════ */}
        <div className="sl-content">
          {/* Mobile topbar */}
          <div className="sl-topbar">
            <button className="sl-hamburger" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <Link href="/" className="sl-topbar-name">Consultancy</Link>
            <div className="sl-topbar-right">
              {isAuthenticated
                ? <Link href="/dashboard" className="sl-topbar-link">Dashboard</Link>
                : <Link href="/auth/login" className="sl-topbar-link">Sign In</Link>
              }
            </div>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}

/* ─── Styles ──────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Source+Serif+4:wght@300;400;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --night: #111009;
    --night-soft: #191712;
    --night-rule: rgba(255,255,255,0.07);
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --red: #8b1a1a;
    --red-hover: #a82020;
    --sidebar-w: 260px;
  }

  .sl-shell {
    display: flex;
    min-height: 100vh;
  }

  /* ════════ SIDEBAR ════════ */
  .sl-sidebar {
    width: var(--sidebar-w);
    flex-shrink: 0;
    background: var(--night);
    border-right: 1px solid var(--night-rule);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    scrollbar-width: none;
    z-index: 50;
  }
  .sl-sidebar::-webkit-scrollbar { display: none; }

  .sl-close-btn {
    display: none;
    position: absolute; top: 1rem; right: 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--night-rule);
    border-radius: 6px;
    color: rgba(255,255,255,0.4);
    cursor: pointer; padding: 0.35rem;
    transition: background 0.15s, color 0.15s;
  }
  .sl-close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

  /* ── Masthead ── */
  .sl-masthead {
    padding: 2rem 1.5rem 1.5rem;
    text-align: center;
    flex-shrink: 0;
  }
  .sl-masthead-rule {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    opacity: 0.3;
    margin-bottom: 0.875rem;
  }
  .sl-masthead-name {
    display: block;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.4rem; font-weight: 700;
    color: #fff; letter-spacing: 0.03em;
    text-decoration: none;
    margin-bottom: 0.35rem;
    transition: color 0.15s;
  }
  .sl-masthead-name:hover { color: var(--gold-light); }
  .sl-masthead-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.22); line-height: 1.6;
  }

  /* ── Shared nav ── */
  .sl-nav { padding: 0.25rem 0; flex-shrink: 0; }
  .sl-nav-heading {
    font-family: 'DM Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.18);
    padding: 0.75rem 1.5rem 0.4rem;
  }

  .sl-rule {
    height: 1px;
    background: var(--night-rule);
    margin: 0.5rem 1.5rem;
    flex-shrink: 0;
  }

  /* ── Landing nav links ── */
  .sl-landing-link {
    display: flex; align-items: center; gap: 0.6rem;
    width: 100%; padding: 0.55rem 1.5rem;
    background: none; border: none; cursor: pointer;
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.85rem; color: rgba(255,255,255,0.4);
    text-decoration: none;
    border-left: 2px solid transparent;
    transition: color 0.15s, background 0.15s, border-color 0.15s;
  }
  .sl-landing-link:hover {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.03);
    border-left-color: rgba(255,255,255,0.15);
  }
  .sl-landing-num {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem; color: rgba(255,255,255,0.18);
    min-width: 18px; flex-shrink: 0;
  }

  /* ── Landing CTAs ── */
  .sl-landing-ctas {
    padding: 0 1.1rem 0.75rem;
    flex-shrink: 0;
  }
  .sl-cta-heading {
    font-family: 'DM Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.18);
    padding: 0.5rem 0.4rem 0.6rem;
  }
  .sl-cta-professional, .sl-cta-client {
    display: flex; align-items: center; gap: 0.65rem;
    padding: 0.8rem 0.9rem;
    border-radius: 6px; text-decoration: none;
    margin-bottom: 0.5rem;
    transition: transform 0.15s, box-shadow 0.2s, background 0.15s;
    font-family: 'Source Serif 4', Georgia, serif;
  }
  .sl-cta-professional:hover, .sl-cta-client:hover { transform: translateY(-1px); }
  .sl-cta-professional {
    background: var(--red); color: #fff;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .sl-cta-professional:hover {
    background: var(--red-hover);
    box-shadow: 0 4px 16px rgba(139,26,26,0.45);
  }
  .sl-cta-client {
    background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.65);
    border: 1px solid var(--night-rule);
  }
  .sl-cta-client:hover { background: rgba(255,255,255,0.09); color: #fff; }
  .sl-cta-title { font-size: 0.8rem; font-weight: 600; line-height: 1.2; }
  .sl-cta-sub { font-size: 0.63rem; opacity: 0.55; margin-top: 0.1rem; font-family: 'DM Mono', monospace; }
  .sl-cta-arrow { margin-left: auto; flex-shrink: 0; opacity: 0.4; }

  .sl-signin-link {
    display: block; text-align: center;
    padding: 0.5rem 0.4rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; color: rgba(255,255,255,0.25);
    text-decoration: none; transition: color 0.15s;
  }
  .sl-signin-link:hover { color: var(--gold-light); }

  /* ── App nav links ── */
  .sl-user-pill {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.875rem 1.5rem;
    flex-shrink: 0;
  }
  .sl-user-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(201,168,76,0.15);
    border: 1px solid rgba(201,168,76,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.85rem; color: var(--gold);
    flex-shrink: 0; overflow: hidden;
  }
  .sl-user-avatar-img { width: 100%; height: 100%; object-fit: cover; }
  .sl-user-name {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.85rem; font-weight: 600; color: #fff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sl-user-role {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--gold); opacity: 0.7; margin-top: 0.1rem;
  }

  .sl-app-link {
    display: flex; align-items: center; gap: 0.7rem;
    padding: 0.6rem 1.5rem;
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.875rem; color: rgba(255,255,255,0.4);
    text-decoration: none;
    border-left: 2px solid transparent;
    transition: color 0.15s, background 0.15s, border-color 0.15s;
  }
  .sl-app-link:hover {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.03);
  }
  .sl-app-link.active {
    color: var(--gold-light);
    border-left-color: var(--gold);
    background: rgba(201,168,76,0.05);
  }
  .sl-app-link-icon { flex-shrink: 0; opacity: 0.6; }
  .sl-app-link.active .sl-app-link-icon { opacity: 1; }

  /* ── Logout ── */
  .sl-logout-wrap { padding: 0 1.1rem 0.5rem; flex-shrink: 0; }
  .sl-logout-btn {
    display: flex; align-items: center; gap: 0.6rem;
    width: 100%; padding: 0.65rem 0.9rem;
    background: none;
    border: 1px solid rgba(139,26,26,0.25);
    border-radius: 6px;
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.82rem; color: rgba(220,80,80,0.6);
    cursor: pointer; transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .sl-logout-btn:hover {
    background: rgba(139,26,26,0.15);
    color: #e05555;
    border-color: rgba(139,26,26,0.4);
  }

  /* ── Guest wrap ── */
  .sl-guest-wrap { padding: 0 1.1rem 0.5rem; flex-shrink: 0; }

  /* ── Footer ── */
  .sl-sidebar-footer {
    margin-top: auto; padding: 1rem 1.5rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.55rem; color: rgba(255,255,255,0.12);
    letter-spacing: 0.08em;
    flex-shrink: 0;
  }

  /* ════════ CONTENT ════════ */
  .sl-content {
    flex: 1; min-width: 0;
    display: flex; flex-direction: column;
  }

  /* ── Mobile topbar ── */
  .sl-topbar {
    display: none;
    align-items: center; justify-content: space-between;
    padding: 0.875rem 1.25rem;
    background: var(--night);
    border-bottom: 1px solid var(--night-rule);
    position: sticky; top: 0; z-index: 30;
    flex-shrink: 0;
  }
  .sl-hamburger {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.5); display: flex; align-items: center;
    transition: color 0.15s;
  }
  .sl-hamburger:hover { color: #fff; }
  .sl-topbar-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.1rem; color: #fff; font-weight: 700;
    text-decoration: none;
  }
  .sl-topbar-right {}
  .sl-topbar-link {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--gold-light);
    text-decoration: none; letter-spacing: 0.04em;
  }

  /* ════════ OVERLAY ════════ */
  .sl-overlay {
    position: fixed; inset: 0; z-index: 49;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(2px);
  }

  /* ════════ RESPONSIVE ════════ */
  @media (max-width: 860px) {
    .sl-sidebar {
      position: fixed; left: calc(-1 * var(--sidebar-w)); top: 0;
      height: 100vh;
      transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      width: min(var(--sidebar-w), 82vw);
    }
    .sl-sidebar.open { left: 0; }
    .sl-close-btn { display: flex; }
    .sl-topbar { display: flex; }
  }
`;
