"use client"

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

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onSelectConversation: (conv: Conversation) => void
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelectConversation(conv)}
          className={`w-full p-4 border-b border-border hover:bg-background-light transition text-left ${
            selectedConversation?.id === conv.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold relative flex-shrink-0">
              {conv.avatar}
              {conv.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-semibold text-text-primary truncate">{conv.name}</h3>
                <span className="text-xs text-text-secondary whitespace-nowrap">{conv.timestamp}</span>
              </div>
              <p className="text-xs text-text-secondary truncate">{conv.role}</p>
              <p className="text-xs text-text-secondary truncate mt-1">{conv.lastMessage}</p>
            </div>

            {conv.unread > 0 && (
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {conv.unread}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
