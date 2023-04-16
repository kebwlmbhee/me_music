import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
// add Vuetify icon
import iconFonts from '@/plugins/vuetify'

// import './assets/main.css'

const pinia = createPinia();
// To allow using `this.router.xxx` in @/store/*.js
pinia.use(({ store }) => { store.router = markRaw(router) });

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(iconFonts)
app.use(VueAxios, axios)

app.mount('#app')
