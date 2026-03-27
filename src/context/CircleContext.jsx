import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { MOCK_CONVERSATIONS } from '../data/mockCircle'

const CircleContext = createContext(null)

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function CircleProvider({ children }) {
  const [userMessages, setUserMessages] = useState(() => load('capp-circle-messages', {}))
  const [lastRead, setLastRead]         = useState(() => load('capp-circle-read', {}))
  const [carpoolClaims, setCarpoolClaims] = useState(() => load('capp-carpool-claims', {}))

  useEffect(() => {
    localStorage.setItem('capp-circle-messages', JSON.stringify(userMessages))
  }, [userMessages])

  useEffect(() => {
    localStorage.setItem('capp-circle-read', JSON.stringify(lastRead))
  }, [lastRead])

  useEffect(() => {
    localStorage.setItem('capp-carpool-claims', JSON.stringify(carpoolClaims))
  }, [carpoolClaims])

  // Merge mock messages + user messages for a conversation, sorted by ts
  function getMessages(convId) {
    const mock = MOCK_CONVERSATIONS[convId]?.messages ?? []
    const user = userMessages[convId] ?? []
    return [...mock, ...user].sort((a, b) => a.ts - b.ts)
  }

  function getConversation(convId) {
    const base = MOCK_CONVERSATIONS[convId]
    const userMsgs = userMessages[convId] ?? []
    if (!base && userMsgs.length === 0) return null
    return {
      id: convId,
      type: convId.startsWith('dm-') ? 'dm' : 'group',
      momId: convId.startsWith('dm-') ? convId.slice(3) : null,
      ...(base ?? {}),
      messages: getMessages(convId),
    }
  }

  function sendMessage(convId, body) {
    const msg = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      senderId: 'me',
      body,
      ts: Date.now(),
    }
    setUserMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] ?? []), msg],
    }))
    markRead(convId)
  }

  function sendCarpool(convId, carpoolData) {
    const msg = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      senderId: 'me',
      ts: Date.now(),
      type: 'carpool',
      carpool: carpoolData,
    }
    setUserMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] ?? []), msg],
    }))
    markRead(convId)
  }

  function claimCarpool(msgId) {
    setCarpoolClaims((prev) => ({ ...prev, [msgId]: true }))
  }

  function unclaimCarpool(msgId) {
    setCarpoolClaims((prev) => { const n = { ...prev }; delete n[msgId]; return n })
  }

  function isClaimed(msgId) {
    return !!carpoolClaims[msgId]
  }

  function markRead(convId) {
    setLastRead((prev) => ({ ...prev, [convId]: Date.now() }))
  }

  function getUnreadCount(convId) {
    const since = lastRead[convId] ?? 0
    return getMessages(convId).filter((m) => m.senderId !== 'me' && m.ts > since).length
  }

  // All DM mom IDs — mock + user-created
  const activeDmMomIds = useMemo(() => {
    const mockIds = Object.keys(MOCK_CONVERSATIONS)
      .filter((id) => id.startsWith('dm-'))
      .map((id) => id.slice(3))
    const userIds = Object.keys(userMessages)
      .filter((id) => id.startsWith('dm-') && (userMessages[id]?.length ?? 0) > 0)
      .map((id) => id.slice(3))
    return [...new Set([...mockIds, ...userIds])]
  }, [userMessages])

  const totalUnread = useMemo(() => {
    const allIds = new Set([
      ...Object.keys(MOCK_CONVERSATIONS),
      ...Object.keys(userMessages),
    ])
    return [...allIds].reduce((sum, id) => sum + getUnreadCount(id), 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRead, userMessages])

  // Last message for hub preview
  function getLastMessage(convId) {
    const msgs = getMessages(convId)
    return msgs[msgs.length - 1] ?? null
  }

  return (
    <CircleContext.Provider
      value={{ getConversation, getMessages, sendMessage, sendCarpool, claimCarpool, unclaimCarpool, isClaimed, markRead, getUnreadCount, getLastMessage, totalUnread, activeDmMomIds }}
    >
      {children}
    </CircleContext.Provider>
  )
}

export const useCircle = () => useContext(CircleContext)
