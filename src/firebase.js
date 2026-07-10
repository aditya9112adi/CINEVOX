import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDzCP4xpml7zyjgtXJ6z6gZqssIc2wb1LE",
  authDomain: "movies-app-auth-a8f8b.firebaseapp.com",
  projectId: "movies-app-auth-a8f8b",
  storageBucket: "movies-app-auth-a8f8b.firebasestorage.app",
  messagingSenderId: "1023188169374",
  appId: "1:1023188169374:web:4d518c96ea855a4b68818f",
  measurementId: "G-F2M9CR06GV"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth, RecaptchaVerifier, signInWithPhoneNumber }
