"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useEffect, useState } from "react"
import { profilesAPI } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Check, X } from "lucide-react"
import { PROFESSION_SKILLS, CERTIFICATIONS, LANGUAGES, PROFESSION_TITLES } from "@/lib/professional-data"
import type { ProfessionType, UpdateProfileRequest, Profile } from "@/lib/api/types"

const ALLOWED_PROFESSION_TYPES: ProfessionType[] = [
  'POWER_OF_ATTORNEY',
  'MARRIAGE_REGISTRATION',
  'LEGAL_HEIR_CERTIFICATE',
]

const normalizeProfessionType = (value?: string): ProfessionType => {
  const typedValue = value as ProfessionType | undefined
  if (typedValue && ALLOWED_PROFESSION_TYPES.includes(typedValue)) return typedValue
  return 'POWER_OF_ATTORNEY'
}

export default function EditProfessionalProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'create' | 'edit'>('edit')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    profession_type: 'POWER_OF_ATTORNEY',
    title: '', bio: '', skills: [],
    location: '', city: '', state: '',
    experience_years: 0, availability: 'AVAILABLE',
    hourly_rate: 0, profile_picture: '',
    linkedin_url: '', website_url: '',
    certifications: [], languages: [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [certInput, setCertInput] = useState('')

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'PROFESSIONAL')) {
      router.push('/auth/register?role=PROFESSIONAL')
    }
  }, [isAuthenticated, loading, user, router])

  useEffect(() => {
    if (user && user.role === 'PROFESSIONAL' && isAuthenticated) {
      setIsLoadingProfile(true)
      profilesAPI.getMyProfile()
        .then((profile: Profile) => {
          setMode('edit')
          setProfileId(profile.id)
          setFormData({
            profession_type: normalizeProfessionType(profile.profession_type),
            title: profile.title || '', bio: profile.bio || '',
            skills: profile.skills || [], location: profile.location || '',
            city: profile.city || '', state: profile.state || '',
            experience_years: profile.experience_years || 0,
            availability: profile.availability || 'AVAILABLE',
            hourly_rate: profile.hourly_rate || 0,
            profile_picture: profile.profile_picture || '',
            linkedin_url: profile.linkedin_url || '',
            website_url: profile.website_url || '',
            certifications: profile.certifications || [],
            languages: profile.languages || [],
          })
        })
        .catch(() => { setMode('create'); setProfileId(null) })
        .finally(() => setIsLoadingProfile(false))
    }
  }, [user, isAuthenticated, router])

  if (loading || isLoadingProfile) {
    return (
      <>
        <style>{css}</style>
        <div className="ep-loading">
          <div className="ep-loading-inner">
            <Loader2 className="ep-spinner" />
            <span className="ep-loading-text">Loading profile…</span>
          </div>
        </div>
      </>
    )
  }

  if (!user || user.role !== 'PROFESSIONAL') return null

  const professionType = (formData.profession_type || 'POWER_OF_ATTORNEY') as keyof typeof PROFESSION_SKILLS
  const availableSkills = PROFESSION_SKILLS[professionType] || []
  const availableCerts  = CERTIFICATIONS[professionType] || []
  const availableTitles = PROFESSION_TITLES[professionType] || []

  const handleAddSkill    = (s: string) => !formData.skills?.includes(s)        && setFormData({ ...formData, skills:         [...(formData.skills        || []), s] })
  const handleRemoveSkill = (i: number) => setFormData({ ...formData, skills:         formData.skills?.filter((_: string, j: number) => j !== i) || [] })
  const handleAddCert     = (c: string) => !formData.certifications?.includes(c) && setFormData({ ...formData, certifications: [...(formData.certifications || []), c] })
  const handleRemoveCert  = (i: number) => setFormData({ ...formData, certifications: formData.certifications?.filter((_: string, j: number) => j !== i) || [] })
  const handleAddLang     = (l: string) => !formData.languages?.includes(l)     && setFormData({ ...formData, languages:      [...(formData.languages      || []), l] })
  const handleRemoveLang  = (i: number) => setFormData({ ...formData, languages:      formData.languages?.filter((_: string, j: number) => j !== i)      || [] })

  const handleAddCustomSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...(formData.skills || []), skillInput.trim()] })
      setSkillInput('')
    }
  }
  const handleAddCustomCert = () => {
    if (certInput.trim() && !formData.certifications?.includes(certInput.trim())) {
      setFormData({ ...formData, certifications: [...(formData.certifications || []), certInput.trim()] })
      setCertInput('')
    }
  }

  const handleSubmit = async () => {
    if (!formData.title?.trim() || !formData.bio?.trim()) {
      toast.error('Title and bio are required')
      return
    }
    setIsSubmitting(true)
    try {
      if (mode === 'create') await profilesAPI.createProfile(formData)
      else await profilesAPI.updateProfile(formData)
      const updated = await profilesAPI.getMyProfile()
      if (updated) {
        setMode('edit'); setProfileId(updated.id)
        setFormData({
          title: updated.title || '', bio: updated.bio || '',
          profession_type: normalizeProfessionType(updated.profession_type),
          experience_years: updated.experience_years || 0,
          city: updated.city || '', state: updated.state || '',
          location: updated.location || '',
          availability: updated.availability || 'AVAILABLE',
          hourly_rate: updated.hourly_rate || undefined,
          skills: updated.skills || [], certifications: updated.certifications || [],
          languages: updated.languages || [], profile_picture: updated.profile_picture || '',
          linkedin_url: updated.linkedin_url || '', website_url: updated.website_url || '',
        })
      }
      toast.success(mode === 'create' ? 'Profile created successfully!' : 'Profile updated successfully!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!profileId) { toast.error('Profile ID not found'); return }
    setIsDeleting(true)
    try {
      await profilesAPI.deleteProfile(profileId)
      toast.success('Profile deleted successfully!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete profile')
    } finally {
      setIsDeleting(false); setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="ep-page">

        {/* ── Page masthead ── */}
        <div className="ep-masthead">
          <button onClick={() => router.back()} className="ep-back" aria-label="Go back">
            <ArrowLeft size={16} />
          </button>
          <div className="ep-masthead-center">
            <div className="ep-eyebrow">CounselMate · Professional Registry</div>
            <h1 className="ep-headline">
              {mode === 'create' ? 'Create Your Profile' : 'Edit Your Profile'}
            </h1>
            <div className="ep-deck">
              {mode === 'create'
                ? 'Complete your profile to appear in the verified professional directory.'
                : 'Keep your credentials and availability up to date to attract the right clients.'}
            </div>
          </div>
        </div>

        {/* ── Form body ── */}
        <div className="ep-body">

          {/* § 01 Basic Information */}
          <section className="ep-section">
            <div className="ep-section-head">
              <span className="ep-section-num">§ 01</span>
              <h2 className="ep-section-title">Basic Information</h2>
              <span className="ep-section-rule" />
            </div>

            <div className="ep-fields">
              <div className="ep-field">
                <label className="ep-label">Profession Type</label>
                <div className="ep-select-wrap">
                  <Select
                    value={formData.profession_type || 'POWER_OF_ATTORNEY'}
                    onValueChange={(v) => setFormData({ ...formData, profession_type: v as ProfessionType })}
                  >
                    <SelectTrigger className="ep-select-trigger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="ep-select-content">
                      <SelectItem value="POWER_OF_ATTORNEY">Power of Attorney</SelectItem>
                      <SelectItem value="MARRIAGE_REGISTRATION">Marriage Registration</SelectItem>
                      <SelectItem value="LEGAL_HEIR_CERTIFICATE">Legal Heir Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="ep-field">
                <label className="ep-label" htmlFor="title">
                  Professional Title <span className="ep-required">*</span>
                </label>
                <input
                  id="title"
                  className="ep-input"
                  placeholder="e.g., Senior Tax Consultant"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {availableTitles.length > 0 && (
                  <div className="ep-suggestions">
                    <span className="ep-suggestions-label">Suggested titles:</span>
                    {availableTitles.map((t) => (
                      <button
                        key={t}
                        onClick={() => setFormData({ ...formData, title: t })}
                        className={`ep-suggestion-pill ${formData.title === t ? 'ep-suggestion-pill--active' : ''}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="ep-field">
                <label className="ep-label" htmlFor="bio">
                  Bio / About You <span className="ep-required">*</span>
                </label>
                <textarea
                  id="bio"
                  className="ep-textarea"
                  rows={5}
                  placeholder="Describe your experience, expertise, and the services you offer…"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="ep-field ep-field--half">
                <label className="ep-label" htmlFor="experience">Years of Experience</label>
                <input
                  id="experience"
                  className="ep-input"
                  type="number" min="0" max="70"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </section>

          {/* § 02 Location & Rates */}
          <section className="ep-section">
            <div className="ep-section-head">
              <span className="ep-section-num">§ 02</span>
              <h2 className="ep-section-title">Location & Rates</h2>
              <span className="ep-section-rule" />
            </div>

            <div className="ep-fields">
              <div className="ep-field-row">
                <div className="ep-field">
                  <label className="ep-label" htmlFor="city">City</label>
                  <input id="city" className="ep-input" placeholder="e.g., Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div className="ep-field">
                  <label className="ep-label" htmlFor="state">State</label>
                  <input id="state" className="ep-input" placeholder="e.g., Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                </div>
              </div>

              <div className="ep-field">
                <label className="ep-label" htmlFor="location">Full Location</label>
                <input id="location" className="ep-input" placeholder="e.g., Mumbai, Maharashtra, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>

              <div className="ep-field-row">
                <div className="ep-field">
                  <label className="ep-label" htmlFor="rate">Hourly Rate (₹)</label>
                  <div className="ep-input-prefix-wrap">
                    <span className="ep-input-prefix">₹</span>
                    <input id="rate" className="ep-input ep-input--prefixed" type="number" min="0" placeholder="2000"
                      value={formData.hourly_rate || ''}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="ep-field">
                  <label className="ep-label">Availability</label>
                  <div className="ep-select-wrap">
                    <Select
                      value={formData.availability}
                      onValueChange={(v) => setFormData({ ...formData, availability: v })}
                    >
                      <SelectTrigger className="ep-select-trigger">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="ep-select-content">
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="BUSY">Busy</SelectItem>
                        <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* § 03 Skills */}
          <section className="ep-section">
            <div className="ep-section-head">
              <span className="ep-section-num">§ 03</span>
              <h2 className="ep-section-title">Skills</h2>
              <span className="ep-section-rule" />
            </div>

            <div className="ep-fields">
              <div className="ep-field">
                <p className="ep-sub-label">Quick-add for {professionType.replace(/_/g, ' ').toLowerCase()}:</p>
                <div className="ep-tag-grid">
                  {availableSkills.map((skill) => (
                    <button key={skill} onClick={() => handleAddSkill(skill)}
                      className={`ep-tag ${formData.skills?.includes(skill) ? 'ep-tag--on' : ''}`}>
                      {formData.skills?.includes(skill) && <Check size={11} />}
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ep-custom-input-row">
                <input className="ep-input" placeholder="Add a custom skill…"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill()} />
                <button className="ep-add-btn" onClick={handleAddCustomSkill}>Add</button>
              </div>

              {!!formData.skills?.length && (
                <div className="ep-chips">
                  {formData.skills.map((s, i) => (
                    <span key={i} className="ep-chip ep-chip--skill">
                      {s}
                      <button onClick={() => handleRemoveSkill(i)} className="ep-chip-remove"><X size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* § 04 Certifications */}
          <section className="ep-section">
            <div className="ep-section-head">
              <span className="ep-section-num">§ 04</span>
              <h2 className="ep-section-title">Certifications</h2>
              <span className="ep-section-rule" />
            </div>

            <div className="ep-fields">
              <div className="ep-field">
                <p className="ep-sub-label">Common certifications:</p>
                <div className="ep-tag-grid">
                  {availableCerts.map((cert) => (
                    <button key={cert} onClick={() => handleAddCert(cert)}
                      className={`ep-tag ${formData.certifications?.includes(cert) ? 'ep-tag--on' : ''}`}>
                      {formData.certifications?.includes(cert) && <Check size={11} />}
                      {cert}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ep-custom-input-row">
                <input className="ep-input" placeholder="Add a custom certification…"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomCert()} />
                <button className="ep-add-btn" onClick={handleAddCustomCert}>Add</button>
              </div>

              {!!formData.certifications?.length && (
                <div className="ep-chips">
                  {formData.certifications.map((c, i) => (
                    <span key={i} className="ep-chip ep-chip--cert">
                      {c}
                      <button onClick={() => handleRemoveCert(i)} className="ep-chip-remove"><X size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* § 05 Languages */}
          <section className="ep-section">
            <div className="ep-section-head">
              <span className="ep-section-num">§ 05</span>
              <h2 className="ep-section-title">Languages</h2>
              <span className="ep-section-rule" />
            </div>

            <div className="ep-fields">
              <div className="ep-tag-grid">
                {LANGUAGES.map((lang) => (
                  <button key={lang} onClick={() => handleAddLang(lang)}
                    className={`ep-tag ${formData.languages?.includes(lang) ? 'ep-tag--on' : ''}`}>
                    {formData.languages?.includes(lang) && <Check size={11} />}
                    {lang}
                  </button>
                ))}
              </div>

              {!!formData.languages?.length && (
                <div className="ep-chips">
                  {formData.languages.map((l, i) => (
                    <span key={i} className="ep-chip ep-chip--lang">
                      {l}
                      <button onClick={() => handleRemoveLang(i)} className="ep-chip-remove"><X size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Action bar ── */}
          <div className="ep-actions">
            <div className="ep-actions-primary">
              <button className="ep-btn ep-btn--ghost" onClick={() => router.back()}>
                Cancel
              </button>
              <button className="ep-btn ep-btn--primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 size={14} className="ep-btn-spinner" />}
                {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create Profile' : 'Save Changes'}
              </button>
            </div>

            {mode === 'edit' && !showDeleteConfirm && (
              <button className="ep-btn ep-btn--delete" onClick={() => setShowDeleteConfirm(true)}>
                Delete Profile
              </button>
            )}

            {mode === 'edit' && showDeleteConfirm && (
              <div className="ep-delete-confirm">
                <div className="ep-delete-confirm-rule" />
                <p className="ep-delete-confirm-text">
                  Are you sure you want to permanently delete your profile? This cannot be undone.
                </p>
                <div className="ep-delete-confirm-actions">
                  <button className="ep-btn ep-btn--ghost" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                  <button className="ep-btn ep-btn--delete-confirm" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting && <Loader2 size={14} className="ep-btn-spinner" />}
                    {isDeleting ? 'Deleting…' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --paper: #f5f0e8;
    --paper-dark: #ece6d8;
    --paper-rule: #c8bfa8;
    --ink: #1a1610;
    --ink-soft: #3d3828;
    --ink-muted: #7a7260;
    --ink-faint: #a09880;
    --red: #8b1a1a;
    --red-light: #b22222;
    --night: #111009;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page shell ── */
  .ep-page {
    min-height: 100vh;
    background: var(--paper);
    font-family: 'Source Serif 4', Georgia, serif;
    color: var(--ink);
    padding-bottom: 5rem;
  }

  /* ── Loading ── */
  .ep-loading {
    min-height: 100vh;
    background: var(--paper);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ep-loading-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .ep-spinner {
    width: 28px; height: 28px;
    color: var(--red);
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ep-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }

  /* ── Masthead ── */
  .ep-masthead {
    background: var(--night);
    padding: 2.5rem 5%;
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    border-bottom: 3px solid var(--red);
  }
  .ep-back {
    margin-top: 0.25rem;
    width: 34px; height: 34px;
    border-radius: 3px;
    border: 1px solid rgba(255,255,255,0.12);
    background: transparent;
    color: rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.15s, color 0.15s;
  }
  .ep-back:hover { border-color: var(--gold); color: var(--gold); }

  .ep-masthead-center { flex: 1; }
  .ep-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.5rem;
  }
  .ep-headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.75rem, 3.5vw, 2.75rem);
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 0.625rem;
  }
  .ep-deck {
    font-size: 0.9rem;
    font-weight: 300;
    color: rgba(255,255,255,0.4);
    line-height: 1.65;
    max-width: 540px;
  }

  /* ── Body container ── */
  .ep-body {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 5%;
  }

  /* ── Section ── */
  .ep-section {
    padding: 3rem 0;
    border-bottom: 1px solid var(--paper-rule);
  }
  .ep-section:last-of-type { border-bottom: none; }

  .ep-section-head {
    display: flex;
    align-items: baseline;
    gap: 0.875rem;
    margin-bottom: 2rem;
  }
  .ep-section-num {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    color: var(--ink-faint);
    letter-spacing: 0.06em;
    flex-shrink: 0;
  }
  .ep-section-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--ink);
  }
  .ep-section-rule {
    flex: 1;
    height: 1px;
    background: var(--paper-rule);
    align-self: center;
  }

  /* ── Fields ── */
  .ep-fields { display: flex; flex-direction: column; gap: 1.5rem; }
  .ep-field  { display: flex; flex-direction: column; gap: 0.5rem; }
  .ep-field--half { max-width: 240px; }

  .ep-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .ep-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }
  .ep-required { color: var(--red); margin-left: 2px; }
  .ep-sub-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 0.375rem;
  }

  /* ── Inputs ── */
  .ep-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    background: #fff;
    border: 1px solid var(--paper-rule);
    border-bottom: 2px solid var(--paper-rule);
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s;
    appearance: none;
  }
  .ep-input:focus {
    border-color: var(--paper-rule);
    border-bottom-color: var(--red);
  }
  .ep-input::placeholder { color: var(--ink-faint); }

  .ep-input-prefix-wrap { position: relative; }
  .ep-input-prefix {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: var(--ink-muted);
    pointer-events: none;
  }
  .ep-input--prefixed { padding-left: 1.75rem; }

  .ep-textarea {
    width: 100%;
    padding: 0.75rem 0.875rem;
    background: #fff;
    border: 1px solid var(--paper-rule);
    border-bottom: 2px solid var(--paper-rule);
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--ink);
    line-height: 1.7;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;
  }
  .ep-textarea:focus { border-bottom-color: var(--red); }
  .ep-textarea::placeholder { color: var(--ink-faint); }

  /* ── Select override ── */
  .ep-select-wrap { width: 100%; }
  .ep-select-trigger {
    width: 100% !important;
    padding: 0.625rem 0.875rem !important;
    background: #fff !important;
    border: 1px solid var(--paper-rule) !important;
    border-bottom: 2px solid var(--paper-rule) !important;
    border-radius: 0 !important;
    font-family: 'Source Serif 4', Georgia, serif !important;
    font-size: 0.9rem !important;
    font-weight: 300 !important;
    color: var(--ink) !important;
    height: auto !important;
    outline: none !important;
    transition: border-color 0.15s !important;
  }
  .ep-select-trigger:focus { border-bottom-color: var(--red) !important; }
  .ep-select-content {
    background: #fff !important;
    border: 1px solid var(--paper-rule) !important;
    border-radius: 0 !important;
    font-family: 'Source Serif 4', Georgia, serif !important;
    font-size: 0.875rem !important;
  }

  /* ── Suggestion pills (title quick-select) ── */
  .ep-suggestions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.5rem;
  }
  .ep-suggestions-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-right: 0.25rem;
  }
  .ep-suggestion-pill {
    padding: 0.2rem 0.625rem;
    border: 1px solid var(--paper-rule);
    background: var(--paper-dark);
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.78rem;
    color: var(--ink-soft);
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .ep-suggestion-pill:hover { border-color: var(--ink-muted); color: var(--ink); }
  .ep-suggestion-pill--active { border-color: var(--red); color: var(--red); background: #fff; }

  /* ── Tag grid (skills / certs / languages) ── */
  .ep-tag-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .ep-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.75rem;
    border: 1px solid var(--paper-rule);
    background: var(--paper-dark);
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.15s;
  }
  .ep-tag:hover { border-color: var(--ink-muted); color: var(--ink); }
  .ep-tag--on {
    background: var(--night);
    border-color: var(--night);
    color: var(--gold-light);
  }

  /* ── Custom add row ── */
  .ep-custom-input-row {
    display: flex;
    gap: 0.625rem;
  }
  .ep-add-btn {
    padding: 0 1.25rem;
    background: var(--night);
    color: var(--gold-light);
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .ep-add-btn:hover { background: var(--red); color: #fff; }

  /* ── Chips (selected items) ── */
  .ep-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--paper-dark);
    border: 1px solid var(--paper-rule);
    border-left: 3px solid var(--paper-rule);
  }
  .ep-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 0.78rem;
    font-weight: 400;
  }
  .ep-chip--skill { background: #fff; border: 1px solid var(--ink); color: var(--ink); }
  .ep-chip--cert  { background: var(--night); border: 1px solid rgba(255,255,255,0.08); color: var(--gold-light); }
  .ep-chip--lang  { background: #fff; border: 1px solid var(--paper-rule); color: var(--ink-soft); font-style: italic; }
  .ep-chip-remove {
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer;
    color: inherit; opacity: 0.5; padding: 0;
    transition: opacity 0.15s;
  }
  .ep-chip-remove:hover { opacity: 1; }

  /* ── Action bar ── */
  .ep-actions {
    padding: 3rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .ep-actions-primary { display: flex; gap: 0.875rem; }

  /* Buttons */
  .ep-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
  }
  .ep-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .ep-btn-spinner { animation: spin 1s linear infinite; }

  .ep-btn--ghost {
    background: transparent;
    border: 1px solid var(--paper-rule);
    color: var(--ink-muted);
    flex: 1;
  }
  .ep-btn--ghost:hover { border-color: var(--ink-muted); color: var(--ink); }

  .ep-btn--primary {
    background: var(--night);
    color: var(--gold-light);
    flex: 2;
  }
  .ep-btn--primary:not(:disabled):hover { background: var(--red); color: #fff; }

  .ep-btn--delete {
    background: transparent;
    border: 1px solid rgba(139,26,26,0.3);
    color: var(--red);
    width: 100%;
    font-size: 0.65rem;
  }
  .ep-btn--delete:hover { background: var(--red); color: #fff; border-color: var(--red); }

  /* Delete confirm box */
  .ep-delete-confirm {
    padding: 1.25rem;
    background: #fff;
    border: 1px solid rgba(139,26,26,0.2);
    border-left: 3px solid var(--red);
  }
  .ep-delete-confirm-rule {
    height: 1px;
    background: rgba(139,26,26,0.15);
    margin-bottom: 1rem;
  }
  .ep-delete-confirm-text {
    font-size: 0.85rem;
    color: var(--ink-soft);
    line-height: 1.65;
    margin-bottom: 1rem;
    font-style: italic;
  }
  .ep-delete-confirm-actions { display: flex; gap: 0.75rem; }
  .ep-btn--delete-confirm {
    background: var(--red);
    color: #fff;
    flex: 1;
  }
  .ep-btn--delete-confirm:not(:disabled):hover { background: var(--red-light, #b22222); }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .ep-masthead { padding: 1.75rem 1.25rem; flex-direction: column; gap: 1rem; }
    .ep-body     { padding: 0 1.25rem; }
    .ep-field-row { grid-template-columns: 1fr; }
    .ep-field--half { max-width: 100%; }
    .ep-actions-primary { flex-direction: column; }
  }
`