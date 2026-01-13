"use client"

import { Star } from "lucide-react"

interface Client {
  id: number
  name: string
  email: string
  phone: string
  totalSessions: number
  rating: number
  lastSession: string
  status: "active" | "inactive"
}

const mockClients: Client[] = [
  {
    id: 1,
    name: "Ajay Chopra",
    email: "ajay@example.com",
    phone: "+91 98765 43210",
    totalSessions: 12,
    rating: 5,
    lastSession: "Jan 15, 2025",
    status: "active",
  },
  {
    id: 2,
    name: "Meera Desai",
    email: "meera@example.com",
    phone: "+91 98765 43211",
    totalSessions: 8,
    rating: 5,
    lastSession: "Jan 14, 2025",
    status: "active",
  },
  {
    id: 3,
    name: "Suresh Kumar",
    email: "suresh@example.com",
    phone: "+91 98765 43212",
    totalSessions: 5,
    rating: 4,
    lastSession: "Jan 10, 2025",
    status: "active",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43213",
    totalSessions: 15,
    rating: 5,
    lastSession: "Jan 18, 2025",
    status: "active",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 98765 43214",
    totalSessions: 3,
    rating: 4,
    lastSession: "Dec 28, 2024",
    status: "inactive",
  },
]

export default function ClientsList() {
  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="font-bold text-lg text-text-primary">Your Clients</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-light border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Sessions</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Last Session</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockClients.map((client) => (
              <tr key={client.id} className="border-b border-border hover:bg-background-light transition">
                <td className="px-6 py-4">
                  <span className="font-semibold text-text-primary">{client.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-text-secondary">
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">{client.totalSessions}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {Array(client.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">{client.lastSession}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      client.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-text-secondary/10 text-text-secondary"
                    }`}
                  >
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
