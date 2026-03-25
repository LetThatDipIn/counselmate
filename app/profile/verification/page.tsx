"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useEffect, useState } from "react"
import { verificationAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Upload, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import type { VerificationDocument } from "@/lib/api/types"

export default function VerificationPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [documentType, setDocumentType] = useState('LICENSE')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'PROFESSIONAL')) {
      router.push('/auth/register?role=PROFESSIONAL')
      return
    }

    if (user?.role === 'PROFESSIONAL') {
      fetchDocuments()
    }
  }, [isAuthenticated, loading, user, router])

  const fetchDocuments = async () => {
    setIsFetching(true)
    try {
      const docs = await verificationAPI.getMyDocuments()
      // Ensure docs is always an array
      if (Array.isArray(docs)) {
        setDocuments(docs)
      } else if (docs && typeof docs === 'object') {
        setDocuments([docs])
      } else {
        setDocuments([])
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      setDocuments([])
      toast.error('Failed to load your documents')
    } finally {
      setIsFetching(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        setFile(null)
        return
      }
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png']
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Only PDF, JPG, and PNG files are allowed')
        setFile(null)
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    if (!documentType) {
      toast.error('Please select a document type')
      return
    }

    const formData = new FormData()
    formData.append('document_type', documentType)
    formData.append('file', file)

    setIsSubmitting(true)
    try {
      await verificationAPI.submitDocument(formData)
      toast.success('Document submitted for verification')
      setFile(null)
      setDocumentType('LICENSE')
      // Refresh documents list
      await fetchDocuments()
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to submit document'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user || user.role !== 'PROFESSIONAL') return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Verification</h1>
            <p className="text-gray-600 mt-2">Submit your credentials and documents to get verified</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Submit Document</h2>

              <div className="space-y-4">
                <div>
                  <Label>Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LICENSE">Professional License</SelectItem>
                      <SelectItem value="CERTIFICATE">Degree Certificate</SelectItem>
                      <SelectItem value="PASSPORT">Passport</SelectItem>
                      <SelectItem value="AADHAR">Aadhar Card</SelectItem>
                      <SelectItem value="PAN">PAN Card</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file">Upload File</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="file"
                      className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
                    >
                      <div className="text-center">
                        <Upload size={28} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {file ? file.name : 'Click to upload or drag & drop'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                      </div>
                      <input
                        id="file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !file}
                  className="w-full"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Uploading...' : 'Submit for Verification'}
                </Button>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                  <p className="font-medium mb-2">Verification Requirements:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Clear, legible copy of document</li>
                    <li>✓ All important details visible</li>
                    <li>✓ Document must be valid/active</li>
                    <li>✓ File size under 10MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-6">Your Documents</h2>

              {isFetching ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents submitted yet</p>
                  <p className="text-sm text-gray-400 mt-1">Submit your first document above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{doc.document_type}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Submitted on {new Date(doc.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {doc.status === 'APPROVED' && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle size={16} />
                              <span className="text-sm font-medium">Approved</span>
                            </div>
                          )}
                          {doc.status === 'PENDING' && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <Clock size={16} />
                              <span className="text-sm font-medium">Pending</span>
                            </div>
                          )}
                          {doc.status === 'REJECTED' && (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle size={16} />
                              <span className="text-sm font-medium">Rejected</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {doc.status === 'REJECTED' && doc.rejection_reason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <p className="font-medium mb-1">Rejection Reason:</p>
                          <p>{doc.rejection_reason}</p>
                        </div>
                      )}

                      {doc.status === 'APPROVED' && doc.reviewed_at && (
                        <div className="mt-3 text-xs text-gray-500">
                          Verified on {new Date(doc.reviewed_at).toLocaleDateString()}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.file_url, '_blank')}
                          className="flex-1"
                        >
                          View Document
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Why Get Verified?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Build trust with clients</li>
                <li>✓ Get a verified badge on your profile</li>
                <li>✓ Appear higher in search results</li>
                <li>✓ Access to premium features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
