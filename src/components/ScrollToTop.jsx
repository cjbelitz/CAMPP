import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Don't reset scroll on chat pages — they manage their own scroll-to-bottom
    if (pathname.startsWith('/circle/group/') || pathname.startsWith('/circle/dm/')) return
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
