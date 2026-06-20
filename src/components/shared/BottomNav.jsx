import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',         label: 'Today',    icon: '☀️' },
  { to: '/calendar', label: 'Calendar', icon: '📅' },
  { to: '/insights', label: 'Insights', icon: '📊' },
  { to: '/categories',label: 'Tasks',   icon: '🗂️' },
  { to: '/shared',   label: 'CC Team',  icon: '👥' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-20 flex items-center justify-around z-50">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all text-xs
            ${isActive
              ? 'text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <span className="text-xl">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav