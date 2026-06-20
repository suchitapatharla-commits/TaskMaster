import Header from '../components/shared/Header'
import { useTasks } from '../context/TaskContext'
import { CATEGORIES } from '../lib/categories'
import { isThisWeek, isAfter, parseISO } from 'date-fns'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

const Insights = () => {
  const { tasks } = useTasks()

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const pendingTasks = tasks.filter(t => t.status !== 'done').length
  const overdueTasks = tasks.filter(t =>
    t.dueDate &&
    t.status !== 'done' &&
    isAfter(new Date(), parseISO(t.dueDate))
  ).length
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  // Tasks per category
  const categoryData = Object.entries(CATEGORIES).map(([key, cat]) => ({
    name: cat.label,
    total: tasks.filter(t => t.category === key).length,
    done: tasks.filter(t => t.category === key && t.status === 'done').length,
    color: cat.accent,
  })).filter(d => d.total > 0)

  // Tasks completed this week
  const thisWeekDone = tasks.filter(t =>
    t.status === 'done' && t.createdAt && isThisWeek(parseISO(t.createdAt))
  ).length

  return (
    <div>
      <Header title="Insights" />
      <div className="p-4 space-y-4">

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 border border-border rounded-xl bg-card">
            <p className="text-3xl font-medium">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-card">
            <p className="text-3xl font-medium">{thisWeekDone}</p>
            <p className="text-xs text-muted-foreground mt-1">Done this week</p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-card">
            <p className="text-3xl font-medium text-amber-500">{pendingTasks}</p>
            <p className="text-xs text-muted-foreground mt-1">Pending</p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-card">
            <p className={`text-3xl font-medium ${overdueTasks > 0 ? 'text-red-500' : ''}`}>
              {overdueTasks}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Overdue</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="p-4 border border-border rounded-xl bg-card space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall progress</span>
            <span className="text-muted-foreground">{completedTasks}/{totalTasks}</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Category breakdown chart */}
        {categoryData.length > 0 && (
          <div className="p-4 border border-border rounded-xl bg-card space-y-3">
            <p className="text-sm font-medium">Tasks by category</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} barSize={24}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Bar>
                <Bar dataKey="done" name="Done" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center">
              Light = total · Dark = completed
            </p>
          </div>
        )}

        {/* Category list breakdown */}
        <div className="p-4 border border-border rounded-xl bg-card space-y-3">
          <p className="text-sm font-medium">Breakdown</p>
          {categoryData.length === 0 && (
            <p className="text-sm text-muted-foreground">No tasks yet — add some!</p>
          )}
          {categoryData.map((cat, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{cat.name}</span>
                <span className="text-muted-foreground">{cat.done}/{cat.total}</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${cat.total ? (cat.done / cat.total) * 100 : 0}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {totalTasks === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-sm">Add tasks to see your insights!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Insights