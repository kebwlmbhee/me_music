// Why not createWebHistory? Spotify auth callback will not provide /#/ in URL
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CallbackView from '../views/CallbackView.vue'
import NotFoundView from '../views/NotFoundView.vue'

import Base from '../views/BaseView.vue'
import Explore from '../views/ExploreView.vue'
import ExploreSong from '../views/ExploreSongView.vue'
import ChatRoom from '../views/chatroom/ChatView.vue'
import MusicRecord from '../views/MusicRecord.vue'
import ChatLobby from '../components/SDJ/ChatLobby.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/Home',
      name: '大廳',
      component: Base,
      children: [
        { path: '', name: '大廳', component: ChatLobby },
        { path: 'Chat', name: '聊天室', component: ChatRoom },
        { path: 'MusicRecord', name: '我的音樂記錄', component: MusicRecord },
        { path: 'Explore', name: '探索', component: Explore },
        { path: 'ExploreSong', name: '探索歌單', component: ExploreSong }
      ]
    },
    {
      path: '/Where',
      name: 'Where',
      redirect: '/Home/Explore'
    },
    {
      path: '/callback',
      name: 'callback',
      component: CallbackView
    },
    {
      path: '/chatroom',
      name: 'chatroom',
      component: () => import('/src/views/chatroom/ChatroomView.vue')
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: () => import('/src/views/chatroom/HomepageView.vue')
    },
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView
    },
    // Redirect
    {
      path: '/login/:pathMatch(.*)*',
      redirect: {
        name: 'login'
      }
    },
    {
      path: '/UI',
      name: 'UItest',
      component: () => import('../components/SDJ/UI.vue'),
      children: [
        {
          path: '/UI/',
          name: 'Content',
          component: () => import('../components/SDJ/ChatLobby.vue')
        }
      ]
    }
  ]
})
export default router
