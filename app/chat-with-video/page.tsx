"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import {
  Send,
  MessageSquare,
  Phone,
  Video,
  X,
  AlertCircle,
  Loader,
  Copy,
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Message types
type MessageType = 
  | "chat" 
  | "chat_read"
  | "call_offer"
  | "call_answer"
  | "ice_candidate"
  | "call_start"
  | "call_end"
  | "session_start"
  | "session_end"
  | "session_terminate"
  | "user_disconnect"
  | "consultant_online"
  | "user_online"
  | "typing_start"
  | "typing_stop"

interface WebSocketMessage {
  type: MessageType
  booking_id: string
  sender_id: string
  content?: string
  sdp_offer?: string
  sdp_answer?: string
  ice_candidate?: string
  reason?: string
  timestamp: string
}

interface ChatMessage {
  id: string
  sender_id: string
  content: string
  timestamp: Date
  is_read: boolean
  type: "message" | "system"
}

export default function ChatWithVideoPage() {
  const searchParams = useSearchParams()
  const bookingID = searchParams.get("booking")
  const { toast } = useToast()

  // WebSocket state
  const ws = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageText, setMessageText] = useState("")
  const [typing, setTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)

  // Video call state
  const [inCall, setInCall] = useState(false)
  const [offerSent, setOfferSent] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [callStartTime, setCallStartTime] = useState<Date | null>(null)

  // Session state
  const [sessionActive, setSessionActive] = useState(false)
  const [sessionID, setSessionID] = useState<string | null>(null)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [terminationReason, setTerminationReason] = useState("")
  const [showTerminateModal, setShowTerminateModal] = useState(false)

  // Media elements
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // WebRTC
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  // Timers
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const callTimerRef = useRef<NodeJS.Timeout>()
  const sessionTimerRef = useRef<NodeJS.Timeout>()

  // Initialize WebSocket connection
  useEffect(() => {
    if (!bookingID) return

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsURL = `${wsProtocol}//${window.location.host}/api/ws/chat?booking=${bookingID}`

    ws.current = new WebSocket(wsURL)

    ws.current.onopen = () => {
      console.log("[WebSocket] Connected")
      setConnected(true)
      toast({
        title: "Connected",
        description: "You are now connected with the consultant",
      })
    }

    ws.current.onmessage = (event) => {
      handleWebSocketMessage(JSON.parse(event.data))
    }

    ws.current.onerror = (error) => {
      console.error("[WebSocket] Error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat server",
        variant: "destructive",
      })
    }

    ws.current.onclose = () => {
      console.log("[WebSocket] Disconnected")
      setConnected(false)
      toast({
        title: "Disconnected",
        description: "Connection to chat server closed",
      })
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [bookingID, toast])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Timer for call duration
  useEffect(() => {
    if (!inCall || !callStartTime) return

    callTimerRef.current = setInterval(() => {
      const now = new Date()
      const duration = Math.floor((now.getTime() - callStartTime.getTime()) / 1000)
      setCallDuration(duration)
    }, 1000)

    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current)
    }
  }, [inCall, callStartTime])

  // Timer for session duration
  useEffect(() => {
    if (!sessionActive) return

    sessionTimerRef.current = setInterval(() => {
      setSessionDuration((prev) => prev + 1)
    }, 1000)

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current)
    }
  }, [sessionActive])

  // Handle WebSocket messages
  const handleWebSocketMessage = (msg: WebSocketMessage) => {
    switch (msg.type) {
      case "chat":
        addMessage({
          id: Date.now().toString(),
          sender_id: msg.sender_id,
          content: msg.content || "",
          timestamp: new Date(msg.timestamp),
          is_read: false,
          type: "message",
        })
        break

      case "typing_start":
        setOtherUserTyping(true)
        break

      case "typing_stop":
        setOtherUserTyping(false)
        break

      case "call_offer":
        handleRemoteCallOffer(msg)
        break

      case "call_answer":
        handleRemoteCallAnswer(msg)
        break

      case "ice_candidate":
        handleICECandidate(msg)
        break

      case "session_start":
        setSessionActive(true)
        addSystemMessage("Consultant joined the session")
        break

      case "session_terminate":
        handleSessionTermination(msg)
        break

      case "user_disconnect":
        setInCall(false)
        addSystemMessage(`${msg.sender_id === "consultant" ? "Consultant" : "User"} disconnected`)
        break

      case "consultant_online":
      case "user_online":
        addSystemMessage("Participant is now online")
        break
    }
  }

  const handleRemoteCallOffer = async (msg: WebSocketMessage) => {
    if (!msg.sdp_offer) return

    try {
      const offer = new RTCSessionDescription({
        type: "offer",
        sdp: msg.sdp_offer,
      })

      await peerConnectionRef.current?.setRemoteDescription(offer)

      // Send answer
      const answer = await peerConnectionRef.current?.createAnswer()
      if (answer) {
        await peerConnectionRef.current?.setLocalDescription(answer)
        sendWebSocketMessage({
          type: "call_answer",
          booking_id: bookingID || "",
          sender_id: "",
          sdp_answer: answer.sdp,
          timestamp: new Date().toISOString(),
        })
      }

      setInCall(true)
      setSessionActive(true)
    } catch (error) {
      console.error("[WebRTC] Error handling offer:", error)
    }
  }

  const handleRemoteCallAnswer = async (msg: WebSocketMessage) => {
    if (!msg.sdp_answer || !peerConnectionRef.current) return

    try {
      const answer = new RTCSessionDescription({
        type: "answer",
        sdp: msg.sdp_answer,
      })
      await peerConnectionRef.current.setRemoteDescription(answer)
    } catch (error) {
      console.error("[WebRTC] Error handling answer:", error)
    }
  }

  const handleICECandidate = async (msg: WebSocketMessage) => {
    if (!msg.ice_candidate || !peerConnectionRef.current) return

    try {
      const candidate = new RTCIceCandidate(JSON.parse(msg.ice_candidate))
      await peerConnectionRef.current.addIceCandidate(candidate)
    } catch (error) {
      console.error("[WebRTC] Error adding ICE candidate:", error)
    }
  }

  const handleSessionTermination = (msg: WebSocketMessage) => {
    setInCall(false)
    setSessionActive(false)
    addSystemMessage(`Session terminated: ${msg.reason || "No reason provided"}`)
    toast({
      title: "Session Terminated",
      description: msg.reason || "The consultation session has ended",
      variant: "destructive",
    })
  }

  // Send chat message
  const sendChatMessage = () => {
    if (!messageText.trim() || !connected || !ws.current) return

    sendWebSocketMessage({
      type: "chat",
      booking_id: bookingID || "",
      sender_id: "",
      content: messageText,
      timestamp: new Date().toISOString(),
    })

    addMessage({
      id: Date.now().toString(),
      sender_id: "you",
      content: messageText,
      timestamp: new Date(),
      is_read: true,
      type: "message",
    })

    setMessageText("")
    setTyping(false)
  }

  // Send WebSocket message
  const sendWebSocketMessage = (msg: Partial<WebSocketMessage>) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return

    ws.current.send(
      JSON.stringify({
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString(),
      })
    )
  }

  // Add chat message
  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg])
  }

  // Add system message
  const addSystemMessage = (content: string) => {
    addMessage({
      id: Date.now().toString(),
      sender_id: "system",
      content,
      timestamp: new Date(),
      is_read: true,
      type: "system",
    })
  }

  // Handle typing
  const handleTyping = () => {
    if (!typing) {
      setTyping(true)
      sendWebSocketMessage({
        type: "typing_start",
        booking_id: bookingID || "",
        sender_id: "",
        timestamp: new Date().toISOString(),
      })
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false)
      sendWebSocketMessage({
        type: "typing_stop",
        booking_id: bookingID || "",
        sender_id: "",
        timestamp: new Date().toISOString(),
      })
    }, 3000)
  }

  // Initiate video call
  const startVideoCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      localStreamRef.current = stream

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
        ],
      })

      peerConnectionRef.current = peerConnection

      // Add local stream tracks
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
      })

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendWebSocketMessage({
            type: "ice_candidate",
            booking_id: bookingID || "",
            sender_id: "",
            ice_candidate: JSON.stringify(event.candidate),
            timestamp: new Date().toISOString(),
          })
        }
      }

      // Create and send offer
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      sendWebSocketMessage({
        type: "call_offer",
        booking_id: bookingID || "",
        sender_id: "",
        sdp_offer: offer.sdp,
        timestamp: new Date().toISOString(),
      })

      setInCall(true)
      setSessionActive(true)
      setCallStartTime(new Date())
      setOfferSent(true)

      toast({
        title: "Call Initiated",
        description: "Waiting for consultant to answer...",
      })
    } catch (error) {
      console.error("[WebRTC] Error starting call:", error)
      toast({
        title: "Error",
        description: "Failed to start video call. Please check your camera/microphone permissions.",
        variant: "destructive",
      })
    }
  }

  // End video call
  const endVideoCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    setInCall(false)
    setCallStartTime(null)
    setCallDuration(0)

    sendWebSocketMessage({
      type: "call_end",
      booking_id: bookingID || "",
      sender_id: "",
      timestamp: new Date().toISOString(),
    })

    addSystemMessage("You ended the video call")
  }

  // Terminate session
  const terminateSession = () => {
    if (!terminationReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for termination",
        variant: "destructive",
      })
      return
    }

    endVideoCall()

    sendWebSocketMessage({
      type: "session_terminate",
      booking_id: bookingID || "",
      sender_id: "",
      reason: terminationReason,
      timestamp: new Date().toISOString(),
    })

    setSessionActive(false)
    setShowTerminateModal(false)
    setTerminationReason("")

    toast({
      title: "Session Ended",
      description: "The consultation session has been terminated",
    })
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  if (!bookingID) {
    return (
      <div className="container max-w-4xl py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No booking ID provided</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 h-[calc(100vh-120px)] flex flex-col">
      {/* Video Call Section */}
      {inCall && (
        <Card className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Video Call Active</CardTitle>
                <CardDescription>Duration: {formatDuration(callDuration)}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={endVideoCall}>
                  <Phone className="w-4 h-4 mr-2" />
                  End Call
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                  You
                </div>
              </div>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                  Consultant
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Info */}
      {sessionActive && (
        <Card className="mb-4 border-green-200 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold">Session Active</span>
                <span className="text-sm text-muted-foreground">
                  Duration: {formatDuration(sessionDuration)}
                </span>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowTerminateModal(true)}
              >
                Terminate Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages and Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 overflow-hidden">
        {/* Chat Messages */}
        <div className="md:col-span-3 flex flex-col border rounded-lg bg-card">
          {/* Connection Status */}
          <div className="px-4 py-2 border-b bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-500" : "bg-red-500"
                } animate-pulse`}
              />
              <span className="text-sm">
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {!inCall && (
              <Button
                size="sm"
                variant="outline"
                onClick={startVideoCall}
                disabled={!connected || inCall}
              >
                <Video className="w-4 h-4 mr-2" />
                Start Call
              </Button>
            )}
          </div>

          {/* Messages */}
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageSquare className="w-12 h-12 opacity-50 mb-2" />
                <p>Start the conversation</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === "you" ? "justify-end" : "justify-start"}`}
                >
                  {msg.type === "system" ? (
                    <div className="text-center text-xs text-muted-foreground italic px-4 py-2 rounded-lg bg-muted">
                      {msg.content}
                    </div>
                  ) : (
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender_id === "you"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender_id === "you"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {otherUserTyping && (
            <div className="px-4 py-2 text-sm text-muted-foreground italic">
              Consultant is typing...
            </div>
          )}

          {/* Message Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendChatMessage()
            }}
            className="p-4 border-t flex gap-2"
          >
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value)
                handleTyping()
              }}
              disabled={!connected}
              className="flex-1"
            />
            <Button type="submit" disabled={!messageText.trim() || !connected} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Session Termination Reasons */}
        <div className="md:col-span-1 border rounded-lg bg-card p-4 overflow-y-auto space-y-4">
          <h3 className="font-semibold text-sm">Session Controls</h3>

          {sessionActive && (
            <div className="space-y-2">
              <label className="text-xs font-medium">
                Terminate Session
              </label>
              <select
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
              >
                <option value="">Select reason...</option>
                <option value="completed">Consultation Completed</option>
                <option value="rescheduled">Need to Reschedule</option>
                <option value="insufficient_time">Insufficient Time</option>
                <option value="technical_issue">Technical Issue</option>
                <option value="client_request">Client Request</option>
                <option value="other">Other</option>
              </select>

              {terminationReason && (
                <Button
                  onClick={() => setShowTerminateModal(true)}
                  className="w-full"
                  variant="destructive"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              )}
            </div>
          )}

          {/* Info */}
          <div className="text-xs text-muted-foreground space-y-2 p-3 rounded-lg bg-muted/50">
            <p>• Both users can terminate the session anytime</p>
            <p>• Provide a reason for termination</p>
            <p>• Session data will be saved for records</p>
          </div>
        </div>
      </div>

      {/* Termination Confirmation Modal */}
      {showTerminateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm mx-4">
            <CardHeader>
              <CardTitle>Terminate Session?</CardTitle>
              <CardDescription>
                Are you sure you want to end this consultation session?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p>
                  <span className="font-semibold">Reason:</span> {terminationReason}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span> {formatDuration(sessionDuration)}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTerminateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={terminateSession}
                  className="flex-1"
                >
                  Confirm Termination
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
