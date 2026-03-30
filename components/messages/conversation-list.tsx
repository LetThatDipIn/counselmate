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
    <>
      <style>{css}</style>
      <div className="cl-root">
        {/* Panel masthead */}
        <div className="cl-masthead">
          <div className="cl-masthead-eyebrow">Active Matters</div>
          <div className="cl-masthead-count">{conversations.length} conversations</div>
        </div>

        <div className="cl-list">
          {conversations.map((conv) => {
            const isActive = selectedConversation?.id === conv.id
            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`cl-item ${isActive ? "cl-item--active" : ""}`}
              >
                {/* Active accent bar */}
                {isActive && <div className="cl-item-bar" aria-hidden="true" />}

                {/* Avatar */}
                <div className="cl-avatar-wrap">
                  <div className="cl-avatar">{conv.avatar}</div>
                  {conv.online && <span className="cl-online" aria-label="Online" />}
                </div>

                {/* Body */}
                <div className="cl-body">
                  <div className="cl-row-top">
                    <span className="cl-name">{conv.name}</span>
                    <span className="cl-time">{conv.timestamp}</span>
                  </div>
                  <div className="cl-role">{conv.role}</div>
                  <div className="cl-preview">{conv.lastMessage}</div>
                </div>

                {/* Unread badge */}
                {conv.unread > 0 && (
                  <div className="cl-badge" aria-label={`${conv.unread} unread`}>
                    {conv.unread}
                  </div>
                )}
              </button>
            )
          })}
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
    --gold-light: #e8c97a;
    --success: #2d6a4f;
  }

  .cl-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--paper);
    font-family: 'Source Serif 4', Georgia, serif;
    border-right: 1px solid var(--paper-rule);
  }

  /* ── Masthead ── */
  .cl-masthead {
    padding: 0.875rem 1.25rem;
    background: var(--night);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .cl-masthead-eyebrow {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.01em;
  }
  .cl-masthead-count {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
  }

  /* ── List ── */
  .cl-list {
    flex: 1;
    overflow-y: auto;
  }
  .cl-list::-webkit-scrollbar { width: 3px; }
  .cl-list::-webkit-scrollbar-thumb { background: var(--paper-rule); }

  /* ── Item ── */
  .cl-item {
    position: relative;
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    text-align: left;
    cursor: pointer;
    border: none;
    border-bottom: 1px solid var(--paper-rule);
    background: transparent;
    transition: background 0.15s;
    overflow: hidden;
  }
  .cl-item:hover {
    background: var(--paper-dark);
  }
  .cl-item--active {
    background: var(--paper-dark);
  }

  /* Red accent bar for active */
  .cl-item-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--red);
  }

  /* ── Avatar ── */
  .cl-avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }
  .cl-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--night);
    color: var(--gold-light);
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.9rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.06);
    transition: border-color 0.15s;
  }
  .cl-item--active .cl-avatar {
    border-color: var(--red);
  }
  .cl-online {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--success);
    border: 2px solid var(--paper);
  }
  .cl-item--active .cl-online {
    border-color: var(--paper-dark);
  }

  /* ── Body ── */
  .cl-body {
    flex: 1;
    min-width: 0;
  }
  .cl-row-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.2rem;
  }
  .cl-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  .cl-time {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.04em;
    color: var(--ink-faint);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .cl-role {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cl-preview {
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--ink-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  /* ── Badge ── */
  .cl-badge {
    flex-shrink: 0;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 3px;
    background: var(--red);
    color: #fff;
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    letter-spacing: 0.02em;
  }
`