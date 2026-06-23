import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, where
} from 'firebase/firestore'

const CategoryContext = createContext(null)

const DEFAULT_CATEGORIES = [
  { name: 'Job', color: 'bg-blue-100 text-blue-800 border-blue-200', accent: '#378ADD' },
  { name: 'Creative Custody', color: 'bg-purple-100 text-purple-800 border-purple-200', accent: '#7F77DD' },
  { name: 'App Dev', color: 'bg-teal-100 text-teal-800 border-teal-200', accent: '#1D9E75' },
  { name: 'Research', color: 'bg-amber-100 text-amber-800 border-amber-200', accent: '#BA7517' },
  { name: 'Studying', color: 'bg-green-100 text-green-800 border-green-200', accent: '#639922' },
  { name: 'Free Time', color: 'bg-pink-100 text-pink-800 border-pink-200', accent: '#D4537E' },
  { name: 'Events', color: 'bg-orange-100 text-orange-800 border-orange-200', accent: '#D85A30' },
]

const COLOR_OPTIONS = [
  { label: 'Blue', color: 'bg-blue-100 text-blue-800 border-blue-200', accent: '#378ADD' },
  { label: 'Purple', color: 'bg-purple-100 text-purple-800 border-purple-200', accent: '#7F77DD' },
  { label: 'Teal', color: 'bg-teal-100 text-teal-800 border-teal-200', accent: '#1D9E75' },
  { label: 'Amber', color: 'bg-amber-100 text-amber-800 border-amber-200', accent: '#BA7517' },
  { label: 'Green', color: 'bg-green-100 text-green-800 border-green-200', accent: '#639922' },
  { label: 'Pink', color: 'bg-pink-100 text-pink-800 border-pink-200', accent: '#D4537E' },
  { label: 'Orange', color: 'bg-orange-100 text-orange-800 border-orange-200', accent: '#D85A30' },
  { label: 'Red', color: 'bg-red-100 text-red-800 border-red-200', accent: '#DC2626' },
  { label: 'Indigo', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', accent: '#4F46E5' },
  { label: 'Cyan', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', accent: '#0891B2' },
]

export { COLOR_OPTIONS }

export const CategoryProvider = ({ children }) => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'categories'),
      where('uid', '==', user.uid)
    )
    const unsub = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        // First time — seed defaults
        for (const cat of DEFAULT_CATEGORIES) {
          await addDoc(collection(db, 'categories'), {
            ...cat,
            uid: user.uid,
            createdAt: new Date().toISOString(),
          })
        }
      } else {
        setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      }
      setLoading(false)
    })
    return unsub
  }, [user])

  const addCategory = (cat) => addDoc(collection(db, 'categories'), {
    ...cat,
    uid: user.uid,
    createdAt: new Date().toISOString(),
  })

  const editCategory = (id, data) =>
    updateDoc(doc(db, 'categories', id), data)

  const deleteCategory = (id) =>
    deleteDoc(doc(db, 'categories', id))

  return (
    <CategoryContext.Provider value={{
      categories,
      loading,
      addCategory,
      editCategory,
      deleteCategory,
      COLOR_OPTIONS,
    }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = () => {
  const context = useContext(CategoryContext)
  if (!context) throw new Error('useCategories must be used inside CategoryProvider')
  return context
}