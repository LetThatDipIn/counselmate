import type React from "react"
import { Check, CheckCheck } from "lucide-react"

interface Message {
  id: number
  senderId: number
  senderName: string
  text: string
  timestamp: string
  read: boolean
  type: "text" | "file"
}

interface Conversation {
  id: number
  name: string
  avatar: string
}

interface ChatWindowProps {
  messages: Message[]
  selectedConversation: Conversation
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export default function ChatWindow({ messages, selectedConversation, messagesEndRef }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.senderId === 2 ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === 2
                ? "bg-primary text-white"
                : "bg-background-light text-text-primary border border-border"
            }`}
          >
            {message.type === "file" ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">📄</div>
                <div>
                  <p className="text-sm font-semibold">Document.pdf</p>
                  <p className="text-xs opacity-75">45 KB</p>
                </div>
              </div>
            ) : (
              <p className="text-sm break-words">{message.text}</p>
            )}

            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-xs opacity-75">{message.timestamp}</span>
              {message.senderId === 2 &&
                (message.read ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
