import { createApp } from 'vue';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

import App from './App.vue';


// Firebase configuration
// Firebase 設定
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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase Realtime Database instance
const db = getDatabase(app);

// Create Vue app instance
const vueApp = createApp(App);

// Inject Firebase Realtime Database instance as $db
vueApp.config.globalProperties.$db = db;

// Mount Vue app
vueApp.mount('#app');

// Define component for listening to database changes
export default {
    created() {
      const chatroomRef = ref(this.$db, 'chatroom');
      onValue(chatroomRef, (snapshot) => {
        console.log(snapshot.val());
      });
    }
  }