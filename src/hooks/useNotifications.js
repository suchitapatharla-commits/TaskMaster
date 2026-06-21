import { useEffect } from 'react'
import { useTasks } from '../context/TaskContext'
import { isToday, isTomorrow, parseISO, differenceInMinutes, format } from 'date-fns'

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

  // Morning digest — 8:00 AM
  const checkMorningDigest = (tasks) => {
    const lastMorning = localStorage.getItem('taskmaster_last_morning')
    const today = format(new Date(), 'yyyy-MM-dd')
    if (lastMorning === today) return

    const now = new Date()
    if (now.getHours() !== 8) return

    const todayTasks = tasks.filter(t =>
      t.dueDate === today && t.status !== 'done'
    )
    const overdue = tasks.filter(t =>
      t.dueDate &&
      t.dueDate < today &&
      t.status !== 'done'
    )

    let body = ''
    if (todayTasks.length > 0) {
      body += `${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due today`
    }
    if (overdue.length > 0) {
      body += `${body ? ' · ' : ''}${overdue.length} overdue`
    }
    if (!body) body = 'No tasks due today — enjoy your day! ✨'

    sendNotification('☀️ Good morning, here\'s your day', body)
    localStorage.setItem('taskmaster_last_morning', today)
  }

  // Evening digest — 8:00 PM
  const checkEveningDigest = (tasks) => {
    const lastEvening = localStorage.getItem('taskmaster_last_evening')
    const today = format(new Date(), 'yyyy-MM-dd')
    if (lastEvening === today) return

    const now = new Date()
    if (now.getHours() !== 20) return

    const doneTodayCount = tasks.filter(t =>
      t.status === 'done' &&
      t.dueDate === today
    ).length

    const pendingTodayCount = tasks.filter(t =>
      t.dueDate === today &&
      t.status !== 'done'
    ).length

    const tomorrowCount = tasks.filter(t =>
      t.dueDate && isTomorrow(parseISO(t.dueDate))
    ).length

    let body = ''
    if (doneTodayCount > 0) body += `${doneTodayCount} done today`
    if (pendingTodayCount > 0) body += `${body ? ' · ' : ''}${pendingTodayCount} still pending`
    if (tomorrowCount > 0) body += `${body ? ' · ' : ''}${tomorrowCount} due tomorrow`
    if (!body) body = 'Take a moment to log today in your diary 📓'

    sendNotification('🌙 Evening wrap-up', body)
    localStorage.setItem('taskmaster_last_evening', today)
  }

  // Task reminders
  const checkReminders = (tasks) => {
    const now = new Date()
    const today = format(now, 'yyyy-MM-dd')

    tasks.forEach(task => {
      if (task.status === 'done' || !task.dueDate) return

      const due = parseISO(task.dueDate)
      const minsUntilDue = differenceInMinutes(due, now)

      if (task.category === 'events' && minsUntilDue <= 15 && minsUntilDue > 13) {
        sendNotification(
          `⏰ Coming up: ${task.title}`,
          'Starting in 15 minutes'
        )
      }

      if (isToday(due) && minsUntilDue <= 60 && minsUntilDue > 58) {
        sendNotification(
          `📌 Due soon: ${task.title}`,
          'Due within the hour'
        )
      }

      if (task.dueDate < today && task.dueDate === format(new Date(now - 5 * 60000), 'yyyy-MM-dd')) {
        sendNotification(
          `🚨 Overdue: ${task.title}`,
          'This task is past due'
        )
      }
    })
  }

  useEffect(() => {
    if (Notification.permission !== 'granted') return

    const interval = setInterval(() => {
      checkMorningDigest(tasks)
      checkEveningDigest(tasks)
      checkReminders(tasks)
    }, 60000)

    return () => clearInterval(interval)
  }, [tasks])

  return { requestPermission, sendNotification }
}

export default useNotifications