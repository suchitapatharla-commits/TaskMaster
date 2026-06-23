import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',           label: 'Today',    icon: '☀️' },
  { to: '/calendar',   label: 'Calendar', icon: '📅' },
  { to: '/insights',   label: 'Insights', icon: '📊' },
  { to: '/categories', label: 'Tasks',    icon: '🗂️' },
  { to: '/diary',      label: 'Diary',    icon: '📓' },
  { to: '/shared',     label: 'CC Team',  icon: '👥' },
  { to: '/settings',   label: 'Settings', icon: '⚙️' },
]

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-20 z-50">
      <div className="flex items-center h-full overflow-x-auto scrollbar-none px-2 gap-1 max-w-2xl mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all text-xs flex-shrink-0 min-w-[60px]
              ${isActive
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="whitespace-nowrap">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav