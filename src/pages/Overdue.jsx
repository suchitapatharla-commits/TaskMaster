import { useState } from 'react'
import Header from '../components/shared/Header'
import TaskCard from '../components/shared/TaskCard'
import { useTasks } from '../context/TaskContext'

const Overdue = () => {
  const { tasks } = useTasks()
  const [sort, setSort] = useState('date')

  const today = new Date().toISOString().split('T')[0]

  const overdueTasks = tasks.filter(t =>
    t.dueDate &&
    t.dueDate < today &&
    t.status !== 'done'
  )

  const sorted = [...overdueTasks].sort((a, b) => {
    if (sort === 'date') {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (sort === 'priority') {
      const order = { high: 0, medium: 1, low: 2 }
      return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
    }
    return 0
  })

  return (
    <div>
      <Header title="Overdue" />
      <div className="p-4 space-y-3">

        {/* Sort toggle */}
        <div className="flex gap-2">
          {['date', 'priority'].map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                ${sort === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary'
                }`}
            >
              {s === 'date' ? '📅 By date' : '🔥 By priority'}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 rounded-xl">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            {overdueTasks.length} overdue {overdueTasks.length === 1 ? 'task' : 'tasks'}
          </p>
          <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
            Complete or reschedule these tasks
          </p>
        </div>

        {/* Empty state */}
        {overdueTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-sm">No overdue tasks — you're all caught up!</p>
          </div>
        )}

        {/* Tasks */}
        <div className="space-y-2">
          {sorted.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Overdue