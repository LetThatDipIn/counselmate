"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type WSMessageType =
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

interface WSMessage {
  type: WSMessageType
  booking_id: string
  sender_id?: string
  receiver_id?: string
  content?: string
  sdp_offer?: string
  sdp_answer?: string
  ice_candidate?: string
  reason?: string
  timestamp?: string
}

interface LogItem {
  id: string
  direction: "in" | "out" | "sys"
  text: string
  at: string
}

interface PersistedChatMessage {
  id: string
  booking_id: string
  sender_id: string
  content: string
  created_at: string
}

const rtcConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
}

export default function WebSocketTestPage() {
  const { user } = useAuth()

  const [bookingId, setBookingId] = useState("test-booking-1")
  const [role, setRole] = useState("user")
  const [targetPeerId, setTargetPeerId] = useState("")
  const [chatInput, setChatInput] = useState("")
  const [connected, setConnected] = useState(false)
  const [guestId, setGuestId] = useState("")
  const [participants, setParticipants] = useState<string[]>([])
  const [chatMessages, setChatMessages] = useState<PersistedChatMessage[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const [logs, setLogs] = useState<LogItem[]>([])
  const [rawPayload, setRawPayload] = useState(
    JSON.stringify(
      {
        type: "chat",
        booking_id: "test-booking-1",
        content: "hello from ws test",
      },
      null,
      2,
    ),
  )

  const [localReady, setLocalReady] = useState(false)
  const [inCall, setInCall] = useState(false)
  const [localAudioLevel, setLocalAudioLevel] = useState(0)
  const [remoteAudioLevel, setRemoteAudioLevel] = useState(0)
  const [terminationReason, setTerminationReason] = useState("Manual terminate from tester")

  const wsRef = useRef<WebSocket | null>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localAudioAnalyserRef = useRef<AnalyserNode | null>(null)
  const remoteAudioAnalyserRef = useRef<AnalyserNode | null>(null)
  const audioMonitorRef = useRef<number | null>(null)

  const addLog = useCallback((direction: LogItem["direction"], text: string) => {
    setLogs((prev) => [
      {
        id: crypto.randomUUID(),
        direction,
        text,
        at: new Date().toLocaleTimeString(),
      },
      ...prev,
    ])
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const existing = localStorage.getItem("ws_test_guest_id")
    if (existing) {
      setGuestId(existing)
      return
    }
    const generated = `guest-${crypto.randomUUID()}`
    localStorage.setItem("ws_test_guest_id", generated)
    setGuestId(generated)
  }, [])

  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api", [])

  const fetchChatHistory = useCallback(async (booking: string) => {
    if (!booking) return
    setChatLoading(true)
    try {
      const response = await fetch(`${apiBase}/ws/messages?booking=${encodeURIComponent(booking)}&limit=200`)
      if (!response.ok) throw new Error(`Failed to load chat history (${response.status})`)
      const data = await response.json()
      setChatMessages((data.messages || []) as PersistedChatMessage[])
    } catch (error) {
      addLog("sys", `Chat history fetch failed: ${String(error)}`)
    } finally {
      setChatLoading(false)
    }
  }, [addLog, apiBase])

  const startAudioMonitor = useCallback(() => {
    if (audioMonitorRef.current) {
      window.clearInterval(audioMonitorRef.current)
    }

    audioMonitorRef.current = window.setInterval(() => {
      const measure = (analyser: AnalyserNode | null) => {
        if (!analyser) return 0
        const buffer = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteTimeDomainData(buffer)
        let sum = 0
        for (let i = 0; i < buffer.length; i++) {
          const normalized = (buffer[i] - 128) / 128
          sum += normalized * normalized
        }
        const rms = Math.sqrt(sum / buffer.length)
        return Math.min(100, Math.round(rms * 300))
      }

      setLocalAudioLevel(measure(localAudioAnalyserRef.current))
      setRemoteAudioLevel(measure(remoteAudioAnalyserRef.current))
    }, 120)
  }, [])

  const wsUrl = useMemo(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    try {
      const url = new URL(apiBase)
      const protocol = url.protocol === "https:" ? "wss:" : "ws:"
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : ""
      const path = `${url.pathname.replace(/\/$/, "")}/ws/chat`
      const params = new URLSearchParams({
        booking: bookingId,
        role,
        test_mode: "1",
        guest_id: guestId || "guest-local",
      })
      if (token) params.set("token", token)
      return `${protocol}//${url.host}${path}?${params.toString()}`
    } catch {
      return ""
    }
  }, [bookingId, role, guestId])

  const sendMessage = useCallback((message: WSMessage) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast.error("WebSocket not connected")
      return
    }

    wsRef.current.send(JSON.stringify(message))
    addLog("out", JSON.stringify(message))
  }, [addLog])

  const ensurePeerConnection = useCallback(() => {
    if (pcRef.current) return pcRef.current

    const pc = new RTCPeerConnection(rtcConfig)

    pc.onicecandidate = (event) => {
      if (!event.candidate) return
      sendMessage({
        type: "ice_candidate",
        booking_id: bookingId,
        receiver_id: targetPeerId || undefined,
        ice_candidate: JSON.stringify(event.candidate),
      })
    }

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0]
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream
      }

      const remoteAudioTrack = remoteStream.getAudioTracks()[0]
      if (remoteAudioTrack) {
        const ctx = new AudioContext()
        const source = ctx.createMediaStreamSource(new MediaStream([remoteAudioTrack]))
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)
        remoteAudioAnalyserRef.current = analyser
        startAudioMonitor()
      }
      addLog("sys", "Remote track received")
    }

    pcRef.current = pc
    return pc
  }, [addLog, bookingId, sendMessage, startAudioMonitor, targetPeerId])

  const prepareLocalMedia = useCallback(async (video: boolean) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video })
    localStreamRef.current = stream

    const audioTrack = stream.getAudioTracks()[0]
    if (audioTrack) {
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(new MediaStream([audioTrack]))
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      localAudioAnalyserRef.current = analyser
      startAudioMonitor()
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    }

    const pc = ensurePeerConnection()
    stream.getTracks().forEach((track) => pc.addTrack(track, stream))
    setLocalReady(true)
    addLog("sys", `Local ${video ? "audio+video" : "audio"} ready`)
  }, [addLog, ensurePeerConnection, startAudioMonitor])

  const startCall = useCallback(async (video: boolean) => {
    try {
      if (!connected) {
        toast.error("Connect websocket first")
        return
      }

      await prepareLocalMedia(video)
      const pc = ensurePeerConnection()
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      sendMessage({
        type: "call_offer",
        booking_id: bookingId,
        receiver_id: targetPeerId || undefined,
        sdp_offer: JSON.stringify(offer),
      })

      setInCall(true)
      addLog("sys", `Offer sent (${video ? "video" : "voice"} call)`)
    } catch (error) {
      toast.error("Failed to start call")
      addLog("sys", `Call start error: ${String(error)}`)
    }
  }, [addLog, bookingId, connected, ensurePeerConnection, prepareLocalMedia, sendMessage])

  const endCallLocally = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop())
      localStreamRef.current = null
    }
    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }
    if (audioMonitorRef.current) {
      window.clearInterval(audioMonitorRef.current)
      audioMonitorRef.current = null
    }
    localAudioAnalyserRef.current = null
    remoteAudioAnalyserRef.current = null
    setLocalAudioLevel(0)
    setRemoteAudioLevel(0)
    setLocalReady(false)
    setInCall(false)
  }, [])

  const onIncoming = useCallback(async (msg: WSMessage) => {
    addLog("in", JSON.stringify(msg))

    if (msg.sender_id) {
      setParticipants((prev) => (prev.includes(msg.sender_id as string) ? prev : [...prev, msg.sender_id as string]))
    }

    if (msg.type === "chat" && msg.content) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          booking_id: msg.booking_id,
          sender_id: msg.sender_id || "unknown",
          content: msg.content || "",
          created_at: msg.timestamp || new Date().toISOString(),
        },
      ])
    }

    try {
      switch (msg.type) {
        case "call_offer": {
          if (!msg.sdp_offer) return
          await prepareLocalMedia(true)
          const pc = ensurePeerConnection()
          await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(msg.sdp_offer)))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          sendMessage({
            type: "call_answer",
            booking_id: bookingId,
            receiver_id: msg.sender_id,
            sdp_answer: JSON.stringify(answer),
          })
          setInCall(true)
          addLog("sys", "Offer received and answer sent")
          break
        }
        case "call_answer": {
          if (!msg.sdp_answer || !pcRef.current) return
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(msg.sdp_answer)))
          addLog("sys", "Answer applied")
          break
        }
        case "ice_candidate": {
          if (!msg.ice_candidate || !pcRef.current) return
          await pcRef.current.addIceCandidate(new RTCIceCandidate(JSON.parse(msg.ice_candidate)))
          break
        }
        case "session_end":
        case "session_terminate":
        case "call_end":
          endCallLocally()
          break
      }
    } catch (error) {
      addLog("sys", `Incoming handler error: ${String(error)}`)
    }
  }, [addLog, bookingId, endCallLocally, ensurePeerConnection, prepareLocalMedia, sendMessage])

  const connect = useCallback(() => {
    if (!bookingId.trim()) {
      toast.error("booking id is required")
      return
    }
    if (!wsUrl) {
      toast.error("invalid websocket URL")
      return
    }

    const socket = new WebSocket(wsUrl)
    wsRef.current = socket

    socket.onopen = () => {
      setConnected(true)
      setParticipants((prev) => (guestId && !prev.includes(guestId) ? [...prev, guestId] : prev))
      addLog("sys", `Connected: ${wsUrl}`)
      toast.success("WebSocket connected")
      fetchChatHistory(bookingId)
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WSMessage
        onIncoming(data)
      } catch {
        addLog("in", event.data)
      }
    }

    socket.onerror = () => {
      addLog("sys", "WebSocket error")
      toast.error("WebSocket error")
    }

    socket.onclose = () => {
      setConnected(false)
      addLog("sys", "WebSocket disconnected")
      endCallLocally()
    }
  }, [addLog, bookingId, endCallLocally, fetchChatHistory, guestId, onIncoming, wsUrl])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setConnected(false)
  }, [])

  useEffect(() => {
    if (!bookingId) return
    fetchChatHistory(bookingId)
  }, [bookingId, fetchChatHistory])

  useEffect(() => {
    return () => {
      disconnect()
      endCallLocally()
      if (audioMonitorRef.current) {
        window.clearInterval(audioMonitorRef.current)
      }
    }
  }, [disconnect, endCallLocally])

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>WebSocket Integration Test (Chat + Voice + Video)</CardTitle>
            <div className="flex flex-wrap gap-2 text-sm text-slate-600">
              <Badge variant={connected ? "default" : "secondary"}>{connected ? "Connected" : "Disconnected"}</Badge>
              <Badge variant="outline">User: {user?.email || "not logged in"}</Badge>
              <Badge variant="outline">Guest ID: {guestId || "initializing..."}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input value={bookingId} onChange={(e) => setBookingId(e.target.value)} placeholder="booking id" />
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">user</option>
                <option value="consultant">consultant</option>
                <option value="PROFESSIONAL">PROFESSIONAL</option>
              </select>
              <Input
                value={targetPeerId}
                onChange={(e) => setTargetPeerId(e.target.value)}
                placeholder="target peer id (optional)"
              />
              <Input value={wsUrl} readOnly />
            </div>

            {participants.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">Participants:</span>
                {participants.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`rounded border px-2 py-1 text-xs ${targetPeerId === id ? "bg-blue-600 text-white" : "bg-white"}`}
                    onClick={() => setTargetPeerId(id)}
                  >
                    {id}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={connect} disabled={connected}>Connect</Button>
              <Button variant="outline" onClick={disconnect} disabled={!connected}>Disconnect</Button>
              <Button variant="outline" onClick={() => setLogs([])}>Clear logs</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Chat + Session Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="type message"
                />
                <Button
                  onClick={() => {
                    if (!chatInput.trim()) return
                    sendMessage({
                      type: "chat",
                      booking_id: bookingId,
                      receiver_id: targetPeerId || undefined,
                      content: chatInput,
                    })
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        booking_id: bookingId,
                        sender_id: guestId || user?.id || "me",
                        content: chatInput,
                        created_at: new Date().toISOString(),
                      },
                    ])
                    setChatInput("")
                  }}
                  disabled={!connected}
                >
                  Send Chat
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">Persistent chat history (DB-backed)</div>
                <Button variant="outline" size="sm" onClick={() => fetchChatHistory(bookingId)} disabled={chatLoading}>
                  {chatLoading ? "Loading..." : "Refresh history"}
                </Button>
              </div>

              <div className="max-h-44 space-y-2 overflow-auto rounded-md border bg-white p-2 text-sm">
                {chatMessages.length === 0 ? (
                  <div className="text-slate-500">No chat messages yet</div>
                ) : (
                  chatMessages.map((m) => (
                    <div key={m.id} className="rounded border bg-slate-50 p-2">
                      <div className="text-[11px] text-slate-500">
                        {m.sender_id} • {new Date(m.created_at).toLocaleTimeString()}
                      </div>
                      <div>{m.content}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => sendMessage({ type: "typing_start", booking_id: bookingId, receiver_id: targetPeerId || undefined })} disabled={!connected}>typing_start</Button>
                <Button variant="outline" onClick={() => sendMessage({ type: "typing_stop", booking_id: bookingId, receiver_id: targetPeerId || undefined })} disabled={!connected}>typing_stop</Button>
                <Button variant="outline" onClick={() => sendMessage({ type: "session_start", booking_id: bookingId, receiver_id: targetPeerId || undefined })} disabled={!connected}>session_start</Button>
                <Button variant="outline" onClick={() => sendMessage({ type: "session_end", booking_id: bookingId, receiver_id: targetPeerId || undefined })} disabled={!connected}>session_end</Button>
              </div>

              <div className="flex gap-2">
                <Input
                  value={terminationReason}
                  onChange={(e) => setTerminationReason(e.target.value)}
                  placeholder="termination reason"
                />
                <Button
                  variant="destructive"
                  onClick={() => sendMessage({ type: "session_terminate", booking_id: bookingId, receiver_id: targetPeerId || undefined, reason: terminationReason })}
                  disabled={!connected}
                >
                  session_terminate
                </Button>
              </div>

              <Textarea
                value={rawPayload}
                onChange={(e) => setRawPayload(e.target.value)}
                rows={8}
                placeholder="Raw JSON payload"
              />
              <Button
                variant="outline"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(rawPayload) as WSMessage
                    sendMessage(parsed)
                  } catch {
                    toast.error("Invalid JSON payload")
                  }
                }}
                disabled={!connected}
              >
                Send Raw JSON
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice / Video (WebRTC over WebSocket signaling)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => startCall(false)} disabled={!connected}>Start Voice Call</Button>
                <Button onClick={() => startCall(true)} disabled={!connected}>Start Video Call</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    sendMessage({ type: "call_end", booking_id: bookingId, receiver_id: targetPeerId || undefined })
                    endCallLocally()
                  }}
                  disabled={!inCall}
                >
                  End Call
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs text-slate-600">Local stream {localReady ? "ready" : "not ready"}</div>
                  <div className="h-2 w-full overflow-hidden rounded bg-slate-200">
                    <div className="h-full bg-green-500 transition-all" style={{ width: `${localAudioLevel}%` }} />
                  </div>
                  <div className="text-[11px] text-slate-500">Local voice level: {localAudioLevel}</div>
                  <video ref={localVideoRef} autoPlay muted playsInline className="h-44 w-full rounded-md bg-black object-cover" />
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-600">Remote stream</div>
                  <div className="h-2 w-full overflow-hidden rounded bg-slate-200">
                    <div className="h-full bg-blue-500 transition-all" style={{ width: `${remoteAudioLevel}%` }} />
                  </div>
                  <div className="text-[11px] text-slate-500">Remote voice level: {remoteAudioLevel}</div>
                  <video ref={remoteVideoRef} autoPlay playsInline className="h-44 w-full rounded-md bg-black object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[360px] space-y-2 overflow-auto rounded-md border p-3 font-mono text-xs">
              {logs.length === 0 ? (
                <div className="text-slate-500">No logs yet</div>
              ) : (
                logs.map((item) => (
                  <div key={item.id} className="break-all rounded bg-slate-100 p-2">
                    <span className="mr-2 text-slate-500">[{item.at}]</span>
                    <span className="mr-2 font-semibold uppercase">{item.direction}</span>
                    <span>{item.text}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
