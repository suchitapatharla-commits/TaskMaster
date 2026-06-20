import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, where
} from 'firebase/firestore'

const TaskContext = createContext(null)

export const TaskProvider = ({ children }) => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'tasks'), where('uid', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [user])

  const addTask = (task) => addDoc(collection(db, 'tasks'), {
    ...task,
    uid: user.uid,
    status: 'pending',
    subtasks: [],
    createdAt: new Date().toISOString(),
  })

  const editTask = (id, data) => updateDoc(doc(db, 'tasks', id), data)
  const deleteTask = (id) => deleteDoc(doc(db, 'tasks', id))
  const toggleStatus = (task) => updateDoc(doc(db, 'tasks', task.id), {
    status: task.status === 'done' ? 'pending' : 'done'
  })

  return (
    <TaskContext.Provider value={{ tasks, addTask, editTask, deleteTask, toggleStatus }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used inside TaskProvider')
  return context
}