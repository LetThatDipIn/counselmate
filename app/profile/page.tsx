"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import {
  Mail, Shield, Calendar, CheckCircle2,
  XCircle, Briefcase, ArrowRight, Clock,
  UserCircle2, Lock
} from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/auth/login')
  }, [isAuthenticated, loading, router])

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="profile-root">
        <div className="profile-skel-hero" />
        <div className="profile-skel-body">
          {[180, 220, 140].map(h => (
            <div key={h} className="profile-skel-card" style={{ height: h }} />
          ))}
        </div>
      </div>
    </>
  )

  if (!user) return null

  const initials = [user.first_name?.[0], user.last_name?.[0]]
    .filter(Boolean).join('').toUpperCase() || 'U'

  const formatDate = (d?: string) => d
    ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'

  const isPro = user.role === 'PROFESSIONAL'

  return (
    <>
      <style>{css}</style>
      <div className="profile-root">

        {/* ════════ HERO ════════ */}
        <header className="profile-hero">
          <div className="profile-hero-inner">
            <div className="profile-avatar-wrap">
              {user.profile_picture
                ? <img src={user.profile_picture} alt={user.first_name} className="profile-avatar-img" />
                : <div className="profile-avatar-initials">{initials}</div>
              }
              {user.is_verified && (
                <div className="profile-verified-ring" title="Verified">
                  <CheckCircle2 size={11} />
                </div>
              )}
            </div>

            <div className="profile-hero-info">
              <div className="profile-eyebrow">My Account</div>
              <h1 className="profile-name">
                {user.first_name || ''}{user.last_name ? ` ${user.last_name}` : ''}
                {!user.first_name && !user.last_name && 'Your Profile'}
              </h1>
              <div className="profile-meta-row">
                <span className="profile-meta-item">
                  <Mail size={13} />{user.email}
                </span>
                <span className="profile-meta-sep" />
                <span className={`profile-role-badge${isPro ? ' pro' : ''}`}>
                  {isPro ? <Briefcase size={12} /> : <UserCircle2 size={12} />}
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ════════ BODY ════════ */}
        <main className="profile-body">

          {/* ── Personal info ── */}
          <section className="profile-section">
            <div className="profile-section-head">
              <div className="profile-section-label">Personal Information</div>
              <div className="profile-section-desc">Your basic account details</div>
            </div>

            <div className="profile-info-grid">
              <InfoField label="First Name" value={user.first_name || '—'} />
              <InfoField label="Last Name"  value={user.last_name  || '—'} />
              <InfoField
                label="Email Address"
                value={user.email}
                icon={<Mail size={14} />}
                full
              />
              <InfoField
                label="Role"
                value={user.role}
                icon={isPro ? <Briefcase size={14} /> : <UserCircle2 size={14} />}
                badge={isPro ? 'pro' : 'default'}
              />
              <InfoField
                label="Auth Provider"
                value={user.auth_provider === 'GOOGLE' ? 'Google OAuth' : 'Email & Password'}
                icon={user.auth_provider === 'GOOGLE' ? <Shield size={14} /> : <Lock size={14} />}
              />
            </div>
          </section>

          {/* ── Account status ── */}
          <section className="profile-section">
            <div className="profile-section-head">
              <div className="profile-section-label">Account Status</div>
              <div className="profile-section-desc">Verification and activity details</div>
            </div>

            <div className="profile-status-grid">
              <StatusCard
                icon={<Shield size={18} />}
                label="Email Verification"
                value={user.is_verified ? 'Verified' : 'Not Verified'}
                ok={user.is_verified}
              />
              <StatusCard
                icon={<CheckCircle2 size={18} />}
                label="Account Status"
                value={user.is_active ? 'Active' : 'Inactive'}
                ok={user.is_active}
              />
              <StatusCard
                icon={<Calendar size={18} />}
                label="Member Since"
                value={formatDate(user.created_at)}
                neutral
              />
              <StatusCard
                icon={<Clock size={18} />}
                label="Last Login"
                value={user.last_login_at ? formatDate(user.last_login_at) : 'N/A'}
                neutral
              />
            </div>
          </section>

          {/* ── Pro section ── */}
          {isPro && (
            <section className="profile-section">
              <div className="profile-section-head">
                <div className="profile-section-label">Professional Profile</div>
                <div className="profile-section-desc">Manage your public profile and services</div>
              </div>

              <div className="profile-pro-card">
                <div className="profile-pro-left">
                  <div className="profile-pro-icon"><Briefcase size={20} /></div>
                  <div>
                    <div className="profile-pro-title">Your professional profile</div>
                    <div className="profile-pro-desc">
                      Create and manage your public listing to get discovered by clients looking for legal and financial expertise.
                    </div>
                  </div>
                </div>
                <div className="profile-pro-actions">
                  <button
                    className="profile-pro-btn primary"
                    onClick={() => router.push('/profile/professional/create')}
                  >
                    Create Profile <ArrowRight size={14} />
                  </button>
                  <button
                    className="profile-pro-btn secondary"
                    onClick={() => router.push('/professionals')}
                  >
                    Browse Directory
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ── Danger zone ── */}
          <section className="profile-section">
            <div className="profile-section-head">
              <div className="profile-section-label">Account Actions</div>
              <div className="profile-section-desc">Manage your session and account settings</div>
            </div>
            <div className="profile-actions-row">
              <button
                className="profile-action-btn"
                onClick={() => router.push('/settings')}
              >
                Account Settings
              </button>
              {!user.is_verified && user.auth_provider === 'LOCAL' && (
                <button className="profile-action-btn warning">
                  Resend Verification Email
                </button>
              )}
            </div>
          </section>

        </main>
      </div>
    </>
  )
}

