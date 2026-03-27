import { Routes, Route, useLocation } from 'react-router-dom'
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
      <Route path="/ai-chat"        element={<AIChatPage />} />
      <Route path="/settings"       element={<PageWrapper><SettingsPage /></PageWrapper>} />
    </Routes>
  )
}

function AppContent() {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return <AuthPage />
  return (
    <>
      <ScrollToTop />
      <AnimatedRoutes />
      <BottomNav />
    </>
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
