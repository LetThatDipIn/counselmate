"use client"

import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import {
  Users, Briefcase, ArrowRight, CheckCircle2,
  AlertCircle, Loader2, ChevronLeft
} from "lucide-react"
import { usersAPI } from "@/lib/api"

export default function RoleSettingsPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState("")

  if (!user) return (
    <>
      <style>{css}</style>
      <div className="role-root">
        <div className="role-center">
          <Loader2 size={28} className="role-spinner" />
        </div>
      </div>
    </>
  )

  const handleRoleChange = async (newRole: 'APPRENTICE' | 'PROFESSIONAL') => {
    if (user.role === newRole) { setError(`You're already in ${newRole} mode.`); return }
    setLoading(true); setError(""); setSuccess("")
    try {
      await usersAPI.updateUser(user.id, { role: newRole })
      await refreshUser()
      setSuccess(`Switched to ${newRole} mode. Redirecting…`)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to update role. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isCurrent = (role: string) => user.role === role

  const roles = [
    {
      id: 'APPRENTICE' as const,
      icon: <Users size={22} />,
      title: 'Apprentice',
      subtitle: 'Find and hire legal professionals',
      desc: 'Perfect for individuals and businesses seeking expert legal or financial guidance.',
      perks: [
        'Search and browse verified professionals',
        'Book consultations instantly',
        'Secure in-app messaging',
        'Track your consultation history',
      ],
    },
    {
      id: 'PROFESSIONAL' as const,
      icon: <Briefcase size={22} />,
      title: 'Professional',
      subtitle: 'Offer your services to clients',
      desc: 'Ideal for CAs, Lawyers, and Advocates who want to grow their client base.',
      perks: [
        'Create a verified professional profile',
        'Get discovered by thousands of clients',
        'Manage bookings and consultations',
        'Build your professional reputation',
      ],
    },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="role-root">

        {/* ── Header ── */}
        <header className="role-header">
          <div className="role-header-inner">
            <button className="role-back" onClick={() => router.back()}>
              <ChevronLeft size={15} /> Back
            </button>
            <div>
              <div className="role-eyebrow">Settings</div>
              <h1 className="role-headline">Switch your <em>role</em></h1>
              <p className="role-sub">
                Toggle between client and professional mode — your data is always preserved.
              </p>
            </div>
            <div className="role-current-pill">
              Currently: <strong>{user.role}</strong>
            </div>
          </div>
        </header>

        {/* ── Body ── */}
        <main className="role-body">

          {/* Alerts */}
          {error && (
            <div className="role-alert error">
              <AlertCircle size={15} className="role-alert-icon" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="role-alert success">
              <CheckCircle2 size={15} className="role-alert-icon" />
              <span>{success}</span>
            </div>
          )}

          {/* Role cards */}
          <div className="role-grid">
            {roles.map(role => {
              const current = isCurrent(role.id)
              return (
                <div key={role.id} className={`role-card${current ? ' current' : ''}`}>

                  {/* Card header */}
                  <div className="role-card-head">
                    <div className={`role-card-icon${current ? ' current' : ''}`}>
                      {role.icon}
                    </div>
                    {current && <span className="role-current-badge">Current mode</span>}
                  </div>

                  {/* Titles */}
                  <div className="role-card-title">{role.title}</div>
                  <div className="role-card-subtitle">{role.subtitle}</div>
                  <p className="role-card-desc">{role.desc}</p>

                  {/* Perks */}
                  <ul className="role-perks">
                    {role.perks.map((p, i) => (
                      <li key={i} className="role-perk">
                        <CheckCircle2 size={14} className="role-perk-check" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {current ? (
                    <div className="role-card-current-state">
                      <CheckCircle2 size={15} />
                      You're in this mode
                    </div>
                  ) : (
                    <button
                      className="role-switch-btn"
                      onClick={() => handleRoleChange(role.id)}
                      disabled={loading}
                    >
                      {loading
                        ? <><Loader2 size={14} className="role-spinner-inline" /> Switching…</>
                        : <>Switch to {role.title} <ArrowRight size={14} /></>
                      }
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Help note */}
          <div className="role-help">
            <div className="role-help-inner">
              <div className="role-help-title">Can I switch back later?</div>
              <div className="role-help-desc">
                Yes — you can switch between Apprentice and Professional mode at any time from this page.
                All your account data, messages, and history are preserved regardless of your current role.
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}

/* ─── Styles ──────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0d0f1a;
    --ink-soft: #3d3f52;
    --ink-muted: #7b7d94;
    --cream: #f7f5f0;
    --cream-dark: #e8e4dc;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --blue-deep: #1a2b6d;
    --blue-bright: #4169e1;
    --surface: #ffffff;
  }

  .role-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--ink);
  }

  .role-center {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh;
  }
  .role-spinner {
    color: var(--blue-bright);
    animation: spin 0.8s linear infinite;
  }

  /* ── Header ── */
  .role-header { background: var(--ink); padding: 0 1.5rem; }
  .role-header-inner {
    max-width: 820px; margin: 0 auto;
    padding: 2rem 0 2.5rem;
    display: flex; flex-direction: column; gap: 1rem;
  }

  .role-back {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.78rem; color: rgba(255,255,255,0.35);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; padding: 0;
    align-self: flex-start; transition: color 0.15s;
  }
  .role-back:hover { color: rgba(255,255,255,0.65); }

  .role-eyebrow {
    font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); font-weight: 500; margin-bottom: 0.3rem;
  }
  .role-headline {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(1.9rem, 4vw, 2.8rem);
    color: #fff; line-height: 1.1; font-weight: 400;
  }
  .role-headline em { font-style: italic; color: var(--gold-light); }
  .role-sub {
    font-size: 0.875rem; color: rgba(255,255,255,0.4);
    font-weight: 300; margin-top: 0.3rem;
  }

  .role-current-pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.35rem 0.9rem; border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.75rem; color: rgba(255,255,255,0.4);
    align-self: flex-start;
  }
  .role-current-pill strong { color: rgba(255,255,255,0.75); font-weight: 600; }

  /* ── Body ── */
  .role-body {
    max-width: 820px; margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    display: flex; flex-direction: column; gap: 1.25rem;
  }

  /* ── Alerts ── */
  .role-alert {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.875rem 1.1rem; border-radius: 12px;
    font-size: 0.875rem; font-weight: 500;
  }
  .role-alert.error {
    background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c;
  }
  .role-alert.success {
    background: #f0fdf4; border: 1px solid #86efac; color: #15803d;
  }
  .role-alert-icon { flex-shrink: 0; }

  /* ── Role grid ── */
  .role-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--cream-dark);
    border: 1px solid var(--cream-dark);
    border-radius: 20px;
    overflow: hidden;
  }

  /* ── Role card ── */
  .role-card {
    background: var(--surface);
    padding: 2.25rem 2rem;
    display: flex; flex-direction: column; gap: 0.75rem;
    position: relative;
    transition: background 0.2s;
  }
  .role-card:hover { background: #fafaf8; }
  .role-card.current {
    background: var(--ink);
  }
  .role-card.current:hover { background: #141627; }

  .role-card-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .role-card-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: var(--cream); color: var(--ink-soft);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s;
  }
  .role-card-icon.current {
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7);
  }
  .role-card:not(.current):hover .role-card-icon {
    background: var(--ink); color: #fff;
  }

  .role-current-badge {
    font-size: 0.68rem; font-weight: 600;
    padding: 0.25rem 0.7rem; border-radius: 100px;
    background: rgba(201,168,76,0.15);
    border: 1px solid rgba(201,168,76,0.3);
    color: var(--gold);
    letter-spacing: 0.04em;
  }

  .role-card-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.6rem; line-height: 1.1;
    color: var(--ink);
  }
  .role-card.current .role-card-title { color: #fff; }

  .role-card-subtitle {
    font-size: 0.82rem; font-weight: 500; color: var(--gold);
  }
  .role-card.current .role-card-subtitle { color: var(--gold-light); }

  .role-card-desc {
    font-size: 0.85rem; color: var(--ink-muted);
    line-height: 1.6; font-weight: 300;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--cream-dark);
    margin-bottom: 0.25rem;
  }
  .role-card.current .role-card-desc {
    color: rgba(255,255,255,0.35);
    border-bottom-color: rgba(255,255,255,0.08);
  }

  /* Perks */
  .role-perks {
    display: flex; flex-direction: column; gap: 0.55rem;
    list-style: none; padding: 0; margin: 0;
    flex: 1;
  }
  .role-perk {
    display: flex; align-items: flex-start; gap: 0.5rem;
    font-size: 0.83rem; color: var(--ink-soft); font-weight: 300;
    line-height: 1.45;
  }
  .role-card.current .role-perk { color: rgba(255,255,255,0.5); }
  .role-perk-check { color: #22c55e; flex-shrink: 0; margin-top: 1px; }
  .role-card.current .role-perk-check { color: rgba(255,255,255,0.3); }

  /* CTA */
  .role-switch-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    width: 100%; background: var(--ink); color: #fff;
    border: none; border-radius: 11px;
    padding: 0.8rem 1.25rem; font-size: 0.875rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .role-switch-btn:hover:not(:disabled) {
    background: var(--blue-deep);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(13,15,26,0.15);
  }
  .role-switch-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .role-card-current-state {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    width: 100%; border-radius: 11px; padding: 0.8rem;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.82rem; font-weight: 500;
    color: rgba(255,255,255,0.45);
    margin-top: 0.5rem;
  }

  .role-spinner-inline {
    animation: spin 0.8s linear infinite;
  }

  /* ── Help card ── */
  .role-help {
    background: var(--surface);
    border: 1px solid var(--cream-dark);
    border-radius: 16px;
    padding: 1.75rem 2rem;
  }
  .role-help-title {
    font-size: 0.875rem; font-weight: 600; color: var(--ink);
    margin-bottom: 0.4rem;
  }
  .role-help-desc {
    font-size: 0.83rem; color: var(--ink-muted);
    line-height: 1.65; font-weight: 300;
  }

  /* ── Keyframes ── */
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .role-grid { grid-template-columns: 1fr; }
    .role-card.current { order: -1; }
  }
`