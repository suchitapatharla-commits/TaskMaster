import { useState, useEffect } from 'react'
import useNotifications from '../../hooks/useNotifications'

const ReminderSettings = () => {
  const { requestPermission } = useNotifications()
  const [permission, setPermission] = useState(Notification.permission)
  const [digestEnabled, setDigestEnabled] = useState(
    localStorage.getItem('taskmaster_digest') === 'true'
  )

  const handleEnable = async () => {
    const granted = await requestPermission()
    setPermission(granted ? 'granted' : 'denied')
  }

  const toggleDigest = () => {
    const next = !digestEnabled
    setDigestEnabled(next)
    localStorage.setItem('taskmaster_digest', String(next))
  }

  return (
    <div className="p-4 border border-border rounded-xl bg-card space-y-4">
      <p className="text-sm font-medium">Reminders</p>

      {/* Permission status */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">Push notifications</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {permission === 'granted'
              ? 'Enabled — you\'ll get task reminders'
              : permission === 'denied'
              ? 'Blocked — enable in browser settings'
              : 'Not enabled yet'}
          </p>
        </div>
        {permission !== 'granted' && permission !== 'denied' && (
          <button
            onClick={handleEnable}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
          >
            Enable
          </button>
        )}
        {permission === 'granted' && (
          <span className="text-xs text-green-600 font-medium">✓ On</span>
        )}
        {permission === 'denied' && (
          <span className="text-xs text-red-500 font-medium">✗ Blocked</span>
        )}
      </div>

      {/* Smart defaults info */}
      {permission === 'granted' && (
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Smart defaults
          </p>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p>📅 Events → 15 min before</p>
            <p>📌 Tasks → 1 hour before due</p>
            <p>🚨 Overdue → alert when missed</p>
          </div>
        </div>
      )}

      {/* Daily digest toggle */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div>
          <p className="text-sm">Daily digest</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Morning summary + evening wrap-up
          </p>
        </div>
        <button
          onClick={toggleDigest}
          className={`w-10 h-6 rounded-full border-2 transition-all relative
            ${digestEnabled
              ? 'bg-primary border-primary'
              : 'bg-background border-border'
            }`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all
            ${digestEnabled ? 'left-5' : 'left-0.5'}`}
          />
        </button>
      </div>
    </div>
  )
}

export default ReminderSettings