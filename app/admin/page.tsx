"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { adminAPI, type LandingContent, type AdminReviewRequest } from "@/lib/api"
import type { User, VerificationDocument } from "@/lib/api/types"
import { toast } from "sonner"

const defaultLandingContent: LandingContent = {
  id: 1,
  hero_headline_line1: "Find Verified",
  hero_headline_em: "Chartered Accountants",
  hero_headline_line3: "& Lawyers — Instantly",
  hero_deck:
    "CounselMate is India's trusted directory connecting individuals and businesses with verified legal and financial professionals. No middlemen. No hidden costs. Direct access to the expertise you need.",
  hero_col1_paragraph1:
    "Whether you need a Chartered Accountant to handle your GST filing, a Corporate Lawyer to review your contracts, or a Tax Specialist to plan your investments — CounselMate puts verified, credentialed professionals at your fingertips.",
  hero_col1_paragraph2:
    "Every professional on our platform has been individually verified. We confirm Bar Council registrations, ICAI memberships, and practice credentials before any profile goes live.",
  hero_col2_paragraph1:
    "We built CounselMate because finding trustworthy legal and financial help in India has historically meant relying on personal referrals or navigating directories with outdated, unverified listings.",
  hero_col2_paragraph2:
    "Our platform changes that. Browse by specialization, location, language, and availability. Read verified client reviews. Book a consultation in minutes.",
  services_intro:
    "CounselMate hosts professionals across two primary domains — legal services and financial advisory. Below is a complete overview of what you can find on our platform.",
  how_it_works_intro:
    "From your first visit to a completed consultation, the entire process is designed to be clear, secure, and efficient. Here is a step-by-step account of what to expect.",
  why_us_intro:
    "There are many ways to find legal and financial help in India. Here is an honest account of what makes CounselMate different, and why thousands of clients trust us.",
  updated_at: "",
}

type LandingContentTextField =
  | "hero_headline_line1"
  | "hero_headline_em"
  | "hero_headline_line3"
  | "hero_deck"
  | "hero_col1_paragraph1"
  | "hero_col1_paragraph2"
  | "hero_col2_paragraph1"
  | "hero_col2_paragraph2"
  | "services_intro"
  | "how_it_works_intro"
  | "why_us_intro"

