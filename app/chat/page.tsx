"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Send,
  MessageSquare,
  ArrowLeft,
  Clock,
  CheckCheck,
  AlertCircle,
  Loader,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { chatAPI, type Message, type ChatThread } from "@/lib/api/chat"
import { bookingsAPI, type Booking } from "@/lib/api/bookings"
import { useToast } from "@/hooks/use-toast"

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const selectedBookingId = searchParams.get("booking")
  const { toast } = useToast()

  const [chatThreads, setChatThreads] = useState<ChatThread[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat threads
  useEffect(() => {
    const loadThreads = async () => {
      try {
        setLoading(true)
        const result = await chatAPI.getChatThreads(1, 100)
        setChatThreads(result.threads || [])

        // If a booking ID is provided, select that thread
        if (selectedBookingId) {
          const thread = result.threads?.find((t) => t.id === selectedBookingId)
          if (thread) {
            setSelectedThread(thread)
          }
        }
      } catch (err) {
        console.error("Error loading chat threads:", err)
        toast({
          title: "Error",
          description: "Failed to load your chat threads.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadThreads()
  }, [selectedBookingId, toast])

  // Load messages for selected thread
  useEffect(() => {
    if (!selectedThread) return

    const loadMessages = async () => {
      try {
        setLoadingMessages(true)
        const result = await chatAPI.getMessages(selectedThread.booking_id, 1, 50)
        setMessages(result.messages?.reverse() || [])

        // Load booking details
        const bookingDetails = await bookingsAPI.getBooking(selectedThread.booking_id)
        setBooking(bookingDetails)

        // Mark thread as read
        await chatAPI.markThreadAsRead(selectedThread.booking_id).catch(() => {})
      } catch (err) {
        console.error("Error loading messages:", err)
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive",
        })
      } finally {
        setLoadingMessages(false)
      }
    }

    loadMessages()
  }, [selectedThread, toast])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!messageText.trim() || !selectedThread || !booking) return

    try {
      setSending(true)
      const newMessage = await chatAPI.sendMessage({
        booking_id: selectedThread.booking_id,
        receiver_id: selectedThread.other_participant?.id || "",
        content: messageText,
      })

      setMessages([...messages, newMessage])
      setMessageText("")
    } catch (err) {
      console.error("Error sending message:", err)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-12">
        <div className="space-y-4 text-center">
          <Loader className="w-12 h-12 mx-auto text-primary animate-spin" />
          <h1 className="text-2xl font-bold">Loading Messages</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Chat List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col bg-muted/30">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Messages</h2>
            <p className="text-sm text-muted-foreground">
              {chatThreads.length} conversation{chatThreads.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="overflow-y-auto flex-1">
            {chatThreads.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto opacity-50 mb-2" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {chatThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => {
                      setSelectedThread(thread)
                      setMessages([])
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedThread?.id === thread.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {thread.other_participant
                            ? `${thread.other_participant.first_name} ${thread.other_participant.last_name}`
                            : "Unknown"}
                        </p>
                        <p className="text-xs opacity-75 truncate">
                          {thread.last_message?.content || "No messages yet"}
                        </p>
                      </div>
                      {thread.unread_count > 0 && (
                        <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-full">
                          {thread.unread_count}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 border rounded-lg flex flex-col bg-card">
          {selectedThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-muted/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedThread(null)}
                    className="md:hidden p-2 hover:bg-muted rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="font-semibold">
                      {selectedThread.other_participant
                        ? `${selectedThread.other_participant.first_name} ${selectedThread.other_participant.last_name}`
                        : "Consultant"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {booking?.service?.name || "Professional Service"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="w-12 h-12 opacity-50 mb-2" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === selectedThread.participant_1_id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === selectedThread.participant_1_id
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender_id === selectedThread.participant_1_id
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={sending}
                  className="flex-1"
                />
                <Button type="submit" disabled={!messageText.trim() || sending} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="w-12 h-12 opacity-50 mb-2" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
