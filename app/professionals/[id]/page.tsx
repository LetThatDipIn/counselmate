'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Star, MapPin, Award, Calendar, Globe, Linkedin,
  Mail, Shield, Briefcase, Languages, FileText,
  CheckCircle, Loader2, X, IndianRupee, ArrowLeft,
  Clock, ExternalLink
} from 'lucide-react'
import { useProfile, profilesAPI } from '@/lib/api'
import { useAuth } from '@/lib/context/auth-context'
import { toast } from 'sonner'

/* ── helpers ── */
const getProfessionLabel = (type: string) => ({
  CA: 'Chartered Accountant',
  CA_APPRENTICE: 'CA Apprentice',
  LAWYER: 'Lawyer',
  ADVOCATE: 'Advocate',
  LAW_FIRM: 'Law Firm',
  CA_FIRM: 'CA Firm',
}[type] ?? type)

const availabilityMeta = (a: string) => {
  if (a === 'AVAILABLE') return { label: 'Available now', color: 'avail-green' }
  if (a === 'BUSY') return { label: 'Busy', color: 'avail-amber' }
  return { label: a?.replace(/_/g, ' ') ?? '—', color: 'avail-muted' }
}

/* ─────────────────────────────────────────────────── */

export default function ProfessionalProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { profile, loading, error } = useProfile(params.id as string)

  const [dialogOpen, setDialogOpen]       = useState(false)
  const [contactLoading, setLoading2]     = useState(false)
  const [contactForm, setContactForm]     = useState({ subject: '', message: '' })

  const isOwnProfile = !!(user && profile && user.id === profile.user_id)
  const isProfessionalViewer = user?.role === 'PROFESSIONAL'
  const canMessageProfessional = !!(isAuthenticated && !isOwnProfile && !isProfessionalViewer)

  const handleContact = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact this professional')
      router.push('/auth/login')
      return
    }
    if (isOwnProfile) {
      toast.error('You cannot contact yourself')
      return
    }
    if (isProfessionalViewer) {
      toast.error('Professionals cannot message other professionals')
      return
    }
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading2(true)
    try {
      await profilesAPI.contactProfile(params.id as string, contactForm)
      toast.success('Message sent successfully!')
      setDialogOpen(false)
      setContactForm({ subject: '', message: '' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setLoading2(false)
    }
  }

  /* ── Loading ── */
  if (loading) return (
    <>
      <style>{css}</style>
      <div className="prof-root">
        <div className="prof-loading">
          <div className="prof-skeleton-hero" />
          <div className="prof-skeleton-body">
            <div className="prof-skeleton-main">
              {[200, 160, 120].map(h => <div key={h} className="prof-skel" style={{ height: h }} />)}
            </div>
            <div className="prof-skeleton-side">
              {[120, 100, 90].map(h => <div key={h} className="prof-skel" style={{ height: h }} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  )

  /* ── Error ── */
  if (error || !profile) return (
    <>
      <style>{css}</style>
      <div className="prof-root">
        <div className="prof-error">
          <div className="prof-error-icon"><Briefcase size={28} /></div>
          <div className="prof-error-title">Profile not found</div>
          <div className="prof-error-desc">The professional you're looking for doesn't exist or has been removed.</div>
          <button className="prof-error-btn" onClick={() => router.push('/professionals')}>
            <ArrowLeft size={15} /> Browse Professionals
          </button>
        </div>
      </div>
    </>
  )

  const avail = availabilityMeta(profile.availability)
  const initials = (profile.title ?? 'P').split(' ').map((w: string) => w[0]).slice(0, 2).join('')

  return (
    <>
      <style>{css}</style>
      <div className="prof-root">

        {/* ════════ HERO ════════ */}
        <header className="prof-hero">
          <div className="prof-hero-inner">

            {/* Back */}
            <button className="prof-back" onClick={() => router.back()}>
              <ArrowLeft size={15} /> Back
            </button>

            <div className="prof-hero-body">
              {/* Avatar */}
              <div className="prof-avatar-wrap">
                {profile.profile_picture
                  ? <img src={profile.profile_picture} alt={profile.title} className="prof-avatar-img" />
                  : <div className="prof-avatar-initials">{initials}</div>
                }
                {profile.is_verified && (
                  <div className="prof-verified-ring" title="Verified Professional">
                    <Shield size={12} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="prof-hero-info">
                <div className="prof-hero-top">
                  <div>
                    <div className="prof-profession-label">
                      {getProfessionLabel(profile.profession_type)}
                    </div>
                    <h1 className="prof-name">{profile.title}</h1>
                  </div>
                  {profile.is_verified && (
                    <div className="prof-verified-badge">
                      <Shield size={13} /> Verified
                    </div>
                  )}
                </div>

                {/* Meta row */}
                <div className="prof-meta-row">
                  {(profile.city || profile.state || profile.location) && (
                    <span className="prof-meta-item">
                      <MapPin size={13} />
                      {profile.city || profile.state || profile.location}
                    </span>
                  )}
                  <span className="prof-meta-sep" />
                  <span className="prof-meta-item">
                    <Briefcase size={13} />
                    {profile.experience_years}+ years
                  </span>
                  <span className="prof-meta-sep" />
                  <span className="prof-meta-item">
                    <Star size={13} className="star-fill" />
                    <strong>{profile.rating?.toFixed(1)}</strong>
                    <span className="prof-meta-sub">({profile.review_count} reviews)</span>
                  </span>
                </div>

                {/* CTA */}
                <div className="prof-hero-cta">
                  <button
                    className="prof-contact-btn"
                    onClick={() => {
                      if (!canMessageProfessional) {
                        toast.error(isOwnProfile ? 'You cannot message yourself' : 'Professionals cannot message other professionals')
                        return
                      }
                      setDialogOpen(true)
                    }}
                    disabled={!canMessageProfessional}
                    title={!canMessageProfessional ? (isOwnProfile ? 'You cannot message yourself' : 'Professional-to-professional messaging is disabled') : undefined}
                  >
                    <Mail size={15} /> Contact Professional
                  </button>
                  <button
                    className="prof-contact-btn"
                    onClick={() => {
                      if (!canMessageProfessional) {
                        toast.error(isOwnProfile ? 'You cannot message yourself' : 'Professionals cannot message other professionals')
                        return
                      }
                      router.push(`/messages?consultant=${profile.user_id}`)
                    }}
                    disabled={!canMessageProfessional}
                    title={!canMessageProfessional ? (isOwnProfile ? 'You cannot message yourself' : 'Professional-to-professional messaging is disabled') : undefined}
                  >
                    <Calendar size={15} /> Open Messages
                  </button>
                  {profile.hourly_rate && (
                    <div className="prof-rate-pill">
                      <IndianRupee size={13} />
                      <strong>₹{profile.hourly_rate}</strong>
                      <span>/hr</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ════════ BODY ════════ */}
        <div className="prof-body">
          <div className="prof-body-inner">

            {/* ── Left column ── */}
            <div className="prof-main">

              {/* About */}
              <section className="prof-card">
                <div className="prof-card-label">About</div>
                <p className="prof-bio">{profile.bio || 'No bio available.'}</p>
              </section>

              {/* Skills */}
              {profile.skills?.length > 0 && (
                <section className="prof-card">
                  <div className="prof-card-label-row">
                    <Award size={15} className="prof-card-icon" />
                    <div className="prof-card-label">Skills & Expertise</div>
                  </div>
                  <div className="prof-tags">
                    {profile.skills.map((s: string, i: number) => (
                      <span key={i} className="prof-tag">{s}</span>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {profile.certifications?.length > 0 && (
                <section className="prof-card">
                  <div className="prof-card-label-row">
                    <FileText size={15} className="prof-card-icon" />
                    <div className="prof-card-label">Certifications</div>
                  </div>
                  <ul className="prof-cert-list">
                    {profile.certifications.map((c: string, i: number) => (
                      <li key={i} className="prof-cert-item">
                        <CheckCircle size={15} className="prof-cert-check" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* ── Right column ── */}
            <aside className="prof-aside">

              {/* Pricing */}
              {profile.hourly_rate && (
                <div className="prof-aside-card pricing">
                  <div className="prof-aside-label">Consultation Rate</div>
                  <div className="prof-price">
                    <IndianRupee size={20} className="prof-price-icon" />
                    <span className="prof-price-num">{profile.hourly_rate}</span>
                    <span className="prof-price-unit">/hour</span>
                  </div>
                  <button className="prof-book-btn" onClick={() => setDialogOpen(true)}>
                    Book Consultation
                  </button>
                </div>
              )}

              {/* Availability */}
              <div className="prof-aside-card">
                <div className="prof-aside-label-row">
                  <Clock size={14} />
                  <div className="prof-aside-label">Availability</div>
                </div>
                <div className={`prof-avail-badge ${avail.color}`}>
                  <span className="prof-avail-dot" />
                  {avail.label}
                </div>
              </div>

              {/* Languages */}
              {profile.languages?.length > 0 && (
                <div className="prof-aside-card">
                  <div className="prof-aside-label-row">
                    <Languages size={14} />
                    <div className="prof-aside-label">Languages</div>
                  </div>
                  <div className="prof-lang-list">
                    {profile.languages.map((l: string, i: number) => (
                      <span key={i} className="prof-lang-chip">{l}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(profile.linkedin_url || profile.website_url) && (
                <div className="prof-aside-card">
                  <div className="prof-aside-label">Connect</div>
                  <div className="prof-links">
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="prof-link">
                        <Linkedin size={15} />
                        <span>LinkedIn</span>
                        <ExternalLink size={11} className="prof-link-ext" />
                      </a>
                    )}
                    {profile.website_url && (
                      <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="prof-link">
                        <Globe size={15} />
                        <span>Website</span>
                        <ExternalLink size={11} className="prof-link-ext" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* ════════ CONTACT DIALOG ════════ */}
        {dialogOpen && (
          <div className="dialog-overlay" onClick={e => e.target === e.currentTarget && setDialogOpen(false)}>
            <div className="dialog-panel">
              <div className="dialog-header">
                <div>
                  <div className="dialog-eyebrow">Get in touch</div>
                  <h2 className="dialog-title">Contact {profile.title}</h2>
                  <p className="dialog-desc">Your message will be delivered to them via email.</p>
                </div>
                <button className="dialog-close" onClick={() => setDialogOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="dialog-body">
                <div className="dialog-field">
                  <label className="dialog-label">Subject</label>
                  <input
                    className="dialog-input"
                    placeholder="e.g. Tax consultation inquiry"
                    value={contactForm.subject}
                    onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))}
                  />
                </div>
                <div className="dialog-field">
                  <label className="dialog-label">Message</label>
                  <textarea
                    className="dialog-textarea"
                    placeholder="Describe your requirements in detail…"
                    rows={5}
                    value={contactForm.message}
                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>
                <button
                  className={`dialog-send-btn${contactLoading ? ' loading' : ''}`}
                  onClick={handleContact}
                  disabled={contactLoading}
                >
                  {contactLoading
                    ? <><Loader2 size={15} className="spin" /> Sending…</>
                    : <><Mail size={15} /> Send Message</>
                  }
                </button>
              </div>
            </div>
          </div>
        )}
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

  .prof-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--ink);
  }

  /* ── Hero ── */
  .prof-hero {
    background: var(--ink);
    padding: 0 1.5rem;
  }
  .prof-hero-inner {
    max-width: 1040px;
    margin: 0 auto;
    padding: 1.75rem 0 2.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .prof-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.78rem; color: rgba(255,255,255,0.4);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    padding: 0; transition: color 0.15s;
    align-self: flex-start;
  }
  .prof-back:hover { color: rgba(255,255,255,0.75); }

  .prof-hero-body {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  /* Avatar */
  .prof-avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }
  .prof-avatar-img {
    width: 96px; height: 96px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255,255,255,0.12);
  }
  .prof-avatar-initials {
    width: 96px; height: 96px;
    border-radius: 50%;
    background: var(--blue-deep);
    border: 3px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 2rem; color: #fff;
  }
  .prof-verified-ring {
    position: absolute; bottom: 2px; right: 2px;
    width: 24px; height: 24px; border-radius: 50%;
    background: #22c55e; color: #fff;
    border: 2px solid var(--ink);
    display: flex; align-items: center; justify-content: center;
  }

  /* Info */
  .prof-hero-info {
    flex: 1;
    display: flex; flex-direction: column; gap: 1rem;
  }
  .prof-hero-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 1rem;
  }
  .prof-profession-label {
    font-size: 0.72rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--gold);
    font-weight: 500; margin-bottom: 0.3rem;
  }
  .prof-name {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    color: #fff; line-height: 1.1; font-weight: 400;
  }
  .prof-verified-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.3rem 0.8rem; border-radius: 100px;
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.3);
    color: #4ade80; font-size: 0.75rem; font-weight: 600;
    flex-shrink: 0;
  }

  .prof-meta-row {
    display: flex; align-items: center; flex-wrap: wrap; gap: 0.6rem;
  }
  .prof-meta-item {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.82rem; color: rgba(255,255,255,0.5); font-weight: 300;
  }
  .prof-meta-item strong { color: rgba(255,255,255,0.85); font-weight: 600; }
  .prof-meta-sub { color: rgba(255,255,255,0.35); }
  .prof-meta-sep {
    width: 3px; height: 3px; border-radius: 50%;
    background: rgba(255,255,255,0.2); flex-shrink: 0;
  }
  .star-fill { color: var(--gold-light); fill: var(--gold-light); }

  .prof-hero-cta {
    display: flex; align-items: center; gap: 0.875rem; flex-wrap: wrap;
  }
  .prof-contact-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--blue-bright); color: #fff;
    border: none; border-radius: 10px;
    padding: 0.72rem 1.4rem; font-size: 0.875rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .prof-contact-btn:hover {
    background: #3057cc;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(65,105,225,0.4);
  }
  .prof-rate-pill {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.55rem 1rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    font-size: 0.875rem; color: rgba(255,255,255,0.6);
  }
  .prof-rate-pill strong { color: #fff; font-weight: 600; }

  /* ── Body ── */
  .prof-body { padding: 0 1.5rem; }
  .prof-body-inner {
    max-width: 1040px;
    margin: 0 auto;
    padding: 2.25rem 0 4rem;
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 1.5rem;
    align-items: start;
  }

  /* ── Cards (main) ── */
  .prof-main { display: flex; flex-direction: column; gap: 1px; background: var(--cream-dark); border-radius: 16px; overflow: hidden; border: 1px solid var(--cream-dark); }

  .prof-card {
    background: var(--surface);
    padding: 2rem;
    display: flex; flex-direction: column; gap: 1rem;
  }
  .prof-card-label {
    font-size: 0.7rem; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--gold); font-weight: 500;
  }
  .prof-card-label-row {
    display: flex; align-items: center; gap: 0.5rem;
  }
  .prof-card-icon { color: var(--ink-muted); }

  .prof-bio {
    font-size: 0.9rem; color: var(--ink-soft);
    line-height: 1.75; font-weight: 300;
    white-space: pre-wrap;
  }

  .prof-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .prof-tag {
    font-size: 0.78rem; font-weight: 500;
    padding: 0.3rem 0.8rem; border-radius: 8px;
    background: var(--cream); color: var(--ink-soft);
    border: 1px solid var(--cream-dark);
  }

  .prof-cert-list { display: flex; flex-direction: column; gap: 0.6rem; }
  .prof-cert-item {
    display: flex; align-items: flex-start; gap: 0.6rem;
    font-size: 0.875rem; color: var(--ink-soft); line-height: 1.5;
  }
  .prof-cert-check { color: #22c55e; flex-shrink: 0; margin-top: 2px; }

  /* ── Aside ── */
  .prof-aside {
    display: flex; flex-direction: column; gap: 1px;
    background: var(--cream-dark);
    border-radius: 16px; overflow: hidden;
    border: 1px solid var(--cream-dark);
    position: sticky; top: 1.5rem;
  }

  .prof-aside-card {
    background: var(--surface);
    padding: 1.5rem;
    display: flex; flex-direction: column; gap: 0.75rem;
  }
  .prof-aside-card.pricing { background: var(--ink); }

  .prof-aside-label {
    font-size: 0.68rem; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--gold); font-weight: 500;
  }
  .prof-aside-label-row {
    display: flex; align-items: center; gap: 0.4rem; color: var(--ink-muted);
  }
  .prof-aside-label-row .prof-aside-label { color: var(--gold); }

  .prof-price {
    display: flex; align-items: baseline; gap: 0.2rem;
  }
  .prof-price-icon { color: rgba(255,255,255,0.6); margin-bottom: -2px; }
  .prof-price-num {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 2.2rem; color: #fff; line-height: 1;
  }
  .prof-price-unit { font-size: 0.875rem; color: rgba(255,255,255,0.4); font-weight: 300; }

  .prof-book-btn {
    width: 100%;
    background: var(--blue-bright); color: #fff;
    border: none; border-radius: 10px;
    padding: 0.72rem 1rem; font-size: 0.875rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    margin-top: 0.25rem;
  }
  .prof-book-btn:hover { background: #3057cc; transform: translateY(-1px); }

  /* Availability */
  .prof-avail-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.35rem 0.85rem; border-radius: 100px;
    font-size: 0.8rem; font-weight: 500;
    align-self: flex-start;
  }
  .avail-green { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
  .avail-amber { background: #fffbeb; color: #a16207; border: 1px solid #fde68a; }
  .avail-muted { background: var(--cream); color: var(--ink-muted); border: 1px solid var(--cream-dark); }
  .prof-avail-dot {
    width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0;
  }

  /* Languages */
  .prof-lang-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .prof-lang-chip {
    font-size: 0.75rem; font-weight: 500;
    padding: 0.25rem 0.65rem; border-radius: 8px;
    background: var(--cream); color: var(--ink-soft);
    border: 1px solid var(--cream-dark);
  }

  /* Links */
  .prof-links { display: flex; flex-direction: column; gap: 0.5rem; }
  .prof-link {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.83rem; color: var(--blue-bright); font-weight: 500;
    text-decoration: none; padding: 0.4rem 0;
    transition: color 0.15s;
  }
  .prof-link:hover { color: var(--blue-deep); }
  .prof-link-ext { color: var(--ink-muted); margin-left: auto; }

  /* ── Dialog ── */
  .dialog-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(13,15,26,0.6);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.15s ease;
  }
  .dialog-panel {
    background: var(--surface);
    border-radius: 20px;
    width: 100%; max-width: 480px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(13,15,26,0.25);
    animation: slideUp 0.2s ease;
  }
  .dialog-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 2rem 2rem 0;
    gap: 1rem;
  }
  .dialog-eyebrow {
    font-size: 0.68rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--gold); font-weight: 500;
    margin-bottom: 0.3rem;
  }
  .dialog-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.5rem; color: var(--ink); font-weight: 400;
  }
  .dialog-desc {
    font-size: 0.82rem; color: var(--ink-muted);
    font-weight: 300; margin-top: 0.25rem;
  }
  .dialog-close {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--cream); color: var(--ink-muted);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.15s, color 0.15s;
  }
  .dialog-close:hover { background: var(--cream-dark); color: var(--ink); }

  .dialog-body {
    padding: 1.5rem 2rem 2rem;
    display: flex; flex-direction: column; gap: 1.1rem;
  }
  .dialog-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .dialog-label {
    font-size: 0.75rem; font-weight: 600; color: var(--ink);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .dialog-input, .dialog-textarea {
    background: var(--cream); border: 1.5px solid var(--cream-dark);
    border-radius: 10px; padding: 0.65rem 0.9rem;
    font-size: 0.875rem; color: var(--ink);
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s, background 0.2s;
    resize: vertical;
  }
  .dialog-input::placeholder, .dialog-textarea::placeholder { color: var(--ink-muted); }
  .dialog-input:focus, .dialog-textarea:focus {
    border-color: var(--blue-bright); background: #fff;
  }
  .dialog-send-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    width: 100%; background: var(--ink); color: #fff;
    border: none; border-radius: 10px;
    padding: 0.8rem 1.25rem; font-size: 0.875rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    margin-top: 0.25rem;
    transition: background 0.2s, transform 0.15s;
  }
  .dialog-send-btn:hover:not(:disabled) {
    background: var(--blue-deep); transform: translateY(-1px);
  }
  .dialog-send-btn:disabled { opacity: 0.65; cursor: not-allowed; }
  .dialog-send-btn.loading { background: var(--blue-deep); }

  /* ── Loading skeleton ── */
  .prof-loading { animation: fadeIn 0.2s ease; }
  .prof-skeleton-hero {
    height: 240px;
    background: linear-gradient(90deg, #1a1c2e 25%, #22243a 50%, #1a1c2e 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  .prof-skeleton-body {
    max-width: 1040px; margin: 2rem auto; padding: 0 1.5rem;
    display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem;
  }
  .prof-skeleton-main, .prof-skeleton-side {
    display: flex; flex-direction: column; gap: 1rem;
  }
  .prof-skel {
    border-radius: 12px;
    background: linear-gradient(90deg, #e8e4dc 25%, #f0ece4 50%, #e8e4dc 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  /* ── Error ── */
  .prof-error {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 60vh;
    gap: 0.75rem; text-align: center; padding: 2rem;
  }
  .prof-error-icon {
    width: 60px; height: 60px; border-radius: 16px;
    background: var(--cream-dark); color: var(--ink-muted);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.5rem;
  }
  .prof-error-title { font-size: 1.1rem; font-weight: 600; color: var(--ink); }
  .prof-error-desc { font-size: 0.85rem; color: var(--ink-muted); font-weight: 300; max-width: 300px; }
  .prof-error-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    margin-top: 0.5rem; padding: 0.65rem 1.25rem;
    border-radius: 10px; border: 1.5px solid var(--cream-dark);
    background: transparent; font-size: 0.85rem; font-weight: 500;
    color: var(--ink); font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .prof-error-btn:hover { border-color: var(--ink); background: rgba(13,15,26,0.04); }

  /* ── Keyframes ── */
  @keyframes shimmer { to { background-position: -200% 0; } }
  @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  .spin { animation: spinAnim 0.8s linear infinite; }
  @keyframes spinAnim { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .prof-body-inner { grid-template-columns: 1fr; }
    .prof-aside { position: static; }
    .prof-hero-body { flex-direction: column; gap: 1.25rem; }
    .prof-avatar-initials, .prof-avatar-img { width: 72px; height: 72px; }
    .prof-skeleton-body { grid-template-columns: 1fr; }
    .prof-hero-top { flex-direction: column; gap: 0.5rem; }
  }
`