/* ── Sub-components ──────────────────────────────── */

function InfoField({ label, value, icon, full, badge }: {
  label: string
  value: string
  icon?: React.ReactNode
  full?: boolean
  badge?: 'pro' | 'default'
}) {
  return (
    <div className={`info-field${full ? ' full' : ''}`}>
      <div className="info-field-label">
        {icon && <span className="info-field-icon">{icon}</span>}
        {label}
      </div>
      {badge ? (
        <div className={`info-field-badge${badge === 'pro' ? ' pro' : ''}`}>
          {value}
        </div>
      ) : (
        <div className="info-field-value">{value}</div>
      )}
    </div>
  )
}

function StatusCard({ icon, label, value, ok, neutral }: {
  icon: React.ReactNode
  label: string
  value: string
  ok?: boolean
  neutral?: boolean
}) {
  const accent = neutral ? '' : ok ? ' ok' : ' fail'
  return (
    <div className={`status-card${accent}`}>
      <div className={`status-card-icon${accent}`}>{icon}</div>
      <div className="status-card-label">{label}</div>
      <div className="status-card-value">{value}</div>
      {!neutral && (
        <div className={`status-card-indicator${accent}`}>
          {ok
            ? <><CheckCircle2 size={13} /> Confirmed</>
            : <><XCircle size={13} /> Pending</>
          }
        </div>
      )}
    </div>
  )
}

