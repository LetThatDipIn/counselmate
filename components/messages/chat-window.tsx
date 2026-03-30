"use client"

import type React from "react"
import { Check, CheckCheck, FileText } from "lucide-react"

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
    <>
      <style>{css}</style>
      <div className="cw-window">
        {/* Column header — newspaper dateline style */}
        <div className="cw-dateline">
          <span className="cw-dateline-rule" />
          <span className="cw-dateline-text">Correspondence — {selectedConversation.name}</span>
          <span className="cw-dateline-rule" />
        </div>

        {/* Message feed */}
        <div className="cw-feed">
          {messages.map((message) => {
            const isOwn = message.senderId === 2
            return (
              <div key={message.id} className={`cw-row ${isOwn ? "cw-row--own" : "cw-row--other"}`}>
                {!isOwn && (
                  <div className="cw-avatar" aria-hidden="true">
                    {selectedConversation.avatar}
                  </div>
                )}

                <div className={`cw-bubble ${isOwn ? "cw-bubble--own" : "cw-bubble--other"}`}>
                  {!isOwn && (
                    <div className="cw-sender">{message.senderName}</div>
                  )}

                  {message.type === "file" ? (
                    <div className="cw-file">
                      <div className="cw-file-icon">
                        <FileText size={16} />
                      </div>
                      <div className="cw-file-info">
                        <div className="cw-file-name">Document.pdf</div>
                        <div className="cw-file-size">45 KB</div>
                      </div>
                    </div>
                  ) : (
                    <p className="cw-text">{message.text}</p>
                  )}

                  <div className="cw-meta">
                    <span className="cw-time">{message.timestamp}</span>
                    {isOwn && (
                      <span className={`cw-status ${message.read ? "cw-status--read" : ""}`}>
                        {message.read
                          ? <CheckCheck size={12} />
                          : <Check size={12} />
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --paper: #f5f0e8;
    --paper-dark: #ece6d8;
    --paper-rule: #c8bfa8;
    --ink: #1a1610;
    --ink-soft: #3d3828;
    --ink-muted: #7a7260;
    --ink-faint: #a09880;
    --red: #8b1a1a;
    --night: #111009;
    --gold: #c9a84c;
  }

  .cw-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--paper);
    font-family: 'Source Serif 4', Georgia, serif;
  }

  /* ── Dateline ── */
  .cw-dateline {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    border-bottom: 2px solid var(--ink);
    background: var(--paper-dark);
    flex-shrink: 0;
  }
  .cw-dateline-rule {
    flex: 1;
    height: 1px;
    background: var(--paper-rule);
  }
  .cw-dateline-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-faint);
    white-space: nowrap;
  }

  /* ── Feed ── */
  .cw-feed {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .cw-feed::-webkit-scrollbar { width: 4px; }
  .cw-feed::-webkit-scrollbar-thumb { background: var(--paper-rule); border-radius: 2px; }

  /* ── Row ── */
  .cw-row {
    display: flex;
    align-items: flex-end;
    gap: 0.625rem;
  }
  .cw-row--own  { justify-content: flex-end; }
  .cw-row--other { justify-content: flex-start; }

  /* ── Avatar ── */
  .cw-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--night);
    color: var(--gold);
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid var(--paper-rule);
  }

  /* ── Bubble ── */
  .cw-bubble {
    max-width: min(320px, 72%);
    padding: 0.75rem 1rem;
    position: relative;
  }

  .cw-bubble--other {
    background: #fff;
    border: 1px solid var(--paper-rule);
    border-left: 3px solid var(--paper-rule);
    color: var(--ink);
  }
  .cw-bubble--other::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--red);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .cw-bubble--other:hover::before { opacity: 1; }

  .cw-bubble--own {
    background: var(--night);
    border: 1px solid rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.88);
  }

  /* ── Sender ── */
  .cw-sender {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 0.375rem;
  }

  /* ── Text ── */
  .cw-text {
    font-size: 0.875rem;
    line-height: 1.65;
    font-weight: 300;
    word-break: break-word;
  }
  .cw-bubble--other .cw-text { color: var(--ink-soft); }
  .cw-bubble--own .cw-text   { color: rgba(255,255,255,0.8); }

  /* ── File attachment ── */
  .cw-file {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0;
  }
  .cw-file-icon {
    width: 32px;
    height: 32px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cw-bubble--other .cw-file-icon { background: var(--paper-dark); color: var(--red); }
  .cw-bubble--own   .cw-file-icon { background: rgba(255,255,255,0.08); color: var(--gold); }

  .cw-file-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: inherit;
    margin-bottom: 0.1rem;
  }
  .cw-file-size {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: var(--ink-faint);
  }
  .cw-bubble--own .cw-file-size { color: rgba(255,255,255,0.3); }

  /* ── Meta (time + status) ── */
  .cw-meta {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.4rem;
    justify-content: flex-end;
  }
  .cw-time {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.04em;
    color: var(--ink-faint);
  }
  .cw-bubble--own .cw-time { color: rgba(255,255,255,0.25); }

  .cw-status       { color: rgba(255,255,255,0.3); display: flex; }
  .cw-status--read { color: var(--gold); }
`