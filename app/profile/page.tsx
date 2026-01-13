"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Shield, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getUserInitials = () => {
    const firstInitial = user.first_name?.[0] || ''
    const lastInitial = user.last_name?.[0] || ''
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'U'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
          <p className="text-text-secondary mt-2">Manage your account information</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.profile_picture} alt={user.first_name} />
                  <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-text-secondary">First Name</Label>
                      <p className="text-lg font-medium text-text-primary">
                        {user.first_name || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-text-secondary">Last Name</Label>
                      <p className="text-lg font-medium text-text-primary">
                        {user.last_name || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-text-secondary flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <p className="text-lg font-medium text-text-primary">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-text-secondary flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Role
                      </Label>
                      <Badge variant={user.role === 'PROFESSIONAL' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account verification and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-sm text-text-secondary">Email Verified</p>
                    <p className="text-lg font-semibold text-text-primary">
                      {user.is_verified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                    {user.is_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-sm text-text-secondary">Account Status</p>
                    <p className="text-lg font-semibold text-text-primary">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <Badge variant={user.is_active ? 'default' : 'destructive'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-sm text-text-secondary flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </p>
                    <p className="text-lg font-semibold text-text-primary">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-sm text-text-secondary">Auth Provider</p>
                    <p className="text-lg font-semibold text-text-primary">
                      {user.auth_provider}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {user.auth_provider === 'GOOGLE' ? '🔗 Google' : '🔐 Local'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {user.role === 'PROFESSIONAL' && (
            <Card>
              <CardHeader>
                <CardTitle>Professional Profile</CardTitle>
                <CardDescription>Manage your professional information and services</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Create and manage your professional profile to be discovered by clients.
                </p>
                <Button variant="outline" onClick={() => router.push('/professionals')}>
                  View Professional Profiles
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
