import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useKids } from '../context/KidsContext'
import { useSaved } from '../context/SavedCampsContext'
import { useCamps } from '../lib/useCamps'

// ── Components ────────────────────────────────────────────────────────────────

const QUICK_CHIPS = [
  'Recommend a camp for my kids',
  'How do I register?',
  'Help me build my summer',
  'Help with pricing',
  'Other',
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-capp-coral flex items-center justify-center shrink-0 text-capp-dark text-xs font-bold font-garet shadow-sm">
        ✦
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-capp-dark/30 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'

  function renderText(text) {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      return (
        <p key={i} className={i > 0 ? 'mt-1' : ''}>
          {parts.map((part, j) =>
            part.startsWith('**') ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </p>
      )
    })
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] bg-capp-coral text-capp-dark rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
          <p className="font-garet text-sm leading-relaxed">{msg.text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-capp-coral flex items-center justify-center shrink-0 text-white text-xs font-bold font-garet shadow-sm self-start mt-0.5">
        ✦
      </div>
      <div className="max-w-[82%] bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <p className="font-garet text-[11px] font-bold text-capp-coral mb-1 uppercase tracking-wide">CAMPP Assistant</p>
        <div className="font-garet text-sm text-capp-dark/80 leading-relaxed space-y-0.5">
          {msg.text ? renderText(msg.text) : (
            <span className="inline-block w-2 h-4 bg-capp-coral/40 animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AIChatPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { kids } = useKids()
  const { savedEntries } = useSaved()
  const { camps } = useCamps()

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: `Hi ${firstName}! 👋 I'm your CAMPP assistant — here to help you find the perfect camps, answer registration questions, and plan your summer.\n\nWhat can I help you with today?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chipsVisible, setChipsVisible] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  async function sendMessage(text) {
    if (!text.trim() || isTyping) return
    setChipsVisible(false)

    const userMsg = { id: Date.now().toString(), role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    scrollToBottom()

    // Build conversation history for the API (exclude the app's welcome message)
    const apiMessages = [
      ...messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
      { role: 'user', content: text.trim() },
    ]

    // Pass full user context so Claude can give personalized responses
    const savedCampsList = camps.filter((c) => savedEntries.some((e) => e.id === c.id))
    const userContext = {
      userName: user?.name,
      kids: kids.map((k) => ({
        name: k.name,
        age: k.age,
        interests: k.interests,
        environment: k.environment,
        stimulation: k.stimulation,
        challenge: k.challenge,
      })),
      savedCamps: savedCampsList.map((c) => ({ name: c.name, price: c.price, location: c.location })),
    }

    const aiMsgId = `ai-${Date.now()}`

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, userContext }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let msgAdded = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        fullText += decoder.decode(value, { stream: true })

        if (!msgAdded) {
          msgAdded = true
          setIsTyping(false)
          setMessages((prev) => [...prev, { id: aiMsgId, role: 'ai', text: fullText }])
        } else {
          setMessages((prev) =>
            prev.map((m) => (m.id === aiMsgId ? { ...m, text: fullText } : m))
          )
        }
        scrollToBottom()
      }

      if (!msgAdded) throw new Error('Empty response')

    } catch (err) {
      console.error('[AIChatPage]', err)
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          role: 'ai',
          text: "Sorry, I'm having trouble connecting right now. Please try again — just type your question below! 😊",
        },
      ])
      scrollToBottom()
    } finally {
      // Always unlock the input, no matter what happened above
      setIsTyping(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="bg-capp-warm-bg flex flex-col" style={{ height: '100dvh' }}>

      {/* Header */}
      <div className="bg-white border-b border-capp-dark/8 px-4 pt-12 pb-3 flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-capp-warm-bg border border-capp-dark/10 flex items-center justify-center text-capp-dark active:scale-95 transition-transform shrink-0"
        >
          ←
        </button>
        <div className="w-9 h-9 rounded-full bg-capp-coral flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white font-bold text-base leading-none">✦</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-garet font-bold text-capp-dark text-base leading-tight">CAMPP Assistant</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="font-garet text-[11px] text-capp-dark/40">Online · replies instantly</p>
          </div>
        </div>
      </div>

      {/* Messages — scrollable middle section */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}

        {/* Quick chips */}
        {chipsVisible && !isTyping && (
          <div className="flex flex-wrap gap-2 mt-1">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="font-garet text-xs font-semibold text-capp-coral bg-capp-coral/8 border border-capp-coral/25 px-3 py-2 rounded-full active:scale-95 transition-transform"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — sits in flow, rises with the keyboard on iOS */}
      <div
        className="shrink-0 bg-white border-t border-capp-dark/8 px-4 pt-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            enterKeyHint="send"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 font-garet bg-capp-warm-bg border-2 border-capp-dark/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-capp-coral/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 rounded-2xl bg-capp-coral flex items-center justify-center text-capp-dark text-lg active:scale-95 transition-all disabled:opacity-35 shrink-0"
          >
            ↑
          </button>
        </form>
        <p className="font-garet text-[10px] text-capp-dark/25 text-center mt-2">
          Tap the field above to open your keyboard
        </p>
      </div>
    </div>
  )
}
