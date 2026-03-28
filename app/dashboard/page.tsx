"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import { authAPI, profilesAPI } from "@/lib/api"
import { toast } from "sonner"
import {
  Search, UserPlus, Shield, Calendar, TrendingUp,
  ArrowRight, CheckCircle2, Clock, ChevronRight,
  Briefcase, Star, Users, Zap, Loader2
} from "lucide-react"
import type { Profile } from "@/lib/api/types"

export default function DashboardPage() {
  const { user, isAuthenticated, loading, refreshUser } = useAuth()
  const router = useRouter()
  const [isResending, setIsResending] = useState(false)
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [professionalProfile, setProfessionalProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  // Fetch professional profile if user is a professional
  useEffect(() => {
    if (user && user.role === 'PROFESSIONAL') {
      setProfileLoading(true)
      profilesAPI.getMyProfile()
        .then(profile => {
          setProfessionalProfile(profile)
        })
        .catch(error => {
          // Profile doesn't exist yet - that's okay
          console.log('No profile yet:', error)
          setProfessionalProfile(null)
        })
        .finally(() => setProfileLoading(false))
    }
  }, [user])

  if (loading) {
    return (
      <>
        <style>{skeletonCSS}</style>
        <div className="dash-root">
          <div className="dash-skeleton">
            <div className="skel-header" />
            <div className="skel-grid">
              {[...Array(3)].map((_, i) => <div key={i} className="skel-card" />)}
            </div>
            <div className="skel-wide" />
          </div>
        </div>
      </>
    )
  }

  if (!user) return null

  const isPro = user.role === 'PROFESSIONAL'

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const handleResendVerification = async () => {
    if (!user.email) return
    
    setIsResending(true)
    try {
      await authAPI.resendVerification(user.email)
      toast.success('Verification email sent! Check your inbox.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  const handleCreateProfile = async () => {
    setIsCreatingProfile(true)
    try {
      router.push('/profile/professional/create')
    } finally {
      setIsCreatingProfile(false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="dash-root">

        {/* ── Top header bar ── */}
        <header className="dash-header">
          <div className="dash-header-inner">
            <div className="dash-greeting">
              <span className="dash-greeting-time">{greeting()}</span>
              <h1 className="dash-greeting-name">{user.first_name || 'there'}</h1>
              <p className="dash-greeting-sub">
                {isPro
                  ? 'Manage your professional profile and services'
                  : 'Find and connect with verified professionals'}
              </p>
            </div>
            <div className="dash-header-right">
              <div className={`dash-role-badge${isPro ? ' pro' : ''}`}>
                {isPro ? <Briefcase size={13} /> : <Users size={13} />}
                {user.role}
              </div>
              {user.profile_picture && (
                <img
                  src={user.profile_picture}
                  alt={user.first_name}
                  className="dash-avatar"
                />
              )}
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="dash-main">

          {/* ─────────────────── APPRENTICE ─────────────────── */}
          {!isPro && (
            <>
              {/* Email verification alert */}
              {!user.is_verified && user.auth_provider === 'LOCAL' && (
                <div className="dash-alert">
                  <div className="dash-alert-dot" />
                  <div className="dash-alert-body">
                    <span className="dash-alert-title">Verify your email</span>
                    <span className="dash-alert-desc">Check your inbox for the verification link to unlock all features.</span>
                  </div>
                  <button 
                    className="dash-alert-btn"
                    onClick={handleResendVerification}
                    disabled={isResending}
                  >
                    {isResending && <Loader2 size={14} className="inline mr-1 animate-spin" />}
                    {isResending ? 'Sending...' : 'Resend'}
                  </button>
                </div>
              )}

              {/* Stat cards */}
              <div className="dash-stat-grid">
                <StatCard
                  icon={<Shield size={18} />}
                  label="Account Status"
                  value={user.is_verified ? 'Verified' : 'Unverified'}
                  sub={`Email ${user.is_verified ? 'confirmed' : 'pending'}`}
                  accent={user.is_verified ? 'green' : 'amber'}
                />
                <StatCard
                  icon={<Calendar size={18} />}
                  label="Member Since"
                  value={formatDate(user.created_at)}
                  sub={`via ${user.auth_provider}`}
                />
                <StatCard
                  icon={<Star size={18} />}
                  label="Consultations"
                  value="0"
                  sub="No sessions yet"
                />
              </div>

              {/* CTA card */}
              <div className="dash-cta-card">
                <div className="dash-cta-left">
                  <div className="dash-cta-icon-wrap">
                    <Search size={22} />
                  </div>
                  <div>
                    <div className="dash-cta-title">Find expert legal help</div>
                    <div className="dash-cta-desc">
                      Search verified CAs and Lawyers by specialization, language, and budget.
                    </div>
                  </div>
                </div>
                <button
                  className="dash-cta-btn"
                  onClick={() => router.push('/professionals')}
                >
                  Browse Professionals <ArrowRight size={15} />
                </button>
              </div>

              {/* Checklist */}
              <div className="dash-checklist-card">
                <div className="dash-section-label">Getting Started</div>
                <h2 className="dash-section-title">Complete your setup</h2>

                <div className="dash-checklist">
                  <ChecklistItem
                    done={user.is_verified || user.auth_provider !== 'LOCAL'}
                    title="Verify your email"
                    desc="Confirm your email to access all features"
                    action={(!user.is_verified && user.auth_provider === 'LOCAL') ? { label: 'Resend', onClick: () => {} } : undefined}
                  />
                  <ChecklistItem
                    done={false}
                    title="Browse professionals"
                    desc="Find the right expert for your legal needs"
                    action={{ label: 'Browse', onClick: () => router.push('/professionals') }}
                  />
                  <ChecklistItem
                    done={false}
                    title="Complete your profile"
                    desc="Add your details to personalise recommendations"
                    action={{ label: 'Edit Profile', onClick: () => router.push('/profile') }}
                  />
                  <ChecklistItem
                    done={false}
                    title="Book your first consultation"
                    desc="Connect with a verified legal professional"
                    action={{ label: 'Find Expert', onClick: () => router.push('/professionals') }}
                    last
                  />
                </div>
              </div>

              {/* Upgrade prompt */}
              <div className="dash-upgrade-card">
                <div className="dash-upgrade-content">
                  <div className="dash-upgrade-icon"><Briefcase size={20} /></div>
                  <div>
                    <div className="dash-upgrade-title">Are you a legal professional?</div>
                    <div className="dash-upgrade-desc">Switch to a Professional account and start connecting with clients.</div>
                  </div>
                </div>
                <button
                  className="dash-upgrade-btn"
                  onClick={() => router.push('/settings/role')}
                >
                  Switch Role <ChevronRight size={15} />
                </button>
              </div>
            </>
          )}

          {/* ─────────────────── PROFESSIONAL ─────────────────── */}
          {isPro && (
            <>
              {/* Stat cards */}
              <div className="dash-stat-grid">
                <StatCard
                  icon={<Shield size={18} />}
                  label="Account Status"
                  value={user.is_verified ? 'Verified' : 'Unverified'}
                  sub="Professional account"
                  accent={user.is_verified ? 'green' : 'amber'}
                />
                <StatCard
                  icon={<TrendingUp size={18} />}
                  label="Profile Views"
                  value={professionalProfile ? "Active" : "0"}
                  sub={professionalProfile ? `${professionalProfile.title || 'Professional'}` : "No profile created yet"}
                />
                <StatCard
                  icon={<Calendar size={18} />}
                  label="Member Since"
                  value={formatDate(user.created_at)}
                  sub="Professional member"
                />
              </div>

              {/* Profile CTA */}
              {professionalProfile ? (
                <div className="dash-cta-card pro">
                  <div className="dash-cta-left">
                    <div className="dash-cta-icon-wrap pro">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <div className="dash-cta-title">Your professional profile</div>
                      <div className="dash-cta-desc">
                        {professionalProfile.title} • {professionalProfile.location || 'Location not set'}
                      </div>
                    </div>
                  </div>
                  <button
                    className="dash-cta-btn"
                    onClick={() => router.push('/profile/professional/edit')}
                  >
                    Edit Profile <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <div className="dash-cta-card pro">
                  <div className="dash-cta-left">
                    <div className="dash-cta-icon-wrap pro">
                      <Zap size={22} />
                    </div>
                    <div>
                      <div className="dash-cta-title">Create your professional profile</div>
                      <div className="dash-cta-desc">
                        Showcase your expertise, credentials, and services to get discovered by clients.
                      </div>
                    </div>
                  </div>
                  <button
                    className="dash-cta-btn"
                    onClick={() => router.push('/profile/professional/create')}
                  >
                    Create Profile <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {/* Checklist */}
              <div className="dash-checklist-card">
                <div className="dash-section-label">Profile Setup</div>
                <h2 className="dash-section-title">Start getting clients</h2>

                <div className="dash-checklist">
                  <ChecklistItem
                    done={user.is_verified}
                    title="Verify your email"
                    desc="Required for professional account activation"
                    action={!user.is_verified ? { 
                      label: isResending ? 'Sending...' : 'Verify', 
                      onClick: handleResendVerification
                    } : undefined}
                  />
                  <ChecklistItem
                    done={!!professionalProfile}
                    title="Create professional profile"
                    desc="Add your expertise, qualifications and hourly rate"
                    action={!professionalProfile ? { 
                      label: isCreatingProfile ? 'Loading...' : 'Create', 
                      onClick: handleCreateProfile
                    } : { 
                      label: 'Edit', 
                      onClick: () => router.push('/profile/professional/edit')
                    }}
                  />
                  <ChecklistItem
                    done={false}
                    title="Submit credentials for verification"
                    desc="Upload Bar Council or ICAI registration documents"
                    action={{ label: 'Submit', onClick: () => router.push('/profile/verification') }}
                  />
                  <ChecklistItem
                    done={false}
                    title="Go live"
                    desc="Your profile becomes discoverable after credential review"
                    last
                  />
                </div>
              </div>

              {/* Quick links */}
              <div className="dash-links-grid">
                <QuickLink
                  icon={<Users size={18} />}
                  title="View All Professionals"
                  desc="See how you compare on the platform"
                  onClick={() => router.push('/professionals')}
                />
                <QuickLink
                  icon={<UserPlus size={18} />}
                  title="My Account"
                  desc="Edit personal details and preferences"
                  onClick={() => router.push('/profile')}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}

/* ─── Sub-components ─────────────────────────────────── */

function StatCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  accent?: 'green' | 'amber'
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon${accent ? ` ${accent}` : ''}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className={`stat-value${accent ? ` ${accent}` : ''}`}>{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  )
}

function ChecklistItem({ done, title, desc, action, last }: {
  done: boolean
  title: string
  desc: string
  action?: { label: string; onClick: () => void }
  last?: boolean
}) {
  return (
    <div className={`checklist-item${last ? ' last' : ''}`}>
      <div className={`checklist-dot${done ? ' done' : ''}`}>
        {done && <CheckCircle2 size={14} />}
        {!done && <Clock size={12} />}
      </div>
      <div className="checklist-body">
        <div className={`checklist-title${done ? ' done' : ''}`}>{title}</div>
        <div className="checklist-desc">{desc}</div>
      </div>
      {action && !done && (
        <button className="checklist-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {done && <span className="checklist-complete">Done</span>}
    </div>
  )
}

function QuickLink({ icon, title, desc, onClick }: {
  icon: React.ReactNode
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button className="quick-link" onClick={onClick}>
      <div className="quick-link-icon">{icon}</div>
      <div className="quick-link-body">
        <div className="quick-link-title">{title}</div>
        <div className="quick-link-desc">{desc}</div>
      </div>
      <ChevronRight size={16} className="quick-link-arrow" />
    </button>
  )
}

/* ─── Styles ─────────────────────────────────────────── */

const skeletonCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  .dash-root { font-family: 'DM Sans', sans-serif; background: #f7f5f0; min-height: 100vh; }
  .dash-skeleton { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
  .skel-header { height: 120px; border-radius: 16px; background: linear-gradient(90deg, #e8e4dc 25%, #f0ece4 50%, #e8e4dc 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  .skel-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
  .skel-card { height: 110px; border-radius: 14px; background: linear-gradient(90deg, #e8e4dc 25%, #f0ece4 50%, #e8e4dc 75%); background-size: 200% 100%; animation: shimmer 1.4s 0.1s infinite; }
  .skel-wide { height: 200px; border-radius: 16px; background: linear-gradient(90deg, #e8e4dc 25%, #f0ece4 50%, #e8e4dc 75%); background-size: 200% 100%; animation: shimmer 1.4s 0.2s infinite; }
  @keyframes shimmer { to { background-position: -200% 0; } }
`

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
    --blue-mid: #2d4ba0;
    --blue-bright: #4169e1;
    --surface: #ffffff;
  }

  .dash-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--ink);
  }

  /* ── Header ── */
  .dash-header {
    background: var(--ink);
    padding: 0 1.5rem;
  }
  .dash-header-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 2.5rem 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }
  .dash-greeting { display: flex; flex-direction: column; gap: 0.25rem; }
  .dash-greeting-time {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    font-weight: 500;
  }
  .dash-greeting-name {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    color: #fff;
    line-height: 1.1;
    font-weight: 400;
  }
  .dash-greeting-sub {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.4);
    font-weight: 300;
    margin-top: 0.25rem;
  }
  .dash-header-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
  .dash-role-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.15);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
  }
  .dash-role-badge.pro { border-color: rgba(201,168,76,0.4); color: var(--gold); }
  .dash-avatar {
    width: 42px; height: 42px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.12);
    object-fit: cover;
  }

  /* ── Main ── */
  .dash-main {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* ── Alert ── */
  .dash-alert {
    display: flex; align-items: center; gap: 1rem;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 14px;
    padding: 1rem 1.25rem;
  }
  .dash-alert-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #f59e0b; flex-shrink: 0;
    box-shadow: 0 0 8px rgba(245,158,11,0.5);
  }
  .dash-alert-body { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
  .dash-alert-title { font-size: 0.875rem; font-weight: 600; color: #92400e; }
  .dash-alert-desc { font-size: 0.8rem; color: #a16207; font-weight: 300; }
  .dash-alert-btn {
    font-size: 0.78rem; font-weight: 600; color: #92400e;
    background: #fef3c7; border: 1px solid #fde68a;
    border-radius: 8px; padding: 0.35rem 0.85rem;
    cursor: pointer; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
  }
  .dash-alert-btn:hover { background: #fde68a; }

  /* ── Stat grid ── */
  .dash-stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--cream-dark);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--cream-dark);
  }
  .stat-card {
    background: var(--surface);
    padding: 1.75rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.35rem;
    transition: background 0.2s;
  }
  .stat-card:hover { background: #fafaf8; }
  .stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--cream); color: var(--ink-soft);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.5rem;
  }
  .stat-icon.green { background: #f0fdf4; color: #16a34a; }
  .stat-icon.amber { background: #fffbeb; color: #d97706; }
  .stat-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted); font-weight: 500; }
  .stat-value { font-family: 'Instrument Serif', Georgia, serif; font-size: 1.5rem; color: var(--ink); line-height: 1.1; }
  .stat-value.green { color: #16a34a; }
  .stat-value.amber { color: #d97706; }
  .stat-sub { font-size: 0.775rem; color: var(--ink-muted); font-weight: 300; }

  /* ── CTA card ── */
  .dash-cta-card {
    background: var(--ink);
    border-radius: 16px;
    padding: 1.75rem 2rem;
    display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
    flex-wrap: wrap;
  }
  .dash-cta-card.pro { background: var(--blue-deep); }
  .dash-cta-left { display: flex; align-items: center; gap: 1.25rem; }
  .dash-cta-icon-wrap {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.7);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .dash-cta-icon-wrap.pro { background: rgba(201,168,76,0.15); color: var(--gold); }
  .dash-cta-title { font-size: 1rem; font-weight: 600; color: #fff; }
  .dash-cta-desc { font-size: 0.83rem; color: rgba(255,255,255,0.45); font-weight: 300; margin-top: 0.2rem; max-width: 380px; }
  .dash-cta-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--blue-bright); color: #fff;
    border: none; border-radius: 10px;
    padding: 0.75rem 1.4rem;
    font-size: 0.875rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; white-space: nowrap;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    flex-shrink: 0;
  }
  .dash-cta-btn:hover {
    background: #3057cc;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(65,105,225,0.35);
  }

  /* ── Checklist card ── */
  .dash-checklist-card {
    background: var(--surface);
    border-radius: 16px;
    border: 1px solid var(--cream-dark);
    padding: 2rem;
  }
  .dash-section-label {
    font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--gold); font-weight: 500; margin-bottom: 0.4rem;
  }
  .dash-section-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.5rem; color: var(--ink); margin-bottom: 1.75rem;
  }
  .dash-checklist { display: flex; flex-direction: column; }
  .checklist-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--cream-dark);
  }
  .checklist-item.last { border-bottom: none; }
  .checklist-dot {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid var(--cream-dark);
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-muted);
    transition: all 0.2s;
  }
  .checklist-dot.done {
    background: #f0fdf4; border-color: #86efac; color: #16a34a;
  }
  .checklist-body { flex: 1; }
  .checklist-title { font-size: 0.9rem; font-weight: 600; color: var(--ink); }
  .checklist-title.done { color: var(--ink-muted); text-decoration: line-through; }
  .checklist-desc { font-size: 0.8rem; color: var(--ink-muted); font-weight: 300; margin-top: 0.1rem; }
  .checklist-action {
    font-size: 0.78rem; font-weight: 600; color: var(--blue-bright);
    background: rgba(65,105,225,0.07); border: 1px solid rgba(65,105,225,0.15);
    border-radius: 8px; padding: 0.35rem 0.85rem;
    cursor: pointer; white-space: nowrap; flex-shrink: 0;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, border-color 0.2s;
  }
  .checklist-action:hover { background: rgba(65,105,225,0.12); border-color: rgba(65,105,225,0.3); }
  .checklist-complete {
    font-size: 0.72rem; font-weight: 600; color: #16a34a;
    background: #f0fdf4; border: 1px solid #86efac;
    border-radius: 8px; padding: 0.3rem 0.75rem; flex-shrink: 0;
  }

  /* ── Upgrade card ── */
  .dash-upgrade-card {
    background: var(--surface);
    border: 1px solid var(--cream-dark);
    border-radius: 16px;
    padding: 1.5rem 2rem;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .dash-upgrade-content { display: flex; align-items: center; gap: 1rem; }
  .dash-upgrade-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--cream); color: var(--ink-soft);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .dash-upgrade-title { font-size: 0.9rem; font-weight: 600; color: var(--ink); }
  .dash-upgrade-desc { font-size: 0.8rem; color: var(--ink-muted); font-weight: 300; margin-top: 0.1rem; }
  .dash-upgrade-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.82rem; font-weight: 600; color: var(--ink);
    background: transparent; border: 1.5px solid var(--cream-dark);
    border-radius: 9px; padding: 0.55rem 1.1rem;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, background 0.2s;
  }
  .dash-upgrade-btn:hover { border-color: var(--ink); background: rgba(13,15,26,0.03); }

  /* ── Quick links ── */
  .dash-links-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--cream-dark); border-radius: 16px; overflow: hidden; border: 1px solid var(--cream-dark); }
  .quick-link {
    background: var(--surface);
    padding: 1.5rem;
    display: flex; align-items: center; gap: 1rem;
    cursor: pointer; border: none; text-align: left;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
    width: 100%;
  }
  .quick-link:hover { background: #fafaf8; }
  .quick-link-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--cream); color: var(--ink-soft);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: background 0.2s, color 0.2s;
  }
  .quick-link:hover .quick-link-icon { background: var(--ink); color: #fff; }
  .quick-link-body { flex: 1; }
  .quick-link-title { font-size: 0.9rem; font-weight: 600; color: var(--ink); }
  .quick-link-desc { font-size: 0.78rem; color: var(--ink-muted); font-weight: 300; margin-top: 0.1rem; }
  .quick-link-arrow { color: var(--ink-muted); flex-shrink: 0; }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .dash-stat-grid { grid-template-columns: 1fr; }
    .dash-links-grid { grid-template-columns: 1fr; }
    .dash-cta-card { flex-direction: column; align-items: flex-start; }
    .dash-header-inner { flex-direction: column; align-items: flex-start; }
  }
`