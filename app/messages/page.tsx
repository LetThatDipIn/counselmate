"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search, Send, Phone, Video, MoreVertical,
  Paperclip, MessageSquare, X, ChevronLeft
} from "lucide-react"

/* ─── Types ───────────────────────────────────────── */

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

/* ─── Mock data ───────────────────────────────────── */

const mockConversations: Conversation[] = [
  { id: 1, name: "Rajesh Kumar",  role: "Chartered Accountant", avatar: "R", lastMessage: "I'll send you the tax filing documents tomorrow", timestamp: "10:30 AM", unread: 0, online: true  },
  { id: 2, name: "Priya Singh",   role: "Corporate Lawyer",     avatar: "P", lastMessage: "The contract has been reviewed. Let me schedule a call.", timestamp: "Yesterday", unread: 2, online: true  },
  { id: 3, name: "Amit Patel",    role: "Tax Specialist",       avatar: "A", lastMessage: "Thanks for the clarity on the international tax issue", timestamp: "2 days ago", unread: 0, online: false },
  { id: 4, name: "Neha Sharma",   role: "Labour Lawyer",        avatar: "N", lastMessage: "I've prepared the employment contract for review", timestamp: "3 days ago", unread: 0, online: false },
]

const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, senderId: 2, senderName: "You", text: "Hi Rajesh, I need help with my GST compliance", timestamp: "9:00 AM", read: true, type: "text" },
    { id: 2, senderId: 1, senderName: "Rajesh Kumar", text: "Sure, I can help you with that. What exactly is the issue you're facing?", timestamp: "9:15 AM", read: true, type: "text" },
    { id: 3, senderId: 2, senderName: "You", text: "I'm getting confused about filing the quarterly returns — the input tax credit reconciliation especially.", timestamp: "9:30 AM", read: true, type: "text" },
    { id: 4, senderId: 1, senderName: "Rajesh Kumar", text: "Understood. I'll send you the tax filing documents and a checklist tomorrow morning so we can work through it step by step.", timestamp: "10:30 AM", read: true, type: "text" },
  ],
  2: [
    { id: 1, senderId: 2, senderName: "You", text: "Hi Priya, can you review my NDA before I sign it?", timestamp: "2:00 PM", read: true, type: "text" },
    { id: 2, senderId: 3, senderName: "Priya Singh", text: "Yes, absolutely. Please share the document and I'll have a look.", timestamp: "2:15 PM", read: true, type: "text" },
    { id: 3, senderId: 2, senderName: "You", text: "Shared the document →", timestamp: "2:20 PM", read: true, type: "file" },
    { id: 4, senderId: 3, senderName: "Priya Singh", text: "The contract has been reviewed. Let me schedule a call to walk you through the clauses I've flagged.", timestamp: "3:00 PM", read: false, type: "text" },
  ],
  3: [
    { id: 1, senderId: 2, senderName: "You", text: "Amit, quick question on DTAA provisions for my Singapore income.", timestamp: "Mon 11:00 AM", read: true, type: "text" },
    { id: 2, senderId: 3, senderName: "Amit Patel", text: "Happy to clarify. The India-Singapore DTAA has specific provisions for royalties and tech services income.", timestamp: "Mon 11:30 AM", read: true, type: "text" },
    { id: 3, senderId: 2, senderName: "You", text: "Thanks for the clarity on the international tax issue!", timestamp: "Mon 12:00 PM", read: true, type: "text" },
  ],
  4: [
    { id: 1, senderId: 4, senderName: "Neha Sharma", text: "I've prepared the employment contract for review. A few clauses around IP assignment need your attention.", timestamp: "Wed 3:00 PM", read: true, type: "text" },
    { id: 2, senderId: 2, senderName: "You", text: "Great, I'll go through it tonight.", timestamp: "Wed 4:00 PM", read: true, type: "text" },
  ],
}

const autoReplies = [
  "Thanks for your message! I'll get back to you shortly.",
  "Got it, let me look into this and follow up.",
  "Sure, I can help with that. Give me a moment.",
]

/* ─── Page ────────────────────────────────────────── */

