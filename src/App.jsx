import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import { DiaryProvider } from './context/DiaryContext'
import { CCProvider } from './context/CCContext'
import { ThemeProvider } from './components/shared/ThemeProvider'
import BottomNav from './components/shared/BottomNav'
import Today from './pages/Today'
import Calendar from './pages/Calendar'
import Categories from './pages/Categories'
import Diary from './pages/Diary'
import Insights from './pages/Insights'
import SharedBoard from './pages/SharedBoard'
import Settings from './pages/Settings'
import Login from './pages/Login'
import useNotifications from './hooks/useNotifications'

const NotificationWatcher = () => {
  useNotifications()
  return null
}

const AppRoutes = () => {
  const { user } = useAuth()

  if (!user) return <Login />

  return (
    <TaskProvider>
      <DiaryProvider>
        <CCProvider>
          <NotificationWatcher />
          <div className="min-h-screen bg-background text-foreground">
            <main className="pb-24 max-w-2xl mx-auto">
              <Routes>
                <Route path="/"            element={<Today />} />
                <Route path="/calendar"    element={<Calendar />} />
                <Route path="/insights"    element={<Insights />} />
                <Route path="/categories"  element={<Categories />} />
                <Route path="/diary"       element={<Diary />} />
                <Route path="/shared"      element={<SharedBoard />} />
                <Route path="/settings"    element={<Settings />} />
                <Route path="*"            element={<Navigate to="/" />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </CCProvider>
      </DiaryProvider>
    </TaskProvider>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App