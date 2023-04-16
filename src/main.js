import { createApp } from 'vue';
import { createPinia } from 'pinia'
import router from './router'
import { db } from './firebaseConf.js';
import App from './App.vue';
import Chatroom from './chatroom.js';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// add Vuetify icon
import iconFonts from '@/plugins/vuetify'

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

<<<<<<< HEAD
// Create Vue app instance
=======
>>>>>>> f9ad571daa834f7fdc15280f686fe1ca41f72459
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(iconFonts)

<<<<<<< HEAD
// Mount Vue app
=======
>>>>>>> f9ad571daa834f7fdc15280f686fe1ca41f72459
app.mount('#app')
