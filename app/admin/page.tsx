"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { adminAPI, type LandingContent, type AdminReviewRequest } from "@/lib/api"
import type { User, VerificationDocument } from "@/lib/api/types"
import { toast } from "sonner"
import {
  Users, FileCheck, FileText, Save, Copy,
  CheckCircle2, XCircle, ExternalLink, Trash2,
  ChevronDown, ChevronUp, Eye
} from "lucide-react"

/* ─── defaults & types ─────────────────────────────── */

const defaultLandingContent: LandingContent = {
  id: 1,
  hero_headline_line1: "Find Verified",
  hero_headline_em: "Chartered Accountants",
  hero_headline_line3: "& Lawyers — Instantly",
  hero_deck: "CounselMate is India's trusted directory connecting individuals and businesses with verified legal and financial professionals. No middlemen. No hidden costs. Direct access to the expertise you need.",
  hero_col1_paragraph1: "Whether you need a Chartered Accountant to handle your GST filing, a Corporate Lawyer to review your contracts, or a Tax Specialist to plan your investments — CounselMate puts verified, credentialed professionals at your fingertips.",
  hero_col1_paragraph2: "Every professional on our platform has been individually verified. We confirm Bar Council registrations, ICAI memberships, and practice credentials before any profile goes live.",
  hero_col2_paragraph1: "We built CounselMate because finding trustworthy legal and financial help in India has historically meant relying on personal referrals or navigating directories with outdated, unverified listings.",
  hero_col2_paragraph2: "Our platform changes that. Browse by specialization, location, language, and availability. Read verified client reviews. Book a consultation in minutes.",
  services_intro: "CounselMate hosts professionals across two primary domains — legal services and financial advisory. Below is a complete overview of what you can find on our platform.",
  how_it_works_intro: "From your first visit to a completed consultation, the entire process is designed to be clear, secure, and efficient. Here is a step-by-step account of what to expect.",
  why_us_intro: "There are many ways to find legal and financial help in India. Here is an honest account of what makes CounselMate different, and why thousands of clients trust us.",
  content_map: {},
  updated_at: "",
}

type LandingContentTextField =
  | "hero_headline_line1" | "hero_headline_em" | "hero_headline_line3"
  | "hero_deck" | "hero_col1_paragraph1" | "hero_col1_paragraph2"
  | "hero_col2_paragraph1" | "hero_col2_paragraph2"
  | "services_intro" | "how_it_works_intro" | "why_us_intro"

