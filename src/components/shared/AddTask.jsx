import { useState } from 'react'
import { useTasks } from '../../context/TaskContext'
import { useCategories } from '../../context/CategoryContext'

const AddTask = ({ defaultCategory = 'job' }) => {
  const { addTask } = useTasks()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(defaultCategory)
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [shared, setShared] = useState(false)
  const [notes, setNotes] = useState('')
  const { categories } = useCategories()
  const [dueTime, setDueTime] = useState('')

  const handleAdd = () => {
  if (!title.trim()) return
  addTask({
    title,
    category,
    priority,
    dueDate: dueDate || null,
    dueTime: dueTime || null,
    shared,
    notes,
  })
  setTitle('')
  setCategory(defaultCategory)
  setPriority('medium')
  setDueDate('')
  setDueTime('')
  setShared(false)
  setNotes('')
  setOpen(false)
}

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg">+</span> Add task
      </button>
    )
  }

  return (
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
          onChange={e => {
            setCategory(e.target.value)
            if (e.target.value === 'creative') setShared(true)
            else setShared(false)
          }}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
        >
          {categories.map(cat => (
           <option key={cat.id} value={cat.id}>{cat.name}</option>
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
      <div className="flex gap-2">
  <input
    type="date"
    value={dueDate}
    onChange={e => setDueDate(e.target.value)}
    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
  />
  <input
    type="time"
    value={dueTime}
    onChange={e => setDueTime(e.target.value)}
    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
  />
</div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        rows={2}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none resize-none"
      />

      {/* Shared toggle — auto on for Creative Custody */}
      <div className="flex items-center justify-between py-1">
        <div>
          <p className="text-sm">Team visible</p>
          <p className="text-xs text-muted-foreground">
            {shared ? 'Visible to CC team' : 'Only visible to you'}
          </p>
        </div>
        <button
          onClick={() => setShared(!shared)}
          className={`w-10 h-6 rounded-full border-2 transition-all relative
            ${shared ? 'bg-primary border-primary' : 'bg-background border-border'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all
            ${shared ? 'left-5' : 'left-0.5'}`}
          />
        </button>
      </div>

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
  )
}

export default AddTask