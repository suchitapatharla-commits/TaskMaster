import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy
} from 'firebase/firestore'

const CCContext = createContext(null)

export const CCProvider = ({ children }) => {
  const { user } = useAuth()
  const [sharedTasks, setSharedTasks] = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    if (!user) return

    // Listen to shared tasks
    const q = query(
      collection(db, 'cc_shared'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setSharedTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    // Register as member
    const memberRef = doc(db, 'cc_members', user.uid)
    import('firebase/firestore').then(({ setDoc, serverTimestamp }) => {
      setDoc(memberRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        lastSeen: new Date().toISOString(),
      }, { merge: true })
    })

    // Listen to members
    const membersUnsub = onSnapshot(
      collection(db, 'cc_members'),
      (snap) => {
        setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      }
    )

    return () => {
      unsub()
      membersUnsub()
    }
  }, [user])

  const addSharedTask = (task) => addDoc(collection(db, 'cc_shared'), {
    ...task,
    uid: user.uid,
    authorName: user.displayName,
    authorPhoto: user.photoURL,
    status: 'pending',
    subtasks: [],
    createdAt: new Date().toISOString(),
  })

  const editSharedTask = (id, data) =>
    updateDoc(doc(db, 'cc_shared', id), data)

  const deleteSharedTask = (id) =>
    deleteDoc(doc(db, 'cc_shared', id))

  const toggleSharedStatus = (task) =>
    updateDoc(doc(db, 'cc_shared', task.id), {
      status: task.status === 'done' ? 'pending' : 'done'
    })

  return (
    <CCContext.Provider value={{
      sharedTasks,
      members,
      addSharedTask,
      editSharedTask,
      deleteSharedTask,
      toggleSharedStatus,
    }}>
      {children}
    </CCContext.Provider>
  )
}

export const useCC = () => {
  const context = useContext(CCContext)
  if (!context) throw new Error('useCC must be used inside CCProvider')
  return context
}