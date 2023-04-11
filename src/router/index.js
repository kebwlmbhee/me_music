import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import ChatRoom from "../views/ChatView.vue"


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes:[{
      path:'/',
      name:'Home',
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
      name:'MusicRecord',
      redirect : '/'
    }
  ]
})

export default router
