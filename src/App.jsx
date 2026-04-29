import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, Component } from 'react'
import { SavedCampsProvider } from './context/SavedCampsContext'
import { KidsProvider } from './context/KidsContext'
import { CircleProvider } from './context/CircleContext'
import { ReviewsProvider } from './context/ReviewsContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import BottomNav from './components/BottomNav'
import ScrollToTop from './components/ScrollToTop'
import PageWrapper from './components/PageWrapper'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import CampsPage from './pages/CampsPage'
import CampDetailPage from './pages/CampDetailPage'
import MySummerPage from './pages/MySummerPage'
import AddKidPage from './pages/AddKidPage'
import CirclePage from './pages/CirclePage'
import GroupChatPage from './pages/GroupChatPage'
import DMChatPage from './pages/DMChatPage'
import NotificationsPage from './pages/NotificationsPage'
import AIChatPage from './pages/AIChatPage'
import SettingsPage from './pages/SettingsPage'
import AuthPage from './pages/AuthPage'
import OnboardingPage from './pages/OnboardingPage'
import CounselorsPage from './pages/CounselorsPage'
import CounselorApplyPage from './pages/CounselorApplyPage'
import CounselorProfilePage from './pages/CounselorProfilePage'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('[CAMPP] Render error:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#1a1a1a', backgroundColor: '#fdedd4', minHeight: '100vh' }}>
          <h2 style={{ marginBottom: '1rem' }}>Something went wrong</h2>
          <pre style={{ background: '#fff', padding: '1rem', borderRadius: '8px', fontSize: '12px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/dashboard' }}
            style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#155fcc', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Go to Dashboard
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/"               element={<PageWrapper><HomePage /></PageWrapper>} />
      <Route path="/dashboard"      element={<PageWrapper><DashboardPage /></PageWrapper>} />
      <Route path="/camps"          element={<PageWrapper><CampsPage /></PageWrapper>} />
      <Route path="/camps/:id"      element={<PageWrapper><CampDetailPage /></PageWrapper>} />
      <Route path="/my-summer"      element={<PageWrapper><MySummerPage /></PageWrapper>} />
      <Route path="/add-kid"        element={<PageWrapper><AddKidPage /></PageWrapper>} />
      <Route path="/edit-kid/:id"   element={<PageWrapper><AddKidPage /></PageWrapper>} />
      <Route path="/circle"         element={<PageWrapper><CirclePage /></PageWrapper>} />
      <Route path="/circle/group/:campId" element={<GroupChatPage />} />
      <Route path="/circle/dm/:momId"     element={<DMChatPage />} />
      <Route path="/notifications"  element={<PageWrapper><NotificationsPage /></PageWrapper>} />
      <Route path="/ai-chat"              element={<AIChatPage />} />
      <Route path="/settings"             element={<PageWrapper><SettingsPage /></PageWrapper>} />
      <Route path="/counselors"           element={<PageWrapper><CounselorsPage /></PageWrapper>} />
      <Route path="/counselors/apply"     element={<CounselorApplyPage />} />
      <Route path="/counselors/profile"   element={<PageWrapper><CounselorProfilePage /></PageWrapper>} />
    </Routes>
  )
}

function AppContent() {
  const { isLoggedIn, user } = useAuth()
  const location = useLocation()

  const isPublicRoute = location.pathname === '/camps' || location.pathname.startsWith('/camps/')

  useEffect(() => {
    document.body.classList.toggle('app-layout', isLoggedIn)
  }, [isLoggedIn])

  if (!isLoggedIn) {
    if (isPublicRoute) {
      return (
        <>
          <ScrollToTop />
          <AnimatedRoutes />
        </>
      )
    }
    return <AuthPage />
  }

  if (!user?.onboarded) return <OnboardingPage />
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <AnimatedRoutes />
      <BottomNav />
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SavedCampsProvider>
        <KidsProvider>
          <NotificationsProvider>
            <CircleProvider>
              <ReviewsProvider>
                <AppContent />
              </ReviewsProvider>
            </CircleProvider>
          </NotificationsProvider>
        </KidsProvider>
      </SavedCampsProvider>
    </AuthProvider>
  )
}
