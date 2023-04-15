import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

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
// import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(iconFonts)
app.use(VueAxios, axios)

app.mount('#app')
