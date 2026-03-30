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
import { PROFESSION_SKILLS, CERTIFICATIONS, LANGUAGES, PROFESSION_TITLES } from "@/lib/professional-data"
import type { ProfessionType, UpdateProfileRequest, Profile } from "@/lib/api/types"

const ALLOWED_PROFESSION_TYPES: ProfessionType[] = [
  'POWER_OF_ATTORNEY',
  'MARRIAGE_REGISTRATION',
  'LEGAL_HEIR_CERTIFICATE',
]

const normalizeProfessionType = (value?: string): ProfessionType => {
  const typedValue = value as ProfessionType | undefined
  if (typedValue && ALLOWED_PROFESSION_TYPES.includes(typedValue)) {
    return typedValue
  }
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

  // Load existing profile
  useEffect(() => {
    if (user && user.role === 'PROFESSIONAL' && isAuthenticated) {
      setIsLoadingProfile(true)
      profilesAPI.getMyProfile()
        .then((profile: Profile) => {
          const normalizedProfessionType = normalizeProfessionType(profile.profession_type)

          setMode('edit')
          setProfileId(profile.id)
          setFormData({
            profession_type: normalizedProfessionType,
            title: profile.title || '',
            bio: profile.bio || '',
            skills: profile.skills || [],
            location: profile.location || '',
            city: profile.city || '',
            state: profile.state || '',
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
        .catch(() => {
          setMode('create')
          setProfileId(null)
          setFormData({
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
        })
        .finally(() => setIsLoadingProfile(false))
    }
  }, [user, isAuthenticated, router])

  if (loading || isLoadingProfile) {
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
  const availableTitles = PROFESSION_TITLES[professionType] || []

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
      if (mode === 'create') {
        await profilesAPI.createProfile(formData)
      } else {
        await profilesAPI.updateProfile(formData)
      }
      
      // Refresh profile data from backend
      const updatedProfile = await profilesAPI.getMyProfile()
      
      // Update form with fresh data
      if (updatedProfile) {
        setMode('edit')
        setProfileId(updatedProfile.id)
        setFormData({
          title: updatedProfile.title || '',
          bio: updatedProfile.bio || '',
          profession_type: normalizeProfessionType(updatedProfile.profession_type),
          experience_years: updatedProfile.experience_years || 0,
          city: updatedProfile.city || '',
          state: updatedProfile.state || '',
          location: updatedProfile.location || '',
          availability: updatedProfile.availability || 'AVAILABLE',
          hourly_rate: updatedProfile.hourly_rate || undefined,
          skills: updatedProfile.skills || [],
          certifications: updatedProfile.certifications || [],
          languages: updatedProfile.languages || [],
          profile_picture: updatedProfile.profile_picture || '',
          linkedin_url: updatedProfile.linkedin_url || '',
          website_url: updatedProfile.website_url || '',
        })
      }
      
      toast.success(mode === 'create' ? 'Professional profile created successfully!' : 'Professional profile updated successfully!')
      router.push('/dashboard')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : (mode === 'create' ? 'Failed to create profile' : 'Failed to update profile')
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!profileId) {
      toast.error('Profile ID not found')
      return
    }

    setIsDeleting(true)
    try {
      await profilesAPI.deleteProfile(profileId)
      toast.success('Professional profile deleted successfully!')
      router.push('/dashboard')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete profile'
      toast.error(errorMsg)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">{mode === 'create' ? 'Create Professional Profile' : 'Edit Professional Profile'}</h1>
            <p className="text-gray-600 mt-2">{mode === 'create' ? 'Complete your profile to attract clients' : 'Update your information to attract more clients'}</p>
          </div>
        </div>

        {/* Form - Single Page */}
        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            
            <div className="space-y-4">
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
                <Label htmlFor="title">Professional Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Tax Consultant"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                {availableTitles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableTitles.map((title) => (
                      <button
                        key={title}
                        onClick={() => setFormData({ ...formData, title })}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 rounded-lg text-gray-700 hover:text-blue-700 transition"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="bio">Bio / About You *</Label>
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
            </div>
          </div>

          {/* Section 2: Location & Rates */}
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold mb-6">Location & Rates</h2>
            
            <div className="space-y-4">
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
                <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min="0"
                  placeholder="e.g., 2000"
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
            </div>
          </div>

          {/* Section 3: Skills */}
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold mb-6">Skills</h2>
            
            <div className="space-y-4">
              {/* Predefined Skills as Cards */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Quick add for {professionType}:</p>
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
              <div className="flex gap-2">
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
          </div>

          {/* Section 4: Certifications */}
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold mb-6">Certifications</h2>
            
            <div className="space-y-4">
              {/* Predefined Certifications as Cards */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Common certifications:</p>
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
              <div className="flex gap-2">
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
          </div>

          {/* Section 5: Languages */}
          <div className="pb-8">
            <h2 className="text-2xl font-bold mb-6">Languages</h2>
            
            <div className="space-y-4">
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
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Profile' : 'Save Changes'}
              </Button>
            </div>

            {/* Delete Button */}
            {mode === 'edit' && !showDeleteConfirm && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Delete Profile
              </Button>
            )}

            {/* Delete Confirmation */}
            {mode === 'edit' && showDeleteConfirm && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                <p className="text-sm font-medium text-red-900">
                  Are you sure you want to delete your profile? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
