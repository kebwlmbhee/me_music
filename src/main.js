import { createApp } from 'vue';
import { db } from './firebaseConf.js';
import App from './App.vue';
import Chatroom from './chatroom.js';

// Create Vue app instance
// const vueApp = createApp(App);

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// add Vuetify icon
import iconFonts from '@/plugins/vuetify'

const vuetify = createVuetify({
    components,
    directives,
})

// 會影響 Vuetify
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(iconFonts)

app.mount('#app')
