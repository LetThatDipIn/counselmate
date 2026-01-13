"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react"
import ConversationList from "@/components/messages/conversation-list"
import ChatWindow from "@/components/messages/chat-window"

interface Conversation {
  id: number
  name: string
  role: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

interface Message {
  id: number
  senderId: number
  senderName: string
  text: string
  timestamp: string
  read: boolean
  type: "text" | "file"
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Chartered Accountant",
    avatar: "R",
    lastMessage: "I'll send you the tax filing documents tomorrow",
    timestamp: "10:30 AM",
    unread: 0,
    online: true,
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Corporate Lawyer",
    avatar: "P",
    lastMessage: "The contract has been reviewed. Let me schedule a call.",
    timestamp: "Yesterday",
    unread: 2,
    online: true,
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Tax Specialist",
    avatar: "A",
    lastMessage: "Thanks for the clarity on the international tax issue",
    timestamp: "2 days ago",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Neha Sharma",
    role: "Labor Lawyer",
    avatar: "N",
    lastMessage: "I've prepared the employment contract for review",
    timestamp: "3 days ago",
    unread: 0,
    online: false,
  },
]

const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      senderId: 2,
      senderName: "You",
      text: "Hi Rajesh, I need help with my GST compliance",
      timestamp: "9:00 AM",
      read: true,
      type: "text",
    },
    {
      id: 2,
      senderId: 1,
      senderName: "Rajesh Kumar",
      text: "Sure, I can help you with that. What's the issue?",
      timestamp: "9:15 AM",
      read: true,
      type: "text",
    },
    {
      id: 3,
      senderId: 2,
      senderName: "You",
      text: "I'm getting confused about filing the returns",
      timestamp: "9:30 AM",
      read: true,
      type: "text",
    },
    {
      id: 4,
      senderId: 1,
      senderName: "Rajesh Kumar",
      text: "I'll send you the tax filing documents tomorrow",
      timestamp: "9:45 AM",
      read: true,
      type: "text",
    },
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      senderName: "You",
      text: "Hi Priya, can you review my NDA?",
      timestamp: "2:00 PM",
      read: true,
      type: "text",
    },
    {
      id: 2,
      senderId: 3,
      senderName: "Priya Singh",
      text: "Yes, I can. Please share the document.",
      timestamp: "2:15 PM",
      read: true,
      type: "text",
    },
    {
      id: 3,
      senderId: 2,
      senderName: "You",
      text: "Here it is",
      timestamp: "2:20 PM",
      read: true,
      type: "file",
    },
    {
      id: 4,
      senderId: 3,
      senderName: "Priya Singh",
      text: "The contract has been reviewed. Let me schedule a call.",
      timestamp: "3:00 PM",
      read: false,
      type: "text",
    },
  ],
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>(mockMessages[selectedConversation?.id || 1] || [])
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        senderId: 2,
        senderName: "You",
        text: messageText,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        read: false,
        type: "text",
      }
      setMessages([...messages, newMessage])
      setMessageText("")

      // Simulate reply after a delay
      setTimeout(() => {
        const reply: Message = {
          id: messages.length + 2,
          senderId: selectedConversation?.id || 1,
          senderName: selectedConversation?.name || "",
          text: "Thanks for your message! I'll get back to you shortly.",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          read: false,
          type: "text",
        }
        setMessages((prev) => [...prev, reply])
      }, 1000)
    }
  }

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    setMessages(mockMessages[conv.id] || [])
  }

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background-light flex">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Messages</h1>
          <div className="flex items-center gap-2 bg-background-light px-3 py-2 rounded-lg">
            <Search className="w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ConversationList
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold text-sm relative">
                  {selectedConversation.avatar}
                  {selectedConversation.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-text-primary">{selectedConversation.name}</h2>
                  <p className="text-xs text-text-secondary">{selectedConversation.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-background-light rounded-lg transition">
                  <Phone className="w-5 h-5 text-text-secondary" />
                </button>
                <button className="p-2 hover:bg-background-light rounded-lg transition">
                  <Video className="w-5 h-5 text-text-secondary" />
                </button>
                <button className="p-2 hover:bg-background-light rounded-lg transition">
                  <MoreVertical className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <ChatWindow
              messages={messages}
              selectedConversation={selectedConversation}
              messagesEndRef={messagesEndRef}
            />

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 flex items-center gap-2 bg-background-light rounded-lg px-4 py-2 border border-border">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button className="p-1 hover:bg-white rounded transition">
                    <Paperclip className="w-4 h-4 text-text-secondary" />
                  </button>
                  <button className="p-1 hover:bg-white rounded transition">
                    <Smile className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-primary text-white rounded-lg hover:bg-primary-light transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-background-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-text-secondary" />
              </div>
              <p className="text-text-secondary">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
