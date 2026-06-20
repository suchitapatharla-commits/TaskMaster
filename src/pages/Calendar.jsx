import { useState } from 'react'
import Header from '../components/shared/Header'
import { useTasks } from '../context/TaskContext'
import { CATEGORIES } from '../lib/categories'
import {
  format, startOfWeek, addDays, isSameDay,
  startOfMonth, endOfMonth, eachDayOfInterval,
  addMonths, subMonths, isToday
} from 'date-fns'

const Calendar = () => {
  const { tasks } = useTasks()
  const [view, setView] = useState('week')
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState(new Date())

  const getTasksForDay = (day) =>
    tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day))

  // Week view
  const weekStart = startOfWeek(current, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Month view
  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = (monthStart.getDay() + 6) % 7
  const paddedDays = [
    ...Array(startPad).fill(null),
    ...monthDays,
  ]

  const selectedTasks = getTasksForDay(selected)

  return (
    <div>
      <Header title="Calendar" />
      <div className="p-4 space-y-4">

        {/* View toggle */}
        <div className="flex gap-2">
          {['week', 'month'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                ${view === v
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary'
                }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrent(v => view === 'week' ? addDays(v, -7) : subMonths(v, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-all text-sm"
          >
            ‹
          </button>
          <span className="text-sm font-medium">
            {view === 'week'
              ? `${format(weekDays[0], 'MMM d')} – ${format(weekDays[6], 'MMM d, yyyy')}`
              : format(current, 'MMMM yyyy')
            }
          </span>
          <button
            onClick={() => setCurrent(v => view === 'week' ? addDays(v, 7) : addMonths(v, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-all text-sm"
          >
            ›
          </button>
        </div>

        {/* Week view */}
        {view === 'week' && (
          <div className="grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-xs text-muted-foreground pb-1">{d}</div>
            ))}
            {weekDays.map(day => {
              const dayTasks = getTasksForDay(day)
              const isSelected = isSameDay(day, selected)
              const isTodayDay = isToday(day)
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelected(day)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl border transition-all
                    ${isSelected ? 'border-primary bg-primary/10' : 'border-transparent hover:border-border'}
                    ${isTodayDay ? 'font-medium' : ''}
                  `}
                >
                  <span className={`text-xs w-7 h-7 flex items-center justify-center rounded-full
                    ${isTodayDay ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </span>
                  <div className="flex flex-wrap gap-0.5 justify-center">
                    {dayTasks.slice(0, 3).map(t => (
                      <div
                        key={t.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: CATEGORIES[t.category]?.accent || '#888' }}
                      />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Month view */}
        {view === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-xs text-muted-foreground pb-1">{d}</div>
            ))}
            {paddedDays.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} />
              const dayTasks = getTasksForDay(day)
              const isSelected = isSameDay(day, selected)
              const isTodayDay = isToday(day)
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelected(day)}
                  className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl border transition-all
                    ${isSelected ? 'border-primary bg-primary/10' : 'border-transparent hover:border-border'}
                  `}
                >
                  <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full
                    ${isTodayDay ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Selected day tasks */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
            {isToday(selected) ? 'Today' : format(selected, 'EEEE, MMM d')} — {selectedTasks.length} tasks
          </p>
          {selectedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-sm">No tasks due on this day</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map(task => {
                const cat = CATEGORIES[task.category] || CATEGORIES.job
                return (
                  <div
                    key={task.id}
                    className={`p-3 border border-border rounded-xl bg-card flex items-center gap-3
                      ${task.status === 'done' ? 'opacity-50' : ''}`}
                  >
                    <div
                      className="w-2 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.accent }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.label}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border
                      ${task.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                        task.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'}`}>
                      {task.priority}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calendar