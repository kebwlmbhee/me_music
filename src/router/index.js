// Why not createWebHistory? Spotify auth callback will not provide /#/ in URL
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CallbackView from '../views/CallbackView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/template',
      name: 'template',
      component: () => import('../views/TemplateView.vue'),
    },
    {
      path: '/login',
      name: "login",
      component: LoginView
    },
    {
      path: '/callback',
      name: "callback",
      component: CallbackView
    },
    {
      path: '/api_function',
      name: "api_function",
      component: () => import('../views/ApiFunctionView.vue'),
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
  ],
})

export default router
