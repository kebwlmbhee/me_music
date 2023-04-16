import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import ChatRoom from "../views/ChatView.vue"
import MusicRecord from "../views/MusicRecord.vue"
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes:[{
      path:'/',
      name:'大廳',
      component: Home
    },{
      path:'/Chat',
      name:'Chat',
      component: ChatRoom,
      props:true
    },{
      path:'/Where',
      name:'Where',
      redirect : '/'
    },{
      path:'/MusicRecord',
      name:'我的音樂記錄',
      component: MusicRecord,
    }
  ]
})
export default router
