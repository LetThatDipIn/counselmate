"use client"

import { Calendar, Clock, User, Video, MessageSquare, ChevronRight } from "lucide-react"
import { useState } from "react"

interface Session {
  id: number
  clientName: string
  date: string
  time: string
  duration: string
  status: "completed" | "upcoming" | "cancelled"
  type: "video" | "chat"
  amount: number
}

const mockSessions: Session[] = [
  {
    id: 1,
    clientName: "Ajay Chopra",
    date: "2025-01-15",
    time: "10:00 AM",
    duration: "1 hour",
    status: "completed",
    type: "video",
    amount: 1500,
  },
  {
    id: 2,
    clientName: "Meera Desai",
    date: "2025-01-16",
    time: "2:00 PM",
    duration: "30 mins",
    status: "upcoming",
    type: "chat",
    amount: 750,
  },
  {
    id: 3,
    clientName: "Suresh Kumar",
    date: "2025-01-17",
    time: "11:30 AM",
    duration: "1 hour",
    status: "upcoming",
    type: "video",
    amount: 1500,
  },
  {
    id: 4,
    clientName: "Priya Sharma",
    date: "2025-01-18",
    time: "3:00 PM",
    duration: "2 hours",
    status: "upcoming",
    type: "video",
    amount: 3000,
  },
  {
    id: 5,
    clientName: "Vikram Singh",
    date: "2025-01-10",
    time: "9:00 AM",
    duration: "1 hour",
    status: "completed",
    type: "video",
    amount: 1500,
  },
]

export default function SessionsTable({ limit }: { limit?: number }) {
  const sessions = limit ? mockSessions.slice(0, limit) : mockSessions
  const [selectedSession, setSelectedSession] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success"
      case "upcoming":
        return "bg-primary/10 text-primary"
      case "cancelled":
        return "bg-danger/10 text-danger"
      default:
        return "bg-text-secondary/10 text-text-secondary"
    }
  }

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="font-bold text-lg text-text-primary">{limit ? "Recent Sessions" : "All Sessions"}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-light border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Client</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b border-border hover:bg-background-light transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-text-primary">{session.clientName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{session.date}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{session.time}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">{session.duration}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {session.type === "video" ? (
                      <>
                        <Video className="w-4 h-4 text-primary" />
                        <span className="text-sm text-text-secondary">Video</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-sm text-text-secondary">Chat</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-text-primary">₹{session.amount}</td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-background-light rounded-lg transition">
                    <ChevronRight className="w-5 h-5 text-text-secondary" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