/* ─── Styles ─────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0d0f1a;
    --ink-soft: #3d3f52;
    --ink-muted: #7b7d94;
    --cream: #f7f5f0;
    --cream-dark: #e8e4dc;
    --gold: #c9a84c;
    --blue-deep: #1a2b6d;
    --blue-bright: #4169e1;
    --surface: #ffffff;
  }

  .profile-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--ink);
  }

  /* ── Hero ── */
  .profile-hero { background: var(--ink); padding: 0 1.5rem; }
  .profile-hero-inner {
    max-width: 860px; margin: 0 auto;
    padding: 2.75rem 0 2.5rem;
    display: flex; align-items: flex-end; gap: 1.75rem;
  }

  /* Avatar */
  .profile-avatar-wrap { position: relative; flex-shrink: 0; }
  .profile-avatar-img {
    width: 88px; height: 88px; border-radius: 50%;
    object-fit: cover; border: 3px solid rgba(255,255,255,0.1);
  }
  .profile-avatar-initials {
    width: 88px; height: 88px; border-radius: 50%;
    background: var(--blue-deep);
    border: 3px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 2rem; color: #fff;
  }
  .profile-verified-ring {
    position: absolute; bottom: 2px; right: 2px;
    width: 22px; height: 22px; border-radius: 50%;
    background: #22c55e; color: #fff;
    border: 2px solid var(--ink);
    display: flex; align-items: center; justify-content: center;
  }

  /* Info */
  .profile-hero-info { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
  .profile-eyebrow {
    font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); font-weight: 500;
  }
  .profile-name {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    color: #fff; line-height: 1.1; font-weight: 400;
  }
  .profile-meta-row {
    display: flex; align-items: center; flex-wrap: wrap; gap: 0.6rem;
    margin-top: 0.1rem;
  }
  .profile-meta-item {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.82rem; color: rgba(255,255,255,0.45); font-weight: 300;
  }
  .profile-meta-sep {
    width: 3px; height: 3px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
  }
  .profile-role-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.28rem 0.75rem; border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.12);
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.06em; color: rgba(255,255,255,0.45);
    text-transform: uppercase;
  }
  .profile-role-badge.pro { border-color: rgba(201,168,76,0.35); color: var(--gold); }

  /* ── Body ── */
  .profile-body {
    max-width: 860px; margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    display: flex; flex-direction: column; gap: 0.75rem;
  }

  /* ── Section ── */
  .profile-section {
    background: var(--surface);
    border: 1px solid var(--cream-dark);
    border-radius: 16px;
    overflow: hidden;
  }
  .profile-section-head {
    padding: 1.5rem 2rem 1.25rem;
    border-bottom: 1px solid var(--cream-dark);
  }
  .profile-section-label {
    font-size: 0.7rem; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--gold); font-weight: 500;
    margin-bottom: 0.2rem;
  }
  .profile-section-desc {
    font-size: 0.82rem; color: var(--ink-muted); font-weight: 300;
  }

  /* ── Info grid ── */
  .profile-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  .info-field {
    padding: 1.25rem 2rem;
    border-bottom: 1px solid var(--cream-dark);
    border-right: 1px solid var(--cream-dark);
    display: flex; flex-direction: column; gap: 0.35rem;
  }
  .info-field:nth-child(even) { border-right: none; }
  .info-field:nth-last-child(-n+2) { border-bottom: none; }
  .info-field.full {
    grid-column: 1 / -1;
    border-right: none;
  }
  .info-field-label {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.68rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--ink-muted); font-weight: 500;
  }
  .info-field-icon { color: var(--ink-muted); }
  .info-field-value {
    font-size: 0.95rem; font-weight: 500; color: var(--ink);
  }
  .info-field-badge {
    display: inline-flex; align-items: center;
    padding: 0.25rem 0.75rem; border-radius: 100px;
    background: var(--cream); border: 1.5px solid var(--cream-dark);
    font-size: 0.75rem; font-weight: 600; color: var(--ink-soft);
    text-transform: uppercase; letter-spacing: 0.06em;
    align-self: flex-start;
  }
  .info-field-badge.pro {
    background: rgba(201,168,76,0.1);
    border-color: rgba(201,168,76,0.3);
    color: #a07d28;
  }

  /* ── Status grid ── */
  .profile-status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  .status-card {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--cream-dark);
    border-right: 1px solid var(--cream-dark);
    display: flex; flex-direction: column; gap: 0.35rem;
    transition: background 0.2s;
  }
  .status-card:hover { background: #fafaf8; }
  .status-card:nth-child(even) { border-right: none; }
  .status-card:nth-last-child(-n+2) { border-bottom: none; }

  .status-card-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--cream); color: var(--ink-muted);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.35rem;
    transition: background 0.2s, color 0.2s;
  }
  .status-card-icon.ok   { background: #f0fdf4; color: #16a34a; }
  .status-card-icon.fail { background: #fef2f2; color: #dc2626; }

  .status-card-label {
    font-size: 0.68rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--ink-muted); font-weight: 500;
  }
  .status-card-value {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.15rem; color: var(--ink); line-height: 1.2;
  }
  .status-card-indicator {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.72rem; font-weight: 600; margin-top: 0.1rem;
  }
  .status-card-indicator.ok   { color: #16a34a; }
  .status-card-indicator.fail { color: #f59e0b; }

  /* ── Pro card ── */
  .profile-pro-card {
    padding: 1.75rem 2rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
  }
  .profile-pro-left { display: flex; align-items: center; gap: 1.25rem; }
  .profile-pro-icon {
    width: 46px; height: 46px; border-radius: 12px;
    background: var(--cream); color: var(--ink-soft);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .profile-pro-title { font-size: 0.95rem; font-weight: 600; color: var(--ink); }
  .profile-pro-desc {
    font-size: 0.82rem; color: var(--ink-muted);
    font-weight: 300; margin-top: 0.2rem; max-width: 380px; line-height: 1.55;
  }
  .profile-pro-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .profile-pro-btn {
    display: inline-flex; align-items: center; gap: 0.45rem;
    border-radius: 10px; padding: 0.65rem 1.2rem;
    font-size: 0.85rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    white-space: nowrap; border: none;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .profile-pro-btn.primary {
    background: var(--ink); color: #fff;
  }
  .profile-pro-btn.primary:hover {
    background: var(--blue-deep);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(13,15,26,0.15);
  }
  .profile-pro-btn.secondary {
    background: transparent; color: var(--ink);
    border: 1.5px solid var(--cream-dark) !important;
  }
  .profile-pro-btn.secondary:hover {
    border-color: var(--ink) !important;
    background: rgba(13,15,26,0.03);
  }

  /* ── Actions row ── */
  .profile-actions-row {
    padding: 1.5rem 2rem;
    display: flex; gap: 0.75rem; flex-wrap: wrap;
  }
  .profile-action-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.6rem 1.2rem; border-radius: 10px;
    border: 1.5px solid var(--cream-dark);
    background: transparent; font-size: 0.85rem; font-weight: 500;
    color: var(--ink); font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .profile-action-btn:hover { border-color: var(--ink); background: rgba(13,15,26,0.03); }
  .profile-action-btn.warning {
    border-color: #fde68a; color: #a16207; background: #fffbeb;
  }
  .profile-action-btn.warning:hover { border-color: #fbbf24; background: #fef3c7; }

  /* ── Skeleton ── */
  .profile-skel-hero {
    height: 200px;
    background: linear-gradient(90deg, #1a1c2e 25%, #22243a 50%, #1a1c2e 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  .profile-skel-body {
    max-width: 860px; margin: 2rem auto;
    padding: 0 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;
  }
  .profile-skel-card {
    border-radius: 16px;
    background: linear-gradient(90deg, #ede9e1 25%, #f5f2ec 50%, #ede9e1 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  /* ── Keyframes ── */
  @keyframes shimmer { to { background-position: -200% 0; } }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .profile-hero-inner { flex-direction: column; align-items: flex-start; gap: 1rem; }
    .profile-info-grid  { grid-template-columns: 1fr; }
    .profile-status-grid { grid-template-columns: 1fr; }
    .info-field { border-right: none !important; }
    .info-field:last-child { border-bottom: none; }
    .status-card { border-right: none !important; }
    .status-card:last-child { border-bottom: none; }
    .profile-pro-card { flex-direction: column; align-items: flex-start; }
  }
`