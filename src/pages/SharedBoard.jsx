import { useState } from 'react'
import Header from '../components/shared/Header'
import { useCC } from '../context/CCContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../lib/categories'

const SharedBoard = () => {
  const { sharedTasks, members, addSharedTask, editSharedTask, deleteSharedTask, toggleSharedStatus } = useCC()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('creative')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [editing, setEditing] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const pending = sharedTasks.filter(t => t.status !== 'done')
  const done = sharedTasks.filter(t => t.status === 'done')

  const handleAdd = () => {
    if (!title.trim()) return
    addSharedTask({ title, category, priority, dueDate: dueDate || null })
    setTitle('')
    setCategory('creative')
    setPriority('medium')
    setDueDate('')
    setOpen(false)
  }

  const handleEdit = (task) => {
    setEditing(task.id)
    setEditTitle(task.title)
  }

  const handleSaveEdit = (id) => {
    if (!editTitle.trim()) return
    editSharedTask(id, { title: editTitle })
    setEditing(null)
  }

  return (
    <div>
      <Header title="CC Team Board" />
      <div className="p-4 space-y-4">

        {/* Team members online */}
        {members.length > 0 && (
          <div className="p-3 border border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800 rounded-xl">
            <p className="text-xs font-medium text-purple-800 dark:text-purple-300 mb-2">
              👥 Team members ({members.length})
            </p>
            <div className="flex gap-2 flex-wrap">
              {members.map(member => (
                <div key={member.id} className="flex items-center gap-1.5">
                  <img
                    src={member.photo}
                    className="w-6 h-6 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs text-purple-700 dark:text-purple-300">
                    {member.name?.split(' ')[0]}
                    {member.uid === user.uid && ' (you)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
            <p className="text-2xl font-medium">{members.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Members</p>
          </div>
        </div>

        {/* Add task */}
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Add team task
          </button>
        ) : (
          <div className="p-4 border border-primary rounded-xl bg-card space-y-3">
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="What needs to be done?"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="flex gap-2">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
              >
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Add task
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {sharedTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-sm">No team tasks yet</p>
            <p className="text-xs mt-1">Add a task and your CC team will see it</p>
          </div>
        )}

        {/* Pending tasks */}
        <div className="space-y-2">
          {pending.map(task => {
            const cat = CATEGORIES[task.category] || CATEGORIES.creative
            const isOwner = task.uid === user.uid
            const isEditing = editing === task.id

            return (
              <div key={task.id} className="p-4 border border-border rounded-xl bg-card">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveEdit(task.id)}
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none"
                    />
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleSharedStatus(task)}
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
                        ${task.status === 'done'
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                        }`}
                    >
                      {task.status === 'done' && <span className="text-xs">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${cat.color}`}>
                          {cat.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border
                          ${task.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                            task.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            📅 {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <img
                            src={task.authorPhoto}
                            className="w-4 h-4 rounded-full"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-xs text-muted-foreground">
                            {task.authorName?.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isOwner && (
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(task)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground text-xs"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteSharedTask(task.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Done tasks */}
        {done.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Completed ({done.length})
            </p>
            <div className="space-y-2 opacity-60">
              {done.map(task => (
                <div key={task.id} className="p-3 border border-border rounded-xl bg-card flex items-center gap-3">
                  <button
                    onClick={() => toggleSharedStatus(task)}
                    className="w-5 h-5 rounded-full bg-primary border-primary border-2 flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-xs text-primary-foreground">✓</span>
                  </button>
                  <p className="text-sm line-through text-muted-foreground flex-1">{task.title}</p>
                  {task.uid === user.uid && (
                    <button
                      onClick={() => deleteSharedTask(task.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 text-xs"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SharedBoard