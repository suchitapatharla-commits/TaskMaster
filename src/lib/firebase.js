import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyA4OicmoGAKRpWSeRWIyQyHAUyM6dP7Dvk",
  authDomain: "taskmaster-da6c7.firebaseapp.com",
  projectId: "taskmaster-da6c7",
  storageBucket: "taskmaster-da6c7.firebasestorage.app",
  messagingSenderId: "1094806069403",
  appId: "1:1094806069403:web:969bde28628d027096263e",
  measurementId: "G-Y9LYETCLR6"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()