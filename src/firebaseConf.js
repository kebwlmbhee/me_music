import { initializeApp } from 'firebase/app'
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  remove,
  update,
  runTransaction,
  limitToFirst,
  get
} from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCnoF3pVGktFkrQ1vn6U6k-g8zMifrsFL4',
  authDomain: 'memusic-97d9b.firebaseapp.com',
  databaseURL: 'https://memusic-97d9b-default-rtdb.firebaseio.com',
  projectId: 'memusic-97d9b',
  storageBucket: 'memusic-97d9b.appspot.com',
  messagingSenderId: '285609111713',
  appId: '1:285609111713:web:77cb667268d9d2f9b880e0',
  measurementId: 'G-G9HCVQN5R9'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
let db = getDatabase(app)

export {
  firebaseConfig,
  app,
  auth,
  db,
  ref,
  push,
  remove,
  onValue,
  set,
  update,
  runTransaction,
  limitToFirst,
  get
}
