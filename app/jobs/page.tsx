"use client"

import { useState, useMemo } from "react"
import { MapPin, Briefcase, IndianRupee, ArrowRight, Search, SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"

const jobs = [
  {
    id: 1,
    title: "Tax Consultant",
    company: "FinanceHub Inc",
    type: "Full-time",
    location: "Remote",
    salary: "₹60,000 – ₹80,000",
    salaryShort: "60–80k",
    desc: "Looking for an experienced CA for tax planning, advisory, and compliance management across multiple clients.",
    tags: ["GST", "Income Tax", "Audit"],
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Senior Lawyer – Corporate Law",
    company: "Legal Associates Ltd",
    type: "Full-time",
    location: "Delhi, India",
    salary: "₹80,000 – ₹1,20,000",
    salaryShort: "80k–1.2L",
    desc: "Seeking an experienced corporate lawyer to lead M&A transactions, contract negotiations, and due diligence.",
    tags: ["M&A", "Contracts", "Corporate"],
    posted: "5 days ago",
  },
  {
    id: 3,
    title: "Compliance Officer",
    company: "Tech Startup Co",
    type: "Contract",
    location: "Bangalore",
    salary: "₹50,000 – ₹70,000",
    salaryShort: "50–70k",
    desc: "Part-time compliance and regulatory advisory role. Ideal for a CA or lawyer with fintech exposure.",
    tags: ["Compliance", "Regulatory", "Fintech"],
    posted: "1 week ago",
  },
  {
    id: 4,
    title: "Legal Advisor – Real Estate",
    company: "PropTech Ventures",
    type: "Part-time",
    location: "Mumbai, India",
    salary: "₹40,000 – ₹60,000",
    salaryShort: "40–60k",
    desc: "Advisory role for property transactions, title verification, and development agreements.",
    tags: ["Real Estate", "Title Verification", "Contracts"],
    posted: "3 days ago",
  },
  {
    id: 5,
    title: "Startup Legal Counsel",
    company: "Founders Studio",
    type: "Contract",
    location: "Remote",
    salary: "₹70,000 – ₹90,000",
    salaryShort: "70–90k",
    desc: "Help early-stage startups with incorporation, equity agreements, ESOP plans, and investor term sheets.",
    tags: ["Startup Law", "ESOP", "Equity"],
    posted: "Just now",
  },
]

const TYPES = ["All", "Full-time", "Contract", "Part-time"]
const LOCATIONS = ["All", "Remote", "Delhi, India", "Bangalore", "Mumbai, India"]

export default function JobsPage() {
  const [search, setSearch] = useState("")
  const [jobType, setJobType] = useState("all")
  const [location, setLocation] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchSearch = !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      const matchType = jobType === "all" || j.type.toLowerCase() === jobType
      const matchLoc = location === "all" || j.location === location
      return matchSearch && matchType && matchLoc
    })
  }, [search, jobType, location])

  const activeFilters = (jobType !== "all" ? 1 : 0) + (location !== "all" ? 1 : 0)

  const clearFilters = () => { setJobType("all"); setLocation("all") }

  return (
    <>
      <style>{css}</style>
      <div className="jobs-root">

        {/* ── Header ── */}
        <header className="jobs-header">
          <div className="jobs-header-inner">
            <div>
              <div className="jobs-eyebrow">Job Board</div>
              <h1 className="jobs-headline">Find your next <em>opportunity</em></h1>
              <p className="jobs-sub">
                Curated roles for verified CAs, Lawyers, and compliance professionals.
              </p>
            </div>
            <div className="jobs-header-stat">
              <span className="jobs-stat-num">{jobs.length}</span>
              <span className="jobs-stat-label">open positions</span>
            </div>
          </div>
        </header>

        {/* ── Search bar ── */}
        <div className="jobs-search-bar">
          <div className="jobs-search-inner">
            <div className="jobs-search-input-wrap">
              <Search size={15} className="jobs-search-icon" />
              <input
                type="text"
                placeholder="Search by title, company, or skill…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="jobs-search-input"
              />
              {search && (
                <button className="jobs-search-clear" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              className={`jobs-filter-toggle${filterOpen ? " open" : ""}${activeFilters > 0 ? " active" : ""}`}
              onClick={() => setFilterOpen(v => !v)}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}
            </button>
          </div>

          {/* Inline filter panel */}
          {filterOpen && (
            <div className="jobs-filter-panel">
              <div className="jobs-filter-group">
                <div className="jobs-filter-label">Job Type</div>
                <div className="jobs-filter-chips">
                  {TYPES.map(t => (
                    <button
                      key={t}
                      className={`filter-chip${jobType === t.toLowerCase() ? " active" : ""}`}
                      onClick={() => setJobType(t.toLowerCase())}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="jobs-filter-group">
                <div className="jobs-filter-label">Location</div>
                <div className="jobs-filter-chips">
                  {LOCATIONS.map(l => (
                    <button
                      key={l}
                      className={`filter-chip${location === l.toLowerCase().replace(", india", " india") || location === l ? " active" : ""}`}
                      onClick={() => setLocation(l === "All" ? "all" : l)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilters > 0 && (
                <button className="jobs-clear-all" onClick={clearFilters}>
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Main ── */}
        <main className="jobs-main">

          {/* Result count */}
          <div className="jobs-result-meta">
            <span className="jobs-result-count">
              {filtered.length} {filtered.length === 1 ? "position" : "positions"}
              {search && <> matching <em>"{search}"</em></>}
            </span>
            {activeFilters > 0 && (
              <button className="jobs-clear-inline" onClick={clearFilters}>
                Clear filters <X size={12} />
              </button>
            )}
          </div>

          {/* Job list */}
          {filtered.length === 0 ? (
            <div className="jobs-empty">
              <div className="jobs-empty-icon">
                <Briefcase size={28} />
              </div>
              <div className="jobs-empty-title">No positions found</div>
              <div className="jobs-empty-desc">Try adjusting your search or filters.</div>
              <button className="jobs-empty-reset" onClick={() => { setSearch(""); clearFilters() }}>
                Reset all
              </button>
            </div>
          ) : (
            <div className="jobs-list">
              {filtered.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

function JobCard({ job, index }: { job: typeof jobs[0]; index: number }) {
  const typeColor = job.type === "Full-time"
    ? "type-full"
    : job.type === "Contract"
    ? "type-contract"
    : "type-part"

  return (
    <div className="job-card" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="job-card-top">
        {/* Company initial */}
        <div className="job-company-avatar">
          {job.company.charAt(0)}
        </div>

        <div className="job-card-meta">
          <div className="job-card-header">
            <div>
              <h2 className="job-title">{job.title}</h2>
              <div className="job-company">{job.company}</div>
            </div>
            <span className={`job-type-badge ${typeColor}`}>{job.type}</span>
          </div>

          <p className="job-desc">{job.desc}</p>

          <div className="job-tags">
            {job.tags.map(tag => (
              <span key={tag} className="job-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-footer-meta">
          <span className="job-meta-item">
            <MapPin size={13} />{job.location}
          </span>
          <span className="job-meta-sep" />
          <span className="job-meta-item salary">
            <IndianRupee size={13} />{job.salary}
          </span>
          <span className="job-meta-sep" />
          <span className="job-meta-item muted">
            {job.posted}
          </span>
        </div>
        <Link href={`/jobs/${job.id}`} className="job-apply-btn">
          Apply now <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

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

  .jobs-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--ink);
  }

  /* ── Header ── */
  .jobs-header {
    background: var(--ink);
    padding: 0 1.5rem;
  }
  .jobs-header-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 2.75rem 0 2.5rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
  }
  .jobs-eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  .jobs-headline {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(1.9rem, 4vw, 2.9rem);
    color: #fff;
    line-height: 1.1;
    font-weight: 400;
  }
  .jobs-headline em {
    font-style: italic;
    color: var(--gold-light);
  }
  .jobs-sub {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.4);
    font-weight: 300;
    margin-top: 0.4rem;
    max-width: 420px;
  }
  .jobs-header-stat {
    text-align: right;
    flex-shrink: 0;
  }
  .jobs-stat-num {
    display: block;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 3rem;
    color: #fff;
    line-height: 1;
  }
  .jobs-stat-label {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* ── Search bar ── */
  .jobs-search-bar {
    background: var(--surface);
    border-bottom: 1px solid var(--cream-dark);
    padding: 0 1.5rem;
    position: sticky;
    top: 0;
    z-index: 20;
    box-shadow: 0 1px 0 var(--cream-dark);
  }
  .jobs-search-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 0.9rem 0;
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  .jobs-search-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: var(--cream);
    border: 1.5px solid var(--cream-dark);
    border-radius: 10px;
    padding: 0.6rem 0.9rem;
    transition: border-color 0.2s;
  }
  .jobs-search-input-wrap:focus-within {
    border-color: var(--blue-bright);
    background: #fff;
  }
  .jobs-search-icon { color: var(--ink-muted); flex-shrink: 0; }
  .jobs-search-input {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.875rem; color: var(--ink);
    font-family: 'DM Sans', sans-serif;
  }
  .jobs-search-input::placeholder { color: var(--ink-muted); }
  .jobs-search-clear {
    background: none; border: none; cursor: pointer;
    color: var(--ink-muted); display: flex; align-items: center;
    transition: color 0.15s;
  }
  .jobs-search-clear:hover { color: var(--ink); }

  .jobs-filter-toggle {
    display: inline-flex; align-items: center; gap: 0.45rem;
    background: transparent;
    border: 1.5px solid var(--cream-dark);
    border-radius: 10px;
    padding: 0.6rem 1rem;
    font-size: 0.82rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink-soft); cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
  }
  .jobs-filter-toggle:hover, .jobs-filter-toggle.open {
    border-color: var(--ink);
    background: rgba(13,15,26,0.04);
  }
  .jobs-filter-toggle.active { border-color: var(--blue-bright); color: var(--blue-bright); }
  .filter-count {
    display: inline-flex; align-items: center; justify-content: center;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--blue-bright); color: #fff;
    font-size: 0.65rem; font-weight: 700; line-height: 1;
  }

  /* ── Filter panel ── */
  .jobs-filter-panel {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem 0 1.25rem;
    border-top: 1px solid var(--cream-dark);
    display: flex;
    gap: 2.5rem;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .jobs-filter-group { display: flex; flex-direction: column; gap: 0.6rem; }
  .jobs-filter-label {
    font-size: 0.7rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--ink-muted); font-weight: 500;
  }
  .jobs-filter-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .filter-chip {
    padding: 0.3rem 0.85rem; border-radius: 100px;
    border: 1.5px solid var(--cream-dark);
    background: transparent;
    font-size: 0.8rem; font-weight: 500; color: var(--ink-soft);
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: all 0.15s;
  }
  .filter-chip:hover { border-color: var(--ink-muted); color: var(--ink); }
  .filter-chip.active {
    background: var(--ink); border-color: var(--ink); color: #fff;
  }
  .jobs-clear-all {
    align-self: flex-end;
    font-size: 0.78rem; color: var(--ink-muted);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    text-decoration: underline; text-underline-offset: 3px;
    transition: color 0.15s;
    padding: 0;
    margin-top: auto;
  }
  .jobs-clear-all:hover { color: var(--ink); }

  /* ── Main ── */
  .jobs-main {
    max-width: 900px;
    margin: 0 auto;
    padding: 1.75rem 1.5rem 4rem;
  }

  .jobs-result-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }
  .jobs-result-count {
    font-size: 0.82rem; color: var(--ink-muted); font-weight: 400;
  }
  .jobs-result-count em { font-style: normal; color: var(--ink); font-weight: 500; }
  .jobs-clear-inline {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.78rem; color: var(--ink-muted);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s;
  }
  .jobs-clear-inline:hover { color: var(--ink); }

  /* ── Job list ── */
  .jobs-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: var(--cream-dark);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--cream-dark);
  }

  /* ── Job card ── */
  .job-card {
    background: var(--surface);
    padding: 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition: background 0.2s;
    animation: fadeUp 0.4s ease both;
  }
  .job-card:hover { background: #fafaf8; }

  .job-card-top {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
  }

  .job-company-avatar {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--ink);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .job-card-meta { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }

  .job-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .job-title {
    font-size: 1.05rem; font-weight: 600; color: var(--ink);
    line-height: 1.3;
  }
  .job-company {
    font-size: 0.82rem; color: var(--ink-muted);
    margin-top: 0.2rem; font-weight: 400;
  }

  .job-type-badge {
    font-size: 0.7rem; font-weight: 600;
    padding: 0.25rem 0.7rem;
    border-radius: 100px;
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.03em;
  }
  .type-full { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
  .type-contract { background: #eff6ff; color: #1d4ed8; border: 1px solid #93c5fd; }
  .type-part { background: #fefce8; color: #a16207; border: 1px solid #fde047; }

  .job-desc {
    font-size: 0.85rem; color: var(--ink-muted);
    line-height: 1.65; font-weight: 300;
  }

  .job-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .job-tag {
    font-size: 0.75rem; font-weight: 500;
    padding: 0.2rem 0.65rem;
    border-radius: 6px;
    background: var(--cream);
    color: var(--ink-soft);
    border: 1px solid var(--cream-dark);
    transition: background 0.15s, border-color 0.15s;
  }
  .job-card:hover .job-tag { background: #ede9e1; }

  /* ── Card footer ── */
  .job-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--cream-dark);
    flex-wrap: wrap;
  }
  .job-footer-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .job-meta-item {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.8rem; color: var(--ink-soft); font-weight: 400;
  }
  .job-meta-item.salary { font-weight: 600; color: var(--ink); }
  .job-meta-item.muted { color: var(--ink-muted); }
  .job-meta-sep {
    width: 3px; height: 3px; border-radius: 50%;
    background: var(--cream-dark);
    flex-shrink: 0;
  }

  .job-apply-btn {
    display: inline-flex; align-items: center; gap: 0.45rem;
    background: var(--ink); color: #fff;
    border-radius: 9px; padding: 0.6rem 1.2rem;
    font-size: 0.82rem; font-weight: 500;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .job-apply-btn:hover {
    background: var(--blue-deep);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(13,15,26,0.18);
  }

  /* ── Empty state ── */
  .jobs-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.75rem; padding: 5rem 1rem; text-align: center;
  }
  .jobs-empty-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: var(--cream-dark);
    color: var(--ink-muted);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.5rem;
  }
  .jobs-empty-title {
    font-size: 1rem; font-weight: 600; color: var(--ink);
  }
  .jobs-empty-desc {
    font-size: 0.85rem; color: var(--ink-muted); font-weight: 300;
  }
  .jobs-empty-reset {
    margin-top: 0.5rem;
    padding: 0.55rem 1.2rem;
    border-radius: 9px;
    border: 1.5px solid var(--cream-dark);
    background: transparent;
    font-size: 0.82rem; font-weight: 500; color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .jobs-empty-reset:hover { border-color: var(--ink); background: rgba(13,15,26,0.04); }

  /* ── Keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: none; }
  }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .jobs-header-stat { display: none; }
    .job-card { padding: 1.25rem; }
    .job-card-top { flex-direction: row; }
    .job-card-header { flex-direction: column; gap: 0.5rem; }
    .jobs-filter-panel { gap: 1.25rem; }
  }
`