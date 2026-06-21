import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, where, orderBy
} from 'firebase/firestore'

const DiaryContext = createContext(null)

export const DiaryProvider = ({ children }) => {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'diary'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [user])

  const addEntry = (entry) => addDoc(collection(db, 'diary'), {
  ...entry,
  uid: user.uid,
  createdAt: new Date().toISOString(),
})

  const editEntry = (id, data) => updateDoc(doc(db, 'diary', id), data)
  const deleteEntry = (id) => deleteDoc(doc(db, 'diary', id))

  return (
    <DiaryContext.Provider value={{ entries, addEntry, editEntry, deleteEntry }}>
      {children}
    </DiaryContext.Provider>
  )
}

export const useDiary = () => {
  const context = useContext(DiaryContext)
  if (!context) throw new Error('useDiary must be used inside DiaryProvider')
  return context
}