'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  Star, MapPin, Award, DollarSign, Calendar, Globe, Linkedin, 
  Mail, Shield, Briefcase, Languages, FileText, CheckCircle, Loader2 
} from 'lucide-react'
import { useProfile } from '@/lib/api'
import { profilesAPI } from '@/lib/api'
import { useAuth } from '@/lib/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function ProfessionalProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { profile, loading, error } = useProfile(params.id as string)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  })

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

  const handleContact = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact this professional')
      router.push('/auth/login')
      return
    }

    if (!contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all fields')
      return
    }

    setContactLoading(true)
    try {
      await profilesAPI.contactProfile(params.id as string, contactForm)
      toast.success('Message sent successfully!')
      setContactDialogOpen(false)
      setContactForm({ subject: '', message: '' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setContactLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h1>
          <p className="text-gray-600">The professional you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-xl">
              {profile.profile_picture ? (
                <img src={profile.profile_picture} alt={profile.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-bold text-4xl">
                  {profile.title?.charAt(0) || 'P'}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.title}</h1>
                  <p className="text-blue-100 text-lg font-medium">{getProfessionLabel(profile.profession_type)}</p>
                </div>
                {profile.is_verified && (
                  <Badge className="bg-green-500 text-white flex items-center gap-1 px-3 py-1">
                    <Shield className="w-4 h-4" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-blue-100 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.city || profile.state || profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{profile.experience_years}+ years experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                  <span>({profile.review_count} reviews)</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Professional
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact {profile.title}</DialogTitle>
                      <DialogDescription>
                        Send a message to this professional. They'll receive it via email.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="e.g., Tax consultation inquiry"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Describe your requirements..."
                          rows={6}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleContact} className="w-full" disabled={contactLoading}>
                        {contactLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Message
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.bio || 'No bio available.'}</p>
              </CardContent>
            </Card>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {profile.certifications?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {profile.certifications.map((cert: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pricing */}
            {profile.hourly_rate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-1">
                    ₹{profile.hourly_rate}
                    <span className="text-lg text-gray-600 font-normal">/hour</span>
                  </div>
                  <p className="text-sm text-gray-600">Consultation rate</p>
                </CardContent>
              </Card>
            )}

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={profile.availability === 'AVAILABLE' ? 'default' : 'secondary'}>
                  {profile.availability?.replace('_', ' ')}
                </Badge>
              </CardContent>
            </Card>

            {/* Languages */}
            {profile.languages?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang: string, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Website</span>
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
