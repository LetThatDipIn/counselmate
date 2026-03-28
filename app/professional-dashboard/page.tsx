"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  MessageSquare,
  Star,
  Loader,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { bookingsAPI, type Booking } from "@/lib/api/bookings"
import { profilesAPI } from "@/lib/api/profiles"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  totalEarnings: number
  averageRating: number
  totalReviews: number
}

export default function ProfessionalDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
  })
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)

        // Load consultant bookings
        const bookingsResult = await bookingsAPI.getConsultantBookings(1, 100)
        setBookings(bookingsResult.bookings || [])

        // Get user profile for rating and review info
        try {
          const profile = await profilesAPI.getMyProfile()
          setUserProfile(profile)
        } catch (err) {
          console.error("Error loading profile:", err)
        }

        // Calculate stats
        const completed = (bookingsResult.bookings || []).filter((b) => b.status === "COMPLETED").length
        const pending = (bookingsResult.bookings || []).filter(
          (b) => b.status === "PENDING" || b.status === "CONFIRMED"
        ).length
        const totalEarnings = (bookingsResult.bookings || [])
          .filter((b) => b.status === "COMPLETED" && b.service?.base_price)
          .reduce((sum, b) => sum + (b.service?.base_price || 0), 0)

        setStats({
          totalBookings: bookingsResult.bookings?.length || 0,
          completedBookings: completed,
          pendingBookings: pending,
          totalEarnings: totalEarnings,
          averageRating: profile?.rating || 0,
          totalReviews: profile?.review_count || 0,
        })
      } catch (err) {
        console.error("Error loading dashboard data:", err)
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [toast])

  const upcomingBookings = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "PENDING")
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, 5)

  const recentCompleted = bookings
    .filter((b) => b.status === "COMPLETED")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="container max-w-6xl py-12">
        <div className="space-y-4 text-center">
          <Loader className="w-12 h-12 mx-auto text-primary animate-spin" />
          <h1 className="text-2xl font-bold">Loading Dashboard</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Professional Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your bookings, earnings, and client interactions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">{stats.totalBookings}</div>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-green-600">{stats.completedBookings}</div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</div>
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">₹{stats.totalEarnings.toLocaleString("en-IN")}</div>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating and Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Ratings</CardTitle>
              <CardDescription>Your professional reputation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Average Rating</span>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(stats.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Reviews</span>
                <span className="font-semibold">{stats.totalReviews}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your statistics this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-semibold">
                  {stats.totalBookings > 0
                    ? ((stats.completedBookings / stats.totalBookings) * 100).toFixed(0)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width:
                      stats.totalBookings > 0
                        ? `${(stats.completedBookings / stats.totalBookings) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>{upcomingBookings.length} scheduled consultations</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-8 h-8 mx-auto opacity-50 mb-2" />
                <p>No upcoming bookings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-semibold">{booking.service?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.scheduled_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Badge variant="outline">{booking.status}</Badge>
                    <Link href={`/chat?booking=${booking.id}`}>
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Completed */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Completed</CardTitle>
            <CardDescription>{recentCompleted.length} completed consultations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCompleted.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto opacity-50 mb-2" />
                <p>No completed bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCompleted.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                    <div className="flex-1">
                      <p className="font-semibold">{booking.service?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Completed on {new Date(booking.updated_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <Badge className="bg-green-600">Completed</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
          <Link href="/chat">
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              View Messages
            </Button>
          </Link>
          <Link href="/bookings">
            <Button variant="outline">View All Bookings</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