export default function AdminPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [landingContent, setLandingContent] = useState<LandingContent>(defaultLandingContent)
  const [savingContent, setSavingContent] = useState(false)
  const [processingDocumentId, setProcessingDocumentId] = useState<string | null>(null)

  const headlineFields: Array<{ field: LandingContentTextField; label: string }> = [
    { field: "hero_headline_line1", label: "Hero Heading Line 1" },
    { field: "hero_headline_em", label: "Hero Heading Emphasis" },
    { field: "hero_headline_line3", label: "Hero Heading Line 3" },
  ]

  const paragraphFields: Array<{ field: LandingContentTextField; label: string }> = [
    { field: "hero_deck", label: "Hero Deck" },
    { field: "hero_col1_paragraph1", label: "Hero Column 1 Paragraph 1" },
    { field: "hero_col1_paragraph2", label: "Hero Column 1 Paragraph 2" },
    { field: "hero_col2_paragraph1", label: "Hero Column 2 Paragraph 1" },
    { field: "hero_col2_paragraph2", label: "Hero Column 2 Paragraph 2" },
    { field: "services_intro", label: "Services Intro" },
    { field: "how_it_works_intro", label: "How It Works Intro" },
    { field: "why_us_intro", label: "Why Us Intro" },
  ]

  const pendingDocuments = useMemo(
    () => documents.filter((d) => d.status === "PENDING"),
    [documents],
  )

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (!loading && user?.role !== "ADMIN") {
      toast.error("Admin access required")
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, loading, router, user?.role])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") return

    const load = async () => {
      try {
        setLoadingUsers(true)
        setLoadingDocs(true)

        const [userData, verificationData, contentData] = await Promise.all([
          adminAPI.listUsers(1, 50),
          adminAPI.listAllVerifications(1, 100),
          adminAPI.getLandingContent(),
        ])

        setUsers(userData.users || [])
        setDocuments(verificationData.documents || [])
        setLandingContent(contentData.content || defaultLandingContent)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load admin data")
      } finally {
        setLoadingUsers(false)
        setLoadingDocs(false)
      }
    }

    load()
  }, [isAuthenticated, user?.role])

  const removeUser = async (id: string) => {
    try {
      await adminAPI.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success("User deleted")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user")
    }
  }

  const reviewDocument = async (id: string, payload: AdminReviewRequest) => {
    try {
      setProcessingDocumentId(id)
      const result = await adminAPI.reviewVerification(id, payload)
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? result.document : doc)))
      toast.success(result.message || "Verification updated")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to review document")
    } finally {
      setProcessingDocumentId(null)
    }
  }

  const saveLandingContent = async () => {
    try {
      setSavingContent(true)
      const result = await adminAPI.updateLandingContent(landingContent)
      setLandingContent(result.content)
      toast.success("Landing page content updated")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update landing content")
    } finally {
      setSavingContent(false)
    }
  }

  if (loading || !isAuthenticated || user?.role !== "ADMIN") {
    return <div className="p-8 text-sm text-slate-600">Loading admin panel…</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-600">Manage users, document verification, and landing-page copy.</p>
        </div>

        <section className="rounded-xl border bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Users</h2>
          {loadingUsers ? (
            <p className="mt-3 text-sm text-slate-500">Loading users…</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Role</th>
                    <th className="py-2 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2 pr-3">{`${u.first_name || ""} ${u.last_name || ""}`.trim() || "—"}</td>
                      <td className="py-2 pr-3">{u.email}</td>
                      <td className="py-2 pr-3">{u.role}</td>
                      <td className="py-2 pr-3">
                        {u.role !== "ADMIN" && (
                          <button
                            className="rounded-md border px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                            onClick={() => removeUser(u.id)}
                          >
                            Delete
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

        <section className="rounded-xl border bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Verification Queue</h2>
          <p className="mt-1 text-sm text-slate-600">Pending: {pendingDocuments.length}</p>
          {loadingDocs ? (
            <p className="mt-3 text-sm text-slate-500">Loading verification documents…</p>
          ) : (
            <div className="mt-4 space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium text-slate-800">{doc.document_type}</div>
                      <div className="text-xs text-slate-500">User: {doc.user_id}</div>
                    </div>
                    <span className="rounded-full border px-2 py-0.5 text-xs font-semibold">{doc.status}</span>
                  </div>
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs text-blue-600 hover:underline"
                    >
                      Open submitted document
                    </a>
                  )}
                  {doc.status === "PENDING" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        disabled={processingDocumentId === doc.id}
                        onClick={() => reviewDocument(doc.id, { status: "APPROVED" })}
                        className="rounded-md border px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={processingDocumentId === doc.id}
                        onClick={() => reviewDocument(doc.id, { status: "REJECTED", rejection_reason: "Needs correction" })}
                        className="rounded-md border px-3 py-1 text-xs text-rose-700 hover:bg-rose-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {documents.length === 0 && <p className="text-sm text-slate-500">No verification records found.</p>}
            </div>
          )}
        </section>

        <section className="rounded-xl border bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Landing Page Content Editor</h2>
            <button
              onClick={saveLandingContent}
              disabled={savingContent}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {savingContent ? "Saving…" : "Save Content"}
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              {headlineFields.map(({ field, label }) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">{label}</label>
                  <input
                    value={landingContent[field] || ""}
                    onChange={(e) =>
                      setLandingContent((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              ))}

              {paragraphFields.map(({ field, label }) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">{label}</label>
                  <textarea
                    rows={3}
                    value={landingContent[field] || ""}
                    onChange={(e) =>
                      setLandingContent((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="rounded-lg border bg-slate-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-700">Preview</h3>
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold leading-tight text-slate-900">
                  {landingContent.hero_headline_line1}
                  <br />
                  <em className="text-red-700">{landingContent.hero_headline_em}</em>
                  <br />
                  {landingContent.hero_headline_line3}
                </h1>
                <p className="text-sm text-slate-700">{landingContent.hero_deck}</p>
                <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                  <div>
                    <p>{landingContent.hero_col1_paragraph1}</p>
                    <p className="mt-2">{landingContent.hero_col1_paragraph2}</p>
                  </div>
                  <div>
                    <p>{landingContent.hero_col2_paragraph1}</p>
                    <p className="mt-2">{landingContent.hero_col2_paragraph2}</p>
                  </div>
                </div>
                <div className="border-t pt-3 text-sm text-slate-700">
                  <p><strong>Services:</strong> {landingContent.services_intro}</p>
                  <p className="mt-2"><strong>How it works:</strong> {landingContent.how_it_works_intro}</p>
                  <p className="mt-2"><strong>Why us:</strong> {landingContent.why_us_intro}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
