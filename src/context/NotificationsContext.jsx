import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const NotificationsContext = createContext(null)

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function NotificationsProvider({ children }) {
  const [readIds, setReadIds] = useState(() => load('capp-notif-read', []))
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    localStorage.setItem('capp-notif-read', JSON.stringify(readIds))
  }, [readIds])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.includes(n.id)).length,
    [notifications, readIds]
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
    return Notification.requestPermission()
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
