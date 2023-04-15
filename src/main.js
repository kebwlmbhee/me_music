import { createApp } from 'vue';
import { db } from './firebaseConf.js';
import App from './App.vue';
import Chatroom from './chatroom.js';

// Create Vue app instance
// const vueApp = createApp(App);

// Inject Firebase Realtime Database instance as $db
const chatroom = new Chatroom(db);
console.log(chatroom);

// Mount Vue app
createApp(App).mount('#app')