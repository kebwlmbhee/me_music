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
import firebaseConfig from '/.firebase/firebaseInfo.js'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)

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
