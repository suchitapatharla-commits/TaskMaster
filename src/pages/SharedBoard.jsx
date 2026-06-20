import Header from '../components/shared/Header'
import TaskCard from '../components/shared/TaskCard'
import AddTask from '../components/shared/AddTask'
import { useTasks } from '../context/TaskContext'

const SharedBoard = () => {
  const { tasks } = useTasks()

  const sharedTasks = tasks.filter(t => t.shared)
  const pending = sharedTasks.filter(t => t.status !== 'done')
  const done = sharedTasks.filter(t => t.status === 'done')

  return (
    <div>
      <Header title="CC Team Board" />
      <div className="p-4 space-y-3">

        {/* Info banner */}
        <div className="p-3 bg-purple-100 border border-purple-200 rounded-xl">
          <p className="text-xs text-purple-800 font-medium">👥 Creative Custody shared tasks</p>
          <p className="text-xs text-purple-700 mt-0.5">
            Tasks marked as team visible appear here. Toggle sharing when adding tasks.
          </p>
        </div>

        <AddTask defaultCategory="creative" />

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
            <p className="text-2xl font-medium">{sharedTasks.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total</p>
          </div>
        </div>

        {/* Empty state */}
        {sharedTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-sm">No shared tasks yet</p>
            <p className="text-xs mt-1">Toggle "Team visible" when adding a task</p>
          </div>
        )}

        {/* Pending */}
        <div className="space-y-2">
          {pending.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Done */}
        {done.length > 0 && (
          <div>
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

export default SharedBoard