const landingKeyReference = [
  {
    title: "Top Bar + Hero Stats",
    items: [
      { keyName: "edition.platform_guide", description: "Top bar label 1" },
      { keyName: "edition.all_you_need",   description: "Top bar label 2" },
      { keyName: "edition.domain",         description: "Top bar domain" },
      { keyName: "stats.verified.number",  description: "Stat card number" },
      { keyName: "stats.verified.label",   description: "Stat card label" },
      { keyName: "stats.consults.number",  description: "Stat card number" },
      { keyName: "stats.consults.label",   description: "Stat card label" },
      { keyName: "stats.rating.number",    description: "Stat card number" },
      { keyName: "stats.rating.label",     description: "Stat card label" },
      { keyName: "stats.credential.number",description: "Stat card number" },
      { keyName: "stats.credential.label", description: "Stat card label" },
    ],
  },
  {
    title: "Section Titles",
    items: [
      { keyName: "sections.services.title",     description: "Services heading" },
      { keyName: "sections.how_it_works.title", description: "How it works heading" },
      { keyName: "sections.why_us.title",       description: "Why choose heading" },
      { keyName: "sections.for_pro.title",      description: "For professionals heading" },
      { keyName: "sections.contact.title",      description: "Contact heading" },
    ],
  },
  {
    title: "Services + Steps",
    items: [
      { keyName: "services.legal.title",          description: "Legal block title" },
      { keyName: "services.financial.title",      description: "Financial block title" },
      { keyName: "services.legal.{0..6}.name",    description: "Legal item name" },
      { keyName: "services.legal.{0..6}.desc",    description: "Legal item description" },
      { keyName: "services.financial.{0..6}.name",description: "Financial item name" },
      { keyName: "services.financial.{0..6}.desc",description: "Financial item desc" },
      { keyName: "steps.{0..4}.badge",            description: "Step badge" },
      { keyName: "steps.{0..4}.title",            description: "Step title" },
      { keyName: "steps.{0..4}.body",             description: "Step body" },
      { keyName: "steps.{0..4}.note",             description: "Step note" },
    ],
  },
  {
    title: "Why Us + Professional + Contact + Footer",
    items: [
      { keyName: "why.{0..5}.title",                    description: "Why-us title" },
      { keyName: "why.{0..5}.body",                     description: "Why-us body" },
      { keyName: "why.quote.text",                      description: "Quote text" },
      { keyName: "why.quote.attr",                      description: "Quote author" },
      { keyName: "pro.p1",                              description: "Pro paragraph 1" },
      { keyName: "pro.p2",                              description: "Pro paragraph 2" },
      { keyName: "pro.p3",                              description: "Pro paragraph 3" },
      { keyName: "pro.check.{0..5}",                    description: "Checklist item" },
      { keyName: "pro.cta.title",                       description: "CTA title" },
      { keyName: "pro.cta.body",                        description: "CTA body" },
      { keyName: "pro.cta.button",                      description: "CTA button text" },
      { keyName: "contact.block1.title",                description: "Contact col 1 title" },
      { keyName: "contact.block1.body",                 description: "Contact col 1 body" },
      { keyName: "contact.block1.email",                description: "Support email" },
      { keyName: "contact.block1.phone",                description: "Support phone" },
      { keyName: "contact.block1.location",             description: "Support location" },
      { keyName: "contact.block2.email",                description: "Pro support email" },
      { keyName: "contact.block2.verification",         description: "Verification SLA" },
      { keyName: "footer.left",                         description: "Footer left text" },
      { keyName: "footer.center",                       description: "Footer center text" },
    ],
  },
]

/* ─── Page ─────────────────────────────────────────── */

