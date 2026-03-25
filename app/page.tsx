"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  Shield, Star, Users, Clock, FileText,
  ChevronRight, Mail, Phone, MapPin,
  BookOpen, Calculator, Briefcase,
  CheckSquare, Scale
} from "lucide-react"

export default function Home() {
  const [activeSection, setActiveSection] = useState("about")
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = ["about", "services", "how-it-works", "why-us", "contact"]
    const handleScroll = () => {
      const scrollY = window.scrollY
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && scrollY >= el.offsetTop - 80) setActiveSection(id)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <style>{css}</style>
      <div className="cm-page" ref={mainRef}>

        {/* ── HERO / ABOUT ── */}
        <section id="about" className="cm-section cm-hero-section">
          <div className="cm-newspaper-header">
            <div className="cm-edition-bar">
              <span>Platform Guide</span>
              <span className="cm-edition-sep">·</span>
              <span>All You Need to Know</span>
              <span className="cm-edition-sep">·</span>
              <span>counselmate.in</span>
            </div>

            <div className="cm-hero-headline-wrap">
              <h1 className="cm-hero-headline">
                Find Verified<br />
                <em>Chartered Accountants</em><br />
                &amp; Lawyers — Instantly
              </h1>
              <div className="cm-hero-deck">
                CounselMate is India's trusted directory connecting individuals and businesses
                with verified legal and financial professionals. No middlemen. No hidden costs.
                Direct access to the expertise you need.
              </div>
            </div>

            <div className="cm-hero-rule-grid">
              <div className="cm-hero-rule" />
              <div className="cm-hero-columns">
                <div className="cm-hero-col">
                  <p>
                    Whether you need a Chartered Accountant to handle your GST filing, a Corporate
                    Lawyer to review your contracts, or a Tax Specialist to plan your investments —
                    CounselMate puts verified, credentialed professionals at your fingertips.
                  </p>
                  <p>
                    Every professional on our platform has been individually verified. We confirm
                    Bar Council registrations, ICAI memberships, and practice credentials before
                    any profile goes live.
                  </p>
                </div>
                <div className="cm-hero-col">
                  <p>
                    We built CounselMate because finding trustworthy legal and financial help in
                    India has historically meant relying on personal referrals or navigating
                    directories with outdated, unverified listings.
                  </p>
                  <p>
                    Our platform changes that. Browse by specialization, location, language, and
                    availability. Read verified client reviews. Book a consultation in minutes.
                  </p>
                </div>
              </div>
              <div className="cm-hero-rule" />
            </div>

            <div className="cm-stat-strip">
              {[
                { n: "5,000+",  l: "Verified Professionals" },
                { n: "50,000+", l: "Consultations Completed" },
                { n: "4.9 / 5", l: "Average Client Rating" },
                { n: "100%",    l: "Credential Verified" },
              ].map(s => (
                <div key={s.l} className="cm-stat-strip-item">
                  <div className="cm-stat-strip-num">{s.n}</div>
                  <div className="cm-stat-strip-label">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" className="cm-section">
          <div className="cm-section-header">
            <div className="cm-section-num">§ 01</div>
            <h2 className="cm-section-title">Our Services</h2>
            <div className="cm-section-rule" />
          </div>

          <div className="cm-section-intro">
            CounselMate hosts professionals across two primary domains — legal services and financial
            advisory. Below is a complete overview of what you can find on our platform.
          </div>

          <div className="cm-services-grid">
            <ServiceBlock
              icon={<Scale size={20} />}
              title="Legal Services"
              items={[
                ["Corporate Law",       "M&A transactions, shareholder agreements, corporate governance, due diligence."],
                ["Contract Review",     "Drafting, reviewing, and negotiating all forms of commercial and personal contracts."],
                ["Real Estate Law",     "Property transactions, title verification, lease agreements, development disputes."],
                ["Labour & Employment", "Employment contracts, termination, compliance with labour statutes."],
                ["IP & Patents",        "Trademark registration, patent filing, copyright protection, IP enforcement."],
                ["Startup & Venture",   "Incorporation, ESOP structuring, investor agreements, regulatory compliance."],
                ["Litigation Support",  "Civil and commercial litigation, arbitration, and dispute resolution."],
              ]}
            />
            <ServiceBlock
              icon={<Calculator size={20} />}
              title="Financial & CA Services"
              items={[
                ["GST & Indirect Tax",   "Return filing, input tax credit reconciliation, GST audit, registration."],
                ["Income Tax Advisory",  "Tax planning, ITR filing, scrutiny assessment, appeals and rectification."],
                ["Company Audit",        "Statutory audit, internal audit, tax audit, limited review engagements."],
                ["Financial Planning",   "Investment advisory, retirement planning, wealth structuring."],
                ["FEMA & International", "Foreign exchange compliance, DTAA advisory, overseas investment structuring."],
                ["Business Valuation",   "Valuation for funding, M&A, ESOPs, and regulatory purposes."],
                ["Compliance & MCA",     "Company law compliance, MCA filings, annual returns, secretarial services."],
              ]}
            />
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="cm-section cm-dark-section">
          <div className="cm-section-header dark">
            <div className="cm-section-num">§ 02</div>
            <h2 className="cm-section-title">How It Works</h2>
            <div className="cm-section-rule dark" />
          </div>

          <div className="cm-section-intro dark">
            From your first visit to a completed consultation, the entire process is designed to
            be clear, secure, and efficient. Here is a step-by-step account of what to expect.
          </div>

          <div className="cm-steps-guide">
            {[
              {
                n: "Step One",   title: "Create Your Free Account",
                body: "Register as a Client (Apprentice) or a Professional. Registration is free. You will need a valid email address. Professionals will be prompted to submit credentials for verification after registration.",
                note: "Takes under 2 minutes.",
              },
              {
                n: "Step Two",   title: "Search the Directory",
                body: "Use our search to browse verified professionals by specialization, location, language, availability, and hourly rate. Each profile displays full credential information, client reviews, and published rates — no surprises.",
                note: "All listed professionals are verified.",
              },
              {
                n: "Step Three", title: "Review & Select",
                body: "Read detailed profiles including qualifications, Bar Council or ICAI registration numbers, areas of practice, and verified client reviews. Compare multiple professionals before making a decision.",
                note: "Reviews are verified — only paying clients can leave them.",
              },
              {
                n: "Step Four",  title: "Book a Consultation",
                body: "Select a time slot from the professional's published availability. Confirm your appointment. Payment is handled securely at the time of booking via UPI, card, or net banking.",
                note: "Cancellation terms are set by each professional.",
              },
              {
                n: "Step Five",  title: "Consult Securely",
                body: "Connect via our encrypted in-app messaging or video consultation. All communications are private, confidential, and protected. Attorney-client privilege is respected by design.",
                note: "Your data is never shared or sold.",
              },
            ].map((step, i) => (
              <div key={i} className="cm-step-row">
                <div className="cm-step-num-col">
                  <div className="cm-step-num">{step.n}</div>
                </div>
                <div className="cm-step-body-col">
                  <div className="cm-step-title">{step.title}</div>
                  <div className="cm-step-body">{step.body}</div>
                  <div className="cm-step-note">
                    <CheckSquare size={12} /> {step.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY US ── */}
        <section id="why-us" className="cm-section">
          <div className="cm-section-header">
            <div className="cm-section-num">§ 03</div>
            <h2 className="cm-section-title">Why Choose CounselMate</h2>
            <div className="cm-section-rule" />
          </div>

          <div className="cm-section-intro">
            There are many ways to find legal and financial help in India. Here is an honest
            account of what makes CounselMate different, and why thousands of clients trust us.
          </div>

          <div className="cm-reasons">
            {[
              {
                icon: <Shield size={18} />,
                title: "Rigorous Verification",
                body: "We do not allow self-declaration. Every professional's credentials are manually verified before their profile is published. Bar Council registrations are cross-checked. ICAI memberships are confirmed.",
              },
              {
                icon: <Star size={18} />,
                title: "Honest, Verified Reviews",
                body: "Reviews can only be left by clients who completed a paid consultation. No anonymous reviews, paid placement, or review manipulation. What you read is what real clients experienced.",
              },
              {
                icon: <Clock size={18} />,
                title: "Transparent Pricing",
                body: "Every professional publishes their hourly rate. There are no hidden platform fees charged to clients. The rate you see is the rate you pay.",
              },
              {
                icon: <FileText size={18} />,
                title: "No Middlemen",
                body: "When you book through CounselMate, you are booking directly with the professional. The professional-client relationship is direct, private, and protected by professional privilege laws.",
              },
              {
                icon: <BookOpen size={18} />,
                title: "Wide Range of Expertise",
                body: "Our directory covers the full breadth of legal and financial services — from startup incorporation to property law, from GST compliance to international tax.",
              },
              {
                icon: <Users size={18} />,
                title: "Built for India",
                body: "CounselMate is built specifically for the Indian legal and financial landscape. Professionals are licensed under Indian law and available in multiple Indian languages.",
              },
            ].map((r, i) => (
              <div key={i} className="cm-reason">
                <div className="cm-reason-icon">{r.icon}</div>
                <div className="cm-reason-title">{r.title}</div>
                <div className="cm-reason-body">{r.body}</div>
              </div>
            ))}
          </div>

          <div className="cm-pull-quote">
            <div className="cm-pull-quote-rule" />
            <blockquote className="cm-pull-quote-text">
              "We built CounselMate because every Indian deserves access to qualified,
              trustworthy legal and financial counsel — not just those with the right connections."
            </blockquote>
            <div className="cm-pull-quote-attr">— CounselMate Founders</div>
            <div className="cm-pull-quote-rule" />
          </div>
        </section>

        {/* ── FOR PROFESSIONALS ── */}
        <section className="cm-section cm-pro-section">
          <div className="cm-section-header">
            <div className="cm-section-num">§ 04</div>
            <h2 className="cm-section-title">For Professionals</h2>
            <div className="cm-section-rule" />
          </div>
          <div className="cm-pro-columns">
            <div className="cm-pro-col-text">
              <p>
                If you are a Chartered Accountant, Lawyer, Advocate, or run a legal or CA firm,
                CounselMate offers a direct channel to clients who are actively looking for your expertise.
              </p>
              <p>
                Your profile will display your verified credentials, areas of practice, published rates,
                and client reviews. You control your availability and set your own consultation rates.
              </p>
              <p>
                There are no referral fees. No commission on consultations. You receive the full
                amount clients pay for your time.
              </p>
              <div className="cm-pro-checklist">
                {[
                  "Verified badge displayed on your profile",
                  "Set your own hourly consultation rate",
                  "Manage your availability calendar",
                  "Receive encrypted client messages",
                  "Build a verified review history",
                  "No commission on consultations",
                ].map(item => (
                  <div key={item} className="cm-pro-check-item">
                    <ChevronRight size={13} className="cm-pro-check-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cm-pro-col-cta">
              <div className="cm-pro-cta-box">
                <div className="cm-pro-cta-title">Ready to join?</div>
                <div className="cm-pro-cta-body">
                  Registration is free. After completing your profile, our team will verify
                  your credentials within 2–3 business days.
                </div>
                <Link href="/auth/register?role=PROFESSIONAL" className="cm-pro-cta-btn">
                  Register as a Professional
                  <ChevronRight size={15} />
                </Link>
                <div className="cm-pro-cta-note">
                  Already registered?{" "}
                  <Link href="/auth/login" className="cm-pro-cta-link">Sign in to your account</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="cm-section cm-dark-section">
          <div className="cm-section-header dark">
            <div className="cm-section-num">§ 05</div>
            <h2 className="cm-section-title">Contact &amp; Support</h2>
            <div className="cm-section-rule dark" />
          </div>

          <div className="cm-contact-grid">
            <div className="cm-contact-col">
              <div className="cm-contact-block-title">Get in Touch</div>
              <p className="cm-contact-body">
                For questions about the platform, help finding a professional, or support with
                your account, our team is available Monday through Saturday, 9 AM to 6 PM IST.
              </p>
              <div className="cm-contact-items">
                <div className="cm-contact-item"><Mail size={14} /> support@counselmate.in</div>
                <div className="cm-contact-item"><Phone size={14} /> +91 98765 43210</div>
                <div className="cm-contact-item"><MapPin size={14} /> New Delhi, India</div>
              </div>
            </div>
            <div className="cm-contact-col">
              <div className="cm-contact-block-title">For Professionals</div>
              <p className="cm-contact-body">
                If you are a CA or Lawyer looking to list your services, or have questions
                about credential verification, our professional onboarding team can assist.
              </p>
              <div className="cm-contact-items">
                <div className="cm-contact-item"><Mail size={14} /> professionals@counselmate.in</div>
                <div className="cm-contact-item"><Clock size={14} /> Verification: 2–3 business days</div>
              </div>
            </div>
            <div className="cm-contact-col">
              <div className="cm-contact-block-title">Quick Links</div>
              <div className="cm-contact-links">
                <Link href="/professionals"              className="cm-contact-link">Browse Professionals →</Link>
                <Link href="/auth/register?role=APPRENTICE"   className="cm-contact-link">Register as Client →</Link>
                <Link href="/auth/register?role=PROFESSIONAL" className="cm-contact-link">Register as Professional →</Link>
                <Link href="/jobs"                       className="cm-contact-link">Job Board →</Link>
                <Link href="/auth/login"                 className="cm-contact-link">Sign In →</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function ServiceBlock({ icon, title, items }: {
  icon: React.ReactNode
  title: string
  items: [string, string][]
}) {
  return (
    <div className="cm-service-block">
      <div className="cm-service-block-title">{icon} {title}</div>
      <div className="cm-service-items">
        {items.map(([name, desc]) => (
          <div key={name} className="cm-service-item">
            <div className="cm-service-item-name">{name}</div>
            <div className="cm-service-item-desc">{desc}</div>
          </div>
        ))}
      </div>
    </div>
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

  .cm-page {
    background: var(--paper);
    font-family: 'Source Serif 4', Georgia, serif;
    color: var(--ink);
    min-height: 100vh;
  }

  /* ── SECTIONS ── */
  .cm-section {
    padding: 4rem 5%;
    border-bottom: 1px solid var(--paper-rule);
  }
  .cm-dark-section {
    background: var(--night);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .cm-section-header {
    display: flex; align-items: baseline; gap: 1rem;
    margin-bottom: 1.75rem;
  }
  .cm-section-num {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; color: var(--ink-faint);
    flex-shrink: 0; letter-spacing: 0.06em;
  }
  .cm-section-header.dark .cm-section-num { color: rgba(255,255,255,0.25); }
  .cm-section-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    font-weight: 700; color: var(--ink); flex: 1;
  }
  .cm-dark-section .cm-section-title { color: #fff; }
  .cm-section-rule {
    flex: 1; height: 1px; background: var(--paper-rule); align-self: center;
  }
  .cm-section-rule.dark { background: rgba(255,255,255,0.08); }

  .cm-section-intro {
    font-size: 1rem; color: var(--ink-soft); line-height: 1.75;
    max-width: 680px; border-left: 3px solid var(--paper-rule);
    padding-left: 1.25rem; margin-bottom: 3rem; font-style: italic;
  }
  .cm-section-intro.dark { color: rgba(255,255,255,0.45); border-left-color: rgba(255,255,255,0.1); }

  /* ── HERO ── */
  .cm-edition-bar {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-faint);
    padding-bottom: 0.75rem; border-bottom: 1px solid var(--paper-rule);
    margin-bottom: 2rem; flex-wrap: wrap;
  }
  .cm-edition-sep { opacity: 0.3; }

  .cm-hero-headline-wrap { margin-bottom: 2.5rem; }
  .cm-hero-headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 4.5rem);
    font-weight: 700; line-height: 1.05; color: var(--ink); margin-bottom: 1.25rem;
  }
  .cm-hero-headline em { font-style: italic; color: var(--red); }
  .cm-hero-deck {
    font-size: 1.1rem; color: var(--ink-soft); max-width: 680px; line-height: 1.7;
    border-top: 2px solid var(--ink); border-bottom: 1px solid var(--paper-rule);
    padding: 0.875rem 0; font-weight: 300;
  }

  .cm-hero-rule-grid { margin: 2.5rem 0; }
  .cm-hero-rule { height: 1px; background: var(--paper-rule); }
  .cm-hero-columns {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; padding: 1.75rem 0;
  }
  .cm-hero-col {
    display: flex; flex-direction: column; gap: 1rem;
    font-size: 0.95rem; color: var(--ink-soft); line-height: 1.8; font-weight: 300;
  }

  .cm-stat-strip {
    display: grid; grid-template-columns: repeat(4, 1fr);
    border: 1px solid var(--paper-rule); margin-top: 2.5rem;
  }
  .cm-stat-strip-item {
    padding: 1.25rem 1.5rem; border-right: 1px solid var(--paper-rule); text-align: center;
  }
  .cm-stat-strip-item:last-child { border-right: none; }
  .cm-stat-strip-num {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.6rem; font-weight: 700; color: var(--red); margin-bottom: 0.25rem;
  }
  .cm-stat-strip-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-muted);
  }

  /* ── SERVICES ── */
  .cm-services-grid {
    display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--paper-rule);
  }
  .cm-service-block { padding: 2rem; border-right: 1px solid var(--paper-rule); }
  .cm-service-block:last-child { border-right: none; }
  .cm-service-block-title {
    display: flex; align-items: center; gap: 0.6rem;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.15rem; font-weight: 700; color: var(--ink);
    padding-bottom: 1rem; border-bottom: 2px solid var(--ink); margin-bottom: 1.25rem;
  }
  .cm-service-item { padding: 0.875rem 0; border-bottom: 1px solid var(--paper-rule); }
  .cm-service-item:last-child { border-bottom: none; }
  .cm-service-item-name { font-size: 0.9rem; font-weight: 600; color: var(--ink); margin-bottom: 0.2rem; }
  .cm-service-item-desc { font-size: 0.82rem; color: var(--ink-muted); line-height: 1.55; font-weight: 300; }

  /* ── STEPS ── */
  .cm-steps-guide { display: flex; flex-direction: column; }
  .cm-step-row {
    display: grid; grid-template-columns: 160px 1fr; gap: 2rem;
    padding: 1.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .cm-step-row:last-child { border-bottom: none; }
  .cm-step-num {
    font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--gold); display: inline-block;
    padding: 0.2rem 0.6rem; border: 1px solid rgba(201,168,76,0.25); border-radius: 3px;
  }
  .cm-step-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.6rem;
  }
  .cm-step-body {
    font-size: 0.9rem; color: rgba(255,255,255,0.45); line-height: 1.75;
    font-weight: 300; margin-bottom: 0.75rem;
  }
  .cm-step-note {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-family: 'DM Mono', monospace; font-size: 0.65rem;
    color: var(--gold); letter-spacing: 0.06em;
  }

  /* ── WHY US ── */
  .cm-reasons {
    display: grid; grid-template-columns: 1fr 1fr;
    border: 1px solid var(--paper-rule); margin-bottom: 3rem;
  }
  .cm-reason {
    padding: 1.75rem 2rem;
    border-right: 1px solid var(--paper-rule);
    border-bottom: 1px solid var(--paper-rule);
  }
  .cm-reason:nth-child(even) { border-right: none; }
  .cm-reason:nth-last-child(-n+2) { border-bottom: none; }
  .cm-reason-icon {
    width: 36px; height: 36px; border-radius: 4px;
    background: var(--paper-dark); color: var(--red);
    display: flex; align-items: center; justify-content: center; margin-bottom: 0.875rem;
  }
  .cm-reason-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1rem; font-weight: 700; color: var(--ink); margin-bottom: 0.5rem;
  }
  .cm-reason-body { font-size: 0.85rem; color: var(--ink-soft); line-height: 1.75; font-weight: 300; }

  .cm-pull-quote { text-align: center; padding: 2rem 10%; }
  .cm-pull-quote-rule { height: 1px; background: var(--paper-rule); margin: 1rem 0; }
  .cm-pull-quote-text {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.25rem; font-style: italic; color: var(--ink-soft); line-height: 1.6;
    margin: 1rem 0 0.5rem;
  }
  .cm-pull-quote-attr {
    font-family: 'DM Mono', monospace; font-size: 0.65rem;
    color: var(--ink-faint); letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* ── FOR PROFESSIONALS ── */
  .cm-pro-section { background: var(--paper-dark); }
  .cm-pro-columns { display: grid; grid-template-columns: 1fr 340px; gap: 3rem; align-items: start; }
  .cm-pro-col-text p { font-size: 0.95rem; color: var(--ink-soft); line-height: 1.8; margin-bottom: 1rem; font-weight: 300; }
  .cm-pro-checklist {
    display: flex; flex-direction: column; gap: 0.5rem;
    margin-top: 1.25rem; border-top: 1px solid var(--paper-rule); padding-top: 1.25rem;
  }
  .cm-pro-check-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--ink-soft); }
  .cm-pro-check-icon { color: var(--red); flex-shrink: 0; }
  .cm-pro-cta-box { background: var(--night); border: 1px solid rgba(255,255,255,0.08); padding: 2rem; }
  .cm-pro-cta-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; }
  .cm-pro-cta-body { font-size: 0.85rem; color: rgba(255,255,255,0.4); line-height: 1.7; margin-bottom: 1.5rem; font-weight: 300; }
  .cm-pro-cta-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 0.875rem 1.1rem; background: var(--red); color: #fff;
    text-decoration: none; font-size: 0.875rem; font-weight: 600;
    border-radius: 4px; transition: background 0.2s; margin-bottom: 1rem;
  }
  .cm-pro-cta-btn:hover { background: var(--red-light); }
  .cm-pro-cta-note { font-size: 0.75rem; color: rgba(255,255,255,0.3); text-align: center; font-family: 'DM Mono', monospace; }
  .cm-pro-cta-link { color: var(--gold-light); text-decoration: none; }
  .cm-pro-cta-link:hover { text-decoration: underline; }

  /* ── CONTACT ── */
  .cm-contact-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3rem; }
  .cm-contact-block-title {
    font-family: 'Playfair Display', Georgia, serif; font-size: 1rem; font-weight: 700; color: #fff;
    margin-bottom: 0.875rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .cm-contact-body { font-size: 0.85rem; color: rgba(255,255,255,0.4); line-height: 1.75; margin-bottom: 1.25rem; font-weight: 300; }
  .cm-contact-items { display: flex; flex-direction: column; gap: 0.6rem; }
  .cm-contact-item {
    display: flex; align-items: center; gap: 0.6rem;
    font-family: 'DM Mono', monospace; font-size: 0.72rem; color: rgba(255,255,255,0.4);
  }
  .cm-contact-links { display: flex; flex-direction: column; gap: 0.5rem; }
  .cm-contact-link { font-size: 0.875rem; color: var(--gold-light); text-decoration: none; transition: color 0.15s; }
  .cm-contact-link:hover { color: #fff; }

  /* ── FOOTER ── */
  .cm-footer { background: var(--night); padding: 1.5rem 5%; }
  .cm-footer-rule { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 1rem; }
  .cm-footer-inner {
    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
    font-family: 'DM Mono', monospace; font-size: 0.62rem;
    color: rgba(255,255,255,0.2); letter-spacing: 0.06em;
  }
  .cm-footer-sep { opacity: 0.3; }

  /* ── RESPONSIVE ── */
  @media (max-width: 860px) {
    .cm-hero-columns    { grid-template-columns: 1fr; }
    .cm-stat-strip      { grid-template-columns: 1fr 1fr; }
    .cm-stat-strip-item:nth-child(2) { border-right: none; }
    .cm-stat-strip-item:nth-child(3) { border-top: 1px solid var(--paper-rule); border-right: 1px solid var(--paper-rule); }
    .cm-stat-strip-item:nth-child(4) { border-top: 1px solid var(--paper-rule); }
    .cm-services-grid   { grid-template-columns: 1fr; }
    .cm-service-block   { border-right: none; border-bottom: 1px solid var(--paper-rule); }
    .cm-service-block:last-child { border-bottom: none; }
    .cm-step-row        { grid-template-columns: 1fr; gap: 0.75rem; }
    .cm-reasons         { grid-template-columns: 1fr; }
    .cm-reason          { border-right: none !important; }
    .cm-pro-columns     { grid-template-columns: 1fr; }
    .cm-contact-grid    { grid-template-columns: 1fr; gap: 2rem; }
  }

  @media (max-width: 560px) {
    .cm-section { padding: 2.5rem 1.25rem; }
    .cm-hero-headline { font-size: 2rem; }
  }
`