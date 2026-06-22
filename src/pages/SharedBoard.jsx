import Header from '../components/shared/Header'
import TaskCard from '../components/shared/TaskCard'
import AddTask from '../components/shared/AddTask'
import { useTasks } from '../context/TaskContext'
import { useAuth } from '../context/AuthContext'

const SharedBoard = () => {
  const { tasks } = useTasks()
  const { user } = useAuth()

  const ccTasks = tasks.filter(t => t.category === 'creative')
  const pending = ccTasks.filter(t => t.status !== 'done')
  const done = ccTasks.filter(t => t.status === 'done')

  return (
    <div>
      <Header title="CC Team" />
      <div className="p-4 space-y-4">

        {/* Profile */}
        <div className="p-3 border border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800 rounded-xl flex items-center gap-2">
          <img
            src={user?.photoURL}
            className="w-8 h-8 rounded-full"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="text-xs font-medium text-purple-800 dark:text-purple-300">
              {user?.displayName}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Creative Custody
            </p>
          </div>
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
            <p className="text-2xl font-medium">{ccTasks.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total</p>
          </div>
        </div>

        <AddTask defaultCategory="creative" />

        {/* Empty state */}
        {ccTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">🎨</p>
            <p className="text-sm">No Creative Custody tasks yet!</p>
            <p className="text-xs mt-1">Add your first CC task above</p>
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