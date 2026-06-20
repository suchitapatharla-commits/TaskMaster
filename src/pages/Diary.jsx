import { useState } from 'react'
import Header from '../components/shared/Header'
import { useDiary } from '../context/DiaryContext'
import { CATEGORIES } from '../lib/categories'

const Diary = () => {
  const { entries, addEntry, deleteEntry } = useDiary()
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [tag, setTag] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')

  const handleAdd = () => {
    if (!content.trim()) return
    addEntry({
      content,
      tags: tag ? [tag] : [],
      category: category || null,
    })
    setContent('')
    setTag('')
    setCategory('')
    setOpen(false)
  }

  const filtered = entries.filter(e =>
    e.content.toLowerCase().includes(search.toLowerCase()) ||
    e.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <Header title="Diary" />
      <div className="p-4 space-y-3">

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search entries..."
          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
        />

        {/* Add entry */}
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
              <button
                onClick={handleAdd}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Save entry
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
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">📓</p>
            <p className="text-sm">No entries yet — capture your first thought!</p>
          </div>
        )}

        {/* Entries */}
        {filtered.map(entry => {
          const cat = entry.category ? CATEGORIES[entry.category] : null
          return (
            <div key={entry.id} className="p-4 border border-border rounded-xl bg-card space-y-2">
              <p className="text-sm leading-relaxed">{entry.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {cat && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cat.color}`}>
                      {cat.label}
                    </span>
                  )}
                  {entry.tags?.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground border border-border">
                      #{t}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-all text-xs"
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Diary