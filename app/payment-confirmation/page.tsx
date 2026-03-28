"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  MessageSquare,
  ArrowRight,
  Copy,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { paymentsAPI } from "@/lib/api/payments"
import { bookingsAPI } from "@/lib/api/bookings"
import { chatAPI } from "@/lib/api/chat"
import { useToast } from "@/hooks/use-toast"

interface PaymentDetails {
  order_id: string
  payment_id: string
  amount: number
  currency: string
  status: string
  created_at: string
  consultant_name?: string
  service_name?: string
  booking_id?: string
}

export default function PaymentConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadPaymentDetails = async () => {
      try {
        const orderId = searchParams.get("order_id")
        const paymentId = searchParams.get("payment_id")
        
        if (!orderId) {
          setError("Payment order ID not found")
          setLoading(false)
          return
        }

        // Fetch payment details
        const details = await paymentsAPI.getPaymentDetails(orderId)
        setPaymentDetails(details)
        
        // Optional: Create booking if payment is successful
        if (details.status === "paid" && details.booking_id) {
          // Booking may already be created by webhook
          console.log("Payment verified, booking:", details.booking_id)
        }
      } catch (err) {
        console.error("Error loading payment details:", err)
        setError("Failed to load payment details. Please contact support.")
        toast({
          title: "Error",
          description: "Could not verify payment. Please check your email or contact support.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPaymentDetails()
  }, [searchParams, toast])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadReceipt = () => {
    if (!paymentDetails) return
    
    // Create receipt content
    const receiptContent = `
PAYMENT RECEIPT
===============
Order ID: ${paymentDetails.order_id}
Payment ID: ${paymentDetails.payment_id}
Status: ${paymentDetails.status}
Date: ${new Date(paymentDetails.created_at).toLocaleString()}
Amount: ₹${paymentDetails.amount}
Currency: ${paymentDetails.currency}

Service: ${paymentDetails.service_name || 'Professional Consultation'}
Consultant: ${paymentDetails.consultant_name || 'Assigned after confirmation'}
Booking ID: ${paymentDetails.booking_id || 'Will be assigned after verification'}

Thank you for using CounselMate!
    `
    
    // Create and download file
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(receiptContent))
    element.setAttribute("download", `receipt-${paymentDetails.order_id}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return (
      <div className="container max-w-2xl py-12">
        <div className="space-y-4 text-center">
          <Clock className="w-12 h-12 mx-auto text-muted-foreground animate-spin" />
          <h1 className="text-2xl font-bold">Processing Payment</h1>
          <p className="text-muted-foreground">Please wait while we verify your payment...</p>
        </div>
      </div>
    )
  }

  if (error || !paymentDetails) {
    return (
      <div className="container max-w-2xl py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Payment not found"}</AlertDescription>
        </Alert>
        <div className="mt-6 flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const isSuccessful = paymentDetails.status === "paid"

  return (
    <div className="container max-w-2xl py-12">
      <div className="space-y-8">
        {/* Status Header */}
        <div className="text-center space-y-4">
          {isSuccessful ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
                <p className="text-muted-foreground mt-2">
                  Your booking has been confirmed and payment received
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
              <div>
                <h1 className="text-3xl font-bold text-yellow-600">Payment {paymentDetails.status}</h1>
                <p className="text-muted-foreground mt-2">
                  Your payment is currently {paymentDetails.status}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Payment Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Transaction information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm font-semibold">{paymentDetails.order_id}</p>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.order_id)}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm font-semibold">{paymentDetails.payment_id}</p>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.payment_id)}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">₹{paymentDetails.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency</span>
                <span className="font-semibold">{paymentDetails.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-semibold ${isSuccessful ? 'text-green-600' : 'text-yellow-600'}`}>
                  {paymentDetails.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-semibold">{new Date(paymentDetails.created_at).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        {isSuccessful && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">Booking Confirmed</CardTitle>
              <CardDescription>Your consultation booking is ready</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentDetails.consultant_name && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Consultant</span>
                  <span className="font-semibold">{paymentDetails.consultant_name}</span>
                </div>
              )}
              {paymentDetails.service_name && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-semibold">{paymentDetails.service_name}</span>
                </div>
              )}
              {paymentDetails.booking_id && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-mono text-sm font-semibold">{paymentDetails.booking_id}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <p className="font-semibold">Confirmation Email</p>
                  <p className="text-sm text-muted-foreground">Check your email for booking details and consultant contact information</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <p className="font-semibold">Chat with Consultant</p>
                  <p className="text-sm text-muted-foreground">Start a conversation to discuss details and schedule your consultation</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <p className="font-semibold">Complete Your Consultation</p>
                  <p className="text-sm text-muted-foreground">Meet with the consultant and get the professional advice you need</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <Button 
            onClick={downloadReceipt}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          
          {isSuccessful && paymentDetails.booking_id && (
            <Link href={`/chat-with-video?booking=${paymentDetails.booking_id}`} className="flex-1">
              <Button className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with Consultant
              </Button>
            </Link>
          )}

          <Link href="/dashboard" className="flex-1">
            <Button className="w-full" variant="default">
              Back to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">
            Need help? <Link href="/support" className="text-primary font-semibold hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
