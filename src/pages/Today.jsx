import { useState } from 'react'
import Header from '../components/shared/Header'
import AddTask from '../components/shared/AddTask'
import TaskCard from '../components/shared/TaskCard'
import { useTasks } from '../context/TaskContext'
import { CATEGORIES } from '../lib/categories'

const Today = () => {
  const { tasks } = useTasks()
  const [focusCategory, setFocusCategory] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const baseTasks = tasks.filter(t =>
    !t.dueDate || t.dueDate === today
  )

  const displayTasks = focusCategory
    ? baseTasks.filter(t => t.category === focusCategory)
    : baseTasks

  const pending = displayTasks.filter(t => t.status !== 'done')
  const done = displayTasks.filter(t => t.status === 'done')

  return (
    <div>
      {/* Normal header OR focus mode header */}
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

        {/* Focus mode category picker */}
        {!focusCategory && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Focus mode
            </p>
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
          </div>
        )}

        <AddTask />

        {/* Empty state */}
        {pending.length === 0 && done.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">✨</p>
            <p className="text-sm">
              {focusCategory
                ? `No pending tasks in ${CATEGORIES[focusCategory]?.label}`
                : 'Nothing planned yet — add your first task!'}
            </p>
          </div>
        )}

        {/* Pending tasks */}
        <div className="space-y-2">
          {pending.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Completed tasks */}
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
    </div>
  )
}

export default Today