"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { bookingsAPI, type Booking } from "@/lib/api/bookings"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/context/auth-context"

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        const result = user?.role === "PROFESSIONAL"
          ? await bookingsAPI.getConsultantBookings(1, 50)
          : await bookingsAPI.getMyBookings(1, 50)
        setBookings(result.bookings || [])
      } catch (err) {
        console.error("Error loading bookings:", err)
        setError("Failed to load bookings")
        toast({
          title: "Error",
          description: "Could not load your bookings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [toast, user?.role])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.consultant?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.consultant?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "ALL" || booking.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "CONFIRMED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  const getStatusIcon = (status: Booking["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />
      case "PENDING":
        return <Clock className="w-4 h-4" />
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Loader className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-12">
        <div className="space-y-4 text-center">
          <Loader className="w-12 h-12 mx-auto text-primary animate-spin" />
          <h1 className="text-2xl font-bold">Loading Bookings</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Booking History</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your consultations and bookings
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
          <Input
            placeholder="Search by consultant or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Bookings List */}
        {error ? (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Bookings Found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm || filterStatus !== "ALL"
                  ? "Try adjusting your search or filters"
                  : "You haven't made any bookings yet"}
              </p>
              <Link href="/professionals">
                <Button className="mt-4">Browse Professionals</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">
                        {booking.service?.name || "Professional Service"}
                      </CardTitle>
                      <CardDescription>
                        {booking.consultant
                          ? `${booking.consultant.first_name} ${booking.consultant.last_name}`
                          : "Consultant TBA"}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        {booking.status.replace("_", " ")}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Consultant Info */}
                  {booking.consultant && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      {booking.consultant.profile_picture && (
                        <img
                          src={booking.consultant.profile_picture}
                          alt={booking.consultant.first_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          {booking.consultant.first_name} {booking.consultant.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">Consultant</p>
                      </div>
                    </div>
                  )}

                  {/* Booking Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(booking.scheduled_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(booking.scheduled_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <p className="text-xs">
                        Booking ID: <span className="font-mono font-semibold">{booking.id.slice(0, 8)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Service Price */}
                  {booking.service?.base_price && (
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Amount Paid: </span>
                        <span className="font-semibold text-lg">
                          ₹{booking.service.base_price.toLocaleString("en-IN")}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {(booking.status === "CONFIRMED" ||
                      booking.status === "IN_PROGRESS" ||
                      booking.status === "COMPLETED") && (
                      <Link href={`/chat-with-video?booking=${booking.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat & Video
                        </Button>
                      </Link>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // View booking details
                        console.log("View booking:", booking.id)
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
