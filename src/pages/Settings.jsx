import Header from '../components/shared/Header'
import ReminderSettings from '../components/shared/ReminderSettings'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/shared/ThemeToggle'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const { user, logout } = useAuth()

  const navigate = useNavigate()

  return (
    <div>
      <Header title="Settings" />
      <div className="p-4 space-y-4">

        {/* Profile */}
        <div className="p-4 border border-border rounded-xl bg-card flex items-center gap-3">
          <img
            src={user?.photoURL}
            className="w-12 h-12 rounded-full"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Theme */}
        <div className="p-4 border border-border rounded-xl bg-card flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle dark / light mode</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Reminders */}
        <ReminderSettings />

        {/* Log out */}
        <button
          onClick={logout}
          className="w-full py-3 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-all"
        >
          Log out
        </button>

        {/* Manage categories */}
         <div
         onClick={() => navigate('/categories/manage')}
         className="p-4 border border-border rounded-xl bg-card flex items-center justify-between cursor-pointer hover:bg-accent transition-all"
         >
         <div>
         <p className="text-sm font-medium">Manage categories</p>
         <p className="text-xs text-muted-foreground mt-0.5">Add, edit or remove categories</p>
         </div>
         <span className="text-muted-foreground">›</span>
         </div>
      </div>
    </div>
  )
}

export default Settings