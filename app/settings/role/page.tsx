"use client"

import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, Briefcase, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import { usersAPI } from "@/lib/api"

export default function RoleSettingsPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRoleChange = async (newRole: 'APPRENTICE' | 'PROFESSIONAL') => {
    if (!user) return
    
    if (user.role === newRole) {
      setError(`You are already an ${newRole}`)
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Call API to update user role
      await usersAPI.updateUser(user.id, { role: newRole })
      
      // Refresh user data
      await refreshUser()
      
      setSuccess(`Successfully switched to ${newRole} mode!`)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to update role. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-text-primary">Account Role Settings</h1>
          <p className="text-text-secondary mt-2">
            Choose how you want to use CounselMate
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your current role: <strong>{user.role}</strong>. You can switch between Apprentice (client) and Professional modes anytime.
            </AlertDescription>
          </Alert>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Apprentice/Client Mode */}
          <Card className={`relative overflow-hidden transition-all duration-300 ${user.role === 'APPRENTICE' ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'}`}>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                {user.role === 'APPRENTICE' && (
                  <Badge variant="default">Current</Badge>
                )}
              </div>
              <CardTitle className="text-2xl">Apprentice Mode</CardTitle>
              <CardDescription>Find and hire professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">Search and browse verified professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">Book consultations and services</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">Access to messaging and support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">Perfect for clients seeking help</span>
                </li>
              </ul>
              
              {user.role !== 'APPRENTICE' ? (
                <Button 
                  onClick={() => handleRoleChange('APPRENTICE')} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Switching...
                    </>
                  ) : (
                    <>
                      Switch to Apprentice
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Current Mode
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Professional Mode */}
          <Card className={`relative overflow-hidden transition-all duration-300 ${user.role === 'PROFESSIONAL' ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:shadow-lg'}`}>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                {user.role === 'PROFESSIONAL' && (
                  <Badge variant="default" className="bg-indigo-600">Current</Badge>
                )}
              </div>
              <CardTitle className="text-2xl">Professional Mode</CardTitle>
              <CardDescription>Offer your services to clients</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">Create professional profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">Get discovered by clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">Manage bookings and consultations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">Perfect for CAs and Lawyers</span>
                </li>
              </ul>
              
              {user.role !== 'PROFESSIONAL' ? (
                <Button 
                  onClick={() => handleRoleChange('PROFESSIONAL')} 
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Switching...
                    </>
                  ) : (
                    <>
                      Switch to Professional
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Current Mode
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary mb-4">
                You can switch between roles at any time. Your account data will be preserved. If you're a CA or Lawyer looking to offer services, switch to Professional mode. If you're seeking professional help, use Apprentice mode.
              </p>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
