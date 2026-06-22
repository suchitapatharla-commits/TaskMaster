import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, where, getDocs
} from 'firebase/firestore'

const TeamContext = createContext(null)

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const TeamProvider = ({ children }) => {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [activeTeam, setActiveTeam] = useState(null)
  const [teamTasks, setTeamTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // Listen to teams user is member of
  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'teams'),
      where('memberUids', 'array-contains', user.uid)
    )
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setTeams(data)
      if (data.length > 0 && !activeTeam) {
        setActiveTeam(data[0])
      }
      setLoading(false)
    })
    return unsub
  }, [user])

  // Listen to active team tasks
  useEffect(() => {
    if (!activeTeam) return
    const q = query(
      collection(db, 'team_tasks'),
      where('teamId', '==', activeTeam.id)
    )
    const unsub = onSnapshot(q, (snap) => {
      setTeamTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [activeTeam])

  const createTeam = async (name) => {
    const inviteCode = generateInviteCode()
    const team = await addDoc(collection(db, 'teams'), {
      name,
      inviteCode,
      adminUid: user.uid,
      adminName: user.displayName,
      adminPhoto: user.photoURL,
      memberUids: [user.uid],
      members: [{
        uid: user.uid,
        name: user.displayName,
        photo: user.photoURL,
        email: user.email,
        role: 'admin',
      }],
      createdAt: new Date().toISOString(),
    })
    return team
  }

  const joinTeam = async (inviteCode) => {
    const q = query(
      collection(db, 'teams'),
      where('inviteCode', '==', inviteCode.toUpperCase())
    )
    const snap = await getDocs(q)
    if (snap.empty) throw new Error('Invalid invite code')

    const teamDoc = snap.docs[0]
    const teamData = teamDoc.data()

    if (teamData.memberUids.includes(user.uid)) {
      throw new Error('You are already a member of this team')
    }

    await updateDoc(doc(db, 'teams', teamDoc.id), {
      memberUids: [...teamData.memberUids, user.uid],
      members: [...teamData.members, {
        uid: user.uid,
        name: user.displayName,
        photo: user.photoURL,
        email: user.email,
        role: 'member',
      }]
    })
  }

  const removeMember = async (teamId, memberUid) => {
    const teamRef = doc(db, 'teams', teamId)
    const team = teams.find(t => t.id === teamId)
    if (!team) return
    await updateDoc(teamRef, {
      memberUids: team.memberUids.filter(uid => uid !== memberUid),
      members: team.members.filter(m => m.uid !== memberUid),
    })
  }

  const deleteTeam = async (teamId) => {
    await deleteDoc(doc(db, 'teams', teamId))
    if (activeTeam?.id === teamId) setActiveTeam(null)
  }

  const addTeamTask = (task) => addDoc(collection(db, 'team_tasks'), {
    ...task,
    teamId: activeTeam.id,
    uid: user.uid,
    authorName: user.displayName,
    authorPhoto: user.photoURL,
    status: 'pending',
    createdAt: new Date().toISOString(),
  })

  const editTeamTask = (id, data) =>
    updateDoc(doc(db, 'team_tasks', id), data)

  const deleteTeamTask = (id) =>
    deleteDoc(doc(db, 'team_tasks', id))

  const toggleTeamTask = (task) =>
    updateDoc(doc(db, 'team_tasks', task.id), {
      status: task.status === 'done' ? 'pending' : 'done'
    })

  return (
    <TeamContext.Provider value={{
      teams,
      activeTeam,
      setActiveTeam,
      teamTasks,
      loading,
      createTeam,
      joinTeam,
      removeMember,
      deleteTeam,
      addTeamTask,
      editTeamTask,
      deleteTeamTask,
      toggleTeamTask,
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export const useTeam = () => {
  const context = useContext(TeamContext)
  if (!context) throw new Error('useTeam must be used inside TeamProvider')
  return context
}