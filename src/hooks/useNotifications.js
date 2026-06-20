import { useEffect } from 'react'
import { useTasks } from '../context/TaskContext'
import { isToday, isTomorrow, parseISO, differenceInMinutes } from 'date-fns'

const useNotifications = () => {
  const { tasks } = useTasks()

  const requestPermission = async () => {
    if (!('Notification' in window)) return false
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const sendNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
      })
    }
  }

  useEffect(() => {
    if (Notification.permission !== 'granted') return

    const checkReminders = () => {
      const now = new Date()

      tasks.forEach(task => {
        if (task.status === 'done' || !task.dueDate) return

        const due = parseISO(task.dueDate)
        const minsUntilDue = differenceInMinutes(due, now)

        // 15 min warning for meetings/events
        if (task.category === 'events' && minsUntilDue <= 15 && minsUntilDue > 0) {
          sendNotification(
            `⏰ Coming up: ${task.title}`,
            'Starting in 15 minutes'
          )
        }

        // Due today reminder
        if (isToday(due) && minsUntilDue > 0 && minsUntilDue <= 60) {
          sendNotification(
            `📌 Due today: ${task.title}`,
            'This task is due within the hour'
          )
        }

        // Overdue alert
        if (minsUntilDue < 0 && minsUntilDue > -5) {
          sendNotification(
            `🚨 Overdue: ${task.title}`,
            'This task was due just now'
          )
        }
      })
    }

    const interval = setInterval(checkReminders, 60000)
    return () => clearInterval(interval)
  }, [tasks])

  return { requestPermission, sendNotification }
}

export default useNotifications