export default function AdminPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  const [users, setUsers]                 = useState<User[]>([])
  const [documents, setDocuments]         = useState<VerificationDocument[]>([])
  const [loadingUsers, setLoadingUsers]   = useState(true)
  const [loadingDocs, setLoadingDocs]     = useState(true)
  const [landingContent, setLandingContent] = useState<LandingContent>(defaultLandingContent)
  const [contentMapJson, setContentMapJson] = useState("{}")
  const [savingContent, setSavingContent] = useState(false)
  const [processingId, setProcessingId]   = useState<string | null>(null)
  const [activeTab, setActiveTab]         = useState<"users" | "verification" | "landing">("users")
  const [expandedKeys, setExpandedKeys]   = useState<Record<string, boolean>>({})
  const [previewOpen, setPreviewOpen]     = useState(false)

  const pendingDocuments = useMemo(() => documents.filter(d => d.status === "PENDING"), [documents])

  const headlineFields: Array<{ field: LandingContentTextField; label: string }> = [
    { field: "hero_headline_line1", label: "Hero Line 1" },
    { field: "hero_headline_em",    label: "Hero Emphasis (italic, red)" },
    { field: "hero_headline_line3", label: "Hero Line 3" },
  ]

  const paragraphFields: Array<{ field: LandingContentTextField; label: string }> = [
    { field: "hero_deck",             label: "Hero Deck" },
    { field: "hero_col1_paragraph1",  label: "Column 1 · Paragraph 1" },
    { field: "hero_col1_paragraph2",  label: "Column 1 · Paragraph 2" },
    { field: "hero_col2_paragraph1",  label: "Column 2 · Paragraph 1" },
    { field: "hero_col2_paragraph2",  label: "Column 2 · Paragraph 2" },
    { field: "services_intro",        label: "Services Section Intro" },
    { field: "how_it_works_intro",    label: "How It Works Intro" },
    { field: "why_us_intro",          label: "Why Us Intro" },
  ]

  useEffect(() => {
    if (!loading && !isAuthenticated) { router.push("/auth/login"); return }
    if (!loading && user?.role !== "ADMIN") { toast.error("Admin access required"); router.push("/dashboard"); return }
  }, [isAuthenticated, loading, router, user?.role])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") return
    const load = async () => {
      try {
        setLoadingUsers(true); setLoadingDocs(true)
        const [userData, verificationData, contentData] = await Promise.all([
          adminAPI.listUsers(1, 50),
          adminAPI.listAllVerifications(1, 100),
          adminAPI.getLandingContent(),
        ])
        setUsers(userData.users || [])
        setDocuments(verificationData.documents || [])
        const merged = { ...defaultLandingContent, ...(contentData.content || {}) }
        setLandingContent(merged)
        setContentMapJson(JSON.stringify(merged.content_map || {}, null, 2))
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load admin data")
      } finally {
        setLoadingUsers(false); setLoadingDocs(false)
      }
    }
    load()
  }, [isAuthenticated, user?.role])

  const removeUser = async (id: string) => {
    try {
      await adminAPI.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success("User deleted")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user")
    }
  }

  const reviewDocument = async (id: string, payload: AdminReviewRequest) => {
    try {
      setProcessingId(id)
      const result = await adminAPI.reviewVerification(id, payload)
      setDocuments(prev => prev.map(d => d.id === id ? result.document : d))
      toast.success(result.message || "Verification updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to review document")
    } finally {
      setProcessingId(null)
    }
  }

  const saveLandingContent = async () => {
    try {
      setSavingContent(true)
      let parsedMap: Record<string, string> = {}
      try { parsedMap = JSON.parse(contentMapJson || "{}") }
      catch { toast.error("Invalid JSON — fix syntax before saving"); setSavingContent(false); return }
      const result = await adminAPI.updateLandingContent({ ...landingContent, content_map: parsedMap })
      setLandingContent(result.content)
      setContentMapJson(JSON.stringify(result.content.content_map || {}, null, 2))
      toast.success("Landing content saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSavingContent(false)
    }
  }

  const copyKey = async (key: string) => {
    try { await navigator.clipboard.writeText(key); toast.success(`Copied: ${key}`) }
    catch { toast.error("Failed to copy") }
  }

  const toggleSection = (title: string) => setExpandedKeys(p => ({ ...p, [title]: !p[title] }))

  if (loading || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <>
        <style>{css}</style>
        <div className="adm-loading">Loading admin panel…</div>
      </>
    )
  }

  const tabs = [
    { id: "users"        as const, label: "Users",        icon: <Users size={14} />,     badge: users.length },
    { id: "verification" as const, label: "Verification", icon: <FileCheck size={14} />, badge: pendingDocuments.length, warn: pendingDocuments.length > 0 },
    { id: "landing"      as const, label: "Landing Copy", icon: <FileText size={14} /> },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="adm-root">

        {/* ── Page header ── */}
        <header className="adm-header">
          <div className="adm-header-inner">
            <div>
              <div className="adm-eyebrow">Administration</div>
              <h1 className="adm-headline">Admin Panel</h1>
              <p className="adm-sub">Manage users, credential verification, and landing page copy.</p>
            </div>
            <div className="adm-header-stat">
              <span className="adm-stat-num">{users.length}</span>
              <span className="adm-stat-label">total users</span>
            </div>
          </div>
        </header>

        {/* ── Tab bar ── */}
        <div className="adm-tabbar">
          <div className="adm-tabbar-inner">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`adm-tab${activeTab === tab.id ? " active" : ""}${tab.warn ? " warn" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && (
                  <span className={`adm-tab-badge${tab.warn ? " warn" : ""}`}>{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <main className="adm-main">

          {/* ════ USERS ════ */}
          {activeTab === "users" && (
            <section className="adm-section">
              <div className="adm-section-head">
                <div className="adm-section-label">User Management</div>
                <h2 className="adm-section-title">Registered Users</h2>
              </div>

              {loadingUsers ? (
                <div className="adm-skeleton-table">
                  {[...Array(5)].map((_, i) => <div key={i} className="adm-skel-row" />)}
                </div>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Auth</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td className="adm-td-name">
                            <div className="adm-user-avatar">
                              {u.profile_picture
                                ? <img src={u.profile_picture} alt="" className="adm-user-avatar-img" />
                                : <span>{(u.first_name?.[0] ?? '') + (u.last_name?.[0] ?? '')}</span>
                              }
                            </div>
                            <span>{`${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || '—'}</span>
                          </td>
                          <td className="adm-td-mono">{u.email}</td>
                          <td>
                            <span className={`adm-role-chip${u.role === 'PROFESSIONAL' ? ' pro' : u.role === 'ADMIN' ? ' admin' : ''}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span className={`adm-status-dot${u.is_verified ? ' ok' : ''}`} />
                            {u.is_verified ? 'Verified' : 'Unverified'}
                          </td>
                          <td className="adm-td-mono adm-td-muted">{u.auth_provider}</td>
                          <td>
                            {u.role !== 'ADMIN' && (
                              <button className="adm-delete-btn" onClick={() => removeUser(u.id)}>
                                <Trash2 size={13} /> Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ════ VERIFICATION ════ */}
          {activeTab === "verification" && (
            <section className="adm-section">
              <div className="adm-section-head">
                <div className="adm-section-label">Credential Review</div>
                <h2 className="adm-section-title">Verification Queue</h2>
                {pendingDocuments.length > 0 && (
                  <div className="adm-pending-badge">{pendingDocuments.length} pending</div>
                )}
              </div>

              {loadingDocs ? (
                <div className="adm-skeleton-table">
                  {[...Array(3)].map((_, i) => <div key={i} className="adm-skel-row tall" />)}
                </div>
              ) : documents.length === 0 ? (
                <div className="adm-empty">
                  <FileCheck size={28} className="adm-empty-icon" />
                  <div className="adm-empty-title">No verification records</div>
                  <div className="adm-empty-desc">All submissions have been reviewed.</div>
                </div>
              ) : (
                <div className="adm-doc-list">
                  {documents.map(doc => (
                    <div key={doc.id} className={`adm-doc-card${doc.status === 'APPROVED' ? ' approved' : doc.status === 'REJECTED' ? ' rejected' : ''}`}>
                      <div className="adm-doc-top">
                        <div>
                          <div className="adm-doc-type">{doc.document_type}</div>
                          <div className="adm-doc-uid">User ID: {doc.user_id}</div>
                        </div>
                        <span className={`adm-doc-status${doc.status === 'APPROVED' ? ' ok' : doc.status === 'REJECTED' ? ' fail' : ' pending'}`}>
                          {doc.status}
                        </span>
                      </div>

                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noreferrer" className="adm-doc-link">
                          <ExternalLink size={12} /> View submitted document
                        </a>
                      )}

                      {doc.status === 'PENDING' && (
                        <div className="adm-doc-actions">
                          <button
                            className="adm-approve-btn"
                            disabled={processingId === doc.id}
                            onClick={() => reviewDocument(doc.id, { status: 'APPROVED' })}
                          >
                            <CheckCircle2 size={13} />
                            {processingId === doc.id ? 'Processing…' : 'Approve'}
                          </button>
                          <button
                            className="adm-reject-btn"
                            disabled={processingId === doc.id}
                            onClick={() => reviewDocument(doc.id, { status: 'REJECTED', rejection_reason: 'Needs correction' })}
                          >
                            <XCircle size={13} />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ════ LANDING CONTENT ════ */}
          {activeTab === "landing" && (
            <section className="adm-section">
              <div className="adm-section-head">
                <div className="adm-section-label">Content Management</div>
                <h2 className="adm-section-title">Landing Page Editor</h2>
                <button
                  className="adm-save-btn"
                  onClick={saveLandingContent}
                  disabled={savingContent}
                >
                  <Save size={14} />
                  {savingContent ? 'Saving…' : 'Save Changes'}
                </button>
              </div>

              <div className="adm-landing-grid">

                {/* Left: fields */}
                <div className="adm-landing-fields">

                  {/* Headline fields */}
                  <div className="adm-field-group">
                    <div className="adm-field-group-title">Hero Headline</div>
                    {headlineFields.map(({ field, label }) => (
                      <div key={field} className="adm-field">
                        <label className="adm-field-label">{label}</label>
                        <input
                          className="adm-input"
                          value={landingContent[field] || ''}
                          onChange={e => setLandingContent(p => ({ ...p, [field]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Paragraph fields */}
                  <div className="adm-field-group">
                    <div className="adm-field-group-title">Paragraphs & Intros</div>
                    {paragraphFields.map(({ field, label }) => (
                      <div key={field} className="adm-field">
                        <label className="adm-field-label">{label}</label>
                        <textarea
                          className="adm-textarea"
                          rows={3}
                          value={landingContent[field] || ''}
                          onChange={e => setLandingContent(p => ({ ...p, [field]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>

                  {/* JSON editor */}
                  <div className="adm-field-group">
                    <div className="adm-field-group-title">Full Copy JSON</div>
                    <div className="adm-field">
                      <label className="adm-field-label">
                        content_map — complete page copy including footer, steps, and contact
                      </label>
                      <textarea
                        className="adm-textarea adm-mono"
                        rows={16}
                        value={contentMapJson}
                        onChange={e => setContentMapJson(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Key reference */}
                  <div className="adm-field-group">
                    <div className="adm-field-group-title">Key Reference</div>
                    <p className="adm-key-desc">Click any key to copy it to your clipboard.</p>
                    <div className="adm-key-sections">
                      {landingKeyReference.map(sec => (
                        <div key={sec.title} className="adm-key-section">
                          <button
                            className="adm-key-section-toggle"
                            onClick={() => toggleSection(sec.title)}
                          >
                            <span>{sec.title}</span>
                            {expandedKeys[sec.title] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                          {expandedKeys[sec.title] && (
                            <div className="adm-key-items">
                              {sec.items.map(item => (
                                <button
                                  key={item.keyName}
                                  className="adm-key-item"
                                  onClick={() => copyKey(item.keyName)}
                                >
                                  <code className="adm-key-code">{item.keyName}</code>
                                  <span className="adm-key-desc-inline">{item.description}</span>
                                  <Copy size={11} className="adm-key-copy-icon" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: preview */}
                <div className="adm-landing-preview">
                  <div className="adm-preview-head">
                    <div className="adm-section-label">Live Preview</div>
                    <button className="adm-preview-toggle" onClick={() => setPreviewOpen(p => !p)}>
                      <Eye size={13} /> {previewOpen ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  <div className={`adm-preview-body${previewOpen ? ' expanded' : ''}`}>
                    <div className="adm-preview-headline">
                      {landingContent.hero_headline_line1}<br />
                      <em>{landingContent.hero_headline_em}</em><br />
                      {landingContent.hero_headline_line3}
                    </div>
                    <div className="adm-preview-deck">{landingContent.hero_deck}</div>
                    <div className="adm-preview-cols">
                      <div>
                        <p>{landingContent.hero_col1_paragraph1}</p>
                        <p>{landingContent.hero_col1_paragraph2}</p>
                      </div>
                      <div>
                        <p>{landingContent.hero_col2_paragraph1}</p>
                        <p>{landingContent.hero_col2_paragraph2}</p>
                      </div>
                    </div>
                    {previewOpen && (
                      <div className="adm-preview-intros">
                        <div className="adm-preview-intro-row">
                          <span className="adm-preview-intro-label">Services</span>
                          <span>{landingContent.services_intro}</span>
                        </div>
                        <div className="adm-preview-intro-row">
                          <span className="adm-preview-intro-label">How It Works</span>
                          <span>{landingContent.how_it_works_intro}</span>
                        </div>
                        <div className="adm-preview-intro-row">
                          <span className="adm-preview-intro-label">Why Us</span>
                          <span>{landingContent.why_us_intro}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  )
}

/* ─── Styles ──────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

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
    --red: #8b1a1a;
  }

  .adm-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--ink);
  }

  .adm-loading {
    font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; justify-content: center;
    min-height: 60vh; font-size: 0.875rem; color: var(--ink-muted);
  }

  /* ── Header ── */
  .adm-header { background: var(--ink); padding: 0 1.5rem; }
  .adm-header-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 2.5rem 0 2.25rem;
    display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;
  }
  .adm-eyebrow {
    font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); font-weight: 500; margin-bottom: 0.3rem;
  }
  .adm-headline {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    color: #fff; line-height: 1.1; font-weight: 400;
  }
  .adm-sub {
    font-size: 0.875rem; color: rgba(255,255,255,0.4);
    font-weight: 300; margin-top: 0.3rem;
  }
  .adm-header-stat { text-align: right; flex-shrink: 0; }
  .adm-stat-num {
    display: block;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 2.8rem; color: #fff; line-height: 1;
  }
  .adm-stat-label {
    font-size: 0.68rem; color: rgba(255,255,255,0.3);
    text-transform: uppercase; letter-spacing: 0.08em;
    font-family: 'DM Mono', monospace;
  }

  /* ── Tab bar ── */
  .adm-tabbar {
    background: var(--surface);
    border-bottom: 1px solid var(--cream-dark);
    padding: 0 1.5rem;
    position: sticky; top: 0; z-index: 20;
  }
  .adm-tabbar-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; gap: 0;
  }
  .adm-tab {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.875rem 1.25rem;
    background: none; border: none; border-bottom: 2px solid transparent;
    font-size: 0.82rem; font-weight: 500; color: var(--ink-muted);
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    margin-bottom: -1px;
  }
  .adm-tab:hover { color: var(--ink); }
  .adm-tab.active { color: var(--ink); border-bottom-color: var(--ink); }
  .adm-tab.warn.active { border-bottom-color: #d97706; }
  .adm-tab-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; border-radius: 100px;
    background: var(--cream-dark); color: var(--ink-soft);
    font-size: 0.62rem; font-weight: 700; padding: 0 4px;
  }
  .adm-tab-badge.warn { background: #fef3c7; color: #b45309; }

  /* ── Main ── */
  .adm-main {
    max-width: 1100px; margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  /* ── Section ── */
  .adm-section {
    background: var(--surface);
    border: 1px solid var(--cream-dark);
    border-radius: 16px;
    overflow: hidden;
  }
  .adm-section-head {
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--cream-dark);
  }
  .adm-section-label {
    font-size: 0.68rem; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--gold); font-weight: 500;
  }
  .adm-section-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.4rem; color: var(--ink); font-weight: 400;
    flex: 1;
  }
  .adm-pending-badge {
    font-size: 0.72rem; font-weight: 700;
    padding: 0.25rem 0.75rem; border-radius: 100px;
    background: #fef3c7; color: #b45309;
    border: 1px solid #fde68a;
  }
  .adm-save-btn {
    display: inline-flex; align-items: center; gap: 0.45rem;
    background: var(--ink); color: #fff;
    border: none; border-radius: 9px;
    padding: 0.6rem 1.2rem; font-size: 0.82rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .adm-save-btn:hover:not(:disabled) { background: var(--blue-deep); transform: translateY(-1px); }
  .adm-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Users table ── */
  .adm-table-wrap { overflow-x: auto; }
  .adm-table {
    width: 100%; border-collapse: collapse;
    font-size: 0.85rem;
  }
  .adm-table thead tr {
    border-bottom: 1px solid var(--cream-dark);
  }
  .adm-table th {
    padding: 0.875rem 1.5rem;
    text-align: left;
    font-size: 0.68rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--ink-muted); font-weight: 500;
  }
  .adm-table tbody tr {
    border-bottom: 1px solid var(--cream-dark);
    transition: background 0.15s;
  }
  .adm-table tbody tr:last-child { border-bottom: none; }
  .adm-table tbody tr:hover { background: var(--cream); }
  .adm-table td { padding: 0.875rem 1.5rem; color: var(--ink-soft); vertical-align: middle; }
  .adm-td-name { display: flex; align-items: center; gap: 0.6rem; color: var(--ink) !important; font-weight: 500; }
  .adm-td-mono { font-family: 'DM Mono', monospace; font-size: 0.78rem; }
  .adm-td-muted { color: var(--ink-muted) !important; }

  .adm-user-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--ink); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 0.75rem; flex-shrink: 0; overflow: hidden;
  }
  .adm-user-avatar-img { width: 100%; height: 100%; object-fit: cover; }

  .adm-role-chip {
    display: inline-flex; align-items: center;
    padding: 0.2rem 0.65rem; border-radius: 100px;
    font-size: 0.68rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--cream); color: var(--ink-soft);
    border: 1px solid var(--cream-dark);
  }
  .adm-role-chip.pro   { background: rgba(201,168,76,0.1); color: #a07d28; border-color: rgba(201,168,76,0.3); }
  .adm-role-chip.admin { background: rgba(65,105,225,0.08); color: var(--blue-bright); border-color: rgba(65,105,225,0.2); }

  .adm-status-dot {
    display: inline-block; width: 7px; height: 7px; border-radius: 50%;
    background: var(--cream-dark); margin-right: 0.4rem; vertical-align: middle;
  }
  .adm-status-dot.ok { background: #22c55e; }

  .adm-delete-btn {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.75rem; font-weight: 500;
    padding: 0.3rem 0.7rem; border-radius: 7px;
    border: 1px solid rgba(185,28,28,0.2);
    background: transparent; color: #b91c1c;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, border-color 0.15s;
  }
  .adm-delete-btn:hover { background: #fef2f2; border-color: rgba(185,28,28,0.4); }

  /* ── Verification ── */
  .adm-doc-list { display: flex; flex-direction: column; gap: 0; }
  .adm-doc-card {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--cream-dark);
    display: flex; flex-direction: column; gap: 0.75rem;
    transition: background 0.15s;
  }
  .adm-doc-card:last-child { border-bottom: none; }
  .adm-doc-card:hover { background: #fafaf8; }
  .adm-doc-card.approved { background: #f0fdf4; }
  .adm-doc-card.rejected { background: #fef2f2; }

  .adm-doc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
  .adm-doc-type { font-size: 0.9rem; font-weight: 600; color: var(--ink); }
  .adm-doc-uid  { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--ink-muted); margin-top: 0.15rem; }

  .adm-doc-status {
    font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; padding: 0.25rem 0.7rem; border-radius: 100px;
    flex-shrink: 0;
  }
  .adm-doc-status.ok      { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
  .adm-doc-status.fail    { background: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; }
  .adm-doc-status.pending { background: #fefce8; color: #a16207; border: 1px solid #fde047; }

  .adm-doc-link {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.78rem; color: var(--blue-bright); text-decoration: none;
    transition: color 0.15s;
  }
  .adm-doc-link:hover { color: var(--blue-deep); }

  .adm-doc-actions { display: flex; gap: 0.5rem; }
  .adm-approve-btn, .adm-reject-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.5rem 1rem; border-radius: 8px;
    font-size: 0.8rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; border: none;
    transition: background 0.15s, transform 0.1s;
  }
  .adm-approve-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .adm-reject-btn:hover:not(:disabled)  { transform: translateY(-1px); }
  .adm-approve-btn { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
  .adm-reject-btn  { background: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; }
  .adm-approve-btn:disabled, .adm-reject-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Empty state ── */
  .adm-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 4rem 2rem; gap: 0.6rem; text-align: center;
  }
  .adm-empty-icon { color: var(--ink-muted); margin-bottom: 0.25rem; }
  .adm-empty-title { font-size: 0.95rem; font-weight: 600; color: var(--ink); }
  .adm-empty-desc  { font-size: 0.82rem; color: var(--ink-muted); font-weight: 300; }

  /* ── Landing editor ── */
  .adm-landing-grid {
    display: grid; grid-template-columns: 1fr 380px;
    gap: 0;
  }
  .adm-landing-fields {
    padding: 2rem;
    border-right: 1px solid var(--cream-dark);
    display: flex; flex-direction: column; gap: 1.75rem;
    overflow-y: auto;
  }
  .adm-field-group { display: flex; flex-direction: column; gap: 0.875rem; }
  .adm-field-group-title {
    font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--ink-muted); font-weight: 500; padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--cream-dark);
  }
  .adm-field { display: flex; flex-direction: column; gap: 0.35rem; }
  .adm-field-label {
    font-size: 0.72rem; font-weight: 600; color: var(--ink);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .adm-input, .adm-textarea {
    background: var(--cream); border: 1.5px solid var(--cream-dark);
    border-radius: 9px; padding: 0.6rem 0.875rem;
    font-size: 0.875rem; color: var(--ink);
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s, background 0.2s;
    resize: vertical;
  }
  .adm-input:focus, .adm-textarea:focus {
    border-color: var(--blue-bright); background: #fff;
  }
  .adm-mono { font-family: 'DM Mono', monospace; font-size: 0.78rem; }

  /* Key reference */
  .adm-key-desc { font-size: 0.78rem; color: var(--ink-muted); font-weight: 300; margin-bottom: 0.75rem; }
  .adm-key-sections { display: flex; flex-direction: column; gap: 0.35rem; }
  .adm-key-section { border: 1px solid var(--cream-dark); border-radius: 8px; overflow: hidden; }
  .adm-key-section-toggle {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 0.65rem 0.875rem;
    background: var(--cream); border: none; cursor: pointer;
    font-size: 0.78rem; font-weight: 500; color: var(--ink);
    font-family: 'DM Sans', sans-serif; transition: background 0.15s;
  }
  .adm-key-section-toggle:hover { background: var(--cream-dark); }
  .adm-key-items { display: flex; flex-direction: column; background: #fff; }
  .adm-key-item {
    display: flex; align-items: center; gap: 0.75rem;
    width: 100%; padding: 0.45rem 0.875rem;
    background: none; border: none; border-top: 1px solid var(--cream-dark);
    cursor: pointer; text-align: left; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .adm-key-item:hover { background: var(--cream); }
  .adm-key-code { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--blue-bright); flex: 1; }
  .adm-key-desc-inline { font-size: 0.72rem; color: var(--ink-muted); flex-shrink: 0; }
  .adm-key-copy-icon { color: var(--ink-muted); flex-shrink: 0; opacity: 0; }
  .adm-key-item:hover .adm-key-copy-icon { opacity: 1; }

  /* Preview */
  .adm-landing-preview { padding: 2rem; display: flex; flex-direction: column; gap: 1rem; }
  .adm-preview-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.25rem;
  }
  .adm-preview-toggle {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.72rem; color: var(--ink-muted);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: color 0.15s;
  }
  .adm-preview-toggle:hover { color: var(--ink); }
  .adm-preview-body {
    background: var(--cream);
    border: 1px solid var(--cream-dark);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex; flex-direction: column; gap: 1rem;
  }
  .adm-preview-headline {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.5rem; color: var(--ink); line-height: 1.15;
  }
  .adm-preview-headline em { font-style: italic; color: var(--red); }
  .adm-preview-deck {
    font-size: 0.82rem; color: var(--ink-soft); line-height: 1.6;
    border-top: 1.5px solid var(--ink);
    border-bottom: 1px solid var(--cream-dark);
    padding: 0.75rem 0; font-weight: 300;
  }
  .adm-preview-cols {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
    font-size: 0.78rem; color: var(--ink-soft); line-height: 1.65; font-weight: 300;
  }
  .adm-preview-cols p { margin-bottom: 0.5rem; }
  .adm-preview-intros { display: flex; flex-direction: column; gap: 0.875rem; border-top: 1px solid var(--cream-dark); padding-top: 1rem; }
  .adm-preview-intro-row { display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.78rem; color: var(--ink-soft); font-weight: 300; }
  .adm-preview-intro-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-muted); font-weight: 500; }

  /* Skeletons */
  .adm-skeleton-table { padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .adm-skel-row {
    height: 44px; border-radius: 8px;
    background: linear-gradient(90deg, #ede9e1 25%, #f5f2ec 50%, #ede9e1 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  .adm-skel-row.tall { height: 100px; }
  @keyframes shimmer { to { background-position: -200% 0; } }

  /* Responsive */
  @media (max-width: 900px) {
    .adm-landing-grid { grid-template-columns: 1fr; }
    .adm-landing-fields { border-right: none; border-bottom: 1px solid var(--cream-dark); }
    .adm-preview-cols { grid-template-columns: 1fr; }
    .adm-header-stat { display: none; }
  }
  @media (max-width: 600px) {
    .adm-table th:nth-child(4),
    .adm-table td:nth-child(4),
    .adm-table th:nth-child(5),
    .adm-table td:nth-child(5) { display: none; }
    .adm-section-head { flex-direction: column; align-items: flex-start; }
  }
`