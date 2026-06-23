import { useState } from 'react'
import Header from '../components/shared/Header'
import { useCategories, COLOR_OPTIONS } from '../context/CategoryContext'

const ManageCategories = () => {
  const { categories, addCategory, editCategory, deleteCategory } = useCategories()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0])
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState(null)

  const handleAdd = async () => {
    if (!newName.trim()) return
    await addCategory({
      name: newName,
      color: newColor.color,
      accent: newColor.accent,
    })
    setNewName('')
    setNewColor(COLOR_OPTIONS[0])
    setAdding(false)
  }

  const handleEdit = (cat) => {
    setEditing(cat.id)
    setEditName(cat.name)
    setEditColor(COLOR_OPTIONS.find(c => c.accent === cat.accent) || COLOR_OPTIONS[0])
  }

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return
    await editCategory(id, {
      name: editName,
      color: editColor.color,
      accent: editColor.accent,
    })
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category? Tasks in this category will keep their data.')) {
      await deleteCategory(id)
    }
  }

  return (
    <div>
      <Header title="Manage Categories" />
      <div className="p-4 space-y-3">

        <p className="text-xs text-muted-foreground">
          Changes apply across tasks, calendar and diary tags.
        </p>

        {/* Add new category */}
        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Add category
          </button>
        ) : (
          <div className="p-4 border border-primary rounded-xl bg-card space-y-3">
            <p className="text-sm font-medium">New category</p>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Category name"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Pick a color</p>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setNewColor(opt)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${opt.color}
                      ${newColor.accent === opt.accent ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Add
              </button>
              <button
                onClick={() => setAdding(false)}
                className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Category list */}
        {categories.map(cat => (
          <div key={cat.id} className="border border-border rounded-xl bg-card overflow-hidden">
            {editing === cat.id ? (
              <div className="p-4 space-y-3">
                <input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Pick a color</p>
                  <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setEditColor(opt)}
                        className={`px-3 py-1 rounded-full text-xs border transition-all ${opt.color}
                          ${editColor?.accent === opt.accent ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(cat.id)}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center gap-3">
                <div
                  className="w-3 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.accent }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{cat.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${cat.color}`}>
                    preview
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground transition-all text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-all text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageCategories