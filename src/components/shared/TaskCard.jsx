import { useState } from 'react'
import { useTasks } from '../../context/TaskContext'
import { useCategories } from '../../context/CategoryContext'

const TaskCard = ({ task }) => {
  const { editTask, deleteTask, toggleStatus } = useTasks()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedCategory, setEditedCategory] = useState(task.category)
  const [editedPriority, setEditedPriority] = useState(task.priority || 'medium')
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')

  const handleSave = () => {
    if (!editedTitle.trim()) return
    editTask(task.id, {
      title: editedTitle,
      category: editedCategory,
      priority: editedPriority,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) deleteTask(task.id)
  }

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return
    const updated = [...(task.subtasks || []), {
      id: crypto.randomUUID(),
      title: newSubtask,
      done: false,
    }]
    editTask(task.id, { subtasks: updated })
    setNewSubtask('')
  }

  const handleToggleSubtask = (subId) => {
    const updated = (task.subtasks || []).map(s =>
      s.id === subId ? { ...s, done: !s.done } : s
    )
    editTask(task.id, { subtasks: updated })
  }

  const handleDeleteSubtask = (subId) => {
    const updated = (task.subtasks || []).filter(s => s.id !== subId)
    editTask(task.id, { subtasks: updated })
  }

  const { categories } = useCategories()
  const category = categories.find(c => c.id === task.category) || categories[0]
  const subtasks = task.subtasks || []
  const doneCount = subtasks.filter(s => s.done).length

  if (isEditing) {
    return (
      <div className="p-4 border border-border rounded-xl bg-card space-y-3">
        <input
          autoFocus
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="Task title"
        />
        <div className="flex gap-2">
          <select
            value={editedCategory}
            onChange={e => setEditedCategory(e.target.value)}
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
          >
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
          <select
            value={editedPriority}
            onChange={e => setEditedPriority(e.target.value)}
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`border border-border rounded-xl bg-card ${task.status === 'done' ? 'opacity-60' : ''}`}>
      <div className="p-4 flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleStatus(task)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
            ${task.status === 'done'
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-border hover:border-primary'
            }`}
        >
          {task.status === 'done' && <span className="text-xs">✓</span>}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${category.color}`}>
              {category.label}
            </span>
            {task.priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full border
                ${task.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                  task.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {task.priority}
              </span>
            )}
            {task.dueDate && (
             <span className="text-xs text-muted-foreground">
             {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
             </span>
            )}
            {task.shared && (
             <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
             👥 Team
             </span>
             )}
            {subtasks.length > 0 && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                ☑️ {doneCount}/{subtasks.length}
              </button>
            )}
          </div>

          {/* Subtask progress bar */}
          {subtasks.length > 0 && (
            <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all rounded-full"
                style={{ width: `${(doneCount / subtasks.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all text-sm"
            title="Subtasks"
          >
            ≡
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all text-sm"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-all text-sm"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Subtasks panel */}
      {showSubtasks && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-2">
          {subtasks.map(sub => (
            <div key={sub.id} className="flex items-center gap-2">
              <button
                onClick={() => handleToggleSubtask(sub.id)}
                className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all text-xs
                  ${sub.done
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border hover:border-primary'
                  }`}
              >
                {sub.done && '✓'}
              </button>
              <span className={`text-sm flex-1 ${sub.done ? 'line-through text-muted-foreground' : ''}`}>
                {sub.title}
              </span>
              <button
                onClick={() => handleDeleteSubtask(sub.id)}
                className="text-xs text-muted-foreground hover:text-red-500 transition-all"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add subtask input */}
          <div className="flex gap-2 mt-2">
            <input
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
              placeholder="Add a step..."
              className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
            <button
              onClick={handleAddSubtask}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskCard