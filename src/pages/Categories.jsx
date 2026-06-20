import Header from '../components/shared/Header'
import AddTask from '../components/shared/AddTask'
import TaskCard from '../components/shared/TaskCard'
import { useTasks } from '../context/TaskContext'
import { CATEGORIES } from '../lib/categories'
import { useState } from 'react'

const Categories = () => {
  const { tasks } = useTasks()
  const [active, setActive] = useState('job')

  const categoryTasks = tasks.filter(t => t.category === active)
  const pending = categoryTasks.filter(t => t.status !== 'done')
  const done = categoryTasks.filter(t => t.status === 'done')

  return (
    <div>
      <Header title="Categories" />
      <div className="p-4 space-y-4">

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${active === key
                  ? cat.color
                  : 'border-border text-muted-foreground hover:border-primary'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <div className="flex-1 p-3 border border-border rounded-xl bg-card text-center">
            <p className="text-2xl font-medium">{pending.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
          </div>
          <div className="flex-1 p-3 border border-border rounded-xl bg-card text-center">
            <p className="text-2xl font-medium">{done.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Done</p>
          </div>
          <div className="flex-1 p-3 border border-border rounded-xl bg-card text-center">
            <p className="text-2xl font-medium">{categoryTasks.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total</p>
          </div>
        </div>

        <AddTask defaultCategory={active} />

        {/* Empty state */}
        {categoryTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">🗂️</p>
            <p className="text-sm">No tasks in {CATEGORIES[active].label} yet!</p>
          </div>
        )}

        {/* Tasks */}
        <div className="space-y-2">
          {pending.map(task => <TaskCard key={task.id} task={task} />)}
        </div>

        {done.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Completed ({done.length})
            </p>
            <div className="space-y-2">
              {done.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories