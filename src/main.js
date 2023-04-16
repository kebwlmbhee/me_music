import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

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
