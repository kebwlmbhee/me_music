import { createApp } from 'vue';
import { db } from './firebaseConf.js';
import App from './App.vue';
import Chatroom from './chatroom.js';

// Create Vue app instance
// const vueApp = createApp(App);

// Vuetify
import 'vuetify/styles'
// add Vuetify icon
import iconFonts from '@/plugins/vuetify'

// 會影響 Vuetify
// import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(iconFonts)

app.mount('#app')
