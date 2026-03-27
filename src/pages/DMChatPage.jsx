import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCircle } from '../context/CircleContext'
import { MOCK_MOMS, MOCK_CONVERSATIONS } from '../data/mockCircle'
import { camps } from '../data/camps'
import { formatChatTime, formatDaySeparator } from '../utils/formatRelativeTime'

export default function DMChatPage() {
  const { momId } = useParams()
  const navigate = useNavigate()
  const { getConversation, sendMessage, markRead } = useCircle()
  const [text, setText] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  const convId = `dm-${momId}`
  const mom = MOCK_MOMS.find((m) => m.id === momId)
  const conv = getConversation(convId)

  useEffect(() => { markRead(convId) }, [convId])
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages?.length])

  function send() {
    const trimmed = text.trim()
    if (!trimmed) return
    sendMessage(convId, trimmed)
    setText('')
    textareaRef.current?.focus()
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  if (!mom) {
    return (
      <div className="min-h-screen bg-capp-warm-bg flex items-center justify-center">
        <p className="font-[Montserrat] text-capp-dark/50">Conversation not found</p>
      </div>
    )
  }

  // Find the shared camp (how they met)
  const sharedCamp = mom.campIds.map((id) => camps.find((c) => c.id === id)).find(Boolean)

  const messages = conv?.messages ?? []

  // Build render list with day separators
  const groups = []
  let lastDay = null
  let runBuffer = null

  function flushRun() {
    if (runBuffer) { groups.push(runBuffer); runBuffer = null }
  }

  messages.forEach((msg) => {
    const day = new Date(msg.ts).toDateString()
    if (day !== lastDay) {
      flushRun()
      groups.push({ type: 'separator', ts: msg.ts })
      lastDay = day
    }
    const isMe = msg.senderId === 'me'
    if (runBuffer && runBuffer.isMe === isMe) {
      runBuffer.messages.push(msg)
    } else {
      flushRun()
      runBuffer = { type: 'run', isMe, messages: [msg] }
    }
  })
  flushRun()

  return (
    <div className="flex flex-col h-screen bg-capp-warm-bg">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-capp-dark/5 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-capp-warm-bg border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
        >
          ←
        </button>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white font-[League_Spartan] shrink-0 shadow-sm"
          style={{ backgroundColor: mom.avatarColor }}
        >
          {mom.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-[League_Spartan] font-bold text-capp-dark text-base leading-tight uppercase">{mom.name}</h2>
          <p className="font-[Montserrat] text-xs text-capp-dark/50">{mom.location} · {mom.kidName}'s mom</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1" style={{ paddingBottom: '8rem' }}>

        {/* Met through banner */}
        {sharedCamp && (
          <div
            className="flex items-center gap-2 rounded-2xl px-3 py-2 mb-3 self-center"
            style={{ backgroundColor: `${sharedCamp.accent}15`, border: `1px solid ${sharedCamp.accent}30` }}
          >
            <span className="text-base">{sharedCamp.icon}</span>
            <span className="font-[Montserrat] text-xs font-medium text-capp-dark/60">
              Met through {sharedCamp.name}
            </span>
          </div>
        )}

        {groups.map((item, i) => {
          if (item.type === 'separator') {
            return (
              <div key={`sep-${i}`} className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-capp-dark/8" />
                <span className="font-[Montserrat] text-[10px] text-capp-dark/35 font-medium">
                  {formatDaySeparator(item.ts)}
                </span>
                <div className="flex-1 h-px bg-capp-dark/8" />
              </div>
            )
          }

          return (
            <div key={`run-${i}`} className={`flex gap-2 mb-2 ${item.isMe ? 'justify-end' : 'justify-start'}`}>
              {!item.isMe && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white font-[Montserrat] shrink-0 mt-1"
                  style={{ backgroundColor: mom.avatarColor }}
                >
                  {mom.name[0]}
                </div>
              )}
              <div className={`flex flex-col gap-1 max-w-[78%] ${item.isMe ? 'items-end' : 'items-start'}`}>
                {item.messages.map((msg) => (
                  <div key={msg.id}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl ${
                        item.isMe
                          ? 'bg-capp-coral text-capp-dark rounded-br-sm'
                          : 'bg-white text-capp-dark shadow-sm rounded-bl-sm'
                      }`}
                    >
                      <p className="font-[Montserrat] text-sm leading-relaxed">{msg.body}</p>
                    </div>
                    <p className={`font-[Montserrat] text-[9px] text-capp-dark/30 mt-0.5 ${item.isMe ? 'text-right' : 'text-left ml-1'}`}>
                      {formatChatTime(msg.ts)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {messages.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold text-white font-[League_Spartan] mb-3 shadow-md"
              style={{ backgroundColor: mom.avatarColor }}
            >
              {mom.name[0]}
            </div>
            <p className="font-[League_Spartan] font-bold text-capp-dark text-lg">{mom.name}</p>
            <p className="font-[Montserrat] text-sm text-capp-dark/50 mt-1">{mom.location}</p>
            <p className="font-[Montserrat] text-xs text-capp-dark/35 mt-3">
              Say hi to start the conversation ☀️
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-capp-dark/8 px-3 py-2" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}>
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`
            }}
            onKeyDown={onKeyDown}
            placeholder={`Message ${mom.name.split(' ')[0]}…`}
            className="flex-1 font-[Montserrat] text-sm bg-capp-warm-bg border border-capp-dark/10 rounded-2xl px-4 py-2.5 resize-none focus:outline-none focus:border-capp-coral/40 transition-colors placeholder:text-capp-dark/30"
            style={{ minHeight: '42px', maxHeight: '96px' }}
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="w-10 h-10 rounded-full bg-capp-coral flex items-center justify-center text-capp-dark shrink-0 disabled:opacity-40 active:scale-90 transition-transform"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
