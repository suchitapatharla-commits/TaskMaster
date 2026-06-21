import { useState } from 'react'
import { isThisWeek, parseISO, format } from 'date-fns'
import Header from '../components/shared/Header'
import { useDiary } from '../context/DiaryContext'
import { useTasks } from '../context/TaskContext'
import { CATEGORIES } from '../lib/categories'

const WeeklyRecap = ({ entries }) => {
  const thisWeekEntries = entries.filter(e =>
    e.createdAt && isThisWeek(parseISO(e.createdAt), { weekStartsOn: 1 })
  )

  const byCategory = {}
  thisWeekEntries.forEach(e => {
    const key = e.category || 'uncategorized'
    if (!byCategory[key]) byCategory[key] = []
    byCategory[key].push(e)
  })

  const allTags = thisWeekEntries.flatMap(e => e.tags || [])
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 border border-border rounded-xl bg-card text-center">
          <p className="text-3xl font-medium">{thisWeekEntries.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Entries this week</p>
        </div>
        <div className="p-4 border border-border rounded-xl bg-card text-center">
          <p className="text-3xl font-medium">{Object.keys(byCategory).length}</p>
          <p className="text-xs text-muted-foreground mt-1">Domains covered</p>
        </div>
      </div>

      {topTags.length > 0 && (
        <div className="p-4 border border-border rounded-xl bg-card space-y-2">
          <p className="text-sm font-medium">Top tags this week</p>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-accent border border-border">
                #{tag} <span className="text-muted-foreground">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {Object.keys(byCategory).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm">No entries this week yet!</p>
          <p className="text-xs mt-1">Switch to Entries and add some thoughts</p>
        </div>
      ) : (
        Object.entries(byCategory).map(([key, catEntries]) => {
          const cat = key !== 'uncategorized' ? CATEGORIES[key] : null
          return (
            <div key={key} className="border border-border rounded-xl bg-card overflow-hidden">
              <div className={`px-4 py-2.5 border-b border-border flex items-center gap-2 ${cat ? cat.color : 'bg-accent'}`}>
                <span className="text-xs font-medium">{cat ? cat.label : 'Uncategorized'}</span>
                <span className="text-xs opacity-70">{catEntries.length} {catEntries.length === 1 ? 'entry' : 'entries'}</span>
              </div>
              <div className="divide-y divide-border">
                {catEntries.map(entry => (
                  <div key={entry.id} className="px-4 py-3 space-y-1">
                    <p className="text-sm leading-relaxed">{entry.content}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {entry.tags?.map(t => (
                        <span key={t} className="text-xs text-muted-foreground">#{t}</span>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(entry.createdAt), 'EEE, MMM d')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

const Diary = () => {
  const { entries, addEntry, deleteEntry } = useDiary()
  const { addTask } = useTasks()
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [tag, setTag] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [converting, setConverting] = useState(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskCategory, setTaskCategory] = useState('job')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [view, setView] = useState('entries')

  const handleAdd = () => {
    if (!content.trim()) return
    addEntry({ content, tags: tag ? [tag] : [], category: category || null })
    setContent('')
    setTag('')
    setCategory('')
    setOpen(false)
  }

  const handleConvertToTask = (entry) => {
    setConverting(entry.id)
    setTaskTitle(entry.content.slice(0, 60))
    setTaskCategory(entry.category || 'job')
  }

  const handleConfirmConvert = (entry) => {
    if (!taskTitle.trim()) return
    addTask({
      title: taskTitle,
      category: taskCategory,
      priority: taskPriority,
      notes: entry.content,
      dueDate: new Date().toISOString().split('T')[0],
    })
    setConverting(null)
    setTaskTitle('')
  }

  const filtered = entries.filter(e =>
    e.content.toLowerCase().includes(search.toLowerCase()) ||
    e.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <Header title="Diary" />
      <div className="p-4 space-y-3">

        {/* View toggle */}
        <div className="flex gap-2">
          {['entries', 'recap'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                ${view === v
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary'
                }`}
            >
              {v === 'entries' ? '📓 Entries' : '📊 Weekly Recap'}
            </button>
          ))}
        </div>

        {/* Weekly recap */}
        {view === 'recap' && <WeeklyRecap entries={entries} />}

        {/* Entries view */}
        {view === 'entries' && (
          <>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search entries..."
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
            />

            {!open ? (
              <button
                onClick={() => setOpen(true)}
                className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <span className="text-lg">+</span> New entry
              </button>
            ) : (
              <div className="p-4 border border-primary rounded-xl bg-card space-y-3">
                <textarea
                  autoFocus
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                />
                <div className="flex gap-2">
                  <input
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                    placeholder="Tag (optional)"
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
                  />
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
                  >
                    <option value="">No category</option>
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAdd} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                    Save entry
                  </button>
                  <button onClick={() => setOpen(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-4xl mb-3">📓</p>
                <p className="text-sm">No entries yet — capture your first thought!</p>
              </div>
            )}

            {filtered.map(entry => {
              const cat = entry.category ? CATEGORIES[entry.category] : null
              const isConverting = converting === entry.id
              return (
                <div key={entry.id} className="border border-border rounded-xl bg-card overflow-hidden">
                  <div className="p-4 space-y-2">
                    <p className="text-sm leading-relaxed">{entry.content}</p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {cat && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${cat.color}`}>
                            {cat.label}
                          </span>
                        )}
                        {entry.tags?.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-accent border border-border">
                            #{t}
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleConvertToTask(entry)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-border hover:border-primary hover:text-primary text-muted-foreground transition-all"
                        >
                          → Task
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-all text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  {isConverting && (
                    <div className="border-t border-border p-4 bg-accent/30 space-y-3">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Convert to task</p>
                      <input
                        autoFocus
                        value={taskTitle}
                        onChange={e => setTaskTitle(e.target.value)}
                        placeholder="Task title"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                      <div className="flex gap-2">
                        <select
                          value={taskCategory}
                          onChange={e => setTaskCategory(e.target.value)}
                          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
                        >
                          {Object.entries(CATEGORIES).map(([key, cat]) => (
                            <option key={key} value={key}>{cat.label}</option>
                          ))}
                        </select>
                        <select
                          value={taskPriority}
                          onChange={e => setTaskPriority(e.target.value)}
                          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmConvert(entry)}
                          className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                        >
                          Create task
                        </button>
                        <button
                          onClick={() => setConverting(null)}
                          className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

export default Diary