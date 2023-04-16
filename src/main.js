import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue';
import { createApp, markRaw } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// add Vuetify icon
import iconFonts from '@/plugins/vuetify'

// 會影響 Vuetify
import './assets/main.css'

const vuetify = createVuetify({
    components,
    directives,
})

// Create Vue app instance
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(iconFonts)

const pinia = createPinia();
// To allow using `this.router.xxx` in @/store/*.js
pinia.use(({ store }) => { store.router = markRaw(router) });


app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(iconFonts)
app.use(VueAxios, axios)

app.mount('#app')
