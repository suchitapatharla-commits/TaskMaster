import { useState } from 'react'
import Header from '../components/shared/Header'
import { useTeam } from '../context/TeamContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../lib/categories'

const SharedBoard = () => {
  const { user } = useAuth()
  const {
    teams, activeTeam, setActiveTeam, teamTasks, loading,
    createTeam, joinTeam, removeMember, deleteTeam,
    addTeamTask, editTeamTask, deleteTeamTask, toggleTeamTask
  } = useTeam()

  const [view, setView] = useState('board') // board | manage | join | create
  const [newTeamName, setNewTeamName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskCategory, setTaskCategory] = useState('creative')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [addingTask, setAddingTask] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)

  const isAdmin = activeTeam?.adminUid === user.uid
  const pending = teamTasks.filter(t => t.status !== 'done')
  const done = teamTasks.filter(t => t.status === 'done')

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return
    setError('')
    try {
      await createTeam(newTeamName)
      setNewTeamName('')
      setView('board')
      setSuccess('Team created!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) return
    setError('')
    try {
      await joinTeam(inviteCode)
      setInviteCode('')
      setView('board')
      setSuccess('Joined team successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return
    await addTeamTask({
      title: taskTitle,
      category: taskCategory,
      priority: taskPriority,
      dueDate: taskDueDate || null,
    })
    setTaskTitle('')
    setTaskCategory('creative')
    setTaskPriority('medium')
    setTaskDueDate('')
    setAddingTask(false)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTeam.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div>
        <Header title="CC Team" />
        <div className="p-4 text-center text-muted-foreground text-sm mt-8">
          Loading...
        </div>
      </div>
    )
  }

  // No teams yet
  if (teams.length === 0) {
    return (
      <div>
        <Header title="CC Team" />
        <div className="p-4 space-y-3">
          {error && <p className="text-xs text-red-500 p-3 bg-red-50 rounded-xl">{error}</p>}

          <div className="text-center py-8 text-muted-foreground">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-sm font-medium">No teams yet</p>
            <p className="text-xs mt-1">Create a team or join one with an invite code</p>
          </div>

          {view === 'create' ? (
            <div className="p-4 border border-primary rounded-xl bg-card space-y-3">
              <p className="text-sm font-medium">Create a team</p>
              <input
                autoFocus
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateTeam()}
                placeholder="Team name (e.g. Creative Custody)"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                <button onClick={handleCreateTeam} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                  Create
                </button>
                <button onClick={() => setView('board')} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground">
                  Cancel
                </button>
              </div>
            </div>
          ) : view === 'join' ? (
            <div className="p-4 border border-primary rounded-xl bg-card space-y-3">
              <p className="text-sm font-medium">Join a team</p>
              <input
                autoFocus
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleJoinTeam()}
                placeholder="Enter invite code"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary uppercase tracking-widest"
                maxLength={6}
              />
              <div className="flex gap-2">
                <button onClick={handleJoinTeam} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                  Join
                </button>
                <button onClick={() => setView('board')} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setView('create')}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
              >
                + Create team
              </button>
              <button
                onClick={() => setView('join')}
                className="flex-1 py-3 border border-border rounded-xl text-sm text-muted-foreground hover:border-primary transition-all"
              >
                Join with code
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Manage team view
  if (view === 'manage' && activeTeam) {
    return (
      <div>
        <Header title="Manage Team" />
        <div className="p-4 space-y-4">
          <button
            onClick={() => setView('board')}
            className="text-xs text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
          >
            ← Back to board
          </button>

          {/* Invite code */}
          {isAdmin && (
            <div className="p-4 border border-border rounded-xl bg-card space-y-2">
              <p className="text-sm font-medium">Invite code</p>
              <p className="text-xs text-muted-foreground">Share this code with teammates to join</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-mono font-bold tracking-widest flex-1">
                  {activeTeam.inviteCode}
                </p>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-accent transition-all"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Members */}
          <div className="p-4 border border-border rounded-xl bg-card space-y-3">
            <p className="text-sm font-medium">Members ({activeTeam.members?.length})</p>
            {activeTeam.members?.map(member => (
              <div key={member.uid} className="flex items-center gap-3">
                <img
                  src={member.photo}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {member.name}
                    {member.uid === user.uid && ' (you)'}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                {isAdmin && member.uid !== user.uid && (
                  <button
                    onClick={() => removeMember(activeTeam.id, member.uid)}
                    className="text-xs text-red-500 hover:text-red-600 border border-red-200 px-2 py-1 rounded-lg transition-all"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Switch or create new team */}
          <div className="p-4 border border-border rounded-xl bg-card space-y-3">
            <p className="text-sm font-medium">Your teams</p>
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => { setActiveTeam(team); setView('board') }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all
                  ${activeTeam?.id === team.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
              >
                <span className="text-sm">{team.name}</span>
                {team.adminUid === user.uid && (
                  <span className="text-xs text-muted-foreground">admin</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView('create')}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:border-primary transition-all"
            >
              + New team
            </button>
            <button
              onClick={() => setView('join')}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:border-primary transition-all"
            >
              Join team
            </button>
          </div>

          {/* Create team inline */}
          {view === 'create' && (
            <div className="p-4 border border-primary rounded-xl bg-card space-y-3">
              <input
                autoFocus
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="Team name"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
              />
              <div className="flex gap-2">
                <button onClick={handleCreateTeam} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Create</button>
                <button onClick={() => setView('manage')} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground">Cancel</button>
              </div>
            </div>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                if (window.confirm('Delete this team? This cannot be undone.')) {
                  deleteTeam(activeTeam.id)
                  setView('board')
                }
              }}
              className="w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition-all"
            >
              Delete team
            </button>
          )}
        </div>
      </div>
    )
  }

  // Main board view
  return (
    <div>
      <Header title={activeTeam?.name || 'CC Team'} />
      <div className="p-4 space-y-4">

        {success && (
          <p className="text-xs text-green-600 p-3 bg-green-50 rounded-xl">{success}</p>
        )}

        {/* Team info bar */}
        <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-card">
          <div className="flex items-center gap-2 flex-wrap">
            {activeTeam?.members?.slice(0, 4).map(m => (
              <img
                key={m.uid}
                src={m.photo}
                className="w-6 h-6 rounded-full"
                referrerPolicy="no-referrer"
                title={m.name}
              />
            ))}
            <span className="text-xs text-muted-foreground">
              {activeTeam?.members?.length} member{activeTeam?.members?.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={() => setView('manage')}
            className="text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-all"
          >
            Manage
          </button>
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
            <p className="text-2xl font-medium">{teamTasks.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total</p>
          </div>
        </div>

        {/* Add task — admin only */}
        {isAdmin && !addingTask && (
          <button
            onClick={() => setAddingTask(true)}
            className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Add team task
          </button>
        )}

        {isAdmin && addingTask && (
          <div className="p-4 border border-primary rounded-xl bg-card space-y-3">
            <input
              autoFocus
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTask()}
              placeholder="What needs to be done?"
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
            <input
              type="date"
              value={taskDueDate}
              onChange={e => setTaskDueDate(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
            />
            <div className="flex gap-2">
              <button onClick={handleAddTask} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                Add task
              </button>
              <button onClick={() => setAddingTask(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {teamTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-sm">No team tasks yet</p>
            {isAdmin
              ? <p className="text-xs mt-1">Add the first task above</p>
              : <p className="text-xs mt-1">The admin hasn't added any tasks yet</p>
            }
          </div>
        )}

        {/* Pending tasks */}
        <div className="space-y-2">
          {pending.map(task => {
            const cat = CATEGORIES[task.category] || CATEGORIES.creative
            return (
              <div key={task.id} className="p-4 border border-border rounded-xl bg-card">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTeamTask(task)}
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
                        <img src={task.authorPhoto} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                        <span className="text-xs text-muted-foreground">{task.authorName?.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => deleteTeamTask(task.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 text-xs flex-shrink-0"
                    >
                      🗑️
                    </button>
                  )}
                </div>
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
                    onClick={() => toggleTeamTask(task)}
                    className="w-5 h-5 rounded-full bg-primary border-primary border-2 flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-xs text-primary-foreground">✓</span>
                  </button>
                  <p className="text-sm line-through text-muted-foreground flex-1">{task.title}</p>
                  {isAdmin && (
                    <button
                      onClick={() => deleteTeamTask(task.id)}
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