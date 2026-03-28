'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { authAPI, profilesAPI, searchAPI, subscriptionAPI, aiAPI, usersAPI, verificationAPI, apiClient } from '@/lib/api'
import type { UpdateProfileRequest, ProfessionType } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Play, 
  Trash2,
  RefreshCw,
  Server,
  Database,
  Settings,
  Shield,
  Users,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'pending'
  message: string
  response?: any
  error?: string
  duration?: number
  method?: string
  path?: string
  statusCode?: number
  requiresAuth?: boolean
}

export default function APITestPage() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth()
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null)
  const [mounted, setMounted] = useState(false)

  // Get API base URL - only on client side
  const [API_BASE_URL, setAPI_BASE_URL] = useState('http://localhost:8080/api')
  const [API_ROOT_URL, setAPI_ROOT_URL] = useState('http://localhost:8080')

  // Initialize on client only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'
      setAPI_BASE_URL(baseUrl)
      setAPI_ROOT_URL(baseUrl.replace(/\/api\/?$/, ''))
      setMounted(true)
    }
  }, [])

  // Test data
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [testPassword, setTestPassword] = useState('password123')
  const [testProfileId, setTestProfileId] = useState('')
  const [testSearchQuery, setTestSearchQuery] = useState('lawyer')
  const [testUserId, setTestUserId] = useState('')

  // Profile test data
  const [profileTitle, setProfileTitle] = useState('Senior Chartered Accountant')
  const [profileBio, setProfileBio] = useState('Experienced tax consultant specializing in GST and corporate taxation.')
  const [professionType, setProfessionType] = useState<ProfessionType>('CA')

  const addResult = (result: TestResult) => {
    setResults((prev: TestResult[]) => [...prev, result])
  }

  const clearResults = () => {
    setResults([])
    setSelectedTest(null)
  }

  const runTest = async (
    name: string,
    testFn: () => Promise<any>,
    options: {
      requiresAuth?: boolean
      method?: string
      path?: string
    } = {}
  ) => {
    const { requiresAuth = false, method, path } = options

    if (requiresAuth && !isAuthenticated) {
      addResult({
        name,
        status: 'error',
        message: 'Authentication required',
        error: 'Please login first to test this endpoint',
        method,
        path,
        requiresAuth
      })
      return
    }

    const startTime = Date.now()
    
    addResult({
      name,
      status: 'pending',
      message: 'Testing...',
      method,
      path,
      requiresAuth
    })

    try {
      const response = await testFn()
      const responseData = response?.data ?? response
      const statusCode = response?.status
      const duration = Date.now() - startTime

      setResults((prev: TestResult[]) => prev.map((r: TestResult) => 
        r.name === name && r.status === 'pending'
          ? {
              name,
              status: 'success',
              message: `Success in ${duration}ms`,
              response: responseData,
              duration,
              method,
              path,
              statusCode,
              requiresAuth
            }
          : r
      ))
    } catch (error: any) {
      const duration = Date.now() - startTime

      setResults((prev: TestResult[]) => prev.map((r: TestResult) => 
        r.name === name && r.status === 'pending'
          ? {
              name,
              status: 'error',
              message: `Failed in ${duration}ms`,
              error: error.message || 'Unknown error',
              duration,
              method,
              path,
              requiresAuth
            }
          : r
      ))
    }
  }

  // Test Functions
  const testHealthCheck = async () => {
    const response = await fetch(`${API_ROOT_URL}/health`)
    const data = await response.json()
    return { status: response.status, data }
  }

  const testRegister = async () => {
    return await authAPI.register({
      email: testEmail,
      password: testPassword,
      first_name: 'Test',
      last_name: 'User',
      role: 'APPRENTICE'
    })
  }

  const testLogin = async () => {
    return await authAPI.login({
      email: testEmail,
      password: testPassword
    })
  }

  const testGetMe = async () => {
    return await authAPI.getMe()
  }

  const testSearchTags = async () => {
    return await searchAPI.getTags()
  }

  const testSearchSuggestions = async () => {
    return await searchAPI.getSuggestions(testSearchQuery)
  }

  const testSearchProfiles = async () => {
    return await searchAPI.search({
      query: testSearchQuery,
      page: 1,
      limit: 10
    })
  }

  const testGetProfile = async () => {
    if (!testProfileId) throw new Error('Profile ID required')
    return await profilesAPI.getProfile(testProfileId)
  }

  const testGetMyProfile = async () => {
    return await profilesAPI.getMyProfile()
  }

  const testGetSubscription = async () => {
    return await subscriptionAPI.getSubscription()
  }

  const testGetUsageStats = async () => {
    return await subscriptionAPI.getUsageStats()
  }

  const testAISuggestTags = async () => {
    return await aiAPI.suggestTags({
      text: 'Experienced tax consultant specializing in GST and corporate taxation',
      profession_type: 'CA'
    })
  }

  const testRefreshToken = async () => {
    if (typeof window === 'undefined') throw new Error('Refresh token not available')
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) throw new Error('No refresh token found in storage')
    return await authAPI.refreshToken(refreshToken)
  }

  const testLogout = async () => {
    // Call API logout and then auth context logout to clear auth state
    await authAPI.logout()
    // The auth context's logout function clears the user state, token, and localStorage
    await logout()
  }

  // Profile workflow tests
  const testCreateProfile = async () => {
    const profileData: UpdateProfileRequest = {
      profession_type: professionType,
      title: profileTitle,
      bio: profileBio,
      skills: ['tax-planning', 'corporate-taxation'],
      location: 'San Francisco',
      state: 'CA',
      experience_years: 10,
      availability: 'AVAILABLE'
    }
    return await profilesAPI.createProfile(profileData)
  }

  const testUpdateProfile = async () => {
    const profileData: UpdateProfileRequest = {
      title: `${profileTitle} (Updated)`,
      bio: `${profileBio} Last updated: ${new Date().toISOString()}`
    }
    return await profilesAPI.updateProfile(profileData)
  }

  const testDeleteProfile = async () => {
    if (!testProfileId) throw new Error('Profile ID required')
    return await profilesAPI.deleteProfile(testProfileId)
  }

  // Admin workflow tests
  const testListUsers = async () => {
    return await usersAPI.listUsers(1, 10)
  }

  const testGetUser = async () => {
    if (!testUserId) throw new Error('User ID required')
    return await usersAPI.getUser(testUserId)
  }

  const testUpdateUser = async () => {
    if (!testUserId) throw new Error('User ID required')
    return await usersAPI.updateUser(testUserId, {
      first_name: 'Updated',
      last_name: 'User'
    })
  }

  // Subscription workflow tests
  const testUpgradePremium = async () => {
    return await subscriptionAPI.upgradeToPremium()
  }

  const testDowngradeFree = async () => {
    return await subscriptionAPI.downgradeToFree()
  }

  // Verification workflow tests
  const testGetMyDocuments = async () => {
    return await verificationAPI.getMyDocuments()
  }

  const testAdminListPending = async () => {
    return await verificationAPI.adminListPending()
  }

  const testAdminListAll = async () => {
    return await verificationAPI.adminListAll()
  }

  const runAllTests = async () => {
    setLoading(true)
    clearResults()

    // Public endpoints
    await runTest('Health Check', testHealthCheck, { method: 'GET', path: '/health' })
    await runTest('Get Search Tags', testSearchTags, { method: 'GET', path: '/api/search/tags' })
    await runTest('Search Suggestions', testSearchSuggestions, { method: 'GET', path: '/api/search/suggestions' })
    await runTest('Search Profiles', testSearchProfiles, { method: 'GET', path: '/api/search' })

    // Auth endpoints (if logged in)
    if (isAuthenticated) {
      await runTest('Get Current User', testGetMe, { requiresAuth: true, method: 'GET', path: '/api/auth/me' })
      await runTest('Get My Profile', testGetMyProfile, { requiresAuth: true, method: 'GET', path: '/api/profiles/me' })
      await runTest('Get Subscription', testGetSubscription, { requiresAuth: true, method: 'GET', path: '/api/subscription' })
      await runTest('Get Usage Stats', testGetUsageStats, { requiresAuth: true, method: 'GET', path: '/api/subscription/usage' })
      await runTest('AI Suggest Tags', testAISuggestTags, { requiresAuth: true, method: 'POST', path: '/api/ai/suggest-tags' })
    }

    setLoading(false)
    toast.success('All tests completed')
  }

  const runFullSmoke = async () => {
    setLoading(true)
    clearResults()
    toast.info('Running full integration smoke test...')

    // === PUBLIC TIER ===
    const publicTests = [
      { name: 'Health Check', fn: testHealthCheck, opts: { method: 'GET', path: '/health' } },
      { name: 'Get Search Tags', fn: testSearchTags, opts: { method: 'GET', path: '/api/search/tags' } },
      { name: 'Search Profiles', fn: testSearchProfiles, opts: { method: 'GET', path: '/api/search' } },
    ]

    for (const t of publicTests) {
      await runTest(t.name, t.fn, t.opts)
      await new Promise(r => setTimeout(r, 300))
    }

    // === AUTHENTICATED TIER ===
    if (isAuthenticated) {
      const authTests = [
        { name: 'Get Current User', fn: testGetMe, opts: { requiresAuth: true, method: 'GET', path: '/api/auth/me' } },
        { name: 'Get My Profile', fn: testGetMyProfile, opts: { requiresAuth: true, method: 'GET', path: '/api/profiles/me' } },
        { name: 'Get Subscription', fn: testGetSubscription, opts: { requiresAuth: true, method: 'GET', path: '/api/subscription' } },
        { name: 'Get Usage Stats', fn: testGetUsageStats, opts: { requiresAuth: true, method: 'GET', path: '/api/subscription/usage' } },
        { name: 'AI Suggest Tags', fn: testAISuggestTags, opts: { requiresAuth: true, method: 'POST', path: '/api/ai/suggest-tags' } },
      ]

      for (const t of authTests) {
        await runTest(t.name, t.fn, t.opts)
        await new Promise(r => setTimeout(r, 300))
      }

      // === PROFILE WORKFLOW ===
      const isAdmin = user?.role === 'ADMIN'
      if (!isAdmin) {
        const profileTests = [
          { name: 'Create Profile', fn: testCreateProfile, opts: { requiresAuth: true, method: 'POST', path: '/api/profiles' } },
          { name: 'Get My Profile', fn: testGetMyProfile, opts: { requiresAuth: true, method: 'GET', path: '/api/profiles/me' } },
          { name: 'Update Profile', fn: testUpdateProfile, opts: { requiresAuth: true, method: 'PUT', path: '/api/profiles' } },
        ]

        for (const t of profileTests) {
          await runTest(t.name, t.fn, t.opts)
          await new Promise(r => setTimeout(r, 300))
        }
      }

      // === SUBSCRIPTION WORKFLOW ===
      const subTests = [
        { name: 'Upgrade to Premium', fn: testUpgradePremium, opts: { requiresAuth: true, method: 'POST', path: '/api/subscription/upgrade' } },
        { name: 'Downgrade to Free', fn: testDowngradeFree, opts: { requiresAuth: true, method: 'POST', path: '/api/subscription/downgrade' } },
      ]

      for (const t of subTests) {
        await runTest(t.name, t.fn, t.opts)
        await new Promise(r => setTimeout(r, 300))
      }

      // === ADMIN ONLY ===
      if (isAdmin) {
        const adminTests = [
          { name: 'List Users (Admin)', fn: testListUsers, opts: { requiresAuth: true, method: 'GET', path: '/api/users' } },
        ]

        for (const t of adminTests) {
          await runTest(t.name, t.fn, t.opts)
          await new Promise(r => setTimeout(r, 300))
        }
      }

      // === TOKEN LIFECYCLE - DO NOT LOGOUT YET ===
      const tokenTests = [
        { name: 'Refresh Token', fn: testRefreshToken, opts: { requiresAuth: true, method: 'POST', path: '/api/auth/refresh' } },
      ]

      for (const t of tokenTests) {
        await runTest(t.name, t.fn, t.opts)
        await new Promise(r => setTimeout(r, 300))
      }

      // === FINAL ENDPOINT TESTS BEFORE LOGOUT ===
      const finalTests = [
        { name: 'Search (Post-Auth)', fn: testSearchProfiles, opts: { method: 'GET', path: '/api/search' } },
        { name: 'Health Check (Final)', fn: testHealthCheck, opts: { method: 'GET', path: '/health' } },
      ]

      for (const t of finalTests) {
        await runTest(t.name, t.fn, t.opts)
        await new Promise(r => setTimeout(r, 300))
      }

      // === LOGOUT (LAST) - INVALIDATES TOKEN ===
      await runTest('Logout', testLogout, { requiresAuth: true, method: 'POST', path: '/api/auth/logout' })
    }

    setLoading(false)
    
    const passed = results.filter(r => r.status === 'success').length
    const failed = results.filter(r => r.status === 'error').length
    toast.success(`Smoke test complete: ${passed} passed, ${failed} failed`)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'pending':
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Show loading during hydration */}
        {!mounted && (
          <Card className="mb-8">
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading test dashboard...</p>
            </CardContent>
          </Card>
        )}

        {mounted && (
          <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Testing Dashboard</h1>
              <p className="text-gray-600 mt-2">Test all backend endpoints and verify integration</p>
            </div>
            {authLoading ? (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading auth...
              </Badge>
            ) : (
              <Badge variant={isAuthenticated && user ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                {isAuthenticated && user ? `Logged in as ${user.email}` : 'Not authenticated'}
              </Badge>
            )}
          </div>

          {/* Backend Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Backend API</p>
                    <p className="text-sm text-gray-600">{API_BASE_URL}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => runTest('Health Check', testHealthCheck, { method: 'GET', path: '/health' })}
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="quick" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="quick">Quick Tests</TabsTrigger>
            <TabsTrigger value="smoke">Full Smoke</TabsTrigger>
            <TabsTrigger value="manual">Manual Tests</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="results">Results ({results.length})</TabsTrigger>
          </TabsList>

          {/* Quick Tests Tab */}
          <TabsContent value="quick" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Test Suite</CardTitle>
                <CardDescription>Run basic connectivity tests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    onClick={runAllTests}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running Tests...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run All Tests
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearResults}
                    disabled={loading || results.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Results
                  </Button>
                </div>

                {!isAuthenticated && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ You're not authenticated. Some tests will be skipped. Login first to test all endpoints.
                    </p>
                  </div>
                )}

                {/* Test Progress */}
                {results.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>
                        {results.filter(r => r.status !== 'pending').length} / {results.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(results.filter(r => r.status !== 'pending').length / results.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Results Summary */}
            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Success</p>
                        <p className="text-2xl font-bold text-green-600">
                          {results.filter(r => r.status === 'success').length}
                        </p>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Failed</p>
                        <p className="text-2xl font-bold text-red-600">
                          {results.filter(r => r.status === 'error').length}
                        </p>
                      </div>
                      <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {results.filter(r => r.status === 'pending').length}
                        </p>
                      </div>
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Full Smoke Test Tab */}
          <TabsContent value="smoke" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Full Integration Smoke Test
                </CardTitle>
                <CardDescription>Complete end-to-end verification of all endpoint groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900">What this test covers:</p>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                    <li>Public endpoints (health, search, tags)</li>
                    <li>Authentication flows (login, refresh, logout)</li>
                    <li>Profile management (create, read, update)</li>
                    <li>Subscription operations (upgrade, downgrade)</li>
                    <li>Admin endpoints (user listing) — if you're an admin</li>
                    <li>AI features (tag suggestions)</li>
                  </ul>
                </div>

                <Button
                  onClick={runFullSmoke}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Running Smoke Test...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Start Full Smoke Test
                    </>
                  )}
                </Button>

                {results.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>
                        {results.filter(r => r.status !== 'pending').length} / {results.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${(results.filter(r => r.status !== 'pending').length / results.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Success</p>
                            <p className="text-2xl font-bold text-green-600">
                              {results.filter(r => r.status === 'success').length}
                            </p>
                          </div>
                          <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Failed</p>
                            <p className="text-2xl font-bold text-red-600">
                              {results.filter(r => r.status === 'error').length}
                            </p>
                          </div>
                          <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {results.filter(r => r.status === 'pending').length}
                            </p>
                          </div>
                          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Tests Tab */}
          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Public Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Public Endpoints</CardTitle>
                  <CardDescription>No authentication required</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Health Check', testHealthCheck, { method: 'GET', path: '/health' })}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /health
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Get Search Tags', testSearchTags, { method: 'GET', path: '/api/search/tags' })}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /search/tags
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Search Suggestions', testSearchSuggestions, { method: 'GET', path: '/api/search/suggestions' })}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /search/suggestions
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="searchQuery">Search Query</Label>
                    <div className="flex gap-2">
                      <Input
                        id="searchQuery"
                        value={testSearchQuery}
                        onChange={(e) => setTestSearchQuery(e.target.value)}
                        placeholder="Enter search term"
                      />
                      <Button
                        onClick={() => runTest('Search Profiles', testSearchProfiles, { method: 'GET', path: '/api/search' })}
                      >
                        Search
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileId">Profile ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="profileId"
                        value={testProfileId}
                        onChange={(e) => setTestProfileId(e.target.value)}
                        placeholder="Enter profile UUID"
                      />
                      <Button
                        onClick={() => runTest('Get Profile', testGetProfile, { method: 'GET', path: '/api/profiles/:id' })}
                        disabled={!testProfileId}
                      >
                        Get
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Protected Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Protected Endpoints</CardTitle>
                  <CardDescription>Authentication required</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Get Current User', testGetMe, { requiresAuth: true, method: 'GET', path: '/api/auth/me' })}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /auth/me
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Get My Profile', testGetMyProfile, { requiresAuth: true, method: 'GET', path: '/api/profiles/me' })}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /profiles/me
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Get Subscription', testGetSubscription, { requiresAuth: true, method: 'GET', path: '/api/subscription' })}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /subscription
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Get Usage Stats', testGetUsageStats, { requiresAuth: true, method: 'GET', path: '/api/subscription/usage' })}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /subscription/usage
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('AI Suggest Tags', testAISuggestTags, { requiresAuth: true, method: 'POST', path: '/api/ai/suggest-tags' })}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    POST /ai/suggest-tags
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Refresh Token', testRefreshToken, { requiresAuth: true, method: 'POST', path: '/api/auth/refresh' })}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    POST /auth/refresh
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Logout', testLogout, { requiresAuth: true, method: 'POST', path: '/api/auth/logout' })}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    POST /auth/logout
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                      Please login to test these endpoints
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile Workflow */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5" />
                    Profile Workflow
                  </CardTitle>
                  <CardDescription>Create, update, and manage profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!isAuthenticated && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                      Please login first to test profile operations
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="profTitle">Profile Title</Label>
                    <Input
                      id="profTitle"
                      value={profileTitle}
                      onChange={(e) => setProfileTitle(e.target.value)}
                      placeholder="e.g., Senior Chartered Accountant"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profBio">Bio</Label>
                    <Textarea
                      id="profBio"
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      placeholder="Brief description of your services"
                      className="h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profType">Profession Type</Label>
                    <select
                      id="profType"
                      value={professionType}
                      onChange={(e) => setProfessionType(e.target.value as ProfessionType)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="CA">Chartered Accountant</option>
                      <option value="CA_APPRENTICE">CA Apprentice</option>
                      <option value="LAWYER">Lawyer</option>
                      <option value="ADVOCATE">Advocate</option>
                      <option value="LAW_FIRM">Law Firm</option>
                      <option value="CA_FIRM">CA Firm</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => runTest('Create Profile', testCreateProfile, { requiresAuth: true, method: 'POST', path: '/api/profiles' })}
                      disabled={!isAuthenticated || loading}
                      className="w-full"
                    >
                      Create Profile
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => runTest('Update Profile', testUpdateProfile, { requiresAuth: true, method: 'PUT', path: '/api/profiles' })}
                      disabled={!isAuthenticated || loading}
                      className="w-full"
                    >
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Workflow */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="w-5 h-5" />
                    Subscription Workflow
                  </CardTitle>
                  <CardDescription>Manage plan upgrades and downgrades</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!isAuthenticated && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                      Please login first to test subscription operations
                    </div>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                    <p className="text-sm font-semibold text-green-900">Current Plan:</p>
                    <p className="text-2xl font-bold text-green-600">{user?.role === 'ADMIN' ? 'Admin' : 'User'}</p>
                  </div>

                  <Button
                    onClick={() => runTest('Upgrade to Premium', testUpgradePremium, { requiresAuth: true, method: 'POST', path: '/api/subscription/upgrade' })}
                    disabled={!isAuthenticated || loading}
                    className="w-full"
                  >
                    Upgrade to Premium
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => runTest('Downgrade to Free', testDowngradeFree, { requiresAuth: true, method: 'POST', path: '/api/subscription/downgrade' })}
                    disabled={!isAuthenticated || loading}
                    className="w-full"
                  >
                    Downgrade to Free
                  </Button>
                </CardContent>
              </Card>

              {/* Verification Workflow */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5" />
                    Verification
                  </CardTitle>
                  <CardDescription>Document verification management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!isAuthenticated && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                      Please login first to test verification operations
                    </div>
                  )}

                  <Button
                    onClick={() => runTest('Get My Documents', testGetMyDocuments, { requiresAuth: true, method: 'GET', path: '/api/verification/documents' })}
                    disabled={!isAuthenticated || loading}
                    className="w-full"
                  >
                    Get My Documents
                  </Button>

                  {user?.role === 'ADMIN' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => runTest('List Pending Verifications', testAdminListPending, { requiresAuth: true, method: 'GET', path: '/api/admin/verification/pending' })}
                        disabled={!isAuthenticated || loading}
                        className="w-full"
                      >
                        List Pending (Admin)
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => runTest('List All Verifications', testAdminListAll, { requiresAuth: true, method: 'GET', path: '/api/admin/verification/all' })}
                        disabled={!isAuthenticated || loading}
                        className="w-full"
                      >
                        List All (Admin)
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Admin Panel */}
              {user?.role === 'ADMIN' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="w-5 h-5" />
                      Admin Panel
                    </CardTitle>
                    <CardDescription>User management and verification</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="userId">User ID (for operations)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="userId"
                          value={testUserId}
                          onChange={(e) => setTestUserId(e.target.value)}
                          placeholder="Enter user UUID"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => runTest('List Users (Admin)', testListUsers, { requiresAuth: true, method: 'GET', path: '/api/users' })}
                      disabled={!isAuthenticated || loading}
                      className="w-full"
                    >
                      List All Users
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => runTest('Get User', testGetUser, { requiresAuth: true, method: 'GET', path: '/api/users/:id' })}
                      disabled={!isAuthenticated || !testUserId || loading}
                      className="w-full"
                    >
                      Get User Details
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => runTest('Update User', testUpdateUser, { requiresAuth: true, method: 'PUT', path: '/api/users/:id' })}
                      disabled={!isAuthenticated || !testUserId || loading}
                      className="w-full"
                    >
                      Update User
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            {results.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No test results yet. Run some tests to see results here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Results List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                    <CardDescription>Click on a result to view details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-2">
                        {results.map((result, index) => (
                          <div
                            key={index}
                            onClick={() => setSelectedTest(result)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${getStatusColor(result.status)} ${
                              selectedTest === result ? 'ring-2 ring-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getStatusIcon(result.status)}
                                  <h3 className="font-semibold text-sm">{result.name}</h3>
                                </div>
                                <p className="text-xs text-gray-600">{result.message}</p>
                                {result.duration && (
                                  <p className="text-xs text-gray-500 mt-1">{result.duration}ms</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Result Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>Response data and errors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedTest ? (
                      <ScrollArea className="h-[600px]">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-semibold">Test Name</Label>
                            <p className="text-sm mt-1">{selectedTest.name}</p>
                          </div>

                          {(selectedTest.method || selectedTest.path) && (
                            <div>
                              <Label className="text-sm font-semibold">Request</Label>
                              <p className="text-sm mt-1">
                                {selectedTest.method ? `${selectedTest.method} ` : ''}
                                {selectedTest.path || ''}
                              </p>
                              {selectedTest.requiresAuth && (
                                <p className="text-xs text-amber-700 mt-1">Authentication required</p>
                              )}
                            </div>
                          )}

                          <div>
                            <Label className="text-sm font-semibold">Status</Label>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(selectedTest.status)}
                              <Badge variant={selectedTest.status === 'success' ? 'default' : 'destructive'}>
                                {selectedTest.status}
                              </Badge>
                              {selectedTest.statusCode && (
                                <Badge variant="secondary">{selectedTest.statusCode}</Badge>
                              )}
                            </div>
                          </div>

                          {selectedTest.error && (
                            <div>
                              <Label className="text-sm font-semibold text-red-600">Error</Label>
                              <pre className="text-xs bg-red-50 p-3 rounded mt-1 overflow-auto">
                                {selectedTest.error}
                              </pre>
                            </div>
                          )}

                          {selectedTest.response && (
                            <div>
                              <Label className="text-sm font-semibold text-green-600">Response</Label>
                              <pre className="text-xs bg-gray-50 p-3 rounded mt-1 overflow-auto">
                                {JSON.stringify(selectedTest.response, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="h-[600px] flex items-center justify-center text-gray-500">
                        Select a test result to view details
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </>
        )}
      </div>
    </div>
  )
}
