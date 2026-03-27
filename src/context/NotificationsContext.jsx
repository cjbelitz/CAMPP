import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const NotificationsContext = createContext(null)

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

const NOW = Date.now()
const MIN  = 60 * 1000
const HOUR = 60 * MIN
const DAY  = 24 * HOUR

// Pre-defined demo notifications
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'leave',
    urgency: 'high',
    ts: NOW - 5 * MIN,
    title: 'Time to leave for camp!',
    body: 'Creative Arts starts at 9am — you should head out now to beat parking.',
    icon: '🕐',
  },
  {
    id: 'notif-2',
    type: 'register',
    urgency: 'high',
    ts: NOW - 2 * HOUR,
    title: 'Registration opens tomorrow',
    body: 'Rock Star Music Academy opens for summer session Jul 7–11. Spots fill fast — save your spot early!',
    icon: '⚡',
  },
  {
    id: 'notif-3',
    type: 'reminder',
    urgency: 'medium',
    ts: NOW - 5 * HOUR,
    title: "Camp tomorrow — Noah's packed?",
    body: "Makers & Builders STEM starts tomorrow at 8:30am. Don't forget the snacks and a light jacket — that building is cold!",
    icon: '🎒',
  },
  {
    id: 'notif-4',
    type: 'circle',
    urgency: 'medium',
    ts: NOW - 6 * HOUR,
    title: 'New carpool post in Creative Arts',
    body: 'Lacey B. is offering 2 seats from Carlsbad/La Costa for Jun 23–27.',
    icon: '🚗',
  },
  {
    id: 'notif-5',
    type: 'register',
    urgency: 'medium',
    ts: NOW - 1 * DAY,
    title: 'Almost full — act fast',
    body: "Ninja Warrior Challenge Camp has only 3 spots left for Jun 23–27. You've shown interest — ready to register?",
    icon: '🔥',
  },
  {
    id: 'notif-6',
    type: 'circle',
    urgency: 'low',
    ts: NOW - 1 * DAY - 3 * HOUR,
    title: 'New message in Makers & Builders',
    body: 'Priya K.: How\'s everyone\'s kid doing today? Rohan texted me \'mom my robot arm actually works\'…',
    icon: '💬',
  },
  {
    id: 'notif-7',
    type: 'reminder',
    urgency: 'low',
    ts: NOW - 2 * DAY,
    title: 'Showcase on Friday!',
    body: "Creative Arts parent showcase is Friday at 4pm. Families welcome — gates open at 3:30.",
    icon: '🎨',
  },
  {
    id: 'notif-8',
    type: 'register',
    urgency: 'low',
    ts: NOW - 3 * DAY,
    title: 'New session added',
    body: 'Surf Camp SoCal just added an Aug 18–22 session. Check it out before it fills up.',
    icon: '🏄',
  },
]

export function NotificationsProvider({ children }) {
  const [readIds, setReadIds] = useState(() => load('capp-notif-read', []))

  useEffect(() => {
    localStorage.setItem('capp-notif-read', JSON.stringify(readIds))
  }, [readIds])

  const notifications = MOCK_NOTIFICATIONS

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.includes(n.id)).length,
    [readIds]
  )

  function markRead(id) {
    setReadIds((prev) => prev.includes(id) ? prev : [...prev, id])
  }

  function markAllRead() {
    setReadIds(notifications.map((n) => n.id))
  }

  function isRead(id) {
    return readIds.includes(id)
  }

  async function requestPushPermission() {
    if (!('Notification' in window)) return 'unsupported'
    if (Notification.permission === 'granted') return 'granted'
    const result = await Notification.requestPermission()
    return result
  }

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, isRead, requestPushPermission }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext)