export default function MessagesPage() {
  const [selected, setSelected]       = useState<Conversation>(mockConversations[0])
  const [messageText, setMessageText] = useState("")
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>(mockMessages)
  const [search, setSearch]           = useState("")
  const [mobileView, setMobileView]   = useState<"list" | "chat">("list")
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const messages = allMessages[selected?.id] || []

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSelect = (conv: Conversation) => {
    setSelected(conv)
    setMobileView("chat")
    // Clear unread
    // (in a real app you'd call an API)
  }

  const handleSend = () => {
    if (!messageText.trim()) return
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    const newMsg: Message = {
      id: Date.now(),
      senderId: 0,
      senderName: "You",
      text: messageText,
      timestamp: now,
      read: false,
      type: "text",
    }
    setAllMessages(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), newMsg],
    }))
    setMessageText("")
    inputRef.current?.focus()

    // Simulate reply
    const reply: Message = {
      id: Date.now() + 1,
      senderId: selected.id,
      senderName: selected.name,
      text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      read: false,
      type: "text",
    }
    setTimeout(() => {
      setAllMessages(prev => ({
        ...prev,
        [selected.id]: [...(prev[selected.id] || []), reply],
      }))
    }, 1100)
  }

  const filtered = mockConversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  )

  const totalUnread = mockConversations.reduce((s, c) => s + c.unread, 0)

  return (
    <>
      <style>{css}</style>
      <div className="msg-root">

        {/* ════════════════ SIDEBAR ════════════════ */}
        <aside className={`msg-sidebar${mobileView === "chat" ? " mobile-hidden" : ""}`}>

          {/* Sidebar header */}
          <div className="sidebar-head">
            <div className="sidebar-title-row">
              <div>
                <div className="sidebar-eyebrow">Inbox</div>
                <h1 className="sidebar-title">Messages</h1>
              </div>
              {totalUnread > 0 && (
                <span className="sidebar-unread-badge">{totalUnread} new</span>
              )}
            </div>

            {/* Search */}
            <div className="sidebar-search">
              <Search size={14} className="sidebar-search-icon" />
              <input
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="sidebar-search-input"
              />
              {search && (
                <button className="sidebar-search-clear" onClick={() => setSearch("")}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Conversation list */}
          <div className="conv-list">
            {filtered.length === 0 ? (
              <div className="conv-empty">No conversations found</div>
            ) : filtered.map(conv => {
              const msgs = allMessages[conv.id] || []
              const last = msgs[msgs.length - 1]
              const isActive = selected?.id === conv.id
              return (
                <button
                  key={conv.id}
                  className={`conv-item${isActive ? " active" : ""}`}
                  onClick={() => handleSelect(conv)}
                >
                  {/* Avatar */}
                  <div className="conv-avatar-wrap">
                    <div className={`conv-avatar${isActive ? " active" : ""}`}>
                      {conv.avatar}
                    </div>
                    {conv.online && <span className="conv-online-dot" />}
                  </div>

                  {/* Body */}
                  <div className="conv-body">
                    <div className="conv-row1">
                      <span className="conv-name">{conv.name}</span>
                      <span className="conv-time">{conv.timestamp}</span>
                    </div>
                    <div className="conv-row2">
                      <span className="conv-preview">
                        {last?.text || conv.lastMessage}
                      </span>
                      {conv.unread > 0 && (
                        <span className="conv-unread">{conv.unread}</span>
                      )}
                    </div>
                    <div className="conv-role">{conv.role}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* ════════════════ CHAT ════════════════ */}
        <main className={`msg-chat${mobileView === "list" ? " mobile-hidden" : ""}`}>
          {selected ? (
            <>
              {/* Chat header */}
              <div className="chat-header">
                <button className="chat-back-btn" onClick={() => setMobileView("list")}>
                  <ChevronLeft size={18} />
                </button>
                <div className="chat-header-avatar-wrap">
                  <div className="chat-header-avatar">{selected.avatar}</div>
                  {selected.online && <span className="chat-online-dot" />}
                </div>
                <div className="chat-header-info">
                  <div className="chat-header-name">{selected.name}</div>
                  <div className="chat-header-role">
                    {selected.online
                      ? <><span className="chat-status-dot" />Online</>
                      : selected.role
                    }
                  </div>
                </div>
                <div className="chat-header-actions">
                  <button className="chat-action-btn" title="Voice call">
                    <Phone size={17} />
                  </button>
                  <button className="chat-action-btn" title="Video call">
                    <Video size={17} />
                  </button>
                  <button className="chat-action-btn" title="More options">
                    <MoreVertical size={17} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {/* Date group label */}
                <div className="chat-date-label">Today</div>

                {messages.map((msg, i) => {
                  const isMine = msg.senderId === 0 || msg.senderName === "You"
                  const prevMine = i > 0 && (messages[i-1].senderId === 0 || messages[i-1].senderName === "You")
                  const grouped = isMine === prevMine && i > 0
                  return (
                    <div
                      key={msg.id}
                      className={`msg-row${isMine ? " mine" : " theirs"}${grouped ? " grouped" : ""}`}
                    >
                      {!isMine && !grouped && (
                        <div className="msg-sender-avatar">{selected.avatar}</div>
                      )}
                      {!isMine && grouped && <div className="msg-avatar-spacer" />}

                      <div className="msg-bubble-wrap">
                        {msg.type === "file" ? (
                          <div className={`msg-file-bubble${isMine ? " mine" : ""}`}>
                            <Paperclip size={14} />
                            <span>Attachment shared</span>
                          </div>
                        ) : (
                          <div className={`msg-bubble${isMine ? " mine" : " theirs"}`}>
                            {msg.text}
                          </div>
                        )}
                        {!grouped && (
                          <div className={`msg-meta${isMine ? " mine" : ""}`}>
                            {msg.timestamp}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="chat-input-area">
                <div className="chat-input-wrap">
                  <button className="chat-input-icon-btn" title="Attach file">
                    <Paperclip size={16} />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder={`Message ${selected.name.split(" ")[0]}…`}
                    className="chat-input"
                  />
                  <button
                    className={`chat-send-btn${messageText.trim() ? " active" : ""}`}
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="chat-input-hint">Press Enter to send · Shift+Enter for new line</div>
              </div>
            </>
          ) : (
            <div className="chat-empty">
              <div className="chat-empty-icon"><MessageSquare size={28} /></div>
              <div className="chat-empty-title">Select a conversation</div>
              <div className="chat-empty-desc">Choose from your existing conversations to start messaging.</div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

/* ─── Styles ──────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0d0f1a;
    --ink-soft: #3d3f52;
    --ink-muted: #7b7d94;
    --cream: #f7f5f0;
    --cream-dark: #e8e4dc;
    --gold: #c9a84c;
    --blue-deep: #1a2b6d;
    --blue-bright: #4169e1;
    --blue-bubble: #4169e1;
    --surface: #ffffff;
  }

  .msg-root {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    height: 100dvh;
    background: var(--cream);
    color: var(--ink);
    overflow: hidden;
  }

  /* ════════════════ SIDEBAR ════════════════ */
  .msg-sidebar {
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border-right: 1px solid var(--cream-dark);
    overflow: hidden;
  }

  .sidebar-head {
    padding: 1.75rem 1.5rem 1.1rem;
    border-bottom: 1px solid var(--cream-dark);
    flex-shrink: 0;
  }

  .sidebar-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .sidebar-eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    margin-bottom: 0.2rem;
  }
  .sidebar-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.6rem;
    color: var(--ink);
    font-weight: 400;
    line-height: 1.1;
  }
  .sidebar-unread-badge {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.25rem 0.65rem;
    border-radius: 100px;
    background: var(--blue-bright);
    color: #fff;
    margin-top: 4px;
    letter-spacing: 0.02em;
  }

  .sidebar-search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--cream);
    border: 1.5px solid var(--cream-dark);
    border-radius: 10px;
    padding: 0.5rem 0.75rem;
    transition: border-color 0.2s;
  }
  .sidebar-search:focus-within {
    border-color: var(--blue-bright);
    background: #fff;
  }
  .sidebar-search-icon { color: var(--ink-muted); flex-shrink: 0; }
  .sidebar-search-input {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.82rem; color: var(--ink);
    font-family: 'DM Sans', sans-serif;
  }
  .sidebar-search-input::placeholder { color: var(--ink-muted); }
  .sidebar-search-clear {
    background: none; border: none; cursor: pointer;
    color: var(--ink-muted); display: flex; align-items: center;
    padding: 0; transition: color 0.15s;
  }
  .sidebar-search-clear:hover { color: var(--ink); }

  /* Conversation list */
  .conv-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--cream-dark) transparent;
  }
  .conv-empty {
    padding: 2rem 1.5rem;
    font-size: 0.82rem;
    color: var(--ink-muted);
    text-align: center;
  }

  .conv-item {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem 1.5rem;
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--cream-dark);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .conv-item:hover { background: var(--cream); }
  .conv-item.active { background: var(--cream); }

  .conv-avatar-wrap { position: relative; flex-shrink: 0; }
  .conv-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--ink);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.05rem;
    transition: background 0.15s;
  }
  .conv-avatar.active { background: var(--blue-deep); }
  .conv-online-dot {
    position: absolute; bottom: 1px; right: 1px;
    width: 9px; height: 9px; border-radius: 50%;
    background: #22c55e;
    border: 2px solid var(--surface);
  }

  .conv-body { flex: 1; min-width: 0; }
  .conv-row1 {
    display: flex; align-items: baseline;
    justify-content: space-between; gap: 0.5rem;
    margin-bottom: 0.15rem;
  }
  .conv-name {
    font-size: 0.875rem; font-weight: 600; color: var(--ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .conv-time { font-size: 0.7rem; color: var(--ink-muted); flex-shrink: 0; }
  .conv-row2 { display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; }
  .conv-preview {
    font-size: 0.78rem; color: var(--ink-muted); font-weight: 300;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    flex: 1;
  }
  .conv-unread {
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--blue-bright); color: #fff;
    font-size: 0.62rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .conv-role { font-size: 0.68rem; color: var(--ink-muted); margin-top: 0.2rem; }

  /* ════════════════ CHAT ════════════════ */
  .msg-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    overflow: hidden;
    min-width: 0;
  }

  /* Chat header */
  .chat-header {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--cream-dark);
    flex-shrink: 0;
    background: var(--surface);
  }
  .chat-back-btn {
    display: none;
    background: none; border: none; cursor: pointer;
    color: var(--ink-muted); padding: 0.25rem;
    border-radius: 8px; transition: color 0.15s, background 0.15s;
  }
  .chat-back-btn:hover { color: var(--ink); background: var(--cream); }
  .chat-header-avatar-wrap { position: relative; flex-shrink: 0; }
  .chat-header-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--blue-deep); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.1rem;
  }
  .chat-online-dot {
    position: absolute; bottom: 1px; right: 1px;
    width: 9px; height: 9px; border-radius: 50%;
    background: #22c55e; border: 2px solid var(--surface);
  }
  .chat-header-info { flex: 1; min-width: 0; }
  .chat-header-name {
    font-size: 0.925rem; font-weight: 600; color: var(--ink);
  }
  .chat-header-role {
    font-size: 0.75rem; color: var(--ink-muted);
    display: flex; align-items: center; gap: 0.35rem; margin-top: 0.1rem;
  }
  .chat-status-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
  }
  .chat-header-actions {
    display: flex; gap: 0.25rem;
  }
  .chat-action-btn {
    width: 34px; height: 34px; border-radius: 9px;
    background: transparent; border: none; cursor: pointer;
    color: var(--ink-muted);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s;
  }
  .chat-action-btn:hover { background: var(--cream); color: var(--ink); }

  /* Messages area */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 1.5rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    scrollbar-width: thin;
    scrollbar-color: var(--cream-dark) transparent;
    background: var(--cream);
  }

  .chat-date-label {
    text-align: center;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink-muted);
    margin: 0.5rem 0 0.75rem;
  }

  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 0.6rem;
    animation: msgIn 0.25s ease both;
  }
  .msg-row.mine { flex-direction: row-reverse; }
  .msg-row.grouped { margin-top: -0.1rem; }

  .msg-sender-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--ink); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 0.8rem; flex-shrink: 0;
  }
  .msg-avatar-spacer { width: 28px; flex-shrink: 0; }

  .msg-bubble-wrap {
    display: flex;
    flex-direction: column;
    max-width: 62%;
    gap: 0.2rem;
  }
  .msg-row.mine .msg-bubble-wrap { align-items: flex-end; }

  .msg-bubble {
    padding: 0.65rem 1rem;
    border-radius: 14px;
    font-size: 0.875rem;
    line-height: 1.55;
    word-break: break-word;
  }
  .msg-bubble.theirs {
    background: var(--surface);
    color: var(--ink);
    border-bottom-left-radius: 4px;
    border: 1px solid var(--cream-dark);
  }
  .msg-bubble.mine {
    background: var(--blue-bright);
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  .msg-row.grouped .msg-bubble.theirs { border-bottom-left-radius: 14px; }
  .msg-row.grouped .msg-bubble.mine  { border-bottom-right-radius: 14px; }

  .msg-file-bubble {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 12px;
    background: var(--surface);
    border: 1.5px solid var(--cream-dark);
    font-size: 0.8rem;
    color: var(--ink-soft);
  }
  .msg-file-bubble.mine {
    background: rgba(255,255,255,0.15);
    border-color: rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.9);
  }

  .msg-meta {
    font-size: 0.67rem;
    color: var(--ink-muted);
    padding: 0 0.25rem;
  }
  .msg-meta.mine { text-align: right; color: var(--ink-muted); }

  /* Input area */
  .chat-input-area {
    padding: 1rem 1.5rem 1.25rem;
    border-top: 1px solid var(--cream-dark);
    background: var(--surface);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .chat-input-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--cream);
    border: 1.5px solid var(--cream-dark);
    border-radius: 12px;
    padding: 0.55rem 0.6rem 0.55rem 0.9rem;
    transition: border-color 0.2s, background 0.2s;
  }
  .chat-input-wrap:focus-within {
    border-color: var(--blue-bright);
    background: #fff;
  }
  .chat-input-icon-btn {
    background: none; border: none; cursor: pointer;
    color: var(--ink-muted); padding: 0.3rem;
    border-radius: 7px; display: flex; align-items: center;
    transition: color 0.15s, background 0.15s; flex-shrink: 0;
  }
  .chat-input-icon-btn:hover { color: var(--ink); background: var(--cream-dark); }
  .chat-input {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.875rem; color: var(--ink);
    font-family: 'DM Sans', sans-serif;
  }
  .chat-input::placeholder { color: var(--ink-muted); }

  .chat-send-btn {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--cream-dark); color: var(--ink-muted);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .chat-send-btn.active {
    background: var(--blue-bright); color: #fff;
  }
  .chat-send-btn.active:hover {
    background: #3057cc;
    transform: scale(1.05);
    box-shadow: 0 4px 14px rgba(65,105,225,0.35);
  }
  .chat-send-btn:disabled { cursor: default; }

  .chat-input-hint {
    font-size: 0.68rem;
    color: var(--ink-muted);
    padding: 0 0.25rem;
  }

  /* Empty state */
  .chat-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 0.75rem;
    text-align: center; padding: 2rem; background: var(--cream);
  }
  .chat-empty-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: var(--cream-dark); color: var(--ink-muted);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.25rem;
  }
  .chat-empty-title { font-size: 1rem; font-weight: 600; color: var(--ink); }
  .chat-empty-desc { font-size: 0.83rem; color: var(--ink-muted); font-weight: 300; max-width: 280px; }

  /* ── Keyframes ── */
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: none; }
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .msg-sidebar { width: 100%; }
    .msg-sidebar.mobile-hidden { display: none; }
    .msg-chat.mobile-hidden { display: none; }
    .chat-back-btn { display: flex; }
    .chat-input-hint { display: none; }
    .chat-messages { padding: 1rem 1rem 0.5rem; }
    .msg-bubble-wrap { max-width: 80%; }
  }
`