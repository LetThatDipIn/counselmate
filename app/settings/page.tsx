"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useEffect, useState } from "react"
import { usersAPI, authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ArrowRight, Lock, LogOut, AlertCircle, CheckCircle } from "lucide-react"

export default function SettingsPage() {
  const { user, isAuthenticated, loading, logout, refreshUser } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      })
    }
  }, [isAuthenticated, loading, router, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleSaveProfile = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast.error('First name and last name are required')
      return
    }

    setIsSaving(true)
    try {
      await usersAPI.updateUser(user.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
      })
      // Refresh the user data
      await refreshUser()
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                  1
                </span>
                Profile Information
              </h2>
              <p className="text-gray-600 mt-2 text-sm">Update your basic profile information</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label>Account Status</Label>
                <div className="flex items-center gap-2 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {user.is_verified ? 'Email Verified' : 'Email Not Verified'}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                  2
                </span>
                Account Type
              </h2>
              <p className="text-gray-600 mt-2 text-sm">Switch between client and professional roles</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                Current role: <span className="font-semibold">{user.role === 'PROFESSIONAL' ? 'Professional' : 'Client/Apprentice'}</span>
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/settings/role')}
            >
              Change Account Type <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Lock size={18} />
                Security
              </h2>
              <p className="text-gray-600 mt-2 text-sm">Manage your password and authentication</p>
            </div>

            {user.auth_provider === 'LOCAL' && (
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => router.push('/auth/forgot-password')}
              >
                Change Password
              </Button>
            )}

            {user.auth_provider === 'GOOGLE' && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">
                  Your account is protected with Google OAuth. Password changes are managed through your Google account.
                </p>
              </div>
            )}
          </div>

          {/* Verification */}
          {user.role === 'PROFESSIONAL' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                    3
                  </span>
                  Professional Verification
                </h2>
                <p className="text-gray-600 mt-2 text-sm">Submit documents to verify your credentials</p>
              </div>

              <Button
                className="w-full"
                onClick={() => router.push('/profile/verification')}
              >
                Submit Verification Documents <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-red-900 flex items-center gap-2">
                <AlertCircle size={18} />
                Danger Zone
              </h2>
              <p className="text-red-700 mt-2 text-sm">Irreversible actions</p>
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
