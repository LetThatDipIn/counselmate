"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, UserPlus, Shield, Calendar, TrendingUp } from "lucide-react"

export default function DashboardPage() {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Welcome back, {user.first_name || 'User'}! 👋
              </h1>
              <p className="text-text-secondary mt-2">
                {user.role === 'PROFESSIONAL' 
                  ? 'Manage your professional profile and services'
                  : 'Find and connect with verified professionals'}
              </p>
            </div>
            <Badge variant={user.role === 'PROFESSIONAL' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {user.role}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client/Apprentice Dashboard */}
        {user.role === 'APPRENTICE' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Find Professional Help</CardTitle>
                <CardDescription>Search and connect with verified CAs and Lawyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={() => router.push('/professionals')} className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Browse Professionals
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.is_verified ? 'Verified' : 'Unverified'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email: {user.is_verified ? 'Confirmed' : 'Pending'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatDate(user.created_at)}</div>
                  <p className="text-xs text-muted-foreground">
                    Login via {user.auth_provider}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => router.push('/profile')} className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Complete these steps to get the most out of CounselMate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user.is_verified && user.auth_provider === 'LOCAL' && (
                  <div className="flex items-center justify-between p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-400">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <div>
                        <p className="font-medium text-amber-900">Verify your email</p>
                        <p className="text-sm text-amber-700">Check your inbox for the verification link</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-900">Pending</Badge>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300"></div>
                    <div>
                      <p className="font-medium">Browse professionals</p>
                      <p className="text-sm text-text-secondary">Find the right expert for your needs</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push('/professionals')}>
                    Browse
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300"></div>
                    <div>
                      <p className="font-medium">Want to become a professional?</p>
                      <p className="text-sm text-text-secondary">Switch your account to professional mode</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push('/settings/role')}>
                    Switch Role
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Professional Dashboard */}
        {user.role === 'PROFESSIONAL' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Profile</CardTitle>
                <CardDescription>Create your professional profile to get discovered by clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-text-secondary">
                    Set up your professional profile with your expertise, skills, and services to connect with clients looking for professional help.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={() => router.push('/professionals')}>
                      View All Professionals
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/profile')}>
                      My Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.is_verified ? 'Verified' : 'Unverified'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Professional account active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    No profile created yet
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatDate(user.created_at)}</div>
                  <p className="text-xs text-muted-foreground">
                    Professional member
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Getting Started as a Professional</CardTitle>
                <CardDescription>Complete your profile to start connecting with clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${user.is_verified ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {user.is_verified && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div>
                      <p className="font-medium">Verify your email</p>
                      <p className="text-sm text-text-secondary">Confirm your professional email</p>
                    </div>
                  </div>
                  {user.is_verified ? (
                    <Badge variant="default">Complete</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300"></div>
                    <div>
                      <p className="font-medium">Create professional profile</p>
                      <p className="text-sm text-text-secondary">Add your expertise and services</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300"></div>
                    <div>
                      <p className="font-medium">Get verified</p>
                      <p className="text-sm text-text-secondary">Submit credentials for verification</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
