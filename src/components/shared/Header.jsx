import { useAuth } from '../../context/AuthContext'
import ThemeToggle from './ThemeToggle'

const Header = ({ title }) => {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-medium">{title}</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <img
          src={user?.photoURL}
          className="w-8 h-8 rounded-full cursor-pointer"
          referrerPolicy="no-referrer"
          onClick={logout}
          title="Tap to log out"
        />
      </div>
    </header>
  )
}

export default Header