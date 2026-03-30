"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import {
  Search, Star, MapPin, Award, Loader2,
  IndianRupee, Shield, X, SlidersHorizontal,
  ChevronLeft, ChevronRight, Briefcase, Trash2
} from "lucide-react"
import { searchAPI, useTags, profilesAPI } from "@/lib/api"
import { useAuth } from "@/lib/context/auth-context"
import type { ProfessionType, Profile, ProfileSearchParams } from "@/lib/api/types"
import { toast } from "sonner"

const LIMIT = 12

const getProfessionLabel = (type: string) => ({
  CA: 'Chartered Accountant',
  CA_APPRENTICE: 'CA Apprentice',
  LAWYER: 'Lawyer',
  ADVOCATE: 'Advocate',
  LAW_FIRM: 'Law Firm',
  CA_FIRM: 'CA Firm',
}[type] ?? type)

const availColor = (a: string) => {
  if (a === 'AVAILABLE') return 'avail-green'
  if (a === 'BUSY') return 'avail-amber'
  return 'avail-muted'
}

export default function ProfessionalsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm]           = useState("")
  const [professionFilter, setProfession]     = useState("")
  const [locationFilter, setLocation]         = useState("")
  const [availabilityFilter, setAvailability] = useState("")
  const [sortBy, setSort]                     = useState("rating")
  const [loading, setLoading]                 = useState(false)
  const [profiles, setProfiles]               = useState<Profile[]>([])
  const [total, setTotal]                     = useState(0)
  const [page, setPage]                       = useState(1)
  const [filterOpen, setFilterOpen]           = useState(false)
  const [myProfileId, setMyProfileId]         = useState<string | null>(null)
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null)
  const { tags } = useTags()

  const totalPages = Math.ceil(total / LIMIT)
  const activeFilters = [professionFilter, locationFilter, availabilityFilter].filter(Boolean).length

  const doSearch = useCallback(async () => {
    setLoading(true)
    try {
      const params: ProfileSearchParams = {
        query: searchTerm || undefined,
        profession: (professionFilter || undefined) as ProfessionType | undefined,
        location: locationFilter || undefined,
        availability: availabilityFilter || undefined,
        sort: sortBy,
        page,
        limit: LIMIT,
      }
      const res = await searchAPI.search(params)
      const filtered = (res.profiles || []).filter((p) => p.user_id !== user?.id)
      setProfiles(filtered)
      setTotal(res.total || 0)
    } catch {
      toast.error('Failed to load professionals')
      setProfiles([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, professionFilter, locationFilter, availabilityFilter, sortBy, page, user?.id])

  useEffect(() => { doSearch() }, [doSearch])

  // Load current user's profile ID
  useEffect(() => {
    if (user && user.role === 'PROFESSIONAL') {
      profilesAPI.getMyProfile()
        .then(profile => setMyProfileId(profile.id))
        .catch(() => setMyProfileId(null))
    }
  }, [user])

  const handleDeleteProfile = async (profileId: string) => {
    try {
      setDeletingProfileId(profileId)
      await profilesAPI.deleteProfile(profileId)
      toast.success('Profile deleted successfully!')
      setMyProfileId(null)
      // Refresh the search results
      doSearch()
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete profile'
      toast.error(errorMsg)
    } finally {
      setDeletingProfileId(null)
    }
  }

  const clearFilters = () => {
    setProfession(""); setLocation(""); setAvailability("")
    setPage(1)
  }

  return (
    <>
      <style>{css}</style>
      <div className="pros-root">

        {/* ════════ HERO / HEADER ════════ */}
        <header className="pros-header">
          <div className="pros-header-inner">
            <div>
              <div className="pros-eyebrow">Directory</div>
              <h1 className="pros-headline">
                Find your <em>expert</em>
              </h1>
              <p className="pros-sub">
                Browse verified CAs, Lawyers, and Advocates — filtered by expertise, location, and availability.
              </p>
            </div>
            {!loading && total > 0 && (
              <div className="pros-header-stat">
                <span className="pros-stat-num">{total}</span>
                <span className="pros-stat-label">professionals</span>
              </div>
            )}
          </div>
        </header>

        {/* ════════ STICKY SEARCH BAR ════════ */}
        <div className="pros-search-bar">
          <div className="pros-search-inner">
            {/* Search input */}
            <div className="pros-search-input-wrap">
              <Search size={15} className="pros-search-icon" />
              <input
                type="text"
                placeholder="Search by name, skill, or specialization…"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1) }}
                className="pros-search-input"
              />
              {searchTerm && (
                <button className="pros-search-clear" onClick={() => { setSearchTerm(""); setPage(1) }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => { setSort(e.target.value); setPage(1) }}
              className="pros-select"
            >
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="recent">Recently Joined</option>
            </select>

            {/* Filter toggle */}
            <button
              className={`pros-filter-toggle${filterOpen ? " open" : ""}${activeFilters > 0 ? " active" : ""}`}
              onClick={() => setFilterOpen(v => !v)}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}
            </button>
          </div>

          {/* Filter panel */}
          {filterOpen && (
            <div className="pros-filter-panel">
              <FilterGroup label="Profession">
                <ChipSet
                  options={[{ value: "", label: "All" }, ...(tags?.professions?.map((p: string) => ({ value: p, label: getProfessionLabel(p) })) ?? [])]}
                  value={professionFilter}
                  onChange={v => { setProfession(v); setPage(1) }}
                />
              </FilterGroup>
              <FilterGroup label="Location">
                <ChipSet
                  options={[{ value: "", label: "All" }, ...(tags?.states?.map((s: string) => ({ value: s, label: s })) ?? [])]}
                  value={locationFilter}
                  onChange={v => { setLocation(v); setPage(1) }}
                  scroll
                />
              </FilterGroup>
              <FilterGroup label="Availability">
                <ChipSet
                  options={[{ value: "", label: "All" }, ...(tags?.availability?.map((a: string) => ({ value: a, label: a.replace(/_/g, ' ') })) ?? [])]}
                  value={availabilityFilter}
                  onChange={v => { setAvailability(v); setPage(1) }}
                />
              </FilterGroup>
              {activeFilters > 0 && (
                <button className="pros-clear-all" onClick={clearFilters}>
                  Clear all <X size={11} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ════════ MAIN CONTENT ════════ */}
        <main className="pros-main">

          {/* Result meta */}
          <div className="pros-result-meta">
            <span className="pros-result-count">
              {loading
                ? "Searching…"
                : <>{total} <em>{total === 1 ? "professional" : "professionals"}</em> found{searchTerm && <> for <em>"{searchTerm}"</em></>}</>
              }
            </span>
            {activeFilters > 0 && !loading && (
              <button className="pros-clear-inline" onClick={clearFilters}>
                Clear filters <X size={12} />
              </button>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="pros-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="pros-card-skel">
                  <div className="skel skel-avatar" />
                  <div className="skel skel-line w60" />
                  <div className="skel skel-line w40" />
                  <div className="skel skel-line w80" />
                  <div className="skel skel-btn" />
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {!loading && profiles.length > 0 && (
            <div className="pros-grid">
              {profiles.map((profile, i) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  index={i}
                  isOwnProfile={myProfileId === profile.id}
                  isDeleting={deletingProfileId === profile.id}
                  onDelete={() => handleDeleteProfile(profile.id)}
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && profiles.length === 0 && (
            <div className="pros-empty">
              <div className="pros-empty-icon"><Briefcase size={26} /></div>
              <div className="pros-empty-title">No professionals found</div>
              <div className="pros-empty-desc">Try adjusting your search or filters.</div>
              <button className="pros-empty-reset" onClick={() => { setSearchTerm(""); clearFilters() }}>
                Reset all
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="pros-pagination">
              <button
                className="pros-page-btn"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <div className="pros-page-pills">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '…')[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === '…'
                      ? <span key={`ellipsis-${i}`} className="pros-page-ellipsis">…</span>
                      : <button
                          key={p}
                          className={`pros-page-pill${page === p ? " active" : ""}`}
                          onClick={() => setPage(p as number)}
                        >{p}</button>
                  )
                }
              </div>
              <button
                className="pros-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

/* ── Profile card ─────────────────────────────────── */

function ProfileCard({
  profile,
  index,
  isOwnProfile,
  isDeleting,
  onDelete,
}: {
  profile: Profile;
  index: number;
  isOwnProfile?: boolean;
  isDeleting?: boolean;
  onDelete?: () => Promise<void>;
}) {
  const initials = (profile.title ?? 'P').split(' ').map((w: string) => w[0]).slice(0, 2).join('')
  const avail = profile.availability?.replace(/_/g, ' ')

  return (
    <div
      className="pros-card"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Top row */}
      <div className="pros-card-top">
        <div className="pros-card-avatar-wrap">
          {profile.profile_picture
            ? <img src={profile.profile_picture} alt={profile.title} className="pros-card-avatar-img" />
            : <div className="pros-card-avatar-initials">{initials}</div>
          }
          {profile.is_verified && (
            <div className="pros-card-verified" title="Verified"><Shield size={10} /></div>
          )}
        </div>
        <div className="pros-card-header-info">
          <div className="pros-card-profession">{getProfessionLabel(profile.profession_type)}</div>
          <h3 className="pros-card-name">{profile.title}</h3>
          {(profile.city || profile.state || profile.location) && (
            <div className="pros-card-location">
              <MapPin size={11} />
              {profile.city || profile.state || profile.location}
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      {profile.skills?.length > 0 && (
        <div className="pros-card-skills">
          <Award size={12} className="pros-card-skills-icon" />
          <span>{profile.skills.slice(0, 3).join(' · ')}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="pros-card-stats">
        <div className="pros-card-stat">
          <Star size={12} className="stat-star" />
          <strong>{profile.rating?.toFixed(1)}</strong>
          <span>({profile.review_count})</span>
        </div>
        <div className="pros-card-stat-sep" />
        <div className="pros-card-stat">
          <strong>{profile.experience_years}+</strong>
          <span>yrs</span>
        </div>
        {profile.hourly_rate && (
          <>
            <div className="pros-card-stat-sep" />
            <div className="pros-card-stat">
              <IndianRupee size={11} />
              <strong>₹{profile.hourly_rate}</strong>
              <span>/hr</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="pros-card-footer">
        {profile.availability && (
          <span className={`pros-avail-badge ${availColor(profile.availability)}`}>
            <span className="pros-avail-dot" />
            {avail}
          </span>
        )}
        <div className="flex gap-2 flex-1">
          <Link href={`/professionals/${profile.id}`} className="pros-view-btn flex-1">
            View Profile
          </Link>
          {isOwnProfile && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              title="Delete your profile"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Filter helpers ───────────────────────────────── */

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="filter-group">
      <div className="filter-group-label">{label}</div>
      {children}
    </div>
  )
}

function ChipSet({ options, value, onChange, scroll }: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  scroll?: boolean
}) {
  return (
    <div className={`filter-chips${scroll ? " scroll" : ""}`}>
      {options.map(o => (
        <button
          key={o.value}
          className={`filter-chip${value === o.value ? " active" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
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

  .pros-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--ink);
  }

  /* ── Header ── */
  .pros-header { background: var(--ink); padding: 0 1.5rem; }
  .pros-header-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 2.75rem 0 2.5rem;
    display: flex; align-items: flex-end; justify-content: space-between; gap: 1.5rem;
  }
  .pros-eyebrow {
    font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); font-weight: 500; margin-bottom: 0.4rem;
  }
  .pros-headline {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(1.9rem, 4vw, 2.9rem);
    color: #fff; line-height: 1.1; font-weight: 400;
  }
  .pros-headline em { font-style: italic; color: var(--gold-light); }
  .pros-sub {
    font-size: 0.875rem; color: rgba(255,255,255,0.4);
    font-weight: 300; margin-top: 0.4rem; max-width: 460px;
  }
  .pros-header-stat { text-align: right; flex-shrink: 0; }
  .pros-stat-num {
    display: block;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 3rem; color: #fff; line-height: 1;
  }
  .pros-stat-label {
    font-size: 0.72rem; color: rgba(255,255,255,0.3);
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  /* ── Search bar ── */
  .pros-search-bar {
    background: var(--surface);
    border-bottom: 1px solid var(--cream-dark);
    padding: 0 1.5rem;
    position: sticky; top: 0; z-index: 30;
  }
  .pros-search-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 0.9rem 0;
    display: flex; gap: 0.75rem; align-items: center;
    flex-wrap: wrap;
  }
  .pros-search-input-wrap {
    flex: 1; min-width: 220px;
    display: flex; align-items: center; gap: 0.6rem;
    background: var(--cream); border: 1.5px solid var(--cream-dark);
    border-radius: 10px; padding: 0.6rem 0.9rem;
    transition: border-color 0.2s, background 0.2s;
  }
  .pros-search-input-wrap:focus-within { border-color: var(--blue-bright); background: #fff; }
  .pros-search-icon { color: var(--ink-muted); flex-shrink: 0; }
  .pros-search-input {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.875rem; color: var(--ink); font-family: 'DM Sans', sans-serif;
  }
  .pros-search-input::placeholder { color: var(--ink-muted); }
  .pros-search-clear {
    background: none; border: none; cursor: pointer; color: var(--ink-muted);
    display: flex; align-items: center; padding: 0; transition: color 0.15s;
  }
  .pros-search-clear:hover { color: var(--ink); }

  .pros-select {
    background: var(--cream); border: 1.5px solid var(--cream-dark);
    border-radius: 10px; padding: 0.6rem 0.9rem;
    font-size: 0.82rem; color: var(--ink); font-family: 'DM Sans', sans-serif;
    outline: none; cursor: pointer;
    transition: border-color 0.2s;
  }
  .pros-select:focus { border-color: var(--blue-bright); }

  .pros-filter-toggle {
    display: inline-flex; align-items: center; gap: 0.45rem;
    background: transparent; border: 1.5px solid var(--cream-dark);
    border-radius: 10px; padding: 0.6rem 1rem;
    font-size: 0.82rem; font-weight: 500; color: var(--ink-soft);
    font-family: 'DM Sans', sans-serif; cursor: pointer; white-space: nowrap;
    transition: border-color 0.2s, background 0.2s;
  }
  .pros-filter-toggle:hover, .pros-filter-toggle.open { border-color: var(--ink); background: rgba(13,15,26,0.04); }
  .pros-filter-toggle.active { border-color: var(--blue-bright); color: var(--blue-bright); }
  .filter-count {
    display: inline-flex; align-items: center; justify-content: center;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--blue-bright); color: #fff;
    font-size: 0.65rem; font-weight: 700;
  }

  /* ── Filter panel ── */
  .pros-filter-panel {
    max-width: 1100px; margin: 0 auto;
    padding: 1rem 0 1.25rem;
    border-top: 1px solid var(--cream-dark);
    display: flex; gap: 2.5rem; flex-wrap: wrap; align-items: flex-start;
  }
  .filter-group { display: flex; flex-direction: column; gap: 0.6rem; }
  .filter-group-label {
    font-size: 0.68rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--ink-muted); font-weight: 500;
  }
  .filter-chips { display: flex; gap: 0.45rem; flex-wrap: wrap; }
  .filter-chips.scroll {
    flex-wrap: nowrap; overflow-x: auto;
    scrollbar-width: none; max-width: 420px;
  }
  .filter-chips.scroll::-webkit-scrollbar { display: none; }
  .filter-chip {
    padding: 0.28rem 0.8rem; border-radius: 100px;
    border: 1.5px solid var(--cream-dark);
    background: transparent; font-size: 0.78rem; font-weight: 500;
    color: var(--ink-soft); font-family: 'DM Sans', sans-serif;
    cursor: pointer; white-space: nowrap;
    transition: all 0.15s;
  }
  .filter-chip:hover { border-color: var(--ink-muted); color: var(--ink); }
  .filter-chip.active { background: var(--ink); border-color: var(--ink); color: #fff; }
  .pros-clear-all {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.78rem; color: var(--ink-muted); background: none;
    border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    text-decoration: underline; text-underline-offset: 3px;
    transition: color 0.15s; padding: 0; margin-top: auto;
  }
  .pros-clear-all:hover { color: var(--ink); }

  /* ── Main ── */
  .pros-main {
    max-width: 1100px; margin: 0 auto;
    padding: 1.75rem 1.5rem 4rem;
  }
  .pros-result-meta {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .pros-result-count { font-size: 0.82rem; color: var(--ink-muted); }
  .pros-result-count em { font-style: normal; color: var(--ink); font-weight: 500; }
  .pros-clear-inline {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.78rem; color: var(--ink-muted);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: color 0.15s;
  }
  .pros-clear-inline:hover { color: var(--ink); }

  /* ── Grid ── */
  .pros-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1px;
    background: var(--cream-dark);
    border: 1px solid var(--cream-dark);
    border-radius: 16px;
    overflow: hidden;
  }

  /* ── Profile card ── */
  .pros-card {
    background: var(--surface);
    padding: 1.75rem;
    display: flex; flex-direction: column; gap: 1rem;
    transition: background 0.2s;
    animation: cardIn 0.35s ease both;
  }
  .pros-card:hover { background: #fafaf8; }

  .pros-card-top {
    display: flex; gap: 0.875rem; align-items: flex-start;
  }
  .pros-card-avatar-wrap { position: relative; flex-shrink: 0; }
  .pros-card-avatar-img {
    width: 48px; height: 48px; border-radius: 50%;
    object-fit: cover; border: 2px solid var(--cream-dark);
  }
  .pros-card-avatar-initials {
    width: 48px; height: 48px; border-radius: 50%;
    background: var(--ink); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.1rem;
  }
  .pros-card-verified {
    position: absolute; bottom: 0; right: 0;
    width: 18px; height: 18px; border-radius: 50%;
    background: #22c55e; color: #fff;
    border: 2px solid var(--surface);
    display: flex; align-items: center; justify-content: center;
  }
  .pros-card-header-info { flex: 1; min-width: 0; }
  .pros-card-profession {
    font-size: 0.68rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--gold); font-weight: 500;
    margin-bottom: 0.2rem;
  }
  .pros-card-name {
    font-size: 1rem; font-weight: 600; color: var(--ink);
    line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pros-card-location {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.75rem; color: var(--ink-muted); margin-top: 0.2rem;
  }

  .pros-card-skills {
    display: flex; align-items: flex-start; gap: 0.4rem;
    font-size: 0.78rem; color: var(--ink-muted); line-height: 1.5;
  }
  .pros-card-skills-icon { color: var(--ink-muted); flex-shrink: 0; margin-top: 1px; }

  .pros-card-stats {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.875rem 0;
    border-top: 1px solid var(--cream-dark);
    border-bottom: 1px solid var(--cream-dark);
    flex-wrap: wrap;
  }
  .pros-card-stat {
    display: inline-flex; align-items: center; gap: 0.25rem;
    font-size: 0.78rem; color: var(--ink-muted);
  }
  .pros-card-stat strong { color: var(--ink); font-weight: 600; }
  .pros-card-stat-sep {
    width: 3px; height: 3px; border-radius: 50%;
    background: var(--cream-dark); flex-shrink: 0;
  }
  .stat-star { color: var(--gold); fill: var(--gold); }

  .pros-card-footer {
    display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  }
  .pros-avail-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.72rem; font-weight: 500; padding: 0.25rem 0.65rem;
    border-radius: 100px;
  }
  .avail-green { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
  .avail-amber { background: #fffbeb; color: #a16207; border: 1px solid #fde68a; }
  .avail-muted { background: var(--cream); color: var(--ink-muted); border: 1px solid var(--cream-dark); }
  .pros-avail-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: currentColor; flex-shrink: 0;
  }
  .pros-view-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: var(--ink); color: #fff;
    border-radius: 9px; padding: 0.5rem 1rem;
    font-size: 0.8rem; font-weight: 500;
    text-decoration: none; font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .pros-view-btn:hover {
    background: var(--blue-deep);
    transform: translateY(-1px);
    box-shadow: 0 5px 16px rgba(13,15,26,0.15);
  }

  /* ── Skeleton ── */
  .pros-card-skel {
    background: var(--surface); padding: 1.75rem;
    display: flex; flex-direction: column; gap: 0.875rem;
  }
  .skel {
    border-radius: 8px;
    background: linear-gradient(90deg, #ede9e1 25%, #f5f2ec 50%, #ede9e1 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  .skel-avatar { width: 48px; height: 48px; border-radius: 50%; }
  .skel-line { height: 12px; border-radius: 6px; }
  .skel-btn { height: 36px; border-radius: 9px; margin-top: 0.25rem; }
  .w60 { width: 60%; }
  .w40 { width: 40%; }
  .w80 { width: 80%; }

  /* ── Empty ── */
  .pros-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.75rem; padding: 5rem 1rem; text-align: center;
  }
  .pros-empty-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: var(--cream-dark); color: var(--ink-muted);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.25rem;
  }
  .pros-empty-title { font-size: 1rem; font-weight: 600; color: var(--ink); }
  .pros-empty-desc { font-size: 0.85rem; color: var(--ink-muted); font-weight: 300; }
  .pros-empty-reset {
    margin-top: 0.5rem; padding: 0.55rem 1.2rem;
    border-radius: 9px; border: 1.5px solid var(--cream-dark);
    background: transparent; font-size: 0.82rem; font-weight: 500;
    color: var(--ink); font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .pros-empty-reset:hover { border-color: var(--ink); background: rgba(13,15,26,0.04); }

  /* ── Pagination ── */
  .pros-pagination {
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
    margin-top: 3rem; flex-wrap: wrap;
  }
  .pros-page-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.55rem 1rem; border-radius: 10px;
    border: 1.5px solid var(--cream-dark); background: var(--surface);
    font-size: 0.82rem; font-weight: 500; color: var(--ink);
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
  }
  .pros-page-btn:hover:not(:disabled) { border-color: var(--ink); transform: translateY(-1px); }
  .pros-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .pros-page-pills { display: flex; align-items: center; gap: 0.35rem; }
  .pros-page-pill {
    width: 36px; height: 36px; border-radius: 9px;
    border: 1.5px solid var(--cream-dark); background: var(--surface);
    font-size: 0.82rem; font-weight: 500; color: var(--ink);
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .pros-page-pill:hover { border-color: var(--ink); }
  .pros-page-pill.active { background: var(--ink); border-color: var(--ink); color: #fff; }
  .pros-page-ellipsis { font-size: 0.82rem; color: var(--ink-muted); padding: 0 0.25rem; }

  /* ── Keyframes ── */
  @keyframes shimmer { to { background-position: -200% 0; } }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: none; }
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .pros-header-stat { display: none; }
    .pros-select { display: none; }
    .pros-grid { grid-template-columns: 1fr; }
    .pros-filter-panel { gap: 1.25rem; }
  }
`