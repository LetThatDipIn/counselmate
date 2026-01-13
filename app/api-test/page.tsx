'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { authAPI, profilesAPI, searchAPI, subscriptionAPI, aiAPI, usersAPI, apiClient } from '@/lib/api'
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
  Database
} from 'lucide-react'
import { toast } from 'sonner'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'pending'
  message: string
  response?: any
  error?: string
  duration?: number
}

export default function APITestPage() {
  const { user, isAuthenticated } = useAuth()
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null)

  // Test data
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [testPassword, setTestPassword] = useState('password123')
  const [testProfileId, setTestProfileId] = useState('')
  const [testSearchQuery, setTestSearchQuery] = useState('lawyer')

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result])
  }

  const clearResults = () => {
    setResults([])
    setSelectedTest(null)
  }

  const runTest = async (
    name: string, 
    testFn: () => Promise<any>,
    requiresAuth = false
  ) => {
    if (requiresAuth && !isAuthenticated) {
      addResult({
        name,
        status: 'error',
        message: 'Authentication required',
        error: 'Please login first to test this endpoint'
      })
      return
    }

    const startTime = Date.now()
    
    addResult({
      name,
      status: 'pending',
      message: 'Testing...'
    })

    try {
      const response = await testFn()
      const duration = Date.now() - startTime

      setResults(prev => prev.map(r => 
        r.name === name && r.status === 'pending'
          ? {
              name,
              status: 'success',
              message: `Success in ${duration}ms`,
              response,
              duration
            }
          : r
      ))
    } catch (error: any) {
      const duration = Date.now() - startTime

      setResults(prev => prev.map(r => 
        r.name === name && r.status === 'pending'
          ? {
              name,
              status: 'error',
              message: `Failed in ${duration}ms`,
              error: error.message || 'Unknown error',
              duration
            }
          : r
      ))
    }
  }

  // Test Functions
  const testHealthCheck = async () => {
    const response = await fetch('http://localhost:8080/health')
    return response.json()
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

  const runAllTests = async () => {
    setLoading(true)
    clearResults()

    // Public endpoints
    await runTest('Health Check', testHealthCheck)
    await runTest('Get Search Tags', testSearchTags)
    await runTest('Search Profiles', testSearchProfiles)

    // Auth endpoints (if logged in)
    if (isAuthenticated) {
      await runTest('Get Current User', testGetMe, true)
      await runTest('Get My Profile', testGetMyProfile, true)
      await runTest('Get Subscription', testGetSubscription, true)
      await runTest('Get Usage Stats', testGetUsageStats, true)
      await runTest('AI Suggest Tags', testAISuggestTags, true)
    }

    setLoading(false)
    toast.success('All tests completed')
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Testing Dashboard</h1>
              <p className="text-gray-600 mt-2">Test all backend endpoints and verify integration</p>
            </div>
            <Badge variant={isAuthenticated ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {isAuthenticated ? `Logged in as ${user?.email}` : 'Not authenticated'}
            </Badge>
          </div>

          {/* Backend Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Backend API</p>
                    <p className="text-sm text-gray-600">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => runTest('Health Check', testHealthCheck)}
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Quick Tests</TabsTrigger>
            <TabsTrigger value="manual">Manual Tests</TabsTrigger>
            <TabsTrigger value="results">Results ({results.length})</TabsTrigger>
          </TabsList>

          {/* Quick Tests Tab */}
          <TabsContent value="quick" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Test Suite</CardTitle>
                <CardDescription>Run all available tests automatically</CardDescription>
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
                    onClick={() => runTest('Health Check', testHealthCheck)}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /health
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Get Search Tags', testSearchTags)}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /search/tags
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
                        onClick={() => runTest('Search Profiles', testSearchProfiles)}
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
                        onClick={() => runTest('Get Profile', testGetProfile)}
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
                    onClick={() => runTest('Get Current User', testGetMe, true)}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /auth/me
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Get My Profile', testGetMyProfile, true)}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /profiles/me
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Get Subscription', testGetSubscription, true)}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /subscription
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('Get Usage Stats', testGetUsageStats, true)}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    GET /subscription/usage
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => runTest('AI Suggest Tags', testAISuggestTags, true)}
                    disabled={!isAuthenticated}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    POST /ai/suggest-tags
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

                          <div>
                            <Label className="text-sm font-semibold">Status</Label>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(selectedTest.status)}
                              <Badge variant={selectedTest.status === 'success' ? 'default' : 'destructive'}>
                                {selectedTest.status}
                              </Badge>
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
      </div>
    </div>
  )
}
