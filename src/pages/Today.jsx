import { useState } from 'react'
import Header from '../components/shared/Header'
import AddTask from '../components/shared/AddTask'
import TaskCard from '../components/shared/TaskCard'
import { useTasks } from '../context/TaskContext'
import { CATEGORIES } from '../lib/categories'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const Today = () => {
  const { tasks } = useTasks()
  const [focusCategory, setFocusCategory] = useState(null)
  const [showTasks, setShowTasks] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const now = new Date()

  const baseTasks = tasks.filter(t => !t.dueDate || t.dueDate === today)
  const displayTasks = focusCategory
    ? baseTasks.filter(t => t.category === focusCategory)
    : baseTasks

  const pending = displayTasks.filter(t => t.status !== 'done')
  const done = displayTasks.filter(t => t.status === 'done')
  const overdue = tasks.filter(t =>
    t.dueDate && t.dueDate < today && t.status !== 'done'
  )

  const totalToday = baseTasks.length
  const doneToday = baseTasks.filter(t => t.status === 'done').length
  const completionRate = totalToday
    ? Math.round((doneToday / totalToday) * 100)
    : 0

  const greeting = now.getHours() < 12
    ? 'Good morning'
    : now.getHours() < 17
    ? 'Good afternoon'
    : 'Good evening'

  const dayName = format(now, 'EEEE')
  const dateStr = format(now, 'MMM d, yyyy')
  const navigate = useNavigate()

  return (
    <div>
      {focusCategory ? (
        <div
          className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-border"
          style={{ backgroundColor: CATEGORIES[focusCategory]?.accent + '22' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CATEGORIES[focusCategory]?.accent }}
            />
            <h1 className="text-lg font-medium">
              Focus — {CATEGORIES[focusCategory]?.label}
            </h1>
          </div>
          <button
            onClick={() => setFocusCategory(null)}
            className="text-xs border border-border px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-all"
          >
            Exit focus
          </button>
        </div>
      ) : (
        <Header title="Today" />
      )}

      <div className="p-4 space-y-3">

        {/* Bento grid — only show when not in focus mode */}
        {!focusCategory && (
          <div className="grid grid-cols-2 gap-3">

            {/* Date card — wide */}
            <div className="col-span-2 p-4 border border-border rounded-2xl bg-card">
              <p className="text-xs text-muted-foreground">{dayName}</p>
              <p className="text-2xl font-medium mt-0.5">{greeting} 👋</p>
              <p className="text-xs text-muted-foreground mt-1">{dateStr}</p>
            </div>

            {/* Progress card */}
            <div className="p-4 border border-border rounded-2xl bg-card space-y-2">
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-3xl font-medium">{completionRate}%</p>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {doneToday}/{totalToday} done
              </p>
            </div>

            {/* Overdue card */}
             <div
               onClick={() => overdue.length > 0 && navigate('/overdue')}
               className={`p-4 border rounded-2xl space-y-1 transition-all
               ${overdue.length > 0
               ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 cursor-pointer hover:opacity-80'
               : 'border-border bg-card'
               }`}
              >
             <p className="text-xs text-muted-foreground">Overdue</p>
             <p className={`text-3xl font-medium ${overdue.length > 0 ? 'text-red-500' : ''}`}>
             {overdue.length}
             </p>
             <p className="text-xs text-muted-foreground">
             {overdue.length === 0 ? 'All caught up!' : 'tap to view'}
             </p>
            </div>
          
          {/* Focus mode pills */}
            <div className="col-span-2 p-4 border border-border rounded-2xl bg-card space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Focus mode
              </p>
              {Object.entries(CATEGORIES).filter(([key]) =>
                baseTasks.some(t => t.category === key && t.status !== 'done')
              ).length === 0 ? (
                <p className="text-xs text-muted-foreground">No pending tasks today ✨</p>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {Object.entries(CATEGORIES).map(([key, cat]) => {
                    const count = baseTasks.filter(t =>
                      t.category === key && t.status !== 'done'
                    ).length
                    if (count === 0) return null
                    return (
                      <button
                        key={key}
                        onClick={() => setFocusCategory(key)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${cat.color}`}
                      >
                        {cat.label}
                        <span className="bg-white/30 rounded-full px-1.5">{count}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pending count */}
            <div className="p-4 border border-border rounded-2xl bg-card">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-3xl font-medium text-amber-500">{pending.length}</p>
              <p className="text-xs text-muted-foreground mt-1">tasks left</p>
            </div>

            {/* Quick add button */}
            <button
              onClick={() => setShowTasks(true)}
              className="p-4 border border-dashed border-border rounded-2xl bg-card hover:border-primary hover:text-primary transition-all text-left space-y-1"
            >
              <p className="text-xs text-muted-foreground">Quick add</p>
              <p className="text-2xl">+</p>
              <p className="text-xs text-muted-foreground">new task</p>
            </button>

          </div>
        )}

        {/* Add task — shows when quick add tapped or in focus mode */}
        {(showTasks || focusCategory) && (
          <div>
            <AddTask />
          </div>
        )}

        {/* Show tasks toggle */}
        {!focusCategory && totalToday > 0 && (
          <button
            onClick={() => setShowTasks(!showTasks)}
            className="w-full py-2.5 border border-border rounded-xl text-xs text-muted-foreground hover:border-primary hover:text-primary transition-all"
          >
            {showTasks ? '↑ Hide tasks' : `↓ Show all tasks (${totalToday})`}
          </button>
        )}

        {/* Task list */}
        {(showTasks || focusCategory) && (
          <div className="space-y-2">
            {pending.length === 0 && done.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-4xl mb-3">✨</p>
                <p className="text-sm">
                  {focusCategory
                    ? `No pending tasks in ${CATEGORIES[focusCategory]?.label}`
                    : 'Nothing planned yet!'}
                </p>
              </div>
            )}

            {pending.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}

            {done.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                  Completed ({done.length})
                </p>
                <div className="space-y-2">
                  {done.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Today