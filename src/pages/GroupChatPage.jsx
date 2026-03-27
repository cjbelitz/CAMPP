import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useCircle } from '../context/CircleContext'
import { MOCK_MOMS } from '../data/mockCircle'
import { camps } from '../data/camps'
import { formatChatTime, formatDaySeparator } from '../utils/formatRelativeTime'
import CarpoolCard from '../components/CarpoolCard'
import CarpoolSheet from '../components/CarpoolSheet'

function MomBubble({ color, initial, size = 8 }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold text-white font-[Montserrat] shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  )
}

export default function GroupChatPage() {
  const { campId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { getConversation, sendMessage, sendCarpool, markRead } = useCircle()
  const [text, setText] = useState('')
  const [showMembers, setShowMembers] = useState(false)
  const [showCarpool, setShowCarpool] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  // Support both camp-based and custom circles via location state
  const circleState = location.state ?? {}
  const convId = `group-${campId}`
  const conv = getConversation(convId)
  const camp = camps.find((c) => c.id === Number(campId))

  // Fall back to circle state when no matching camp (user-created circles)
  const displayName   = camp?.name   ?? circleState.circleName   ?? 'Circle'
  const displayIcon   = camp?.icon   ?? circleState.circleIcon   ?? '💬'
  const displayAccent = camp?.accent ?? circleState.circleAccent ?? '#FABE37'

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

  if (!conv && !camp && !circleState.circleName) {
    return (
      <div className="min-h-screen bg-capp-warm-bg flex items-center justify-center">
        <p className="font-[Montserrat] text-capp-dark/50">Circle not found</p>
      </div>
    )
  }

  const messages = conv?.messages ?? []
  const members = camp
    ? MOCK_MOMS.filter((m) => m.campIds.includes(Number(campId)))
    : (circleState.circleMemberIds ?? []).map((id) => MOCK_MOMS.find((m) => m.id === id)).filter(Boolean)

  // Build render list: day separators + carpool messages break out of runs
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
      groups.push({ type: 'separator', ts: msg.ts, day })
      lastDay = day
    }

    if (msg.type === 'carpool') {
      flushRun()
      groups.push({ type: 'carpool', msg })
      return
    }

    const isMe = msg.senderId === 'me'
    if (runBuffer && runBuffer.senderId === msg.senderId) {
      runBuffer.messages.push(msg)
    } else {
      flushRun()
      runBuffer = { type: 'run', senderId: msg.senderId, isMe, messages: [msg] }
    }
  })
  flushRun()

  return (
    <div className="flex flex-col h-screen bg-capp-warm-bg">

      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-capp-dark/5"
        style={{ backgroundColor: `${displayAccent}18` }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
        >
          ←
        </button>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: `${displayAccent}30` }}
        >
          {displayIcon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-[League_Spartan] font-bold text-capp-dark text-base leading-tight truncate uppercase">
            {displayName}
          </h2>
          <p className="font-[Montserrat] text-xs text-capp-dark/50">
            group · {members.length + 1} members
          </p>
        </div>
        <button
          onClick={() => setShowMembers(true)}
          className="shrink-0 font-[Montserrat] text-xs font-semibold text-capp-dark/50 bg-white/70 px-3 py-1.5 rounded-xl"
        >
          👥 {members.length + 1}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1" style={{ paddingBottom: '8rem' }}>
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

          if (item.type === 'carpool') {
            const isMe = item.msg.senderId === 'me'
            const mom = !isMe ? MOCK_MOMS.find((m) => m.id === item.msg.senderId) : null
            return (
              <div key={`carpool-${i}`} className={`flex gap-2 mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className="flex flex-col items-center pt-1 shrink-0">
                    <MomBubble color={mom?.avatarColor ?? '#ccc'} initial={mom?.name?.[0] ?? '?'} />
                  </div>
                )}
                <div className={`flex flex-col gap-1 max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <span className="font-[Montserrat] text-[10px] font-semibold text-capp-dark/50 ml-1">
                      {mom?.name}
                    </span>
                  )}
                  <CarpoolCard msg={item.msg} isMe={isMe} />
                  <p className={`font-[Montserrat] text-[9px] text-capp-dark/30 mt-0.5 ${isMe ? 'text-right' : 'text-left ml-1'}`}>
                    {formatChatTime(item.msg.ts)}
                  </p>
                </div>
              </div>
            )
          }

          const isMe = item.isMe
          const mom = !isMe ? MOCK_MOMS.find((m) => m.id === item.senderId) : null

          return (
            <div key={`run-${i}`} className={`flex gap-2 mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <MomBubble color={mom?.avatarColor ?? '#ccc'} initial={mom?.name?.[0] ?? '?'} />
                </div>
              )}
              <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <span className="font-[Montserrat] text-[10px] font-semibold text-capp-dark/50 ml-1">
                    {mom?.name}
                  </span>
                )}
                {item.messages.map((msg) => (
                  <div key={msg.id}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl ${
                        isMe
                          ? 'bg-capp-coral text-capp-dark rounded-br-sm'
                          : 'bg-white text-capp-dark shadow-sm rounded-bl-sm'
                      }`}
                    >
                      <p className="font-[Montserrat] text-sm leading-relaxed">{msg.body}</p>
                    </div>
                    <p className={`font-[Montserrat] text-[9px] text-capp-dark/30 mt-0.5 ${isMe ? 'text-right' : 'text-left ml-1'}`}>
                      {formatChatTime(msg.ts)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-capp-dark/8 px-3 py-2 pb-safe" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}>
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowCarpool(true)}
            className="w-10 h-10 rounded-full bg-capp-warm-bg border border-capp-dark/10 flex items-center justify-center text-base shrink-0 active:scale-90 transition-transform"
          >
            🚗
          </button>
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
            placeholder={`Message ${displayName}…`}
            className="flex-1 font-[Montserrat] text-sm bg-capp-warm-bg border border-capp-dark/10 rounded-2xl px-4 py-2.5 resize-none focus:outline-none focus:border-capp-coral/40 transition-colors placeholder:text-capp-dark/30"
            style={{ minHeight: '42px', maxHeight: '96px' }}
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-40 active:scale-90 transition-transform"
            style={{ backgroundColor: displayAccent }}
          >
            ↑
          </button>
        </div>
      </div>

      {/* Members sheet */}
      {showMembers && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMembers(false)} />
          <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-10">
            <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-5" />
            <h3 className="font-[League_Spartan] font-bold text-capp-dark text-lg mb-4 uppercase">
              {members.length + 1} members in this circle
            </h3>
            {/* Me */}
            <div className="flex items-center gap-3 py-2.5 border-b border-capp-dark/5">
              <div className="w-10 h-10 rounded-full bg-capp-coral flex items-center justify-center text-capp-dark text-sm font-bold font-[League_Spartan]">
                Y
              </div>
              <div>
                <p className="font-[Montserrat] text-sm font-semibold text-capp-dark">You</p>
                <p className="font-[Montserrat] text-xs text-capp-dark/40">North County SD</p>
              </div>
            </div>
            {members.map((mom) => (
              <div key={mom.id} className="flex items-center gap-3 py-2.5 border-b border-capp-dark/5 last:border-0">
                <MomBubble color={mom.avatarColor} initial={mom.name[0]} size={10} />
                <div className="flex-1">
                  <p className="font-[Montserrat] text-sm font-semibold text-capp-dark">{mom.name}</p>
                  <p className="font-[Montserrat] text-xs text-capp-dark/40">{mom.location} · {mom.kidName}'s mom</p>
                </div>
                <button
                  onClick={() => { setShowMembers(false); navigate(`/circle/dm/${mom.id}`) }}
                  className="font-[Montserrat] text-xs font-semibold text-capp-coral bg-capp-coral/10 px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
                >
                  DM
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carpool sheet */}
      {showCarpool && (
        <CarpoolSheet
          onClose={() => setShowCarpool(false)}
          onSubmit={(data) => sendCarpool(convId, data)}
        />
      )}
    </div>
  )
}
