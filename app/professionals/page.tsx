"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, Filter, Star, MapPin, Award, DollarSign, Loader2 } from "lucide-react"
import { searchAPI, useTags } from "@/lib/api"
import type { Profile, ProfileSearchParams } from "@/lib/api/types"
import { toast } from "sonner"

export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [professionFilter, setProfessionFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [loading, setLoading] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const { tags } = useTags()

  useEffect(() => {
    searchProfiles()
  }, [searchTerm, professionFilter, locationFilter, availabilityFilter, sortBy, page])

  const searchProfiles = async () => {
    setLoading(true)
    try {
      const params: ProfileSearchParams = {
        query: searchTerm || undefined,
        profession: professionFilter as any || undefined,
        location: locationFilter || undefined,
        availability: availabilityFilter || undefined,
        sort: sortBy,
        page,
        limit: 12,
      }

      const response = await searchAPI.search(params)
      setProfiles(response.profiles || [])
      setTotal(response.total || 0)
    } catch (error) {
      toast.error('Failed to load professionals')
      console.error(error)
      setProfiles([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const getProfessionLabel = (type: string) => {
    const labels: Record<string, string> = {
      'CA': 'Chartered Accountant',
      'CA_APPRENTICE': 'CA Apprentice',
      'LAWYER': 'Lawyer',
      'ADVOCATE': 'Advocate',
      'LAW_FIRM': 'Law Firm',
      'CA_FIRM': 'CA Firm',
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Search and Filter Section */}
      <section className="bg-white border-b border-border sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 bg-background-light px-4 py-3 rounded-lg border border-gray-200">
                <Search className="w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search by name, skills, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-text-primary outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-text-secondary" />
                <span className="text-sm font-semibold text-text-primary">Filters:</span>
              </div>

              <select
                value={professionFilter}
                onChange={(e) => setProfessionFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-white text-text-primary text-sm"
              >
                <option value="">All Professions</option>
                {tags?.professions?.map((prof: string) => (
                  <option key={prof} value={prof}>
                    {getProfessionLabel(prof)}
                  </option>
                ))}
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-white text-text-primary text-sm"
              >
                <option value="">All Locations</option>
                {tags?.states?.map((state: string) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-white text-text-primary text-sm"
              >
                <option value="">All Availability</option>
                {tags?.availability?.map((avail: string) => (
                  <option key={avail} value={avail}>
                    {avail.replace('_', ' ')}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-white text-text-primary text-sm"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="recent">Recently Joined</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Browse Professionals</h1>
          <p className="text-text-secondary mt-2">
            {loading ? 'Searching...' : `${total} verified professional${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : profiles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-lg hover:border-primary transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                      {profile.profile_picture ? (
                        <img src={profile.profile_picture} alt={profile.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {profile.title?.charAt(0) || 'P'}
                        </span>
                      )}
                    </div>
                    {profile.is_verified && (
                      <div className="bg-success text-white px-2 py-1 rounded text-xs font-semibold">Verified</div>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-text-primary mb-1 line-clamp-1">{profile.title}</h3>
                  <p className="text-primary text-sm font-semibold mb-2">{getProfessionLabel(profile.profession_type)}</p>

                  <div className="space-y-2 mb-4">
                    {profile.skills?.length > 0 && (
                      <div className="flex items-start gap-2 text-sm text-text-secondary">
                        <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{profile.skills.slice(0, 3).join(', ')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.city || profile.location || profile.state}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-semibold text-text-primary">{profile.rating.toFixed(1)}</span>
                      <span className="text-xs text-text-secondary">({profile.review_count})</span>
                    </div>
                    <span className="text-xs bg-accent px-2 py-1 rounded font-semibold text-primary">
                      {profile.experience_years}+ yrs
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    {profile.hourly_rate && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-text-secondary" />
                        <span className="font-semibold text-text-primary">₹{profile.hourly_rate}/hr</span>
                      </div>
                    )}
                    <span className="text-xs text-text-secondary capitalize">{profile.availability?.toLowerCase().replace('_', ' ')}</span>
                  </div>

                  <Link
                    href={`/professionals/${profile.id}`}
                    className="block w-full bg-primary text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-600 transition"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > 12 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-border bg-white text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-text-secondary">
                  Page {page} of {Math.ceil(total / 12)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 12)}
                  className="px-4 py-2 rounded-lg border border-border bg-white text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg mb-4">No professionals found.</p>
            <p className="text-text-secondary text-sm">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </section>
    </div>
  )
}
