"use client"

import { useState } from "react"
import { MapPin, Briefcase, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobType, setJobType] = useState("all")

  const jobs = [
    {
      id: 1,
      title: "Tax Consultant - Remote",
      company: "FinanceHub Inc",
      type: "Full-time",
      location: "Remote",
      salary: "₹60,000 - ₹80,000",
      desc: "Looking for experienced CA for tax planning and advisory.",
      tags: ["GST", "Income Tax", "Audit"],
    },
    {
      id: 2,
      title: "Senior Lawyer - Corporate Law",
      company: "Legal Associates Ltd",
      type: "Full-time",
      location: "Delhi, India",
      salary: "₹80,000 - ₹1,20,000",
      desc: "Seeking experienced corporate lawyer for M&A transactions.",
      tags: ["M&A", "Contracts", "Corporate"],
    },
    {
      id: 3,
      title: "Compliance Officer",
      company: "Tech Startup Co",
      type: "Contract",
      location: "Bangalore",
      salary: "₹50,000 - ₹70,000",
      desc: "Part-time compliance and regulatory advisory needed.",
      tags: ["Compliance", "Regulatory"],
    },
  ]

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Job Opportunities</h1>
          <p className="text-text-secondary">Find matching positions for professionals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 space-y-6 sticky top-24">
              <div>
                <label className="block text-sm font-semibold mb-3">Job Type</label>
                <div className="space-y-2">
                  {["All", "Full-time", "Contract", "Part-time"].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={jobType === type.toLowerCase()}
                        onChange={() => setJobType(type.toLowerCase())}
                        className="focus-ring"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <p className="text-primary font-semibold mb-3">{job.company}</p>
                      <p className="text-text-secondary mb-4">{job.desc}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-primary bg-opacity-10 text-primary text-xs px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-text-primary">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                    </div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition"
                    >
                      Apply <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
