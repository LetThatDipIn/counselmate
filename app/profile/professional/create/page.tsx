"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useEffect, useState } from "react"
import { profilesAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Check, X } from "lucide-react"
import { PROFESSION_SKILLS, CERTIFICATIONS, LANGUAGES } from "@/lib/professional-data"
import type { ProfessionType, UpdateProfileRequest } from "@/lib/api/types"

export default function CreateProfessionalProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    profession_type: 'POWER_OF_ATTORNEY',
    title: '',
    bio: '',
    skills: [],
    location: '',
    city: '',
    state: '',
    experience_years: 0,
    availability: 'AVAILABLE',
    hourly_rate: 0,
    profile_picture: '',
    linkedin_url: '',
    website_url: '',
    certifications: [],
    languages: [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [certInput, setCertInput] = useState('')

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'PROFESSIONAL')) {
      router.push('/auth/register?role=PROFESSIONAL')
    }
  }, [isAuthenticated, loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user || user.role !== 'PROFESSIONAL') return null

  const professionType = (formData.profession_type || 'POWER_OF_ATTORNEY') as keyof typeof PROFESSION_SKILLS
  const availableSkills = PROFESSION_SKILLS[professionType] || []
  const availableCerts = CERTIFICATIONS[professionType] || []

  const handleAddSkill = (skill: string) => {
    if (!formData.skills?.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skill],
      })
    }
  }

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((_: string, i: number) => i !== index) || [],
    })
  }

  const handleAddCustomSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()],
      })
      setSkillInput('')
    }
  }

  const handleAddCertification = (cert: string) => {
    if (!formData.certifications?.includes(cert)) {
      setFormData({
        ...formData,
        certifications: [...(formData.certifications || []), cert],
      })
    }
  }

  const handleRemoveCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications?.filter((_: string, i: number) => i !== index) || [],
    })
  }

  const handleAddCustomCert = () => {
    if (certInput.trim() && !formData.certifications?.includes(certInput.trim())) {
      setFormData({
        ...formData,
        certifications: [...(formData.certifications || []), certInput.trim()],
      })
      setCertInput('')
    }
  }

  const handleAddLanguage = (lang: string) => {
    if (!formData.languages?.includes(lang)) {
      setFormData({
        ...formData,
        languages: [...(formData.languages || []), lang],
      })
    }
  }

  const handleRemoveLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages?.filter((_: string, i: number) => i !== index) || [],
    })
  }

  const handleSubmit = async () => {
    if (!formData.title?.trim() || !formData.bio?.trim()) {
      toast.error('Title and bio are required')
      return
    }

    setIsSubmitting(true)
    try {
      await profilesAPI.createProfile(formData)
      toast.success('Professional profile created successfully!')
      router.push('/dashboard')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create profile'
      // Handle 409 (already exists) gracefully
      if (errorMsg.includes('409') || errorMsg.includes('already exists')) {
        toast.error('You already have a professional profile. Redirecting...')
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        toast.error(errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Professional Profile</h1>
            <p className="text-gray-600 mt-2">Complete your profile to attract clients</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                  s <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s < step ? <Check size={16} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div>
                <Label>Profession Type</Label>
                <Select
                  value={formData.profession_type || 'POWER_OF_ATTORNEY'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, profession_type: value as ProfessionType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POWER_OF_ATTORNEY">Power of Attorney</SelectItem>
                    <SelectItem value="MARRIAGE_REGISTRATION">Marriage Registration</SelectItem>
                    <SelectItem value="LEGAL_HEIR_CERTIFICATE">Legal Heir Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Tax Consultant"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio / About You</Label>
                <Textarea
                  id="bio"
                  placeholder="Describe your experience, expertise, and services..."
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="70"
                  value={formData.experience_years}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience_years: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Location & Rates */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Location & Rates</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Mumbai"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="e.g., Maharashtra"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Full Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Mumbai, Maharashtra, India"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="hourly_rate">Hourly Rate (Optional)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min="0"
                  placeholder="₹ 0"
                  value={formData.hourly_rate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourly_rate: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      availability: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="BUSY">Busy</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Certifications */}
          {step === 3 && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold mb-6">Skills & Certifications</h2>

              {/* Skills Section */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Skills</Label>

                {/* Predefined Skills as Cards */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">Quick add for {professionType}:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {availableSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleAddSkill(skill)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.skills?.includes(skill)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {formData.skills?.includes(skill) && <Check size={16} className="inline mr-1" />}
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Skill Input */}
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add custom skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCustomSkill()
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddCustomSkill}
                    className="px-4"
                  >
                    Add
                  </Button>
                </div>

                {/* Selected Skills */}
                {formData.skills && formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center gap-2 bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(index)}
                          className="hover:text-blue-600"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Certifications Section */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Certifications</Label>

                {/* Predefined Certifications as Cards */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">Common certifications:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {availableCerts.map((cert) => (
                      <button
                        key={cert}
                        onClick={() => handleAddCertification(cert)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.certifications?.includes(cert)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {formData.certifications?.includes(cert) && <Check size={16} className="inline mr-1" />}
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Certification Input */}
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add custom certification..."
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCustomCert()
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddCustomCert}
                    className="px-4"
                  >
                    Add
                  </Button>
                </div>

                {/* Selected Certifications */}
                {formData.certifications && formData.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-green-50 rounded-lg">
                    {formData.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex items-center gap-2 bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                        {cert}
                        <button
                          onClick={() => handleRemoveCertification(index)}
                          className="hover:text-green-600"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages Section */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Languages</Label>

                {/* Predefined Languages as Cards */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleAddLanguage(lang)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.languages?.includes(lang)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {formData.languages?.includes(lang) && <Check size={16} className="inline mr-1" />}
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Selected Languages */}
                {formData.languages && formData.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-purple-50 rounded-lg">
                    {formData.languages.map((lang, index) => (
                      <span key={index} className="inline-flex items-center gap-2 bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {lang}
                        <button
                          onClick={() => handleRemoveLanguage(index)}
                          className="hover:text-purple-600"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
